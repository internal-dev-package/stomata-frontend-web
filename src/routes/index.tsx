import { useRoutes } from "react-router-dom";
import { SplashScreenRoutes } from "./section/splash-screen";
import { AuthSigninRoutes } from "./section/auth-signin";

function AppRoutes() {
  const routes = useRoutes([...SplashScreenRoutes, ...AuthSigninRoutes]);

  return routes;
}

export default AppRoutes;
