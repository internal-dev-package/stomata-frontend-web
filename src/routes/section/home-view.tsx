import type { RouteObject } from "react-router-dom";
import HomeView from "../../app/home/home-view";

export const HomeViewRoutes: RouteObject[] = [
  {
    path: "/home",
    element: <HomeView />,
  },
];
