import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import "./style.css";
import { handleExtraRoutes } from "./loader";
import { fetch } from "./utils";

const shouldRevalidateTrue = () => true;
const shouldRevalidateFalse = () => false;

const routes = handleExtraRoutes([
  {
    path: "/",
    lazy: () => import("./pages/Home"),
    async loader() {
      console.log("1", "[/] start loader (500)");
      await fetch(500);
      console.log("2", "[/] end loader (500)");
    },
  },
  {
    path: "/error",
    lazy: () => import("./pages/Error"),
  },
  {
    path: "/a",
    lazy: () => import("./pages/A"),
    waitFor: async () => {
      console.log("3", "[/a] start waitFor (1000)");
      await fetch(1000);
      // ⛔️ uncomment to see behaviour
      // throw redirect('/error');
      console.log("4", "[/a] end waitFor (1000)");
    },
    async loader() {
      console.log("5", "[/a] start loader (1000)");
      await fetch(500);
      console.log("6", "[/a] end loader (1000)");
    },
    children: [
      {
        path: "b",
        // ⛔️ uncomment to see behaviour
        // shouldRevalidate: shouldRevalidateTrue,
        waitFor: async () => {
          console.log("7", "[/a/b] start waitFor (3000)");
          await fetch(3000);
          // ⛔️ uncomment to see behaviour
          // throw redirect('/error');
          console.log("8", "[/a/b] end waitFor (3000)");
        },
        async loader() {
          console.log("9", "[/a/b] start loader (1000)");
          await fetch(1000);
          console.log("10", "[/a/b] end loader (1000)");
        },
        lazy: () => import("./pages/B"),
        children: [
          {
            path: "c",
            async loader() {
              console.log("11", "[/a/b/c] start loader (500)");
              await fetch(500);
              console.log("12", "[/a/b/c] end loader (500)");
            },
            lazy: () => import("./pages/C"),
          },
        ],
      },
    ],
  },
]);

const browserRoutes = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    <h1 className="header">React Router with waitFor</h1>
    <div className="about">
      <p>
        This is an experiment with React Router v6. It allows you to describe
        routes with the <b>waitFor</b> option, which blocks calling child
        loaders until their parent <b>waitFor</b> promise has been resolved. If
        the <b>waitFor</b> promise throws a redirect,{" "}
        <b>the child loaders and their lazy components won't be loaded.</b>
      </p>
      <p>
        Check the <i>console</i> to track the router's execution
      </p>
    </div>

    <RouterProvider router={browserRoutes} />
  </div>
);
