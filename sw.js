/**
 * sw.js - Service Worker for India Fashion Store PWA
 * Caches core static assets for reliable offline support and instant loading.
 */

const CACHE_NAME = "india-cache-v5";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./ecom.css",
  "./ecom.js",
  "./products.js",
  "./manifest.json"
];

// Install Event: cache app shell
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event: remove legacy caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event: Stale-While-Revalidate for app assets, bypass for APIs
self.addEventListener("fetch", event => {
  const requestUrl = new URL(event.request.url);

  // Do not cache API endpoints or external POST requests
  if (requestUrl.pathname.startsWith("/api/") || event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      const fetchPromise = fetch(event.request).then(networkResponse => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
