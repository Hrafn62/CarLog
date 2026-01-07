// This is a basic service worker.
const CACHE_NAME = 'carlog-cache-v1';
// This list of files will be precached.
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json'
];

// Listener for the install event - precaches our assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(self.skipWaiting()) // Force the waiting service worker to become the active service worker.
  );
});

// Listener for the activate event - cleans up old caches.
self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim()) // Take control of the page immediately.
  );
});

// Listener for the fetch event - serves assets from cache or network.
self.addEventListener('fetch', event => {
  // We only want to handle GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For navigation requests, use a network-first strategy.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/'))
    );
    return;
  }

  // For other requests (CSS, JS, images), use a cache-first strategy.
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request).then(networkResponse => {
        // Don't cache unsuccessful responses, or responses from extensions.
        if (!networkResponse || networkResponse.status !== 200 || response.type !== 'basic' && !event.request.url.startsWith('http')) {
           return networkResponse;
        }

        // Cache the new response.
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      }).catch(err => {
        // Network request failed, try to serve from cache if it exists
        console.log('Fetch failed; returning offline page instead.', err);
        return caches.match('/');
      })
    })
  );
});
