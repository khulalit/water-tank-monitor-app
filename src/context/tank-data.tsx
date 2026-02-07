import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

interface TankStatus {
  level: number;
  alive: boolean;
}

interface TankContextType extends TankStatus {
  error: string | null;
}

const TankContext = createContext<TankContextType | undefined>(undefined);

export const TankProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<TankStatus>({ level: 0, alive: false });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Accessing Vite environment variables
    const apiKey = localStorage.getItem("tank_api_key");
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!apiKey) {
      setError("API Key missing in configuration");
      return;
    }

    // Create the connection using query params
    const es = new EventSource(`${baseUrl}/events?api_key=${apiKey}`);

    es.addEventListener("end-connection", () => {
      setState((prev) => ({ ...prev, alive: false }));
      console.log("Connection to water sensor lost.");
      es.close();
    });

    es.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setState({ level: data.level, alive: data.alive });
        setError(null);
      } catch (err) {
        console.error("Parse error:", err);
      }
    };

    es.onerror = () => {
      setError("Connection to water sensor lost.");
      setState((prev) => ({ ...prev, alive: false }));
    };

    return () => {
      es.close();
    };
  }, []);

  return (
    <TankContext.Provider value={{ ...state, error }}>
      {children}
    </TankContext.Provider>
  );
};

export const useTank = () => {
  const context = useContext(TankContext);
  if (!context) throw new Error("useTank must be used within TankProvider");
  return context;
};
