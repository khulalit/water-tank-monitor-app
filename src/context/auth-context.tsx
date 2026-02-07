import { createContext, useContext, useState, type ReactNode } from "react";
import { redirect } from "react-router";

interface AuthContextType {
  apiKey: string | null;
  username: string | null;
  login: (username: string, apiKey: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [apiKey, setApiKey] = useState<string | null>(
    localStorage.getItem("tank_api_key")
  );
  const [username, setUsername] = useState<string | null>(
    localStorage.getItem("tank_username")
  );

  const login = (user: string, key: string) => {
    localStorage.setItem("tank_api_key", key);
    localStorage.setItem("tank_username", user);
    setApiKey(key);
    setUsername(user);
  };

  const logout = () => {
    localStorage.removeItem("tank_api_key");
    localStorage.removeItem("tank_username");
    setApiKey(null);
    setUsername(null);
  };

  const isAuthenticated = !!apiKey;

  if (isAuthenticated) {
    redirect("/");
  } else {
    redirect("/login");
  }
  return (
    <AuthContext.Provider
      value={{ apiKey, username, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
