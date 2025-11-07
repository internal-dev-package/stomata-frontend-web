import type { RouteObject } from "react-router-dom";
import LandView from "../../app/land/land-view";

export const LandViewRoutes: RouteObject[] = [
  {
    path: "/lands",
    element: <LandView />,
  },
];
