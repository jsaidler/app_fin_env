const CACHE_VERSION = "v177";
const APP_SHELL_CACHE = `caixa-app-shell-${CACHE_VERSION}`;
const STATIC_CACHE = `caixa-static-${CACHE_VERSION}`;
const IMAGE_CACHE = `caixa-images-${CACHE_VERSION}`;

const APP_SHELL_ASSETS = [
  "/",
  "/index.html",
  "/dashboard",
  "/dashboard.html",
  "/assets/css/app.css?v=20260302-01",
  "/assets/css/dashboard.css?v=20260302-01",
  "/assets/css/tokens.css?v=20260302-01",
  "/assets/css/components.css?v=20260302-01",
  "/assets/fonts/kamerik-105-bold.woff2",
  "/assets/js/app.js?v=20260302-01",
  "/assets/js/dashboard.js?v=20260302-01",
  "/manifest.json?v=20260302-01",
  "/assets/img/icons/icon_x192.png",
  "/assets/img/icons/icon_x512.png",
  "/assets/img/icons/maskable_icon_x96.png",
  "/assets/img/icons/maskable_icon_x512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(APP_SHELL_CACHE).then((cache) => cache.addAll(APP_SHELL_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  const validCaches = new Set([APP_SHELL_CACHE, STATIC_CACHE, IMAGE_CACHE]);
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => !validCaches.has(key))
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isApiOrUploadPath(pathname) {
  return pathname.startsWith("/api/") || pathname.startsWith("/uploads/");
}

function isImageRequest(request, pathname) {
  return request.destination === "image" || /\.(png|jpg|jpeg|webp|gif|svg|ico)$/i.test(pathname);
}

function isStaticAssetRequest(request, pathname) {
  return request.destination === "style"
    || request.destination === "script"
    || request.destination === "font"
    || pathname.startsWith("/assets/");
}

async function networkFirst(request, fallbackPath = "/dashboard.html") {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(APP_SHELL_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fallback = await caches.match(fallbackPath);
    if (fallback) return fallback;
    throw new Error("offline");
  }
}

async function staleWhileRevalidate(request, cacheName, event) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200 && response.type === "basic") {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    if (event) event.waitUntil(networkPromise);
    return cached;
  }

  const network = await networkPromise;
  if (network) return network;
  throw new Error("offline");
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const network = await fetch(request);
  if (network && network.status === 200 && network.type === "basic") {
    cache.put(request, network.clone());
  }
  return network;
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (!isSameOrigin(requestUrl)) return;
  if (isApiOrUploadPath(requestUrl.pathname)) return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(networkFirst(event.request, "/dashboard.html"));
    return;
  }

  if (isImageRequest(event.request, requestUrl.pathname)) {
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE));
    return;
  }

  if (isStaticAssetRequest(event.request, requestUrl.pathname)) {
    event.respondWith(staleWhileRevalidate(event.request, STATIC_CACHE, event));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request, APP_SHELL_CACHE, event));
});
