import type { RouteObject } from "react-router-dom";
import AuthSignUpView from "../../app/auth/auth-signup-view";

export const AuthSignupRoutes: RouteObject[] = [
  {
    path: "/auth-signup",
    element: <AuthSignUpView />,
  },
];
