// Avvio: renderer, camera che segue Garonio, input tastiera e touch.
import * as THREE from 'three';
import { World, MAP_W, MAP_H } from './world.js';
import { Game, CONFIG, hasSave } from './game.js';
import { Salvataggi } from './salvataggi.js';
import { UI } from './ui.js';
import { Audio } from './audio.js';
import { loadGaronio } from './pixel.js';
import { PLACES } from './map.js';
import { Minimap } from './minimap.js';
import { Pannelli } from './pannelli.js';

const $ = id => document.getElementById(id);
// Stile HD-2D: pixel art nitida (texture "nearest") ma resa alla risoluzione piena del telefono,
// con luce calda, ombre morbide, foschia in lontananza e bordi sfocati (vedi style.css).
const canvas = $('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
let pixelRatio = Math.min(devicePixelRatio, 2);
renderer.setPixelRatio(pixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const scene = new THREE.Scene();
scene.background = new THREE.Color('#a8d4ea');
scene.fog = new THREE.Fog('#a8d4ea', 34, 75);
const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 200);
const CAM_OFF = new THREE.Vector3(0, 15, 21);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  // in verticale (telefono) la camera si allontana un po', ma Garonio resta ben visibile
  const dist = Math.max(26, 6.5 / (Math.tan(THREE.MathUtils.degToRad(15)) * camera.aspect));
  CAM_OFF.set(0, 15, 21).setLength(dist);
  scene.fog.near = dist + 12; scene.fog.far = dist + 55;
}
window.addEventListener('resize', resize); resize();

const audio = new Audio();
const ui = new UI(audio);
await loadGaronio();
const world = new World(scene);
world.build();
const game = new Game(world, ui, audio);
audio.attach(game);   // effetti sonori continui: motori, passi, animali, traffico, pioggia (src/sfx.js)
window.garonio = game; // comodo per provare dalla console del browser

// Qualità automatica: se il telefono fatica (meno di ~30 fotogrammi al secondo), spegne ombre e sfocature.
const perf = { s: 0, n: 0, done: false };
function checkPerf() {
  if (perf.done || new URLSearchParams(location.search).get('qualita') === 'alta') return;
  const now = performance.now();
  if (!perf.s) perf.s = now;
  perf.n++;
  if (now - perf.s < 4000) return;
  perf.done = true;
  if ((now - perf.s) / perf.n > 1000 / 30) {
    renderer.shadowMap.enabled = false;
    scene.traverse(o => { if (o.material) [].concat(o.material).forEach(m => { m.needsUpdate = true; }); });
    pixelRatio = Math.min(pixelRatio, 1.25); renderer.setPixelRatio(pixelRatio); resize();
    document.body.classList.add('lowq');
  }
}
const minimap = new Minimap(world.grid);
// pannelli spostabili col dito o col mouse (posizioni ricordate, barre e missione riducibili)
const pannelli = game.pannelli = new Pannelli(ui);
pannelli.aggiungi($('stats'), 'stats', { riducibile: true });
pannelli.aggiungi($('mission'), 'mission', { riducibile: true });
pannelli.aggiungi(minimap.el, 'minimap');
pannelli.aggiungi($('quickbar'), 'quickbar');
pannelli.aggiungi($('dialog'), 'dialog');
pannelli.aggiungi($('toasts'), 'toasts');

// ---------- Input ----------
const keys = new Set();
const KEYMAP = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd' };
window.addEventListener('keydown', e => {
  if (!started) return;
  audio.unlock();
  const k = KEYMAP[e.code];
  if (ui.modal && !ui.queue) { // menu di Garonio aperto: i tasti vanno a lui
    if (!e.repeat || /Arrow|Key[WS]/.test(e.code)) ui.modal.key(e.code);
    if (e.code !== 'F5' && e.code !== 'F12') e.preventDefault();
    return;
  }
  if (e.code === 'KeyM') { toggleMusic(); return; }
  if (e.code === 'KeyN' && !game.combat?.active) { toggleMap(); return; }
  if (ui.busy()) {
    if (k === 'u') ui.key('up'); else if (k === 'd') ui.key('down');
    else if (['KeyE', 'Space', 'Enter'].includes(e.code)) ui.key('ok');
    e.preventDefault(); return;
  }
  if (k) keys.add(k);
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.add('run');
  if (['KeyE', 'Space', 'Enter'].includes(e.code) && !e.repeat) game.action();
  if (e.code === 'KeyQ' && !e.repeat) game.jump();
  if (e.code === 'KeyJ' && !e.repeat) game.menu.apri();
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
window.addEventListener('keyup', e => {
  const k = KEYMAP[e.code]; if (k) keys.delete(k);
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.delete('run');
});
window.addEventListener('blur', () => keys.clear());
$('dialog').addEventListener('click', () => ui.key('ok'));

// levetta virtuale per telefono: compare dove appoggi il pollice (metà sinistra dello schermo)
const stick = { x: 0, z: 0, id: null, ox: 0, oy: 0 };
const zone = $('stick-zone'), pad = $('pad'), knob = $('knob');
const R = 44; // raggio di corsa della manopola in px
zone.addEventListener('pointerdown', e => {
  audio.unlock();
  if (ui.busy()) { if (!$('dlg-choices').children.length) ui.key('ok'); return; }
  stick.id = e.pointerId; stick.ox = e.clientX; stick.oy = e.clientY;
  pad.style.left = e.clientX + 'px'; pad.style.top = e.clientY + 'px';
  pad.classList.add('on');
  zone.setPointerCapture(e.pointerId); moveStick(e);
});
zone.addEventListener('pointermove', e => { if (e.pointerId === stick.id) moveStick(e); });
const endStick = e => {
  if (e && e.pointerId !== stick.id) return;
  stick.id = null; stick.x = stick.z = 0; knob.style.transform = '';
  pad.classList.remove('on'); pad.style.left = pad.style.top = '';
};
zone.addEventListener('pointerup', endStick); zone.addEventListener('pointercancel', endStick);
function moveStick(e) {
  let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy;
  const m = Math.hypot(dx, dy);
  // se il dito va oltre il bordo, la levetta lo segue (niente "muro" sotto il pollice)
  if (m > R) { stick.ox += dx - dx / m * R; stick.oy += dy - dy / m * R; dx = dx / m * R; dy = dy / m * R;
    pad.style.left = stick.ox + 'px'; pad.style.top = stick.oy + 'px'; }
  const k = Math.hypot(dx, dy) / R, dead = 0.12;
  const f = k < dead ? 0 : (k - dead) / (1 - dead) / (k || 1);
  stick.x = dx / R * f; stick.z = dy / R * f;
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
}
const buzz = ms => { try { navigator.vibrate?.(ms); } catch {} };
$('btn-a').addEventListener('pointerdown', e => { e.preventDefault(); audio.unlock(); buzz(12); if (ui.busy()) ui.key('ok'); else game.action(); });
$('btn-jump').addEventListener('pointerdown', e => { e.preventDefault(); audio.unlock(); buzz(8); game.jump(); });
$('btn-music').addEventListener('click', e => { e.stopPropagation(); audio.unlock(); toggleMusic(); });
$('btn-sposta').addEventListener('click', e => { e.stopPropagation(); audio.unlock(); if (started) pannelli.sposta(); });
$('btn-map').addEventListener('click', e => { e.stopPropagation(); audio.unlock(); if (started) toggleMap(); });
function toggleMap() { minimap.toggle(); $('btn-map').classList.toggle('on', minimap.el.classList.contains('big')); }
$('btn-menu').addEventListener('click', e => { e.stopPropagation(); audio.unlock(); if (started) game.menu.apri(); });
function toggleMusic() { const on = audio.toggle(); $('btn-music').querySelector('.ic').textContent = on ? '♪' : '🔇'; }
if (matchMedia('(pointer: coarse)').matches) document.body.classList.add('touch');

// ---------- Schermata iniziale ----------
let started = false;
await audio.init();
$('btn-continue').hidden = !hasSave();
async function begin(cont) {
  if (started) return;
  started = true;
  audio.unlock();
  $('title').hidden = true;
  audio.setScene(cont ? 'base' : 'intro');
  titoloBox.querySelector('.sv-titolo')?.remove();
  await game.start(cont);
  pannelli.aggiungi($('veh'), 'veh'); // il pannello di guida nasce con la partita
  pannelli.aggiungi($('truffa'), 'truffa', { riducibile: true }); // missioni truffaldine (cascine)
}
// la musica dell'intro parte al primo tocco sulla schermata del titolo
$('title').addEventListener('pointerdown', () => { audio.unlock(); if (!started) audio.setScene('intro'); });
// salvataggi multipli (src/salvataggi.js): Continua = l'ultimo salvato, Carica = scegli lo slot
const titoloBox = $('title').querySelector('.box');
const pulsantiTitolo = () => [$('btn-new'), $('btn-continue'), $('btn-load')];
function slotTitolo(modo) {
  const nascosti = pulsantiTitolo().map(b => [b, b.hidden]);
  nascosti.forEach(([b]) => b.hidden = true);
  Salvataggi.titolo(titoloBox, modo, {
    carica: id => begin(id),
    nuova: id => { Game.reset(id); begin(false); },
    indietro: () => nascosti.forEach(([b, h]) => b.hidden = h),
  });
}
$('btn-new').addEventListener('click', () => {
  if (!Salvataggi.ce()) { Game.reset('1'); begin(false); } else slotTitolo('nuova');
});
$('btn-continue').addEventListener('click', () => begin(true));
$('btn-load').hidden = !hasSave();
$('btn-load').addEventListener('click', () => slotTitolo('carica'));
// caricamento chiesto dal menu in partita (la pagina si ricarica e riparte da quello slot)
{ const r = Salvataggi.richiesta(); if (r) begin(r); }

// ---------- Ciclo ----------
const clock = new THREE.Clock();
const camPos = new THREE.Vector3();
const smooth = { x: 0, z: 0 };            // input addolcito: Garonio accelera e frena invece di scattare
const look = new THREE.Vector2();          // la camera guarda un po' avanti nella direzione di marcia
const lastP = new THREE.Vector2();
function frame() {
  const dt = Math.min(0.05, clock.getDelta());
  if (started && game.player) {
    let x = 0, z = 0;
    if (keys.has('l')) x -= 1; if (keys.has('r')) x += 1;
    if (keys.has('u')) z -= 1; if (keys.has('d')) z += 1;
    x += stick.x; z += stick.z;
    const stickRun = Math.hypot(stick.x, stick.z) > 0.92;
    const l = Math.hypot(x, z); if (l > 1) { x /= l; z /= l; }
    const a = 1 - Math.exp(-dt * (l > 0.05 ? 16 : 22));
    smooth.x += (x - smooth.x) * a; smooth.z += (z - smooth.z) * a;
    if (Math.hypot(smooth.x, smooth.z) < 0.08 && l < 0.05) smooth.x = smooth.z = 0;
    game.input = { x: smooth.x, z: smooth.z, run: keys.has('run') || stickRun };
    game.update(dt);
    const p = game.player.group.position;
    if (dt > 0) {
      const vx = (p.x - lastP.x) / dt, vz = (p.z - lastP.y) / dt;
      const ok = Math.hypot(vx, vz) < 30; // ignora i teletrasporti (porte, svenimenti)
      look.lerp(new THREE.Vector2(ok ? vx * 0.28 : 0, ok ? vz * 0.18 : 0), 1 - Math.exp(-dt * 2.5));
    }
    lastP.set(p.x, p.z);
    world.updateOcclusion(p.x, p.z);
    world.followSun(p.x, p.z);
    checkPerf();
    minimap.update(p.x, p.z, dt);
    if (game.interni?.attivo) game.interni.camera(camera, dt); // dentro un edificio: camera fissa sulla stanza
    else {
      const tx = Math.max(7, Math.min(MAP_W - 7, p.x + look.x)), tz = Math.max(4, Math.min(MAP_H - 3, p.z + look.y));
      camPos.set(tx, 0.8, tz);
      camera.position.lerp(camPos.add(CAM_OFF), game.interni?.scatto ? 1 : 1 - Math.exp(-dt * 6));
      camera.lookAt(camera.position.x - CAM_OFF.x, 0.8, camera.position.z - CAM_OFF.z);
      if (game.interni) game.interni.scatto = false;
    }
  } else {
    // panoramica lenta dietro al titolo
    const t = performance.now() / 6000;
    const C = PLACES.titleCam;
    camera.position.set(C.x + Math.sin(t) * 10, 15, C.z + 21);
    camera.lookAt(C.x + Math.sin(t) * 10, 0, C.z);
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
frame();
window.__garonio = { game, world, ui, audio, CONFIG, minimap, perf, pannelli };
