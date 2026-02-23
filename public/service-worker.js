const CACHE_NAME = "caixa-static-v174";
const ASSETS = [
  "/",
  "/index.html",
  "/dashboard",
  "/dashboard.html",
  "/assets/css/app.css",
  "/assets/css/dashboard.css",
  "/assets/css/tokens.css",
  "/assets/css/components.css",
  "/assets/fonts/kamerik-105-bold.woff2",
  "/assets/js/app.js",
  "/assets/js/dashboard.js",
  "/manifest.json",
  "/assets/img/icons/icon_x192.png",
  "/assets/img/icons/icon_x512.png",
  "/assets/img/icons/maskable_icon_x96.png",
  "/assets/img/icons/maskable_icon_x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }
  if (requestUrl.pathname.startsWith("/api/") || requestUrl.pathname.startsWith("/uploads/")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const cloned = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        return response;
      });
    })
  );
});

