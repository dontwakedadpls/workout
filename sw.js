/* 12-Week Recomp - offline shell
   Bump CACHE when you change index.html and the update will be picked up. */
const CACHE = 'recomp-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest',
               './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Page loads: network first (so edits show up), cache as the offline fallback.
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 4000);
        const res = await fetch(req, { signal: ctrl.signal });
        clearTimeout(timer);
        if (res && res.ok) {
          const c = await caches.open(CACHE);
          c.put('./index.html', res.clone());
        }
        return res;
      } catch (err) {
        const cached = await caches.match('./index.html');
        return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Everything else: cache first, then network.
  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) {
        const c = await caches.open(CACHE);
        c.put(req, res.clone());
      }
      return res;
    } catch (err) {
      return new Response('', { status: 504 });
    }
  })());
});
