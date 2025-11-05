import type { RouteObject } from "react-router-dom";
import AuthSignInView from "../../app/auth/auth-signin-view";

export const AuthSigninRoutes: RouteObject[] = [
  {
    path: "/auth-signin",
    element: <AuthSignInView />,
  },
];
