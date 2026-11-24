// Combattimento a turni stile JRPG.
// Una schermata di battaglia a parte (HTML sopra il mondo 3D), con ordine dei turni,
// comandi Attacca / Abilità / Oggetti / Difendi / Fuggi e nemici con le loro mosse.
// È legato alle tre barre di Garonio: i colpi tolgono Vita, le prese in giro alzano lo Stress,
// ogni azione costa Stanchezza. Con lo stress alto si sblocca "Rabbia Incontrollata".
//
// Uso dal gioco:  const esito = await game.combat.start({ enemies: ['nutria', 'nutria'], place: 'campo' });
// esito: 'win' | 'lose' | 'flee'
//
// Opzioni in più (lavoro E, bestie): heroFirst = Garonio agisce per primo nel primo round;
// script = oggetto con ganci facoltativi per scontri speciali (i re delle bestie, le mosse strane):
//   start(c) · heroTurn(c) → true salta il turno di Garonio · enemyTurn(c, e) → true = turno gestito dallo script
//   enemyMove(c, e, mossa) dopo una mossa nemica · roundEnd(c) · immune(e) → true = non si può colpire
//   hit(c, e, danno) · skill(c, id) · item(c, id, bersaglio)
// c.addEnemy(id, { noXp }) aggiunge un nemico a scontro in corso (es. il Re dei Ratti chiama rinforzi).
import * as PIX from './pixel.js';
import * as HDA from './hd/animali.js';
import * as HDB from './hd/bestiario.js';
import { MOSSE_ARMI, MOSSE_GARONIO, NEMICI_PICCOLI, OGGETTI } from './data/armi.js';

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// ===== Valori facili da ritoccare per bilanciare i combattimenti =====
export const COMBAT = {
  heroBaseAtk: 7,        // attacco base di Garonio (+2 per livello)
  heroBaseDef: 1,        // difesa base (+1 per livello)
  heroBaseSpd: 7,        // velocità base: decide chi agisce prima
  attackTired: 2,        // stanchezza per un attacco normale
  fleeTired: 3,
  minutesPerRound: 3,    // minuti di gioco che passano per ogni round
  stressDa: 30,          // da qui in su lo stress fa mancare i colpi...
  stressMira: 0.32,      // ...fino a -32% di mira a stress 100
  rageStress: 60,        // stress minimo per usare Rabbia Incontrollata
  critBase: 0.05,        // probabilità base di colpo critico (+10% con Lottatore grado 2)
};

// ---------- Sprite extra (volpe, cinghiale, ubriaco) ----------
function outline(c, color = '#1a1420') {
  const g = c.getContext('2d');
  const { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = color;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y) > 0) continue;
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1);
  }
  return c;
}

// volpe e cinghiale HD in stile fantasy (src/hd/bestiario.js)
const fox = HDB.volpe, boar = HDB.cinghiale;

const DRUNK = { sprite: 'ciccione', w: 18, h: 25, skin: '#e89a80', hair: '#8a8a8a', hairStyle: 'bald', shirt: '#7a8a3a', pants: '#4a4a4a', boots: '#222', belly: true, mustache: '#6a6a6a', eyes: 'sleepy' };

// sprite rivolti a sinistra (verso Garonio)
const left = canvases => canvases.map(PIX.mirror);
const humanLeft = o => [0, 1, 2].map(f => PIX.mirror(PIX.humanoid(o, f)));

// ---------- Nemici ----------
// moves: pow = forza del colpo (0 = nessun danno), stress = stress che provoca, w = probabilità relativa
export const ENEMIES = {
  nutria: {
    name: 'Nutria', hp: 16, atk: 6, def: 1, spd: 6, xp: 5, money: 0, size: 3.2, mappa: 18 / 16,
    frames: () => left([PIX.nutria(0), PIX.nutria(1)]),
    moves: [
      { name: 'Morso', pow: 1, stress: 1, w: 3 },
      { name: 'Colpo di coda', pow: 0.7, stress: 2, w: 2 },
      { name: 'Denti arancioni', pow: 1.4, stress: 2, w: 1 },
    ],
  },
  nutria_gigante: {
    name: 'Mamma Nutria', hp: 40, atk: 9, def: 3, spd: 4, xp: 14, money: 0, size: 4.2, mappa: 1.5,
    frames: () => left([HDA.mammaNutria(0), HDA.mammaNutria(1)]),
    moves: [
      { name: 'Morsone', pow: 1.2, stress: 2, w: 3 },
      { name: 'Schiacciata di pancia', pow: 1.6, stress: 3, w: 1 },
      { name: 'Squittio furioso', pow: 0, stress: 6, w: 1 },
    ],
  },
  volpe: {
    name: 'Volpe', hp: 24, atk: 8, def: 2, spd: 11, xp: 10, money: 0, size: 3.4, mappa: 22 / 16,
    frames: () => left([fox(0), fox(1)]),
    moves: [
      { name: 'Morso rapido', pow: 1, stress: 1, w: 3 },
      { name: 'Ruba un uovo', pow: 0.4, stress: 4, steal: 'uova', w: 1 },
      { name: 'Ghigno beffardo', pow: 0, stress: 5, w: 1 },
    ],
  },
  cinghiale: {
    name: 'Cinghiale', hp: 52, atk: 12, def: 5, spd: 3, xp: 22, money: 0, size: 4.6, mappa: 26 / 16,
    frames: () => left([boar(0), boar(1)]),
    moves: [
      { name: 'Carica', pow: 1.6, stress: 3, w: 2 },
      { name: 'Zannata', pow: 1.1, stress: 2, w: 3 },
      { name: 'Grugnito', pow: 0, stress: 6, w: 1 },
    ],
  },
  bullo: {
    name: 'Bullo del paese', hp: 30, atk: 6, def: 2, spd: 7, xp: 10, money: 6, size: 8, bar: true,
    frames: () => humanLeft(PIX.CHARACTERS.bullo),
    moves: [
      { name: 'Presa in giro', pow: 0, stress: 8, w: 3, line: '«Tuo padre ti paga per dormire, eh?»' },
      { name: 'Spintone', pow: 1, stress: 2, w: 2 },
      { name: 'Risata di gruppo', pow: 0.3, stress: 6, w: 1, line: 'Tutto il bar ride di Garonio.' },
    ],
  },
  ubriaco: {
    name: 'Cliente ubriaco', hp: 26, atk: 7, def: 1, spd: 2, xp: 8, money: 4, size: 8.2, bar: true,
    frames: () => humanLeft(DRUNK),
    moves: [
      { name: 'Sgabellata', pow: 1.5, stress: 3, w: 2 },
      { name: 'Rutto epico', pow: 0, stress: 7, w: 2 },
      { name: 'Si appisola', pow: 0, stress: 0, skip: true, w: 1, line: 'Il cliente ubriaco russa sul bancone...' },
    ],
  },
};

// ---------- Abilità di Garonio ----------
// Le mosse sono dati in src/data/armi.js: quelle che Garonio impara coi livelli (MOSSE_GARONIO)
// più la mossa propria dell'arma impugnata (MOSSE_ARMI), e la seconda con Lottatore grado 3.
// Al bar le armi restano fuori dalla porta: niente mosse dell'arma.
function skillList(game, place) {
  const prog = game.prog, out = [];
  if (prog && place !== 'bar') {
    const a = prog.arma();
    for (const [k, extra] of [[a.mossa, false], [a.mossa2, true]]) {
      const m = MOSSE_ARMI[k]; if (!m) continue;
      out.push({ id: k, name: m.nome, lvl: 1, ...m, arma: a.nome, extra, locked2: extra && !prog.bonus('mossaExtra') });
    }
  } else if (!prog) out.push({ id: 'zappata', name: 'Zappata', lvl: 1, ...MOSSE_ARMI.zappata });
  for (const m of MOSSE_GARONIO) out.push({ ...m, name: m.nome });
  return out;
}

// Oggetti usabili nello scontro: tutti quelli di OGGETTI con "combattimento" (src/data/armi.js)
function descOggetto(o) {
  const e = o.effetto || {}, t = [];
  if (e.danno) t.push(`lancialo: ${e.danno} danni`);
  if (e.stordisce) t.push('il nemico salta un turno');
  if (e.health) t.push(`Vita +${e.health}`);
  if (e.tired) t.push(`Stanchezza ${e.tired}`);
  if (e.stress) t.push(`Stress ${e.stress}`);
  if (e.ubriaco) t.push(`ma sbagli più spesso per ${e.ubriaco} turni`);
  if (e.guarisce) t.push('cura i morsi infetti');
  return t.join(', ') + '.';
}
const itemList = () => Object.entries(OGGETTI).filter(([, o]) => o.combattimento)
  .map(([id, o]) => ({ id, name: `${o.icona || ''} ${o.nome}`.trim(), target: o.combattimento, effetto: o.effetto || {}, desc: o.desc || descOggetto(o) }));

const MAIN = ['Attacca', 'Abilità', 'Oggetti', 'Difendi', 'Fuggi'];
const KEYS = {
  ArrowUp: 'up', KeyW: 'up', ArrowDown: 'down', KeyS: 'down', ArrowLeft: 'left', KeyA: 'left', ArrowRight: 'right', KeyD: 'right',
  Enter: 'ok', Space: 'ok', KeyE: 'ok', Escape: 'back', Backspace: 'back', KeyQ: 'back', KeyX: 'back',
};

function el(tag, cls, parent, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html != null) e.innerHTML = html;
  if (parent) parent.appendChild(e);
  return e;
}

function drawFrame(cv, src) {
  if (cv.width !== src.width || cv.height !== src.height) { cv.width = src.width; cv.height = src.height; }
  const g = cv.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.clearRect(0, 0, cv.width, cv.height);
  g.drawImage(src, 0, 0);
}

export class Combat {
  constructor(game) {
    this.game = game;
    this.active = false;
    this.root = null;
    this.input = null;      // funzione che riceve i tasti in questo momento
    window.addEventListener('keydown', e => this._onKey(e), true);
  }

  get s() { return this.game.s; }

  // ---------- Avvio e fine ----------
  async start({ enemies, place = 'campo', canFlee = true, intro = null, script = null, heroFirst = false, inMezzo = null }) {
    if (this.active) return 'flee';
    const { game } = this;
    this.active = true; game.locked = true;
    this._build();
    this.place = place; this.canFlee = canFlee; this.round = 1; this.script = script; this.heroFirst = heroFirst;
    this.inMezzo = inMezzo ?? !!game.vehicles?.driving;     // arrivato col mezzo: si può usare il clacson
    this.skills = skillList(game, place);
    this.items = itemList();
    this.root.className = 'place-' + place;
    document.body.classList.add('in-battle');

    // Garonio
    const gf = PIX.garonioFrames();
    this.heroFrames = gf.frames;
    this.hero = { name: 'Garonio', hero: true, defending: false, napping: false, charge: 0, ubriaco: 0, fiato: false };
    const thermos = game.prog?.bonus('faticaInizioScontro') || 0;
    if (thermos) this.s.tired = Math.max(0, this.s.tired - thermos);
    this.heroCv.className = 'b-sprite';
    this.heroWrap.style.transform = '';
    this._heroPose('idle');

    // nemici, con lettere se sono più di uno dello stesso tipo
    this.enemies = [];
    this.enemyBox.innerHTML = '';
    enemies.forEach(id => this.addEnemy(id));
    this._refresh();
    this._anim = setInterval(() => this._idleAnim(), 260);

    // musica dello scontro: "Rabbia Incontrollata"
    const au = game.audio;
    this.prevScene = au.scene;
    au.setScene('combattimento');
    au.sfx('bad');

    this.root.hidden = false;
    this.root.classList.add('intro');
    await this._sleep(700);
    this.root.classList.remove('intro');
    await this._say(intro || this._introText(), 1400);
    await this._hook('start');

    let result = null;
    while (!result) result = await this._round();
    await this._end(result);
    return result;
  }

  // nemico nuovo nello scontro; le lettere (A, B, C...) distinguono quelli dello stesso tipo
  addEnemy(id, { noXp = false } = {}) {
    const d = ENEMIES[id];
    const wrap = el('div', 'b-enemy', this.enemyBox);
    wrap.style.setProperty('--size', d.size);
    wrap.style.setProperty('--row', this.enemies.length);
    const info = el('div', 'b-einfo', wrap, `<span>${d.name}</span><div class="track"><div class="fill"></div></div>`);
    const cv = el('canvas', 'b-sprite', wrap);
    const frames = d.frames();
    drawFrame(cv, frames[0]);
    const e = { id, def: d, name: d.name, hp: d.hp, max: d.hp, atk: d.atk, def_: d.def, spd: d.spd, scared: 0, sleep: 0, stun: 0, blind: 0, frames, wrap, cv, fill: info.querySelector('.fill'), alive: true, noXp, label: info.querySelector('span') };
    wrap.addEventListener('click', () => this.input && this.input('target', e));
    this.enemies.push(e);
    const same = this.enemies.filter(o => o.id === id);
    if (same.length > 1) same.forEach((o, i) => { o.name = `${d.name} ${'ABCDEFGH'[i] || i + 1}`; o.label.textContent = o.name; });
    return e;
  }

  async _hook(name, ...args) {
    const f = this.script?.[name];
    try { return f ? await f.call(this.script, this, ...args) : undefined; } catch (err) { console.error('[combat script]', name, err); }
  }

  _introText() {
    const names = this.enemies.map(e => e.def.name);
    if (this.place === 'bar') return `${names[0]} si piazza davanti a Garonio. Non si può far finta di niente!`;
    const arma = (this.game.prog?.arma().nome || 'Zappa vecchia').toLowerCase();
    const art = /^[aeiou]/.test(arma) ? 'l\'' : /^(z|s[^aeiou])/.test(arma) ? 'lo ' : 'il ';
    const conArma = /^(zappa|falce|roncola|motosega)/.test(arma) ? `la ${arma}` : `${art}${arma}`;
    if (names.length === 1) return `Una ${names[0].toLowerCase() === 'cinghiale' ? 'bestiaccia' : 'bestia'} selvatica: ${names[0]}! Garonio impugna ${conArma}.`;
    return `Arrivano ${names.length} nemici! Garonio sospira e impugna ${conArma}.`;
  }

  async _end(result) {
    const { game } = this, s = this.s;
    clearInterval(this._anim);
    if (result === 'win') {
      const xp = this.enemies.reduce((a, e) => a + (e.noXp ? 0 : e.def.xp), 0);
      const money = this.enemies.reduce((a, e) => a + (e.noXp ? 0 : e.def.money), 0);
      const calm = this.place === 'bar' ? 10 : 3;
      game.audio.sfx('level');
      this._heroPose('win');
      s.stress = clamp(s.stress - calm, 0, 100);
      s.money += money;
      await this._say(`Vittoria! +${xp} esperienza${money ? `, +${money}€ (offre il bar)` : ''}, stress -${calm}.`, 2200, true);
      game._xp(xp);
      for (const e of this.enemies) game.emit?.('nemicoSconfitto', { id: e.id, place: this.place });
    } else if (result === 'lose') {
      game.audio.sfx('ko');
      game.emit?.('sconfitta', { place: this.place });
      this._heroPose('ko');
      s.health = Math.max(s.health, 5);
      await this._say('Garonio è a terra... Batte in ritirata, malconcio.', 2200, true);
    } else {
      await this._say('Garonio se la dà a gambe. Almeno in questo è veloce.', 1500, true);
    }
    s.minutes += this.round * COMBAT.minutesPerRound;
    this._clampStats();
    game.emit?.('combattimento', { esito: result, place: this.place, nemici: this.enemies.map(e => e.id) });
    await this.game.ui.fade(true);
    this.root.hidden = true;
    document.body.classList.remove('in-battle');
    this.active = false; this.input = null;
    game.audio.scene = null;                  // il gioco sceglie di nuovo la musica giusta
    if (this.prevScene === 'bar') game.audio.setScene('bar');
    await this.game.ui.fade(false);
    game.locked = false;
  }

  // ---------- Round e turni ----------
  _order() {
    const s = this.s;
    let heroSpd = COMBAT.heroBaseSpd + s.level * 0.5;
    if (s.tired >= 80) heroSpd -= 3;
    this.hero.spd = heroSpd;
    const units = [this.hero, ...this.enemies.filter(e => e.alive)];
    if (this.heroFirst && this.round === 1) return [this.hero, ...units.slice(1).sort((a, b) => b.spd - a.spd)];
    return units.map(u => ({ u, k: u.spd + rand(0, 3) })).sort((a, b) => b.k - a.k).map(x => x.u);
  }

  async _round() {
    const order = this._order();
    for (let i = 0; i < order.length; i++) {
      const u = order[i];
      if (!u.hero && !u.alive) continue;
      this._renderOrder(order, i);
      if (u.hero) {
        if (await this._hook('heroTurn')) { this._clampStats(); this._refresh(); if (this.s.health <= 0) return 'lose'; continue; }
        const r = await this._heroTurn();
        if (r === 'flee') return 'flee';
        // Lottatore grado 4: due azioni nel primo turno
        if (this.round === 1 && this.game.prog?.bonus('primoTurnoDoppio') && this.enemies.some(e => e.alive)) {
          await this._say('Garonio è carico: agisce ancora!', 800);
          if (await this._heroTurn() === 'flee') return 'flee';
        }
      } else if (!(await this._hook('enemyTurn', u))) await this._enemyTurn(u);
      this._clampStats(); this._refresh();
      if (this.enemies.every(e => !e.alive)) return 'win';
      if (this.s.health <= 0 && !(await this._santino())) return 'lose';
    }
    await this._hook('roundEnd');
    this._clampStats(); this._refresh();
    if (this.enemies.every(e => !e.alive)) return 'win';
    if (this.s.health <= 0) return 'lose';
    this.round++;
    for (const e of this.enemies) { if (e.scared > 0) e.scared--; if (e.blind > 0) e.blind--; }
    if (this.hero.ubriaco > 0) this.hero.ubriaco--;
    return null;
  }

  // Santino della nonna (o Fusibile fortunato): una volta al giorno, a Vita 0 Garonio si rialza
  async _santino() {
    const g = this.game, s = this.s;
    if (!g.prog?.bonus('santino')) return false;
    s.flags.armi ??= {};
    if (s.flags.armi.santinoGiorno === s.day) return false;
    s.flags.armi.santinoGiorno = s.day;
    s.health = g.prog.bonus('rialzaMeta') ? Math.round(s.maxHealth / 2) : 20;
    this._heroPose('idle'); this._float(this.heroWrap, `+${s.health} Vita`, 'heal');
    g.audio.sfx('level');
    await this._say(g.prog.bonus('rialzaMeta') ? 'Il fusibile fortunato fa una scintilla: Garonio si rialza!' : 'Il santino della nonna brilla nella tasca: Garonio si rialza!', 1500);
    this._refresh();
    return true;
  }

  _renderOrder(order, cur) {
    this.orderBox.innerHTML = '<b>Turni</b>' + order.map((u, i) => {
      const dead = !u.hero && !u.alive;
      return `<span class="${i === cur ? 'cur' : ''} ${u.hero ? 'hero' : ''} ${dead ? 'dead' : ''}">${u.name}</span>`;
    }).join('');
  }

  // ---------- Turno di Garonio ----------
  async _heroTurn() {
    const s = this.s, h = this.hero;
    h.defending = false;
    if (h.napping) { h.napping = false; this.heroCv.classList.remove('nap'); }
    this.heroCv.classList.add('active');
    try {
      for (;;) {
        this._msg(`Tocca a Garonio. Che si fa?${s.stress >= COMBAT.rageStress ? '  (Lo stress ribolle: Rabbia Incontrollata pronta!)' : ''}`);
        const c = await this._choose(MAIN.map((label, i) => ({ label, disabled: i === 4 && !this.canFlee })), false);
        if (c === 0) {
          const t = await this._chooseTarget();
          if (!t) continue;
          s.tired += COMBAT.attackTired;
          await this._heroStrike([t], 1, 'Garonio attacca!');
          return;
        }
        if (c === 1) {
          const list = this.skills.map(k => {
            const why = this._skillLock(k);
            return {
              label: why ? `${k.name} (${why})` : k.name,
              right: k.rage ? `stress ${COMBAT.rageStress}+` : k.tired > 0 ? `stanc. +${k.tired}` : k.tired < 0 ? `stanc. ${k.tired}` : k.stress ? `stress +${k.stress}` : 'gratis',
              desc: (k.arma ? `[${k.arma}] ` : '') + k.desc, disabled: !!why || (k.rage && s.stress < COMBAT.rageStress) || (k.tired > 0 && s.tired + k.tired > 100), rage: k.rage,
            };
          });
          const i = await this._choose(list, true);
          if (i < 0) continue;
          const k = this.skills[i];
          let targets = null;
          if (k.target === 'one' || k.target === 'two') {
            const t = await this._chooseTarget(); if (!t) continue;
            targets = [t];
            if (k.target === 'two') { const o = this.enemies.find(e => e.alive && e !== t); if (o) targets.push(o); }
          }
          await this._useSkill(k, targets);
          return;
        }
        if (c === 2) {
          const items = this.items.filter(it => s.inv[it.id] > 0 || ['uova', 'pomodoro', 'mais'].includes(it.id));
          const list = items.map(it => ({ label: it.name, right: `x${s.inv[it.id] || 0}`, desc: it.desc, disabled: !(s.inv[it.id] > 0) }));
          const i = await this._choose(list, true);
          if (i < 0) continue;
          const it = items[i];
          let target = null;
          if (it.target === 'one') { target = await this._chooseTarget(); if (!target) continue; }
          await this._useItem(it, target);
          return;
        }
        if (c === 3) {
          h.defending = true;
          s.tired -= 4;
          this._heroPose('guard');
          await this._say(`Garonio si para dietro ${this.place === 'bar' ? 'il bancone' : 'l\'attrezzo'}. (Stanchezza -4)`, 1100);
          return;
        }
        if (c === 4) {
          s.tired += COMBAT.fleeTired;
          const foes = this.enemies.filter(e => e.alive);
          const avg = foes.reduce((a, e) => a + e.spd, 0) / foes.length;
          const chance = clamp(0.5 + (h.spd - avg) * 0.06, 0.2, 0.9);
          this._heroPose('run');
          if (Math.random() < chance) { await this._sleep(400); return 'flee'; }
          this._heroPose('idle');
          await this._say('Garonio prova a scappare... ma inciampa nei suoi stessi stivali!', 1300);
          return;
        }
      }
    } finally {
      this.heroCv.classList.remove('active');
      this._clampStats(); this._refresh();
    }
  }

  _heroAtk() {
    const s = this.s, p = this.game.prog;
    if (!p) return COMBAT.heroBaseAtk + s.level * 2;
    let atk = p.atk();
    // al bar l'arma resta fuori dalla porta
    if (this.place === 'bar') atk -= p.arma().atk + (s.prog.affilatura[p.arma().id] || 0) * 2;
    return atk;
  }

  // perché una mossa non si può usare (null = si può)
  _skillLock(k) {
    const s = this.s, g = this.game;
    if (s.level < k.lvl) return `Lv ${k.lvl}`;
    if (k.locked2) return 'Lottatore 3';
    if (k.benzina && !(s.inv.benzina > 0)) return 'serve benzina';
    if (k.soloMezzo && !this.inMezzo) return 'solo col mezzo';
    if (k.cane && !(s.flags?.cane || s.upgrades?.cane || g.prog?.bonus('cane'))) return 'serve il cane';
    if (k.unaVolta && this.hero.fiato) return 'già usato';
    return null;
  }

  _dmg(atk, pow, def) { return Math.max(1, Math.round((atk * pow - def * 0.5) * rand(0.85, 1.15))); }

  async _heroStrike(targets, pow, text, { rage = false, sure = false, critico = 0, ignoraDif = 0, stordisce = 0, letame = 0, colpi = 1 } = {}) {
    const s = this.s, h = this.hero;
    this._msg(text);
    await this._lunge(targets[0], rage);
    this.game.audio.sfx('whoosh');
    let acc = 0.95;
    // stress: sopra 30 la mira peggiora sempre di più (a 100 un colpo su tre va a vuoto); la Rabbia no, quella sfoga
    if (!rage) acc -= COMBAT.stressMira * Math.max(0, s.stress - COMBAT.stressDa) / (100 - COMBAT.stressDa);
    if (s.tired >= 80) acc -= 0.1;
    if (h.ubriaco > 0) acc -= 0.25;
    const carica = h.charge; h.charge = 0;
    const critChance = COMBAT.critBase + (this.game.prog?.bonus('critico') || 0) + critico;
    for (let c = 0; c < colpi; c++) for (const t of targets) {
      if (!t.alive || t.hp <= 0) continue;
      if (this.script?.immune?.(t)) { this._float(t.wrap, 'Immune!', 'miss'); continue; }
      if (!sure && Math.random() > acc) { this._float(t.wrap, 'Mancato!', 'miss'); this.game.audio.sfx('dodge'); continue; }
      let d = this._dmg(this._heroAtk(), pow, t.def_ * (1 - ignoraDif));
      if (carica) d = Math.round(d * (1 + carica));
      const crit = Math.random() < critChance;
      if (crit) d = Math.round(d * 1.5);
      this.game.audio.sfx(crit || rage ? 'crit' : 'punch');
      this._hitEnemy(t, d, crit);
      await this._hook('hit', t, d);
      if (stordisce && t.hp > 0) { t.stun = Math.max(t.stun, stordisce); setTimeout(() => this._float(t.wrap, 'Stordito!', 'miss'), 250); }
      if (letame && t.hp > 0) { t.blind = Math.max(t.blind, letame); setTimeout(() => this._float(t.wrap, 'Accecato!', 'miss'), 250); }
      if (colpi > 1) await this._sleep(250);
    }
    await this._sleep(500);
    await this._back();
    if (s.stress >= 70 && !rage) await this._say(s.stress >= 90 ? 'Garonio è così nervoso che trema tutto...' : 'Il nervoso gli fa tremare le mani...', 900);
    await this._checkDeaths();
  }

  _hitEnemy(t, d, crit) {
    t.hp = Math.max(0, t.hp - d);
    this._float(t.wrap, crit ? `${d}!!` : `${d}`, crit ? 'crit' : 'dmg');
    this._flash(t.cv);
    this._refresh();
  }

  async _checkDeaths() {
    for (const e of this.enemies) if (e.alive && e.hp <= 0) {
      e.alive = false;
      e.wrap.classList.add('dead');
      const line = e.def.bar ? `${e.name} se ne torna al bancone, umiliato.` : e.def.fuga ? `${e.name} ${e.def.fuga}` : `${e.name} scappa nel canale!`;
      await this._say(line, 1000);
    }
  }

  async _useSkill(k, targets) {
    const s = this.s, h = this.hero, g = this.game;
    s.tired += k.tired;
    const alive = () => this.enemies.filter(e => e.alive);
    const opts = { critico: k.critico || 0, ignoraDif: k.ignoraDif || 0, stordisce: k.stordisce || 0, letame: k.letame || 0, colpi: k.colpi || 1 };
    await this._hook('skill', k.id);
    if (k.id === 'rabbia') {
      s.stress -= 35;
      this.root.classList.add('rage');
      g.ui.shake();
      await this._say('Garonio esplode: RABBIA INCONTROLLATA!', 1100);
      await this._heroStrike(alive(), k.pow, 'AAARGH!', { rage: true, sure: true });
      this.root.classList.remove('rage');
      await this._say('Che sfogo. (Stress -35)', 900);
      return;
    }
    if (k.id === 'pisolino') {
      h.napping = true;
      this.heroCv.classList.add('nap');
      this._heroPose('ko');
      this._float(this.heroWrap, 'Zzz', 'heal');
      await this._say('Garonio si fa un pisolino in mezzo allo scontro. Stanchezza -15.', 1300);
      return;
    }
    if (k.id === 'clacson') {
      this._heroPose('attack'); g.audio.sfx('horn_punto'); g.ui.shake();
      const piccoli = alive().filter(e => NEMICI_PICCOLI.includes(e.id));
      await this._say('PEEEEEP! Garonio suona il clacson a tutto volume.', 1100);
      for (const e of piccoli) { e.hp = 0; this._float(e.wrap, 'Scappa!', 'miss'); }
      for (const e of alive()) if (!piccoli.includes(e)) { e.scared = Math.max(e.scared, 1); }
      this._heroPose('idle');
      if (!piccoli.length) await this._say('...ma qui nessuno si spaventa per un clacson.', 1000);
      await this._checkDeaths();
      return;
    }
    if (k.id === 'bestemmia') {
      s.stress += k.stress; h.charge = k.carica;
      this._heroPose('guard'); g.ui.shake();
      this._float(this.heroWrap, `Stress +${k.stress}`, 'stress');
      await this._say('«Porc... porca la miseria.» Garonio si morde la lingua e si carica: il prossimo colpo fa +50%.', 1600);
      this._heroPose('idle');
      return;
    }
    if (k.id === 'fiato') {
      h.fiato = true; s.health += k.vita;
      this._float(this.heroWrap, `+${k.vita} Vita`, 'heal'); g.audio.sfx('eat');
      await this._say('Garonio respira a fondo, come quando scappa dal Gigante. Secondo fiato! (Stanchezza -40, Vita +20)', 1500);
      return;
    }
    if (k.cane) {
      await this._say('Garonio fischia. Dal fondo dei campi arriva il cane, che non aspettava altro!', 1300);
      const t = targets[0];
      const d = this._dmg(this._heroAtk(), k.pow, t.def_);
      this._hitEnemy(t, d, false); this._float(t.wrap, 'Morso!', 'miss'); g.audio.sfx('punch');
      await this._sleep(500);
      await this._checkDeaths();
      return;
    }
    if (k.benzina) g.prog ? g.prog.togliOggetto('benzina') : s.inv.benzina--;
    // mosse senza danno: spavento o accecamento
    if (!k.pow) {
      this._heroPose('attack');
      g.audio.sfx(k.benzina || k.id === 'avviamento' ? 'horn_trattore' : 'bad'); g.ui.shake();
      const tg = k.target === 'all' || k.target === 'self' ? alive() : targets;
      for (const e of tg) {
        if (k.paura) { e.scared = Math.max(e.scared, k.paura); this._float(e.wrap, 'Paura!', 'miss'); }
        if (k.letame) { e.blind = Math.max(e.blind, k.letame); this._float(e.wrap, 'Accecato!', 'miss'); }
      }
      const frasi = {
        urlo: '«VIA DI QUA, BESTIACCE!» I nemici si spaventano.',
        letame: `Garonio raccoglie una manciata di letame e la tira in faccia a ${targets?.[0]?.name}. Che mira!`,
        avviamento: 'Garonio dà uno strappo alla motosega: VROOOM! I nemici fanno un passo indietro.',
      };
      await this._say(frasi[k.id] || `${k.name}!`, 1300);
      this._heroPose('idle');
      return;
    }
    // mossa d'attacco (di solito la mossa dell'arma)
    const tg = k.target === 'all' ? alive() : targets;
    const urlo = { zappata: 'ZAPPATA!', motosegata: 'BRRRRRAAAAAM!', fendente: 'Fendente della Bassa!', scossa: 'Bzzzt! SCOSSA!' }[k.id] || `${k.name}!`;
    if (k.benzina) { this.root.classList.add('rage'); g.ui.shake(); }
    await this._heroStrike(tg, k.pow, `Garonio: ${urlo}`, opts);
    this.root.classList.remove('rage');
    if (k.paura) for (const e of alive()) { e.scared = Math.max(e.scared, k.paura); this._float(e.wrap, 'Terrore!', 'miss'); }
  }

  async _useItem(it, target) {
    const s = this.s, h = this.hero, g = this.game, e = it.effetto;
    g.prog ? g.prog.togliOggetto(it.id) : s.inv[it.id]--;
    const cure = 1 + (g.prog?.bonus('cure') || 0);
    if (it.target === 'one') {
      this._msg(`Garonio lancia: ${it.name}!`);
    await this._hook('item', it.id, target);
      this._heroPose('attack');
      g.audio.sfx('whoosh');
      await this._sleep(350);
      if (e.danno) {
        g.audio.sfx('splat');
        if (this.script?.immune?.(target)) this._float(target.wrap, 'Immune!', 'miss');
        else this._hitEnemy(target, e.danno, false);
        this._float(target.wrap, 'Splat!', 'miss');
      }
      if (e.stordisce) {
        const piccolo = NEMICI_PICCOLI.includes(target.id);
        target.stun = Math.max(target.stun, piccolo ? 2 : 1);
        this._float(target.wrap, piccolo ? 'Preso!' : 'Stordito!', 'miss');
        await this._say(piccolo ? `${target.name} finisce nella trappola: salta due turni!` : `${target.name} pesta la trappola: salta un turno.`, 1100);
      }
      await this._sleep(500);
      this._heroPose('idle');
      await this._checkDeaths();
      return;
    }
    const fatto = [];
    if (e.health) { const v = Math.round(e.health * cure); s.health += v; fatto.push(`Vita +${v}`); }
    if (e.tired) { const v = Math.round(e.tired * cure); s.tired += v; fatto.push(`Stanchezza ${v}`); }
    if (e.stress) { s.stress += e.stress; fatto.push(`Stress ${e.stress}`); }
    if (e.ubriaco) { h.ubriaco = e.ubriaco; fatto.push('ma ci vede doppio'); }
    if (e.guarisce) { h.infetto = 0; s.flags.infetto = 0; fatto.push('ferite pulite'); }
    g.audio.sfx('eat');
    this._float(this.heroWrap, fatto[0] || 'Gnam', 'heal');
    const verbo = { pomodoro: 'addenta un pomodoro', mais: 'sgranocchia una pannocchia', caffe: 'manda giù un caffè', panino: 'divora un panino col salame', grappa: 'butta giù una grappa', pomata: 'si spalma la pomata', patata: 'mangia una patata (cruda?!)' }[it.id] || `usa: ${it.name}`;
    await this._say(`Garonio ${verbo}. ${fatto.join(', ')}.`, 1200);
  }

  // ---------- Turno dei nemici ----------
  async _enemyTurn(e) {
    const s = this.s, h = this.hero;
    if (e.sleep > 0) { e.sleep--; await this._say(`${e.name} russa...`, 900); return; }
    if (e.stun > 0) { e.stun--; this._float(e.wrap, 'Zzz', 'miss'); await this._say(`${e.name} è stordito e non si muove.`, 900); return; }
    const tot = e.def.moves.reduce((a, m) => a + m.w, 0);
    let r = Math.random() * tot, mv = e.def.moves[0];
    for (const m of e.def.moves) { r -= m.w; if (r <= 0) { mv = m; break; } }
    if (mv.skip) { e.sleep = 1; await this._say(mv.line || `${e.name} non fa niente.`, 1100); return; }

    this._msg(`${e.name}: ${mv.name}!${mv.line ? '  ' + mv.line : ''}`);
    e.wrap.classList.add('lunge');
    await this._sleep(320);
    e.wrap.classList.remove('lunge');

    if (mv.pow > 0 && Math.random() > (h.napping ? 1 : e.blind > 0 ? 0.6 : 0.9)) {
      this._float(this.heroWrap, 'Schivato!', 'miss'); this.game.audio.sfx('dodge');
      this._heroPose('jump');
      await this._sleep(700);
      this._heroPose('idle');
      return;
    }
    let dmg = mv.pow > 0 ? this._dmg(e.atk * (e.scared > 0 ? 0.6 : 1), mv.pow, (this.game.prog ? this.game.prog.def() : COMBAT.heroBaseDef + s.level)) : 0;
    let stress = mv.stress;
    // vestiti e abilità che proteggono dallo stress (cappellino, mantello; prese in giro con Nervi saldi 2)
    const P = this.game.prog;
    if (P && stress) stress = Math.round(stress * Math.max(0.2, 1 - P.bonus('stress') - (mv.pow ? 0 : P.bonus('stressPreseInGiro'))));
    if (h.defending) { dmg = Math.ceil(dmg / 2); stress = Math.ceil(stress / 2); }
    if (h.napping) dmg = Math.round(dmg * 1.5);
    s.health -= dmg; s.stress += stress;
    if (dmg) { this._float(this.heroWrap, `-${dmg}`, 'dmg'); this._flash(this.heroCv); this.game.audio.sfx('hurt'); }
    if (stress) setTimeout(() => this._float(this.heroWrap, `Stress +${stress}`, 'stress'), dmg ? 250 : 0);
    if (!dmg) this.game.audio.sfx('bad');
    if (mv.steal && s.inv[mv.steal] > 0) { s.inv[mv.steal]--; this._float(e.wrap, '+1 uovo', 'miss'); }
    await this._hook('enemyMove', e, mv, dmg);
    if (!h.napping && !h.defending) this._heroPose('hurt');
    this._clampStats(); this._refresh();
    await this._sleep(800);
    if (!h.napping) this._heroPose(h.defending ? 'guard' : 'idle');
  }

  // ---------- Animazioni ----------
  _heroPose(p) {
    this.pose = p;
    const A = PIX.GARONIO_ANIM;
    const f = { idle: A.idle[0], attack: A.attack[0], ko: A.ko[0], guard: A.jump[0], hurt: A.jump[0], jump: A.jump[1], run: A.run[0], win: A.jump[1] }[p] ?? 0;
    drawFrame(this.heroCv, this.heroFrames[f]);
  }

  _idleAnim() {
    this._tick = (this._tick || 0) + 1;
    for (const e of this.enemies) if (e.alive) drawFrame(e.cv, e.frames[this._tick % e.frames.length]);
    if (this.pose === 'run') drawFrame(this.heroCv, this.heroFrames[PIX.GARONIO_ANIM.run[this._tick % 3]]);
    if (this.pose === 'win') drawFrame(this.heroCv, this.heroFrames[PIX.GARONIO_ANIM.jump[1 + this._tick % 2]]);
  }

  async _lunge(target, rage) {
    const hr = this.heroWrap.getBoundingClientRect(), tr = target.wrap.getBoundingClientRect();
    const dx = Math.max(0, tr.left - hr.right + hr.width * 0.35);
    const dy = (tr.bottom - hr.bottom) * 0.8;
    this._heroPose('run');
    this.heroWrap.style.transform = `translate(${dx}px, ${dy}px)`;
    if (rage) this.heroCv.classList.add('rage');
    await this._sleep(330);
    this._heroPose('attack');
  }

  async _back() {
    this.heroWrap.style.transform = '';
    this.heroCv.classList.remove('rage');
    this._heroPose('run');
    await this._sleep(300);
    this._heroPose('idle');
  }

  _flash(cv) { cv.classList.remove('hit'); void cv.offsetWidth; cv.classList.add('hit'); }

  _float(target, text, kind) {
    const f = el('div', 'b-float ' + kind, target, null);
    f.textContent = text;
    setTimeout(() => f.remove(), 1100);
  }

  // ---------- Interfaccia ----------
  _build() {
    if (this.root) return;
    if (!document.getElementById('combat-css')) {
      const link = el('link', null, document.head);
      link.id = 'combat-css'; link.rel = 'stylesheet'; link.href = new URL('./combat.css', import.meta.url).href;
    }
    const r = this.root = el('div', null, document.body);
    r.id = 'battle'; r.hidden = true;
    this.orderBox = el('div', 'b-order', r);
    const stage = el('div', 'b-stage', r);
    el('div', 'b-floor', stage);
    this.heroWrap = el('div', 'b-hero', stage);
    this.heroCv = el('canvas', 'b-sprite', this.heroWrap);
    this.enemyBox = el('div', 'b-enemies', stage);
    const bottom = el('div', 'b-bottom', r);
    this.cmdBox = el('div', 'b-cmd b-panel', bottom);
    this.msgBox = el('div', 'b-msg b-panel', bottom);
    const party = el('div', 'b-party b-panel', bottom, `
      <div class="b-head"><img src="assets/sprites/garonio_ritratto.png" alt=""><span>Garonio</span><em class="b-lv"></em></div>
      <div class="bar health"><label>Vita</label><div class="track"><div class="fill"></div></div><span></span></div>
      <div class="bar stress"><label>Stress</label><div class="track"><div class="fill"></div></div><span></span></div>
      <div class="bar tired"><label>Stanch.</label><div class="track"><div class="fill"></div></div><span></span></div>`);
    this.partyBox = party;
    // Su telefono si tocca dove capita: un tocco ovunque (fuori dai pulsanti e dai nemici) fa avanzare i messaggi.
    r.addEventListener('click', e => {
      if (!this.active || !this.saying || !this.input) return;
      if (e.target.closest('button, .b-enemy')) return;
      this.input('ok');
    });
    const btn = document.getElementById('btn-a');
    if (btn) btn.addEventListener('pointerdown', () => this.active && this.input && this.input('ok'));
  }

  _refresh() {
    const s = this.s;
    for (const k of ['health', 'stress', 'tired']) {
      const max = k === 'health' ? (s.maxHealth || 100) : 100;
      const v = clamp(s[k] / max * 100, 0, 100);
      const b = this.partyBox.querySelector('.bar.' + k);
      b.querySelector('.fill').style.width = v + '%';
      b.querySelector('span').textContent = Math.round(s[k]);
      b.classList.toggle('danger', k === 'health' ? v < 25 : v > 80);
    }
    this.partyBox.querySelector('.b-lv').textContent = `Lv ${s.level}`;
    for (const e of this.enemies || []) e.fill.style.width = (e.hp / e.max * 100) + '%';
  }

  _clampStats() {
    const s = this.s;
    s.health = clamp(s.health, 0, s.maxHealth || 100); s.stress = clamp(s.stress, 0, 100); s.tired = clamp(s.tired, 0, 100);
  }

  _msg(text) { this.msgBox.textContent = text; }

  // Mostra un messaggio e aspetta (Invio o click lo accorciano). wait=true aspetta proprio la conferma.
  _say(text, ms = 1000, wait = false) {
    this._msg(text);
    this.cmdBox.innerHTML = '';
    return new Promise(res => {
      let done = false;
      const finish = () => { if (done) return; done = true; clearTimeout(t); this.saying = false; this.input = null; this.msgBox.classList.remove('more'); res(); };
      // anche i messaggi che aspettano un tocco vanno avanti da soli dopo qualche secondo: lo scontro non resta mai fermo
      const t = setTimeout(finish, wait ? Math.max(ms, 4500) : ms);
      this.saying = true;
      if (wait) { this.msgBox.classList.add('more'); }
      setTimeout(() => { if (!done) this.input = k => { if (k === 'ok') finish(); }; }, wait ? 400 : 150);
    });
  }

  _sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

  // Menu verticale nella finestra dei comandi. Restituisce l'indice scelto o -1 (indietro).
  _choose(options, canBack) {
    return new Promise(res => {
      const box = this.cmdBox;
      box.innerHTML = '';
      const base = this.msgBox.textContent;
      let sel = options.findIndex(o => !o.disabled); if (sel < 0) sel = 0;
      const btns = options.map((o, i) => {
        const b = el('button', (o.disabled ? 'disabled ' : '') + (o.rage ? 'rage' : ''), box);
        b.innerHTML = `<span>${o.label}</span>${o.right ? `<em>${o.right}</em>` : ''}`;
        b.addEventListener('click', ev => { ev.stopPropagation(); sel = i; mark(); confirm(); });
        return b;
      });
      if (canBack) {
        const b = el('button', 'back', box, '<span>◀ Indietro</span>');
        b.addEventListener('click', ev => { ev.stopPropagation(); done(-1); });
      }
      const mark = () => {
        btns.forEach((b, i) => b.classList.toggle('sel', i === sel));
        btns[sel]?.scrollIntoView?.({ block: 'nearest' });
        this._msg(options[sel].desc || base);
      };
      const done = v => { this.input = null; box.innerHTML = ''; res(v); };
      const confirm = () => {
        if (options[sel].disabled) { this.game.audio.sfx('bad'); return; }
        this.game.audio.sfx('blip'); done(sel);
      };
      this.input = k => {
        if (k === 'up' || k === 'down') { sel = (sel + (k === 'up' ? options.length - 1 : 1)) % options.length; mark(); this.game.audio.sfx('blip'); }
        else if (k === 'ok') confirm();
        else if (k === 'back' && canBack) { this.game.audio.sfx('blip'); done(-1); }
      };
      mark();
    });
  }

  // Scelta del bersaglio: frecce per cambiare, conferma, oppure tocco sul nemico.
  _chooseTarget() {
    const alive = this.enemies.filter(e => e.alive);
    if (alive.length === 1) return Promise.resolve(alive[0]);
    return new Promise(res => {
      let i = 0;
      const base = this.msgBox.textContent;
      const mark = () => { alive.forEach((e, j) => e.wrap.classList.toggle('target', j === i)); this._msg(`Chi colpisci? ${alive[i].name}  (◀ ▶ o tocca il nemico)`); };
      const done = v => { alive.forEach(e => e.wrap.classList.remove('target')); this.input = null; this._msg(base); res(v); };
      this.cmdBox.innerHTML = '';
      // su telefono: un pulsante per ogni nemico, oltre al tocco diretto sul nemico
      alive.forEach(e => {
        const t = el('button', '', this.cmdBox, `<span>${e.name}</span>`);
        t.addEventListener('click', ev => { ev.stopPropagation(); this.game.audio.sfx('blip'); done(e); });
      });
      const b = el('button', 'back', this.cmdBox, '<span>◀ Indietro</span>');
      b.addEventListener('click', ev => { ev.stopPropagation(); done(null); });
      this.input = (k, e) => {
        if (k === 'target' && e && e.alive) { this.game.audio.sfx('blip'); done(e); }
        else if (['left', 'right', 'up', 'down'].includes(k)) { i = (i + (k === 'left' || k === 'up' ? alive.length - 1 : 1)) % alive.length; mark(); this.game.audio.sfx('blip'); }
        else if (k === 'ok') { this.game.audio.sfx('blip'); done(alive[i]); }
        else if (k === 'back') done(null);
      };
      mark();
    });
  }

  _onKey(e) {
    if (!this.active) return;
    e.stopImmediatePropagation();
    if (e.code !== 'F5' && e.code !== 'F12') e.preventDefault();
    if (e.code === 'KeyM') { document.getElementById('btn-music')?.click(); return; }
    const k = KEYS[e.code];
    if (!k || (e.repeat && k === 'ok')) return;
    this.game.audio.unlock();
    if (this.input) this.input(k);
  }
}
