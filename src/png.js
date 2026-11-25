// Personaggi non giocanti: compaiono sulla mappa secondo l'ora, camminano (se hanno un giro),
// si parla con E, hanno un'amicizia con Garonio. I dati stanno in src/data/png.js.
//
// API (game.png):
//   aggiungiScelte(id, fn)      fn(ctx) => [{ label, fn, disabled }]: scelte in più nel dialogo con quel personaggio.
//                               Ogni lavoro (negozio del Bubetto, officina di Zeno, Consulente...) si aggancia così,
//                               senza modificare questo file. ctx = { id, def, game, amicizia }.
//   sostituisciDialogo(id, fn)  fn(ctx) => Promise: prende il posto del dialogo standard (per scene speciali).
//   amicizia(id) / cambiaAmicizia(id, delta)
//   dove(id) -> { x, z } | null   posizione attuale sulla mappa (null se non c'è o è dentro un edificio)
//   vicino(id, raggio)          Garonio è vicino a quel personaggio?
//   parla(id)                   apre il dialogo (lo fa già il tasto E)
//   attore(id)                  lo sprite sulla mappa (per animazioni speciali)
// Nei dati: def.vel = velocità sul giro (1.4 di serie, chi fa jogging va più svelto);
//           un posto con fermo: true ferma il giro (es. la ragazza che aspetta all'appuntamento).
import * as PIX from './pixel.js';
import { PNG } from './data/png.js';
import { pick, fill } from './racconto.js';
import { fraseSulleRagazze } from './ragazze.js';

const H = 60;

export class Personaggi {
  constructor(game) {
    this.game = game;
    this.list = [];             // { id, def, a, x, z, giroI, visible }
    this.extra = {};            // id -> [fn]
    this.custom = {};           // id -> fn
  }
  get s() { return this.game.s; }

  init() {
    const s = this.s;
    s.png ??= {};
    for (const [id, def] of Object.entries(PNG)) {
      if (!PIX.CHARACTERS[id]) PIX.CHARACTERS[id] = def.aspetto;   // ritratto nei dialoghi
      s.png[id] ??= { amicizia: def.amicizia?.[2] ?? 0, ultimaChiacchiera: 0 };
      const a = this.game.world.actor(PIX.characterFrames(id), { w: def.aspetto.w / 16 * 1.25, h: def.aspetto.h / 16 * 1.25, shadow: 0.4 });
      a.group.visible = false;
      // fumetto "!" sopra la testa quando ha una missione da offrire o da ritirare
      this._bubTex ??= PIX.toTexture(PIX.bubble(' !'));
      const mark = this.game.world.sprite(this._bubTex, { w: 0.9, h: 0.55 });
      mark.position.set(0.3, def.aspetto.h / 16 * 1.25 + 0.15, 0); mark.visible = false; a.group.add(mark);
      this.list.push({ id, def, a, mark, x: 0, z: 0, giroI: 1, visible: false, walkT: 0, dir: 1 });
    }
    this.update(0, true);
  }

  // posizione per l'ora attuale
  _posto(def) {
    const h = (this.s.minutes / H);
    return def.posti.find(p => h >= p.ore[0] && h < p.ore[1]) || null;
  }

  update(dt, force = false) {
    if (!this.list.length) return;
    this._markT = (this._markT || 0) - dt;
    if (this._markT <= 0 && this.game.quests) {
      this._markT = 1;
      for (const n of this.list) n.mark.visible = this.game.quests.haQualcosa(n.id);
    }
    for (const n of this.list) {
      const p = this._posto(n.def);
      // "interno": il personaggio sta dentro quell'edificio (coordinate locali della stanza, vedi src/interni.js)
      // e compare solo quando ci entra anche Garonio; quelli di fuori spariscono mentre Garonio è dentro.
      const dentro = this.game.interni?.attivo ? this.game.interni.edificio : null;
      const show = !!p && (p.interno ? p.interno === dentro : !dentro);
      if (show !== n.visible || p !== n.posto || force) {
        n.visible = show; n.a.group.visible = show; n.posto = p;
        if (show) {
          const o = p.interno ? this.game.interni.mondo(p.interno, p.x, p.z) : p;
          const q = this._libero(o.x, o.z); n.x = q.x; n.z = q.z; n.giroI = 1;
        }
      }
      if (!show) continue;
      let moving = false;
      if (n.def.giro && !p.interno && !p.fermo && dt > 0 && !this._parlando) {
        const [tx, tz] = n.def.giro[n.giroI];
        const dx = tx - n.x, dz = tz - n.z, d = Math.hypot(dx, dz);
        if (d < 0.1) n.giroI = (n.giroI + 1) % n.def.giro.length;
        else {
          const st = Math.min(d, (n.def.vel || 1.4) * dt);   // vel: chi fa jogging va più svelto
          n.x += dx / d * st; n.z += dz / d * st; moving = true;
          if (Math.abs(dx) > 0.05) n.dir = dx > 0 ? 1 : -1;
        }
      } else {
        const P = this.game.player?.group.position;
        if (P) n.dir = P.x > n.x ? 1 : -1;  // guarda Garonio
      }
      n.walkT += dt * 6 * Math.max(1, (n.def.vel || 1.4) / 1.4);
      n.a.group.position.set(n.x, 0, n.z);
      n.a.setFrame((n.dir > 0 ? 0 : 3) + (moving ? 1 + (Math.floor(n.walkT) % 2) : 0));
    }
  }

  _libero(x, z) {
    const W = this.game.world;
    for (let r = 0; r < 4; r += 0.5) for (const [ox, oz] of [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]]) {
      if (!W.blocked(x + ox, z + oz)) return { x: x + ox, z: z + oz };
    }
    return { x, z };
  }

  dove(id) { const n = this.list.find(n => n.id === id); return n && n.visible ? { x: n.x, z: n.z } : null; }
  attore(id) { return this.list.find(n => n.id === id)?.a; }
  vicino(id, r = 1.6) {
    const p = this.dove(id), P = this.game.player.group.position;
    return !!p && Math.hypot(P.x - p.x, P.z - p.z) < r;
  }

  // il personaggio più vicino a cui si può parlare (usato dal tasto E)
  bersaglio() {
    const P = this.game.player.group.position;
    let best = null, bd = 1.6;
    for (const n of this.list) {
      if (!n.visible) continue;
      const d = Math.hypot(P.x - n.x, P.z - n.z);
      if (d < bd) { bd = d; best = n; }
    }
    return best && { label: `Parla con ${best.def.nome}`, fn: () => this.parla(best.id) };
  }

  amicizia(id) { return this.s.png[id]?.amicizia ?? 0; }
  cambiaAmicizia(id, delta) {
    const st = this.s.png[id], def = PNG[id]; if (!st) return;
    const [lo, hi] = def.amicizia || [-50, 50];
    st.amicizia = Math.max(lo, Math.min(hi, st.amicizia + delta));
  }

  aggiungiScelte(id, fn) { (this.extra[id] ??= []).push(fn); }
  sostituisciDialogo(id, fn) { this.custom[id] = fn; }

  async parla(id) {
    const g = this.game, def = PNG[id], st = this.s.png[id];
    const ctx = { id, def, game: g, amicizia: st.amicizia };
    this._parlando = true;
    try {
      if (this.custom[id]) { await this.custom[id](ctx); return; }
      const vars = { titolo: g.prog.titolo(), nome: def.nome };
      const menu = () => {
        const choices = [];
        for (const fn of this.extra[id] || []) { try { choices.push(...(fn(ctx) || [])); } catch (e) { console.error(e); } }
        choices.push({ label: 'Chiacchiera', fn: () => {
          if (st.ultimaChiacchiera !== this.s.day) { st.ultimaChiacchiera = this.s.day; this.cambiaAmicizia(id, 1); }
          g.s.minutes += 10;
          const sr = Math.random() < 0.35 ? fraseSulleRagazze(this.s, def.sulleRagazze) : null;   // a volte parlano della tua ragazza
          return [{ who: id, name: def.nome, text: sr ?? fill(pick(def.chiacchiere), vars) }, menu()];
        } });
        choices.push({ label: 'Ciao', fn: null });
        return { who: id, name: def.nome, text: 'Altro?', choices };
      };
      const first = menu(); first.text = fill(pick(def.saluti), vars);
      await g.ui.dialog([first]);
    } finally {
      this._parlando = false;
      g.emit('parlato', { png: id });
    }
  }
}
