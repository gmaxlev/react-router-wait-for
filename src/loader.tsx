import { RouteObject, LoaderFunction } from "react-router-dom";
import { lazy, Suspense } from "react";
import { RouteState, ExtraRoute, RouteComponent } from "./types";

function handleExtraRoute(
  route: ExtraRoute,
  parent: RouteState | null
): RouteObject {
  // Create an object that holds a reference to the parent Promise and stores the Promise for the current route
  const target: RouteState = {
    parent,
    waitForPromise: null,
  };

  const Component = lazy(route.lazy);

  // Create a loader for React Router
  const reactRouterLoader: LoaderFunction = async () => {
    const routeWairForPromise = new Promise(async (resolve, reject) => {
      try {
        // ⛔️ first of all, we must first check if the parent promise is present and wait for it if it is.
        if (parent) {
          await parent.waitForPromise;
        }

        // ⛔️ next, we need to check if we should wait for ourselves
        if (route.waitFor) {
          await route.waitFor();
        }

        resolve(undefined);
      } catch (e) {
        reject(e);
      }
    });

    // ⛔️ save the Promise to the target so that it will be available in the children
    target.waitForPromise = routeWairForPromise;
    // ⛔️ Wait for this Promise before calling a loader for data fetching and loading the lazy component
    await target.waitForPromise;

    // Our target.waitForPromise may have changed because the user could have clicked on a link during the execution
    if (target.waitForPromise === routeWairForPromise) {
      target.waitForPromise = null;
    } else {
      return null;
    }

    // ⛔️ If a chunk has already been loaded, we will get a resolved Promise
    const lazyComponentPromise = route.lazy();

    lazyComponentPromise.then(() => {
      console.log(`* [${route.path}] component has been loaded`);
    });

    const paralellPromises: Array<Promise<unknown>> = [lazyComponentPromise];

    let dataForComponent = null;

    if (route.loader) {
      const loaderPromise = route.loader().then((value) => {
        dataForComponent = value === undefined ? null : value;
      });

      paralellPromises.push(loaderPromise);
    }

    // ⛔️ wait for the data to be fetched and the lazy component to be loaded
    await Promise.all(paralellPromises);

    // ⛔️ return the data for the route component
    return dataForComponent;
  };

  const handledChildren = route.children
    ? handleExtraRoutes(route.children, target)
    : [];

  return {
    path: route.path,
    loader: reactRouterLoader,
    children: handledChildren,
    ...(route.shouldRevalidate && {
      shouldRevalidate: route.shouldRevalidate,
    }),
    // ⛔️ Suspense will get the completely loaded component
    element: (
      <Suspense>
        <Component />
      </Suspense>
    ),
  };
}

export function handleExtraRoutes(
  routes: ExtraRoute[],
  parent: RouteState | null = null
): RouteObject[] {
  return routes.map((route) => handleExtraRoute(route, parent));
}
