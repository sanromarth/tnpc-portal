const CACHE_NAME = "tnpc-portal-v6";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/about.html",
  "/contact.html",
  "/certifications.html",
  "/placements.html",
  "/mous.html",
  "/recruiter.html",
  "/login.html",
  "/register.html",
  "/student-dashboard.html",
  "/admin-dashboard.html",
  "/forgot-password.html",
  "/css/style.css",
  "/css/responsive.css",
  "/css/auth.css",
  "/css/dashboard.css",
  "/css/dashboard-predictor.css",
  "/css/placements.css",
  "/css/mous.css",
  "/css/premium.css",
  "/css/premium-dashboard.css",
  "/css/pwa-enhancements.css",
  "/css/mobile-dashboard.css",
  "/css/app-loader.css",
  "/css/premium-animations.css",
  "/js/forgot-password.js",
  "/js/register.js",
  "/js/api.js",
  "/js/main.js",
  "/js/animations.js",
  "/js/auth.js",
  "/js/data.js",
  "/js/certifications.js",
  "/js/charts.js",
  "/js/counter.js",
  "/js/placements.js",
  "/js/student-dashboard.js",
  "/js/student-features.js",
  "/js/admin-dashboard.js",
  "/js/admin-features.js",
  "/js/app-loader.js",
  "/js/micro-interactions.js",
  "/js/pwa.js",
  "/assets/logos/sgcsr-logo.png",
  "/assets/logos/gmr-logo.png",
  "/assets/icons/icon-192.png",
  "/assets/icons/icon-512.png",
  "/manifest.json"
];

// Install — cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// Fetch — network-first for API, cache-first for static
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") return;

  // Network-first for API calls
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return new Response(
            JSON.stringify({ error: "You are offline", offline: true }),
            { headers: { "Content-Type": "application/json" } }
          );
        })
    );
    return;
  }

  // Cache-first for static assets
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached version but also update cache in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, networkResponse);
            });
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // Not in cache — fetch from network
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const cloned = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, cloned);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for HTML pages
        if (request.headers.get("accept").includes("text/html")) {
          return caches.match("/index.html");
        }
      });
    })
  );
});
