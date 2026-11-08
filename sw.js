// Offline-first service worker. Bump VERSION whenever any file below changes.
const VERSION = 'itw-v21';
const SHELL = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'fonts/gochi-hand.woff2',
  'fonts/nunito.woff2',
  'icons/apple-touch-icon.png',
  'icons/favicon-48.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/maskable-512.png',
  'img/campus-map.webp',
  'img/logo.webp',
  'img/trees.webp',
  'js/data/field.js',
  'js/data/games.js',
  'js/data/guide.js',
  'js/data/packing.js',
  'js/data/people.js',
  'js/data/trip.js',
  'js/main.js',
  'js/pages/cabin-agreement.js',
  'js/pages/checklist.js',
  'js/pages/compass.js',
  'js/pages/contacts.js',
  'js/pages/directions.js',
  'js/pages/field-guide.js',
  'js/pages/games.js',
  'js/pages/guide.js',
  'js/pages/home.js',
  'js/pages/night-light.js',
  'js/pages/schedule.js',
  'js/ui.js',
];

// A new version installs in the background, then waits. The page offers "Reload",
// which sends SKIP_WAITING, so a running page never mixes old and new modules.
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)));
});
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // maps, video, Drive: network only

  // App shell: serve from cache instantly, refresh in the background (stale-while-revalidate).
  if (req.mode === 'navigate') {
    event.respondWith(
      caches.match('./').then((cached) => {
        const fresh = fetch(req).then((res) => {
          if (res.ok) caches.open(VERSION).then((c) => c.put('./', res.clone()));
          return res;
        }).catch(() => cached);
        return cached || fresh;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(req, copy)); }
      return res;
    }))
  );
});
