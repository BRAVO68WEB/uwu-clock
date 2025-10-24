const CACHE_NAME = "uwu-clock-v4";
const STATIC_CACHE = "uwu-clock-static-v4";
const DYNAMIC_CACHE = "uwu-clock-dynamic-v4";

// Assets to cache immediately - only files that actually exist
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/offline.html",
  "/cat-meow-1-fx-306178.mp3",
  "/image.png",
  "/robots.txt",
  "/main.js",
  "/assets/main.css",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("Service Worker: Static assets cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Service Worker: Error caching static assets", error);
      }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log("Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("Service Worker: Activated");
        return self.clients.claim();
      }),
  );
});

// Fetch event - handle all requests with improved caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and chrome-extension requests
  if (request.method !== "GET" || url.protocol === "chrome-extension:") {
    return;
  }

  // Skip Vite HMR and dev server requests
  if (
    url.pathname.includes("/@vite/") ||
    url.pathname.includes("/@fs/") ||
    url.searchParams.has("import")
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // If we have a cached response, return it
      if (cachedResponse) {
        console.log("Service Worker: Serving from cache:", request.url);
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Only cache successful responses
          if (response && response.status === 200) {
            const responseClone = response.clone();

            // Cache static assets in static cache, others in dynamic cache
            const cacheToUse = STATIC_ASSETS.some(
              (asset) =>
                request.url.endsWith(asset) || request.url.includes(asset),
            )
              ? STATIC_CACHE
              : DYNAMIC_CACHE;

            caches.open(cacheToUse).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch((error) => {
          console.log(
            "Service Worker: Network request failed:",
            request.url,
            error,
          );

          // For navigation requests, return the cached index.html
          if (
            request.mode === "navigate" ||
            request.destination === "document"
          ) {
            return caches.match("/index.html").then((response) => {
              return response || caches.match("/");
            });
          }

          // For other resources, return a basic offline response
          return new Response("Offline - Resource not available", {
            status: 503,
            statusText: "Service Unavailable",
            headers: new Headers({
              "Content-Type": "text/plain",
            }),
          });
        });
    }),
  );
});

// Handle background sync for when connection is restored
self.addEventListener("sync", (event) => {
  console.log("Service Worker: Background sync triggered");
  if (event.tag === "background-sync") {
    event.waitUntil(console.log("Service Worker: Performing background sync"));
  }
});

// Handle push notifications (for future use)
self.addEventListener("push", (event) => {
  console.log("Service Worker: Push notification received");
});
