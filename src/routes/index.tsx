import { useRoutes } from "react-router-dom";
import { SplashScreenRoutes } from "./section/splash-screen";
import { AuthSigninRoutes } from "./section/auth-signin";
import { AuthSignupRoutes } from "./section/auth-signup";
import { HomeViewRoutes } from "./section/home-view";

function AppRoutes() {
  const routes = useRoutes([
    ...SplashScreenRoutes,
    ...AuthSigninRoutes,
    ...AuthSignupRoutes,
    ...HomeViewRoutes,
  ]);

  return routes;
}

export default AppRoutes;
