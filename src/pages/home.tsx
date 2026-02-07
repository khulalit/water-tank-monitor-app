import SensorOffline from "../components/sensor-offline";
import WaterTankMonitor from "../components/water-tank-moniter";
import { useTank } from "../context/tank-data";

export default function Dashboard() {
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
}
