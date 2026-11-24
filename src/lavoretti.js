// Lavoretti: esperienza dalle faccende di tutti i giorni.
//  - ogni azione dell'orto, del pollaio e del campo dà XP in più, con il «+XP» a schermo;
//  - 10 lavoretti in un giorno danno un premio;
//  - la legna da spaccare dietro casa (stanca, ma sfoga lo stress) e la Mamma la compra per la stufa;
//  - la pesca dal pontile del laghetto (soldi, XP, e qualche sorpresa).
// Dati e testi: LAVORETTI in src/data/sorprese.js.
//
// API (game.lavoretti): legna() ciocchi pronti per la Mamma
// Eventi mandati: azione { tipo: 'legna' | 'pesca' } (lo stesso evento delle altre faccende), pescato { esito }
// Stato: s.flags.lavoretti = { giorno, conta, premio, legnaOggi, legna, pescaOggi }
import * as PIX from './pixel.js';
import * as SV from './sprite_vita.js';
import { LAVORETTI as L } from './data/sorprese.js';
import { pick, fill } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Lavoretti {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get f() {
    const f = (this.s.flags.lavoretti ??= {});
    if (f.giorno !== this.s.day) Object.assign(f, { giorno: this.s.day, conta: 0, premio: false, legnaOggi: 0, pescaOggi: 0 });
    f.legna ??= 0;
    return f;
  }

  init() {
    const g = this.game, W = g.world;
    g.on('azione', e => this._azione(e));
    g.bersagli.push(() => this._bersaglio());
    // ceppo e catasta dietro casa
    const [cx, cz] = L.legna.ceppo, [kx, kz] = L.legna.catasta;
    const ce = W.sprite(PIX.toTexture(SV.ceppo()), { w: 1, h: 0.875 }); ce.position.set(cx, 0, cz); W.scene.add(ce);
    const ca = W.sprite(PIX.toTexture(SV.catasta()), { w: 1.9, h: 1.25 }); ca.position.set(kx, 0, kz); W.scene.add(ca);
    W.solids.push({ x0: cx - 0.3, z0: cz - 0.2, x1: cx + 0.3, z1: cz + 0.15 }, { x0: kx - 0.9, z0: kz - 0.3, x1: kx + 0.9, z1: kz + 0.15 });
    // pontile sul laghetto
    const [px, pz] = L.pesca.pontile;
    const po = W.sprite(PIX.toTexture(SV.pontile()), { w: 2, h: 0.875 }); po.position.set(px, 0, pz + 0.6); W.scene.add(po);
    // la Mamma compra la legna per la stufa
    g.png.aggiungiScelte('mamma', () => this.f.legna > 0 ? [{
      label: fill(L.legna.mamma, { n: this.f.legna, soldi: this.f.legna * L.legna.prezzoMamma }),
      fn: () => {
        const soldi = this.f.legna * L.legna.prezzoMamma;
        this.s.money += soldi; this.f.legna = 0; g.audio.sfx('coin'); g.png.cambiaAmicizia('mamma', 2);
        return [{ who: 'mamma', name: 'La Mamma', text: `${pick(L.legna.mammaGrazie)} (+${soldi}€)` }];
      },
    }] : []);
  }

  legna() { return this.f.legna; }

  _azione(e) {
    const g = this.game, f = this.f;
    const extra = L.xpExtra[e.tipo] ?? 0;
    if (extra) { g._xp(extra); g.ui.float(`+${extra} XP lavoretto`); }
    f.conta++;
    if (!f.premio && f.conta >= L.lavoratore.soglia) {
      f.premio = true; g._xp(L.lavoratore.xp);
      g.ui.toast(fill(L.lavoratore.testo, { xp: L.lavoratore.xp }), 'good'); g.audio.sfx('level');
    }
  }

  _bersaglio() {
    const g = this.game; if (g.vehicles.driving) return null;
    const P = g.player.group.position;
    const [cx, cz] = L.legna.ceppo, [px, pz] = L.pesca.pontile;
    if (Math.hypot(P.x - cx, P.z - (cz + 0.6)) < 1.2) {
      const f = this.f;
      return { label: f.legnaOggi < L.legna.max ? `Spacca la legna (${f.legnaOggi}/${L.legna.max})` : 'Catasta finita per oggi', fn: () => this._spacca() };
    }
    if (Math.hypot(P.x - px, P.z - (pz + 1.2)) < 1.4) {
      const f = this.f;
      return { label: f.pescaOggi < L.pesca.max ? `Pesca dal pontile (${f.pescaOggi}/${L.pesca.max})` : 'Pesca finita per oggi', fn: () => this._pesca() };
    }
    return null;
  }

  _spacca() {
    const g = this.game, s = this.s, f = this.f, Lg = L.legna;
    if (f.legnaOggi >= Lg.max) { g.ui.toast(Lg.finita); return; }
    f.legnaOggi++; f.legna++;
    s.tired = clamp(s.tired + Lg.stanchezza * g.prog.fatica(), 0, 100);
    s.stress = clamp(s.stress + Lg.stress, 0, 100);
    s.minutes += Lg.minuti;
    g._xp(Lg.xp);
    g.actT = 0.3; g.actName = 'attack'; g.audio.sfx('dig'); g.ui.shake();
    g.emit('azione', { tipo: 'legna' });
    if (Math.random() < Lg.sorpresa.probabilita) { g._xp(20); g.ui.toast(pick(Lg.sorpresa.testi), 'good'); g.audio.sfx('level'); return; }
    g.ui.toast(`${pick(Lg.testi)}  +${Lg.xp} XP, Stress ${Lg.stress}`, 'good');
  }

  async _pesca() {
    const g = this.game, s = this.s, f = this.f, Pe = L.pesca;
    if (f.pescaOggi >= Pe.max) { g.ui.toast(Pe.finita); return; }
    f.pescaOggi++;
    s.minutes += Pe.minuti; s.tired = clamp(s.tired + Pe.stanchezza, 0, 100);
    let r = Math.random() * Pe.esiti.reduce((t, e) => t + e.peso, 0);
    const e = Pe.esiti.find(x => (r -= x.peso) < 0) || Pe.esiti[0];
    s.stress = clamp(s.stress + (e.stress || 0), 0, 100);
    if (e.soldi) { s.money += e.soldi; g.audio.sfx('coin'); } else g.audio.sfx('water');
    g._xp(e.xp || 0);
    g.emit('azione', { tipo: 'pesca' }); g.emit('pescato', { esito: e.testo });
    const bits = [e.soldi && `+${e.soldi}€`, e.xp && `+${e.xp} XP`, e.stress && `Stress ${e.stress > 0 ? '+' : ''}${e.stress}`].filter(Boolean).join(' · ');
    await g.ui.dialog([{ name: 'Pesca al laghetto', text: `🎣 ... ... ... ${e.testo}\n\n${bits}` }]);
  }
}
