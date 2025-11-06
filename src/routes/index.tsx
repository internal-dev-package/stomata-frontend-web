import { useRoutes } from "react-router-dom";
import { SplashScreenRoutes } from "./section/splash-screen";
import { AuthSigninRoutes } from "./section/auth-signin";
import { AuthSignupRoutes } from "./section/auth-signup";
import { HomeParentViewRoutes } from "./section/home-parent-view";

function AppRoutes() {
  const routes = useRoutes([
    ...SplashScreenRoutes,
    ...AuthSigninRoutes,
    ...AuthSignupRoutes,
    ...HomeParentViewRoutes,
  ]);

  return routes;
}

export default AppRoutes;
