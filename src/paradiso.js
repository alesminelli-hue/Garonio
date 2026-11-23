// Night Paradiso (GDD 10, «Svago serale»): il locale del catalogo, accanto al paese, aperto dalle 20.
// Si sceglie dal catalogo plastificato: più costa, più abbassa lo stress e più esperienza dà.
// Niente scene: una riga e via. A volte capita il «tranvione»: perdi tutti i soldi e la reputazione.
// Testi e prezzi: PARADISO in src/data/vita.js.
//
// API (game.paradiso):
//   apri()          async: il dialogo alla porta (lo fa già il tasto E davanti all'ingresso)
//   reputazione()   reputazione in paese 0-100 (scende col tranvione)
// Eventi mandati: paradiso { id, prezzo, tranvione }
// Stato: s.flags.paradiso = { sera, reputazione, tranvione, visite }
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as SV from './sprite_vita.js';
import { BUILDINGS } from './map.js';
import { PARADISO as D } from './data/vita.js';
import { pick } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Paradiso {
  constructor(game) {
    this.game = game;
    this.t = 0;
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
  }

  reputazione() { return this.f.reputazione; }
  _ora() { return (this.s.minutes / H) % 24; }
  _aperto() { const h = this._ora(); return h >= D.apertura[0] && h < D.apertura[1]; }

  animate(dt) {
    if (!this.neon) return;
    this.t += dt;
    const nf = this.game.vita?.notte() ?? (this._ora() >= 20 ? 1 : 0);
    const flick = this._aperto() ? (Math.sin(this.t * 9) > -0.85 ? 1 : 0.2) : 0.25;
    this.neon.material.opacity = nf * 0.85 * flick;
    this.porta.material.opacity = this._aperto() ? nf * 0.5 : 0;
  }

  _bersaglio() {
    if (this.game.vehicles.driving) return null;
    const P = this.game.player.group.position;
    if (Math.hypot(P.x - D.porta[0], P.z - D.porta[1]) > 1.3) return null;
    return { label: this._aperto() ? 'Entra al Night Paradiso' : 'Night Paradiso (chiuso)', fn: () => this.apri() };
  }

  async apri() {
    const g = this.game, s = this.s, f = this.f;
    const pag = (text, choices) => ({ name: 'Night Paradiso', text, choices });
    if (!this._aperto()) return g.ui.dialog([pag(pick(D.chiuso))]);
    if (f.sera === s.day) return g.ui.dialog([pag(D.giaFatto)]);
    const minimo = Math.min(...D.catalogo.map(c => c.prezzo));
    if (s.money < minimo) return g.ui.dialog([pag(D.troppoPovero)]);
    g.emit('entrato', { edificio: 'paradiso' });

    const catalogo = (text) => pag(text, [
      ...D.catalogo.map(c => ({
        label: `💋 ${c.nome} · ${c.prezzo}€ (stress −${c.stress}, +${c.xp} XP)`,
        disabled: s.money < c.prezzo,
        fn: () => [pag(`${c.nome}. ${c.desc}`, [
          { label: `${D.conferma} (${c.prezzo}€)`, fn: () => this._serata(c, pag) },
          { label: D.indietro, fn: () => [catalogo('Il catalogo, di nuovo. Le pagine si attaccano un po\'.')] },
        ])],
      })),
      { label: 'Esci (e fai finta di niente)', fn: null },
    ]);
    await g.ui.dialog([catalogo(pick(D.benvenuto))]);
  }

  _serata(c, pag) {
    const g = this.game, s = this.s, f = this.f, T = D.tranvione;
    s.money -= c.prezzo; s.minutes += 60; f.sera = s.day; f.visite++;
    g.audio.sfx('coin');
    if (Math.random() < T.probabilita) {
      // il tranvione: via tutti i soldi e la reputazione
      const persi = s.money;
      s.money = 0;
      s.stress = clamp(s.stress + T.stress, 0, 100);
      f.reputazione = clamp(f.reputazione - T.reputazione, 0, 100);
      f.tranvione = s.day;
      if (g.bar?.cambiaRispetto) g.bar.cambiaRispetto(-g.bar.rispetto());
      g.ui.shake(); g.audio.sfx('bad');
      g.emit('paradiso', { id: c.id, prezzo: c.prezzo, tranvione: true });
      return [
        pag(c.esito),
        pag(`${pick(T.testi)}\n\nPersi: ${c.prezzo + persi}€ · Rispetto al bar: 0 · Reputazione in paese −${T.reputazione} · Stress +${T.stress}`),
      ];
    }
    s.stress = clamp(s.stress - c.stress, 0, 100);
    if (c.vita) s.health = clamp(s.health + c.vita, 0, s.maxHealth);
    g._xp(c.xp);
    g.audio.sfx('level');
    g.emit('paradiso', { id: c.id, prezzo: c.prezzo, tranvione: false });
    return [
      pag(c.esito),
      pag(`${pick(D.uscita)}\n\nStress −${c.stress} · +${c.xp} XP${c.vita ? ` · Vita +${c.vita}` : ''}`),
    ];
  }
}
