const CACHE_NAME = 'myth-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/data.json',
  '/assets/images/xaxa-icon-192.png',
  '/assets/images/xaxa-icon-512.png',
  '/assets/images/achilles-skyros.png.png',
  '/assets/images/cosmogonies-theogonies.png',
  '/assets/images/creation-of-mankind.png',
  '/assets/images/death-orpheus.png',
  '/assets/images/epic-struggles.png' // Add your specific images here
];

// 1. INSTALL: Save files to cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. ACTIVATE: (Your existing code)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      );
    })
  );
});

// 3. FETCH: Serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});