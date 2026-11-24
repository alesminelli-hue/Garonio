// Versione app (PWA): service worker per l'offline, installazione e schermo intero.
//
// API:
//   avviaApp()             registra il service worker (da main.js, una volta)
//   installata()           true se il gioco gira come app installata (icona sulla home)
//   puoInstallare()        true se il browser offre il pulsante «Installa» (Android/Chrome/Edge)
//   installa()             mostra il prompt di installazione del browser
//   schermoIntero()        attiva/disattiva lo schermo intero (dove il browser lo permette)
//   sistema()              'ios' | 'android' | 'altro', per spiegare come si installa
//   nativa()               true dentro l'app Android (APK fatto con Capacitor, vedi app-android/)

let promptInstalla = null;

export const nativa = () => !!window.Capacitor?.isNativePlatform?.();

export function avviaApp() {
  // chiede al telefono di non cancellare mai i salvataggi (su iPhone vale soprattutto per l'app sulla schermata Home)
  try { navigator.storage?.persist?.().catch(() => {}); } catch {}
  if (nativa()) return; // nell'APK i file sono già dentro l'app: niente service worker
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); promptInstalla = e; });
  window.addEventListener('appinstalled', () => { promptInstalla = null; });
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  const registra = async () => {
    try {
      const reg = await navigator.serviceWorker.register('./sw.js', { scope: './' });
      // manda al service worker l'elenco dei file già caricati, così il gioco funziona anche offline
      const manda = () => {
        const urls = performance.getEntriesByType('resource').map(r => r.name)
          .filter(u => u.startsWith(location.origin) && !/\.(mp3|ogg|m4a|wav)$/i.test(u));
        urls.push(location.origin + location.pathname);
        (reg.active || reg.waiting || reg.installing)?.postMessage({ tipo: 'precarica', urls: [...new Set(urls)] });
      };
      if (reg.active) setTimeout(manda, 3000);
      else navigator.serviceWorker.addEventListener('controllerchange', () => setTimeout(manda, 1000), { once: true });
    } catch { /* niente offline, il gioco va lo stesso */ }
  };
  if (document.readyState === 'complete') registra(); else window.addEventListener('load', registra, { once: true });
}

export function installata() {
  return nativa() || matchMedia('(display-mode: fullscreen), (display-mode: standalone)').matches || navigator.standalone === true;
}
export function puoInstallare() { return !!promptInstalla; }
export async function installa() {
  if (!promptInstalla) return false;
  promptInstalla.prompt();
  const r = await promptInstalla.userChoice.catch(() => null);
  promptInstalla = null;
  return r?.outcome === 'accepted';
}

export function sistema() {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/.test(ua)) return 'android';
  return 'altro';
}

export function puoSchermoIntero() { return !!(document.documentElement.requestFullscreen || document.documentElement.webkitRequestFullscreen); }
export async function schermoIntero() {
  const d = document, el = d.documentElement;
  try {
    if (d.fullscreenElement || d.webkitFullscreenElement) { await (d.exitFullscreen || d.webkitExitFullscreen).call(d); return false; }
    await (el.requestFullscreen || el.webkitRequestFullscreen).call(el, { navigationUI: 'hide' });
    try { await screen.orientation?.lock?.('any'); } catch {}
    return true;
  } catch { return false; }
}
