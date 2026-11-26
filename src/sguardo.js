// Da che parte guarda un personaggio (dir: 1 = destra, -1 = sinistra), senza sfarfallare.
// Il verso cambia solo se la nuova direzione resta valida per un attimo (ATTESA secondi) e, quando si guarda
// qualcuno, solo se è spostato di lato di almeno SOGLIA caselle: così chi sta fermo davanti a Garonio, o chi
// aggira un ostacolo a zig-zag, non si gira avanti e indietro a ogni fotogramma.
const ATTESA = 0.3, SOGLIA = 0.45;

// o: { dir, _dirT } · voglia: 1 | -1 · dt: secondi
export function gira(o, voglia, dt) {
  if (!voglia || voglia === o.dir) { o._dirT = 0; return o.dir; }
  o._dirT = (o._dirT || 0) + dt;
  if (o._dirT >= ATTESA || !o.dir) { o.dir = voglia; o._dirT = 0; }
  return o.dir;
}

// guarda verso la x di qualcuno (Garonio, un altro paesano)
export function guarda(o, x, dt, ox = o.x) {
  const dx = x - ox;
  return gira(o, Math.abs(dx) < SOGLIA ? 0 : dx > 0 ? 1 : -1, dt);
}
