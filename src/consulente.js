// Il Consulente (GDD 19.1): un caffè al giorno (2€) e lui ti dà una dritta.
// - oggetto nascosto: compare sulla mappa grande e come «?» sulla minimappa; con E lo raccogli;
// - gruppi di nemici in giro, tracce delle bestie leggendarie, avvisi su Zeno e sulla Vigilessa.
// Più dritte segui, più sale l'amicizia (livelli 1-5) e migliorano i ritrovamenti.
// Al livello 5 regala il Telefono del Consulente: i consigli arrivano per messaggio ogni mattina.
// Più Parlantina = premi più ricchi e, dal grado 2, una dritta in più insieme al caffè.
// Dati e battute: src/data/consulente.js.
//
// API (game.consulente):
//   livello()          1-5
//   consiglio()        testo di una dritta (crea l'oggetto nascosto se tocca a quello)
//   oggi()             l'oggetto nascosto di oggi { x, z, dove, nome } o null
//   bersaglio()        per il tasto E quando Garonio è sopra l'oggetto nascosto
// Eventi mandati: trovato { id, dove }, consulente { livello }
import * as PIX from './pixel.js';
import { CONSULENTE as C, LIVELLI_CONSULENTE, NASCONDIGLI, TROVATELLI, BATTUTE_CONSULENTE as T } from './data/consulente.js';
import { NEMICI, nemiciDisponibili } from './data/nemici.js';
import { ENEMIES } from './combat.js';
import { ARMI, VESTITI } from './data/armi.js';
import { pick, fill } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pesato = list => { let t = list.reduce((a, x) => a + (x.w || 1), 0) * Math.random(); return list.find(x => (t -= (x.w || 1)) < 0) || list[0]; };

const ZONE = {
  campi: 'nei campi', canale: 'lungo il canale', pollaio: 'intorno al pollaio, verso sera', bosco: 'nel bosco',
  capannoni: 'nei capannoni, di notte', silos: 'vicino ai silos', paese: 'in paese',
};

// sacchetto misterioso a terra
function sacchetto() {
  const [c, g] = PIX.makeCanvas(12, 11);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#1a1420', 2, 3, 8, 8); P('#c8a060', 3, 4, 6, 6); P('#e0c080', 3, 4, 2, 3);
  P('#1a1420', 4, 1, 4, 3); P('#8a5a2a', 5, 2, 2, 2);
  return c;
}

export class Consulente {
  constructor(game) { this.game = game; this.spr = null; }
  get s() { return this.game.s; }
  get st() { return this.s.flags.consulente; }
  get nome() { return 'Il Consulente'; }

  init() {
    const g = this.game;
    this.s.flags.consulente ??= {};
    const st = this.st;
    st.giornoCaffe ??= 0; st.seguiti ??= 0; st.oggi ??= null; st.telefono ??= false; st.voci ??= {}; st.pezzi ??= 0; st.msg ??= 0;
    g.png.aggiungiScelte('consulente', () => this._scelte());
    g.bersagli?.push(() => this.bersaglio());   // E sopra l'oggetto nascosto
    g.on('voce', d => { if (d?.bestia) this.st.voci[d.bestia] = true; });
    g.on('nuovoGiorno', () => this._nuovoGiorno());
    this._mostra();
  }

  livello(a = this.game.png.amicizia('consulente')) {
    let l = 1; C.soglie.forEach((v, i) => { if (a >= v) l = i + 1; });
    return l;
  }

  _amicizia(delta) {
    const g = this.game, prima = this.livello();
    g.png.cambiaAmicizia('consulente', delta);
    const dopo = this.livello();
    const pages = [];
    if (dopo > prima) {
      g.emit('consulente', { livello: dopo });
      g.ui.toast(`Amicizia col Consulente: livello ${dopo} «${LIVELLI_CONSULENTE[dopo - 1]}»`, 'good');
      pages.push(this._p(pick(T.livelloSu)));
      if (dopo >= C.telefonoLivello && !this.st.telefono) {
        this.st.telefono = true;
        g.prog.daiVestito('telefonoConsulente', true);
        pages.push(this._p(T.telefono), { text: '📱 Il Consulente è nella rubrica del tuo telefonino (T). Ogni mattina una dritta per SMS, e puoi chiamarlo per una dritta in più.' });
      }
    }
    return pages;
  }

  _p(text) { return { who: 'consulente', name: this.nome, text }; }

  _scelte() {
    const s = this.s, st = this.st, prezzo = C.prezzoCaffe;
    const fatto = st.giornoCaffe === s.day;
    const out = [{
      label: fatto ? 'Un altro caffè?' : `Offrigli un caffè (${prezzo}€): una dritta`,
      disabled: !fatto && s.money < prezzo,
      fn: () => fatto ? [this._p(pick(T.giaPreso))] : this._caffe(),
    }];
    const o = this.oggi();
    if (o) out.push({ label: 'Dov\'era quella cosa?', fn: () => [this._p(`${o.dove}. Il punto di domanda sulla mappa, Garonio. Premi N, se non ti fidi.`)] });
    out.push({ label: `Com'è la nostra amicizia? (livello ${this.livello()}/5)`, fn: () => [this._p(fill(T.amicizia, {
      livello: this.livello(), nome: LIVELLI_CONSULENTE[this.livello() - 1], seguiti: st.seguiti,
    }) + (this.livello() < 5 ? ` Prossimo livello: amicizia ${C.soglie[this.livello()]} (ora ${this.game.png.amicizia('consulente')}).` : ''))] });
    return out;
  }

  _caffe() {
    const g = this.game, s = this.s, st = this.st;
    s.money -= C.prezzoCaffe; st.giornoCaffe = s.day; s.minutes += C.minutiCaffe;
    s.tired = clamp(s.tired - 5, 0, 100);
    g.audio.sfx('coin');
    const pages = [this._p(pick(T.caffe)), this._p(this.consiglio())];
    if (g.prog.grado('parlantina') >= 2) pages.push(this._p(`E già che ci siamo: ${this.consiglio('avviso')}`));
    pages.push(...this._amicizia(C.amiciziaCaffe));
    return pages;
  }

  // ---------- Le dritte ----------
  consiglio(tipo = null) {
    const st = this.st, lv = this.livello();
    if (!tipo && !st.seguiti && !this.oggi()) tipo = 'oggetto';   // la prima dritta è sempre un oggetto nascosto
    if (!tipo) {
      const libero = !this.oggi();
      const opz = [
        { t: 'oggetto', w: libero ? 6 : 0 },
        { t: 'nemici', w: 2 },
        { t: 'bestie', w: Object.keys(st.voci).length || this.game.s.level >= 6 ? 2 : 1 },
        { t: 'avviso', w: 2 },
      ].filter(o => o.w > 0);
      tipo = pesato(opz).t;
    }
    if (tipo === 'oggetto') return this._nascondi(lv);
    if (tipo === 'nemici') return this._nemici();
    if (tipo === 'bestie') return this._bestie();
    return this._avviso();
  }

  _nascondi(lv) {
    const g = this.game, P = g.prog;
    const extraLv = Math.floor(P.grado('parlantina') / 2);
    const posti = NASCONDIGLI.filter(n => n.liv <= lv);
    const n = pick(posti);
    const t = pesato(TROVATELLI.filter(x => x.liv <= lv + extraLv));
    const W = g.world;
    let x = n.x, z = n.z;
    for (let r = 0; r < 4 && W.blocked(x, z); r += 0.5) for (const [ox, oz] of [[r, 0], [-r, 0], [0, r], [0, -r]]) if (!W.blocked(n.x + ox, n.z + oz)) { x = n.x + ox; z = n.z + oz; break; }
    this.st.oggi = { posto: n.id, dove: n.dove, trov: t.id, x, z, giorno: this.s.day, preso: false };
    this._mostra();
    return fill(pick(T.oggetto), { dove: n.dove, Dove: n.dove.charAt(0).toUpperCase() + n.dove.slice(1) });
  }

  _nemici() {
    const g = this.game, lv = g.s.level;
    if (g.spawn?.consiglio) { try { const t = g.spawn.consiglio(); if (t) return t; } catch (e) { console.error(e); } }
    const zone = Object.keys(ZONE).map(z => [z, nemiciDisponibili(z, lv, { ENEMIES })]).filter(([, l]) => l.length);
    if (!zone.length) return "Oggi è tranquillo. Troppo tranquillo. Io girerei con la zappa lo stesso.";
    const [z, l] = pick(zone);
    const nomi = [...new Set(l)].slice(0, 3).map(id => (NEMICI[id]?.nome || id).toLowerCase());
    return fill(pick(T.nemici), { zona: ZONE[z], Zona: ZONE[z].charAt(0).toUpperCase() + ZONE[z].slice(1), nemici: nomi.join(', ') });
  }

  _bestie() {
    const g = this.game, st = this.st;
    if (g.bestie?.consiglio) { try { const t = g.bestie.consiglio(); if (t) return t; } catch (e) { console.error(e); } }
    const note = Object.keys(st.voci).filter(k => T.bestie[k]);
    if (note.length) return T.bestie[pick(note)];
    if (g.s.level >= 6) return T.bestie.re_ratti;
    return T.bestie.nessuna;
  }

  _avviso() {
    const g = this.game;
    if (Math.random() < 0.5) {
      // l'umore di Zeno viene dall'officina (src/officina.js): T.zeno = [normale, cattivo, buono]
      try { const u = g.officina?.umore?.(); if (u) return T.zeno[{ normale: 0, cattivo: 1, buono: 2 }[u] ?? 0]; } catch (e) { console.error(e); }
      return pick(T.zeno);
    }
    const p = g.png.dove('vigilessa');
    if (!p) return T.vigilessa.assente;
    const dove = p.z < 56 && p.x < 42 ? 'in piazza, davanti al bar' : p.z < 56 ? 'sulla provinciale' : 'giù verso le case';
    return fill(T.vigilessa.dove, { dove });
  }

  // ---------- L'oggetto nascosto ----------
  oggi() {
    const o = this.st.oggi;
    if (!o || o.preso) return null;
    const t = TROVATELLI.find(x => x.id === o.trov);
    return { x: o.x, z: o.z, dove: o.dove.charAt(0).toUpperCase() + o.dove.slice(1), nome: t?.nome || '?' };
  }

  _minimap() { return this.game.minimap || window.__garonio?.minimap; }

  _mostra() {
    const g = this.game, o = this.oggi(), mm = this._minimap();
    if (!o) {
      if (this.spr) this.spr.visible = false;
      mm?.setMarker('consulente', null);
      return;
    }
    if (!this.spr) {
      const W = g.world;
      // sacchetto a terra con il fumetto «?» sopra
      const a = W.actor([sacchetto()], { w: 0.8, h: 0.73, shadow: 0.3 });
      const q = W.sprite(PIX.toTexture(PIX.bubble(' ?')), { w: 0.9, h: 0.58 });
      q.position.set(0.2, 0.9, 0); a.group.add(q);
      this.spr = a.group;
    }
    this.spr.position.set(o.x, 0, o.z);
    this.spr.visible = true;
    mm?.setMarker('consulente', o.x, o.z, '#ffd84a', '?');
  }

  bersaglio() {
    const o = this.oggi(); if (!o) return null;
    const P = this.game.player.group.position;
    if (Math.hypot(P.x - o.x, P.z - o.z) > 1.3) return null;
    return { label: 'Cerca qui (dritta del Consulente)', fn: () => this._raccogli() };
  }

  async _raccogli() {
    const g = this.game, s = this.s, st = this.st, P = g.prog, o = st.oggi;
    const t = TROVATELLI.find(x => x.id === o.trov) || TROVATELLI[0];
    const pr = t.premio, molt = 1 + 0.1 * P.grado('parlantina');
    o.preso = true;
    let soldi = pr.soldi ? Math.round(rnd(...pr.soldi) * molt) : 0;
    const extra = [];
    for (const [id, n] of Object.entries(pr.oggetti || {})) { P.dai(id, n); extra.push(`+${n} ${id}`); }
    if (pr.vestito) {
      if (!P.haVestito(pr.vestito)) { P.daiVestito(pr.vestito); extra.push(VESTITI[pr.vestito].nome); }
      else soldi += 15;
    }
    if (pr.arma) {
      if (!P.haArma(pr.arma)) { P.daiArma(pr.arma); extra.push(ARMI[pr.arma].nome); }
      else soldi += 20;
    }
    if (pr.pezzo) { st.pezzi += pr.pezzo; extra.push('pezzo di ricambio'); }
    if (soldi) { s.money += soldi; extra.unshift(`+${soldi}€`); }
    st.seguiti++;
    g.audio.sfx('coin');
    g._xp?.(pr.xp || 3);
    g.emit('trovato', { id: t.id, dove: o.posto });
    this._mostra();
    const pages = [
      { name: t.nome, text: fill(t.testo, { soldi }) + `\n(${extra.join(', ')})` },
      ...this._amicizia(C.amiciziaSeguito),
    ];
    await g.ui.dialog(pages);
  }

  _nuovoGiorno() {
    const st = this.st, s = this.s, g = this.game;
    if (st.oggi && !st.oggi.preso && s.day > st.oggi.giorno + 1) { st.oggi = null; this._mostra(); }
    if (g.prog.bonus('consigliAlTelefono') && st.msg !== s.day) {
      st.msg = s.day;
      const testo = this.consiglio();
      // arriva come SMS sul telefonino a conchiglia (src/telefono.js); senza telefono resta il vecchio avviso
      setTimeout(() => g.telefono ? g.telefono.sms('consulente', testo) : g.ui.toast(fill(T.messaggio, { testo }), 'good'), 2500);
    }
  }

  // scorciatoia per provare: garonio.consulente.provaAmicizia(80)
  provaAmicizia(n) { const a = this.game.png.amicizia('consulente'); this._amicizia(n - a); return this.livello(); }
}
