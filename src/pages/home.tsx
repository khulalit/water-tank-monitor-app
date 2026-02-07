import { useNavigate } from "react-router";
import SensorOffline from "../components/sensor-offline";
import WaterTankMonitor from "../components/water-tank-moniter";
import { useAuth } from "../context/auth-context";
import { useTank } from "../context/tank-data";

export default function Dashboard() {
<<<<<<< Updated upstream
  const { level, alive } = useTank();
  if (alive === false) return <SensorOffline />;
  return <WaterTankMonitor levelPercent={level} totalCapacity={1000} />;
=======
  const navigate = useNavigate();

  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    navigate("/login");
  }
  const { percentage, volume, alive, error, reconnecting } = useTank();

  // Connection lost
  if (!alive && error) {
    return <SensorOffline />;
  }

  // Waiting for first data / reconnecting
  if (reconnecting) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Reconnecting to tank sensor...
      </div>
    );
  }

  return (
    <WaterTankMonitor
      levelPercent={percentage}
      currentVolume={volume}
      isAlive={alive}
    />
  );
>>>>>>> Stashed changes
}
