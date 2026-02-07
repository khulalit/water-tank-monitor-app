export interface BuzzerConfig {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  notificationEnabled: boolean;
  backgroundCheckInterval: number; // in minutes
  volume: number; // 0-1
}

export interface AlertEvent {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  priority: "low" | "medium" | "high";
  data?: Record<string, any>;
}

export interface BuzzerContextType {
  // State
  isSupported: boolean;
  isPermissionGranted: boolean;
  isActive: boolean;
  config: BuzzerConfig;
  recentAlerts: AlertEvent[];

  // Methods
  triggerAlert: (
    title: string,
    message?: string,
    priority?: AlertEvent["priority"]
  ) => Promise<void>;
  requestPermission: () => Promise<boolean>;
  startBackgroundChecking: () => Promise<void>;
  stopBackgroundChecking: () => void;
  updateConfig: (config: Partial<BuzzerConfig>) => void;
  clearAlerts: () => void;
}
