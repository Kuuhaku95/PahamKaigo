const CACHE = 'pahamkaigo-v21';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './icon-512-maskable.png', './menu/part-a.png', './menu/part-b.png', './menu/part-c.png', './menu/kosakata.png', './menu/lanjut.png', './menu/soal.png', './menu/kartu.png', './menu/setelan.png', './menu/kakomon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
const put = (req, res) => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; };
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (req.url.includes('version.json')) return; // selalu cek ke server
  if (req.mode === 'navigate') {
    // Halaman utama: coba versi terbaru (maks 3 detik), kalau lambat/offline pakai cache
    e.respondWith(new Promise(resolve => {
      let done = false;
      const fromCache = () => caches.match(req).then(r => r || caches.match('./index.html')).then(r => { if (!done && r) { done = true; resolve(r); } });
      const t = setTimeout(fromCache, 3000);
      fetch(req).then(r => { clearTimeout(t); put(req, r); if (!done) { done = true; resolve(r); } }).catch(() => { clearTimeout(t); fromCache(); });
    }));
    return;
  }
  // Font, ikon, dan file lain: ambil dari cache dulu (cepat), perbarui di belakang
  e.respondWith(caches.match(req).then(cached => {
    const net = fetch(req).then(r => put(req, r)).catch(() => cached);
    return cached || net;
  }));
});
