import { Outlet } from "react-router";
import { AuthProvider } from "./AuthContext";
import { Toaster } from "react-hot-toast";

export function RootLayout() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Outlet />
    </AuthProvider>
  );
}
