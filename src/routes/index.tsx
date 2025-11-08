import { useRoutes } from "react-router-dom";
import { SplashScreenRoutes } from "./section/splash-screen";
import { AuthSigninRoutes } from "./section/auth-signin";
import { AuthSignupRoutes } from "./section/auth-signup";
import { HomeParentViewRoutes } from "./section/home-parent-view";
import { LandViewRoutes } from "./section/land-view";

function AppRoutes() {
  const routes = useRoutes([
    ...SplashScreenRoutes,
    ...AuthSigninRoutes,
    ...AuthSignupRoutes,
    ...HomeParentViewRoutes,
    ...LandViewRoutes
  ]);

  return routes;
}

export default AppRoutes;
