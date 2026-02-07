import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

/* -----------------------------
   Types
--------------------------------*/

export interface TankConfig {
  username: string | null;
  apiKey: string;
  tankHeight: number;
  tankVolume: number;
  fullGap: number;
}

interface AuthContextType {
  config: TankConfig | null;
  login: (config: TankConfig) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

/* -----------------------------
   Storage Key
--------------------------------*/

const STORAGE_KEY = "tank-config";

/* -----------------------------
   Context
--------------------------------*/

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* -----------------------------
   Provider
--------------------------------*/

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<TankConfig | null>(null);

  // Hydrate on load
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (raw) {
      try {
        setConfig(JSON.parse(raw));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const login = (cfg: TankConfig) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
    setConfig(cfg);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setConfig(null);
  };

  const isAuthenticated = !!config?.apiKey;

  return (
    <AuthContext.Provider
      value={{
        config,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* -----------------------------
   Hook
--------------------------------*/

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
