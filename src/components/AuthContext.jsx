import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem("colonel_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    // Mock authentication — accepts any non-empty credentials
    if (email && password) {
      const newUser = {
        name: "Admin User",
        email,
        role: "Administrator",
        initials: "AU",
      };
      setUser(newUser);
      sessionStorage.setItem("coloneltoken", JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("coloneltoken");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
