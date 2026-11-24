// Effetti sonori del gioco, tutti sintetizzati al volo con la Web Audio API.
// Nessun file audio esterno: niente licenze da rispettare, niente download, pochi KB di codice.
//
// Collegamenti:
//   src/audio.js   crea Sfx, gli passa l'AudioContext e il bus degli effetti (volume SFX separato dalla musica)
//   audio.sfx(nome, { x, z, vol })   suono singolo; con x/z il volume cala con la distanza da Garonio e il suono va a destra/sinistra
//   audio.attach(game)               aggancia i suoni continui al gioco (motori, passi, animali, traffico, pioggia, grilli, bar)
//
// Suoni singoli disponibili (SUONI qui sotto):
//   interfaccia  blip, bad, coin, level, pick, eat
//   lavoro       dig, water, shoo
//   mezzi        engine (avviamento), stall, crash, horn_vespa, horn_punto, horn_trattore
//   botte        whoosh, punch, crit, hurt, dodge, splat, ko
//   porte        door_open, door_close
//   passi        step_erba, step_sterrato, step_asfalto, step_legno, step_fango, step_acqua, step_campo, step_pavimento
//   animali      cluck, oink, quack, squeak, meow, bark
//   paese        whistle (vigilessa), bird, cricket, clink

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Sfx {
  constructor(audio) {
    this.audio = audio;
    this.ctx = null; this.bus = null;
    this.noise = null;
    this.last = {};          // anti-raffica: stesso suono al massimo ogni 35 ms
    this.game = null;
    this.loops = {};         // suoni continui attivi
    this.timers = { bird: 2, cricket: 1, animali: 0.5, clink: 3 };
    this.stepAcc = 0; this.stepSide = 0; this.lastPos = null;
  }

  init(ctx, bus) {
    this.ctx = ctx; this.bus = bus;
    const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.noise = buf;
  }

  // ---------- Suono singolo ----------
  play(name, opt = {}) {
    const ctx = this.ctx, fn = SUONI[name];
    if (!ctx || !fn || ctx.state !== 'running') return;
    const now = performance.now();
    if (now - (this.last[name] || 0) < 35) return;
    this.last[name] = now;
    let vol = opt.vol ?? 1, pan = opt.pan || 0;
    if (opt.x != null && opt.z != null) {
      const L = this._listener(); if (!L) return;
      const dx = opt.x - L.x, dz = opt.z - L.z, d = Math.hypot(dx, dz), max = opt.max ?? 14;
      if (d > max) return;
      vol *= (1 - d / max) ** 2;
      pan = clamp(dx / 7, -0.85, 0.85);
    }
    if (vol < 0.01) return;
    const out = ctx.createGain(); out.gain.value = vol * (GUADAGNO[name] ?? 1);
    let tail = out;
    if (pan && ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = pan; out.connect(p); tail = p; }
    tail.connect(this.bus);
    const o = { ctx, t: ctx.currentTime + 0.005, out, noise: this.noise };
    const dur = fn(o, opt) || 1;
    setTimeout(() => { try { tail.disconnect(); } catch {} }, (dur + 0.5) * 1000);
  }

  // dove "ascolta" il gioco: Garonio, oppure il mezzo che guida
  _listener() {
    const g = this.game; if (!g?.player) return null;
    const v = g.vehicles?.driving;
    if (v) return { x: v.st.x, z: v.st.z };
    const p = g.player.group.position; return { x: p.x, z: p.z };
  }

  // ---------- Suoni continui ----------
  attach(game) {
    this.game = game;
    game.moduli.push({ animate: dt => this.update(dt) });
    game.on('entrato', () => this.play('door_open'));
    game.on('uscito', () => this.play('door_close'));
    game.on('multa', e => { if (!e?.pagata) this.play('whistle'); });
  }

  update(dt) {
    const g = this.game, ctx = this.ctx;
    if (!ctx || !g?.s || !g.player) return;
    const on = this.audio.enabled && ctx.state === 'running';
    const combat = !!g.combat?.active;
    const dentro = !!g.interni?.attivo;
    const L = this._listener();
    const ora = (g.s.minutes / 60) % 24, giorno = ora >= 6 && ora < 20;
    const meteo = g.stagioni?.st?.meteo || 'sereno';
    const stagione = g.stagioni?.info?.()?.chiave || '';

    // motore del mezzo che si sta guidando
    const v = on && !combat ? g.vehicles?.driving : null;
    this._engine(v);

    // traffico sulla provinciale
    let tv = 0, tpan = 0, tf = 0;
    if (on && !combat && !dentro && g.vita?.auto) for (const a of g.vita.auto) {
      const dx = a.x - L.x, dz = a.z - L.z, d = Math.hypot(dx, dz);
      if (d > 16) continue;
      const k = (1 - d / 16) ** 2 * clamp(0.35 + Math.abs(a.v || 0) / 6, 0.35, 1) * (a.tipo === 'camion' ? 1.4 : 1);
      if (k > tv) { tv = k; tpan = clamp(dx / 7, -0.85, 0.85); tf = a.tipo === 'camion' ? 0.6 : a.tipo === 'ape' ? 1.6 : 1; tf *= 0.8 + Math.abs(a.v || 0) / 8; }
    }
    this._loop('traffico', tv * 0.14, () => makeEngine(ctx, this.noise, { base: 40, lp: 600, noiseV: 0.5, am: 0.15 }), l => {
      l.setF(38 * tf); if (l.pan) l.pan.pan.setTargetAtTime(tpan, ctx.currentTime, 0.1);
    });

    // pioggia (fuori forte, dentro ovattata) e vento con nebbia o neve
    const piove = meteo === 'pioggia' || meteo === 'grandine';
    this._loop('pioggia', on && piove && !combat ? (dentro ? 0.05 : 0.13) : 0, () => makeNoise(ctx, this.noise, 'lowpass', 5000, 0.5, 500), l => l.f.frequency.setTargetAtTime(dentro ? 900 : 5000, ctx.currentTime, 0.2));
    const vento = (meteo === 'nebbia' || meteo === 'neve') && !dentro;
    this._loop('vento', on && vento && !combat ? 0.09 * (0.7 + 0.3 * Math.sin(performance.now() / 2300)) : 0, () => makeNoise(ctx, this.noise, 'lowpass', 380, 1.2));

    // brusio del bar
    const bar = dentro && g.interni.edificio === 'bar';
    this._loop('bar', on && bar && !combat ? 0.06 : 0, () => makeNoise(ctx, this.noise, 'bandpass', 480, 0.9, 150), l => l.f.frequency.setTargetAtTime(420 + Math.sin(performance.now() / 700) * 120, ctx.currentTime, 0.1));

    if (!on || combat) { this.lastPos = null; return; }

    // ambiente: uccellini di giorno, grilli d'estate la sera, bicchieri al bar
    const T = this.timers;
    if (!dentro && giorno && !piove && meteo !== 'neve' && stagione !== 'inverno' && (T.bird -= dt) <= 0) {
      T.bird = rand(2.5, 7); this.play('bird', { vol: rand(0.4, 1), pan: rand(-0.8, 0.8) });
    }
    if (!dentro && !giorno && stagione !== 'inverno' && meteo !== 'neve' && (T.cricket -= dt) <= 0) { T.cricket = rand(0.35, 1.1); this.play('cricket', { vol: rand(0.4, 1) }); }
    if (bar && (T.clink -= dt) <= 0) { T.clink = rand(2, 6); this.play('clink', { vol: rand(0.5, 1) }); }

    // animali vicini
    if (!dentro && (T.animali -= dt) <= 0) {
      T.animali = 0.5;
      const prova = (lista, nome, p, max) => {
        for (const a of lista || []) { const x = a.x ?? a.a?.group?.position.x, z = a.z ?? a.a?.group?.position.z; if (x == null) continue;
          if (Math.hypot(x - L.x, z - L.z) < max && Math.random() < p) { this.play(nome, { x, z, max }); return; } }
      };
      if (giorno) prova(g.chickens, 'cluck', 0.05, 11);
      if (ora >= 7 && ora < 19) prova(g.maiali?.st?.lista, 'oink', 0.045, 13);
      prova(g.vita?.anatre?.map(d => d.a?.group?.position), 'quack', 0.03, 11);
      prova(g.nutrie?.filter(n => n.state !== 'gone'), 'squeak', 0.07, 10);
      prova(g.vita?.gatti, 'meow', 0.006, 9);
    }

    // passi di Garonio
    const P = g.player.group.position;
    if (g.vehicles?.driving || !g.player.group.visible) { this.lastPos = null; return; }
    if (this.lastPos) {
      const d = Math.hypot(P.x - this.lastPos.x, P.z - this.lastPos.z);
      if (d < 1) this.stepAcc += d;   // oltre 1 è un teletrasporto (porte, risveglio)
      const corre = g.input?.run;
      if (this.stepAcc > (corre ? 0.95 : 0.62)) {
        this.stepAcc = 0; this.stepSide ^= 1;
        let surf = 'pavimento';
        if (!dentro) surf = STEP_OF[g.world.tile(Math.floor(P.x), Math.floor(P.z))] || 'erba';
        if (!dentro && piove && (surf === 'sterrato' || surf === 'campo')) surf = 'fango';
        this.play('step_' + surf, { vol: (corre ? 1 : 0.75) * (this.stepSide ? 1 : 0.85) });
      }
    }
    this.lastPos = { x: P.x, z: P.z };
  }

  // suono continuo con volume che segue "target"; si crea quando serve e si spegne dopo un po' di silenzio
  _loop(id, target, make, each) {
    let l = this.loops[id];
    if (!l && target < 0.002) return;
    if (!l) { l = this.loops[id] = make(); l.out.connect(this.bus); l.quietDa = performance.now(); }
    const ctx = this.ctx;
    l.gain.gain.setTargetAtTime(target, ctx.currentTime, 0.12);
    if (each) each(l);
    const now = performance.now();
    if (target >= 0.002) l.quietDa = now;
    else if (now - (l.quietDa ?? now) > 1500) { l.stop(); delete this.loops[id]; }
  }

  _engine(v) {
    const ctx = this.ctx;
    const kind = v && !v.stalled ? v.kind : null;
    let l = this.loops.motore;
    if (l && l.kind !== kind) { const old = l; old.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.08); setTimeout(() => old.stop(), 400); delete this.loops.motore; l = null; }
    if (!kind) return;
    const P = MOTORI[kind] || MOTORI.punto;
    if (!l) { l = this.loops.motore = makeEngine(ctx, this.noise, P); l.kind = kind; l.out.connect(this.bus); l.r = 0; }
    const r = clamp(Math.abs(v.speed) / (v.T.maxSpeed || 6), 0, 1.2);
    l.r += (r - l.r) * 0.15;
    // la Vespa "tira" le marce: il tono sale, cala un po' e risale
    const giri = kind === 'vespa' ? l.r * 0.7 + ((l.r * 3) % 1) * 0.3 : l.r;
    l.setF(P.base + (P.top - P.base) * giri);
    l.f.frequency.setTargetAtTime(P.lp * (1 + giri * 1.2), ctx.currentTime, 0.08);
    l.gain.gain.setTargetAtTime(P.vol * (0.7 + 0.45 * l.r), ctx.currentTime, 0.08);
  }
}

// ---------- Motori ----------
const MOTORI = {
  vespa: { base: 52, top: 165, lp: 1600, noiseV: 0.35, am: 0.35, vol: 0.09, saw: 1 },
  punto: { base: 34, top: 100, lp: 650, noiseV: 0.25, am: 0.18, vol: 0.12 },
  trattore: { base: 17, top: 36, lp: 320, noiseV: 0.6, am: 0.7, vol: 0.18 },
};

function makeEngine(ctx, noise, P) {
  const out = ctx.createGain(), gain = ctx.createGain(); gain.gain.value = 0;
  const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = P.lp; f.Q.value = 2;
  const o1 = ctx.createOscillator(); o1.type = 'sawtooth';
  const o2 = ctx.createOscillator(); o2.type = 'square';
  const g2 = ctx.createGain(); g2.gain.value = 0.5;
  const n = ctx.createBufferSource(); n.buffer = noise; n.loop = true;
  const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 900; nf.Q.value = 0.8;
  const ng = ctx.createGain(); ng.gain.value = P.noiseV;
  // scoppi del motore: modulazione d'ampiezza alla frequenza dei cilindri
  const am = ctx.createGain(); am.gain.value = 1 - P.am;
  const lfo = ctx.createOscillator(); lfo.type = 'square';
  const lg = ctx.createGain(); lg.gain.value = P.am;
  lfo.connect(lg).connect(am.gain);
  o1.connect(f); o2.connect(g2).connect(f); n.connect(nf).connect(ng).connect(f);
  f.connect(am).connect(gain);
  let tail = gain;
  const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if (pan) { gain.connect(pan); tail = pan; }
  tail.connect(out);
  const t = ctx.currentTime;
  [o1, o2, n, lfo].forEach(s => s.start(t));
  const l = {
    out, gain, f, pan,
    setF(fr) { const now = ctx.currentTime; o1.frequency.setTargetAtTime(fr, now, 0.06); o2.frequency.setTargetAtTime(fr * 0.5, now, 0.06); lfo.frequency.setTargetAtTime(fr * 0.5, now, 0.06); },
    stop() { try { [o1, o2, n, lfo].forEach(s => s.stop()); out.disconnect(); } catch {} },
  };
  l.setF(P.base);
  return l;
}

function makeNoise(ctx, noise, type, freq, q, hp) {
  const out = ctx.createGain(), gain = ctx.createGain(); gain.gain.value = 0;
  const n = ctx.createBufferSource(); n.buffer = noise; n.loop = true;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  let x = n.connect(f);
  if (hp) { const h = ctx.createBiquadFilter(); h.type = 'highpass'; h.frequency.value = hp; x = x.connect(h); }
  x.connect(gain).connect(out);
  n.start(ctx.currentTime, Math.random() * 1.5);
  return { out, gain, f, stop() { try { n.stop(); out.disconnect(); } catch {} } };
}

// ---------- Mattoncini ----------
// Busta: sale in "a" secondi a v e poi si spegne in d secondi
function env(o, t0, d, v, a = 0.004) {
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(v, t0 + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + Math.max(d, a + 0.01));
  return g;
}

function filt(o, type, f, q = 1, f2, t0, d) {
  const x = o.ctx.createBiquadFilter(); x.type = type; x.frequency.value = f; x.Q.value = q;
  if (f2) { x.frequency.setValueAtTime(f, t0); x.frequency.exponentialRampToValueAtTime(f2, t0 + d); }
  return x;
}

// Oscillatore: f → f2 (o una lista fs di [tempo, freq]); filtro opzionale; tremolo opzionale (am Hz, depth)
function tone(o, { type = 'sine', f = 440, f2, fs, t = 0, d = 0.1, v = 0.2, a, ft, ff, q, ff2, am, depth = 0.5, detune = 0 }) {
  const ctx = o.ctx, t0 = o.t + t;
  const s = ctx.createOscillator(); s.type = type; s.detune.value = detune;
  if (fs) { s.frequency.setValueAtTime(fs[0][1], t0); for (const [tt, fr] of fs.slice(1)) s.frequency.exponentialRampToValueAtTime(fr, t0 + tt); }
  else { s.frequency.setValueAtTime(f, t0); if (f2) s.frequency.exponentialRampToValueAtTime(f2, t0 + d); }
  const g = env(o, t0, d, v, a);
  let x = s;
  if (ft) x = x.connect(filt(o, ft, ff, q, ff2, t0, d));
  if (am) {
    const m = ctx.createGain(); m.gain.value = 1 - depth;
    const l = ctx.createOscillator(); l.type = 'sine'; l.frequency.value = am;
    const lg = ctx.createGain(); lg.gain.value = depth; l.connect(lg).connect(m.gain);
    l.start(t0); l.stop(t0 + d + 0.05);
    x = x.connect(m);
  }
  x.connect(g).connect(o.out);
  s.start(t0); s.stop(t0 + d + 0.05);
}

// Rumore filtrato (soffi, botte, schizzi, sassolini)
function hiss(o, { t = 0, d = 0.1, v = 0.2, ft = 'bandpass', f = 1000, f2, q = 1, a }) {
  const ctx = o.ctx, t0 = o.t + t;
  const n = ctx.createBufferSource(); n.buffer = o.noise;
  n.connect(filt(o, ft, f, q, f2, t0, d)).connect(env(o, t0, d, v, a)).connect(o.out);
  n.start(t0, Math.random() * 1.5); n.stop(t0 + d + 0.05);
}

// carattere della casella (src/map.js) → tipo di passo
const STEP_OF = { a: 'asfalto', q: 'asfalto', b: 'legno', p: 'sterrato', g: 'erba', c: 'erba', f: 'campo', o: 'campo', y: 'campo', r: 'campo', s: 'fango', w: 'acqua' };

// Bilanciamento: alcuni suoni (filtri stretti) escono piano, altri forti. Misurati col rendering offline.
const GUADAGNO = {
  cluck: 3.5, quack: 4, meow: 3.5, oink: 2.2, squeak: 1.6, bird: 1.6, cricket: 2, clink: 1.5, bark: 1.6,
  step_erba: 2, step_sterrato: 2.2, step_acqua: 2, step_campo: 1.3, ko: 2, whoosh: 1.6, dodge: 1.6, shoo: 1.5, water: 1.4,
  crash: 0.8, crit: 0.8,
};

// ---------- Ricette ----------
const SUONI = {
  // interfaccia
  blip: o => { tone(o, { type: 'triangle', f: 1050, f2: 1500, d: 0.05, v: 0.12 }); tone(o, { f: 2400, d: 0.03, v: 0.03 }); return 0.1; },
  bad: o => { tone(o, { type: 'square', f: 233, f2: 160, d: 0.17, v: 0.09, ft: 'lowpass', ff: 1300 }); tone(o, { type: 'square', f: 165, f2: 98, t: 0.15, d: 0.3, v: 0.09, ft: 'lowpass', ff: 900 }); return 0.5; },
  coin: o => {
    hiss(o, { ft: 'highpass', f: 5000, d: 0.05, v: 0.12 });
    tone(o, { type: 'square', f: 1976, d: 0.08, v: 0.05, ft: 'lowpass', ff: 5000 });
    tone(o, { type: 'square', f: 2637, t: 0.07, d: 0.4, v: 0.05, ft: 'lowpass', ff: 6000 });
    tone(o, { f: 5274, t: 0.07, d: 0.3, v: 0.025 });
    return 0.5;
  },
  level: o => { [523, 659, 784, 1047, 1319].forEach((f, i) => { tone(o, { type: 'triangle', f, t: i * 0.08, d: 0.25, v: 0.12 }); tone(o, { type: 'square', f: f * 2, t: i * 0.08, d: 0.12, v: 0.02 }); }); hiss(o, { ft: 'highpass', f: 7000, t: 0.3, d: 0.5, v: 0.04, a: 0.1 }); return 0.9; },
  pick: o => { tone(o, { f: 620, f2: 1250, d: 0.08, v: 0.16 }); tone(o, { type: 'triangle', f: 1250, f2: 1850, t: 0.05, d: 0.09, v: 0.08 }); return 0.2; },
  eat: o => { for (let i = 0; i < 3; i++) { hiss(o, { f: rand(1500, 2400), t: i * 0.12, d: 0.06, v: 0.22 }); tone(o, { f: 190, f2: 90, t: i * 0.12, d: 0.05, v: 0.14 }); } return 0.45; },

  // lavoro nei campi
  dig: o => { tone(o, { f: 130, f2: 45, d: 0.15, v: 0.35 }); hiss(o, { ft: 'lowpass', f: 900, f2: 280, d: 0.22, v: 0.3 }); hiss(o, { f: 2600, q: 2, t: 0.02, d: 0.08, v: 0.1 }); return 0.3; },
  water: o => {
    hiss(o, { f: 600, f2: 2400, q: 2, d: 0.35, v: 0.22, a: 0.03 });
    tone(o, { f: 500, f2: 1100, t: 0.05, d: 0.07, v: 0.1 }); tone(o, { f: 700, f2: 1500, t: 0.14, d: 0.06, v: 0.08 }); tone(o, { f: 420, f2: 900, t: 0.22, d: 0.08, v: 0.07 });
    return 0.4;
  },
  shoo: o => { hiss(o, { f: 300, f2: 2200, q: 1.5, d: 0.25, v: 0.3, a: 0.08 }); return 0.3; },

  // mezzi
  engine: o => {   // motorino d'avviamento che gira e il motore che prende
    for (let i = 0; i < 5; i++) { tone(o, { type: 'sawtooth', f: 62, f2: 42, t: i * 0.085, d: 0.07, v: 0.12, ft: 'lowpass', ff: 700 }); hiss(o, { ft: 'lowpass', f: 900, t: i * 0.085, d: 0.05, v: 0.1 }); }
    tone(o, { type: 'sawtooth', fs: [[0, 45], [0.22, 140], [0.6, 80]], t: 0.45, d: 0.65, v: 0.16, ft: 'lowpass', ff: 1100, am: 30, depth: 0.4, a: 0.03 });
    hiss(o, { ft: 'lowpass', f: 1400, t: 0.45, d: 0.4, v: 0.08 });
    return 1.2;
  },
  stall: o => {
    for (let i = 0; i < 5; i++) tone(o, { type: 'sawtooth', f: 75 - i * 9, f2: 45 - i * 5, t: i * 0.12 + rand(0, 0.03), d: 0.08, v: 0.15 - i * 0.022, ft: 'lowpass', ff: 800 });
    hiss(o, { ft: 'lowpass', f: 1300, f2: 400, t: 0.62, d: 0.35, v: 0.1, a: 0.04 });
    return 1;
  },
  crash: o => {
    hiss(o, { ft: 'lowpass', f: 3500, f2: 180, d: 0.65, v: 0.7 });
    tone(o, { f: 95, f2: 32, d: 0.45, v: 0.55 });
    [523, 741, 1109, 1567].forEach(f => tone(o, { type: 'triangle', f: f * rand(0.95, 1.05), f2: f * 0.97, t: 0.01, d: rand(0.3, 0.6), v: 0.05 }));
    for (let i = 0; i < 6; i++) hiss(o, { f: rand(4000, 7000), q: 6, t: 0.06 + i * 0.05 + rand(0, 0.03), d: 0.05, v: 0.09 });
    return 0.8;
  },
  horn_vespa: o => { for (const [t, d] of [[0, 0.13], [0.18, 0.22]]) { tone(o, { type: 'square', f: 415, t, d, v: 0.09, ft: 'lowpass', ff: 2600, a: 0.01 }); tone(o, { type: 'square', f: 440, t, d, v: 0.07, ft: 'lowpass', ff: 2600, a: 0.01 }); } return 0.5; },
  horn_punto: o => { tone(o, { type: 'square', f: 370, d: 0.45, v: 0.08, ft: 'lowpass', ff: 2000, a: 0.015 }); tone(o, { type: 'square', f: 466, d: 0.45, v: 0.07, ft: 'lowpass', ff: 2000, a: 0.015 }); return 0.5; },
  horn_trattore: o => { tone(o, { type: 'sawtooth', f: 196, d: 0.75, v: 0.1, ft: 'lowpass', ff: 1100, a: 0.04 }); tone(o, { type: 'sawtooth', f: 247, d: 0.75, v: 0.08, ft: 'lowpass', ff: 1100, a: 0.04 }); tone(o, { type: 'square', f: 98, d: 0.75, v: 0.05, ft: 'lowpass', ff: 500, a: 0.04 }); return 0.8; },

  // botte
  whoosh: o => { hiss(o, { f: 500, f2: 3000, q: 1.8, d: 0.2, v: 0.3, a: 0.06 }); return 0.25; },
  punch: o => { tone(o, { f: rand(150, 175), f2: 45, d: 0.14, v: 0.6 }); hiss(o, { ft: 'lowpass', f: 2400, f2: 400, d: 0.09, v: 0.45 }); hiss(o, { ft: 'highpass', f: 3000, d: 0.025, v: 0.18 }); return 0.2; },
  crit: o => { SUONI.punch(o); tone(o, { f: 80, f2: 28, d: 0.4, v: 0.5 }); hiss(o, { f: 1300, q: 0.7, d: 0.28, v: 0.25 }); hiss(o, { ft: 'highpass', f: 4000, t: 0.01, d: 0.06, v: 0.2 }); return 0.45; },
  hurt: o => { tone(o, { f: 130, f2: 40, d: 0.16, v: 0.55 }); hiss(o, { ft: 'lowpass', f: 1800, f2: 300, d: 0.1, v: 0.4 }); tone(o, { type: 'sawtooth', f: 195, f2: 120, t: 0.03, d: 0.22, v: 0.12, ft: 'bandpass', ff: 800, q: 3 }); return 0.3; },
  dodge: o => { hiss(o, { f: 1500, f2: 4200, q: 2, d: 0.16, v: 0.22, a: 0.03 }); return 0.2; },
  splat: o => { hiss(o, { f: 900, f2: 300, d: 0.18, v: 0.45 }); tone(o, { f: 320, f2: 80, d: 0.1, v: 0.25 }); return 0.25; },
  ko: o => { tone(o, { type: 'square', fs: [[0, 440], [0.3, 330], [0.9, 110]], d: 0.95, v: 0.07, ft: 'lowpass', ff: 1400, am: 7, depth: 0.5 }); return 1; },

  // porte
  door_open: o => {
    hiss(o, { ft: 'highpass', f: 2500, d: 0.03, v: 0.25 }); tone(o, { f: 1800, d: 0.02, v: 0.06 });
    tone(o, { type: 'sawtooth', fs: [[0, 70], [0.15, 115], [0.35, 85], [0.55, 125]], t: 0.05, d: 0.6, v: 0.1, ft: 'bandpass', ff: 900, q: 4, a: 0.04 });
    return 0.7;
  },
  door_close: o => {
    tone(o, { f: 115, f2: 48, d: 0.22, v: 0.5 }); hiss(o, { ft: 'lowpass', f: 800, f2: 200, d: 0.16, v: 0.35 });
    hiss(o, { ft: 'highpass', f: 3000, t: 0.05, d: 0.025, v: 0.2 }); tone(o, { f: 2000, t: 0.05, d: 0.02, v: 0.05 });
    return 0.3;
  },

  // passi
  step_erba: o => { hiss(o, { f: rand(1500, 2100), q: 0.8, d: 0.07, v: 0.09 }); hiss(o, { ft: 'highpass', f: 5000, d: 0.04, v: 0.025 }); return 0.1; },
  step_campo: o => { hiss(o, { ft: 'lowpass', f: rand(1000, 1400), d: 0.065, v: 0.13 }); tone(o, { f: 110, f2: 60, d: 0.04, v: 0.08 }); return 0.1; },
  step_sterrato: o => { for (let i = 0; i < 3; i++) hiss(o, { f: rand(2600, 3600), q: 2, t: i * 0.015, d: 0.03, v: 0.07 }); hiss(o, { ft: 'lowpass', f: 650, d: 0.05, v: 0.11 }); return 0.1; },
  step_asfalto: o => { tone(o, { f: rand(160, 185), f2: 115, d: 0.04, v: 0.15 }); hiss(o, { f: 2600, q: 3, d: 0.025, v: 0.08 }); return 0.08; },
  step_legno: o => { tone(o, { type: 'triangle', f: rand(230, 260), f2: 180, d: 0.07, v: 0.16 }); hiss(o, { f: 1200, q: 2, d: 0.04, v: 0.06 }); return 0.1; },
  step_pavimento: o => { tone(o, { f: rand(190, 215), f2: 140, d: 0.05, v: 0.13 }); hiss(o, { f: 3000, q: 2, d: 0.02, v: 0.05 }); return 0.08; },
  step_fango: o => { hiss(o, { ft: 'lowpass', f: 700, d: 0.12, v: 0.18 }); tone(o, { f: 290, f2: 120, d: 0.1, v: 0.08 }); return 0.15; },
  step_acqua: o => { hiss(o, { f: 1200, f2: 2600, q: 1.5, d: 0.12, v: 0.13 }); return 0.15; },

  // animali
  cluck: o => {
    const n = 2 + (Math.random() * 3 | 0); let t = 0;
    for (let i = 0; i < n; i++) { const f = rand(650, 900); tone(o, { type: 'sawtooth', f, f2: f * 0.7, t, d: 0.06, v: 0.07, ft: 'bandpass', ff: 1400, q: 3 }); t += rand(0.09, 0.15); }
    if (Math.random() < 0.5) tone(o, { type: 'sawtooth', fs: [[0, 900], [0.06, 1150], [0.2, 700]], t, d: 0.2, v: 0.08, ft: 'bandpass', ff: 1600, q: 2 });
    return t + 0.3;
  },
  oink: o => {
    const n = 1 + (Math.random() * 2 | 0);
    for (let i = 0; i < n; i++) {
      const t = i * 0.26, f = rand(140, 175);
      tone(o, { type: 'sawtooth', f, f2: f * 0.75, t, d: 0.22, v: 0.16, ft: 'bandpass', ff: 550, q: 4, am: 32, depth: 0.6 });
      tone(o, { type: 'sawtooth', f: f * 1.02, f2: f * 0.74, t, d: 0.22, v: 0.08, ft: 'bandpass', ff: 1100, q: 3 });
      hiss(o, { f: 420, q: 2, t, d: 0.2, v: 0.1 });
    }
    return n * 0.26 + 0.1;
  },
  quack: o => { for (let i = 0; i < 2; i++) tone(o, { type: 'sawtooth', f: 430, f2: 330, t: i * 0.17, d: 0.13, v: 0.11, ft: 'bandpass', ff: 1100, q: 6, am: 45, depth: 0.5 }); return 0.4; },
  squeak: o => { tone(o, { fs: [[0, 2100], [0.05, 2900], [0.12, 2000]], d: 0.12, v: 0.06 }); if (Math.random() < 0.5) tone(o, { fs: [[0, 2300], [0.05, 3100], [0.1, 2200]], t: 0.16, d: 0.1, v: 0.05 }); return 0.3; },
  meow: o => { tone(o, { type: 'sawtooth', fs: [[0, 450], [0.15, 780], [0.45, 480]], d: 0.5, v: 0.09, ft: 'bandpass', ff: 1200, q: 5, a: 0.04 }); return 0.55; },
  bark: o => { for (let i = 0; i < 2; i++) { tone(o, { type: 'sawtooth', f: 330, f2: 180, t: i * 0.18, d: 0.1, v: 0.16, ft: 'bandpass', ff: 900, q: 2 }); hiss(o, { f: 900, t: i * 0.18, d: 0.08, v: 0.15 }); } return 0.35; },

  // paese
  whistle: o => { tone(o, { f: 2800, d: 0.28, v: 0.1, am: 32, depth: 0.6, a: 0.01 }); tone(o, { f: 2800, t: 0.34, d: 0.5, v: 0.1, am: 32, depth: 0.6, a: 0.01 }); return 0.9; },
  bird: o => {
    const n = 2 + (Math.random() * 4 | 0), f = rand(2800, 4200);
    for (let i = 0; i < n; i++) tone(o, { f: f * rand(0.9, 1.1), f2: f * rand(1.2, 1.45), t: i * rand(0.07, 0.11), d: 0.06, v: 0.035 });
    return n * 0.11 + 0.1;
  },
  cricket: o => { const f = rand(4200, 4700); for (let i = 0; i < 2; i++) tone(o, { f, t: i * 0.14, d: 0.1, v: 0.018, am: 55, depth: 1 }); return 0.3; },
  clink: o => { const f = rand(2900, 3600); tone(o, { f, d: 0.3, v: 0.03 }); tone(o, { f: f * 1.48, d: 0.2, v: 0.02 }); tone(o, { f: f * 1.02, t: 0.07, d: 0.25, v: 0.02 }); return 0.4; },
};

export const NOMI_SUONI = Object.keys(SUONI);
export { SUONI, MOTORI, makeEngine };   // per le prove dei suoni
