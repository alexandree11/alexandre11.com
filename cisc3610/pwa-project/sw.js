const CACHE_NAME = 'mytho-v1';
const ASSETS = [
  '/',                // The root URL (usually index.html)
  '/index.html',      // Your main app structure
  '/style.css',      // Your visual design (styling)
  '/app.js',          // Your core logic (the engine)
  '/manifest.json',   // Your PWA metadata (icons, colors, etc)
  // ... your media below
];

// Install event: Cache the assets
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

// Fetch event: Serve from cache if offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});