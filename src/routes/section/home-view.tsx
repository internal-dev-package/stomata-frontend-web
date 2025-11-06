import type { RouteObject } from "react-router-dom";
import HomeParentView from "../../app/home/home-parent-view";

export const HomeViewRoutes: RouteObject[] = [
  {
    path: "/home",
    element: <HomeParentView />,
  },
];
