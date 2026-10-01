const CACHE = 'pahamkaigo-v82';
const FILES = ["./","./index.html","./manifest.json","./icon-192.png","./apple-touch-icon.png","./hero.webp","./ic-part-a.webp","./ic-part-b.webp","./ic-part-c.webp","./ic-kosakata.webp","./ic-lanjut.webp","./ic-soal.webp","./ic-kartu.webp","./ic-kakomon.webp"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(u => new Request(u, { cache: 'reload' }))))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
const put = (req, res) => { if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; };
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('version.json')) return; // selalu cek ke server
  if (req.mode === 'navigate' || req.url.endsWith('/index.html')) {
    // Halaman utama: selalu ambil versi terbaru dari server; cache hanya dipakai saat offline
    e.respondWith(fetch(req, { cache: 'no-store' }).then(r => put(req, r)).catch(() => caches.match(req).then(r => r || caches.match('./index.html') || caches.match('./'))));
    return;
  }
  // Gambar & font: cache dulu (cepat), lalu diperbarui di belakang
  e.respondWith(caches.match(req).then(cached => { const net = fetch(req).then(r => put(req, r)).catch(() => cached); return cached || net; }));
});
