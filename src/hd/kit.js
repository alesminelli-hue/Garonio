// Kit comune per la pixel art "HD" di Garonio (stile dei fogli personaggi:
// contorno scuro, luce da in alto a sinistra, ombre che virano verso il viola,
// luci che virano verso il giallo). Tutto disegnato via codice su <canvas>.
// NON ancora usato dal gioco: serve a generare l'anteprima in tools/sprite_hd/anteprima.html.

export const INK = '#1e1622';
export const T = 16; // pixel per casella (come src/pixel.js)

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
function hex2rgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function rgb2hex(r, g, b) { return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1); }
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) {
    const d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60;
  }
  return [h, s, l];
}
function hsl2rgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
function towards(h, target, amt) { const d = ((target - h + 540) % 360) - 180; return h + clamp(d, -amt, amt); }

// Tono di un colore: k < 0 ombra (verso il viola), k > 0 luce (verso il giallo).
export function tone(hex, k) {
  let [h, s, l] = rgb2hsl(...hex2rgb(hex));
  if (k < 0) { h = towards(h, 255, 10 * -k); l = clamp(l - 0.105 * -k, 0.04, 1); s = clamp(s + 0.05 * -k, 0, 1); }
  else if (k > 0) { h = towards(h, 50, 6 * k); l = clamp(l + 0.085 * k, 0, 0.96); s = clamp(s - 0.02 * k, 0, 1); }
  return rgb2hex(...hsl2rgb(h, s, l));
}
// Rampa di 5 toni: [ombra forte, ombra, base, luce, riflesso]
export function ramp(hex) { return [tone(hex, -2), tone(hex, -1), hex, tone(hex, 1), tone(hex, 2)]; }

// Rumore deterministico
export function rng(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}
export function hash(x, y, s = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 1442695041)) >>> 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// ---------- Penna ----------
export function pen(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  const P = (col, x, y, ww = 1, hh = 1) => {
    if (!col) return;
    g.fillStyle = col; g.fillRect(Math.round(x), Math.round(y), Math.round(ww), Math.round(hh));
  };
  const ell = (cx, cy, rx, ry, col) => {
    for (let y = Math.floor(-ry); y <= Math.ceil(ry); y++) for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++)
      if ((x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1.0) P(col, cx + x, cy + y);
  };
  // ellisse ombreggiata come una sfera, luce da in alto a sinistra
  const ball = (cx, cy, rx, ry, R, { light = [-0.55, -0.8], seed = 0, grain = 0 } = {}) => {
    for (let y = Math.floor(-ry); y <= Math.ceil(ry); y++) for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++) {
      const nx = x / rx, ny = y / ry, q = nx * nx + ny * ny;
      if (q > 1) continue;
      let t = light[0] * nx + light[1] * ny;
      if (q > 0.78) t -= 0.25;
      if (grain) t += (hash((cx + x) >> 1, (cy + y) >> 1, seed) - 0.5) * grain;
      P(R[t > 0.62 ? 4 : t > 0.2 ? 3 : t > -0.3 ? 2 : t > -0.72 ? 1 : 0], cx + x, cy + y);
    }
  };
  const line = (x0, y0, x1, y1, col, wdt = 1) => {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      P(col, x0, y0, wdt, wdt);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  };
  // poligono pieno (test sul centro del pixel)
  const poly = (pts, col) => {
    const ys = pts.map(p => p[1]), xs = pts.map(p => p[0]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++)
      for (let x = Math.floor(Math.min(...xs)); x <= Math.ceil(Math.max(...xs)); x++) {
        const px = x + 0.5, py = y + 0.5;
        let inside = false;
        for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
          const [xi, yi] = pts[i], [xj, yj] = pts[j];
          if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside;
        }
        if (inside) P(col, x, y);
      }
  };
  // scatola con luce in alto e ombra in basso/destra
  const box = (x, y, w, h, R) => {
    P(R[2], x, y, w, h); P(R[3], x, y, w, 1); P(R[3], x, y, 1, h);
    P(R[1], x, y + h - 1, w, 1); P(R[1], x + w - 1, y, 1, h);
  };
  // cilindro verticale (luce a sinistra)
  const cyl = (x, y, w, h, R) => {
    for (let i = 0; i < w; i++) {
      const t = i / Math.max(1, w - 1);
      P(R[t < 0.15 ? 3 : t < 0.3 ? 4 : t < 0.55 ? 2 : t < 0.85 ? 1 : 0], x + i, y, 1, h);
    }
  };
  return { c, g, P, ell, ball, line, poly, box, cyl, w, h };
}

// Contorno scuro esterno (4 vicini), come nei fogli personaggi.
export function outline(c, color = INK) {
  const g = c.getContext('2d');
  const { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = color;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y) > 0) continue;
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1);
  }
  return c;
}

export function mirror(src) {
  const d = pen(src.width, src.height);
  d.g.translate(src.width, 0); d.g.scale(-1, 1); d.g.drawImage(src, 0, 0);
  return d.c;
}

// ---------- Ruote ----------
// gomma con tasselli, cerchione colorato, mozzo
export function wheel(d, cx, cy, r, { rim = '#9a9aa0', hub = '#d0d0d4', lugs = true, mud = 0 } = {}) {
  const tire = ramp('#34323a');
  d.ball(cx, cy, r, r, tire);
  if (lugs) for (let a = 0; a < 360; a += 360 / Math.max(8, r * 2)) {
    const rad = a * Math.PI / 180;
    d.P(tire[0], cx + Math.cos(rad) * (r - 0.6), cy + Math.sin(rad) * (r - 0.6));
  }
  const rr = Math.max(1, Math.round(r * 0.58));
  d.ball(cx, cy, rr, rr, ramp(rim));
  d.ell(cx, cy, Math.max(1, rr - 1.2), Math.max(1, rr - 1.2), null);
  const hr = Math.max(1, Math.round(r * 0.22));
  d.ball(cx, cy, hr, hr, ramp(hub));
  if (mud) {
    const R = rng(cx * 7 + cy);
    for (let i = 0; i < mud; i++) {
      const a = Math.PI * (0.2 + R() * 0.6), rr2 = r - R() * 2;
      d.P(R() < 0.5 ? '#6a4a2a' : '#7e5a34', cx + Math.cos(a) * rr2, cy + Math.sin(a) * rr2);
    }
  }
}

// ---------- Carattere pixel 3x5 ----------
const FONT = {
  A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111',
  F: '111100110100100', G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010',
  K: '101101110101101', L: '100100100100111', M: '101111111101101', N: '110101101101101', O: '010101101101010',
  P: '110101110100100', Q: '010101101110011', R: '110101110101101', S: '011100010001110', T: '111010010010010',
  U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101', Y: '101101010010010',
  Z: '111001010100111', '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
  '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010', '8': '111101111101111',
  '9': '111101111001110', ' ': '000000000000000', '.': '000000000000010', '!': '010010010000010', '-': '000000111000000',
  "'": '010010000000000', '↑': '010111010010010',
  '↓': '010010010111010', '€': '011110100110011', '+': '000010111010000', ':': '000010000010000',
};
// frecce orizzontali in 5x5 per leggibilità
const ARROWS = { '←': ['00100', '01000', '11111', '01000', '00100'], '→': ['00100', '00010', '11111', '00010', '00100'],
  '↑': ['00100', '01110', '10101', '00100', '00100'], '↓': ['00100', '00100', '10101', '01110', '00100'] };
export function textWidth(s) { let w = 0; for (const ch of s) w += (ARROWS[ch] ? 6 : 4); return Math.max(0, w - 1); }
export function text(d, s, x, y, col, shadow = null) {
  let cx = x;
  for (const ch of s.toUpperCase()) {
    if (ARROWS[ch]) {
      ARROWS[ch].forEach((row, j) => [...row].forEach((b, i) => { if (b === '1') { if (shadow) d.P(shadow, cx + i, y + j + 1); d.P(col, cx + i, y + j); } }));
      cx += 6; continue;
    }
    const gl = FONT[ch] || FONT[' '];
    for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (gl[j * 3 + i] === '1') {
      if (shadow) d.P(shadow, cx + i, y + j + 1);
      d.P(col, cx + i, y + j);
    }
    cx += 4;
  }
}
