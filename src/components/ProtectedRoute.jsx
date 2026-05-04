import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

export function ProtectedRoute() {
  const token = localStorage.getItem("coloneltoken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
