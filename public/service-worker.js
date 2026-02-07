// Cache name
const CACHE_NAME = "buzzer-v1";
const BUZZER_SOUND = "/sounds/buzzer.mp3";

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) =>
        cache.addAll([BUZZER_SOUND, "/icons/icon-192.png", "/icons/badge.png"])
      )
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});

// Push notification event
self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() || "Buzzer Alert!",
    icon: "/icons/icon-192.png",
    badge: "/icons/badge.png",
    vibrate: [200, 100, 200],
    requireInteraction: true,
    tag: "buzzer-alert",
    data: {
      timestamp: Date.now(),
    },
  };

  event.waitUntil(self.registration.showNotification("Buzzer Alert", options));
});

// Notification click event
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Focus existing window or open new one
        for (const client of clientList) {
          if (client.url === "/" && "focus" in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow("/");
        }
      })
  );
});

// Periodic sync for background checking
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-alerts") {
    event.waitUntil(checkForAlerts());
  }
});

// Background check function
async function checkForAlerts() {
  try {
    const response = await fetch("/api/check-alerts", {
      headers: {
        "Cache-Control": "no-cache",
      },
    });

    if (!response.ok) throw new Error("Check failed");

    const data = await response.json();

    if (data.hasAlert) {
      // Show notification
      await self.registration.showNotification("Background Alert", {
        body: data.message || "New alert detected",
        icon: "/icons/icon-192.png",
        vibrate: [200, 100, 200],
        requireInteraction: true,
        tag: "background-alert",
      });

      // Send message to all clients
      const clients = await self.clients.matchAll();
      clients.forEach((client) => {
        client.postMessage({
          type: "BACKGROUND_ALERT",
          data,
        });
      });
    }
  } catch (error) {
    console.error("Background check error:", error);
  }
}
