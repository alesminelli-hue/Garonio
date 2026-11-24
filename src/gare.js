// Gare di trattori sulla capezzagna (GDD 18.2 e 22): sfide di guida vera contro il Patata,
// il cugino Ermes e Mister Frank. Si arriva col trattore alla lavagna vicino al fienile, si sceglie
// il rivale e la posta, conto alla rovescia, e via: si va fino alla bandierina in fondo, si gira e
// si torna. Balle di fieno e fango sulla strada, sportellate dal rivale. Il vincitore prende la posta,
// e al bar lo sanno subito: il rispetto sale o scende. Testi e numeri: GARE in src/data/mercato.js.
//
// API (game.gare):
//   inGara()                 true durante una gara (conto alla rovescia compreso)
//   rivali()                 [{ id, nome, posta, quota }] chi si può sfidare (per le scommesse)
//   lavagna()                async: il menu delle sfide (lo fa già il tasto E vicino alla lavagna)
//   sfida(id)                async: parte la gara contro quel rivale (serve essere sul trattore)
// Eventi mandati: gara { rivale, esito: 'vinta' | 'persa' | 'ritirato', tempo, posta }
// Stato: s.flags.gare = { corse: { rivale: giorno }, vittorie: { rivale: n }, sconfitte: { rivale: n } }
import * as THREE from 'three';
import * as PIX from './pixel.js';
import * as SM from './sprite_mercato.js';
import { vehicleArt, VPX, TRACTOR_WIN } from './vehicle_sprites.js';
import { GARE as G } from './data/mercato.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const tempo = t => `${Math.floor(t / 60)}:${(t % 60).toFixed(1).padStart(4, '0')}`;

const CSS = `
#gara-hud{position:fixed;top:calc(env(safe-area-inset-top) + 8px);left:50%;transform:translateX(-50%);z-index:30;
  background:rgba(26,20,32,.88);color:#f4efe2;border:2px solid #f0d050;border-radius:8px;padding:6px 12px;
  font:bold 14px/1.3 monospace;text-align:center;pointer-events:none;white-space:nowrap}
#gara-hud .pos{font-size:20px;color:#f0d050;margin-right:8px}
#gara-hud .dir{display:block;font-size:12px;color:#cfe6f0}
#gara-conto{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;z-index:31;pointer-events:none;
  font:bold 22vmin/1 monospace;color:#f0d050;text-shadow:0 0 0 #1a1420,4px 4px 0 #1a1420,-2px -2px 0 #1a1420}
#gara-conto.via{color:#62d050}
#gara-hud[hidden],#gara-conto[hidden]{display:none}
@media (max-width:700px){#gara-hud{top:27%;font-size:12px;padding:4px 10px}#gara-hud .pos{font-size:16px}#gara-hud .dir{font-size:11px}}
`;

export class Gare {
  constructor(game) {
    this.game = game;
    this.r = null;            // gara in corso
    this.t = 0;
    game.moduli.push(this);
  }
  get s() { return this.game.s; }
  get f() { return this.s.flags.gare; }

  init() {
    const g = this.game, W = g.world;
    this.s.flags.gare ??= {};
    const f = this.f; f.corse ??= {}; f.vittorie ??= {}; f.sconfitte ??= {};
    // lavagna delle sfide e striscione del traguardo
    const L = G.lavagna;
    const lav = SM.lavagnaGare();
    const ls = W.sprite(lav, { w: lav.width / PIX.PX, h: lav.height / PIX.PX });
    ls.position.set(L.x, 0, L.z); W.scene.add(ls);
    W.solids.push({ x0: L.x - 0.5, z0: L.z - 0.1, x1: L.x + 0.5, z1: L.z + 0.1 });
    const st = SM.striscione('GARE');
    const ss = W.sprite(st, { w: 4, h: 3.5 });
    ss.position.set(G.partenza.x, 0, G.partenza.z - 0.4); W.scene.add(ss);
    ss.material.depthWrite = false; ss.renderOrder = 1;
    const fl = SM.bandierina('#f0d050');
    this.boa = W.sprite(fl, { w: fl.width / PIX.PX, h: fl.height / PIX.PX });
    this.boa.position.set(G.boa.x + 1.2, 0, G.boa.z - 2.2); W.scene.add(this.boa);
    // DOM
    const style = document.createElement('style'); style.textContent = CSS; document.head.appendChild(style);
    this.hud = document.createElement('div'); this.hud.id = 'gara-hud'; this.hud.hidden = true; document.body.appendChild(this.hud);
    this.conto = document.createElement('div'); this.conto.id = 'gara-conto'; this.conto.hidden = true; document.body.appendChild(this.conto);
    // alla guida, il tasto E guarda prima la lavagna (e in gara non fa scendere per sbaglio)
    const V = g.vehicles, orig = V.target.bind(V);
    V.target = () => this.r ? null : (this._bersaglioGuida() || orig());   // in gara il tasto E non fa scendere
    g.bersagli.push(() => this._bersaglio());
    g.pilot?.sezione?.('Gare di trattori', () => this._pilot());
  }

  inGara() { return !!this.r; }

  // ---------- Lavagna ----------
  _vicinoLavagna() {
    const P = this.game.player.group.position;
    return Math.hypot(P.x - G.lavagna.x, P.z - G.lavagna.z) < 2.4;
  }
  _bersaglio() {
    if (this.r || !this._vicinoLavagna()) return null;
    return { label: 'Lavagna delle gare di trattori', fn: () => this.lavagna() };
  }
  _bersaglioGuida() {
    if (!this._vicinoLavagna()) return null;
    return { label: '🏁 Lavagna delle gare: sfida qualcuno', fn: () => this.lavagna() };
  }

  _ostacolo(id) {
    const s = this.s, R = G.rivali[id], T = G.testi, h = (s.minutes / H) % 24;
    const rispetto = this.game.bar?.rispetto?.() ?? 0;
    if (h < G.ore[0] || h >= G.ore[1]) return T.chiusa;
    if (s.day < R.daGiorno) return fill(T.nonPronto, R);
    if (this.f.corse[id] === s.day) return fill(T.giaCorso, R);
    if (rispetto < R.rispettoMinimo) return fill(T.poveroRispetto, { nome: R.nome, n: R.rispettoMinimo, r: rispetto });
    if (s.money < R.posta) return fill(T.senzaSoldi, R);
    return null;
  }

  // quota per le scommesse su te stesso: più il rivale è forte, più paga
  _velocita(id) { const R = G.rivali[id]; return R.velocita * (1 + Math.min(G.allenamentoMax, (this.f.vittorie[id] || 0) * G.allenamento) / 10); }
  rivali() {
    return Object.entries(G.rivali).filter(([id, R]) => this.s.day >= R.daGiorno).map(([id, R]) => ({
      id, nome: R.nome, posta: R.posta, quota: +(1 + (this._velocita(id) - 4.4) * 0.9).toFixed(1),
    }));
  }

  async lavagna() {
    const g = this.game, T = G.testi;
    const choices = Object.entries(G.rivali).map(([id, R]) => {
      const no = this._ostacolo(id);
      const v = this.f.vittorie[id] || 0, p = this.f.sconfitte[id] || 0;
      return { label: `${R.nome} · posta ${R.posta}€ · ${v}V ${p}P${no ? ' 🚫' : ''}`, fn: () => { this._scelto = id; return null; } };
    });
    choices.push({ label: 'Lascia perdere', fn: null });
    this._scelto = null;
    await g.ui.dialog([{ name: 'Lavagna delle gare', text: T.lavagna, choices }]);
    if (this._scelto) await this.sfida(this._scelto);
  }

  async sfida(id) {
    const g = this.game, R = G.rivali[id], T = G.testi, v = g.vehicles.driving;
    const no = this._ostacolo(id);
    if (no) { await g.ui.dialog([{ who: id, name: R.nome, text: no }]); return; }
    if (!v || v.kind !== 'trattore') { await g.ui.dialog([{ who: id, name: R.nome, text: T.serveTrattore }]); return; }
    if (v.st.cond < 15 || (g.attrezzi?.gasolio?.(v.id) ?? 100) < 5) { await g.ui.dialog([{ who: id, name: R.nome, text: T.rotto }]); return; }
    let ok = false;
    await g.ui.dialog([{ who: id, name: R.nome, text: R.sfida, choices: [
      { label: `Accetta (posta ${R.posta}€, chi vince prende tutto)`, fn: () => { ok = true; return null; } },
      { label: 'Ci ho ripensato', fn: null },
    ] }]);
    if (ok) this._via(id, v);
  }

  // ---------- Preparazione ----------
  _arteRivale(id, colore) {
    const art = vehicleArt('trattore', colore);
    const o = PIX.CHARACTERS[id] || PIX.CHARACTERS.bullo;
    const pilota = PIX.humanoid(o, 0);
    const conPilota = (c, win) => {
      const [n, g] = PIX.makeCanvas(c.width, c.height);
      g.drawImage(c, 0, 0);
      g.save(); g.beginPath(); g.rect(...win); g.clip();
      g.drawImage(pilota, win[0] + win[2] / 2 - pilota.width / 2, win[1] + 2);
      g.restore();
      return n;
    };
    const R = conPilota(art.R[0], TRACTOR_WIN.R);
    return {
      R, L: PIX.mirror(R),
      F: conPilota(art.F[0], TRACTOR_WIN.F),
      B: conPilota(art.B[0], TRACTOR_WIN.B),
    };
  }

  _via(id, v) {
    const g = this.game, W = g.world, R = G.rivali[id], A = G.partenza;
    // il trattore di Garonio sulla linea di partenza
    v.st.x = A.x - 1.5; v.st.z = G.corsie.ritorno; v.st.h = 0; v.speed = 0; v.view = null;
    g.player.group.position.set(v.st.x, 0, v.st.z);
    // il rivale accanto
    const art = this._arteRivale(id, R.colore);
    const tex = {}; for (const k of ['R', 'L', 'F', 'B']) tex[k] = PIX.toTexture(art[k]);
    const spr = W.sprite(tex.R, { w: art.R.width / VPX, h: art.R.height / VPX });
    const grp = new THREE.Group(); grp.add(spr);
    const sh = new THREE.Mesh(new THREE.CircleGeometry(1, 16).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0, transparent: true, opacity: 0.28, depthWrite: false }));
    sh.scale.set(1.4, 1, 0.65); sh.position.y = 0.02; grp.add(sh);
    W.scene.add(grp);
    const ai = { x: A.x - 1.5, z: G.corsie.andata, h: 0, v: 0, wp: 0, grp, spr, tex, art, view: 'R', fase: 0, quirkT: 3 + Math.random() * 3, effT: 0, eff: 1, finito: null };
    ai.path = [
      { x: G.boa.x, z: G.corsie.andata }, { x: G.boa.x + 1.7, z: G.boa.z }, { x: G.boa.x, z: G.corsie.ritorno }, { x: A.x - 6, z: G.corsie.ritorno },
    ];
    // ostacoli
    const ost = [];
    const libero = x => ost.every(o => Math.abs(o.x - x) > 6);
    const bt = PIX.toTexture(PIX.hayBale()), mt = PIX.toTexture(SM.pozzaFango());
    for (let i = 0; i < G.fango; i++) {
      let x; do x = 70 + Math.random() * 50; while (!libero(x));
      const m = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: mt, transparent: true, depthWrite: false }));
      m.position.set(x, 0.03, G.partenza.z); W.scene.add(m);
      ost.push({ tipo: 'fango', x, z: G.partenza.z, obj: m });
    }
    for (let i = 0; i < G.balle; i++) {
      let x, n = 0; do x = 68 + Math.random() * 54; while (!libero(x) && ++n < 30);
      const z = Math.random() < 0.5 ? G.corsie.andata : G.corsie.ritorno;
      const sp = W.sprite(bt, { w: 1.5, h: 1.375 }); sp.position.set(x, 0, z); W.scene.add(sp);
      ost.push({ tipo: 'balla', x, z, obj: sp, vola: 0 });
    }
    this.r = { id, R, v, ai, ost, t: 0, conto: 3.6, fase: 0, bumpT: 0, battutaT: 0, finito: false };
    this.f.corse[id] = this.s.day;
    this.game.locked = true;
    this.hud.hidden = false;
    this.game.ui.toast(R.partenza);
    this.game.audio.sfx('engine');
  }

  // ---------- Durante la gara ----------
  animate(dt) {
    const r = this.r; if (!r) return;
    this.t += dt;
    // conto alla rovescia (il gioco è fermo)
    if (r.conto > 0) {
      const prima = Math.ceil(r.conto - 0.6);
      r.conto -= dt;
      const n = Math.ceil(r.conto - 0.6);
      this.conto.hidden = false;
      if (n > 0) { this.conto.textContent = n; this.conto.classList.remove('via'); if (n !== prima) this.game.audio.sfx('blip'); }
      else { this.conto.textContent = G.testi.via; this.conto.classList.add('via'); if (prima > 0) { this.game.audio.sfx('level'); this.game.locked = false; } }
      if (r.conto <= 0) this.conto.hidden = true;
    }
    // balle che volano via
    for (const o of r.ost) if (o.tipo === 'balla' && o.vola > 0) {
      o.vola -= dt; o.obj.position.y += dt * 3 - (0.6 - o.vola) * dt * 8; o.obj.position.x += o.dx * dt * 4; o.obj.position.z -= dt * 2;
      if (o.vola <= 0) o.obj.visible = false;
    }
    this._posaAi(r.ai);
    this._hud();
  }

  update(dt) {
    const r = this.r; if (!r || r.conto > 0.6 || r.finito) return;
    const g = this.game, v = r.v;
    r.t += dt;
    // ritiro: sceso dal trattore, trattore rotto, troppo lontano dalla capezzagna
    if (g.vehicles.driving !== v || v.st.cond <= 0 || Math.abs(v.st.z - G.partenza.z) > G.ritiro) return this._fine('ritirato');
    this._aiMuovi(r.ai, dt);
    // fasi di Garonio
    if (r.fase === 0 && v.st.x >= G.boa.x - 0.3) { r.fase = 1; g.ui.float(G.testi.traguardo); g.audio.sfx('blip'); }
    if (r.fase === 1 && v.st.x <= G.partenza.x) return this._fine(r.ai.finito ? 'persa' : 'vinta');
    if (r.ai.finito && !r.aiArrivato) { r.aiArrivato = true; g.ui.toast(`${r.R.nome} ha tagliato il traguardo!`, 'bad'); }
    // ostacoli
    for (const o of r.ost) {
      const dx = v.st.x - o.x, dz = v.st.z - o.z;
      if (o.tipo === 'balla' && !o.vola && Math.abs(dx) < 1.1 && Math.abs(dz) < 0.75) {
        o.vola = 0.6; o.dx = Math.sign(v.speed || 1);
        v.speed *= 0.35; v.st.cond = clamp(v.st.cond - 2, 0, 100);
        g.ui.shake(); g.audio.sfx('crash'); g.ui.float(G.testi.balla);
      }
      if (o.tipo === 'fango' && Math.abs(dx) < 1.3 && Math.abs(dz) < 0.8) {
        if (Math.abs(v.speed) > 3) { v.speed = Math.sign(v.speed) * 3; if (!o.avvisato) { o.avvisato = true; g.ui.float(G.testi.fango); } }
      }
    }
    // sportellate col rivale
    const a = r.ai;
    r.bumpT -= dt;
    if (Math.abs(v.st.x - a.x) < 2.1 && Math.abs(v.st.z - a.z) < 1.1) {
      const dir = Math.sign(v.st.z - a.z) || 1;
      const nz = v.st.z + dir * dt * 2.5;
      if (g.vehicles._free(v, v.st.x, nz)) v.st.z = nz;
      a.z -= dir * dt * 1.2;
      v.speed *= 0.985; a.v *= 0.985;
      if (r.bumpT <= 0) { r.bumpT = 4; g.ui.shake(); g.audio.sfx('crash'); g.ui.float(fill(G.testi.sportellata, r.R)); }
    }
    // battute del rivale
    r.battutaT -= dt;
  }

  _aiMuovi(a, dt) {
    const r = this.r, R = r.R, v = r.v;
    if (a.finito) { a.v = Math.max(0, a.v - dt * 4); a.x += Math.cos(a.h) * a.v * dt; return; }
    const p = a.path[a.wp];
    const dx = p.x - a.x, dz = p.z - a.z, d = Math.hypot(dx, dz);
    if (d < 0.6) {
      a.wp++;
      if (a.wp === 1) a.fase = 1;
      if (a.wp >= a.path.length) { a.finito = true; return; }
      return;
    }
    const want = Math.atan2(dz, dx);
    let diff = want - a.h; while (diff > Math.PI) diff -= Math.PI * 2; while (diff < -Math.PI) diff += Math.PI * 2;
    a.h += clamp(diff, -2.8 * dt, 2.8 * dt);
    // velocità: base, allenamento, curva alla boa, capricci, elastico
    let max = this._velocita(r.id) * a.eff;
    if (Math.abs(diff) > 0.5) max = Math.min(max, 2.2);
    if (Math.hypot(a.x - G.boa.x, a.z - G.boa.z) < 2.5) max = Math.min(max, 2.6);
    const gap = this._punti(a.x, a.fase) - this._punti(v.st.x, r.fase);
    if (gap > 12) max *= 0.92; else if (gap < -12) max *= 1.06;
    a.v += clamp(max - a.v, -6 * dt, 3.5 * dt);
    a.x += Math.cos(a.h) * a.v * dt; a.z += Math.sin(a.h) * a.v * dt;
    // ostacoli sulla sua corsia: a volte li prende
    for (const o of r.ost) {
      if (o.tipo !== 'balla' || o.vola || o.aiVisto) continue;
      if (Math.abs(a.x - o.x) < 1.1 && Math.abs(a.z - o.z) < 0.75) {
        o.aiVisto = true;
        if (Math.random() < 0.4) { o.vola = 0.6; o.dx = Math.sign(Math.cos(a.h)) || 1; a.v *= 0.35; } else a.v *= 0.75;
      }
    }
    // capricci del rivale (battute)
    a.effT -= dt; if (a.effT <= 0) a.eff = 1;
    a.quirkT -= dt;
    if (a.quirkT <= 0) {
      a.quirkT = 5 + Math.random() * 5;
      const boost = r.id === 'frank' && Math.random() < 0.5;
      a.eff = boost ? 1.15 : 0.55; a.effT = boost ? 2 : 1.3;
      if (Math.hypot(a.x - v.st.x, a.z - v.st.z) < 25) this.game.ui.float(pick(R.battute));
    }
  }

  _punti(x, fase) { return fase === 0 ? x - G.partenza.x : (G.boa.x - G.partenza.x) * 2 - (x - G.partenza.x); }

  _posaAi(a) {
    const cx = Math.cos(a.h), cz = Math.sin(a.h);
    const view = Math.abs(cx) >= Math.abs(cz) ? (cx >= 0 ? 'R' : 'L') : (cz > 0 ? 'F' : 'B');
    if (view !== a.view) {
      a.view = view;
      a.spr.material.map = a.tex[view]; a.spr.material.needsUpdate = true;
      a.spr.scale.set(a.art[view].width / VPX, a.art[view].height / VPX, 1);
    }
    a.spr.position.y = a.v > 0.5 ? (Math.floor(this.t * 14) % 2) / VPX : 0;
    a.grp.position.set(a.x, 0, a.z);
  }

  _hud() {
    const r = this.r, v = r.v;
    const mio = r.finito ? 0 : this._punti(v.st.x, r.fase), suo = r.ai.finito ? 1e9 : this._punti(r.ai.x, r.ai.fase);
    const pos = mio >= suo ? '1°' : '2°';
    const corto = innerWidth < 700;
    const dir = r.fase === 0 ? `→ ${corto ? 'Alla bandierina e indietro' : G.testi.boa}` : `← ${G.testi.traguardo}`;
    const html = `<span class="pos">${pos}</span>🚜 vs ${innerWidth < 700 ? r.R.nome.replace(/^(Il cugino|Il|Mister) /, '') : r.R.nome} · ${tempo(r.t)}<span class="dir">${dir}</span>`;
    if (html !== this._html) { this.hud.innerHTML = html; this._html = html; }
  }

  // ---------- Arrivo ----------
  async _fine(esito) {
    const r = this.r; if (!r || r.finito) return;
    r.finito = true;
    const g = this.game, s = this.s, R = r.R, T = G.testi, f = this.f;
    g.locked = false;
    const vinta = esito === 'vinta';
    const rr = vinta ? R.rispetto : Math.ceil(R.rispetto / 2);
    if (vinta) {
      s.money += R.posta; f.vittorie[r.id] = (f.vittorie[r.id] || 0) + 1;
      for (const [o, n] of Object.entries(R.premio || {})) g.prog.dai(o, n);
      g._xp?.(8 + R.posta / 5);
      g.audio.sfx('level');
    } else {
      s.money = Math.max(0, s.money - R.posta); f.sconfitte[r.id] = (f.sconfitte[r.id] || 0) + 1;
      s.stress = clamp(s.stress + 6, 0, 100);
      g.audio.sfx('bad');
    }
    g.bar?.cambiaRispetto?.(vinta ? rr : -rr);
    s.minutes += 20;
    const testo = esito === 'ritirato' ? fill(T.ritirato, R) : vinta ? R.vinta : R.persa;
    const conto = fill(vinta ? T.vinto : T.perso, { posta: R.posta, r: rr, tempo: tempo(r.t) });
    g.emit('gara', { rivale: r.id, esito, tempo: r.t, posta: R.posta });
    this.hud.hidden = true; this.conto.hidden = true;
    await g.ui.dialog([{ who: r.id, name: R.nome, text: testo }, { name: '🏁 Gara', text: conto }]);
    this._pulisci();
  }

  _pulisci() {
    const r = this.r; if (!r) return;
    const W = this.game.world;
    W.scene.remove(r.ai.grp); W.spriteMats?.delete?.(r.ai.spr.material);
    for (const o of r.ost) { W.scene.remove(o.obj); W.spriteMats?.delete?.(o.obj.material); }
    this.r = null;
  }

  // ---------- Pilot di prova (?pilot) ----------
  _pilot() {
    const g = this.game, s = this.s;
    const ok = t => [{ name: '🧪 Pilot', text: t }];
    const pronto = () => {
      const V = g.vehicles;
      if (V.driving?.kind !== 'trattore') { V.driving && V.dismount(true); const t = V.get('trattore1'); t.st.cond = 100; V._mount(t); }
      const t = V.driving; t.st.x = G.lavagna.x - 1; t.st.z = G.partenza.z; t.st.h = 0;
      g.player.group.position.set(t.st.x, 0, t.st.z);
      if (s.minutes < G.ore[0] * H || s.minutes >= G.ore[1] * H) s.minutes = 10 * H;
      s.money = Math.max(s.money, 100);
      this.f.corse = {};
    };
    return [
      { label: '🏁 Vai alla lavagna delle gare col trattore', fn: () => { pronto(); return ok('Sei sul trattore rosso davanti alla lavagna delle gare. Premi E.'); } },
      ...Object.entries(G.rivali).map(([id, R]) => ({ label: `🚜 Gara subito con ${R.nome}`, fn: () => {
        pronto(); if (s.day < R.daGiorno) s.day = R.daGiorno;
        if ((g.bar?.rispetto?.() ?? 0) < R.rispettoMinimo) g.bar?.provaRispetto?.(R.rispettoMinimo);
        setTimeout(() => this._via(id, g.vehicles.driving), 50);
        return null;
      } })),
    ];
  }
}
