// Night Paradiso (GDD 10, «Svago serale»): il locale del catalogo, accanto al paese, aperto dalle 20.
// Dentro si esplora come gli altri edifici (motore: src/interni.js): reception con Sandokan e il catalogo,
// bancone di Lola, il Commendatore sul divanetto, pista da ballo, juke-box, il privé e qualche faccia nota.
// Dal catalogo: più costa, più abbassa lo stress e più esperienza dà. Niente scene: una riga e via.
// A volte capita il «tranvione»: perdi tutti i soldi e la reputazione.
// Testi e prezzi: PARADISO, PARADISO_INTERNO, PARADISO_GENTE, PARADISO_TESTI in src/data/vita.js.
//
// API (game.paradiso):
//   apri()          async: entra (o, se chiuso, il cartello sulla porta)
//   catalogo()      async: il catalogo di Sandokan
//   reputazione()   reputazione in paese 0-100 (scende col tranvione)
// Eventi mandati: paradiso { id, prezzo, tranvione }
// Stato: s.flags.paradiso = { sera, reputazione, tranvione, visite, geometra }
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as SV from './sprite_vita.js';
import { BUILDINGS } from './map.js';
import { PARADISO as D, PARADISO_INTERNO, PARADISO_GENTE, PARADISO_TESTI as T, PAESANI } from './data/vita.js';
import { ASPETTO } from './data/dialoghi.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Paradiso {
  constructor(game) {
    this.game = game;
    this.t = 0;
    this.gente = [];
    game.moduli.push(this);
  }
  get s() { return this.game.s; }
  get f() { return this.s.flags.paradiso; }

  init() {
    this.s.flags.paradiso ??= {};
    const f = this.f;
    f.reputazione ??= 50; f.visite ??= 0;
    this.game.bersagli.push(() => this._bersaglio());
    // insegna al neon: alone rosa che lampeggia la sera
    const b = BUILDINGS.find(b => b.id === 'paradiso');
    if (b) {
      const W = this.game.world;
      const neon = new THREE.Sprite(new THREE.SpriteMaterial({ map: PIX.toTexture(SV.alone('255,80,200')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      neon.scale.set(b.w * 0.9, 1.6, 1); neon.position.set(b.x0 + b.w / 2, b.h - 0.5, b.z0 + b.d + 0.45);
      W.scene.add(neon); this.neon = neon;
      const porta = new THREE.Mesh(new THREE.PlaneGeometry(3, 2).rotateX(-Math.PI / 2),
        new THREE.MeshBasicMaterial({ map: PIX.toTexture(SV.alone('200,80,255')), transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }));
      porta.position.set(D.porta[0], 0.04, D.porta[1] + 0.6); W.scene.add(porta); this.porta = porta;
    }
    this._interno();
  }

  // ---------- L'interno ----------
  _interno() {
    const I = this.game.interni; if (!I?.registra) return;
    I.registra('paradiso', PARADISO_INTERNO);
    const W = this.game.world;
    const moreno = PAESANI.find(p => p.id === 'moreno')?.aspetto;
    for (const [id, p] of Object.entries(PARADISO_GENTE)) {
      const aspetto = p.aspetto || (id === 'geometra' ? ASPETTO.geometra : moreno);
      const key = 'par_' + id;
      PIX.CHARACTERS[key] ??= aspetto;
      const a = W.actor(PIX.characterFrames(key), { w: aspetto.w / 16 * 1.25, h: aspetto.h / 16 * 1.25, shadow: 0.35 });
      const w = I.mondo('paradiso', p.x, p.z);
      a.group.position.set(w.x, 0, w.z);
      this.gente.push({ id, key, a, ph: Math.random() * 6 });
    }
    const chi = id => ({ who: 'par_' + id, name: PARADISO_GENTE[id].nome });
    const dice = (id, text, choices) => this.game.ui.dialog([{ ...chi(id), text, choices }]);
    const g = this.game, s = this.s;
    I.aggancia('paradiso:catalogo', () => this.catalogo());
    I.aggancia('paradiso:bancone', () => dice('lola', pick(T.bancone.saluto), [
      ...T.bancone.ordini.map(o => ({ label: o.label, disabled: s.money < o.prezzo, fn: () => {
        s.money -= o.prezzo; s.stress = clamp(s.stress + o.stress, 0, 100); s.tired = clamp(s.tired + (o.stanchezza || 0), 0, 100); s.minutes += 20;
        if (o.xp) g._xp(o.xp);
        g.audio.sfx('eat'); return [{ ...chi('lola'), text: o.testo }];
      } })),
      { label: 'Niente, grazie', fn: null },
    ]));
    I.aggancia('paradiso:divano', () => dice('commendatore', pick(T.commendatore)));
    I.aggancia('paradiso:moreno', () => dice('moreno', pick(T.moreno)));
    I.aggancia('paradiso:geometra', () => {
      if (this.f.geometra === s.day) return dice('geometra', T.geometra.dopo);
      this.f.geometra = s.day; s.money += T.geometra.soldi; g.audio.sfx('coin');
      return dice('geometra', `${T.geometra.primo} (+${T.geometra.soldi}€)`);
    });
    I.aggancia('paradiso:pista', () => {
      const P = T.pista;
      s.stress = clamp(s.stress + P.stress, 0, 100); s.tired = clamp(s.tired + P.stanchezza, 0, 100); s.minutes += 15; g._xp(P.xp);
      g.actT = 0.6; g.actName = 'attack'; g.audio.sfx('level');
      return g.ui.dialog([{ name: 'Pista da ballo', text: P.testo }]);
    });
    I.aggancia('paradiso:jukebox', () => g.ui.dialog([{ name: 'Juke-box', text: T.jukebox.testo, choices: [
      ...T.jukebox.dischi.map(titolo => ({ label: titolo, fn: () => { s.stress = clamp(s.stress - 3, 0, 100); g.audio.sfx('blip'); return [{ name: 'Juke-box', text: fill(T.jukebox.scelto, { titolo }) }]; } })),
      { label: 'Lascia stare', fn: null },
    ] }]));
    I.aggancia('paradiso:prive', () => g.ui.dialog([{ name: 'Privé', text: T.prive }]));
  }

  reputazione() { return this.f.reputazione; }
  // altri pezzi del gioco la fanno salire o scendere (es. src/derisione.js); restituisce il nuovo valore
  cambiaReputazione(d) { const f = this.f; f.reputazione = clamp((f.reputazione ?? 50) + d, 0, 100); return f.reputazione; }
  _ora() { return (this.s.minutes / H) % 24; }
  _aperto() { const h = this._ora(); return h >= D.apertura[0] && h < D.apertura[1]; }

  animate(dt) {
    this.t += dt;
    // la gente dentro si muove un po' (respira, balla)
    for (const p of this.gente) p.a.setFrame((Math.sin(this.t * (p.id === 'moreno' ? 4 : 1.2) + p.ph) > 0.6 ? 1 : 0) + (p.id === 'commendatore' || p.id === 'geometra' ? 3 : 0));
    if (!this.neon) return;
    const nf = this.game.vita?.notte() ?? (this._ora() >= 20 ? 1 : 0);
    const flick = this._aperto() ? (Math.sin(this.t * 9) > -0.85 ? 1 : 0.2) : 0.25;
    this.neon.material.opacity = nf * 0.85 * flick;
    this.porta.material.opacity = this._aperto() ? nf * 0.5 : 0;
  }

  // a mezzanotte il Paradiso chiude: Sandokan ti accompagna fuori
  update() {
    const I = this.game.interni;
    if (I?.attivo && I.edificio === 'paradiso' && !this._aperto() && !this._fuori) {
      this._fuori = true;
      this.game.ui.toast('Sandokan: «Si chiude, campione. Fuori.»');
      I.esci().finally(() => { this._fuori = false; });
    }
  }

  _bersaglio() {
    if (this.game.vehicles.driving) return null;
    const P = this.game.player.group.position;
    if (Math.hypot(P.x - D.porta[0], P.z - D.porta[1]) > 1.3) return null;
    return { label: this._aperto() ? 'Entra al Night Paradiso' : 'Night Paradiso (apre alle 20)', fn: () => this.apri() };
  }

  async apri() {
    const g = this.game;
    if (!this._aperto()) return g.ui.dialog([{ name: 'Night Paradiso', text: pick(D.chiuso) }]);
    if (g.interni?.defs?.paradiso) {
      await g.interni.entra('paradiso', { fuori: { x: D.porta[0], z: D.porta[1] + 0.8 } });
      g.ui.toast(pick(T.entrata));
      return;
    }
    return this.catalogo();   // senza interni: il catalogo direttamente alla porta
  }

  async catalogo() {
    const g = this.game, s = this.s, f = this.f;
    const pag = (text, choices) => ({ who: 'par_sandokan', name: 'Sandokan, il buttafuori', text, choices });
    if (f.sera === s.day) return g.ui.dialog([pag(D.giaFatto)]);
    const minimo = Math.min(...D.catalogo.map(c => c.prezzo));
    if (s.money < minimo) return g.ui.dialog([pag(D.troppoPovero)]);
    const catalogo = (text) => pag(text, [
      ...D.catalogo.map(c => ({
        label: `💋 ${c.nome} · ${c.prezzo}€ (stress −${c.stress}, +${c.xp} XP)`,
        disabled: s.money < c.prezzo,
        fn: () => [pag(`${c.nome}. ${c.desc}`, [
          { label: `${D.conferma} (${c.prezzo}€)`, fn: () => this._serata(c, pag) },
          { label: D.indietro, fn: () => [catalogo('Il catalogo, di nuovo. Le pagine si attaccano un po\'.')] },
        ])],
      })),
      { label: 'Chiudi il catalogo (e fai finta di niente)', fn: null },
    ]);
    await g.ui.dialog([catalogo(pick(D.benvenuto))]);
  }

  _serata(c, pag) {
    const g = this.game, s = this.s, f = this.f, TR = D.tranvione;
    s.money -= c.prezzo; s.minutes += 60; f.sera = s.day; f.visite++;
    g.audio.sfx('coin');
    if (Math.random() < TR.probabilita) {
      // il tranvione: via tutti i soldi e la reputazione
      const persi = s.money;
      s.money = 0;
      s.stress = clamp(s.stress + TR.stress, 0, 100);
      f.reputazione = clamp(f.reputazione - TR.reputazione, 0, 100);
      f.tranvione = s.day;
      if (g.bar?.cambiaRispetto) g.bar.cambiaRispetto(-g.bar.rispetto());
      g.ui.shake(); g.audio.sfx('bad');
      g.emit('paradiso', { id: c.id, prezzo: c.prezzo, tranvione: true });
      return [
        { name: 'Night Paradiso', text: c.esito },
        { name: 'Night Paradiso', text: `${pick(TR.testi)}\n\nPersi: ${c.prezzo + persi}€ · Rispetto al bar: 0 · Reputazione in paese −${TR.reputazione} · Stress +${TR.stress}` },
      ];
    }
    s.stress = clamp(s.stress - c.stress, 0, 100);
    if (c.vita) s.health = clamp(s.health + c.vita, 0, s.maxHealth);
    g._xp(c.xp);
    g.audio.sfx('level');
    g.emit('paradiso', { id: c.id, prezzo: c.prezzo, tranvione: false });
    return [
      { name: 'Night Paradiso', text: c.esito },
      { name: 'Night Paradiso', text: `${pick(D.uscita)}\n\nStress −${c.stress} · +${c.xp} XP${c.vita ? ` · Vita +${c.vita}` : ''}` },
    ];
  }
}
