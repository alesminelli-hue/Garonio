// Gruppi di nemici visibili sulla mappa (GDD 18.4).
// Girano nella loro zona secondo l'ora, la stagione e il livello di Garonio. Se lo vedono lo inseguono;
// se lo toccano parte lo scontro. Garonio può evitarli, scacciare quelli piccoli col clacson,
// oppure attaccare per primo con E (il primo turno è suo). I dati stanno in src/data/bestie.js.
//
// API (game.bestie.spawn):
//   gruppi                 gruppi sulla mappa: { id, membri, x, z, zona, ... }
//   crea(gruppo, vicino)   fa comparire un gruppo (vicino = accanto a Garonio, per le prove)
//   togliTutti()
//   bersaglio()            prompt E "Attacca per primo" (lo chiama game._findTarget tramite game.bestie)
import * as PIX from './pixel.js';
import { ENEMIES } from './combat.js';
import { NEMICI, puoComparire } from './data/nemici.js';
import { ZONE, ORARI, GRUPPI, SPAWN, AVVISI, NEMICI_NUOVI } from './data/bestie.js';
import { fill } from './racconto.js';
import { surfaceAt } from './map.js';

const H = 60;
const rand = (a, b) => a + Math.random() * (b - a);
const PLACE = { campi: 'campo', pollaio: 'campo', capannoni: 'capannoni', bosco: 'bosco', paese: 'paese', ovunque: 'campo' };

export class Spawn {
  constructor(game, bestie) {
    this.game = game; this.bestie = bestie;
    this.gruppi = [];
    this.next = {};          // zona -> minuti di gioco del prossimo tentativo
    this.n = 0;
    this.t = 0;
    this.framesCache = {};
  }
  get s() { return this.game.s; }

  init() {
    const g = this.game;
    g.on('nuovoGiorno', () => { this.togliTutti(); this.next = {}; });
    g.on('clacson', d => this._clacson(d));
  }

  ora() { return (this.s.minutes / H) % 24; }
  _inOrario(q) { const [a, b] = ORARI[q] || ORARI.sempre, h = this.ora(); return h >= a && h < b; }

  // ---------- Scelta del gruppo ----------
  _pesi(zona) {
    const lv = this.s.level, h = this.ora(), st = this.bestie.stagione();
    const caccia = this.bestie.specieInCaccia(), domate = this.bestie.specieDomate();
    const out = [];
    for (const gr of GRUPPI) {
      if (gr.zona !== zona || !this._inOrario(gr.quando)) continue;
      if (gr.stagioni && !gr.stagioni.includes(st)) continue;
      const capo = gr.membri[0];
      if (!ENEMIES[capo] || !puoComparire(capo, lv)) continue;
      let w = gr.peso || 1;
      if (gr.piuAlba && h < 9) w *= 2;
      if (gr.piuSera && h >= 17) w *= 2;
      if (gr.membri.some(m => caccia.has(m))) w *= 2;      // durante le tracce i seguaci compaiono il doppio
      if (gr.membri.some(m => domate.has(m))) w *= 0.5;    // re sconfitto: la sua specie la metà
      out.push([gr, w]);
    }
    return out;
  }

  componi(gr) {
    const lv = this.s.level, domate = this.bestie.specieDomate();
    const membri = gr.membri.filter(m => ENEMIES[m] && puoComparire(m, lv));
    if (gr.cresce && ENEMIES[gr.cresce]) {
      const min = NEMICI[gr.cresce]?.min || 1;
      const extra = Math.floor((lv - min) / 4 + Math.random() * 0.8);   // la grandezza cresce coi livelli
      for (let i = 0; i < extra && membri.length < (gr.max || 3); i++) membri.push(gr.cresce);
    }
    if (membri.some(m => domate.has(m))) membri.length = Math.min(membri.length, 2);   // solo gruppi piccoli
    return membri.slice(0, 4);
  }

  _tentativo() {
    const s = this.s;
    if (this.gruppi.length >= SPAWN.maxGruppi) return;
    for (const zona of Object.keys(ZONE)) {
      if (this.next[zona] == null) { this.next[zona] = s.minutes + rand(15, 70); continue; }
      if (s.minutes < this.next[zona]) continue;
      this.next[zona] = s.minutes + SPAWN.ogniOre * H * rand(0.7, 1.3);
      if (this.gruppi.length >= SPAWN.maxGruppi) return;
      if (this.gruppi.some(g => g.zona === zona)) continue;
      const pesi = this._pesi(zona);
      if (!pesi.length) continue;
      let r = Math.random() * pesi.reduce((t, [, w]) => t + w, 0);
      const gr = (pesi.find(([, w]) => (r -= w) < 0) || pesi[0])[0];
      this.crea(gr);
    }
  }

  // ---------- Creazione ----------
  _frames(id) {
    if (this.framesCache[id]) return this.framesCache[id];
    const L = ENEMIES[id].frames();                     // rivolti a sinistra
    const R = L.map(c => PIX.mirror(c));
    return (this.framesCache[id] = [R[0], R[1 % R.length], L[0], L[1 % L.length]]);
  }

  _punto(zona, vicino) {
    const W = this.game.world, P = this.game.player.group.position;
    if (vicino) {
      for (let i = 0; i < 40; i++) {
        const a = rand(0, Math.PI * 2), d = rand(5, 7);
        const x = P.x + Math.cos(a) * d, z = P.z + Math.sin(a) * d * 0.6;
        if (!W.blocked(x, z, 0.5)) return { x, z };
      }
      return { x: P.x + 5, z: P.z };
    }
    const rett = ZONE[zona].rett;
    for (let i = 0; i < 40; i++) {
      const [x0, z0, x1, z1] = rett[Math.floor(Math.random() * rett.length)];
      const x = rand(x0, x1), z = rand(z0, z1), d = Math.hypot(x - P.x, z - P.z);
      if (d < SPAWN.distMin || d > SPAWN.distMax) continue;
      if (W.blocked(x, z, 0.5) || surfaceAt(x, z) === 'acqua') continue;
      return { x, z };
    }
    return null;
  }

  crea(gr, vicino = false) {
    const membri = this.componi(gr);
    if (!membri.length) return null;
    const p = this._punto(gr.zona, vicino);
    if (!p) return null;
    const W = this.game.world;
    const actors = membri.map((id, i) => {
      const fr = this._frames(id);
      const nn = NEMICI_NUOVI[id];
      const w = nn?.mappa ?? fr[0].width / PIX.PX, h = w * fr[0].height / fr[0].width;
      const a = W.actor(fr, { w, h, shadow: w * 0.3 });
      const ang = i * 2.3, r = i ? 0.9 + i * 0.15 : 0;
      return { a, id, ox: Math.cos(ang) * r, oz: Math.sin(ang) * r * 0.6, vola: !!nn?.vola, ph: Math.random() * 6 };
    });
    // "!" sopra il capogruppo quando insegue
    this._bang ??= PIX.toTexture(PIX.bubble(' !'));
    const bang = W.sprite(this._bang, { w: 0.8, h: 0.5 });
    bang.visible = false; bang.position.set(0.2, actors[0].a.spr.scale.y + 0.2, 0); actors[0].a.group.add(bang);
    const g = {
      id: ++this.n, gr, membri, actors, bang, zona: gr.zona, x: p.x, z: p.z, tx: p.x, tz: p.z,
      nato: this.s.minutes, stato: 'giro', pausa: 0, dir: 1, anim: 0, calma: 0,
      nome: this._nome(membri), piccolo: membri.every(m => NEMICI_NUOVI[m]?.piccolo || m === 'nutria' || m === 'volpe'),
    };
    this._meta(g);
    this.gruppi.push(g);
    if (!vicino && Math.random() < 0.6) this.game.ui.toast(fill(AVVISI.nuovo, { nome: g.nome, zona: ZONE[g.zona].nome.toLowerCase() }));
    this.game.emit('gruppo', { stato: 'comparso', membri, zona: g.zona });
    return g;
  }

  _nome(membri) {
    const c = {};
    for (const m of membri) c[m] = (c[m] || 0) + 1;
    return Object.entries(c).map(([id, n]) => `${ENEMIES[id].name}${n > 1 ? ` ×${n}` : ''}`).join(' + ');
  }

  _meta(g) {
    const zr = ZONE[g.zona].rett.find(([x0, z0, x1, z1]) => g.x >= x0 - 1 && g.x <= x1 + 1 && g.z >= z0 - 1 && g.z <= z1 + 1) || ZONE[g.zona].rett[0];
    g.rett = zr;
  }

  _togli(g) {
    for (const m of g.actors) m.a.remove();
    this.gruppi.splice(this.gruppi.indexOf(g), 1);
    window.__garonio?.minimap?.setMarker('gruppo' + g.id, null);
  }
  togliTutti() { for (const g of [...this.gruppi]) this._togli(g); }

  // ---------- Movimento ----------
  update(dt) {
    const game = this.game, s = this.s;
    if (!game.player || !s.introDone) return;
    const pausa = game.locked || game.ui.busy() || game.combat.active || game.mm || game.interni?.attivo;
    this.t -= dt;
    if (this.t <= 0 && !pausa) { this.t = 1; this._tentativo(); }
    const P = game.player.group.position, W = game.world;
    const driving = !!game.vehicles?.driving;
    for (const g of [...this.gruppi]) {
      const d = Math.hypot(P.x - g.x, P.z - g.z);
      g.anim += dt;
      if (!pausa) {
        g.calma = Math.max(0, g.calma - dt);
        // se ne vanno da soli dopo qualche ora o fuori orario, se Garonio è lontano
        if (d > 16 && (s.minutes - g.nato > SPAWN.durataOre * H || !this._inOrario(g.gr.quando))) { this._togli(g); continue; }
        if (g.stato === 'scappa') {
          g.fugaT -= dt;
          if (g.fugaT <= 0) { this._togli(g); continue; }
        } else if (driving && d < 2.2) {
          this._scappa(g);
        } else if (d < SPAWN.inseguono && g.calma <= 0 && !driving) {
          g.stato = 'insegue'; g.tx = P.x; g.tz = P.z;
        } else if (g.stato === 'insegue' && d > SPAWN.inseguono * 1.8) {
          g.stato = 'giro'; g.pausa = rand(1, 3);
        }
        let sp = g.stato === 'insegue' ? SPAWN.velocitaInseguimento : g.stato === 'scappa' ? 5 : SPAWN.velocita;
        if (g.stato === 'giro') {
          g.pausa -= dt;
          const dd = Math.hypot(g.tx - g.x, g.tz - g.z);
          if (dd < 0.2 && g.pausa <= 0) {
            const [x0, z0, x1, z1] = g.rett;
            g.tx = Math.min(x1, Math.max(x0, g.x + rand(-6, 6))); g.tz = Math.min(z1, Math.max(z0, g.z + rand(-4, 4))); g.pausa = rand(1, 4);
          }
          if (g.pausa > 0 && dd < 0.2) sp = 0;
        }
        const dx = g.tx - g.x, dz = g.tz - g.z, dd = Math.hypot(dx, dz);
        if (sp > 0 && dd > 0.05) {
          const st = Math.min(dd, sp * dt), nx = g.x + dx / dd * st, nz = g.z + dz / dd * st;
          if (!W.blocked(nx, nz, 0.35) || g.stato === 'scappa') { g.x = nx; g.z = nz; }
          else if (!W.blocked(nx, g.z, 0.35)) g.x = nx;
          else if (!W.blocked(g.x, nz, 0.35)) g.z = nz;
          else { g.tx = g.x + rand(-3, 3); g.tz = g.z + rand(-3, 3); }
          if (Math.abs(dx) > 0.05) g.dir = dx > 0 ? 1 : -1;
          g.moving = true;
        } else g.moving = false;
        // contatto: parte lo scontro (il nemico ha preso Garonio)
        if (g.stato !== 'scappa' && !driving && g.calma <= 0 && this._tocca(g, P)) { this.combatti(g, false); continue; }
      }
      // disegno
      g.bang.visible = g.stato === 'insegue';
      for (const m of g.actors) {
        const fx = g.dir > 0 ? 0 : 2, f = g.moving || m.vola ? Math.floor((g.anim + m.ph) * (m.vola ? 6 : 5)) % 2 : 0;
        m.a.group.position.set(g.x + m.ox, 0, g.z + m.oz);
        m.a.setFrame(fx + f);
        if (m.vola) m.a.spr.position.y = 0.35 + Math.sin((g.anim + m.ph) * 4) * 0.12;
      }
      window.__garonio?.minimap?.setMarker('gruppo' + g.id, g.x, g.z, g.stato === 'insegue' ? '#ff3020' : '#e08040');
    }
  }

  _tocca(g, P) { return g.actors.some(m => Math.hypot(P.x - g.x - m.ox, P.z - g.z - m.oz) < 0.75); }

  _scappa(g) {
    if (g.stato === 'scappa') return;
    const P = this.game.player.group.position;
    const dx = g.x - P.x, dz = g.z - P.z, d = Math.hypot(dx, dz) || 1;
    g.stato = 'scappa'; g.fugaT = 2.5; g.tx = g.x + dx / d * 14; g.tz = g.z + dz / d * 14;
  }

  _clacson({ x, z }) {
    let n = 0;
    for (const g of this.gruppi) if (g.piccolo && Math.hypot(g.x - x, g.z - z) < SPAWN.clacson) { this._scappa(g); n++; }
    if (n) this.game.ui.toast(AVVISI.scacciati, 'good');
  }

  // prompt del tasto E
  bersaglio() {
    if (this.game.vehicles?.driving) return null;
    const P = this.game.player.group.position;
    for (const g of this.gruppi) {
      if (g.stato === 'scappa') continue;
      if (Math.hypot(P.x - g.x, P.z - g.z) < 2.4) return { label: fill(AVVISI.attaccaPrimo, { nome: g.nome }), fn: () => this.combatti(g, true) };
    }
    return null;
  }

  // ---------- Scontro ----------
  async combatti(g, primo) {
    const game = this.game;
    if (game.combat.active || game.locked || game.ui.busy() || game.mm) return;
    if (!this.gruppi.includes(g)) return;
    game._wake?.(); game.idle = 0;
    g.stato = 'giro'; g.calma = 999;
    const notte = this.ora() >= 20 && g.zona !== 'paese';
    const res = await game.combat.start({
      enemies: g.membri, place: PLACE[g.zona] + (notte ? ' notte' : ''), heroFirst: primo,
      script: this.bestie.scriptBase(),
      intro: primo ? `Garonio li prende alla sprovvista: ${g.nome}! Il primo turno è suo.` : null,
    });
    if (res === 'win') { this._togli(g); game.ui.toast(AVVISI.vinto, 'good'); }
    else if (res === 'flee') { g.calma = 6; g.stato = 'giro'; g.tx = g.x; g.tz = g.z; g.pausa = 3; }
    else { this._togli(g); if (res === 'lose') await game.mountain('sconfitta', 20); }
    game.emit('gruppo', { stato: res, membri: g.membri, zona: g.zona });
  }
}
