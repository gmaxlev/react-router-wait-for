import { ShouldRevalidateFunction } from "react-router";

export type RouteComponent = (...args: any[]) => Promise<{
  readonly default: React.ComponentType<any>;
}>;

export interface ExtraRoute {
  path: string;
  waitFor?: () => Promise<unknown>;
  loader?: () => Promise<unknown>;
  shouldRevalidate?: ShouldRevalidateFunction;
  lazy: RouteComponent;
  children?: ExtraRoute[];
}

export type RouteState = {
  parent: RouteState | null;
  waitForPromise: Promise<unknown> | null;
};
