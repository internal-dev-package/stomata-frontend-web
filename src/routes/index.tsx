import { useRoutes } from "react-router-dom";
import { SplashScreenRoutes } from "./section/splash-screen";
import { AuthSigninRoutes } from "./section/auth-signin";
import { AuthSignupRoutes } from "./section/auth-signup";

function AppRoutes() {
  const routes = useRoutes([
    ...SplashScreenRoutes,
    ...AuthSigninRoutes,
    ...AuthSignupRoutes,
  ]);

  return routes;
}

export default AppRoutes;
