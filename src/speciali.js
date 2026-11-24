// Incontri speciali (GDD capitolo 25):
//  - Il Mostro della Palude: ogni salto sulla riva del laghetto conta; al centesimo esce lui (boss livello 30,
//    dati in src/data/boss.js → BOSS.palude, sprite «zombie» del foglio personaggi). Vinto o no, il contatore riparte.
//  - Babbo Natale smemorato: certe sere alle 20 compare nel bosco a sud (punto bianco sulla minimappa).
//    «Mi segua, nonno» e ti segue; al Night Welcome, dal catalogo di Sandokan, gli paghi una ragazza:
//    in base a chi scegli si ricorda più o meno chi è e ti fa un regalo. Con Madame Svetlana torna Babbo Natale
//    del tutto e ti dà il Bastone di zucchero (arma leggendaria). A mezzanotte, se non l'hai portato, si perde.
// Testi: src/data/speciali.js.
//
// API (game.speciali):
//   mostro()          fa uscire il Mostro della Palude (scontro)
//   babboAppare(x,z)  fa comparire Babbo Natale (senza x,z: in un punto a caso del bosco)
// Eventi: emette  mostroPalude { esito }, babboNatale { ragazza }
// Stato: s.flags.speciali = { salti, paludeVinto, babbo: { stato, giorno, x, z, ultimo, svetlana, volte } }
import * as PIX from './pixel.js';
import { babboFrames, babboMisure } from './sprite_loot.js';
import { PALUDE, BABBO } from './data/speciali.js';
import { BOSS, TESTI_BOSS as T } from './data/boss.js';
import { PARADISO } from './data/vita.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';
import { pagina, pagine, pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Speciali {
  constructor(game) {
    this.game = game;
    this.babbo = null;     // { actor, x, z, dir, walkT }
  }
  get s() { return this.game.s; }
  get st() {
    const f = (this.s.flags ??= {});
    const st = (f.speciali ??= { salti: 0, babbo: {} });
    st.babbo ??= {};
    return st;
  }
  _ora() { return (this.s.minutes / H) % 24; }

  init() {
    const g = this.game;
    g.on('salto', d => this._salto(d));
    g.on('ora', d => this._oraNuova(d.ora));
    g.on('nuovoGiorno', () => this._via(this.st.babbo.stato === 'segue'));
    g.bersagli.push(() => this.bersaglio());
    g.moduli.push({ animate: dt => this.animate(dt) });
    // al Night Welcome, il catalogo di Sandokan ha una voce in più quando il nonno ti segue
    const P = g.paradiso;
    if (P?.catalogo) {
      const orig = P.catalogo.bind(P);
      P.catalogo = async () => (this.st.babbo.stato === 'segue' ? this._welcome(orig) : orig());
    }
    g.pilot?.sezione?.('🎅 Incontri speciali', () => this._prova());
    // ricaricando la partita: il nonno è ancora dove l'avevi lasciato
    const b = this.st.babbo;
    if (b.stato && b.giorno === this.s.day && this._ora() >= BABBO.ora) this._crea(b.x, b.z);
    else if (b.stato) b.stato = null;
  }

  // ---------- Il Mostro della Palude ----------
  _salto(d) {
    if (d.interno || this.game.combat?.active) return;
    const [cx, cz] = PALUDE.centro;
    if (Math.hypot(d.x - cx, d.z - cz) > PALUDE.raggio) return;
    const st = this.st;
    st.salti = (st.salti || 0) + 1;
    const av = PALUDE.avvisi[st.salti];
    if (av) this.game.ui.toast(av, 'bad');
    if (st.salti >= PALUDE.salti) { st.salti = 0; setTimeout(() => this.mostro(), 700); }
  }

  async mostro() {
    const g = this.game, b = BOSS.palude, st = this.st;
    if (g.combat?.active) return;
    st.salti = 0;
    g.ui.shake?.(); g.audio.sfx('bad');
    await g.ui.dialog(pagine(PALUDE.arrivo));
    const res = await g.boss.affronta('palude');
    if (res === 'win') {
      const prima = !st.paludeVinto; st.paludeVinto = true;
      const bt = prima ? b.bottino : b.bottinoRipeti, cose = this._dai(bt);
      g.audio.sfx('coin');
      await g.ui.dialog([...pagine(prima ? b.vittoria : b.vittoriaRipeti), pagina({ testo: fill(T.bottino, { cose: cose.join(', ') }) })]);
      g.emit('bossSconfitto', { id: 'palude', leggenda: false });
    } else if (res === 'lose') {
      this.s.stress = clamp(this.s.stress + 15, 0, 100);
      await g.ui.dialog([pagina({ testo: b.sconfitta })]);
    } else if (res) {
      await g.ui.dialog([pagina({ testo: b.scappato })]);
    }
    g.emit('mostroPalude', { esito: res });
    g.save?.();
    return res;
  }

  // dà un premio { soldi, armi, vestiti, oggetti } e restituisce le etichette
  _dai(p = {}) {
    const g = this.game, cose = [];
    for (const a of p.armi || []) { g.prog.daiArma(a); cose.push(`⭐ ${ARMI[a].nome}`); }
    for (const v of p.vestiti || []) { g.prog.daiVestito(v, !g.prog.indossato(VESTITI[v].slot)); cose.push(`⭐ ${VESTITI[v].nome}`); }
    for (const [o, n] of Object.entries(p.oggetti || {})) { g.prog.dai(o, n); cose.push(`${OGGETTI[o]?.icona || ''} ${OGGETTI[o]?.nome || o}${n > 1 ? ` ×${n}` : ''}`); }
    if (p.soldi) { this.s.money += p.soldi; cose.push(`${p.soldi}€`); }
    return cose;
  }

  // ---------- Babbo Natale smemorato ----------
  _oraNuova(ora) {
    const b = this.st.babbo, s = this.s;
    if (ora === 0 && b.stato) return this._via(b.stato === 'segue');
    if (ora !== BABBO.ora || b.stato || s.day < BABBO.daGiorno) return;
    const inv = this._inverno() ? BABBO.inverno : null;
    if (b.ultimo != null && s.day - b.ultimo < (inv?.pausa ?? BABBO.pausa)) return;
    if (Math.random() < (inv?.probabilita ?? BABBO.probabilita)) this.babboAppare();
  }

  babboAppare(x, z) {
    const W = this.game.world, b = this.st.babbo, [x0, z0, x1, z1] = BABBO.bosco;
    if (x == null) {
      for (let t = 0; t < 60; t++) {
        const px = x0 + Math.random() * (x1 - x0), pz = z0 + Math.random() * (z1 - z0);
        if (!W.blocked(px, pz, 0.3)) { x = px; z = pz; break; }
      }
      if (x == null) return false;
    }
    Object.assign(b, { stato: 'bosco', giorno: this.s.day, x, z });
    this._crea(x, z);
    this.game.ui.toast(this._inverno() ? BABBO.inverno.arrivo : BABBO.arrivo);
    this.game.audio.sfx('level');
    return true;
  }

  _inverno() { return this.game.bestie?.stagione?.() === 'inverno'; }

  _crea(x, z) {
    const W = this.game.world;
    if (this.babbo) this.babbo.actor.remove();
    const fr = babboFrames(), actor = W.actor(fr, { ...babboMisure(), shadow: 0.35 });
    actor.group.position.set(x, 0, z);
    this.babbo = { actor, x, z, dir: -1, walkT: 0 };
    window.__garonio?.minimap?.setMarker('babbo', x, z, '#ffffff');
  }

  _via(perso) {
    const b = this.st.babbo;
    if (this.babbo) { this.babbo.actor.remove(); this.babbo = null; }
    window.__garonio?.minimap?.setMarker('babbo', null);
    if (perso) this.game.ui.toast(BABBO.perso, 'bad');
    if (b.stato) b.stato = null;
  }

  bersaglio() {
    const g = this.game, bb = this.babbo;
    if (!bb || g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position;
    if (Math.hypot(P.x - bb.x, P.z - bb.z) > 1.6) return null;
    const stato = this.st.babbo.stato;
    return { label: stato === 'segue' ? '🎅 Parla col nonnino' : `🎅 ${BABBO.nome}`, fn: () => this._parla() };
  }

  async _parla() {
    const g = this.game, b = this.st.babbo;
    const chi = { name: b.stato === 'segue' ? 'Il nonnino' : BABBO.nome };
    if (b.stato === 'segue') return g.ui.dialog([{ ...chi, text: pick(BABBO.parlaSegue) }]);
    const pp = pagine(BABBO.incontro);
    pp[pp.length - 1].choices = [
      { label: BABBO.scelte.segui, fn: () => { b.stato = 'segue'; g.ui.toast(BABBO.segue, 'good'); return null; } },
      { label: BABBO.scelte.lascia, fn: () => [{ ...chi, text: BABBO.lasciato }] },
    ];
    await g.ui.dialog(pp);
  }

  animate(dt) {
    const bb = this.babbo; if (!bb) return;
    const g = this.game, b = this.st.babbo;
    bb.actor.group.visible = !g.interni?.attivo;
    bb.walkT += dt * 8;
    let cammina = false;
    if (b.stato === 'segue' && !g.interni?.attivo) {
      const P = g.player.group.position, d = Math.hypot(P.x - bb.x, P.z - bb.z);
      if (d > 12) {           // in trattore lo lasci indietro: ti raggiunge (non chiedere come)
        bb.x = P.x - 1.2; bb.z = P.z + 0.4;
      } else if (d > 1.6) {
        const prima = bb.x;
        g.vita?._passo?.(bb, P.x, P.z, d > 5 ? 6.5 : 4, dt);
        if (Math.abs(bb.x - prima) > 0.001) bb.dir = bb.x > prima ? 1 : -1;
        cammina = true;
      }
      b.x = bb.x; b.z = bb.z;
      if (Math.floor(bb.walkT) % 8 === 0) window.__garonio?.minimap?.setMarker('babbo', bb.x, bb.z, '#ffffff');
    }
    bb.actor.group.position.set(bb.x, 0, bb.z);
    const f = cammina ? 1 + (Math.floor(bb.walkT) % 2) : 0;
    bb.actor.setFrame((bb.dir > 0 ? 0 : 3) + f);
  }

  // al Night Welcome: Sandokan, il catalogo e il nonnino
  async _welcome(orig) {
    const g = this.game, s = this.s, W = BABBO.welcome, b = this.st.babbo;
    const san = text => ({ who: 'par_sandokan', name: 'Sandokan, il buttafuori', text });
    const nome = id => PARADISO.catalogo.find(c => c.id === id);
    let scelta = null;
    await g.ui.dialog([{ ...san(W.sandokan), choices: [
      ...['jessica', 'samantha', 'natasha', 'svetlana'].map(id => {
        const c = nome(id);
        return { label: `💋 ${c.nome} · ${c.prezzo}€`, disabled: s.money < c.prezzo, fn: () => { scelta = id; return null; } };
      }),
      { label: '📖 Il catalogo, ma per me', fn: () => { scelta = 'io'; return null; } },
      { label: W.lascia, fn: null },
    ] }]);
    if (scelta === 'io') return orig();
    if (!scelta) return;
    const c = nome(scelta), R = W[scelta];
    if (s.money < c.prezzo) return g.ui.dialog([san(W.pocoSoldi)]);
    s.money -= c.prezzo; s.minutes += 60;
    g.audio.sfx('coin');
    const premio = scelta === 'svetlana' && b.svetlana ? R.premioRipeti : R.premio;
    if (scelta === 'svetlana') b.svetlana = true;
    const cose = [...this._dai(premio), ...(this._inverno() ? this._dai(BABBO.inverno.extra) : [])];
    b.ultimo = s.day; b.volte = (b.volte || 0) + 1;
    this._via(false);
    g.audio.sfx('level');
    await g.ui.dialog([
      ...R.scena.map(t => ({ name: 'Night Welcome', text: t })),
      { name: BABBO.nomeVero, text: `${W.saluto}\n\nRegalo: ${cose.join(', ')}` },
    ]);
    g.emit('babboNatale', { ragazza: scelta });
    g.save?.();
  }

  // ---------- Prove (?pilot) ----------
  _prova() {
    const g = this.game, st = this.st;
    return [
      { label: `🧟 Salti al laghetto: ${st.salti || 0}/${PALUDE.salti} → portali a 99 e vai sulla riva`, fn: () => {
        st.salti = PALUDE.salti - 1; g.boss?._prepara?.(30); g.boss?._vai?.(34, 77.5); return null;
      } },
      { label: '🧟 Combatti subito il Mostro della Palude', fn: () => { g.boss?._prepara?.(30); setTimeout(() => this.mostro(), 50); return null; } },
      { label: '🎅 Fai apparire Babbo Natale qui accanto (ore 20:30)', fn: () => {
        this.s.minutes = Math.floor(this.s.minutes / (24 * H)) * 24 * H + 20.5 * H;
        const P = g.player.group.position;
        this.babboAppare(P.x + 1.4, P.z); return null;
      } },
      { label: '🎅 Fai apparire Babbo Natale nel bosco', fn: () => { this.babboAppare(); return null; } },
    ];
  }
}
