// Musica ed effetti sonori.
// Le colonne sonore stanno in assets/music/ e sono collegate ai momenti del gioco
// tramite assets/music/playlist.json. Se manca una traccia, suona una musichetta 8-bit di riserva.

const MUSIC_DIR = 'assets/music/';
const FADE_MS = 900;

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.musicVolume = 0.55;
    this.playlist = {};
    this.scene = null;
    this.el = null;           // <audio> in riproduzione
    this.chipTimer = null;
  }

  async init() {
    try {
      const r = await fetch(MUSIC_DIR + 'playlist.json', { cache: 'no-cache' });
      if (r.ok) this.playlist = await r.json();
    } catch { /* nessuna playlist: va bene lo stesso */ }
  }

  // Va chiamato dopo un click/tasto (i browser bloccano l'audio prima).
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) { this._stopAll(); }
    else { const s = this.scene; this.scene = null; this.setScene(s || 'base'); }
    return this.enabled;
  }

  // Cambia la musica in base alla scena: base, notte, bar, nutrie, mister_mountain
  setScene(scene) {
    if (scene === this.scene) return;
    this.scene = scene;
    if (!this.enabled) return;
    const list = (this.playlist[scene] || []).filter(Boolean);
    const file = list.length ? list[Math.floor(Math.random() * list.length)] : null;
    if (file && this.el && this.el.dataset.file === file) return; // stessa traccia: continua
    this._fadeOut();
    if (file) this._playFile(file);
    else this._startChiptune(scene);
  }

  _playFile(file) {
    this._stopChiptune();
    const el = new window.Audio(MUSIC_DIR + file);
    el.dataset.file = file;
    el.loop = true;
    el.volume = 0;
    el.play().catch(() => {});
    this.el = el;
    this._ramp(el, this.musicVolume);
    el.addEventListener('error', () => { if (this.el === el) { this.el = null; this._startChiptune(this.scene); } });
  }

  _ramp(el, to, done) {
    const from = el.volume, t0 = performance.now();
    const step = () => {
      const k = Math.min(1, (performance.now() - t0) / FADE_MS);
      el.volume = Math.max(0, Math.min(1, from + (to - from) * k));
      if (k < 1) requestAnimationFrame(step); else if (done) done();
    };
    step();
  }

  _fadeOut() {
    if (this.el) { const old = this.el; this.el = null; this._ramp(old, 0, () => old.pause()); }
    this._stopChiptune();
  }

  _stopAll() { this._fadeOut(); }

  // ---- Musichetta 8-bit di riserva ----
  _startChiptune(scene) {
    this._stopChiptune();
    if (!this.ctx) return;
    const songs = {
      base: { bpm: 110, mel: [64, 67, 69, 67, 64, 62, 60, 62, 64, 64, 67, 72, 71, 69, 67, 0], bass: [48, 48, 43, 43, 45, 45, 41, 43] },
      notte: { bpm: 70, mel: [69, 0, 72, 0, 71, 69, 67, 0, 64, 0, 67, 0, 65, 64, 62, 0], bass: [45, 45, 41, 41, 43, 43, 40, 40] },
      bar: { bpm: 140, mel: [60, 63, 65, 66, 67, 0, 70, 67, 60, 63, 65, 66, 65, 63, 60, 0], bass: [36, 36, 39, 41, 36, 36, 34, 35] },
      mister_mountain: { bpm: 150, mel: [52, 52, 0, 51, 52, 0, 55, 54, 52, 52, 0, 51, 48, 0, 47, 0], bass: [28, 28, 28, 27, 28, 28, 31, 30] },
    };
    const song = songs[scene] || songs.base;
    const ctx = this.ctx;
    const beat = 60 / song.bpm / 2;
    let i = 0, next = ctx.currentTime + 0.05;
    const tick = () => {
      while (next < ctx.currentTime + 0.3) {
        const m = song.mel[i % song.mel.length];
        if (m) this._note(m, next, beat * 0.9, 'square', 0.035);
        if (i % 2 === 0) this._note(song.bass[(i / 2 | 0) % song.bass.length], next, beat * 1.8, 'triangle', 0.06);
        next += beat; i++;
      }
    };
    tick();
    this.chipTimer = setInterval(tick, 100);
  }

  _stopChiptune() { if (this.chipTimer) { clearInterval(this.chipTimer); this.chipTimer = null; } }

  _note(midi, t, dur, type, vol) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  // ---- Effetti sonori ----
  sfx(name) {
    if (!this.enabled || !this.ctx) return;
    const t = this.ctx.currentTime;
    const n = (m, dt, d, type = 'square', v = 0.06) => this._note(m, t + dt, d, type, v);
    switch (name) {
      case 'blip': n(84, 0, 0.05); break;
      case 'dig': n(40, 0, 0.08, 'sawtooth', 0.08); n(36, 0.06, 0.08, 'sawtooth', 0.06); break;
      case 'water': n(76, 0, 0.05, 'sine', 0.08); n(79, 0.05, 0.05, 'sine', 0.08); n(83, 0.1, 0.06, 'sine', 0.06); break;
      case 'pick': n(79, 0, 0.06); n(86, 0.06, 0.08); break;
      case 'coin': n(88, 0, 0.06); n(93, 0.07, 0.14); break;
      case 'shoo': n(60, 0, 0.06, 'sawtooth', 0.08); n(67, 0.05, 0.06, 'sawtooth', 0.08); n(72, 0.1, 0.1, 'sawtooth', 0.06); break;
      case 'bad': n(45, 0, 0.18, 'sawtooth', 0.09); n(40, 0.18, 0.3, 'sawtooth', 0.09); break;
      case 'level': [72, 76, 79, 84].forEach((m, i) => n(m, i * 0.09, 0.12)); break;
      case 'eat': n(60, 0, 0.05, 'square', 0.05); n(62, 0.08, 0.05, 'square', 0.05); break;
      // mezzi
      case 'horn_vespa': n(81, 0, 0.12, 'square', 0.05); n(81, 0.16, 0.2, 'square', 0.05); break;
      case 'horn_punto': n(64, 0, 0.35, 'square', 0.05); n(68, 0, 0.35, 'square', 0.04); break;
      case 'horn_trattore': n(52, 0, 0.5, 'sawtooth', 0.06); n(55, 0, 0.5, 'square', 0.03); break;
      case 'engine': [30, 32, 30, 34, 36].forEach((m, i) => n(m, i * 0.07, 0.09, 'sawtooth', 0.07)); break;
      case 'stall': [36, 33, 30, 26].forEach((m, i) => n(m, i * 0.11, 0.12, 'sawtooth', 0.07)); break;
      case 'crash': n(30, 0, 0.25, 'sawtooth', 0.1); n(45, 0, 0.08, 'square', 0.07); n(38, 0.08, 0.2, 'square', 0.06); break;
    }
  }
}
