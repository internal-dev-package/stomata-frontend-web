import type { RouteObject } from "react-router-dom";
import SplashScreenView from "../../app/splashscreen/splashscreen-view";

export const SplashScreenRoutes: RouteObject[] = [
  {
    path: "/",
    element: <SplashScreenView />,
  },
];
