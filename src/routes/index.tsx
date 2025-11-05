import { useRoutes } from "react-router-dom";
import { SplashScreenRoutes } from "./section/splash-screen";

function AppRoutes() {
  const routes = useRoutes([...SplashScreenRoutes]);

  return routes;
}

export default AppRoutes;
