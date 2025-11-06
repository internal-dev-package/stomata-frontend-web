import type { RouteObject } from "react-router-dom";
import HomeParentView from "../../app/home/home-parent-view";

export const HomeParentViewRoutes: RouteObject[] = [
  {
    path: "/home",
    element: <HomeParentView />,
  },
];
