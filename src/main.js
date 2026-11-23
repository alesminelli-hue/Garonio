// Avvio: renderer pixelato, camera che segue Garonio, input tastiera e touch.
import * as THREE from 'three';
import { World, MAP_W, MAP_H } from './world.js';
import { Game, CONFIG, hasSave } from './game.js';
import { UI } from './ui.js';
import { Audio } from './audio.js';
import { loadGaronio } from './pixel.js';
import { PLACES } from './map.js';
import { Minimap } from './minimap.js';

const $ = id => document.getElementById(id);
const TARGET_H = 270; // risoluzione verticale interna: più bassa = pixel più grossi

const canvas = $('game');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
renderer.setPixelRatio(1);
const scene = new THREE.Scene();
scene.background = new THREE.Color('#8fc8e8');
const camera = new THREE.PerspectiveCamera(30, 16 / 9, 0.1, 200);
const CAM_OFF = new THREE.Vector3(0, 15, 21);

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  const scale = Math.max(1, Math.round(h / TARGET_H));
  renderer.setSize(Math.ceil(w / scale), Math.ceil(h / scale), false);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  // in verticale (telefono) la camera si allontana per vedere abbastanza mappa
  const dist = Math.max(26, 9 / (Math.tan(THREE.MathUtils.degToRad(15)) * camera.aspect));
  CAM_OFF.set(0, 15, 21).setLength(dist);
}
window.addEventListener('resize', resize); resize();

const audio = new Audio();
const ui = new UI(audio);
await loadGaronio();
const world = new World(scene);
world.build();
const game = new Game(world, ui, audio);
const minimap = new Minimap(world.grid);

// ---------- Input ----------
const keys = new Set();
const KEYMAP = { ArrowLeft: 'l', KeyA: 'l', ArrowRight: 'r', KeyD: 'r', ArrowUp: 'u', KeyW: 'u', ArrowDown: 'd', KeyS: 'd' };
window.addEventListener('keydown', e => {
  if (!started) return;
  audio.unlock();
  const k = KEYMAP[e.code];
  if (ui.busy()) {
    if (k === 'u') ui.key('up'); else if (k === 'd') ui.key('down');
    else if (['KeyE', 'Space', 'Enter'].includes(e.code)) ui.key('ok');
    e.preventDefault(); return;
  }
  if (k) keys.add(k);
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.add('run');
  if (['KeyE', 'Space', 'Enter'].includes(e.code) && !e.repeat) game.action();
  if (e.code === 'KeyQ' && !e.repeat) game.jump();
  if (e.code === 'KeyM') toggleMusic();
  if (e.code === 'KeyN') minimap.toggle();
  if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
});
window.addEventListener('keyup', e => {
  const k = KEYMAP[e.code]; if (k) keys.delete(k);
  if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.delete('run');
});
window.addEventListener('blur', () => keys.clear());
$('dialog').addEventListener('click', () => ui.key('ok'));

// levetta virtuale per telefono
const stick = { x: 0, z: 0, id: null, ox: 0, oy: 0 };
const pad = $('pad'), knob = $('knob');
pad.addEventListener('pointerdown', e => { stick.id = e.pointerId; const r = pad.getBoundingClientRect(); stick.ox = r.left + r.width / 2; stick.oy = r.top + r.height / 2; pad.setPointerCapture(e.pointerId); moveStick(e); audio.unlock(); });
pad.addEventListener('pointermove', e => { if (e.pointerId === stick.id) moveStick(e); });
const endStick = () => { stick.id = null; stick.x = stick.z = 0; knob.style.transform = ''; };
pad.addEventListener('pointerup', endStick); pad.addEventListener('pointercancel', endStick);
function moveStick(e) {
  let dx = e.clientX - stick.ox, dy = e.clientY - stick.oy;
  const m = Math.hypot(dx, dy), R = 40;
  if (m > R) { dx = dx / m * R; dy = dy / m * R; }
  stick.x = dx / R; stick.z = dy / R;
  knob.style.transform = `translate(${dx}px, ${dy}px)`;
}
$('btn-a').addEventListener('pointerdown', e => { e.preventDefault(); audio.unlock(); if (ui.busy()) ui.key('ok'); else game.action(); });
$('btn-jump').addEventListener('pointerdown', e => { e.preventDefault(); audio.unlock(); game.jump(); });
$('btn-music').addEventListener('click', e => { e.stopPropagation(); toggleMusic(); });
function toggleMusic() { const on = audio.toggle(); $('btn-music').textContent = on ? '♪' : '✕'; }
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
  await game.start(cont);
}
// la musica dell'intro parte al primo tocco sulla schermata del titolo
$('title').addEventListener('pointerdown', () => { audio.unlock(); if (!started) audio.setScene('intro'); });
$('btn-new').addEventListener('click', () => { Game.reset(); begin(false); });
$('btn-continue').addEventListener('click', () => begin(true));

// ---------- Ciclo ----------
const clock = new THREE.Clock();
const camPos = new THREE.Vector3();
function frame() {
  const dt = Math.min(0.05, clock.getDelta());
  if (started && game.player) {
    let x = 0, z = 0;
    if (keys.has('l')) x -= 1; if (keys.has('r')) x += 1;
    if (keys.has('u')) z -= 1; if (keys.has('d')) z += 1;
    x += stick.x; z += stick.z;
    const stickRun = Math.hypot(stick.x, stick.z) > 0.95;
    game.input = { x, z, run: keys.has('run') || stickRun };
    game.update(dt);
    const p = game.player.group.position;
    world.updateOcclusion(p.x, p.z);
    minimap.update(p.x, p.z, dt);
    const tx = Math.max(7, Math.min(MAP_W - 7, p.x)), tz = Math.max(4, Math.min(MAP_H - 3, p.z));
    camPos.set(tx, 0.8, tz);
    camera.position.lerp(camPos.clone().add(CAM_OFF), 1 - Math.pow(0.001, dt));
    camera.lookAt(camera.position.x - CAM_OFF.x, 0.8, camera.position.z - CAM_OFF.z);
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
window.__garonio = { game, world, ui, audio, CONFIG, minimap };
