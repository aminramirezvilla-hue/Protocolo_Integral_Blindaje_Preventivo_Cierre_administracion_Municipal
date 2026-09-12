const CACHE = 'catu-er-v0.1.3-dev.2';
const APP_SHELL = [
  './', './index.html', './styles.css', './print-fix-v012.css', './manifest.webmanifest',
  './js/core.js', './js/views.js', './js/actions.js', './js/patch-evidence-v011.js', './js/patch-p4-dev1.js', './js/patch-p4-dev2.js',
  './data/runtime/controls-1.json', './data/runtime/controls-2.json', './data/runtime/controls-3.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-180.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('./index.html')))
  );
});
