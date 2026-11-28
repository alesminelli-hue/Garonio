// Sprite ritagliati dai fogli disegnati (sfondo magenta) da tools/fogli/taglia_fogli.py:
// facciate degli edifici, mezzi, alberi e oggetti di scena, colture, caselle del terreno, arredi degli interni.
// L'atlante si carica all'avvio (src/main.js); se manca, ogni funzione che lo usa torna al disegno via codice.
import { FOGLI, FOGLI_FILE } from '../data/sprite_fogli.js';

const S = {};   // nome -> canvas
const META = {};
let pronto = false;

export async function caricaFogli() {
  try {
    const img = await new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = FOGLI_FILE; });
    for (const [nome, [x, y, w, h, gronda]] of Object.entries(FOGLI)) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
      g.drawImage(img, x, y, w, h, 0, 0, w, h);
      S[nome] = c;
      if (gronda != null) META[nome] = { gronda };
    }
    pronto = true;
  } catch { /* senza atlante restano i disegni via codice */ }
}

export const fogliPronti = () => pronto;
// canvas originale (da non modificare: chi lo deve cambiare usa copia())
export const foglio = nome => S[nome] || null;
export const gronda = nome => META[nome]?.gronda ?? 0;
export function copia(nome) {
  const s = S[nome]; if (!s) return null;
  const c = document.createElement('canvas'); c.width = s.width; c.height = s.height;
  c.getContext('2d').drawImage(s, 0, 0);
  return c;
}
// lo sprite dentro una tela w x h, appoggiato in basso al centro (per tenere le misure dei disegni via codice)
export function inTela(nome, w, h) {
  const s = S[nome]; if (!s) return null;
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = false;
  g.drawImage(s, Math.round((w - s.width) / 2), h - s.height);
  return c;
}
// lo sprite rimpicciolito (se serve) per stare in una tela w x h, appoggiato in basso al centro
export function adatta(nome, w, h) {
  const s = S[nome]; if (!s) return null;
  const k = Math.min(1, w / s.width, h / s.height);
  const sw = Math.max(1, Math.round(s.width * k)), sh = Math.max(1, Math.round(s.height * k));
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const g = c.getContext('2d'); g.imageSmoothingEnabled = k < 1;
  if (k < 1) g.imageSmoothingQuality = 'high';
  g.drawImage(s, Math.round((w - sw) / 2), h - sh, sw, sh);
  if (k < 1) netto(c);
  return c;
}
// alfa netto dopo un ridimensionamento (niente aloni semitrasparenti)
function netto(c) {
  const g = c.getContext('2d'), im = g.getImageData(0, 0, c.width, c.height), d = im.data;
  for (let i = 3; i < d.length; i += 4) d[i] = d[i] >= 128 ? 255 : 0;
  g.putImageData(im, 0, 0);
}
