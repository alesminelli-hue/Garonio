// Regole del gioco: tempo, barre, missioni del Gigante, Mister Mountain, campi, galline, nutrie.
import * as THREE from 'three';
import * as PIX from './pixel.js';
import { AREAS, BUILDINGS } from './world.js';

// ===== Valori facili da ritoccare per bilanciare il gioco =====
export const CONFIG = {
  minutesPerSecond: 1.5,       // quanti minuti di gioco passano in 1 secondo reale
  walkSpeed: 3.2,
  runSpeed: 5.0,
  growMinutes: { pomodoro: 6 * 60, mais: 10 * 60 },
  prices: { uova: 3, pomodoro: 6, mais: 10 },
  idleDozeSeconds: 6,          // dopo quanti secondi fermo Garonio si appisola
  tiredPerHour: 1.5,           // stanchezza che sale solo stando svegli
};

const SAVE_KEY = 'garonio-save-v1';
const H = 60;

const ACTIONS = {
  zappa: { tired: 3, stress: 1, xp: 2, min: 10, sfx: 'dig' },
  semina: { tired: 1, stress: 0.5, xp: 1, min: 5, sfx: 'pick' },
  annaffia: { tired: 1.5, stress: 0.5, xp: 1, min: 5, sfx: 'water' },
  raccogli: { tired: 1.5, stress: 0, xp: 3, min: 5, sfx: 'pick' },
  uovo: { tired: 0.5, stress: 0, xp: 1, min: 2, sfx: 'pick' },
  scaccia: { tired: 5, stress: 2, xp: 5, min: 5, sfx: 'shoo' },
  nutri: { tired: 2, stress: 0, xp: 2, min: 10, sfx: 'pick' },
};

const MISSIONS = {
  semina: { text: n => `Zappa e semina ${n} zolle nel campo`, stat: 'seminaCampo', range: [6, 10], deadline: 17, pay: 25 },
  uova: { text: n => `Raccogli ${n} uova al pollaio`, stat: 'uova', range: [3, 5], deadline: 12, pay: 15 },
  nutrie: { text: n => `Scaccia ${n} nutrie dal campo`, stat: 'nutrie', range: [2, 4], deadline: 19, pay: 30 },
  annaffia: { text: n => `Annaffia ${n} piante`, stat: 'annaffiate', range: [4, 10], deadline: 14, pay: 15 },
  raccolto: { text: n => `Raccogli ${n} tra pomodori e pannocchie`, stat: 'raccolti', range: [2, 5], deadline: 18, pay: 30 },
  vendi: { text: n => `Guadagna ${n}€ vendendo alla cassa`, stat: 'venduto', range: [15, 35], deadline: 20, pay: 20 },
};

const MM_LINES = {
  missione: ['GARONIO! Il Gigante ti aveva dato UN compito. UNO!', 'Mio nonno a novant\'anni lavorava più di te. E aveva una gamba sola.'],
  nutrie: ['Le nutrie si stanno mangiando il campo e tu dov\'eri?!', 'Lavorano più loro di te, e almeno loro si fanno la tana.'],
  dormito: ['Ti hanno trovato a dormire in mezzo al lavoro. DI NUOVO.', 'Questa la racconto in tutto il paese.'],
  svenuto: ['Sei svenuto! Lo stress ti ha steso, scansafatiche.', 'Il Gigante ha dovuto pagare il medico coi TUOI soldi.'],
};

const BAR_BULLIES = [
  { name: 'Il Bullo del paese', text: 'Ehi Garonio! È vero che tuo padre ti paga per dormire?' },
  { name: 'Il Bullo del paese', text: 'Guarda chi c\'è, il re delle nutrie! Quante ne hai scacciate oggi, zero?' },
  { name: 'Cliente ubriaco', text: 'Questo è il mio sgabello. Lo era anche ieri. E domani.' },
];

const UPGRADES = [
  { id: 'zappa', label: 'Zappa affilata', desc: 'zappare stanca la metà', price: 40 },
  { id: 'stivali', label: 'Stivali nuovi', desc: 'cammini più veloce', price: 30 },
  { id: 'rete', label: 'Rete anti-nutria', desc: 'meno nutrie nel campo', price: 60 },
];

const rand = (a, b) => a + Math.random() * (b - a);
const randi = (a, b) => Math.floor(rand(a, b + 1));
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const fmtH = m => `${String(Math.floor(m / 60)).padStart(2, '0')}:00`;

function newStats() { return { uova: 0, seminaCampo: 0, nutrie: 0, annaffiate: 0, raccolti: 0, venduto: 0, persi: 0, mmNutrie: false }; }
function fresh() {
  return {
    day: 1, minutes: 6 * H, health: 100, stress: 15, tired: 0, money: 20, xp: 0, level: 1,
    inv: { uova: 0, pomodoro: 0, mais: 0 }, upgrades: {}, plots: {}, eggs: [],
    fedToday: false, fedYesterday: false, mission: null, today: newStats(),
    px: 18.5, pz: 17.4, introDone: false, lastLay: 6 * H, nextNutria: 10 * H,
  };
}

export function hasSave() { try { return !!localStorage.getItem(SAVE_KEY); } catch { return false; } }

export class Game {
  constructor(world, ui, audio) {
    this.world = world; this.ui = ui; this.audio = audio;
    this.input = { x: 0, z: 0, run: false };
    this.facing = 1; this.walkT = 0; this.idle = 0; this.dozing = false;
    this.nutrie = []; this.chickens = []; this.eggSprites = [];
    this.actT = 0; this.actName = 'attack'; this.jumpT = 0; this.ko = false; this.animT = 0;
    this.locked = false; this.mm = null; this.hop = 0; this.caughtAt = -999; this.saveHour = 6;
    this.inBar = false;
  }

  // ---------- Avvio ----------
  async start(continueSave) {
    let s = null;
    if (continueSave) { try { s = JSON.parse(localStorage.getItem(SAVE_KEY)); } catch { s = null; } }
    this.s = Object.assign(fresh(), s || {});
    const W = this.world;
    const gf = PIX.garonioFrames();
    this.player = W.actor(gf.frames, { w: gf.w, h: gf.h, shadow: 0.45 });
    this.gigante = W.actor(PIX.characterFrames('gigante'), { w: 22 / 16 * 1.3, h: 2.6, shadow: 0.55 });
    this.gigante.group.position.set(14.4, 0, 17.3);
    W.solids.push({ x0: 14.1, z0: 17.1, x1: 14.7, z1: 17.5 });
    const chick = [PIX.chicken(0), PIX.chicken(1)];
    for (let i = 0; i < 4; i++) {
      const a = W.actor([chick[0], chick[1], PIX.mirror(chick[0]), PIX.mirror(chick[1])], { w: 0.75, h: 0.75 });
      const c = { a, x: rand(23, 25.5), z: rand(22.5, 25), tx: 0, tz: 0, wait: rand(0, 3) };
      c.tx = c.x; c.tz = c.z;
      this.chickens.push(c);
    }
    this.zzz = W.sprite(PIX.bubble('Zzz'), { w: 1.25, h: 0.75 });
    this.zzz.visible = false; W.scene.add(this.zzz);
    // selettore della casella
    const [sc, sg] = PIX.makeCanvas(16, 16);
    sg.fillStyle = '#fff6a0'; sg.fillRect(0, 0, 16, 2); sg.fillRect(0, 14, 16, 2); sg.fillRect(0, 0, 2, 16); sg.fillRect(14, 0, 2, 16);
    this.cursor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: PIX.toTexture(sc), transparent: true, opacity: 0.8, depthWrite: false }));
    this.cursor.position.y = 0.03; this.cursor.visible = false; W.scene.add(this.cursor);

    for (const [k, p] of Object.entries(this.s.plots)) { const [x, z] = k.split(',').map(Number); W.setPlot(x, z, p); }
    this.s.eggs.forEach(e => this._eggSprite(e));
    this.player.group.position.set(this.s.px, 0, this.s.pz);

    if (!this.s.introDone) await this.intro();
    else if (!this.s.mission) await this.morning();
  }

  save() {
    const p = this.player.group.position;
    this.s.px = p.x; this.s.pz = p.z;
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.s)); } catch { /* spazio pieno o privato */ }
  }

  static reset() { try { localStorage.removeItem(SAVE_KEY); } catch { } }

  // ---------- Storia ----------
  async intro() {
    await this.ui.dialog([
      { text: 'Pianura padana, ore 6:00. Il gallo canta. Garonio no.' },
      { who: 'gigante', name: 'Il Gigante', text: 'GARONIO! Sono le sei! I campi non si zappano da soli!' },
      { who: 'garonio', name: 'Garonio', text: 'Mmh... cinque minuti, papà...' },
      { who: 'gigante', name: 'Il Gigante', text: 'Cinque minuti li hai chiesti nel 2009. Ogni mattina ti do un lavoro. Se non lo fai... chiamo Mister Mountain.' },
      { who: 'garonio', name: 'Garonio', text: '(No, Mister Mountain no...)' },
      { text: 'Muoviti con FRECCE/WASD (Shift per correre). Agisci con E o SPAZIO sulla casella evidenziata o vicino a persone, porte e oggetti.' },
      { text: 'Occhio alle barre: lavorare alza STANCHEZZA e STRESS. Il bar abbassa lo stress, dormire a casa recupera tutto.' },
    ]);
    this.s.introDone = true;
    this._newMission('semina', 6);
    await this._announceMission();
  }

  async morning() {
    this._pickMission();
    await this._announceMission();
  }

  _pickMission() {
    const plants = this._plants().length;
    const pool = ['semina', 'uova', 'nutrie', 'vendi'];
    if (plants >= 4) pool.push('annaffia', 'annaffia');
    if (plants >= 2 && this.s.day > 2) pool.push('raccolto');
    if (this.s.day === 2) pool.splice(0, pool.length, 'uova');
    const id = pool[randi(0, pool.length - 1)];
    const m = MISSIONS[id];
    const t = clamp((this.s.day - 1) / 6, 0, 1);
    let n = Math.round(m.range[0] + (m.range[1] - m.range[0]) * t);
    if (id === 'annaffia') n = Math.min(n, plants);
    if (id === 'raccolto') n = Math.min(n, plants);
    if (id === 'uova') n = Math.min(n, this.s.eggs.length + (this.s.fedYesterday ? 2 : 1));
    this._newMission(id, Math.max(1, n));
  }

  _newMission(id, n) {
    const m = MISSIONS[id];
    this.s.mission = { id, n, text: m.text(n), stat: m.stat, deadline: m.deadline * H, pay: m.pay, progress: 0, done: false, failed: false };
  }

  async _announceMission() {
    const m = this.s.mission;
    const intro = ['Sveglia, scansafatiche!', 'Ancora a letto? Fuori!', 'Oggi niente scuse.', 'Il sole è su da un pezzo. Tu no.'][randi(0, 3)];
    const tips = {
      uova: 'Le galline stanno nel pollaio. Dagli da mangiare alla mangiatoia e ne faranno di più.',
      semina: 'Il campo è a nord, oltre la casa. Prima zappi, poi semini.',
      nutrie: 'Le nutrie escono dal canale e puntano alle piante del campo. Avvicinati e scacciale.',
      annaffia: 'Le piante bagnate crescono. Ogni mattina tornano asciutte.',
      raccolto: 'Quando la pianta è matura, raccoglila e portala alla cassa vicino a casa.',
      vendi: 'La cassa di legno vicino alla porta di casa compra uova, pomodori e mais.',
    };
    await this.ui.dialog([{ who: 'gigante', name: 'Il Gigante', text: `${intro} Oggi devi: ${m.text} entro le ${fmtH(m.deadline)}. ${tips[m.id]}` }]);
  }

  // ---------- Ciclo principale ----------
  update(dt) {
    const P = this.player.group.position;
    this._animateWorld(dt);
    if (this.ui.busy() || this.locked) { this.ui.prompt(null); this.cursor.visible = false; return; }

    // movimento
    let { x: ix, z: iz } = this.input;
    const len = Math.hypot(ix, iz);
    const moving = len > 0.1;
    if (moving) {
      ix /= Math.max(1, len); iz /= Math.max(1, len);
      let sp = this.input.run ? CONFIG.runSpeed : CONFIG.walkSpeed;
      if (this.s.upgrades.stivali) sp *= 1.2;
      if (this.s.tired > 80) sp *= 0.7;
      const nx = P.x + ix * sp * dt, nz = P.z + iz * sp * dt;
      if (!this.world.blocked(nx, P.z)) P.x = nx;
      if (!this.world.blocked(P.x, nz)) P.z = nz;
      if (Math.abs(ix) > 0.2) this.facing = ix > 0 ? 1 : -1;
      this.walkT += dt * (this.input.run ? 12 : 8);
      this.idle = 0; this._wake();
      if (this.input.run) this.s.tired += dt * CONFIG.minutesPerSecond / H * 3;
    } else {
      this.idle += dt;
      if (this.idle > CONFIG.idleDozeSeconds && !this.dozing) { this.dozing = true; this.zzz.visible = true; }
    }
    this.moving = moving;

    // tempo
    const dm = dt * CONFIG.minutesPerSecond;
    this._tick(dm);
    this._updateTarget();
    this._music();
    this.ui.hud(this.s, this.s.mission);
  }

  _wake() { if (this.dozing) { this.dozing = false; this.zzz.visible = false; } }

  _tick(dm) {
    const s = this.s;
    s.minutes += dm;
    const hr = dm / H;
    if (this.dozing) s.tired -= 12 * hr; else s.tired += CONFIG.tiredPerHour * hr;
    if (s.tired > 75) s.stress += 2 * hr;
    if (s.stress >= 100) s.health -= 8 * hr;
    else if (s.stress < 50) s.health += 1 * hr;
    s.tired = clamp(s.tired, 0, 100); s.stress = clamp(s.stress, 0, 100); s.health = clamp(s.health, 0, 100);

    // il Gigante ti becca a dormire
    const gp = this.gigante.group.position, pp = this.player.group.position;
    if (this.dozing && s.minutes < 20 * H && gp.distanceTo(pp) < 7 && s.minutes - this.caughtAt > 60) {
      this.caughtAt = s.minutes; s.stress += 8; this._wake(); this.idle = 0;
      this.ui.toast('Il Gigante: «GARONIO! Non si dorme sul lavoro!»  Stress +8', 'bad'); this.audio.sfx('bad');
    }

    // piante
    for (const [k, p] of Object.entries(s.plots)) {
      if (!p.crop || !p.water || p.stage >= 3) continue;
      p.g = (p.g || 0) + dm;
      const G = CONFIG.growMinutes[p.crop];
      const st = p.g >= G ? 3 : p.g >= G * 0.5 ? 2 : p.g >= G * 0.08 ? 1 : 0;
      if (st !== p.stage) { p.stage = st; const [x, z] = k.split(',').map(Number); this.world.setPlot(x, z, p); }
    }

    // uova
    if (s.fedToday && s.minutes - s.lastLay >= 150 && s.minutes < 20 * H && s.eggs.length < 8) { s.lastLay = s.minutes; this._layEgg(); }

    this._nutrie(dm);
    this._checkMission();

    // salvataggio automatico ogni ora
    const hNow = Math.floor(s.minutes / H);
    if (hNow !== this.saveHour) { this.saveHour = hNow; this.save(); }

    if (s.health <= 0) this._faint();
    else if (s.tired >= 100) this._collapse();
    else if (s.minutes >= 24 * H) { this.ui.toast('È mezzanotte: Garonio crolla dove si trova.', 'bad'); this.sleep(true); }
  }

  _checkMission() {
    const m = this.s.mission; if (!m || m.done || m.failed) return;
    m.progress = this.s.today[m.stat];
    if (m.progress >= m.n) {
      m.done = true; this.s.money += m.pay; this._xp(10); this.audio.sfx('coin');
      const lines = ['Hmpf. Per una volta non hai fatto danni.', 'Bene. Non abituarti ai complimenti.', 'Visto? Non si muore a lavorare.'];
      this.ui.toast(`Missione completata! +${m.pay}€  Il Gigante: «${lines[randi(0, 2)]}»`, 'good');
    } else if (this.s.minutes >= m.deadline) {
      m.failed = true;
      this.mountain('missione', 30);
    }
  }

  // ---------- Azioni ----------
  _updateTarget() {
    const t = this._findTarget();
    this.target = t;
    this.ui.prompt(t ? `[E] ${t.label}` : null);
    if (t && t.tile) { this.cursor.visible = true; this.cursor.position.set(t.tile[0] + 0.5, 0.03, t.tile[1] + 0.5); }
    else this.cursor.visible = false;
  }

  _findTarget() {
    const P = this.player.group.position;
    const d = (x, z) => Math.hypot(P.x - x, P.z - z);
    const gp = this.gigante.group.position;
    if (d(gp.x, gp.z) < 1.5) return { label: 'Parla col Gigante', fn: () => this.talkGigante() };
    for (const n of this.nutrie) if (n.state !== 'flee' && d(n.x, n.z) < 1.6) return { label: 'Scaccia la nutria!', fn: () => this.shoo(n) };
    for (const e of this.s.eggs) if (d(e.x, e.z) < 0.9) return { label: 'Raccogli l\'uovo', fn: () => this.pickEgg(e) };
    for (const b of BUILDINGS) if (b.door && !b.noDoor && d(b.door.x, b.door.z) < 1.1) {
      const lab = { casa: 'Entra in casa', officina: 'Entra in officina', bar: 'Entra al bar', maiali: 'Capannone dei maiali' }[b.id];
      return { label: lab, fn: () => this.enter(b.id) };
    }
    const pr = this.world.props;
    const inv = this.s.inv;
    if (d(pr.cassa.x, pr.cassa.z) < 1.3 && inv.uova + inv.pomodoro + inv.mais > 0) return { label: 'Vendi alla cassa', fn: () => this.sell() };
    if (d(pr.mangiatoia.x, pr.mangiatoia.z) < 1.3 && !this.s.fedToday) return { label: 'Dai da mangiare alle galline', fn: () => this.feed() };
    // casella sotto i piedi
    const tx = Math.floor(P.x), tz = Math.floor(P.z);
    const area = this.world.areaAt(tx, tz);
    if (area === 'field' || area === 'orto') {
      const key = tx + ',' + tz, p = this.s.plots[key];
      const tile = [tx, tz];
      if (!p) return { tile, label: 'Zappa', fn: () => this.till(key, tx, tz) };
      if (!p.crop) return { tile, label: `Semina ${AREAS[area].crop === 'mais' ? 'mais' : 'pomodori'}`, fn: () => this.sow(key, tx, tz, area) };
      if (p.stage >= 3) return { tile, label: 'Raccogli', fn: () => this.harvest(key, tx, tz) };
      if (!p.water) return { tile, label: 'Annaffia', fn: () => this.water(key, tx, tz) };
      return { tile, label: null };
    }
    return null;
  }

  action() {
    if (this.ui.busy() || this.locked) return;
    this.idle = 0; this._wake();
    const t = this.target;
    if (t && t.label && t.fn) t.fn();
  }

  _cost(kind) {
    const a = ACTIONS[kind];
    let tired = a.tired * Math.max(0.6, 1 - 0.04 * (this.s.level - 1));
    if (kind === 'zappa' && this.s.upgrades.zappa) tired *= 0.5;
    this.s.tired += tired;
    this.s.stress += a.stress + (this.s.tired > 70 ? 0.5 : 0);
    this.s.minutes += a.min;
    this._xp(a.xp);
    this.audio.sfx(a.sfx);
    this.actT = 0.3; this.actName = kind === 'scaccia' ? 'attack' : 'work';
  }

  _xp(n) {
    const s = this.s; s.xp += n;
    while (s.xp >= s.level * 20) {
      s.xp -= s.level * 20; s.level++; s.health = Math.min(100, s.health + 10);
      this.audio.sfx('level'); this.ui.toast(`Livello ${s.level}! Garonio si stanca un po' meno.`, 'good');
    }
  }

  till(key, x, z) { this.s.plots[key] = { crop: null, stage: 0, water: false, g: 0 }; this.world.setPlot(x, z, this.s.plots[key]); this._cost('zappa'); }
  sow(key, x, z, area) {
    const p = this.s.plots[key]; p.crop = AREAS[area].crop; p.stage = 0; p.g = 0;
    this.world.setPlot(x, z, p); this._cost('semina');
    if (area === 'field') this.s.today.seminaCampo++;
  }
  water(key, x, z) { const p = this.s.plots[key]; p.water = true; this.world.setPlot(x, z, p); this._cost('annaffia'); this.s.today.annaffiate++; }
  harvest(key, x, z) {
    const p = this.s.plots[key];
    this.s.inv[p.crop]++; this.ui.float(p.crop === 'mais' ? '+1 pannocchia' : '+1 pomodoro');
    this.s.plots[key] = { crop: null, stage: 0, water: false, g: 0 };
    this.world.setPlot(x, z, this.s.plots[key]); this._cost('raccogli'); this.s.today.raccolti++;
  }
  pickEgg(e) {
    this.s.eggs.splice(this.s.eggs.indexOf(e), 1);
    const sp = this.eggSprites.find(x => x.userData.egg === e);
    if (sp) { this.world.scene.remove(sp); this.eggSprites.splice(this.eggSprites.indexOf(sp), 1); }
    this.s.inv.uova++; this.s.today.uova++; this._cost('uovo'); this.ui.float('+1 uovo');
  }
  feed() { this.s.fedToday = true; this.s.lastLay = this.s.minutes; this._cost('nutri'); this.ui.toast('Galline sfamate: oggi e domani faranno più uova.'); }
  sell() {
    const s = this.s, pr = CONFIG.prices;
    const tot = s.inv.uova * pr.uova + s.inv.pomodoro * pr.pomodoro + s.inv.mais * pr.mais;
    if (!tot) { this.ui.toast('Non hai niente da vendere.'); return; }
    s.money += tot; s.today.venduto += tot; s.inv = { uova: 0, pomodoro: 0, mais: 0 };
    this.audio.sfx('coin'); this.ui.toast(`Venduto tutto: +${tot}€`, 'good');
  }

  // ---------- Galline e uova ----------
  _layEgg() {
    const e = { x: rand(22.6, 25.6), z: rand(20.8, 25.5) };
    if (Math.random() < 0.4) { e.x = rand(22.6, 28.4); e.z = rand(23, 25.5); }
    this.s.eggs.push(e); this._eggSprite(e);
  }
  _eggSprite(e) {
    this._eggTex ??= PIX.toTexture(PIX.egg());
    const sp = this.world.sprite(this._eggTex, { w: 0.375, h: 0.44 });
    sp.position.set(e.x, 0, e.z); sp.userData.egg = e;
    this.world.scene.add(sp); this.eggSprites.push(sp);
  }

  // ---------- Nutrie ----------
  _plants(area = null) {
    return Object.entries(this.s.plots).filter(([k, p]) => p.crop && (!area || this.world.areaAt(...k.split(',').map(Number)) === area));
  }

  _nutrie(dm) {
    const s = this.s, hour = s.minutes / H;
    const fieldPlants = this._plants('field');
    const wantNutrie = fieldPlants.length > 0 || s.mission?.id === 'nutrie';
    const max = Math.min(5, 1 + Math.ceil(s.day / 2));
    if (hour >= 7 && hour < 19.5 && s.minutes >= s.nextNutria && wantNutrie) {
      if (this.nutrie.filter(n => n.state !== 'flee').length < max) this._spawnNutria();
      let gap = Math.max(35, 110 - s.day * 10) * rand(0.7, 1.3);
      if (s.upgrades.rete) gap *= 2;
      s.nextNutria = s.minutes + gap;
    }
    for (const n of [...this.nutrie]) {
      const sp = n.state === 'flee' ? 4.5 : 1.2;
      if (n.state === 'come' || n.state === 'flee') {
        const dx = n.tx - n.x, dz = n.tz - n.z, dist = Math.hypot(dx, dz);
        const step = sp * dm / CONFIG.minutesPerSecond;
        if (dist <= step) {
          n.x = n.tx; n.z = n.tz;
          if (n.state === 'flee') { n.a.remove(); this.nutrie.splice(this.nutrie.indexOf(n), 1); continue; }
          n.state = n.key ? 'eat' : 'wander'; n.t = 0;
        } else { n.x += dx / dist * step; n.z += dz / dist * step; n.dir = dx >= 0 ? 0 : 2; }
        n.anim += dm;
      } else if (n.state === 'eat') {
        const p = s.plots[n.key];
        if (!p || !p.crop) { this._retarget(n); continue; }
        n.t += dm; n.anim += dm * 2;
        if (n.t >= 25) {
          s.plots[n.key] = { crop: null, stage: 0, water: false, g: 0 };
          const [x, z] = n.key.split(',').map(Number); this.world.setPlot(x, z, s.plots[n.key]);
          s.today.persi++; this.audio.sfx('bad');
          this.ui.toast(`Una nutria si è mangiata una pianta! (${s.today.persi} perse oggi)`, 'bad');
          if (s.today.persi >= 3 && !s.today.mmNutrie) { s.today.mmNutrie = true; this.mountain('nutrie', 25); }
          this._retarget(n);
        }
      } else if (n.state === 'wander') {
        n.t += dm;
        if (n.t > 90) { this._flee(n, false); continue; }
        if (this._plants('field').length) this._retarget(n);
      }
      n.a.group.position.set(n.x, 0, n.z);
      n.a.setFrame(n.dir + (Math.floor(n.anim / 3) % 2));
    }
  }

  _spawnNutria() {
    const fr = [PIX.nutria(0), PIX.nutria(1)];
    const a = this.world.actor([fr[0], fr[1], PIX.mirror(fr[0]), PIX.mirror(fr[1])], { w: 18 / 16, h: 0.75 });
    const n = { a, x: rand(AREAS.field.x0, AREAS.field.x1), z: 2.6, state: 'come', anim: 0, dir: 0, t: 0 };
    this._retarget(n);
    this.nutrie.push(n);
    if (this.nutrie.length === 1) this.ui.toast('Una nutria è uscita dal canale! Difendi il campo.', 'bad');
  }

  _retarget(n) {
    const taken = new Set(this.nutrie.map(o => o !== n && o.key).filter(Boolean));
    const opts = this._plants('field').filter(([k]) => !taken.has(k));
    if (opts.length) {
      const [k] = opts[randi(0, opts.length - 1)];
      const [x, z] = k.split(',').map(Number);
      n.key = k; n.tx = x + 0.5; n.tz = z + 0.5; n.state = 'come';
    } else {
      const f = AREAS.field;
      n.key = null; n.tx = rand(f.x0, f.x1); n.tz = rand(f.z0, f.z1); n.state = 'come'; n.t = 0;
    }
  }

  _flee(n, byPlayer) {
    n.state = 'flee'; n.key = null; n.tx = n.x + rand(-2, 2); n.tz = 1.6;
    if (byPlayer) { this.s.today.nutrie++; }
  }

  shoo(n) { this._flee(n, true); this._cost('scaccia'); this.ui.float('Sciò! Via di qua!'); }

  // ---------- Il Gigante ----------
  async talkGigante() {
    const m = this.s.mission;
    let text;
    if (!m) text = 'Che vuoi? Vai a lavorare.';
    else if (m.done) text = ['Hai finito? Allora vai al bar, prima che ci ripensi.', 'Bravo... per modo di dire. Non montarti la testa.'][randi(0, 1)];
    else if (m.failed) text = 'Non parlarmi. Mister Mountain ti ha già detto tutto.';
    else text = `Ancora qui? Devi: ${m.text}. Sei a ${m.progress}/${m.n} e la scadenza è alle ${fmtH(m.deadline)}.`;
    await this.ui.dialog([{ who: 'gigante', name: 'Il Gigante', text }]);
  }

  // ---------- Mister Mountain ----------
  async mountain(reason, stress) {
    if (this.mm) return;
    const P = this.player.group.position;
    this.mm = this.world.actor(PIX.characterFrames('mountain'), { w: 30 / 16 * 1.25, h: 42 / 16 * 1.25, shadow: 0.8 });
    const side = P.x > 30 ? -1 : 1;
    this.mm.group.position.set(P.x + side * 2.6, 0, P.z + 0.3);
    if (side < 0) this.mm.setFrame(0); else this.mm.setFrame(3);
    this._wake(); this.actT = 0; this.jumpT = 0;
    this.facing = side; this.player.setFrame(side > 0 ? 0 : PIX.GARONIO_N);
    this.player.spr.position.y = 0;
    this.audio.setScene('nemico'); this.audio.sfx('bad'); this.ui.shake();
    const lines = MM_LINES[reason];
    await this.ui.dialog([
      { text: 'Il terreno trema... arriva MISTER MOUNTAIN!' },
      { who: 'mountain', name: 'Mister Mountain', text: lines[0] },
      { who: 'mountain', name: 'Mister Mountain', text: lines[1] },
      { who: 'garonio', name: 'Garonio', text: ['...scusa.', 'Ma io stavo per farlo!', '(Fingi di essere un albero.)'][randi(0, 2)] },
    ]);
    this.s.stress = clamp(this.s.stress + stress, 0, 100);
    this.ui.toast(`Stress +${stress}`, 'bad');
    this.mm.remove(); this.mm = null;
    this.audio.scene = null;
  }

  // ---------- Riposo, crolli e nuovo giorno ----------
  async _collapse() {
    if (this.locked) return; this.locked = true;
    this.ui.toast('Garonio è sfinito e crolla a dormire per terra...', 'bad');
    this.ko = true; this.player.setFrame((this.facing > 0 ? 0 : PIX.GARONIO_N) + PIX.GARONIO_ANIM.ko[0]);
    await new Promise(r => setTimeout(r, 1200));
    await this.ui.fade(true);
    this.ko = false;
    this.s.minutes += 180; this.s.tired = 45; this.s.stress += 5;
    await this.ui.fade(false);
    this.locked = false;
    if (this.s.minutes < 20 * H) await this.mountain('dormito', 20);
  }

  async _faint() {
    if (this.locked) return;
    this.s.money = Math.floor(this.s.money * 0.7);
    this.player.setFrame((this.facing > 0 ? 0 : PIX.GARONIO_N) + PIX.GARONIO_ANIM.ko[0]);
    await this.sleep(true, true);
    await this.mountain('svenuto', 15);
  }

  async sleep(forced = false, fainted = false) {
    if (this.locked) return; this.locked = true;
    const s = this.s;
    await this.ui.fade(true);
    s.day++; s.minutes = 6 * H; this.saveHour = 6;
    s.tired = forced ? 30 : 0;
    s.stress = clamp(s.stress - (forced ? 5 : 25), 0, 100);
    s.health = fainted ? 40 : clamp(s.health + 30, 0, 100);
    for (const [k, p] of Object.entries(s.plots)) { p.water = false; const [x, z] = k.split(',').map(Number); this.world.setPlot(x, z, p); }
    s.fedYesterday = s.fedToday; s.fedToday = false; s.lastLay = 6 * H;
    for (let i = 0; i < (s.fedYesterday ? 4 : 2); i++) if (s.eggs.length < 8) this._layEgg();
    s.today = newStats(); s.mission = null;
    this.nutrie.forEach(n => n.a.remove()); this.nutrie = [];
    s.nextNutria = (8 + rand(0, 2)) * H;
    this.player.group.position.set(18.5, 0, 17.4);
    this._wake(); this.idle = 0;
    this._pickMission();
    this.save();
    await this.ui.fade(false);
    this.locked = false;
    this.ui.toast(`Giorno ${s.day}`, 'good');
    await this._announceMission();
  }

  // ---------- Edifici ----------
  async enter(id) {
    const s = this.s;
    if (id === 'casa') {
      const late = s.minutes >= 20 * H;
      await this.ui.dialog([{
        name: 'Casa', text: late ? 'Il letto ti chiama. Ed è la voce più dolce del mondo.' : 'Il divano è lì. Il Gigante pure, da qualche parte.',
        choices: [
          { label: late ? 'Dormire fino a domani' : 'Dormire (solo dopo le 20:00)', disabled: !late, fn: () => { this.sleep(false); } },
          { label: 'Pisolino di un\'ora (stanchezza -20)', fn: () => { s.minutes += 60; s.tired = clamp(s.tired - 20, 0, 100); s.stress = clamp(s.stress - 3, 0, 100); this.ui.toast('Zzz... un\'ora di pace.'); } },
          { label: 'Esci', fn: null },
        ],
      }]);
    } else if (id === 'bar') {
      this.inBar = true; this.audio.setScene('bar');
      await this._barMenu(true);
      this.inBar = false;
    } else if (id === 'officina') {
      const choices = UPGRADES.map(u => ({
        label: s.upgrades[u.id] ? `${u.label} ✔` : `${u.label} (${u.price}€): ${u.desc}`,
        disabled: !!s.upgrades[u.id] || s.money < u.price,
        fn: () => { s.money -= u.price; s.upgrades[u.id] = true; this.audio.sfx('coin'); this.ui.toast(`Comprato: ${u.label}!`, 'good'); },
      }));
      choices.push({ label: 'Esci', fn: null });
      await this.ui.dialog([{ name: 'Officina', text: 'Attrezzi, ricambi e odore di gasolio. Qui un giorno sistemerai la Vespa, la Punto e i trattori.', choices }]);
    } else if (id === 'maiali') {
      await this.ui.dialog([{ name: 'Capannone dei maiali', text: 'Si sentono grugniti. I maiali arriveranno nella prossima versione del gioco!' }]);
    }
  }

  _barMenu(first) {
    const s = this.s;
    const buy = (price, fx, msg) => () => {
      s.money -= price; fx(); s.minutes += 30; this.audio.sfx('eat'); this.ui.toast(msg);
      s.stress = clamp(s.stress, 0, 100); s.tired = clamp(s.tired, 0, 100); s.health = clamp(s.health, 0, 100);
      if (Math.random() < 0.3) return this._bully();
      return [this._barPage(false)];
    };
    const page = {
      name: 'Bar', text: first ? 'La barista ti saluta con un cenno. «Il solito, Garonio?»' : 'Qualcos\'altro?', who: 'barista',
      choices: [
        { label: 'Panino e bibita (6€): stress -15, vita +10', disabled: s.money < 6, fn: buy(6, () => { s.stress -= 15; s.health += 10; }, 'Gnam. Stress -15') },
        { label: 'Caffè (2€): stanchezza -12', disabled: s.money < 2, fn: buy(2, () => { s.tired -= 12; }, 'Caffè doppio. Stanchezza -12') },
        { label: 'Birra (4€): stress -22, stanchezza +6', disabled: s.money < 4, fn: buy(4, () => { s.stress -= 22; s.tired += 6; }, 'Ahh. Stress -22') },
        { label: 'Esci', fn: null },
      ],
    };
    if (first) return this.ui.dialog([page]);
    return page;
  }

  _barPage(first) { return this._barMenu(first); }

  _bully() {
    const s = this.s;
    const b = BAR_BULLIES[randi(0, BAR_BULLIES.length - 1)];
    this.audio.setScene('rabbia');
    const back = () => { this.audio.setScene('bar'); return this._barPage(false); };
    return [{
      who: 'bullo', name: b.name, text: b.text,
      choices: [
        { label: 'Rispondi a tono', fn: () => {
          if (Math.random() < 0.5) { s.stress = clamp(s.stress - 5, 0, 100); this._xp(3); return [{ who: 'garonio', name: 'Garonio', text: 'Almeno io un padre che mi dà lavoro ce l\'ho. Tu hai solo quello sgabello.' }, { text: 'Il bar ride. Il bullo se ne va borbottando. Stress -5', }, back()]; }
          s.stress = clamp(s.stress + 12, 0, 100); return [{ text: 'La risposta ti esce storta e tutti ridono di te. Stress +12' }, back()];
        } },
        { label: 'Ignoralo', fn: () => { s.stress = clamp(s.stress + 6, 0, 100); return [{ text: 'Fai finta di niente, ma ti rode. Stress +6' }, back()]; } },
      ],
    }];
  }

  // ---------- Musica ----------
  _music() {
    if (this.mm || this.inBar) return;
    const P = this.player.group.position;
    const attack = this.nutrie.some(n => n.state !== 'flee') && P.z < 12;
    const nearBar = Math.hypot(P.x - 6.5, P.z - 16.5) < 4;
    const angry = this.s.stress >= 85;
    const scene = attack ? 'nemico' : angry ? 'rabbia' : nearBar ? 'bar' : this.s.minutes >= 20 * H ? 'notte' : 'base';
    this.audio.setScene(scene);
  }

  // ---------- Animazioni di Garonio ----------
  jump() {
    if (this.ui.busy() || this.locked || this.jumpT > 0) return;
    this.idle = 0; this._wake(); this.jumpT = 0.6; this.audio.sfx('blip');
    this.s.tired = clamp(this.s.tired + 0.5, 0, 100);
  }

  _animatePlayer(dt) {
    const A = PIX.GARONIO_ANIM;
    this.actT = Math.max(0, this.actT - dt);
    this.jumpT = Math.max(0, this.jumpT - dt);
    this.animT += dt;
    let f, y = 0;
    if (this.ko || this.dozing) f = A.ko[0];
    else if (this.jumpT > 0) {
      const k = 1 - this.jumpT / 0.6;
      f = A.jump[k < 0.15 || k > 0.9 ? 0 : k < 0.6 ? 1 : 2];
      if (k >= 0.15 && k <= 0.9) y = Math.sin((k - 0.15) / 0.75 * Math.PI) * 0.7;
    } else if (this.actT > 0) f = this.actName === 'attack' ? A.attack[0] : A.jump[0];
    else if (this.moving) {
      const seq = this.input.run ? A.run : A.walk;
      f = seq[Math.floor(this.walkT / 1.6) % seq.length];
    } else f = A.idle[0];
    this.player.setFrame((this.facing > 0 ? 0 : PIX.GARONIO_N) + f);
    this.player.spr.position.y = y;
  }

  // ---------- Animazioni del mondo ----------
  _animateWorld(dt) {
    const s = this.s;
    // salto quando si lavora
    this._animatePlayer(dt);
    const P = this.player.group.position;
    this.zzz.position.set(P.x + 0.5, 1.6 + Math.sin(performance.now() / 400) * 0.08, P.z);
    // galline
    for (const c of this.chickens) {
      c.wait -= dt;
      const dx = c.tx - c.x, dz = c.tz - c.z, d = Math.hypot(dx, dz);
      if (c.wait <= 0 && d > 0.05) {
        const st = Math.min(d, 0.9 * dt); c.x += dx / d * st; c.z += dz / d * st;
        c.a.setFrame((dx >= 0 ? 0 : 2) + (Math.floor(performance.now() / 150) % 2));
      } else if (c.wait <= 0) { c.tx = rand(22.6, 28.4); c.tz = rand(22.8, 25.6); if (c.tx < 25.8) c.tz = rand(20.6, 25.6); c.wait = rand(1, 4); }
      c.a.group.position.set(c.x, 0, c.z);
    }
    // luce del giorno
    const h = s.minutes / H;
    let k = 1, warm = 0;
    if (h < 7) k = 0.5 + (h - 6) * 0.5;
    else if (h > 18) { k = Math.max(0.2, 1 - (h - 18) / 2.5 * 0.8); warm = clamp(1 - Math.abs(h - 19) / 1.5, 0, 1); }
    this.world.setDaylight(k, warm);
  }
}
