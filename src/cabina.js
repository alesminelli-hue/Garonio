// Easter egg (GDD 20.5): la cabina della corrente in fondo alla capezzagna.
// Schiantarsi con la Punto o la Vespa sopra una certa velocità distrugge il mezzo, lampi e scintille,
// Vita −20 e un bottino: 60% niente, 30% soldi e oggetti comuni, 10% un oggetto leggendario non ancora trovato.
// Poi la cabina si ricarica per 3 giorni (lucina rossa che lampeggia = carica).
//
// API (game.cabina):  carica()  ·  pos  { x, z }
// Eventi: ascolta 'urto' (da vehicles.js); manda 'cabina' { esito: 'niente' | 'comune' | 'leggendario' | 'scarica', id }.
// Stato: s.flags.cabina = { prossima: giorno da cui è di nuovo carica, trovati: [id], schianti }
import * as THREE from 'three';
import * as PIX from './pixel.js';
import { CABINA as C } from './data/officina.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const randi = (a, b) => a + Math.floor(Math.random() * (b - a + 1));

function cabinaArt() {
  const [c, g] = PIX.makeCanvas(30, 34);
  const R = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  R('#2a2e34', 1, 4, 28, 30);              // contorno
  R('#8e969c', 2, 5, 26, 28);              // cemento
  R('#a8b0b6', 2, 5, 26, 3);               // luce in alto
  R('#6e767c', 2, 30, 26, 3);              // zoccolo
  R('#5a6268', 0, 2, 30, 4);               // tettuccio
  R('#747c82', 1, 2, 28, 2);
  R('#4a6a5a', 5, 11, 12, 19);             // porta di lamiera verde
  R('#3a5648', 5, 11, 12, 1);
  for (let y = 13; y < 28; y += 3) R('#2e463a', 7, y, 8, 1); // feritoie
  R('#c8c050', 15, 20, 1, 2);              // maniglia
  // cartello giallo col teschio
  g.fillStyle = '#1a1a1a'; g.beginPath(); g.moveTo(23, 10); g.lineTo(28, 19); g.lineTo(18, 19); g.closePath(); g.fill();
  g.fillStyle = '#f4d020'; g.beginPath(); g.moveTo(23, 11.5); g.lineTo(26.8, 18.3); g.lineTo(19.2, 18.3); g.closePath(); g.fill();
  R('#1a1a1a', 22, 14, 3, 2); R('#1a1a1a', 22.5, 16, 2, 1);  // teschio
  R('#f4d020', 22.4, 14.6, 0.8, 0.8); R('#f4d020', 23.8, 14.6, 0.8, 0.8);
  // "380V" e fulmine
  R('#f4d020', 19, 22, 8, 5); g.fillStyle = '#1a1a1a'; g.font = 'bold 5px monospace'; g.textBaseline = 'top'; g.fillText('380V', 19, 22);
  R('#3a3a3a', 4, 0, 2, 3); R('#3a3a3a', 24, 0, 2, 3); // isolatori
  return c;
}

function scintilla() {
  const [c, g] = PIX.makeCanvas(4, 4);
  g.fillStyle = '#fffbe0'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2);
  g.fillStyle = '#ffe040'; g.fillRect(1, 1, 2, 2);
  return c;
}

export class Cabina {
  constructor(game) {
    this.game = game;
    this.pos = { x: C.x, z: C.z };
    this.sparks = [];
    this.t = 0;
    game.moduli.push(this);
    game.bersagli.push(() => this._bersaglio());
    game.on('urto', e => this._urto(e));
    this._build();
  }

  get s() { return this.game.s; }
  get f() { const f = (this.s.flags.cabina ??= {}); f.prossima ??= 0; f.trovati ??= []; f.schianti ??= 0; return f; }
  carica() { return this.s.day >= this.f.prossima; }

  _build() {
    const W = this.game.world, art = cabinaArt();
    this.spr = W.sprite(art, { w: art.width / PIX.PX * 1.15, h: art.height / PIX.PX * 1.15 });
    this.spr.position.set(C.x, 0, C.z);
    W.scene.add(this.spr);
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(C.w + 0.4, C.d + 0.3).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.3, depthWrite: false }));
    sh.position.set(C.x, 0.02, C.z); W.scene.add(sh);
    W.solids.push({ x0: C.x - C.w / 2, z0: C.z - C.d / 2, x1: C.x + C.w / 2, z1: C.z + C.d / 2 });
    // lucina rossa: lampeggia quando la cabina è carica
    const [lc, lg] = PIX.makeCanvas(4, 4); lg.fillStyle = '#ff3020'; lg.fillRect(0, 0, 4, 4); lg.fillStyle = '#ffb0a0'; lg.fillRect(1, 1, 1, 1);
    this.luce = new THREE.Sprite(new THREE.SpriteMaterial({ map: PIX.toTexture(lc), depthWrite: false }));
    this.luce.scale.set(0.22, 0.22, 1);
    this.luce.position.set(C.x - 0.55, art.height / PIX.PX * 1.15 + 0.05, C.z + 0.05);
    W.scene.add(this.luce);
    this._sparkTex = PIX.toTexture(scintilla());
  }

  // ---------- Ogni fotogramma ----------
  animate(dt) {
    this.t += dt;
    this.luce.visible = this.carica() && Math.floor(this.t * 2.5) % 2 === 0;
    // da carica, ogni tanto sfrigola
    if (this.carica() && Math.random() < dt * 0.6) this._scintille(2, 0.6);
    for (const p of [...this.sparks]) {
      p.life -= dt;
      p.vy -= 9 * dt;
      p.s.position.x += p.vx * dt; p.s.position.y = Math.max(0.05, p.s.position.y + p.vy * dt); p.s.position.z += p.vz * dt;
      p.s.material.opacity = clamp(p.life / p.max, 0, 1);
      if (p.life <= 0) { this.game.world.scene.remove(p.s); p.s.material.dispose(); this.sparks.splice(this.sparks.indexOf(p), 1); }
    }
    if (this.zap) {
      this.zap.t -= dt;
      const P = this.game.player.group.position;
      this.zap.s.position.set(P.x + 0.4, 1.9 + Math.sin(this.t * 30) * 0.05, P.z);
      if (this.zap.t <= 0) { this.game.world.scene.remove(this.zap.s); this.zap = null; }
    }
  }

  _scintille(n, forza = 1) {
    for (let i = 0; i < n && this.sparks.length < 60; i++) {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: this._sparkTex, transparent: true, depthWrite: false }));
      s.scale.setScalar(0.18 + Math.random() * 0.12);
      s.position.set(C.x + (Math.random() - 0.5) * C.w, 0.6 + Math.random() * 1.4, C.z + C.d / 2 + 0.05);
      const a = Math.random() * Math.PI * 2, sp = (1.5 + Math.random() * 3) * forza;
      this.game.world.scene.add(s);
      this.sparks.push({ s, vx: Math.cos(a) * sp, vy: 2 + Math.random() * 3 * forza, vz: Math.sin(a) * sp * 0.5 + 0.5, life: 0.6 + Math.random() * 0.6, max: 1.2 });
    }
  }

  _bersaglio() {
    const P = this.game.player.group.position;
    if (this.game.vehicles.driving || Math.hypot(P.x - C.x, P.z - (C.z + C.d / 2)) > 1.4) return null;
    return { label: 'Guarda la cabina della corrente', fn: () => { this.game.ui.toast(this.carica() ? C.testi.ronzio : C.testi.spenta); if (this.carica()) this._scintille(3, 0.5); } };
  }

  // ---------- Lo schianto ----------
  _urto(e) {
    if (e.tipo !== 'vespa' && e.tipo !== 'punto') return;
    if (!e.velocita || e.velocita < C.velocita) return;
    const v = this.game.vehicles.get(e.mezzo); if (!v) return;
    const [hx, hz] = v.T.box;
    const dx = Math.max(0, Math.abs(e.x - C.x) - C.w / 2 - hx), dz = Math.max(0, Math.abs(e.z - C.z) - C.d / 2 - hz);
    if (Math.hypot(dx, dz) > 0.6) return;
    e.gestito = true;
    this._schianto(v);
  }

  _schianto(v) {
    const g = this.game, s = this.s, f = this.f, T = C.testi;
    const nome = v.T.name;
    v.st.cond = 0; v.speed = 0;
    if (v.kind === 'punto') v.st.flat = true;
    g.vehicles.dismount(true);
    f.schianti++;
    // lampo bianco, scossa, scintille
    this._lampo();
    g.ui.shake(); g.audio.sfx('crash'); setTimeout(() => g.audio.sfx('bad'), 180);
    navigator.vibrate?.([60, 40, 120]);
    this._scintille(40, 1.4);
    const isolato = g.prog.bonus('scosse') > 0;
    if (!isolato) s.health = clamp(s.health - C.vita, 1, s.maxHealth);
    s.stress = clamp(s.stress + 8, 0, 100);
    this._capelliDritti();
    g.ui.toast(isolato ? T.isolato : T.schianto, 'bad');
    g.ui.toast(T.distrutto(nome), 'bad');
    // la Vigilessa nei paraggi
    if (g.vigilessa?.vede(C.x, C.z)) g.vigilessa.multa('cabina');
    // bottino
    if (!this.carica()) { g.ui.toast(T.scarica, 'bad'); g.emit('cabina', { esito: 'scarica' }); return; }
    f.prossima = s.day + C.ricarica;
    const forza = this._forza; this._forza = null;
    const r = Math.random();
    const esito = forza || (r < C.bottino.leggendario ? 'leggendario' : r < C.bottino.leggendario + C.bottino.comune ? 'comune' : 'niente');
    setTimeout(() => this._bottino(esito), 900);
  }

  _bottino(esito) {
    const g = this.game, s = this.s, f = this.f, T = C.testi;
    if (esito === 'leggendario') {
      const liberi = C.leggendari.filter(l => l.tipo === 'arma' ? !g.prog.haArma(l.id) : !g.prog.haVestito(l.id));
      if (!liberi.length) { const euro = randi(80, 150); s.money += euro; g.audio.sfx('coin'); g.ui.toast(T.tuttoTrovato(euro), 'good'); g.emit('cabina', { esito: 'comune' }); return; }
      const l = liberi[Math.random() * liberi.length | 0];
      if (l.tipo === 'arma') g.prog.daiArma(l.id); else g.prog.daiVestito(l.id);
      f.trovati.push(l.id);
      const nome = (l.tipo === 'arma' ? ARMI : VESTITI)[l.id].nome;
      g.audio.sfx('level');
      this._scintille(30, 1.8);
      g.ui.dialog([{ name: '★ Bottino leggendario ★', text: `${T.leggendario(nome)} ${VESTITI[l.id]?.desc ?? 'Attacco +12, la mossa «Scossa» colpisce tutti e stordisce.'} Lo trovi nel menu di Garonio (J).` }]);
      g.emit('cabina', { esito, id: l.id });
    } else if (esito === 'comune') {
      const euro = randi(C.soldi[0], C.soldi[1]);
      const id = C.comuni[Math.random() * C.comuni.length | 0], n = randi(1, 2);
      s.money += euro; g.prog.dai(id, n);
      g.audio.sfx('coin');
      g.ui.toast(T.comune(euro, `${n} × ${OGGETTI[id]?.icona ?? ''} ${OGGETTI[id]?.nome ?? id}`), 'good');
      g.emit('cabina', { esito, id });
    } else {
      g.ui.toast(T.niente, 'bad');
      g.emit('cabina', { esito: 'niente' });
    }
  }

  _lampo() {
    let el = document.getElementById('lampo');
    if (!el) {
      el = document.createElement('div'); el.id = 'lampo';
      el.style.cssText = 'position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:9;transition:opacity .5s ease-out';
      document.body.appendChild(el);
    }
    el.style.transition = 'none'; el.style.opacity = '1';
    let n = 0;
    const flick = () => {
      n++;
      el.style.transition = 'opacity .09s'; el.style.opacity = n % 2 ? '0.35' : '0.95';
      if (n < 4) setTimeout(flick, 90);
      else setTimeout(() => { el.style.transition = 'opacity .6s ease-out'; el.style.opacity = '0'; }, 120);
    };
    setTimeout(flick, 120);
  }

  _capelliDritti() {
    const W = this.game.world;
    if (this.zap) W.scene.remove(this.zap.s);
    const s = W.sprite(PIX.bubble('ZAP'), { w: 1.25, h: 0.75 });
    W.scene.add(s);
    this.zap = { s, t: 2.5 };
  }

  // Per il pilot: prova(esito) mette la Punto sulla capezzagna, puntata verso la cabina carica.
  // esito: 'leggendario' | 'comune' | 'niente' per forzare il bottino del prossimo schianto.
  prova(esito = null, mezzo = 'punto') {
    const g = this.game, v = g.vehicles.get(mezzo); if (!v) return;
    g.vehicles.leave();
    this.f.prossima = 0; this._forza = esito;
    Object.assign(v.st, { x: C.x - 22, z: C.z, h: 0, cond: 100, fuel: 100, flat: false });
    g.vehicles._pose(v);
    g.player.group.position.set(v.st.x, 0, v.st.z + 1.2);
    g.vehicles._mount(v);
    return 'Tieni premuto → (D) per andare dritto contro la cabina.';
  }
}
