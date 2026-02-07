import React, { useState } from "react";
import { useBuzzer } from "../context/buzzer-alert";

export const BuzzerControls: React.FC = () => {
  const {
    isSupported,
    isPermissionGranted,
    isActive,
    config,
    triggerAlert,
    requestPermission,
    startBackgroundChecking,
    stopBackgroundChecking,
    updateConfig,
    recentAlerts,
    clearAlerts,
  } = useBuzzer();

  const [testMessage, setTestMessage] = useState("Test Alert!");

  if (!isSupported) {
    return (
      <div className="buzzer-warning">
        ⚠️ Buzzer alerts not supported in this browser
      </div>
    );
  }

  return (
    <div className="buzzer-controls">
      <div className="status">
        <div>
          Permission: {isPermissionGranted ? "✅ Granted" : "❌ Not Granted"}
        </div>
        <div>Background: {isActive ? "✅ Active" : "❌ Inactive"}</div>
      </div>

      {!isPermissionGranted && (
        <button className="btn-permission" onClick={requestPermission}>
          🔔 Enable Notifications
        </button>
      )}

      <div className="test-section">
        <input
          type="text"
          value={testMessage}
          onChange={(e) => setTestMessage(e.target.value)}
          placeholder="Enter alert message"
        />
        <button
          className="btn-test"
          onClick={() => triggerAlert("Test", testMessage, "high")}
        >
          🔊 Test Buzzer
        </button>
      </div>

      <div className="config-section">
        <h4>Settings</h4>

        <label>
          <input
            type="checkbox"
            checked={config.soundEnabled}
            onChange={(e) => updateConfig({ soundEnabled: e.target.checked })}
          />
          Enable Sound
        </label>

        <label>
          <input
            type="checkbox"
            checked={config.vibrationEnabled}
            onChange={(e) =>
              updateConfig({ vibrationEnabled: e.target.checked })
            }
          />
          Enable Vibration
        </label>

        <label>
          <input
            type="checkbox"
            checked={config.notificationEnabled}
            onChange={(e) =>
              updateConfig({ notificationEnabled: e.target.checked })
            }
          />
          Enable Notifications
        </label>

        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.volume}
            onChange={(e) =>
              updateConfig({ volume: parseFloat(e.target.value) })
            }
          />
          {Math.round(config.volume * 100)}%
        </label>

        <label>
          Background Check (minutes):
          <input
            type="number"
            min="1"
            max="60"
            value={config.backgroundCheckInterval}
            onChange={(e) =>
              updateConfig({
                backgroundCheckInterval: parseInt(e.target.value),
              })
            }
          />
        </label>
      </div>

      <div className="background-controls">
        {isActive ? (
          <button className="btn-stop" onClick={stopBackgroundChecking}>
            ⏹️ Stop Background Checking
          </button>
        ) : (
          <button
            className="btn-start"
            onClick={startBackgroundChecking}
            disabled={!isPermissionGranted}
          >
            ▶️ Start Background Checking
          </button>
        )}
      </div>

      {recentAlerts.length > 0 && (
        <div className="recent-alerts">
          <h4>Recent Alerts ({recentAlerts.length})</h4>
          <button onClick={clearAlerts}>Clear</button>
          <ul>
            {recentAlerts.slice(0, 5).map((alert: any) => (
              <li key={alert.id}>
                <strong>{alert.title}</strong>: {alert.message}
                <small>{alert.timestamp.toLocaleTimeString()}</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
