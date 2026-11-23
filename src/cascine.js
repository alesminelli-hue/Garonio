// Cascine dei vicini e missioni truffaldine del Gigante (GDD 19.5 e 19.6).
// I dati stanno in src/data/vicini.js, le missioni in src/data/secondarie.js (da: 'gigante', truffaldina: true).
//
// Cosa fa:
//  - sulla mappa: pozzo di Frank, alberi del confine, paletti del Postino, erpice del Patata, cani con la cuccia, garzoni;
//  - i vicini fanno battute quando Garonio passa e hanno scelte in più nel dialogo (patate, voci, mais);
//  - il Gigante offre le truffe nel suo dialogo (talkGigante in game.js chiama scelteGigante());
//  - durante una truffa: coni di vista e udito di vicino, cane e garzone, rumore delle azioni, sospetto;
//    se arriva a 1 il vicino ti scopre: scusa, bugia, fuga o rissa.
//
// API (game.cascine):
//   target()            bersaglio del tasto E (lo chiama game._findTarget, a piedi e alla guida)
//   scelteGigante()     scelte in più nel dialogo del Gigante
//   attiva()            la truffa in corso: { id, def, a } | null
//   sospetto[vicino]    0..1
//   offri(id)           (console) fa offrire subito una truffa precisa dal Gigante
//
// Eventi mandati (vedi src/eventi.js): truffa { tipo, vicino } · alberoAbbattuto { vicino } · palettoSpostato { vicino }
//   truffaScoperta { vicino, missione, esito }. La multa la fa la Vigilessa (game.vigilessa.multa('truffa')).
import * as THREE from 'three';
import * as PIX from './pixel.js';
import { ENEMIES } from './combat.js';
import { OGGETTI } from './data/armi.js';
import { PNG } from './data/png.js';
import { AREAS } from './map.js';
import {
  VICINI, BERSAGLI, RUMORE, SOSPETTO, DURATE, MULTA_TRUFFA, OGGETTI_TRUFFA, COMMERCI, VOCI, GIGANTE_TRUFFE,
  SCUSE, MOUNTAIN_TRUFFA, NEMICI_CASCINE, PARLA_GARZONI, CANE_CAREZZE,
} from './data/vicini.js';
import { pick, pagina } from './racconto.js';

const H = 60;
const DEG = Math.PI / 180;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const wrapA = a => { while (a > Math.PI) a -= Math.PI * 2; while (a < -Math.PI) a += Math.PI * 2; return a; };

// ---------- pixel art (segnaposto, nello stile di src/pixel.js) ----------
function outline(c, color = '#1a1420') {
  const g = c.getContext('2d'), { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = color;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y)) continue;
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1);
  }
  return c;
}
function canvas(w, h, draw) { const [c, g] = PIX.makeCanvas(w, h); const P = (col, x, y, ww, hh) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); }; draw(P, g); return outline(c); }

// cane visto di lato, rivolto a destra. frame 0/1 = passo, 2 = dorme
export function cane(a, frame = 0) {
  return canvas(22, 15, P => {
    if (frame === 2) {
      P(a.pelo, 3, 9, 15, 5); P(a.pelo, 15, 7, 6, 5); P(a.scuro, 16, 6, 2, 2); P(a.scuro, 0, 11, 4, 2);
      P('#1a1420', 18, 9, 2, 1); P('#f0f0ff', 9, 2, 2, 1); P('#f0f0ff', 12, 0, 2, 1);
      return;
    }
    P(a.scuro, 1, 4 + frame, 3, 2); P(a.scuro, 3, 5, 2, 2);        // coda
    P(a.pelo, 4, 6, 12, 5);                                          // corpo
    P(a.pelo, 14, 2, 6, 6); P(a.scuro, 14, 1, 2, 3);                // testa e orecchio
    P(a.pelo, 19, 5, 3, 3); P('#1a1420', 21, 5, 1, 1);              // muso e naso
    P('#1a1420', 17, 4, 1, 1);                                       // occhio
    P(a.scuro, 5, 11, 2, 3 - frame); P(a.scuro, 9, 11, 2, 2 + frame); P(a.scuro, 12, 11, 2, 3 - frame); P(a.scuro, 14, 11, 2, 2 + frame);
    P('#c03030', 13, 7, 2, 1);                                       // collare
  });
}
const cuccia = () => canvas(18, 16, P => {
  P('#8a3a2a', 1, 4, 16, 3); P('#a84a32', 3, 1, 12, 3); P('#9a6a3a', 2, 7, 14, 9);
  P('#2a1a12', 6, 9, 6, 7); P('#6e4826', 2, 7, 14, 1);
});
const pozzo = () => canvas(22, 28, P => {
  P('#6e4826', 3, 2, 2, 16); P('#6e4826', 17, 2, 2, 16); P('#a8462e', 1, 0, 20, 3);     // tettuccio
  P('#7a7a80', 4, 7, 14, 1); P('#5a4a3a', 10, 7, 1, 6); P('#8a6a3a', 9, 12, 3, 3);     // carrucola e secchio
  P('#9a9aa0', 1, 16, 20, 11); P('#b8b8c0', 1, 16, 20, 2); P('#6a6a72', 6, 19, 1, 8); P('#6a6a72', 14, 19, 1, 8); P('#6a6a72', 1, 22, 20, 1);
});
const ceppo = () => canvas(14, 9, P => { P('#7a5434', 2, 2, 10, 7); P('#c8a070', 3, 1, 8, 2); P('#8a6038', 5, 1, 3, 1); P('#5a3a22', 0, 7, 3, 2); P('#5a3a22', 11, 7, 3, 2); });
const paletto = () => canvas(5, 18, P => { P('#9a6a3a', 1, 4, 3, 14); P('#e03a2a', 1, 0, 3, 2); P('#f4f4f4', 1, 2, 3, 2); });
const erpice = () => canvas(26, 14, P => {
  P('#c84a2a', 1, 2, 24, 3); P('#c84a2a', 1, 2, 3, 8); P('#c84a2a', 22, 2, 3, 8); P('#a83a22', 1, 7, 24, 2);
  for (let x = 3; x < 24; x += 3) P('#6a6a72', x, 9, 1, 4);
});
const spruzzo = f => canvas(16, 12, P => { for (let i = 0; i < 7; i++) P(i % 2 ? '#8ad0ff' : '#c8ecff', (i * 5 + f * 3) % 15, ((i * 7 + f * 4) % 9) + 1, 2, 2); });
function bubble(text, bg = '#fff') {
  const [c, g] = PIX.makeCanvas(14, 12);
  g.fillStyle = bg; g.fillRect(1, 1, 12, 8); g.fillRect(4, 9, 3, 2);
  g.fillStyle = '#1a1420'; g.font = 'bold 8px monospace'; g.textBaseline = 'top'; g.fillText(text, 4, 1);
  return outline(c);
}

// ---------- il sistema ----------
export class Cascine {
  constructor(game) {
    this.game = game;
    this.guardie = [];        // { vicino, tipo: 'vicino'|'cane'|'garzone'|'casa', ... }
    this.alberi = [];         // { vicino, i, x, z, spr, solid, cut }
    this.paletti = [];
    this.sospetto = {};       // vicino -> 0..1
    this.azione = null;       // azione a tempo in corso (motosega, paletto, erpice)
    this.pompa = null;        // turbina attaccata
    this._bark = {};
    this._t = 0;
  }
  get s() { return this.game.s; }
  get f() { return this.s.flags.cascine; }
  get W() { return this.game.world; }

  init() {
    const s = this.s;
    s.flags.cascine ??= {};
    const f = s.flags.cascine;
    f.alberi ??= {}; f.paletti ??= []; f.erpice ??= 'patata'; f.calmi ??= {}; f.creduto ??= {};
    f.voci ??= {}; f.prossimaDopo ??= 0; f.conta ??= 0; f.pompa ??= 0; f.bollita ??= 0;
    for (const v of Object.keys(VICINI)) this.sospetto[v] = 0;

    Object.assign(OGGETTI, OGGETTI_TRUFFA);
    this._registraNemici();
    this._costruisci();
    this._hud();
    this._scelteVicini();

    const g = this.game;
    // agganci generici di game.js: il bersaglio a piedi e l'aggiornamento a ogni fotogramma
    g.bersagli?.push(() => this.target());
    g.moduli?.push({ animate: dt => this.update(dt) });
    g.on('nuovoGiorno', () => this._nuovoGiorno());
    g.on('secondaria', d => { if (d.stato === 'fatta' || d.stato === 'fallita') this._fine(d.id, d.stato); });
  }

  // ---------- costruzione degli oggetti di scena ----------
  _costruisci() {
    const W = this.W, f = this.f, scene = W.scene;
    const add = (tex, w, h, x, z) => { const s = W.sprite(tex, { w, h }); s.position.set(x, 0, z); scene.add(s); return s; };
    const solid = (x, z, hx, hz) => { const o = { x0: x - hx, z0: z - hz, x1: x + hx, z1: z + hz }; W.solids.push(o); return o; };

    // pozzo di Frank
    const pz = BERSAGLI.pozzo;
    add(PIX.toTexture(pozzo()), 1.4, 1.75, pz.x, pz.z); solid(pz.x, pz.z, 0.6, 0.3);

    // alberi del confine
    this._texAlbero = [1, 2, 3].map(i => PIX.toTexture(PIX.tree(40 + i)));
    this._texCeppo = PIX.toTexture(ceppo());
    for (const [vic, list] of Object.entries(BERSAGLI.alberi)) list.forEach(([x, z], i) => {
      const id = `${vic}:${i}`;
      const t = { id, vicino: vic, x: x + 0.5, z: z + 0.5, cut: false };
      t.spr = add(this._texAlbero[i % 3], 2, 2.75, t.x, t.z);
      t.ceppo = add(this._texCeppo, 0.9, 0.55, t.x, t.z + 0.05); t.ceppo.visible = false;
      this.alberi.push(t);
      this._mostraAlbero(t, !!f.alberi[id]);
    });

    // paletti del confine
    const PL = BERSAGLI.paletti, ptex = PIX.toTexture(paletto());
    PL.z.forEach((z, i) => {
      const p = { i, z: z + 0.5, x0: PL.x + 0.5, spr: add(ptex, 0.32, 1.1, PL.x + 0.5, z + 0.5) };
      this.paletti.push(p); this._mostraPaletto(p);
    });

    // erpice del Patata
    const E = BERSAGLI.prestito;
    this.erpice = add(PIX.toTexture(erpice()), 1.6, 0.85, E.x, E.z);
    this._mostraErpice();

    // cani e cucce
    for (const [vic, V] of Object.entries(VICINI)) {
      const c = V.cane;
      add(PIX.toTexture(cuccia()), 1.1, 1, c.x - 1.1, c.z - 0.4); solid(c.x - 1.1, c.z - 0.4, 0.5, 0.25);
      const fr = [0, 1, 2].map(k => cane(c.aspetto, k));
      const t = c.aspetto.taglia;
      const a = W.actor([...fr, ...fr.map(PIX.mirror)], { w: 1.3 * t, h: 0.9 * t, shadow: 0.35 * t });
      a.group.position.set(c.x, 0, c.z);
      this.guardie.push(this._guardia(vic, 'cane', c, a, { x: c.x, z: c.z }));
    }
    // garzoni
    for (const [vic, V] of Object.entries(VICINI)) {
      const gz = V.garzone; if (!gz) continue;
      PIX.CHARACTERS[gz.id] = gz.aspetto;
      const a = W.actor(PIX.characterFrames(gz.id), { w: gz.aspetto.w / 16 * 1.25, h: gz.aspetto.h / 16 * 1.25, shadow: 0.4 });
      const [x, z] = gz.giro[0];
      a.group.position.set(x, 0, z); a.group.visible = false;
      this.guardie.push(this._guardia(vic, 'garzone', gz, a, { x, z, giroI: 1 }));
    }
    // il vicino in persona (lo sprite lo muove src/png.js) e la "casa" che ascolta di notte
    for (const [vic, V] of Object.entries(VICINI)) {
      this.guardie.push(this._guardia(vic, 'vicino', V, null, { x: 0, z: 0 }));
      this.guardie.push(this._guardia(vic, 'casa', { vista: [0, 0], udito: V.udito + 2, sguardo: 0, giro: 0 }, null, { x: V.porta.x, z: V.porta.z }));
    }

    // spruzzo della turbina
    this._texSpruzzo = [0, 1, 2].map(k => PIX.toTexture(spruzzo(k)));
    this.spruzzo = W.sprite(this._texSpruzzo[0], { w: 1.2, h: 0.9 }); this.spruzzo.visible = false; scene.add(this.spruzzo);

    // fumetto sopra il Gigante quando ha un lavoretto
    this._mark = W.sprite(PIX.toTexture(bubble('!', '#ffd84a')), { w: 0.6, h: 0.5 });
    this._mark.position.set(0.35, 2.95, 0); this._mark.visible = false;
    this.game.gigante.group.add(this._mark);
  }

  _guardia(vicino, tipo, def, actor, pos) {
    const W = this.W;
    const geo = new THREE.CircleGeometry(1, 18, -1, 2).rotateX(-Math.PI / 2);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffe060, transparent: true, opacity: 0.2, depthWrite: false });
    const cono = new THREE.Mesh(geo, mat); cono.position.y = 0.05; cono.visible = false; W.scene.add(cono);
    const ear = new THREE.Mesh(new THREE.RingGeometry(0.94, 1, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x80c0ff, transparent: true, opacity: 0.35, depthWrite: false }));
    ear.position.y = 0.04; ear.visible = false; W.scene.add(ear);
    const segno = W.sprite(PIX.toTexture(bubble('?')), { w: 0.55, h: 0.47 }); segno.visible = false; W.scene.add(segno);
    const segnoTex = { '?': segno.material.map, '!': PIX.toTexture(bubble('!', '#ff7060')) };
    return { vicino, tipo, def, actor, ...pos, cono, ear, segno, segnoTex, fase: Math.random() * 6, look: def.sguardo || 0, dir: 1, walkT: 0, attivo: false, dorme: false };
  }

  _mostraAlbero(t, cut) {
    t.cut = cut; t.spr.visible = !cut; t.ceppo.visible = cut; t.spr.material.rotation = 0;
    if (!cut && !t.solid) { t.solid = { x0: t.x - 0.3, z0: t.z - 0.2, x1: t.x + 0.3, z1: t.z + 0.2 }; this.W.solids.push(t.solid); this.W._idxN = -1; }
    if (cut && t.solid) { this.W.solids.splice(this.W.solids.indexOf(t.solid), 1); t.solid = null; this.W._idxN = -1; }
  }
  _mostraPaletto(p) {
    p.spostato = this.f.paletti.includes(p.i);
    p.spr.position.x = p.x0 + (p.spostato ? BERSAGLI.paletti.sposta : 0);
  }
  _mostraErpice() {
    const E = BERSAGLI.prestito, where = this.f.erpice;
    this.erpice.visible = where !== 'garonio';
    if (where === 'tettoia') this.erpice.position.set(E.tettoia.x, 0, E.tettoia.z - 0.6);
    else this.erpice.position.set(E.x, 0, E.z);
  }

  // ---------- nemici per la rissa ----------
  _registraNemici() {
    const humanLeft = o => [0, 1, 2].map(k => PIX.mirror(PIX.humanoid(o, k)));
    for (const [id, n] of Object.entries(NEMICI_CASCINE)) {
      if (ENEMIES[id]) continue;
      let frames;
      if (n.png) frames = () => humanLeft(PNG[n.png].aspetto);
      else if (n.garzone) frames = () => humanLeft(VICINI[n.garzone].garzone.aspetto);
      else frames = () => [0, 1].map(k => PIX.mirror(cane(VICINI[n.cane].cane.aspetto, k)));
      ENEMIES[id] = { ...n.stat, frames };
    }
  }

  // ---------- missioni ----------
  attiva() {
    const Q = this.game.quests;
    for (const [id, a] of Object.entries(this.s.quests.attive)) {
      const def = Q.defs[id];
      if (def?.truffaldina) return { id, def, a };
    }
    return null;
  }
  _now() { return this.s.day * 24 * H + this.s.minutes; }

  // prossima truffa che il Gigante può offrire (prima le nuove, poi le repliche)
  prossima() {
    const Q = this.game.quests;
    if (this.attiva() || this._now() < this.f.prossimaDopo) return null;
    if (this._forzata && Q.defs[this._forzata] && !Q.stato(this._forzata)) return this._forzata;
    const basi = Object.entries(Q.defs).filter(([id, d]) => d.truffaldina && d.da === 'gigante' && !id.includes('@'));
    const nuova = basi.find(([id, d]) => !Q.stato(id) && Q._requisiti(d));
    if (nuova) return nuova[0];
    // tutte fatte: il Gigante ne ripropone una a caso (missione ripetibile)
    const pool = basi.filter(([id, d]) => Q._requisiti(d));
    if (!pool.length) return null;
    const [base, d] = pool[(this.s.day + this.f.conta) % pool.length];
    const id = `${base}@${this.f.conta + 1}`;
    if (!Q.defs[id]) Q.aggiungi(id, { ...d, requisiti: {}, ripetuta: true });
    return id;
  }
  offri(id) { this._forzata = id; this.f.prossimaDopo = 0; return this.prossima(); }

  scelteGigante() {
    const Q = this.game.quests, T = GIGANTE_TRUFFE, t = this.attiva();
    const gig = testo => pagina({ chi: 'gigante', testo });
    if (t && t.a.stato === 'pronta') {
      return [{ label: `✅ Riscuoti: ${t.def.titolo}`, fn: () => { Q.completa(t.id); return [gig(T.riuscita)]; } }];
    }
    if (t) {
      return [{ label: `🤫 ${t.def.titolo}`, fn: () => [{ ...gig(T.inCorso), choices: [
        { label: 'Ci sto lavorando', fn: null },
        { label: 'Lascio perdere (stress +5)', fn: () => { this.s.stress = clamp(this.s.stress + 5, 0, 100); Q.fallisci(t.id); return [gig(T.rinuncia)]; } },
      ] }] }];
    }
    const id = this.prossima();
    if (!id) return [{ label: T.etichetta, fn: () => [gig(T.niente)] }];
    const q = Q.defs[id];
    return [{ label: T.etichetta, fn: () => [gig(T.attacco), { ...pagina({ chi: 'gigante', testo: q.offerta }), choices: [
      { label: `${q.accetta || 'Va bene'} (+${q.premio.soldi}€)`, fn: () => { this._forzata = null; Q.accetta(id); this._dopoAccetta(id); return null; } },
      { label: q.rifiuta || 'Non oggi', fn: () => [gig(T.rifiutata)] },
    ] }] }];
  }

  _dopoAccetta(id) {
    const def = this.game.quests.defs[id];
    this.f.pompa = 0;
    if (def.tipo === 'acqua' && !this.game.attrezzi) this.game.ui.toast('Prendi il trattore ROSSO (ha la turbina) e portalo all\'acqua del vicino.', '');
  }

  // fine di una truffa (fatta o fallita): restituisce gli attrezzi prestati
  _fine(id, stato) {
    const def = this.game.quests.defs[id]; if (!def?.truffaldina) return;
    const P = this.game.prog;
    while (P.ha('motosega_gigante')) P.togliOggetto('motosega_gigante');
    if (stato === 'fallita' && this.f.erpice === 'garonio') { this.f.erpice = 'patata'; this._mostraErpice(); }
    if (stato === 'fatta' && def.tipo === 'prestito') this.f.attrezziRubati = [...new Set([...(this.f.attrezziRubati || []), 'erpice'])];
    this.f.conta++; this.f.pompa = 0; this._fermaPompa(true);
    this.f.prossimaDopo = this._now() + 120;
    this.game.minimap?.setMarker?.('truffa', null);
    this._mm()?.setMarker('truffa', null);
  }

  _segnaFatto(vicino, tipo) {
    const t = this.attiva(); if (!t) return;
    this.game.emit('truffa', { tipo, vicino });
    if (this.game.quests.stato(t.id) === 'pronta') {
      this.game.ui.toast(`Fatto! Torna dal Gigante: «${t.def.titolo}». E non dire niente a nessuno.`, 'good');
      this.game.emit('secondaria', { id: t.id, stato: 'pronta' });
    }
  }

  // ---------- tasto E ----------
  target() {
    if (this.azione || this._scena) return null;
    const g = this.game, P = g.player.group.position, t = this.attiva();
    const d = (x, z) => Math.hypot(P.x - x, P.z - z);
    const truffa = t && t.a.stato === 'attiva' ? t.def : null;

    if (g.vehicles.driving) {
      const v = g.vehicles.driving;
      if (this.pompa) return { label: 'Stacca la turbina', fn: () => this._fermaPompa() };
      if (truffa?.tipo === 'acqua') {
        const sp = BERSAGLI.acqua[truffa.vicino];
        if (Math.hypot(v.st.x - sp.x, v.st.z - sp.z) < 3.4) {
          if (g.attrezzi?.turbinaAttiva) return null; // con gli attrezzi veri la turbina si accende da sé (lavoro C)
          if (v.id !== 'trattore1') return { label: 'Qui serve il trattore rosso con la turbina', fn: () => g.ui.toast('La turbina è agganciata al trattore ROSSO, sotto la tettoia.', 'bad') };
          return { label: `Attacca la turbina a ${sp.nome}`, fn: () => this._attaccaPompa(v, truffa.vicino) };
        }
      }
      return null;
    }

    if (truffa?.tipo === 'alberi' && g.prog.ha('motosega_gigante')) {
      const a = this.alberi.find(a => a.vicino === truffa.vicino && !a.cut && d(a.x, a.z + 0.3) < 1.5);
      if (a) return { label: 'Abbatti l\'albero con la motosega', fn: () => this._azione('motosega', DURATE.albero, a, () => this._abbatti(a)) };
    }
    if (truffa?.tipo === 'confine') {
      const p = this.paletti.find(p => !p.spostato && d(p.spr.position.x, p.z) < 1.3);
      if (p) return { label: 'Sposta il paletto del confine', fn: () => this._azione('paletto', DURATE.paletto, p, () => this._sposta(p)) };
    }
    if (truffa?.tipo === 'prestito') {
      const E = BERSAGLI.prestito;
      if (this.f.erpice === 'patata' && d(E.x, E.z) < 1.5) return { label: `Prendi ${E.nome}`, fn: () => this._azione('prestito', DURATE.prestito, null, () => this._prendiErpice()) };
      if (this.f.erpice === 'garonio' && d(E.tettoia.x, E.tettoia.z) < 2.6) return { label: 'Lascia l\'erpice sotto la tettoia', fn: () => this._lasciaErpice() };
    }
    for (const gu of this.guardie) {
      if (!gu.attivo || !gu.actor) continue;
      if (d(gu.x, gu.z) > 1.4) continue;
      if (gu.tipo === 'cane') return { label: `Accarezza ${gu.def.nome}`, fn: () => this._carezza(gu) };
      if (gu.tipo === 'garzone') return { label: `Parla con ${gu.def.nome.split(',')[0]}`, fn: () => this._parlaGarzone(gu) };
    }
    return null;
  }

  // azione a tempo (barra di avanzamento; se ti allontani si interrompe)
  _azione(tipo, sec, ogg, fine) {
    const P = this.game.player.group.position;
    this.azione = { tipo, t: 0, sec, x: P.x, z: P.z, fine, ogg };
    if (tipo === 'motosega') this._suono('motosega');
    else this.game.audio.sfx('dig');
  }

  _abbatti(a) {
    this.f.alberi[a.id] = this.s.day;
    this.s.tired = clamp(this.s.tired + 4, 0, 100);
    // caduta: lo sprite ruota attorno alla base
    let k = 0;
    const fall = () => {
      k += 0.08; a.spr.material.rotation = -k * Math.PI / 2;
      if (k < 1) requestAnimationFrame(fall); else { this._mostraAlbero(a, true); this._suono('tonfo'); }
    };
    fall();
    this.game.emit('alberoAbbattuto', { vicino: a.vicino });
    const t = this.attiva();
    if (t && this.game.quests.stato(t.id) === 'pronta') {
      this.game.ui.toast(`Alberi abbattuti! Torna dal Gigante a riscuotere (e a restituire la motosega).`, 'good');
      this.game.emit('secondaria', { id: t.id, stato: 'pronta' });
    } else this.game.ui.toast('TIMBER! Un albero in meno sul confine.', 'small');
  }

  _sposta(p) {
    this.f.paletti.push(p.i); this._mostraPaletto(p);
    this.game.emit('palettoSpostato', { vicino: BERSAGLI.paletti.vicino });
    const t = this.attiva();
    if (t && this.game.quests.stato(t.id) === 'pronta') {
      this.game.ui.toast('Confine spostato! Il campo del Gigante è cresciuto di due metri. Torna da lui.', 'good');
      this.game.emit('secondaria', { id: t.id, stato: 'pronta' });
    } else this.game.ui.toast(`Paletto spostato (${this.f.paletti.length}/${this.paletti.length}).`, 'small');
  }

  _prendiErpice() {
    this.f.erpice = 'garonio'; this._mostraErpice();
    this.game.ui.toast('Hai l\'erpice in spalla. Pesa. Portalo sotto la tettoia, vicino all\'officina.', '');
  }
  _lasciaErpice() {
    this.f.erpice = 'tettoia'; this._mostraErpice();
    this.game.audio.sfx('pick');
    this._segnaFatto('patata', 'prestito');
  }

  _carezza(gu) {
    const f = this.f, V = gu.vicino;
    this.game.audio.sfx('pick');
    if (gu.allerta > 0.5) { this.game.ui.toast(`${gu.def.nome} ringhia. Non è il momento delle coccole.`, 'bad'); return; }
    if (f.carezze?.[V] !== this.s.day) {
      f.carezze = { ...(f.carezze || {}), [V]: this.s.day };
      this.game.ui.toast(`${pick(CANE_CAREZZE).replace('{cane}', gu.def.nome)} (oggi il cane non abbaia contro di te)`, 'good');
    } else this.game.ui.toast(`${gu.def.nome} scodinzola. Siete già amici, per oggi.`, 'small');
  }

  async _parlaGarzone(gu) {
    const id = gu.def.id;
    await this.game.ui.dialog([{ who: id, name: gu.def.nome, text: pick(PARLA_GARZONI[id]) }]);
  }

  // ---------- turbina (segnaposto finché non arriva src/attrezzi.js) ----------
  _attaccaPompa(v, vicino) {
    this.pompa = { v, vicino, last: this.s.minutes };
    this.game.audio.sfx('water');
    this.game.ui.toast(`Turbina attaccata. Resta qui un'ora di gioco senza farti vedere. (${Math.round(this.f.pompa)}/${DURATE.turbinaMinuti} min)`, '');
  }
  _fermaPompa(silenzioso = false) {
    if (!this.pompa) return;
    this.pompa = null; this.spruzzo.visible = false;
    if (!silenzioso) this.game.ui.toast(`Turbina staccata (${Math.round(this.f.pompa)}/${DURATE.turbinaMinuti} min). Puoi riattaccarla dopo.`, 'small');
  }
  _aggiornaPompa() {
    const g = this.game, t = this.attiva();
    // con gli attrezzi veri (lavoro C): la turbina accesa vicino all'acqua del vicino conta da sola
    if (!this.pompa && g.attrezzi?.turbinaAttiva && t?.a.stato === 'attiva' && t.def.tipo === 'acqua') {
      const sp = BERSAGLI.acqua[t.def.vicino];
      if (g.attrezzi.turbinaAttiva(sp.x, sp.z) && g.vehicles.driving) this.pompa = { v: g.vehicles.driving, vicino: t.def.vicino, last: this.s.minutes, vero: true };
    }
    const p = this.pompa; if (!p) return;
    const sp = BERSAGLI.acqua[p.vicino];
    const lontano = g.vehicles.driving !== p.v || Math.hypot(p.v.st.x - sp.x, p.v.st.z - sp.z) > 3.6;
    const spenta = p.vero && !g.attrezzi.turbinaAttiva(sp.x, sp.z);
    if (!t || t.def.tipo !== 'acqua' || lontano || spenta) { this._fermaPompa(!t); return; }
    this.f.pompa += Math.max(0, this.s.minutes - p.last); p.last = this.s.minutes;
    this.spruzzo.visible = true;
    this.spruzzo.position.set(p.v.st.x + 0.2, 0.6 + Math.sin(performance.now() / 120) * 0.05, p.v.st.z + 0.6);
    this.spruzzo.material.map = this._texSpruzzo[(performance.now() / 140 | 0) % 3];
    if (this.f.pompa >= DURATE.turbinaMinuti) {
      this._fermaPompa(true);
      this._irriga();
      this._segnaFatto(p.vicino, 'acqua');
    }
  }
  // l'acqua rubata annaffia il campo del Gigante
  _irriga() {
    const s = this.s, A = AREAS.field;
    for (const [k, p] of Object.entries(s.plots)) {
      const [x, z] = k.split(',').map(Number);
      if (x >= A.x0 && x < A.x1 && z >= A.z0 && z < A.z1 && p.crop && !p.water) { p.water = true; this.W.setPlot(x, z, p); }
    }
  }

  // ---------- ciclo ----------
  update(dt) {
    const g = this.game;
    if (!g.player) return;
    const busy = g.ui.busy() || g.locked || g.combat.active;
    this._t += dt;
    const h = (this.s.minutes / H) % 24, notte = h >= 20 || h < 6;
    this._muoviGuardie(dt, h, busy);
    this._mark.visible = !this.attiva() && !!this._puoOffrire() || this.attiva()?.a.stato === 'pronta';
    this._mm();
    if (busy) { this._hudShow(null); return; }
    this._aggiornaAzione(dt);
    this._aggiornaPompa();
    this._battute();
    this._sorveglia(dt, notte);
  }
  _puoOffrire() {
    if (this._now() < this.f.prossimaDopo) return false;
    // controlla senza creare repliche
    const Q = this.game.quests;
    return Object.entries(Q.defs).some(([id, d]) => d.truffaldina && d.da === 'gigante' && !id.includes('@') && Q._requisiti(d)) ;
  }
  _mm() {
    const mm = this.game.minimap || window.__garonio?.minimap; if (!mm) return null;
    const t = this.attiva();
    if (!t) { mm.setMarker('truffa', null); return mm; }
    let p = null;
    if (t.a.stato === 'pronta') { const G = this.game.gigante.group.position; p = { x: G.x, z: G.z }; }
    else if (t.def.tipo === 'acqua') p = BERSAGLI.acqua[t.def.vicino];
    else if (t.def.tipo === 'alberi') p = this.alberi.find(a => a.vicino === t.def.vicino && !a.cut);
    else if (t.def.tipo === 'confine') { const q = this.paletti.find(p => !p.spostato); p = q && { x: q.x0, z: q.z }; }
    else if (t.def.tipo === 'prestito') p = this.f.erpice === 'garonio' ? BERSAGLI.prestito.tettoia : BERSAGLI.prestito;
    if (p) mm.setMarker('truffa', p.x, p.z, '#d060ff'); else mm.setMarker('truffa', null);
    return mm;
  }

  _aggiornaAzione(dt) {
    const a = this.azione; if (!a) return;
    const P = this.game.player.group.position;
    if (Math.hypot(P.x - a.x, P.z - a.z) > 0.8) { this.azione = null; this.game.ui.toast('Interrotto.', 'small'); return; }
    a.t += dt;
    this.game.actT = 0.15; this.game.actName = 'attack'; this.game.idle = 0;
    if (a.tipo === 'motosega' && (this._t % 0.5) < dt) this._suono('motosega');
    if (a.t >= a.sec) { this.azione = null; a.fine(); }
  }

  // battute dei vicini quando Garonio passa vicino
  _battute() {
    const g = this.game, P = g.player.group.position, t = this.attiva();
    for (const [vic, V] of Object.entries(VICINI)) {
      const p = g.png.dove(vic); if (!p) continue;
      if (Math.hypot(P.x - p.x, P.z - p.z) > 5.5) continue;
      if (performance.now() - (this._bark[vic] || -1e9) < 75000) continue;
      this._bark[vic] = performance.now();
      const odio = g.png.amicizia(vic) <= -30;
      const frase = odio ? pick(V.odio) : (t?.def.vicino === vic && t.a.stato === 'attiva' ? pick(V.battuteTruffa) : pick(V.battute));
      g.ui.toast(`${PNG[vic].nome}: «${frase}»`, 'small');
    }
  }

  _muoviGuardie(dt, h, busy) {
    const g = this.game, P = g.player.group.position;
    for (const gu of this.guardie) {
      if (gu.tipo === 'vicino') {
        const p = g.png.dove(gu.vicino);
        gu.attivo = !!p; if (p) { gu.x = p.x; gu.z = p.z; }
        continue;
      }
      if (gu.tipo === 'casa') { gu.attivo = h >= 20 || h < 6; continue; }
      if (gu.tipo === 'garzone') {
        const on = h >= gu.def.ore[0] && h < gu.def.ore[1];
        gu.attivo = on; gu.actor.group.visible = on;
        if (!on) continue;
        let moving = false;
        if (!busy && (gu.allerta || 0) < 0.4) {
          const [tx, tz] = gu.def.giro[gu.giroI];
          const dx = tx - gu.x, dz = tz - gu.z, d = Math.hypot(dx, dz);
          if (d < 0.1) gu.giroI = (gu.giroI + 1) % gu.def.giro.length;
          else { const st = Math.min(d, 1.1 * dt); gu.x += dx / d * st; gu.z += dz / d * st; moving = true; gu.dir = dx > 0 ? 1 : -1; gu.base = Math.atan2(dz, dx); }
        } else gu.dir = P.x > gu.x ? 1 : -1;
        gu.walkT += dt * 6;
        gu.actor.group.position.set(gu.x, 0, gu.z);
        gu.actor.setFrame((gu.dir > 0 ? 0 : 3) + (moving ? 1 + (Math.floor(gu.walkT) % 2) : 0));
        continue;
      }
      // cane: sonnecchia a cicli, se si allarma sta sveglio e abbaia
      const c = gu.def, ciclo = (this._t / 14 + gu.fase) % 1;
      const notteDorme = this.f.voci.caneDorme === gu.vicino + ':' + this.s.day && (h >= 20 || h < 6);
      gu.dorme = notteDorme || ((gu.allerta || 0) < 0.3 && ciclo < c.dorme);
      gu.attivo = true;
      if (gu.dorme) gu.actor.setFrame(gu.dir > 0 ? 2 : 5);
      else {
        if ((gu.allerta || 0) > 0.3) gu.dir = P.x > gu.x ? 1 : -1;
        else if (Math.floor(this._t / 3 + gu.fase) % 4 === 0) gu.dir = -gu.dir;
        gu.walkT += dt * 3;
        gu.actor.setFrame((gu.dir > 0 ? 0 : 3) + (Math.floor(gu.walkT) % 2));
      }
    }
  }

  // ---------- vista, udito, sospetto ----------
  _rumore() {
    const g = this.game, v = g.vehicles.driving;
    let r = RUMORE.cammina;
    if (this.azione) r = RUMORE[this.azione.tipo] ?? 1;
    else if (this.pompa) r = RUMORE.turbina;
    else if (v) r = Math.abs(v.speed) > 0.3 ? RUMORE.trattore * (v.kind === 'trattore' ? 1 : 0.6) : RUMORE.turbina * 0.5;
    else if (g.moving && g.input.run) r = RUMORE.corre;
    if (this.f.erpice === 'garonio') r += 1;
    return r * Math.max(0.4, 1 - 0.12 * g.prog.grado('furbizia'));
  }

  _sorveglia(dt, notte) {
    const g = this.game, t = this.attiva(), P = g.player.group.position;
    const truffa = t && t.a.stato === 'attiva' ? t.def : null;
    const vic = truffa?.vicino, V = vic && VICINI[vic], T = V?.terreno;
    const dentro = T && P.x >= T.x0 && P.x <= T.x1 && P.z >= T.z0 && P.z <= T.z1;
    const vicino = T && P.x >= T.x0 - 14 && P.x <= T.x1 + 14 && P.z >= T.z0 - 10 && P.z <= T.z1 + 14;
    const rumore = this._rumore();
    let max = 0, chi = null;
    for (const gu of this.guardie) {
      const mostra = gu.vicino === vic && vicino && gu.attivo;
      if (!mostra) { gu.cono.visible = gu.ear.visible = gu.segno.visible = false; gu.allerta = 0; continue; }
      const def = gu.def;
      const calmo = this.f.calmi[vic] === this.s.day || (gu.tipo === 'cane' && this.f.carezze?.[vic] === this.s.day)
        || (this.f.voci.assente === vic + ':' + this.s.day && (gu.tipo === 'casa' || gu.tipo === 'vicino') && notte);
      let [R, half] = def.vista;
      if (notte) R *= SOSPETTO.notteVista;
      if (gu.dorme) R = 0;
      let udito = def.udito + rumore;
      if (!notte) udito *= SOSPETTO.giornoUdito;
      if (gu.dorme) udito *= 0.35;
      // sguardo: si guarda intorno, oppure fissa Garonio se è allarmato
      const dx = P.x - gu.x, dz = P.z - gu.z, dist = Math.hypot(dx, dz), verso = Math.atan2(dz, dx);
      const base = gu.tipo === 'garzone' && gu.base != null ? gu.base : def.sguardo;
      const target = (gu.allerta || 0) > 0.35 ? verso : base + Math.sin(this._t * 0.6 + gu.fase) * (def.giro || 50) * DEG;
      gu.look += wrapA(target - gu.look) * Math.min(1, dt * 3);
      const visto = R > 0 && dist < R && Math.abs(wrapA(verso - gu.look)) < half * DEG;
      const sentito = dist < udito;
      let rate = 0;
      if (!calmo && dentro) {
        if (visto) rate = SOSPETTO.vista * (1 - 0.5 * dist / R);
        else if (sentito) rate = SOSPETTO.udito * (1 + rumore / 5);
        if (g.png.amicizia(vic) <= -30) rate *= SOSPETTO.odio;
      }
      gu.allerta = clamp((gu.allerta || 0) + (rate ? rate * dt : -SOSPETTO.cala * dt), 0, 1);
      if (gu.allerta > max) { max = gu.allerta; chi = gu; }
      // grafica
      gu.cono.visible = R > 0 && !calmo;
      gu.cono.position.set(gu.x, 0.05, gu.z); gu.cono.scale.set(R, 1, R);
      gu.cono.rotation.y = -gu.look;
      gu.cono.geometry !== gu._geo && this._geoCono(gu, half);
      gu.cono.material.color.set(gu.allerta > 0.6 ? 0xff5040 : gu.allerta > 0.25 ? 0xffa030 : 0xffe060);
      gu.cono.material.opacity = 0.16 + gu.allerta * 0.2;
      gu.ear.visible = !calmo; gu.ear.position.set(gu.x, 0.04, gu.z); gu.ear.scale.set(udito, 1, udito);
      gu.ear.material.opacity = sentito && dentro ? 0.55 : 0.22;
      const alto = gu.tipo === 'cane' ? 1.1 : gu.tipo === 'casa' ? 3.4 : 2.4;
      gu.segno.visible = gu.allerta > 0.2;
      gu.segno.material.map = gu.segnoTex[gu.allerta > 0.6 ? '!' : '?'];
      gu.segno.position.set(gu.x + 0.3, alto, gu.z);
      if (gu.tipo === 'cane' && gu.allerta > 0.45 && (this._t % 0.9) < dt) this._suono('abbaia');
    }
    this.sospetto[vic] = max;
    if (truffa) this._hudShow({ truffa, V, sospetto: max, chi, rumore, dentro, notte });
    else this._hudShow(null);
    if (max >= 1 && chi) this.scoperta(vic, chi);
  }
  _geoCono(gu, half) {
    gu.cono.geometry.dispose();
    gu.cono.geometry = new THREE.CircleGeometry(1, 18, -half * DEG, half * 2 * DEG).rotateX(-Math.PI / 2);
    gu._geo = gu.cono.geometry;
  }

  // ---------- scoperta, dialogo e rissa ----------
  async scoperta(vic, chi) {
    if (this._scena) return;
    this._scena = true;
    const g = this.game, s = this.s, V = VICINI[vic], nome = PNG[vic].nome, t = this.attiva();
    this.azione = null; this._fermaPompa(true);
    for (const gu of this.guardie) gu.allerta = 0;
    this.sospetto[vic] = 0;
    g._wake?.(); g.idle = 0;
    g.audio.sfx('bad'); g.ui.shake();
    const chiNome = chi.tipo === 'cane' ? `${chi.def.nome} abbaia come un matto!` : chi.tipo === 'garzone' ? `${chi.def.nome.split(',')[0]} ti ha visto e corre a chiamare.` : chi.tipo === 'casa' ? `Si accende una luce nella cascina. Esce ${nome} in pigiama.` : `${nome} ti ha visto!`;
    const grado = g.prog.grado('parlantina');
    const pct = Math.round(clamp(0.3 + 0.15 * grado, 0, 0.85) * 100);
    const giaCreduto = this.f.creduto[vic] === s.day;
    let esito = null;
    await g.ui.dialog([
      { name: 'Guai!', text: chiNome },
      { who: vic, name: nome, text: pick(V.scoperta), choices: [
        { label: 'Chiedi scusa (la missione salta)', fn: () => { esito = 'scusa'; return [{ who: vic, name: nome, text: V.perdonato }]; } },
        { label: giaCreduto ? 'Inventa una scusa (non ci casca due volte)' : `Inventa una scusa (${pct}%)`, disabled: giaCreduto, fn: () => {
          const ok = Math.random() * 100 < pct;
          esito = ok ? 'bugia' : 'rissa';
          const scusa = { who: 'garonio', name: 'Garonio', text: pick(SCUSE) };
          return ok ? [scusa, { who: vic, name: nome, text: pick(V.creduto) }]
            : [scusa, { who: vic, name: nome, text: pick(V.nonCreduto) }, { who: vic, name: nome, text: V.rissa }];
        } },
        { label: 'Scappa!', fn: () => { esito = 'scappa'; return null; } },
        { label: 'Fatti sotto! (rissa)', fn: () => { esito = 'rissa'; return [{ who: vic, name: nome, text: V.rissa }]; } },
      ] },
    ]);
    g.emit('truffaScoperta', { vicino: vic, missione: t?.id, esito });
    let fallita = false;
    if (esito === 'scusa') { g.png.cambiaAmicizia(vic, -10); s.stress = clamp(s.stress + 4, 0, 100); fallita = true; }
    else if (esito === 'bugia') { g.png.cambiaAmicizia(vic, -3); this.f.creduto[vic] = s.day; g.ui.toast(`${nome} ci è cascato. Per ora. Stai più attento.`, 'good'); }
    else if (esito === 'scappa') { g.png.cambiaAmicizia(vic, -15); fallita = true; g.ui.toast(`Scappi a gambe levate. ${nome} urla il tuo nome a tutta la campagna.`, 'bad'); }
    else if (esito === 'rissa') {
      const h = (s.minutes / H) % 24;
      const nemici = V.nemici.filter(id => !(id.startsWith('garzone') && (h < V.garzone?.ore[0] || h >= V.garzone?.ore[1])));
      const res = await g.combat.start({ enemies: nemici, place: 'campo' });
      if (res === 'win') {
        g.png.cambiaAmicizia(vic, -20);
        this.f.calmi[vic] = s.day;
        await g.ui.dialog([{ who: vic, name: nome, text: pick(V.sconfitto) }]);
        g.ui.toast('Per oggi non ti daranno più fastidio. Finisci il lavoretto.', 'good');
      } else {
        g.png.cambiaAmicizia(vic, -12); fallita = true;
        if (res === 'lose') { this._scena = false; if (t) g.quests.fallisci(t.id); this._multa(vic); await g.mountain('sconfitta', 20); return; }
      }
    }
    if (esito !== 'bugia') this._multa(vic);
    this._scena = false;
    if (fallita && t) {
      g.quests.fallisci(t.id);
      await g.mountain('missione', 20, pick(MOUNTAIN_TRUFFA));
    }
  }

  // multa: se la Vigilessa (src/vigilessa.js) è in giro e ti vede, o è abbastanza vicina da sentire il baccano
  _multa(vic) {
    const g = this.game, P = g.player.group.position, V = g.vigilessa;
    const p = g.png.dove('vigilessa');
    const vicina = p && Math.hypot(p.x - P.x, p.z - P.z) < 30;
    if (V?.multa) { if (vicina || V.vede?.(P.x, P.z)) V.multa('truffa'); return; }
    if (!vicina) return;   // segnaposto se il modulo della Vigilessa non c'è
    this.s.money = Math.max(0, this.s.money - MULTA_TRUFFA);
    g.emit('multa', { importo: MULTA_TRUFFA, tipo: 'truffa', pagata: true });
    g.ui.toast(`La Vigilessa ha sentito tutto: multa di ${MULTA_TRUFFA}€.`, 'bad');
  }

  // ---------- nuovo giorno ----------
  _nuovoGiorno() {
    const f = this.f, day = this.s.day;
    for (const a of this.alberi) if (a.cut && day - (f.alberi[a.id] || 0) >= BERSAGLI.ricrescita) { delete f.alberi[a.id]; this._mostraAlbero(a, false); }
    // il Postino rimette a posto i paletti, se non c'è una truffa sul confine in corso
    if (f.paletti.length && this.attiva()?.def.tipo !== 'confine') {
      f.paletti = []; this.paletti.forEach(p => this._mostraPaletto(p));
    }
    // il Patata si riprende l'erpice dopo qualche giorno
    if (f.erpice === 'tettoia' && Math.random() < 0.25) { f.erpice = 'patata'; this._mostraErpice(); this.game.ui.toast('Il Patata è venuto a riprendersi l\'erpice. Ha lasciato una patata come ricevuta.', 'small'); this.game.prog.dai('patata', 1); }
    this._bark = {};
  }

  // ---------- scelte in più nel dialogo dei vicini ----------
  _scelteVicini() {
    const g = this.game, C = COMMERCI;
    const odia = id => g.png.amicizia(id) <= -30;
    const chiuso = id => ({ label: `🚪 ${PNG[id].nome} non ti vende niente: sei nella sua lista nera`, disabled: true, fn: null });
    const pace = id => {
      const doni = ['mais', 'pomodoro', 'uova', 'patata'].filter(o => this.s.inv[o] > 0);
      if (g.png.amicizia(id) >= 0 || !doni.length) return [];
      const o = doni[0];
      return [{ label: `🎁 Fai pace: regala ${OGGETTI[o].icona} (amicizia +6)`, fn: () => {
        g.prog.togliOggetto(o); g.png.cambiaAmicizia(id, 6);
        return [{ who: id, name: PNG[id].nome, text: pick(VICINI[id].pace) }];
      } }];
    };
    const T = (id, text) => [{ who: id, name: PNG[id].nome, text }];

    g.png.aggiungiScelte('patata', () => {
      if (odia('patata')) return [chiuso('patata'), ...pace('patata')];
      const c = C.patata, s = this.s, out = [];
      out.push({ label: `🥔 Compra ${c.patate.n} patate (${c.patate.prezzo}€)`, disabled: s.money < c.patate.prezzo, fn: () => {
        s.money -= c.patate.prezzo; g.prog.dai('patata', c.patate.n); g.audio.sfx('coin');
        return T('patata', pick(VICINI.patata.vendita));
      } });
      if (this.f.bollita !== s.day) out.push({ label: '🍲 Assaggia una patata bollita (gratis)', fn: () => {
        this.f.bollita = s.day; s.tired = clamp(s.tired - 10, 0, 100); g.png.cambiaAmicizia('patata', 1); s.minutes += 10;
        return T('patata', pick(VICINI.patata.bollita));
      } });
      return [...out, ...pace('patata')];
    });

    g.png.aggiungiScelte('postino', () => {
      if (odia('postino')) return [chiuso('postino'), ...pace('postino')];
      const s = this.s;
      return [{ label: `📰 Senti le voci del paese (${C.postino.voce}€)`, disabled: s.money < C.postino.voce, fn: () => {
        s.money -= C.postino.voce; s.minutes += 10;
        const v = pick(VOCI);
        if (v.effetto?.assente) this.f.voci.assente = v.effetto.assente + ':' + s.day;
        if (v.effetto?.caneDorme) this.f.voci.caneDorme = v.effetto.caneDorme + ':' + s.day;
        return T('postino', v.testo);
      } }, ...pace('postino')];
    });

    g.png.aggiungiScelte('frank', () => {
      if (odia('frank')) return [chiuso('frank'), ...pace('frank')];
      const s = this.s, n = s.inv.mais || 0;
      const out = [];
      if (n > 0) out.push({ label: `🌽 Vendi ${n} pannocchie a Frank (${C.frank.mais}€ l'una)`, fn: () => {
        const tot = n * C.frank.mais; g.prog.togliOggetto('mais', n); s.money += tot; g.audio.sfx('coin');
        g.png.cambiaAmicizia('frank', 2);
        return T('frank', `${pick(VICINI.frank.vendita)} (+${tot}€)`);
      } });
      return [...out, ...pace('frank')];
    });
  }

  // ---------- suoni (sintetizzati come quelli di src/audio.js) ----------
  _suono(tipo) {
    const A = this.game.audio; if (!A?.enabled || !A.ctx || !A._note) return;
    const t = A.ctx.currentTime, n = (m, dt, d, type = 'square', v = 0.06) => A._note(m, t + dt, d, type, v);
    if (tipo === 'abbaia') { n(57, 0, 0.07, 'square', 0.07); n(52, 0.09, 0.09, 'square', 0.06); }
    else if (tipo === 'motosega') { for (let i = 0; i < 5; i++) n(38 + (i % 2) * 5, i * 0.09, 0.09, 'sawtooth', 0.07); }
    else if (tipo === 'tonfo') { n(28, 0, 0.3, 'sawtooth', 0.1); n(33, 0.05, 0.2, 'square', 0.06); }
  }

  // ---------- pannello della truffa ----------
  _hud() {
    const st = document.createElement('style');
    st.textContent = `
#truffa { position: absolute; top: 12px; left: 50%; transform: translateX(-50%); width: 250px; font-size: 12px; }
#truffa[hidden] { display: none; }
#truffa b { color: #e0a0ff; font-size: 11px; text-transform: uppercase; display: block; margin-bottom: 3px; }
#truffa .tr { display: grid; grid-template-columns: 62px 1fr; align-items: center; gap: 6px; margin: 3px 0; }
#truffa .track .fill { transition: width .15s; }
#truffa .sus .fill { background: #ffb030; } #truffa .sus.hot .fill { background: #ff4a3a; }
#truffa .rum .fill { background: #80c0ff; } #truffa .prg .fill { background: #80e080; }
#truffa .nota { opacity: .85; font-size: 11px; margin-top: 2px; }
@media (max-width: 640px) { #truffa { left: auto; right: 8px; transform: none; top: auto; bottom: 236px; width: 172px; font-size: 10px; padding: 5px 7px; }
  #truffa .tr { grid-template-columns: 48px 1fr; } }
body.touch #truffa { left: auto; right: 8px; transform: none; top: auto; bottom: 236px; width: 172px; font-size: 10px; padding: 5px 7px; }
body.touch #truffa .tr { grid-template-columns: 48px 1fr; }
body.in-battle #truffa { display: none; }`;
    document.head.appendChild(st);
    this.el = document.createElement('div');
    this.el.id = 'truffa'; this.el.className = 'panel'; this.el.hidden = true;
    document.getElementById('hud')?.appendChild(this.el);
  }

  _hudShow(d) {
    if (!this.el) return;
    if (!d && !this.azione) { if (!this.el.hidden) this.el.hidden = true; this._hudHtml = ''; return; }
    const bar = (cls, lab, v) => `<div class="tr ${cls}"><label>${lab}</label><div class="track"><div class="fill" style="width:${Math.round(clamp(v, 0, 1) * 100)}%"></div></div></div>`;
    let html = '';
    if (d) {
      const t = this.attiva(), q = this.game.quests.attive().find(x => x.id === t?.id);
      html += `<b>🤫 ${d.truffa.titolo}</b>`;
      if (d.truffa.tipo === 'acqua') html += bar('prg', 'Acqua', this.f.pompa / DURATE.turbinaMinuti);
      else if (q) html += bar('prg', `Fatto ${q.progresso}/${q.n}`, q.progresso / q.n);
      if (d.dentro) {
        html += bar(`sus${d.sospetto > 0.6 ? ' hot' : ''}`, '👁 Sospetto', d.sospetto);
        html += bar('rum', '🔊 Rumore', d.rumore / 11);
      }
      const nota = !d.dentro ? `Sei fuori dal terreno ${d.truffa.vicino === 'frank' ? 'del ranch' : 'della cascina'}.` : d.notte ? 'Notte: vedono meno, ma il silenzio fa sentire tutto.' : 'Di giorno ti vedono da lontano. Meglio la notte (dopo le 20).';
      html += `<div class="nota">${nota}</div>`;
    }
    if (this.azione) html += bar('prg', this.azione.tipo === 'motosega' ? '🪚 Taglio' : '✋ Lavoro', this.azione.t / this.azione.sec);
    if (html !== this._hudHtml) { this.el.innerHTML = html; this._hudHtml = html; }
    this.el.hidden = false;
  }
}
