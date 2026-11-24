// Diario di Garonio (GDD 22): la freccia verso il lavoro scelto, i collezionabili nascosti e i trofei.
//
// - FRECCIA: nel menu (J) ogni lavoro ha il pulsante 📍. Quello scelto viene indicato da una freccia a terra
//   attorno a Garonio, da un segnalino che rimbalza sopra la meta e da una linea sulla minimappa.
//   Senza scelta (automatico) segue la missione del Gigante, poi il primo lavoretto da ritirare.
// - COLLEZIONABILI: tappi, santini e figurine sparsi sulla mappa (src/data/diario.js). Luccicano solo da vicino;
//   il Consulente, per 3€, dice dov'è il più vicino. Ogni collezione completa regala un portafortuna.
// - TROFEI: obiettivi con contatori presi dagli eventi del gioco (es. «Scansafatiche d'oro»: dormi 50 notti).
//   Scheda 🏆 nel menu.
//
// API (game.diario):
//   segui(tipo, id?)   tipo: 'auto' | 'gigante' | 'quest' | 'nascosto' | 'dritta' | 'off'
//   meta()             { x, z, nome } verso cui punta la freccia, o null
//   conta(chiave, n)   alza un contatore dei trofei (per altri lavori: es. conta('gare', 1))
//   trofeo(id)         true se preso
// Stato salvato: s.flags.bussola (s.flags.diario è il registro degli avvisi di src/menu.js). Eventi mandati: trofeo { id }, collezionabile { id, collezione, completa }.
import * as THREE from 'three';
import * as PIX from './pixel.js';
import { BUILDINGS } from './map.js';
import { PNG } from './data/png.js';
import { VESTITI } from './data/armi.js';
import { LUOGHI, DOVE_MISSIONE, DOVE_OGGETTO, DOVE_EVENTO, COLLEZIONI, DRITTA_COLLEZIONI as DR, TROFEI, TESTI_DIARIO as T } from './data/diario.js';
import { pick, fill } from './racconto.js';
import { pezzo as pezzoHD } from './hd/collezionabili.js';

const H = 60;
const PEZZI = Object.entries(COLLEZIONI).flatMap(([c, d]) => d.pezzi.map(p => ({ ...p, coll: c })));

function el(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  for (const k of kids || []) if (k) e.appendChild(k);
  return e;
}

// ---------- disegni ----------
function frecciaCanvas() {
  const [c, g] = PIX.makeCanvas(32, 32);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  // freccia verso destra (+x), bordo scuro, corpo giallo
  for (let i = 0; i < 12; i++) P('#1a1420', 16 + i, 4 + i, 2, 24 - 2 * i);
  P('#1a1420', 3, 11, 15, 10);
  for (let i = 0; i < 10; i++) P('#ffd84a', 17 + i, 7 + i, 1, 18 - 2 * i);
  P('#ffd84a', 5, 13, 13, 6);
  P('#fff6c0', 5, 13, 13, 2);
  return c;
}
function segnalinoCanvas() {
  const [c, g] = PIX.makeCanvas(14, 16);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#1a1420', 3, 0, 8, 7);
  for (let i = 0; i < 7; i++) P('#1a1420', i, 6 + i, 14 - 2 * i, 1);
  P('#ffd84a', 4, 1, 6, 6);
  for (let i = 0; i < 6; i++) P('#ffd84a', 1 + i, 7 + i, 12 - 2 * i, 1);
  P('#fff6c0', 4, 1, 2, 5);
  return c;
}
// pezzo da collezione a terra: due fotogrammi (luccichio acceso/spento), disegno HD per ogni pezzo (src/hd/collezionabili.js)
const pezzoCanvas = (p, luce) => pezzoHD(p.coll, p.id, luce);
const albumIcona = {};
function iconaAlbum(coll, id) { return (albumIcona[id] ??= pezzoHD(coll, id, false).toDataURL()); }

export class Diario {
  constructor(game) {
    this.game = game;
    this.t = 0; this.metaT = 0; this._meta = null; this._arrivo = null; this._dozing = false;
    this.pezzi = [];  // sprite dei collezionabili
    // i portafortuna delle collezioni diventano vestiti veri (letti da prog.bonus())
    for (const c of Object.values(COLLEZIONI)) {
      const p = c.premio; VESTITI[p.id] ??= { nome: p.nome, slot: p.slot, bonus: p.bonus, desc: p.desc, collezione: true };
    }
  }
  get s() { return this.game.s; }
  get st() {
    const f = this.s.flags ??= {};
    return f.bussola ??= { segui: { tipo: 'auto' }, cont: {}, trofei: {}, pezzi: {}, dritta: null };
  }

  init() {
    const g = this.game, st = this.st;
    // i salvataggi vecchi: le notti già dormite contano
    st.cont.dormito = Math.max(st.cont.dormito || 0, (this.s.day || 1) - 1);
    this._eventi();
    g.moduli.push(this);
    g.bersagli.unshift(() => this._bersaglioPezzo());
    g.menu.aggiungiScheda('trofei', { icona: '🏆', nome: 'Trofei', render: m => this._scheda(m) });
    g.png.aggiungiScelte('consulente', () => [{ label: DR.label, fn: () => this._drittaConsulente() }]);
    this._crea3d();
    this._stile();
    this._controlla(true);
  }

  // ======================================================================
  //  FRECCIA
  // ======================================================================
  segui(tipo, id = null) {
    const st = this.st;
    st.segui = { tipo, id };
    this._arrivo = null; this.metaT = 0;
    this._aggiornaMeta();
    const m = this._meta;
    if (st.segui.tipo === 'off') return '📍 Freccia spenta.';
    return m ? `📍 Seguo: ${m.nome}` : T.nessuno;
  }
  segue(tipo, id = null) { const sg = this.st.segui; return sg.tipo === tipo && (id == null || sg.id === id); }
  meta() { return this._meta; }

  _aggiornaMeta() {
    const sg = this.st.segui;
    let m = null;
    try {
      if (sg.tipo === 'gigante') m = this._doveGigante();
      else if (sg.tipo === 'quest') m = this._doveQuest(sg.id);
      else if (sg.tipo === 'nascosto') m = this._doveNascosto();
      else if (sg.tipo === 'dritta') m = this._doveDritta();
      else if (sg.tipo === 'off') m = null;
      // la cosa seguita è finita: si torna all'automatico
      if (!m && sg.tipo !== 'off' && sg.tipo !== 'auto' && !this._ancoraValido(sg)) this.st.segui = { tipo: 'auto' };
      if (this.st.segui.tipo === 'auto') m = this._doveAuto();
    } catch (e) { console.error('[diario]', e); m = null; }
    this._meta = m;
  }

  _ancoraValido(sg) {
    if (sg.tipo === 'gigante') { const m = this.s.mission; return !!m && !m.done && !m.failed; }
    if (sg.tipo === 'quest') return !!this.s.quests?.attive?.[sg.id];
    if (sg.tipo === 'nascosto') return !!this.game.consulente?.oggi?.();
    if (sg.tipo === 'dritta') return !!this._doveDritta();
    return false;
  }

  _doveAuto() {
    const m = this._doveGigante(); if (m) return m;
    const q = this.game.quests;
    for (const a of q?.attive?.() || []) if (a.stato === 'pronta') { const d = this._doveQuest(a.id); if (d) return d; }
    return this._doveDritta();
  }

  _luogo(id) { const l = LUOGHI[id]; return l && { x: l.x, z: l.z, nome: l.nome }; }

  _doveGigante() {
    const m = this.s.mission; if (!m || m.done || m.failed) return null;
    const d = DOVE_MISSIONE[m.stat];
    if (!d) return this._png('gigante');
    const v = this.game.vehicles?.driving;
    if (d.trattore && this.game.attrezzi && v?.kind !== 'trattore') { const t = this._luogo('tettoia'); t.nome += ' (prendi un trattore)'; return t; }
    return this._luogo(d.luogo);
  }

  _doveQuest(id) {
    const q = this.game.quests, def = q?.defs?.[id], a = this.s.quests?.attive?.[id];
    if (!def || !a) return null;
    const o = def.obiettivo || {};
    if (a.stato === 'pronta') return this._png(def.da);
    if (o.consegna) {
      const manca = Object.entries(o.consegna).find(([it, n]) => (this.s.inv[it] || 0) < n);
      if (!manca) return this._png(o.a || def.da);
      const l = DOVE_OGGETTO[manca[0]];
      return l ? this._luogo(l) : this._png(def.da);
    }
    if (o.parla) return this._png(o.parla);
    if (def.dove) return { x: def.dove.x, z: def.dove.z, nome: def.dove.nome || def.titolo };
    const vic = o.filtro?.vicino; if (vic && LUOGHI[vic]) return this._luogo(vic);
    if (o.evento === 'nemicoSconfitto' && o.filtro?.id && o.filtro.id !== 'nutria') return null;
    const l = DOVE_EVENTO[o.evento];
    return l ? this._luogo(l) : null;
  }

  _doveNascosto() {
    const o = this.game.consulente?.oggi?.(); if (!o) return null;
    return { x: o.x, z: o.z, nome: `${o.dove.toLowerCase()} (dritta del Consulente)` };
  }

  _doveDritta() {
    const d = this.st.dritta; if (!d || this.st.pezzi[d]) return null;
    const p = PEZZI.find(x => x.id === d); if (!p) return null;
    return { x: p.x, z: p.z, nome: `${COLLEZIONI[p.coll].nome.toLowerCase()} (dritta del Consulente)` };
  }

  // dov'è un personaggio: se non è in giro, dove sarà (o la porta dell'edificio dove sta)
  _png(id) {
    if (id === 'gigante') { const p = this.game.gigante?.group.position; return p && { x: p.x, z: p.z, nome: 'il Gigante' }; }
    const def = PNG[id]; if (!def) return null;
    const nome = def.nome;
    const vis = this.game.interni?.attivo ? null : this.game.png?.dove(id);
    if (vis) return { x: vis.x, z: vis.z, nome };
    const h = (this.s.minutes / H) % 24, posti = def.posti || [];
    const p = posti.find(p => h >= p.ore[0] && h < p.ore[1]) || [...posti].sort((a, b) => ((a.ore[0] - h + 24) % 24) - ((b.ore[0] - h + 24) % 24))[0];
    if (!p) return null;
    if (p.interno) {
      const b = BUILDINGS.find(b => b.id === p.interno); if (!b) return null;
      return { x: b.x0 + b.w / 2, z: b.z0 + b.d + 0.6, nome: `${nome} (${b.label?.toLowerCase() || p.interno})` };
    }
    return { x: p.x, z: p.z, nome };
  }

  // ---------- 3D e minimappa ----------
  _crea3d() {
    const W = this.game.world;
    const tex = PIX.toTexture(frecciaCanvas());
    this.freccia = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.1).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, alphaTest: 0.3, depthWrite: false, opacity: 0.92 }));
    this.freccia.position.y = 0.07; this.freccia.visible = false; this.freccia.renderOrder = 5;
    W.scene.add(this.freccia);
    this.segnalino = W.sprite(segnalinoCanvas(), { w: 0.7, h: 0.8, lit: false });
    this.segnalino.visible = false; this.segnalino.renderOrder = 6;
    W.scene.add(this.segnalino);
    // collezionabili
    for (const p of PEZZI) {
      if (this.st.pezzi[p.id]) continue;
      const a = W.actor([pezzoCanvas(p, false), pezzoCanvas(p, true)], { w: 0.75, h: 0.75, shadow: 0.22 });
      a.group.position.set(p.x, 0, p.z); a.group.visible = false;
      this.pezzi.push({ p, a });
    }
  }

  _mm() { return this.game.minimap || window.__garonio?.minimap; }

  // chiamato dal ciclo dei moduli (solo quando si gioca, non durante i dialoghi)
  update(dt) {
    const g = this.game;
    // pisolini
    if (g.dozing && !this._dozing) this.conta('pisolini', 1);
    this._dozing = g.dozing;
  }

  // chiamato sempre (anche durante dialoghi e menu)
  animate(dt) {
    const g = this.game; if (!g.player || !g.s) return;
    this.t += dt;
    this.metaT -= dt;
    if (this.metaT <= 0) { this.metaT = 0.3; this._aggiornaMeta(); }
    const P = g.player.group.position, m = this._meta;
    const dentro = !!g.interni?.attivo, nascosta = dentro || g.combat?.active;
    const mm = this._mm();
    if (!m) {
      this.freccia.visible = false; this.segnalino.visible = false;
      mm?.setRotta?.(null);
    } else {
      const dx = m.x - P.x, dz = m.z - P.z, d = Math.hypot(dx, dz);
      const r = g.vehicles?.driving ? 2.3 : 1.3;
      const vicino = d < 2.2;
      this.freccia.visible = !nascosta && !vicino;
      if (this.freccia.visible) {
        const k = 1 + Math.sin(this.t * 6) * 0.08;
        this.freccia.position.set(P.x + dx / d * r * k, 0.07, P.z + dz / d * r * k);
        this.freccia.rotation.y = Math.atan2(-dz, dx);
      }
      this.segnalino.visible = !nascosta && d < 45;
      this.segnalino.position.set(m.x, 2.1 + Math.sin(this.t * 3.5) * 0.18, m.z);
      mm?.setRotta?.(m.x, m.z, `📍 ${m.nome} · ${Math.round(d)} m`);
      const key = `${m.nome}|${Math.round(m.x)}|${Math.round(m.z)}`;
      if (vicino && !dentro && this._arrivo !== key) { this._arrivo = key; g.ui.float(fill(T.arrivato, { nome: m.nome })); }
      if (d > 6 && this._arrivo === key) this._arrivo = null;
    }
    // collezionabili: si vedono solo da vicino
    const fr = (this.t * 2.5 | 0) % 3 === 0 ? 1 : 0;
    for (const c of this.pezzi) {
      const vis = !dentro && Math.hypot(c.p.x - P.x, c.p.z - P.z) < (this.st.dritta === c.p.id ? 30 : 9);
      c.a.group.visible = vis;
      if (vis) { c.a.setFrame(fr); c.a.spr.position.y = 0.05 + Math.abs(Math.sin(this.t * 3 + c.p.x)) * 0.12; }
    }
  }

  // ======================================================================
  //  COLLEZIONABILI
  // ======================================================================
  _bersaglioPezzo() {
    const g = this.game; if (g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position;
    const c = this.pezzi.find(c => Math.hypot(c.p.x - P.x, c.p.z - P.z) < 1.1);
    if (!c) return null;
    return { label: 'Raccogli: qui luccica qualcosa', fn: () => this._raccogli(c) };
  }

  _raccogli(c) {
    const g = this.game, st = this.st, p = c.p, C = COLLEZIONI[p.coll];
    st.pezzi[p.id] = this.s.day;
    c.a.remove(); this.pezzi.splice(this.pezzi.indexOf(c), 1);
    if (st.dritta === p.id) { st.dritta = null; this._mm()?.setMarker('dritta', null); }
    const n = C.pezzi.filter(x => st.pezzi[x.id]).length, tot = C.pezzi.length;
    g.audio.sfx('coin'); g._xp?.(3);
    g.ui.toast(`${fill(T.pezzo, { icona: C.icona, nome: p.nome, n, tot })} · ${p.testo}`, 'good');
    this.conta('coll_' + p.coll, 0);
    const completa = n >= tot;
    if (completa) {
      g.prog.daiVestito(C.premio.id);
      setTimeout(() => { g.ui.toast(fill(T.collezione, { icona: C.icona, nome: C.nome, premio: C.premio.nome }), 'good'); g.audio.sfx('level'); }, 1200);
    }
    g.emit('collezionabile', { id: p.id, collezione: p.coll, completa });
    this._controlla();
  }

  _drittaConsulente() {
    const g = this.game, s = this.s, st = this.st, P = g.player.group.position;
    const who = { who: 'consulente', name: PNG.consulente?.nome || 'Il Consulente' };
    const liberi = PEZZI.filter(p => !st.pezzi[p.id]);
    if (!liberi.length) return [{ ...who, text: DR.finiti }];
    if (s.money < DR.prezzo) { g.audio.sfx('bad'); return [{ ...who, text: 'Le dritte costano. Torna quando hai qualche euro.' }]; }
    s.money -= DR.prezzo; g.audio.sfx('coin');
    const p = liberi.sort((a, b) => Math.hypot(a.x - P.x, a.z - P.z) - Math.hypot(b.x - P.x, b.z - P.z))[0];
    st.dritta = p.id;
    this._mm()?.setMarker('dritta', p.x, p.z, COLLEZIONI[p.coll].colore, '★');
    this.segui('dritta');
    return [{ ...who, text: fill(pick(DR.testi), { dove: this._doveTesto(p) }) }];
  }

  _doveTesto(p) {
    const vicino = Object.values(LUOGHI).map(l => ({ l, d: Math.hypot(l.x - p.x, l.z - p.z) })).sort((a, b) => a.d - b.d)[0];
    if (vicino.d < 14) return ('vicino a ' + vicino.l.nome).replace(/^vicino a il /, 'vicino al ').replace(/^vicino a la /, 'vicino alla ').replace(/^vicino a l'/, "vicino all'").replace(/^vicino a i /, 'vicino ai ');
    const ns = p.z < 40 ? 'a nord' : p.z > 75 ? 'a sud' : '', eo = p.x < 50 ? 'verso ovest' : p.x > 110 ? 'verso est' : 'in mezzo alla campagna';
    return `${ns} ${eo}`.trim();
  }

  // ======================================================================
  //  TROFEI
  // ======================================================================
  _eventi() {
    const g = this.game, c = (k, n = 1) => () => this.conta(k, n);
    g.on('nuovoGiorno', () => { this.conta('dormito', 1); if (this.st.dritta) this._mm()?.setMarker('dritta', null); this._rimettiDritta(); });
    g.on('beccatoDormire', c('beccato'));
    g.on('nemicoSconfitto', d => { this.conta('nemici', 1); if (/nutria/.test(d?.id || '')) this.conta('nutrie', 1); });
    g.on('azione', d => { if (d?.tipo === 'uovo') this.conta('uova', 1); });
    g.on('raccolto', c('raccolti'));
    g.on('missioneFatta', c('missioni'));
    g.on('missioneFallita', c('fallite'));
    g.on('secondaria', d => { if (d?.stato !== 'fatta') return; this.conta(g.quests?.defs?.[d.id]?.truffaldina ? 'truffe' : 'secondarie', 1); });
    g.on('venduto', d => this.conta('venduto', d?.tot || 0));
    g.on('multa', c('multe'));
    g.on('riparato', c('riparazioni'));
    g.on('clacson', c('clacson'));
    g.on('bestiaSconfitta', c('bestie'));
    g.on('paradiso', d => { if (d?.tranvione) this.conta('tranvione', 1); });
    g.on('cabina', d => { if (d?.esito === 'leggendario') this.conta('cabina', 1); });
    g.on('gatto', c('gatti'));
    g.on('livello', () => this._controlla());
  }

  _rimettiDritta() {
    const p = PEZZI.find(x => x.id === this.st.dritta);
    if (p && !this.st.pezzi[p.id]) this._mm()?.setMarker('dritta', p.x, p.z, COLLEZIONI[p.coll].colore, '★');
  }

  conta(k, n = 1) {
    if (n) this.st.cont[k] = (this.st.cont[k] || 0) + n;
    this._controlla();
  }
  trofeo(id) { return !!this.st.trofei[id]; }

  _valore(t) {
    const s = this.s, st = this.st;
    if (t.conta === 'livello') return s.level;
    if (t.conta === 'giorno') return s.day;
    if (t.conta === 'trofei') return TROFEI.filter(x => x.conta !== 'trofei' && st.trofei[x.id]).length;
    if (t.conta.startsWith('coll_')) { const C = COLLEZIONI[t.conta.slice(5)]; return C ? C.pezzi.filter(p => st.pezzi[p.id]).length : 0; }
    return st.cont[t.conta] || 0;
  }
  _soglia(t) { return t.conta === 'trofei' ? TROFEI.length - 1 : t.soglia; }

  _controlla(silenzioso = false) {
    const g = this.game, st = this.st;
    if (!g.s) return;
    let nuovi = 0;
    for (const t of TROFEI) {
      if (st.trofei[t.id] || this._valore(t) < this._soglia(t)) continue;
      st.trofei[t.id] = this.s.day; nuovi++;
      const pr = t.premio || {};
      if (pr.soldi) this.s.money += pr.soldi;
      if (pr.xp) g._xp?.(pr.xp);
      g.emit('trofeo', { id: t.id });
      if (!silenzioso) {
        const extra = [pr.soldi && `+${pr.soldi}€`, pr.xp && `+${pr.xp} XP`].filter(Boolean).join(' ');
        setTimeout(() => { g.ui.toast(`${t.icona} ${fill(T.trofeo, { nome: t.nome })} ${extra}`, 'good'); g.audio.sfx('level'); }, 400 + nuovi * 900);
      }
    }
    if (nuovi && TROFEI.some(t => t.conta === 'trofei' && !st.trofei[t.id])) this._controlla(silenzioso);
  }

  // ======================================================================
  //  MENU
  // ======================================================================
  // pulsante 📍 da mettere su una nota della scheda Lavori (chiamato da src/menu.js)
  bottone(menu, tipo, id = null) {
    const espl = this.segue(tipo, id), on = espl || (this.st.segui.tipo === 'auto' && this._autoE(tipo, id));
    const b = menu._azione('📍', () => espl ? this.segui('auto') : this.segui(tipo, id), { cls: 'mn-segui' + (on ? ' on' : '') });
    b.title = espl ? 'La freccia punta qui (tocca per tornare all\'automatico)' : on ? 'La freccia punta qui (automatico)' : 'Segui con la freccia';
    return b;
  }
  _autoE(tipo, id) {
    const m = this._meta; if (!m) return false;
    const d = tipo === 'gigante' ? this._doveGigante() : tipo === 'quest' ? this._doveQuest(id) : null;
    return !!d && d.nome === m.nome && Math.abs(d.x - m.x) < 0.01 && Math.abs(d.z - m.z) < 0.01 && !this._altroPrima(tipo);
  }
  _altroPrima(tipo) { return tipo === 'quest' && !!this._doveGigante(); }

  // righe in fondo alla scheda Lavori: oggetto del Consulente, dritta sui collezionabili, freccia on/off
  righe(menu) {
    const out = [], sg = this.st.segui;
    const nasc = this._doveNascosto(), dr = this._doveDritta();
    if (nasc || dr) {
      out.push(el('div', 'mn-cartello', 'Dritte del Consulente'));
      if (nasc) out.push(el('div', 'mn-nota', null, [el('span', 'mn-face ic', '❓'), el('div', 'mn-nota-c', null, [el('b', null, nasc.nome)]), this.bottone(menu, 'nascosto')]));
      if (dr) out.push(el('div', 'mn-nota', null, [el('span', 'mn-face ic', '★'), el('div', 'mn-nota-c', null, [el('b', null, dr.nome)]), this.bottone(menu, 'dritta')]));
    }
    out.push(el('div', 'mn-cartello', 'Freccia'));
    const auto = sg.tipo === 'auto', off = sg.tipo === 'off';
    out.push(el('div', 'mn-chips mn-frecce', null, [
      menu._azione(`${auto ? '✔ ' : ''}🧭 Automatica`, () => this.segui('auto'), { cls: 'small' + (auto ? ' on' : '') }),
      menu._azione(`${off ? '✔ ' : ''}🚫 Spenta`, () => this.segui('off'), { cls: 'small' + (off ? ' on' : '') }),
    ]));
    return out;
  }

  // scheda 🏆 Trofei
  _scheda(menu) {
    const st = this.st, out = [];
    const presi = TROFEI.filter(t => st.trofei[t.id]).length;
    out.push(el('div', 'mn-cartello', `Trofei ${presi}/${TROFEI.length}`));
    const grid = el('div', 'mn-trofei');
    for (const t of TROFEI) {
      const ok = !!st.trofei[t.id], v = Math.min(this._valore(t), this._soglia(t)), sg = this._soglia(t);
      const segreto = t.segreto && !ok;
      const track = el('div', 'mn-track'); const fill_ = el('div', 'mn-fill'); fill_.style.width = `${(v / sg * 100).toFixed(1)}%`; track.appendChild(fill_);
      grid.appendChild(el('div', 'mn-trofeo' + (ok ? ' ok' : ''), null, [
        el('span', 'mn-icon', segreto ? '❓' : t.icona),
        el('div', 'mn-nota-c', null, [
          el('b', null, segreto ? '???' : t.nome),
          el('small', 'mn-desc2', segreto ? 'Trofeo segreto.' : t.desc),
          ok ? null : segreto ? null : track,
          ok ? null : segreto ? null : el('small', 'mn-num', `${Math.floor(v)}/${sg}`),
        ]),
        ok ? el('span', 'mn-timbro ok', 'PRESO') : null,
      ]));
    }
    out.push(grid);
    for (const [cid, C] of Object.entries(COLLEZIONI)) {
      const n = C.pezzi.filter(p => st.pezzi[p.id]).length;
      out.push(el('div', 'mn-cartello', `${C.icona} ${C.nome} ${n}/${C.pezzi.length}`));
      const album = el('div', 'mn-album');
      for (const p of C.pezzi) {
        const ok = st.pezzi[p.id];
        const ico = ok ? Object.assign(document.createElement('img'), { className: 'mn-figu-img', src: iconaAlbum(cid, p.id), alt: '' }) : el('span', null, '❔');
        const c = el('div', 'mn-figu' + (ok ? ' ok' : ''), null, [ico, el('small', null, ok ? p.nome : '???')]);
        if (ok) c.title = p.testo;
        album.appendChild(c);
      }
      out.push(album);
      out.push(el('small', 'mn-desc2 mn-premio', n >= C.pezzi.length ? `🎁 ${C.premio.nome}: ${C.premio.desc} (nel menu Equip)` : `🎁 Premio: ${C.premio.nome} · ${C.premio.desc}`));
    }
    out.push(el('p', 'mn-vuoto', '🔎 Il Consulente, al bar, sa dove trovarli. Per 3€.'));
    return out;
  }

  _stile() {
    if (document.getElementById('stile-diario')) return;
    const css = el('style', null, `
#menu .mn-act.mn-segui { flex: none; width: 40px; height: 40px; padding: 0; border-radius: 50%; font-size: 18px; text-align: center; margin: 0 0 0 4px; background: linear-gradient(#8a7a5a, #5a4a32); filter: grayscale(.6); }
#menu .mn-act.mn-segui.on { background: linear-gradient(#f0c040, #c08a20); filter: none; box-shadow: 0 0 0 2px #fff6c0, 0 3px 0 var(--legno-scuro, #3a2414); }
#menu .mn-frecce { gap: 6px; }
#menu .mn-frecce .mn-act { margin: 0; }
.mn-trofei { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 6px; }
.mn-trofeo { position: relative; display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; background: #f3e4c0; color: #3a2414; border: 2px solid #8a6a3a; opacity: .85; }
.mn-trofeo.ok { background: #fff2b8; border-color: #c89a20; opacity: 1; }
.mn-trofeo .mn-icon { font-size: 26px; flex: none; width: 34px; text-align: center; }
.mn-trofeo:not(.ok) .mn-icon { filter: grayscale(1); opacity: .6; }
.mn-trofeo .mn-nota-c { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.mn-trofeo .mn-track { height: 6px; }
.mn-trofeo .mn-num { font-size: 10px; opacity: .7; }
.mn-trofeo .mn-timbro { top: 4px; right: 4px; font-size: 10px; }
.mn-album { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; }
.mn-figu { display: flex; flex-direction: column; align-items: center; gap: 2px; padding: 6px 2px; border-radius: 5px; background: rgba(90,58,26,.10); border: 2px dashed rgba(90,58,26,.35); text-align: center; color: #6a4a2a; }
.mn-figu span { font-size: 20px; opacity: .45; }
.mn-figu small { font-size: 9px; line-height: 1.1; }
.mn-figu-img { width: 40px; height: 40px; image-rendering: pixelated; }
.mn-figu.ok { background: #fff2b8; color: #3a2414; border: 2px solid #c89a20; }
.mn-figu.ok span { opacity: 1; }
.mn-premio { display: block; margin: 4px 2px 0; color: #5a3a1a; }
#minimap .mm-rotta { position: absolute; left: 4px; right: 4px; bottom: 4px; padding: 1px 4px; font-size: 10px; line-height: 1.3; color: #fff6c0; background: rgba(26,20,32,.72); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; pointer-events: none; }
#minimap.big .mm-rotta { font-size: 13px; }
@media (max-width: 520px) { .mn-trofei { grid-template-columns: 1fr; } .mn-figu small { font-size: 8px; } }
`);
    css.id = 'stile-diario';
    document.head.appendChild(css);
  }
}
