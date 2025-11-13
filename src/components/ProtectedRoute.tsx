import { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { getStoredUser } from "@/lib/auth";

interface ProtectedRouteProps {
  children: ReactElement;
  redirectTo?: string;
}

export const ProtectedRoute = ({ children, redirectTo = "/" }: ProtectedRouteProps) => {
  const user = getStoredUser();

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};
