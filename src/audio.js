// Musica ed effetti sonori.
// Le colonne sonore stanno in assets/music/ e sono collegate ai momenti del gioco
// tramite assets/music/playlist.json. Se manca una traccia, suona una musichetta 8-bit di riserva.
// Gli effetti sonori sono sintetizzati in src/sfx.js e passano da un bus col loro volume.
// Volumi (0..1) ricordati nel browser: setMusicVolume(v), setSfxVolume(v). Tasto M / ♪: tutto l'audio on/off.
import { Sfx } from './sfx.js';
const VOL_KEY = 'garonio-volumi';

const MUSIC_DIR = 'assets/music/';

// Scene musicali del gioco. La traccia di ogni scena si sceglie in assets/music/playlist.json.
//   intro          schermata del titolo e prologo
//   base / notte   giornata in azienda / dopo le 20
//   bar            dentro e vicino al bar
//   rabbia         Garonio si arrabbia (stress alto, litigi al bar)
//   guida          alla guida di Vespa, Punto o trattore: la RADIO, l'unico posto dove suonano le canzoni (in ordine sparso)
//   palestra       palestra «Bicipite d'Oro»: Dr. Pippetta e Kpop Pip a turno
//   disco:<file>   una canzone precisa scelta a un juke-box (bar, Night Welcome, casa)
// Di giorno a piedi (scena base), ogni 2-3 minuti di sottofondo parte una canzone a caso della lista 'canzoni'.
//   nemico         appare un nemico (Mister Mountain, nutrie che attaccano)
//   combattimento  scontro a turni
export const MUSIC_SCENES = ['intro', 'base', 'notte', 'bar', 'palestra', 'rabbia', 'guida', 'nemico', 'combattimento'];
// Nomi vecchi o alternativi che finiscono sulla stessa scena
const ALIASES = { mister_mountain: 'nemico', nutrie: 'nemico', battaglia: 'combattimento', combat: 'combattimento', fight: 'combattimento', driving: 'guida', titolo: 'intro' };
const FADE_MS = 900;
const CANZONE_OGNI = [120, 180];   // secondi di sottofondo (di giorno) prima che parta una canzone a caso

export class Audio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    let vol = {};
    try { vol = JSON.parse(localStorage.getItem(VOL_KEY)) || {}; } catch { }
    this.musicVolume = vol.musica ?? 0.55;
    this.sfxVolume = vol.effetti ?? 0.8;
    this.fx = new Sfx(this);
    this.musicBus = null; this.sfxBus = null;
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
    // la radio parte ogni volta da un punto diverso della scaletta
    const radio = this._list('guida');
    for (let i = radio.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [radio[i], radio[j]] = [radio[j], radio[i]]; }
    this.radio = radio;
    this._prossimaCanzone();
    setInterval(() => this._canzoneACaso(), 1000);
  }

  // ---- Canzone a caso durante la giornata ----
  _prossimaCanzone() { this.canzoneTra = CANZONE_OGNI[0] + Math.random() * (CANZONE_OGNI[1] - CANZONE_OGNI[0]); }
  _canzoneACaso() {
    if (!this.enabled || document.hidden) return;
    // conta solo il tempo passato col sottofondo di giorno (non in auto, al bar, di notte o negli scontri)
    if (this.scene !== 'base' || !this.el || this.el.dataset.canzone || this.el.paused) return;
    if ((this.canzoneTra -= 1) > 0) return;
    const tutte = this.canzoni().filter(f => f !== this._ultimaCanzone);
    if (!tutte.length) return;
    const f = tutte[Math.random() * tutte.length | 0];
    this._ultimaCanzone = f;
    this._fadeOut();
    this._playFile(f, { canzone: true });
    this.game?.ui?.toast(`🎵 Parte «${this.titolo(f)}»`, 'small');
  }

  // Va chiamato dopo un click/tasto (i browser bloccano l'audio prima).
  unlock() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) { this.ctx = new AC(); this._buses(); }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  _buses() {
    const ctx = this.ctx;
    this.musicBus = ctx.createGain(); this.musicBus.gain.value = this.musicVolume;
    this.musicBus.connect(ctx.destination);
    // gli effetti passano da un compressore leggero, così botte e incidenti non saturano
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.15;
    this.sfxBus = ctx.createGain(); this.sfxBus.gain.value = this._curve(this.sfxVolume);
    this.sfxBus.connect(comp).connect(ctx.destination);
    this.fx.init(ctx, this.sfxBus);
    // telefono in tasca o scheda nascosta: si ferma tutto il sintetizzato
    document.addEventListener('visibilitychange', () => { if (document.hidden) ctx.suspend?.(); else if (this.enabled) ctx.resume?.(); });
  }

  _curve(v) { return v * v * 1.6; }   // il volume "a orecchio" non è lineare

  attach(game) { this.game = game; this.fx.attach(game); }

  // Titolo leggibile di una canzone (assets/music/playlist.json, voce "titoli")
  titolo(file) { return this.playlist.titoli?.[file] || file.replace(/\.mp3$/, '').replace(/_/g, ' '); }
  // Tutte le canzoni del gioco (juke-box, radio, canzone a caso di giorno), nell'ordine di playlist.json
  canzoni() { const l = this.playlist.canzoni || this.playlist.guida; return Array.isArray(l) ? l.filter(Boolean) : []; }
  // I dischi dei juke-box: le canzoni più il tema del titolo e il sottofondo (lista "jukebox")
  dischi() { const l = this.playlist.jukebox; return Array.isArray(l) ? l.filter(Boolean) : this.canzoni(); }

  setMusicVolume(v) {
    this.musicVolume = Math.max(0, Math.min(1, v));
    if (this.el) this.el.volume = this.musicVolume;
    if (this.musicBus) this.musicBus.gain.setTargetAtTime(this.musicVolume, this.ctx.currentTime, 0.05);
    this._saveVol();
  }

  setSfxVolume(v) {
    this.sfxVolume = Math.max(0, Math.min(1, v));
    if (this.sfxBus) this.sfxBus.gain.setTargetAtTime(this._curve(this.sfxVolume), this.ctx.currentTime, 0.05);
    this._saveVol();
  }

  _saveVol() { try { localStorage.setItem(VOL_KEY, JSON.stringify({ musica: this.musicVolume, effetti: this.sfxVolume })); } catch { } }

  toggle() {
    this.enabled = !this.enabled;
    if (!this.enabled) { this._stopAll(); }
    else { const s = this.scene; this.scene = null; this.setScene(s || 'base'); }
    return this.enabled;
  }

  // Cambia la musica in base alla scena (vedi MUSIC_SCENES)
  setScene(scene) {
    scene = ALIASES[scene] || scene;
    if (scene === this.scene) return;
    this.scene = scene;
    if (!this.enabled) return;
    const list = this._list(scene);
    // se la traccia che sta suonando va bene anche per la nuova scena, continua
    if (list.length && this.el && list.includes(this.el.dataset.file)) { this.el.loop = list.length === 1; return; }
    this._fadeOut();
    if (list.length) this._playFile(this._next(scene));
    else this._startChiptune(scene);
  }

  _list(scene) {
    if (scene?.startsWith('disco:')) return [scene.slice(6)];
    if (scene === 'guida' && this.radio) return this.radio;
    const l = this.playlist[scene];
    return Array.isArray(l) ? l.filter(Boolean) : [];
  }

  // Rotazione: ogni scena ricorda a che punto della sua lista era arrivata
  _next(scene) {
    const list = this._list(scene);
    this.rot ??= {};
    const i = this.rot[scene] ?? 0;
    this.rot[scene] = (i + 1) % list.length;
    return list[i % list.length];
  }

  _playFile(file, { canzone = false } = {}) {
    this._stopChiptune();
    const el = new window.Audio(MUSIC_DIR + file);
    el.dataset.file = file;
    if (canzone) el.dataset.canzone = '1';   // la canzone a caso: a fine brano si torna al sottofondo
    el.loop = !canzone && this._list(this.scene).length <= 1;
    // a fine traccia parte la successiva della scena attuale
    el.addEventListener('ended', () => {
      if (this.el !== el || !this.enabled) return;
      this.el = null;
      if (canzone) this._prossimaCanzone();
      const list = this._list(this.scene);
      if (!list.length) return;
      let f = this._next(this.scene);
      if (f === file && list.length > 1) f = this._next(this.scene);
      this._playFile(f);
    });
    el.volume = 0;
    el.play().catch(() => {});
    if (this.scene === 'guida') this.game?.ui?.toast(`📻 Radio Bassa FM · «${this.titolo(file)}»`);
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
      intro: { bpm: 96, mel: [60, 64, 67, 72, 71, 67, 64, 62, 60, 64, 67, 69, 67, 64, 60, 0], bass: [48, 43, 45, 41, 48, 43, 41, 43] },
      rabbia: { bpm: 160, mel: [57, 60, 57, 63, 57, 60, 64, 63, 57, 60, 57, 63, 62, 60, 57, 0], bass: [33, 33, 36, 33, 33, 33, 31, 32] },
      bar: { bpm: 140, mel: [60, 63, 65, 66, 67, 0, 70, 67, 60, 63, 65, 66, 65, 63, 60, 0], bass: [36, 36, 39, 41, 36, 36, 34, 35] },
      nemico: { bpm: 150, mel: [52, 52, 0, 51, 52, 0, 55, 54, 52, 52, 0, 51, 48, 0, 47, 0], bass: [28, 28, 28, 27, 28, 28, 31, 30] },
    };
    const song = songs[scene] || (scene === 'guida' ? songs.rabbia : scene === 'combattimento' ? songs.nemico : songs.base);
    const ctx = this.ctx;
    const beat = 60 / song.bpm / 2;
    let i = 0, next = ctx.currentTime + 0.05;
    const tick = () => {
      while (next < ctx.currentTime + 0.3) {
        const m = song.mel[i % song.mel.length];
        if (m) this._note(m, next, beat * 0.9, 'square', 0.06, this.musicBus);
        if (i % 2 === 0) this._note(song.bass[(i / 2 | 0) % song.bass.length], next, beat * 1.8, 'triangle', 0.1, this.musicBus);
        next += beat; i++;
      }
    };
    tick();
    this.chipTimer = setInterval(tick, 100);
  }

  _stopChiptune() { if (this.chipTimer) { clearInterval(this.chipTimer); this.chipTimer = null; } }

  // nota semplice; senza "dest" va nel bus degli effetti (la usano anche altri moduli, es. src/cascine.js)
  _note(midi, t, dur, type, vol, dest) {
    const ctx = this.ctx;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type;
    o.frequency.value = 440 * Math.pow(2, (midi - 69) / 12);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(dest || this.sfxBus || ctx.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }

  // ---- Effetti sonori ----
  // nome: vedi l'elenco in src/sfx.js. opt: { x, z } per i suoni nel mondo (volume e lato secondo la distanza), { vol }
  sfx(name, opt) {
    if (!this.enabled || !this.ctx) return;
    this.fx.play(name, opt);
  }
}
