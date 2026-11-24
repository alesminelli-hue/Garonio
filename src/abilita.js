// Effetti dei rami di abilità (GDD 11.3) e delle armi come attrezzi (GDD 15.2) fuori dal combattimento.
// Quelli che toccano il ciclo del gioco sono letti direttamente in game.js con prog.bonus():
//   corsaGratis, stanchezzaMax, stressImmune, crescita, pisolinoNascosto (Resistenza, Nervi, Agricoltore, Furbizia).
// Qui ci sono quelli che passano dagli eventi (src/eventi.js):
//   raccoltoExtra (Agricoltore 2), annaffiaLargo (Agricoltore 3), rastrello (raccoglie 2 piante nell'orto),
//   perdonoGigante (Furbizia 4), rialzati (Resistenza 4).
// I bonus del combattimento (critico, mossaExtra, primoTurnoDoppio, santino, stress...) li legge src/combat.js.
// Stato salvato: s.flags.abilita = { rialzatoGiorno, perdonoSettimana }
import { AREAS } from './map.js';

export class Abilita {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get st() { return this.s.flags.abilita; }

  init() {
    const g = this.game;
    this.s.flags.abilita ??= {};
    g.on('raccolto', d => this._raccolto(d));
    g.on('annaffiato', d => this._annaffia(d));
  }

  _plot(x, z) { return this.s.plots[x + ',' + z]; }
  _inOrto(x, z) { return [AREAS.orto, AREAS.ortoSalici].some(o => o && x >= o.x0 && x < o.x1 && z >= o.z0 && z < o.z1); }

  _raccolto({ crop, x, z }) {
    const g = this.game, P = g.prog;
    const extra = P.bonus('raccoltoExtra');
    if (extra) { P.dai(crop, extra); g.ui.float(`+${extra} (Agricoltore)`); }
    // il rastrello raccoglie anche la pianta matura qui accanto, nell'orto
    if (x == null || P.arma().id !== 'rastrello' || !this._inOrto(x, z)) return;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, nz = z + dz, p = this._plot(nx, nz);
      if (!p?.crop || p.stage < 3 || !this._inOrto(nx, nz)) continue;
      P.dai(p.crop, 1 + extra);
      this.s.plots[nx + ',' + nz] = { crop: null, stage: 0, water: false, g: 0 };
      g.world.setPlot(nx, nz, this.s.plots[nx + ',' + nz]);
      this.s.today.raccolti++;
      g.ui.float('Rastrellata: +1 pianta accanto');
      return;
    }
  }

  _annaffia({ x, z }) {
    if (!this.game.prog.bonus('annaffiaLargo')) return;
    let n = 0;
    for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1]]) {
      const p = this._plot(x + dx, z + dz);
      if (!p?.crop || p.water) continue;
      p.water = true; this.game.world.setPlot(x + dx, z + dz, p); this.s.today.annaffiate++;
      if (++n >= 2) break;
    }
  }

  // Furbizia 4: la prima missione fallita della settimana il Gigante non la vede
  perdona() {
    const g = this.game;
    if (!g.prog.bonus('perdonoGigante')) return false;
    const w = Math.floor((this.s.day - 1) / 7);
    if (this.st.perdonoSettimana === w) return false;
    this.st.perdonoSettimana = w;
    g.ui.toast('Missione fallita... ma il Gigante era distratto. Non se n\'è accorto! (Furbizia)', 'good');
    return true;
  }

  // Resistenza 4: una volta al giorno, invece di crollare, Garonio si rialza da solo
  rialzati() {
    const g = this.game, s = this.s;
    if (!g.prog.bonus('rialzati') || this.st.rialzatoGiorno === s.day) return false;
    this.st.rialzatoGiorno = s.day;
    s.tired = 60; s.stress = Math.min(100, s.stress + 3);
    g.ui.toast('Garonio barcolla... ma si rialza da solo. Che tempra! (Resistenza)', 'good');
    return true;
  }
}
