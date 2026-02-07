import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./auth-context";

/* -----------------------------
   Types
--------------------------------*/

interface TankStatus {
  percentage: number;
  distance: number;
  volume: number;
  alive: boolean;
  lastSeen: number;
}

interface TankContextType extends TankStatus {
  error: string | null;
  reconnecting: boolean;
}

/* -----------------------------
   Context
--------------------------------*/

const TankContext = createContext<TankContextType | undefined>(undefined);

/* -----------------------------
   Provider
--------------------------------*/

export const TankProvider = ({ children }: { children: ReactNode }) => {
  const { config, isAuthenticated } = useAuth();

  const [state, setState] = useState<TankStatus>({
    percentage: 0,
    distance: 0,
    volume: 0,
    alive: false,
    lastSeen: 0,
  });

  const [error, setError] = useState<string | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<any>(null);

  useEffect(() => {
    if (!isAuthenticated || !config) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const connect = () => {
      if (esRef.current) {
        esRef.current.close();
      }

      setReconnecting(true);

      const params = new URLSearchParams({
        api_key: config.apiKey,
        tankHeight: String(config.tankHeight),
        totalVolume: String(config.tankVolume),
        fullGap: String(config.fullGap),
      });

      const es = new EventSource(`${baseUrl}/events?${params.toString()}`);
      esRef.current = es;

      es.onopen = () => {
        setError(null);
        setReconnecting(false);
      };

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          setState({
            percentage: data.percentage,
            distance: data.distance,
            volume: data.volume,
            alive: data.alive,
            lastSeen: data.lastSeen,
          });
        } catch (err) {
          console.error("SSE parse error", err);
        }
      };

      es.addEventListener("offline", () => {
        setState((prev) => ({ ...prev, alive: false }));
      });

      es.addEventListener("timeout", () => {
        setError("Connection timed out");
        cleanup();
        scheduleReconnect();
      });

      es.onerror = () => {
        setError("Connection lost");
        cleanup();
        scheduleReconnect();
      };
    };

    const scheduleReconnect = () => {
      if (retryRef.current) return;

      retryRef.current = setTimeout(() => {
        retryRef.current = null;
        connect();
      }, 3000);
    };

    const cleanup = () => {
      esRef.current?.close();
      esRef.current = null;
    };

    connect();

    return () => {
      cleanup();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [isAuthenticated, config]);

  return (
    <TankContext.Provider
      value={{
        ...state,
        error,
        reconnecting,
      }}
    >
      {children}
    </TankContext.Provider>
  );
};

/* -----------------------------
   Hook
--------------------------------*/

export const useTank = () => {
  const context = useContext(TankContext);

  if (!context) {
    throw new Error("useTank must be used within TankProvider");
  }

  return context;
};
