// Progressione di Garonio: livelli, punti abilità, arma, equipaggiamento e zaino.
// Tutti i numeri stanno in src/data/progressione.js e src/data/armi.js.
//
// API (game.prog):
//   addXp(n)                    esperienza; gestisce i livelli (max 30) e i punti abilità
//   maxHealth()                 Vita massima (100 + 5 a livello + bonus)
//   atk() / def()               attacco e difesa per il combattimento (livello + arma + vestiti + abilità)
//   bonus('chiave')             somma degli effetti di abilità, vestiti e arma (vedi src/data/progressione.js)
//   grado(ramo) / puoiAlzare(ramo) / alza(ramo)       rami di abilità
//   arma() / haArma(id) / daiArma(id) / impugna(id)   armi
//   haVestito(id) / daiVestito(id) / indossa(id) / togli(slot) / indossato(slot)
//   ha(id, n) / dai(id, n) / togliOggetto(id, n)      zaino (s.inv)
//   titolo()                    "Lo Scansafatiche", "Il Garzone"...
import { LIVELLI, RAMI, GRADI_LIVELLO, titolo } from './data/progressione.js';
import { ARMI, VESTITI, OGGETTI, AFFILATURA, SLOT } from './data/armi.js';

export function freshProg() {
  return {
    punti: 0, rami: {},
    arma: 'zappa', armi: ['zappa'], affilatura: {},
    vestiti: [], equip: { testa: null, corpo: null, piedi: null, portafortuna: null },
  };
}

export class Progressione {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get p() { return this.s.prog; }

  // Sistema i salvataggi vecchi (prima della progressione)
  migra() {
    const s = this.s;
    s.prog = Object.assign(freshProg(), s.prog || {});
    s.prog.equip = Object.assign(freshProg().equip, s.prog.equip);
    if (s.prog.v !== 1) {
      s.prog.v = 1;
      s.prog.punti = Math.max(s.prog.punti, s.level - 1); // punti per i livelli già fatti
      if (s.upgrades?.stivali && !s.prog.vestiti.includes('stivali')) { s.prog.vestiti.push('stivali'); s.prog.equip.piedi = 'stivali'; }
    }
    // la vecchia "zappa affilata" dell'officina diventa il primo grado di affilatura (Zeno)
    if (s.upgrades?.zappa && !s.prog.affilatura.zappa) s.prog.affilatura.zappa = 1;
    if (s.maxHealth == null) s.maxHealth = this.maxHealth();
  }

  // ---------- Livelli ----------
  xpNext(level = this.s.level) { return LIVELLI.xpPer(level); }

  addXp(n) {
    const s = this.s;
    if (s.level >= LIVELLI.max) { s.xp = 0; return; }
    s.xp += n;
    while (s.level < LIVELLI.max && s.xp >= this.xpNext()) {
      s.xp -= this.xpNext(); s.level++;
      this.p.punti += LIVELLI.perLivello.punti;
      s.maxHealth = this.maxHealth();
      s.health = Math.min(s.maxHealth, s.health + 10 + LIVELLI.perLivello.vitaMax);
      const g = this.game;
      g.audio.sfx('level');
      const nuovoTitolo = this.titolo(s.level) !== this.titolo(s.level - 1);
      g.ui.toast(nuovoTitolo ? `Livello ${s.level}! Ora sei «${this.titolo()}». +1 punto abilità (J)` : `Livello ${s.level}! +1 punto abilità: premi J per spenderlo.`, 'good');
      g.emit('livello', { level: s.level });
    }
    if (s.level >= LIVELLI.max) s.xp = 0;
  }

  titolo(level = this.s.level) { return titolo(level); }

  maxHealth() { return LIVELLI.vitaBase + (this.s.level - 1) * LIVELLI.perLivello.vitaMax + this.bonus('vitaMax'); }

  // ---------- Bonus ----------
  bonus(key) {
    let t = 0;
    for (const [id, g] of Object.entries(this.p.rami)) {
      const r = RAMI[id]; if (!r) continue;
      for (let i = 0; i < g; i++) t += r.gradi[i].bonus[key] || 0;
    }
    for (const slot of SLOT) {
      const v = VESTITI[this.p.equip[slot]];
      if (v) t += v.bonus[key] || 0;
    }
    return t;
  }

  atk() {
    const s = this.s, a = ARMI[this.p.arma] || ARMI.zappa;
    const affil = (this.p.affilatura[this.p.arma] || 0) * AFFILATURA.atk;
    return 7 + s.level * LIVELLI.perLivello.atk + a.atk + affil + this.bonus('atk');
  }
  def() { return 1 + this.s.level * LIVELLI.perLivello.def + this.bonus('def'); }

  // moltiplicatore di fatica dei lavori (livello + abilità + vestiti)
  fatica() {
    const lv = Math.max(LIVELLI.faticaMin, 1 - LIVELLI.faticaPerLivello * (this.s.level - 1));
    return lv * Math.max(0.3, 1 - this.bonus('fatica'));
  }

  // ---------- Abilità ----------
  grado(ramo) { return this.p.rami[ramo] || 0; }
  puoiAlzare(ramo) {
    const g = this.grado(ramo);
    return this.p.punti > 0 && g < 4 && this.s.level >= GRADI_LIVELLO[g];
  }
  alza(ramo) {
    if (!this.puoiAlzare(ramo)) return false;
    this.p.rami[ramo] = this.grado(ramo) + 1; this.p.punti--;
    this.s.maxHealth = this.maxHealth();
    return true;
  }

  // ---------- Armi ----------
  arma() { return ARMI[this.p.arma] ? { id: this.p.arma, ...ARMI[this.p.arma] } : { id: 'zappa', ...ARMI.zappa }; }
  haArma(id) { return this.p.armi.includes(id); }
  daiArma(id) { if (ARMI[id] && !this.haArma(id)) this.p.armi.push(id); }
  impugna(id) { if (this.haArma(id)) this.p.arma = id; }

  // ---------- Vestiti ----------
  haVestito(id) { return this.p.vestiti.includes(id); }
  daiVestito(id, indossa = false) {
    if (!VESTITI[id]) return;
    if (!this.haVestito(id)) this.p.vestiti.push(id);
    if (indossa) this.indossa(id);
  }
  indossa(id) {
    const v = VESTITI[id]; if (!v || !this.haVestito(id)) return;
    this.p.equip[v.slot] = id; this.s.maxHealth = this.maxHealth();
  }
  togli(slot) { this.p.equip[slot] = null; this.s.maxHealth = this.maxHealth(); }
  indossato(slot) { return this.p.equip[slot]; }

  // ---------- Zaino ----------
  ha(id, n = 1) { return (this.s.inv[id] || 0) >= n; }
  dai(id, n = 1) {
    this.s.inv[id] = (this.s.inv[id] || 0) + n;
    this.game.emit('oggetto', { id, n });
  }
  togliOggetto(id, n = 1) {
    if (!this.ha(id, n)) return false;
    this.s.inv[id] -= n;
    this.game.emit('oggetto', { id, n: -n });
    return true;
  }
  // usa un consumabile fuori dal combattimento (dal menu zaino)
  usa(id) {
    const o = OGGETTI[id], s = this.s;
    if (o?.effetto?.gasolio) return !!this.game.attrezzi?.versaTanica();   // tanica di gasolio: nel trattore
    if (!o?.effetto || !this.togliOggetto(id)) return false;
    const e = o.effetto, cure = 1 + this.bonus('cure');
    if (e.health) s.health = Math.min(s.maxHealth, s.health + Math.round(e.health * cure));
    if (e.tired) s.tired = Math.max(0, s.tired + e.tired);
    if (e.stress) s.stress = Math.max(0, s.stress + e.stress);
    return true;
  }
}
