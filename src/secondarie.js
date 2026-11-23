// Missioni secondarie: offerte dai personaggi, seguite tramite gli eventi del gioco (src/eventi.js),
// pagate quando si torna da chi le ha date. I dati stanno in src/data/secondarie.js.
//
// API (game.quests):
//   aggiungi(id, def)        registra una missione da codice (es. le truffaldine generate dal lavoro "cascine")
//   disponibili(png)         missioni che quel personaggio può offrire ora
//   accetta(id) / stato(id)  stato: undefined | 'attiva' | 'pronta' | 'fatta' | 'fallita'
//   attive()                 [{ id, def, progresso, n, stato }] per il diario
//   progresso(id, k)         avanza a mano una missione (per obiettivi speciali)
//   completa(id) / fallisci(id)
import { SECONDARIE } from './data/secondarie.js';
import { OGGETTI, VESTITI, ARMI } from './data/armi.js';
import { PNG } from './data/png.js';
import { pick } from './racconto.js';

export class Secondarie {
  constructor(game) {
    this.game = game;
    this.defs = { ...SECONDARIE };
  }
  get s() { return this.game.s; }
  get st() { return this.s.quests; }

  init() {
    this.s.quests ??= { attive: {}, fatte: [], fallite: [] };
    const g = this.game;
    g.on('*', (name, data) => this._evento(name, data));
    g.on('nuovoGiorno', () => this._scadenze());
    // ogni personaggio offre e ritira le sue missioni
    for (const id of Object.keys(PNG)) g.png.aggiungiScelte(id, ctx => this._scelte(id));
  }

  aggiungi(id, def) { this.defs[id] = def; }
  stato(id) {
    if (this.st.fatte.includes(id)) return 'fatta';
    if (this.st.fallite.includes(id)) return 'fallita';
    return this.st.attive[id]?.stato;
  }

  _requisiti(def) {
    const r = def.requisiti || {}, s = this.s;
    if (r.livello && s.level < r.livello) return false;
    if (r.giorno && s.day < r.giorno) return false;
    if (r.dopo && this.stato(r.dopo) !== 'fatta') return false;
    for (const [p, min] of Object.entries(r.amicizia || {})) if (this.game.png.amicizia(p) < min) return false;
    return true;
  }

  disponibili(png) {
    return Object.entries(this.defs).filter(([id, d]) => d.da === png && !this.stato(id) && this._requisiti(d)).map(([id]) => id);
  }

  // il personaggio ha qualcosa per Garonio? (fumetto "!")
  haQualcosa(png) {
    if (this.disponibili(png).length) return true;
    return Object.entries(this.st.attive).some(([id, a]) => {
      const q = this.defs[id], o = q?.obiettivo; if (!o) return false;
      if (o.consegna) return (o.a || q.da) === png && Object.entries(o.consegna).every(([it, n]) => (this.s.inv[it] || 0) >= n);
      if (o.parla) return o.parla === png;
      return q.da === png && a.stato === 'pronta';
    });
  }

  _n(def) {
    const o = def.obiettivo;
    if (o.consegna) return Object.values(o.consegna).reduce((a, b) => a + b, 0);
    return o.n || 1;
  }

  accetta(id) {
    const def = this.defs[id]; if (!def || this.stato(id)) return;
    this.st.attive[id] = { stato: 'attiva', progresso: 0, giorno: this.s.day };
    for (const [o, n] of Object.entries(def.dai || {})) this.game.prog.dai(o, n);
    this.game.ui.toast(`Nuova missione: ${def.titolo}`, 'good');
    this.game.emit('secondaria', { id, stato: 'accettata' });
    // obiettivi già soddisfatti (es. "arriva al livello 3" quando lo sei già)
    const o = def.obiettivo;
    if (o.oPiu?.livello && this.s.level >= o.oPiu.livello) this._pronta(id);
  }

  attive() {
    return Object.entries(this.st.attive).map(([id, a]) => {
      const def = this.defs[id];
      let progresso = a.progresso, n = this._n(def);
      if (def.obiettivo.consegna) progresso = Object.entries(def.obiettivo.consegna).reduce((t, [o, k]) => t + Math.min(k, this.s.inv[o] || 0), 0);
      return { id, def, progresso, n, stato: a.stato };
    }).filter(x => x.def);
  }

  progresso(id, k = 1) {
    const a = this.st.attive[id], def = this.defs[id]; if (!a || a.stato !== 'attiva') return;
    a.progresso += k;
    if (a.progresso >= this._n(def)) this._pronta(id);
  }

  _pronta(id) {
    const a = this.st.attive[id], def = this.defs[id];
    a.stato = 'pronta';
    if (def.torna === false || def.obiettivo.consegna) return;
    this.game.ui.toast(`Fatto! Torna da ${PNG[def.da]?.nome || 'chi te l\'ha chiesto'}: «${def.titolo}»`, 'good');
    this.game.emit('secondaria', { id, stato: 'pronta' });
  }

  _evento(name, data) {
    for (const [id, a] of Object.entries(this.st.attive)) {
      const o = this.defs[id]?.obiettivo;
      if (!o || a.stato !== 'attiva' || o.evento !== name) continue;
      if (o.oPiu?.livello) { if (this.s.level >= o.oPiu.livello) this._pronta(id); continue; }
      if (Object.entries(o.filtro || {}).every(([k, v]) => data[k] === v)) this.progresso(id);
    }
  }

  _scadenze() {
    for (const [id, a] of Object.entries(this.st.attive)) {
      const d = this.defs[id];
      if (d?.giorni && this.s.day - a.giorno >= d.giorni && a.stato === 'attiva') this.fallisci(id);
    }
  }

  completa(id) {
    const def = this.defs[id], g = this.game, p = def.premio || {};
    delete this.st.attive[id]; this.st.fatte.push(id);
    if (p.soldi) g.s.money += p.soldi;
    if (p.xp) g.prog.addXp(p.xp);
    for (const [o, n] of Object.entries(p.oggetti || {})) g.prog.dai(o, n);
    for (const a of p.armi || []) g.prog.daiArma(a);
    for (const v of p.vestiti || []) g.prog.daiVestito(v);
    for (const [png, d] of Object.entries(p.amicizia || {})) g.png.cambiaAmicizia(png, d);
    const cose = [p.soldi && `+${p.soldi}€`, p.xp && `+${p.xp} esp.`,
      ...Object.entries(p.oggetti || {}).map(([o, n]) => `${OGGETTI[o]?.icona || ''}×${n}`),
      ...(p.armi || []).map(a => ARMI[a]?.nome), ...(p.vestiti || []).map(v => VESTITI[v]?.nome)].filter(Boolean);
    g.audio.sfx('coin');
    g.ui.toast(`Missione «${def.titolo}» completata! ${cose.join(', ')}`, 'good');
    g.emit('secondaria', { id, stato: 'fatta' });
  }

  fallisci(id) {
    const def = this.defs[id];
    delete this.st.attive[id]; this.st.fallite.push(id);
    this.game.ui.toast(`Missione «${def.titolo}» fallita.`, 'bad');
    this.game.emit('secondaria', { id, stato: 'fallita' });
  }

  // scelte nel dialogo con un personaggio: offrire, consegnare, ritirare la paga
  _scelte(png) {
    const out = [], s = this.s;
    const def = PNG[png];
    for (const id of this.disponibili(png)) {
      const q = this.defs[id];
      out.push({ label: `❗ ${q.titolo}`, fn: () => [{ who: png, name: def.nome, text: q.offerta, choices: [
        { label: q.accetta || 'Accetto', fn: () => { this.accetta(id); return null; } },
        { label: q.rifiuta || 'Un\'altra volta', fn: null },
      ] }] });
    }
    for (const [id, a] of Object.entries(this.st.attive)) {
      const q = this.defs[id]; if (!q) continue;
      const o = q.obiettivo, dest = o.a || q.da;
      if (o.consegna && dest === png) {
        const ok = Object.entries(o.consegna).every(([it, n]) => (s.inv[it] || 0) >= n);
        out.push({ label: `📦 Consegna: ${q.titolo}`, fn: () => {
          if (!ok) return [{ who: png, name: def.nome, text: q.scusa || 'Non hai ancora tutto quello che serve.' }];
          for (const [it, n] of Object.entries(o.consegna)) this.game.prog.togliOggetto(it, n);
          this.completa(id);
          return [{ who: png, name: def.nome, text: pick(q.grazie || 'Grazie!') }];
        } });
      } else if (o.parla === png && a.stato === 'attiva') {
        out.push({ label: `💬 ${q.titolo}`, fn: () => { this.completa(id); return [{ who: png, name: def.nome, text: pick(q.grazie || 'Ah, ti manda lui? Bene.') }]; } });
      } else if (q.da === png && a.stato === 'pronta') {
        out.push({ label: `✅ Riscuoti: ${q.titolo}`, fn: () => { this.completa(id); return [{ who: png, name: def.nome, text: pick(q.grazie || 'Ottimo lavoro!') }]; } });
      }
    }
    return out;
  }
}
