import SensorOffline from "../components/sensor-offline";
import WaterTankMonitor from "../components/water-tank-moniter";
import { useTank } from "../context/tank-data";

export default function Dashboard() {
  const { level, alive } = useTank();
  if (alive === false) return <SensorOffline />;
  return <WaterTankMonitor levelPercent={level} totalCapacity={1000} />;
}
