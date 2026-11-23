// Combattimento a turni stile JRPG.
// Una schermata di battaglia a parte (HTML sopra il mondo 3D), con ordine dei turni,
// comandi Attacca / Abilità / Oggetti / Difendi / Fuggi e nemici con le loro mosse.
// È legato alle tre barre di Garonio: i colpi tolgono Vita, le prese in giro alzano lo Stress,
// ogni azione costa Stanchezza. Con lo stress alto si sblocca "Rabbia Incontrollata".
//
// Uso dal gioco:  const esito = await game.combat.start({ enemies: ['nutria', 'nutria'], place: 'campo' });
// esito: 'win' | 'lose' | 'flee'
import * as PIX from './pixel.js';

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
  rageStress: 60,        // stress minimo per usare Rabbia Incontrollata
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

function fox(frame = 0) {
  const [c, g] = PIX.makeCanvas(22, 14);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#d0661e', 0, 5 - frame, 6, 3); P('#f4ead8', 0, 5 - frame, 2, 2);   // coda
  P('#d8702a', 5, 5, 11, 5); P('#f4ead8', 8, 8, 6, 2);                  // corpo e pancia
  P('#d8702a', 15, 2, 5, 5); P('#f4ead8', 17, 5, 4, 2);                 // testa e muso
  P('#d8702a', 15, 0, 2, 2); P('#d8702a', 18, 0, 2, 2);                 // orecchie
  P('#1a1420', 18, 3, 1, 1); P('#1a1420', 21, 5, 1, 1);                 // occhio e naso
  P('#3a2418', 6, 10, 2, 3 - frame); P('#3a2418', 13, 10, 2, 2 + frame); // zampe
  return outline(c);
}

function boar(frame = 0) {
  const [c, g] = PIX.makeCanvas(26, 17);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#4a3a2e', 2, 4, 17, 9); P('#5c4a3a', 3, 4, 14, 3);                 // corpo
  for (let x = 4; x < 17; x += 3) P('#2e241c', x, 3, 1, 2);            // setole
  P('#4a3a2e', 17, 5, 7, 7); P('#7a5e4a', 22, 8, 3, 3);                 // testa e grugno
  P('#f4ead8', 21, 10, 1, 3); P('#f4ead8', 24, 10, 1, 2);               // zanne
  P('#e04040', 19, 6, 1, 1);                                            // occhio cattivo
  P('#2e241c', 0, 6, 2, 1);                                             // codina
  P('#2e241c', 4, 13, 3, 3 - frame); P('#2e241c', 14, 13, 3, 2 + frame);
  return outline(c);
}

const DRUNK = { w: 18, h: 25, skin: '#e89a80', hair: '#8a8a8a', hairStyle: 'bald', shirt: '#7a8a3a', pants: '#4a4a4a', boots: '#222', belly: true, mustache: '#6a6a6a', eyes: 'sleepy' };

// sprite rivolti a sinistra (verso Garonio)
const left = canvases => canvases.map(PIX.mirror);
const humanLeft = o => [0, 1, 2].map(f => PIX.mirror(PIX.humanoid(o, f)));

// ---------- Nemici ----------
// moves: pow = forza del colpo (0 = nessun danno), stress = stress che provoca, w = probabilità relativa
export const ENEMIES = {
  nutria: {
    name: 'Nutria', hp: 16, atk: 6, def: 1, spd: 6, xp: 5, money: 0, size: 3.2,
    frames: () => left([PIX.nutria(0), PIX.nutria(1)]),
    moves: [
      { name: 'Morso', pow: 1, stress: 1, w: 3 },
      { name: 'Colpo di coda', pow: 0.7, stress: 2, w: 2 },
      { name: 'Denti arancioni', pow: 1.4, stress: 2, w: 1 },
    ],
  },
  nutria_gigante: {
    name: 'Mamma Nutria', hp: 40, atk: 9, def: 3, spd: 4, xp: 14, money: 0, size: 4.2,
    frames: () => left([PIX.nutria(0), PIX.nutria(1)]),
    moves: [
      { name: 'Morsone', pow: 1.2, stress: 2, w: 3 },
      { name: 'Schiacciata di pancia', pow: 1.6, stress: 3, w: 1 },
      { name: 'Squittio furioso', pow: 0, stress: 6, w: 1 },
    ],
  },
  volpe: {
    name: 'Volpe', hp: 24, atk: 8, def: 2, spd: 11, xp: 10, money: 0, size: 3.4,
    frames: () => left([fox(0), fox(1)]),
    moves: [
      { name: 'Morso rapido', pow: 1, stress: 1, w: 3 },
      { name: 'Ruba un uovo', pow: 0.4, stress: 4, steal: 'uova', w: 1 },
      { name: 'Ghigno beffardo', pow: 0, stress: 5, w: 1 },
    ],
  },
  cinghiale: {
    name: 'Cinghiale', hp: 52, atk: 12, def: 5, spd: 3, xp: 22, money: 0, size: 4.6,
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
const SKILLS = [
  { id: 'zappata', name: 'Zappata', lvl: 1, tired: 6, target: 'one', pow: 1.7, desc: 'Colpo forte su un nemico.' },
  { id: 'pisolino', name: 'Pisolino tattico', lvl: 1, tired: -15, target: 'self', desc: 'Stanchezza -15, ma il prossimo colpo fa più male.' },
  { id: 'urlo', name: 'Urlo da campagna', lvl: 2, tired: 5, target: 'all', desc: 'Spaventa i nemici: attaccano più piano per 3 turni.' },
  { id: 'spazzata', name: 'Spazzata col forcone', lvl: 3, tired: 10, target: 'all', pow: 1.0, desc: 'Colpisce tutti i nemici.' },
  { id: 'rabbia', name: 'Rabbia Incontrollata', lvl: 1, tired: 8, target: 'all', pow: 2.4, rage: true, desc: 'Sfoga lo stress: colpo enorme a tutti, stress -35. Serve stress 60+.' },
];

const ITEMS = [
  { id: 'uova', name: 'Uovo', target: 'one', desc: 'Lancialo in faccia: 12 danni.' },
  { id: 'pomodoro', name: 'Pomodoro', target: 'self', desc: 'Mangialo: Vita +18.' },
  { id: 'mais', name: 'Pannocchia', target: 'self', desc: 'Sgranocchiala: Stanchezza -15.' },
];

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
  async start({ enemies, place = 'campo', canFlee = true, intro = null }) {
    if (this.active) return 'flee';
    const { game } = this;
    this.active = true; game.locked = true;
    this._build();
    this.place = place; this.canFlee = canFlee; this.round = 1;
    this.root.className = 'place-' + place;
    document.body.classList.add('in-battle');

    // Garonio
    const gf = PIX.garonioFrames();
    this.heroFrames = gf.frames;
    this.hero = { name: 'Garonio', hero: true, defending: false, napping: false };
    this.heroCv.className = 'b-sprite';
    this.heroWrap.style.transform = '';
    this._heroPose('idle');

    // nemici, con lettere se sono più di uno dello stesso tipo
    this.enemies = [];
    this.enemyBox.innerHTML = '';
    const count = {};
    enemies.forEach(id => count[id] = (count[id] || 0) + 1);
    const seen = {};
    enemies.forEach((id, i) => {
      const d = ENEMIES[id];
      seen[id] = (seen[id] || 0) + 1;
      const name = count[id] > 1 ? `${d.name} ${'ABC'[seen[id] - 1]}` : d.name;
      const wrap = el('div', 'b-enemy', this.enemyBox);
      wrap.style.setProperty('--size', d.size);
      wrap.style.setProperty('--row', i);
      const info = el('div', 'b-einfo', wrap, `<span>${name}</span><div class="track"><div class="fill"></div></div>`);
      const cv = el('canvas', 'b-sprite', wrap);
      const frames = d.frames();
      drawFrame(cv, frames[0]);
      const e = { id, def: d, name, hp: d.hp, max: d.hp, atk: d.atk, def_: d.def, spd: d.spd, scared: 0, sleep: 0, frames, wrap, cv, fill: info.querySelector('.fill'), alive: true };
      wrap.addEventListener('click', () => this.input && this.input('target', e));
      this.enemies.push(e);
    });
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

    let result = null;
    while (!result) result = await this._round();
    await this._end(result);
    return result;
  }

  _introText() {
    const names = this.enemies.map(e => e.def.name);
    if (this.place === 'bar') return `${names[0]} si piazza davanti a Garonio. Non si può far finta di niente!`;
    if (names.length === 1) return `Una ${names[0].toLowerCase() === 'cinghiale' ? 'bestiaccia' : 'bestia'} selvatica: ${names[0]}! Garonio impugna la zappa.`;
    return `Arrivano ${names.length} nemici! Garonio sospira e impugna la zappa.`;
  }

  async _end(result) {
    const { game } = this, s = this.s;
    clearInterval(this._anim);
    if (result === 'win') {
      const xp = this.enemies.reduce((a, e) => a + e.def.xp, 0);
      const money = this.enemies.reduce((a, e) => a + e.def.money, 0);
      const calm = this.place === 'bar' ? 10 : 3;
      game.audio.sfx('level');
      this._heroPose('win');
      s.stress = clamp(s.stress - calm, 0, 100);
      s.money += money;
      await this._say(`Vittoria! +${xp} esperienza${money ? `, +${money}€ (offre il bar)` : ''}, stress -${calm}.`, 2200, true);
      game._xp(xp);
    } else if (result === 'lose') {
      game.audio.sfx('bad');
      this._heroPose('ko');
      s.health = Math.max(s.health, 5);
      await this._say('Garonio è a terra... Batte in ritirata, malconcio.', 2200, true);
    } else {
      await this._say('Garonio se la dà a gambe. Almeno in questo è veloce.', 1500, true);
    }
    s.minutes += this.round * COMBAT.minutesPerRound;
    this._clampStats();
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
    return units.map(u => ({ u, k: u.spd + rand(0, 3) })).sort((a, b) => b.k - a.k).map(x => x.u);
  }

  async _round() {
    const order = this._order();
    for (let i = 0; i < order.length; i++) {
      const u = order[i];
      if (!u.hero && !u.alive) continue;
      this._renderOrder(order, i);
      if (u.hero) {
        const r = await this._heroTurn();
        if (r === 'flee') return 'flee';
      } else await this._enemyTurn(u);
      this._clampStats(); this._refresh();
      if (this.enemies.every(e => !e.alive)) return 'win';
      if (this.s.health <= 0) return 'lose';
    }
    this.round++;
    for (const e of this.enemies) if (e.scared > 0) e.scared--;
    return null;
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
          const list = SKILLS.map(k => {
            const locked = s.level < k.lvl;
            const noRage = k.rage && s.stress < COMBAT.rageStress;
            const tooTired = k.tired > 0 && s.tired + k.tired > 100;
            return {
              label: locked ? `${k.name} (Lv ${k.lvl})` : k.name,
              right: k.rage ? `stress ${COMBAT.rageStress}+` : k.tired > 0 ? `stanc. +${k.tired}` : `stanc. ${k.tired}`,
              desc: k.desc, disabled: locked || noRage || tooTired, rage: k.rage,
            };
          });
          const i = await this._choose(list, true);
          if (i < 0) continue;
          const k = SKILLS[i];
          let targets = null;
          if (k.target === 'one') { const t = await this._chooseTarget(); if (!t) continue; targets = [t]; }
          await this._useSkill(k, targets);
          return;
        }
        if (c === 2) {
          const list = ITEMS.map(it => ({ label: it.name, right: `x${s.inv[it.id] || 0}`, desc: it.desc, disabled: !(s.inv[it.id] > 0) }));
          const i = await this._choose(list, true);
          if (i < 0) continue;
          const it = ITEMS[i];
          let target = null;
          if (it.target === 'one') { target = await this._chooseTarget(); if (!target) continue; }
          await this._useItem(it, target);
          return;
        }
        if (c === 3) {
          h.defending = true;
          s.tired -= 4;
          this._heroPose('guard');
          await this._say('Garonio si appoggia alla zappa e si para. (Stanchezza -4)', 1100);
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
    const s = this.s;
    return COMBAT.heroBaseAtk + s.level * 2 + (s.upgrades && s.upgrades.zappa ? 2 : 0);
  }

  _dmg(atk, pow, def) { return Math.max(1, Math.round((atk * pow - def * 0.5) * rand(0.85, 1.15))); }

  async _heroStrike(targets, pow, text, { rage = false, sure = false } = {}) {
    const s = this.s;
    this._msg(text);
    await this._lunge(targets[0], rage);
    this.game.audio.sfx('shoo');
    let acc = 0.95;
    if (s.stress >= 90) acc -= 0.15;
    if (s.tired >= 80) acc -= 0.1;
    for (const t of targets) {
      if (!t.alive) continue;
      if (!sure && Math.random() > acc) { this._float(t.wrap, 'Mancato!', 'miss'); continue; }
      let d = this._dmg(this._heroAtk(), pow, t.def_);
      const crit = Math.random() < 0.1;
      if (crit) d = Math.round(d * 1.5);
      this._hitEnemy(t, d, crit);
    }
    this.game.audio.sfx('dig');
    await this._sleep(500);
    await this._back();
    if (s.stress >= 90 && !rage) await this._say('Garonio è così nervoso che trema tutto...', 900);
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
      const line = e.def.bar ? `${e.name} se ne torna al bancone, umiliato.` : `${e.name} scappa nel canale!`;
      await this._say(line, 1000);
    }
  }

  async _useSkill(k, targets) {
    const s = this.s, h = this.hero;
    s.tired += k.tired;
    if (k.id === 'zappata') return this._heroStrike(targets, k.pow, 'Garonio: ZAPPATA!');
    if (k.id === 'spazzata') return this._heroStrike(this.enemies.filter(e => e.alive), k.pow, 'Spazzata col forcone!');
    if (k.id === 'rabbia') {
      s.stress -= 35;
      this.root.classList.add('rage');
      this.game.ui.shake();
      await this._say('Garonio esplode: RABBIA INCONTROLLATA!', 1100);
      await this._heroStrike(this.enemies.filter(e => e.alive), k.pow, 'AAARGH!', { rage: true, sure: true });
      this.root.classList.remove('rage');
      await this._say('Che sfogo. (Stress -35)', 900);
      return;
    }
    if (k.id === 'urlo') {
      this._heroPose('attack');
      this.game.audio.sfx('bad');
      this.game.ui.shake();
      for (const e of this.enemies) if (e.alive) { e.scared = 3; this._float(e.wrap, 'Paura!', 'miss'); }
      await this._say('«VIA DI QUA, BESTIACCE!» I nemici si spaventano.', 1300);
      this._heroPose('idle');
      return;
    }
    if (k.id === 'pisolino') {
      h.napping = true;
      this.heroCv.classList.add('nap');
      this._heroPose('ko');
      this._float(this.heroWrap, 'Zzz', 'heal');
      await this._say('Garonio si fa un pisolino in mezzo allo scontro. Stanchezza -15.', 1300);
    }
  }

  async _useItem(it, target) {
    const s = this.s;
    s.inv[it.id]--;
    if (it.id === 'uova') {
      this._msg('Garonio lancia un uovo!');
      this._heroPose('attack');
      this.game.audio.sfx('shoo');
      await this._sleep(350);
      this._hitEnemy(target, 12, false);
      this._float(target.wrap, 'Splat!', 'miss');
      await this._sleep(500);
      this._heroPose('idle');
      await this._checkDeaths();
    } else if (it.id === 'pomodoro') {
      s.health += 18; this.game.audio.sfx('eat'); this._float(this.heroWrap, '+18 Vita', 'heal');
      await this._say('Garonio addenta un pomodoro. Vita +18.', 1100);
    } else if (it.id === 'mais') {
      s.tired -= 15; this.game.audio.sfx('eat'); this._float(this.heroWrap, '-15 Stanch.', 'heal');
      await this._say('Garonio sgranocchia una pannocchia. Stanchezza -15.', 1100);
    }
  }

  // ---------- Turno dei nemici ----------
  async _enemyTurn(e) {
    const s = this.s, h = this.hero;
    if (e.sleep > 0) { e.sleep--; await this._say(`${e.name} russa...`, 900); return; }
    const tot = e.def.moves.reduce((a, m) => a + m.w, 0);
    let r = Math.random() * tot, mv = e.def.moves[0];
    for (const m of e.def.moves) { r -= m.w; if (r <= 0) { mv = m; break; } }
    if (mv.skip) { e.sleep = 1; await this._say(mv.line || `${e.name} non fa niente.`, 1100); return; }

    this._msg(`${e.name}: ${mv.name}!${mv.line ? '  ' + mv.line : ''}`);
    e.wrap.classList.add('lunge');
    await this._sleep(320);
    e.wrap.classList.remove('lunge');

    if (mv.pow > 0 && Math.random() > (h.napping ? 1 : 0.9)) {
      this._float(this.heroWrap, 'Schivato!', 'miss');
      this._heroPose('jump');
      await this._sleep(700);
      this._heroPose('idle');
      return;
    }
    let dmg = mv.pow > 0 ? this._dmg(e.atk * (e.scared > 0 ? 0.6 : 1), mv.pow, COMBAT.heroBaseDef + s.level) : 0;
    let stress = mv.stress;
    if (h.defending) { dmg = Math.ceil(dmg / 2); stress = Math.ceil(stress / 2); }
    if (h.napping) dmg = Math.round(dmg * 1.5);
    s.health -= dmg; s.stress += stress;
    if (dmg) { this._float(this.heroWrap, `-${dmg}`, 'dmg'); this._flash(this.heroCv); this.game.audio.sfx('dig'); }
    if (stress) setTimeout(() => this._float(this.heroWrap, `Stress +${stress}`, 'stress'), dmg ? 250 : 0);
    if (!dmg) this.game.audio.sfx('bad');
    if (mv.steal && s.inv[mv.steal] > 0) { s.inv[mv.steal]--; this._float(e.wrap, '+1 uovo', 'miss'); }
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
    this.msgBox.addEventListener('click', () => this.input && this.input('ok'));
    const btn = document.getElementById('btn-a');
    if (btn) btn.addEventListener('pointerdown', () => this.active && this.input && this.input('ok'));
  }

  _refresh() {
    const s = this.s;
    for (const k of ['health', 'stress', 'tired']) {
      const v = clamp(s[k], 0, 100);
      const b = this.partyBox.querySelector('.bar.' + k);
      b.querySelector('.fill').style.width = v + '%';
      b.querySelector('span').textContent = Math.round(v);
      b.classList.toggle('danger', k === 'health' ? v < 25 : v > 80);
    }
    this.partyBox.querySelector('.b-lv').textContent = `Lv ${s.level}`;
    for (const e of this.enemies || []) e.fill.style.width = (e.hp / e.max * 100) + '%';
  }

  _clampStats() {
    const s = this.s;
    s.health = clamp(s.health, 0, 100); s.stress = clamp(s.stress, 0, 100); s.tired = clamp(s.tired, 0, 100);
  }

  _msg(text) { this.msgBox.textContent = text; }

  // Mostra un messaggio e aspetta (Invio o click lo accorciano). wait=true aspetta proprio la conferma.
  _say(text, ms = 1000, wait = false) {
    this._msg(text);
    this.cmdBox.innerHTML = '';
    return new Promise(res => {
      let done = false;
      const finish = () => { if (done) return; done = true; clearTimeout(t); this.input = null; this.msgBox.classList.remove('more'); res(); };
      const t = wait ? null : setTimeout(finish, ms);
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
      const mark = () => { alive.forEach((e, j) => e.wrap.classList.toggle('target', j === i)); this._msg(`Bersaglio: ${alive[i].name}  (◀ ▶ per cambiare)`); };
      const done = v => { alive.forEach(e => e.wrap.classList.remove('target')); this.input = null; this._msg(base); res(v); };
      this.cmdBox.innerHTML = '';
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
