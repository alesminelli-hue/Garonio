// La stalla (GDD capitolo 26.6): nel recinto accanto alla via della stalla vivono la mucca Carolina,
// la pecora Dolly, l'oca Gertrude, il cavallo Furia, l'asino Ernesto e il gallo Napoleone.
// Gli animali girano piano nel recinto; vicino a uno, E fa il suo lavoretto (mungere, tosare, prendere l'uovo,
// strigliare...): una volta al giorno (la lana ogni tre). Dà latte, lana, uova d'oca, XP e meno stress, ma
// l'oca morde e l'asino scalcia. Sette giorni di stalla di fila: un premio. Dati: src/data/stalla.js.
//
// API (game.stalla):
//   fai(id)       fa il lavoretto con quell'animale
//   animali       [{ id, def, a, x, z }]
// Eventi: emette  azione { tipo: 'stalla', animale }  (conta come le altre faccende, src/lavoretti.js)
// Stato: s.flags.stalla = { fatto: { id: giorno }, serie, ultimo }
import * as PIX from './pixel.js';
import { STALLA as D } from './data/stalla.js';
import { ATLANTE } from './data/sprite_personaggi.js';
import { OGGETTI } from './data/armi.js';
import { pick } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);

export class Stalla {
  constructor(game) { this.game = game; this.animali = []; }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); const st = (f.stalla ??= {}); st.fatto ??= {}; return st; }
  _ora() { return (this.s.minutes / 60) % 24; }

  init() {
    const g = this.game, W = g.world;
    for (const [id, def] of Object.entries(D.animali)) {
      const at = ATLANTE[def.sprite]; if (!at || !PIX.haSprite(def.sprite)) continue;
      const [, , sw, sh] = at;
      const fr = [0, 1].map(f => PIX.animale(def.sprite, f, sw, sh + 1));
      const h = def.w * (sh + 1) / sw;
      const a = W.actor([...fr, ...fr.map(PIX.mirror)], { w: def.w, h, shadow: def.w * 0.3 });
      const [x, z] = def.casa;
      this.animali.push({ id, def, a, x, z, tx: x, tz: z, pausa: rand(0, 4), dir: 1, t: Math.random() * 5 });
    }
    g.bersagli.push(() => this.bersaglio());
    g.moduli.push({ animate: dt => this.animate(dt) });
    g.pilot?.sezione?.('🐄 Stalla', () => [
      { label: '🐄 Vai alla stalla', fn: () => { g.player.group.position.set(104.5, 0, 85.2); return null; } },
      { label: '🔁 Animali di nuovo pronti', fn: () => { this.st.fatto = {}; return null; } },
    ]);
  }

  _pronto(id) {
    const d = D.animali[id], f = this.st.fatto[id];
    return f == null || this.s.day - f >= d.ogni;
  }

  bersaglio() {
    const g = this.game;
    if (g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position;
    if (P.x < 97 || P.x > 110 || P.z < 75 || P.z > 86) return null;
    let best = null, bd = D.raggio;
    for (const an of this.animali) {
      const d = Math.hypot(P.x - an.x, P.z - an.z);
      if (d < bd) { bd = d; best = an; }
    }
    if (!best) return null;
    return { label: this._pronto(best.id) ? best.def.azione : `${best.def.azione.split(' ')[0]} ${best.def.nome} (domani)`, fn: () => this.fai(best.id) };
  }

  fai(id) {
    const g = this.game, s = this.s, d = D.animali[id], st = this.st;
    const an = this.animali.find(a => a.id === id);
    if (an) an.pausa = 3;
    if (!this._pronto(id)) return g.ui.toast(d.giaFatto || `${d.nome} per oggi ha già dato. Torna domani.`);
    st.fatto[id] = s.day;
    g.actT = 0.5; g.actName = 'attack';
    s.tired = clamp(s.tired + (d.fatica || 0), 0, 100);
    // l'alba del gallo
    if (d.alba && this._ora() >= d.alba.ore[0] && this._ora() < d.alba.ore[1]) {
      s.tired = clamp(s.tired + d.alba.fatica, 0, 100);
      g.ui.toast(d.alba.testo, 'good');
    } else if (d.calcio && Math.random() < d.calcio.p) {
      s.health = clamp(s.health - d.calcio.vita, 1, s.maxHealth);
      g.ui.shake?.(); g.audio.sfx('bad');
      g.ui.toast(`${d.calcio.testo} (Vita −${d.calcio.vita})`, 'bad');
      this._serie(); g._xp?.(Math.round(d.xp / 2));
      g.emit('azione', { tipo: 'stalla', animale: id });
      return;
    } else {
      const cose = Object.entries(d.dai || {}).map(([o, n]) => { g.prog.dai(o, n); return `${OGGETTI[o].icona} ${OGGETTI[o].nome}${n > 1 ? ` ×${n}` : ''}`; });
      if (d.stress) s.stress = clamp(s.stress + d.stress, 0, 100);
      g.audio.sfx(cose.length ? 'coin' : 'blip');
      g.ui.toast(`${pick(d.testi)}${cose.length ? ` (${cose.join(', ')})` : ''}${d.stress ? ` Stress ${d.stress}.` : ''}`, 'good');
    }
    g._xp?.(d.xp);
    this._serie();
    g.emit('azione', { tipo: 'stalla', animale: id });
  }

  // giorni di fila in cui Garonio ha fatto almeno un lavoretto in stalla
  _serie() {
    const st = this.st, s = this.s, P = D.premioSettimana;
    if (st.ultimo === s.day) return;
    st.serie = st.ultimo === s.day - 1 ? (st.serie || 0) + 1 : 1;
    st.ultimo = s.day;
    if (st.serie % P.giorni === 0) { s.money += P.soldi; setTimeout(() => this.game.ui.toast(P.testo, 'good'), 1500); }
  }

  animate(dt) {
    const dentro = !!this.game.interni?.attivo, [x0, z0, x1, z1] = D.recinto;
    for (const an of this.animali) {
      an.a.group.visible = !dentro;
      an.t += dt;
      const dx = an.tx - an.x, dz = an.tz - an.z, d = Math.hypot(dx, dz);
      let cammina = false;
      if (an.pausa > 0) an.pausa -= dt;
      else if (d < 0.1) { an.pausa = rand(2, 7); an.tx = clamp(an.x + rand(-2.5, 2.5), x0, x1); an.tz = clamp(an.z + rand(-1.5, 1.5), z0, z1); }
      else {
        const st = Math.min(d, an.def.vel * dt), nx = an.x + dx / d * st, nz = an.z + dz / d * st;
        if (!this.game.world.blocked(nx, nz, 0.25)) { an.x = nx; an.z = nz; cammina = true; } else an.tx = an.x;
        if (Math.abs(dx) > 0.05) an.dir = dx > 0 ? 1 : -1;
      }
      an.a.group.position.set(an.x, 0, an.z);
      an.a.setFrame((an.dir > 0 ? 2 : 0) + (cammina ? Math.floor(an.t * 5) % 2 : 0));
    }
  }
}
