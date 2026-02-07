import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  use,
} from "react";
import {
  type BuzzerContextType,
  type BuzzerConfig,
  type AlertEvent,
} from "./types";

// Create context with default values
const BuzzerContext = createContext<BuzzerContextType | undefined>(undefined);

// Default configuration
const defaultConfig: BuzzerConfig = {
  soundEnabled: true,
  vibrationEnabled: true,
  notificationEnabled: true,
  backgroundCheckInterval: 1,
  volume: 0.8,
};

export const BuzzerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [config, setConfig] = useState<BuzzerConfig>(defaultConfig);
  const [recentAlerts, setRecentAlerts] = useState<AlertEvent[]>([]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const serviceWorkerRef = useRef<ServiceWorkerRegistration | null>(null);
  const backgroundCheckIntervalRef = useRef<any | null>(null);

  // Check browser support
  useEffect(() => {
    const checkSupport = () => {
      const supportsNotifications = "Notification" in window;
      const supportsAudio = !!document.createElement("audio").canPlayType;
      const supportsVibration = "vibrate" in navigator;
      const supportsServiceWorker = "serviceWorker" in navigator;

      setIsSupported(supportsNotifications && supportsAudio);

      // Initialize audio element
      if (supportsAudio) {
        audioRef.current = new Audio();
        audioRef.current.volume = config.volume;

        // Preload a default buzzer sound
        audioRef.current.src = "/sounds/buzzer.mp3";
        audioRef.current.load();
      }

      // Check existing permission
      if (supportsNotifications) {
        setIsPermissionGranted(Notification.permission === "granted");
      }

      // Register service worker if supported
      if (supportsServiceWorker && "serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            serviceWorkerRef.current = reg;
            console.log("Service Worker registered");
          })
          .catch((err) =>
            console.error("Service Worker registration failed:", err)
          );
      }
    };

    checkSupport();

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      stopBackgroundChecking();
    };
  }, []);

  // Update audio volume when config changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = config.volume;
    }
  }, [config.volume]);

  // Play sound
  const playSound = useCallback(async () => {
    if (!config.soundEnabled || !audioRef.current) return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (error) {
      console.error("Failed to play sound:", error);
      // Fallback to built-in audio
      const fallbackAudio = new Audio(
        "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAZGF0YQ"
      );
      fallbackAudio.volume = config.volume;
      await fallbackAudio.play();
    }
  }, [config.soundEnabled]);

  // Vibrate
  const vibrate = useCallback(() => {
    if (!config.vibrationEnabled || !("vibrate" in navigator)) return;

    try {
      // Different patterns based on priority
      navigator.vibrate([200, 100, 200, 100, 200]);
    } catch (error) {
      console.error("Vibration failed:", error);
    }
  }, [config.vibrationEnabled]);

  // Show notification
  const showNotification = useCallback(
    async (title: string, message: string) => {
      if (!config.notificationEnabled || !isPermissionGranted) return;

      try {
        // Try service worker notification first
        if (serviceWorkerRef.current) {
          serviceWorkerRef.current.showNotification(title, {
            body: message,
            icon: "/icons/icon-192.png",
            badge: "/icons/badge.png",
            requireInteraction: true,
            tag: "buzzer-alert",
            data: { timestamp: Date.now() },
          });
        } else {
          // Fallback to regular notification
          new Notification(title, {
            body: message,
            icon: "/icons/icon-192.png",
            requireInteraction: true,
          });
        }
      } catch (error) {
        console.error("Notification failed:", error);
      }
    },
    [config.notificationEnabled, isPermissionGranted]
  );

  // Main alert trigger
  const triggerAlert = useCallback(
    async (
      title: string,
      message: string = "Alert triggered",
      priority: AlertEvent["priority"] = "medium"
    ) => {
      const alertEvent: AlertEvent = {
        id: Date.now().toString(),
        title,
        message,
        timestamp: new Date(),
        priority,
      };

      // Add to recent alerts (keep only last 50)
      setRecentAlerts((prev) => [alertEvent, ...prev.slice(0, 49)]);

      // Play sound if app is active
      if (document.visibilityState === "visible") {
        if (config.soundEnabled) await playSound();
        if (config.vibrationEnabled) vibrate();
      }

      // Always try to show notification (works in background)
      if (config.notificationEnabled) {
        await showNotification(title, message);
      }

      // Trigger custom event for other components
      window.dispatchEvent(
        new CustomEvent("buzzerAlert", { detail: alertEvent })
      );
    },
    [config, playSound, vibrate, showNotification]
  );

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!("Notification" in window)) return false;

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      setIsPermissionGranted(granted);

      // Also request audio context permission on iOS
      if (granted && "AudioContext" in window) {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContext();
        if (audioContext.state === "suspended") {
          await audioContext.resume();
        }
      }

      return granted;
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }, []);

  // Background checking (simulated - would connect to your backend)
  const startBackgroundChecking = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return;

    try {
      // Register periodic background sync
      if ("periodicSync" in (navigator as any) && serviceWorkerRef.current) {
        const registration = await navigator.serviceWorker.ready;
        await (registration as any).periodicSync.register("check-alerts", {
          minInterval: config.backgroundCheckInterval * 60 * 1000,
        });
      }

      // Fallback: Simulate polling (for demo)
      backgroundCheckIntervalRef.current = setInterval(async () => {
        try {
          // Replace with your actual API call
          const response = await fetch("/api/check-alerts");
          const data = await response.json();

          if (data.hasAlert) {
            await triggerAlert("Background Alert", data.message);
          }
        } catch (error) {
          console.error("Background check failed:", error);
        }
      }, config.backgroundCheckInterval * 60 * 1000);

      setIsActive(true);
    } catch (error) {
      console.error("Failed to start background checking:", error);
    }
  }, [config.backgroundCheckInterval, triggerAlert]);

  const stopBackgroundChecking = useCallback(() => {
    if (backgroundCheckIntervalRef.current) {
      clearInterval(backgroundCheckIntervalRef.current);
      backgroundCheckIntervalRef.current = null;
    }

    // Unregister periodic sync
    if ("periodicSync" in (navigator as any) && serviceWorkerRef.current) {
      (serviceWorkerRef.current as any).ready.then((registration: any) => {
        (registration as any).periodicSync.unregister("check-alerts");
      });
    }

    setIsActive(false);
  }, []);

  const updateConfig = useCallback(
    (newConfig: Partial<BuzzerConfig>) => {
      setConfig((prev: any) => ({ ...prev, ...newConfig }));

      // Persist to localStorage
      localStorage.setItem(
        "buzzerConfig",
        JSON.stringify({ ...config, ...newConfig })
      );
    },
    [config]
  );

  const clearAlerts = useCallback(() => {
    setRecentAlerts([]);
  }, []);

  // Load saved config
  useEffect(() => {
    const savedConfig = localStorage.getItem("buzzerConfig");
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        setConfig((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error("Failed to parse saved config:", error);
      }
    }
  }, []);

  // Auto-request permission on user interaction
  useEffect(() => {
    const handleUserInteraction = async () => {
      if (!isPermissionGranted && isSupported) {
        // Wait a moment for app to initialize
        setTimeout(() => {
          requestPermission();
        }, 1000);
      }
    };

    // Request on first user interaction
    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, [isPermissionGranted, isSupported, requestPermission]);

  const value: BuzzerContextType = {
    isSupported,
    isPermissionGranted,
    isActive,
    config,
    recentAlerts,
    triggerAlert,
    requestPermission,
    startBackgroundChecking,
    stopBackgroundChecking,
    updateConfig,
    clearAlerts,
  };

  return (
    <BuzzerContext.Provider value={value}>
      {children}

      {/* Hidden audio element for better iOS support */}
      <audio
        id="buzzer-audio"
        preload="auto"
        style={{ display: "none" }}
        src="/sounds/buzzer.mp3"
      />
    </BuzzerContext.Provider>
  );
};

export const useBuzzer = () => {
  const context = use(BuzzerContext);

  if (context === undefined) {
    throw new Error("useBuzzer must be used within a BuzzerProvider");
  }

  return context;
};
