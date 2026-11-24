// Service worker di Garonio: rende il gioco installabile e giocabile offline.
//
// Strategia "prima la rete": ogni file del gioco si chiede sempre al server (con no-cache, quindi
// GitHub Pages risponde 304 se non è cambiato) e la copia in cache si usa solo se la rete manca o
// è troppo lenta. Così dopo un aggiornamento non si gioca mai con file vecchi.
// I file da tenere offline non sono elencati a mano: la pagina, appena registra il service worker,
// gli manda l'elenco di tutto quello che ha caricato (vedi src/app.js), e il resto si aggiunge
// man mano che si gioca. La musica (mp3, richieste a pezzi) passa sempre dalla rete: offline suona
// la musichetta 8-bit di riserva.
const CACHE = 'garonio-v1';
const LENTO_MS = 4000;   // oltre questo tempo, se c'è una copia in cache si usa quella

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './style.css', './manifest.webmanifest'])).catch(() => {}));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('garonio-') && k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

// la pagina manda l'elenco dei file già caricati: li mettiamo in cache per l'offline
self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.tipo === 'precarica' && Array.isArray(d.urls)) {
    e.waitUntil(caches.open(CACHE).then(c => Promise.all(d.urls.map(async u => {
      try { if (await c.match(u)) return; const r = await fetch(u, { cache: 'no-cache' }); if (r.ok) await c.put(u, r); } catch {}
    }))));
  }
});

function salvabile(req, r) { return r && (r.ok || r.type === 'opaque') && r.status !== 206; }

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || req.headers.has('range')) return;
  const url = new URL(req.url);
  if (url.origin === location.origin && /\.(mp3|ogg|m4a|wav)$/i.test(url.pathname)) return;

  // font di Google: non cambiano mai, prima la cache
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)) {
    e.respondWith(caches.open(CACHE).then(async c => {
      const hit = await c.match(req); if (hit) return hit;
      const r = await fetch(req); if (salvabile(req, r)) c.put(req, r.clone()); return r;
    }));
    return;
  }
  if (url.origin !== location.origin) return;

  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const pagina = req.mode === 'navigate';
    // le pagine si salvano senza parametri (?app=1, ?pilot...), così offline si apre comunque
    const chiave = pagina ? new Request(url.origin + url.pathname) : req;
    const rete = fetch(req, { cache: 'no-cache' }).then(r => { if (salvabile(req, r)) c.put(chiave, r.clone()); return r; });
    rete.catch(() => {});
    const copia = await c.match(chiave, { ignoreSearch: pagina }) || (pagina ? await c.match('./') : null);
    if (!copia) return rete;
    // c'è una copia: aspettiamo la rete, ma non all'infinito
    const lento = new Promise(res => setTimeout(() => res(null), LENTO_MS));
    try { return (await Promise.race([rete, lento])) || copia; } catch { return copia; }
  })());
});
