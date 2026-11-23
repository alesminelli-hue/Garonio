// Minimappa nell'angolo: terreno disegnato una volta, poi solo i segnalini.
// Tasto N (o tocco) per ingrandirla. Altri moduli (es. i mezzi) possono aggiungere segnalini con setMarker().
import { MAP_W, MAP_H, BUILDINGS, LANDMARKS } from './map.js';

const COLORS = {
  g: '#4f9438', w: '#3a78c0', b: '#9a6a3a', p: '#c9a66b', a: '#3e4248', q: '#a89a88',
  f: '#86a84a', o: '#86a84a', c: '#c8b070', s: '#7a6a3a', y: '#d8b850', r: '#8a5e36',
};

export class Minimap {
  constructor(grid) {
    const S = 2; // pixel per casella
    this.S = S;
    this.base = document.createElement('canvas');
    this.base.width = MAP_W * S; this.base.height = MAP_H * S;
    const g = this.base.getContext('2d');
    for (let z = 0; z < MAP_H; z++) for (let x = 0; x < MAP_W; x++) {
      g.fillStyle = COLORS[grid[z][x]] || COLORS.g; g.fillRect(x * S, z * S, S, S);
    }
    for (const b of BUILDINGS) {
      g.fillStyle = '#1a1420'; g.fillRect(b.x0 * S - 1, b.z0 * S - 1, b.w * S + 2, b.d * S + 2);
      g.fillStyle = b.decor ? '#b8a898' : '#f0d050'; g.fillRect(b.x0 * S, b.z0 * S, b.w * S, b.d * S);
    }
    this.el = document.createElement('div');
    this.el.id = 'minimap';
    this.el.className = 'panel';
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.base.width; this.canvas.height = this.base.height;
    this.el.appendChild(this.canvas);
    this.labels = document.createElement('div');
    this.labels.className = 'mm-labels';
    for (const l of LANDMARKS) {
      const s = document.createElement('span');
      s.textContent = l.name;
      s.style.left = (l.x / MAP_W * 100) + '%'; s.style.top = (l.z / MAP_H * 100) + '%';
      this.labels.appendChild(s);
    }
    this.el.appendChild(this.labels);
    this.el.addEventListener('click', () => this.toggle());
    document.getElementById('hud').appendChild(this.el);
    this.markers = new Map();
    this.t = 0;
  }

  toggle() { this.el.classList.toggle('big'); }

  // Segnalino extra (es. un mezzo parcheggiato): setMarker('vespa', x, z, '#6aa0e0'); null per toglierlo.
  setMarker(id, x, z, color = '#ffffff') {
    if (x === null || x === undefined) this.markers.delete(id); else this.markers.set(id, { x, z, color });
  }

  update(px, pz, dt = 0.016) {
    this.t += dt;
    if (this.t < 0.1) return;
    this.t = 0;
    const g = this.canvas.getContext('2d'), S = this.S;
    g.drawImage(this.base, 0, 0);
    for (const m of this.markers.values()) { g.fillStyle = '#1a1420'; g.fillRect(m.x * S - 3, m.z * S - 3, 6, 6); g.fillStyle = m.color; g.fillRect(m.x * S - 2, m.z * S - 2, 4, 4); }
    const blink = (performance.now() / 300 | 0) % 2;
    g.fillStyle = '#1a1420'; g.fillRect(px * S - 4, pz * S - 4, 8, 8);
    g.fillStyle = blink ? '#ff5040' : '#ffffff'; g.fillRect(px * S - 3, pz * S - 3, 6, 6);
  }
}
