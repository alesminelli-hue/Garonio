// Le chicche dell'endgame (GDD capitolo 27.6-27.9). Dati: src/data/endgame.js.
//  - Concilio del Gambalone: a ogni cambio di stagione la classifica provvisoria (Gigante, Patata, Postino,
//    Frank, Camper e, se ha l'azienda, Garonio) per categoria: maiali, uova, latte, mais, grano, guadagni.
//    Punti 5/3/2/1. A fine inverno il Concilio finale somma l'anno: Agricoltore dell'Anno (+Gambalone d'Oro).
//    Le truffe riuscite alle cascine vicine (src/cascine.js, evento «truffa») abbassano i loro numeri.
//  - Notte delle Leggende: ogni 7 giorni, dalle 21. Mostri +3 livelli e spesso feroci, più gruppi in giro,
//    bottino doppio, un gettone a scontro vinto. Schermo rossastro.
//  - Taglie: 3 a settimana alla bacheca in piazza; si riscuotono lì (soldi + gettoni 🪙). Coi gettoni:
//    Pergamena del Fabbro, cibo, Distintivo dello Sceriffo e Forcone del Cacciatore di Taglie (esclusivi).
//  - Marchi delle armi: un'arma nuova a volte ha un marchio a caso («della Nonna», «del Diavolo»...)
//    che cambia attacco/difesa/critico. Il nome dell'arma lo mostra.
//  - Record: scheda 📜 del menu J (record, storia dei Concili, gettoni).
//
// API (game.endgame):
//   classifica(chiave, parziale)   [{ chi, nome, icona, val: {categoria: n}, punti }] della stagione 'estate@1'
//   concilio(chiave)               fa il Concilio di quella stagione (lo fa da solo a ogni cambio di stagione)
//   notte()                        true durante la Notte delle Leggende
//   taglie()                       le taglie della settimana
//   marchio(armaId)                chiave di MARCHI o undefined
//   record(k)
// Eventi: emette  concilio { chiave, primo, anno }, taglia { id }
// Stato: s.flags.endgame
import * as PIX from './pixel.js';
import { ENEMIES } from './combat.js';
import { NEMICI } from './data/nemici.js';
import { SPAWN, ZONE } from './data/bestie.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';
import { CONCILIO as K, NOTTE as N, TAGLIE as TG, MARCHI, PROB_MARCHIO, RECORD } from './data/endgame.js';
import { bacheca } from './sprite_azienda.js';
import { pagina, pick, fill } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const euro = n => Math.round(n).toLocaleString('it-IT');
const GIORNI = 14;
function dado(k) { let h = [...k].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7); h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const MOD = { inverno: { mais: 0, grano: 0 }, estate: { uova: 0.75 } };
const NOMI_STAGIONI = { primavera: 'Primavera', estate: 'Estate', autunno: 'Autunno', inverno: 'Inverno' };

export class Endgame {
  constructor(game) { this.game = game; this.marchiBase = {}; }
  get s() { return this.game.s; }
  get st() {
    const f = (this.s.flags ??= {}); const st = (f.endgame ??= {});
    st.concilio ??= { punti: {}, malus: {}, storia: [] }; st.taglie ??= { lista: [] }; st.marchi ??= {}; st.record ??= {};
    st.gettoni ??= 0;
    return st;
  }
  _ora() { return (this.s.minutes / 60) % 24; }
  _chiave() { return this.game.azienda?._chiaveStag?.() || `${this.game.bestie?.stagione?.() || 'primavera'}@1`; }

  init() {
    const g = this.game, st = this.st, p = g.prog;
    st.concilio.corrente ??= this._chiave();
    // ---- Concilio ----
    g.on('stagione', () => {
      const prima = st.concilio.corrente, ora = this._chiave();
      st.concilio.corrente = ora;
      if (prima && prima !== ora) this._quando(() => this.concilio(prima));
    });
    g.on('truffa', d => { if (K.cascine[d?.vicino]) { const m = st.concilio.malus; m[d.vicino] = Math.min(0.5, (m[d.vicino] || 0) + K.truffa); } });
    // ---- Notte delle Leggende ----
    const stat = g.combat._statistiche.bind(g.combat);
    g.combat._statistiche = (id, d, lv, feroce) => {
      if (!this.notte() || d.boss || !NEMICI[id]?.lv || g.combat.place === 'bar') return stat(id, d, lv, feroce);
      const base = stat(id, d, lv, feroce ?? (Math.random() < N.feroce));
      return lv ? base : stat(id, d, (base.lv || 1) + N.livello, base.feroce);
    };
    const bott = g.boss.bottino.bind(g.boss);
    g.boss.bottino = (nemici, place) => {
      const a = bott(nemici, place);
      return this.notte() && place !== 'bar' ? [...a, ...bott(nemici, place), '🌕 bottino doppio'] : a;
    };
    g.on('combattimento', d => {
      if (d.esito !== 'win' || d.place === 'bar') return;
      if (this.notte()) {
        st.notteVinti = (st.notteVinti || 0) + 1; this._rec('notti', 1);
        st.gettoni += N.gettoni; setTimeout(() => g.ui.toast(`🌕 +${N.gettoni} 🪙 gettone della Notte delle Leggende`, 'good'), 2500);
        this._taglia('notte');
      }
    });
    g.on('nuovoGiorno', () => this._giorno());
    // ---- Taglie ----
    g.on('nemicoSconfitto', d => {
      if (d.noXp) return;
      this._rec('nemici', 1); if (d.feroce) this._rec('feroci', 1);
      this._taglia('nemico', d.id); if (d.feroce) this._taglia('feroci');
    });
    g.on('venditaAzienda', d => {
      this._taglia('stagione', null, d.tot);
      const o = (st.record._oggi ??= { giorno: this.s.day, tot: 0 });
      if (o.giorno !== this.s.day) { o.giorno = this.s.day; o.tot = 0; }
      o.tot += d.tot; this._max('incassoMax', o.tot);
    });
    g.on('raccolto', () => this._rec('raccolti', 1));
    this._settimana();
    g.bersagli.push(() => this.bersaglio());
    // ---- Marchi delle armi ----
    for (const [id, a] of Object.entries(ARMI)) this.marchiBase[id] = a.nome;
    for (const id of Object.keys(st.marchi)) this._nomeArma(id);
    const dai = p.daiArma.bind(p);
    p.daiArma = (id, ...a) => { const nuova = !p.haArma(id); const r = dai(id, ...a); if (nuova && p.haArma(id)) this._marchia(id); return r; };
    const bonus = p.bonus.bind(p);
    p.bonus = key => bonus(key) + (MARCHI[st.marchi[p.p.arma]]?.bonus[key] || 0);
    // ---- Mappa, menu, pilot ----
    const W = g.world, spr = W.sprite(PIX.toTexture(bacheca()), { w: 1.2, h: 1.2 });
    spr.position.set(TG.bacheca.x, 0.6, TG.bacheca.z); W.scene.add(spr);
    g.moduli.push({ update: () => this._tick() });
    g.menu?.aggiungiScheda?.('record', { icona: '📜', nome: 'Record', render: m => this._scheda(m) });
    g.pilot?.sezione?.('🏆 Endgame: Concilio, Notte, Taglie', () => [
      { label: '🏆 Fai il Concilio della stagione in corso', fn: () => { this.concilio(this._chiave()); return null; } },
      { label: '🥇 Fai il Concilio finale (inverno)', fn: () => { const a = this._chiave().split('@')[1]; for (const s of ['primavera', 'estate', 'autunno']) this._punteggia(`${s}@${a}`); this.concilio(`inverno@${a}`); return null; } },
      { label: '🌕 Notte delle Leggende stasera', fn: () => { st.notteForzata = this.s.day; this.s.minutes = Math.max(this.s.minutes, 21 * 60); return null; } },
      { label: '📌 Vai alla bacheca delle taglie', fn: () => { g.player.group.position.set(TG.bacheca.x, 0, TG.bacheca.z + 0.9); return null; } },
      { label: '🪙 +20 gettoni', fn: () => { st.gettoni += 20; return null; } },
      { label: '🗡️ Marchio a caso all\'arma impugnata', fn: () => { this._marchia(p.p.arma, true); return null; } },
    ]);
  }

  _quando(fn) {
    const g = this.game;
    const prova = () => { if (g.ui.busy?.() || g.locked || g.combat?.active) return setTimeout(prova, 1500); fn(); };
    setTimeout(prova, 2500);
  }
  _rec(k, n) { this.st.record[k] = (this.st.record[k] || 0) + n; }
  _max(k, v) { if (v > (this.st.record[k] || 0)) this.st.record[k] = Math.round(v); }
  record(k) { return this.st.record[k] || 0; }

  _tick() {
    const st = this.st, g = this.game;
    this._max('soldiMax', this.s.money);
    // la Notte delle Leggende
    const n = this.notte();
    if (this.s.day % N.ogni === 0 && this._ora() >= 18 && st.notteAnnunciata !== this.s.day) { st.notteAnnunciata = this.s.day; g.ui.toast(N.annuncio, 'bad'); }
    if (n !== !!this._notteOn) {
      this._notteOn = n;
      document.body.classList.toggle('notte-leggende', n);
      this._stile();
      if (n) {
        this._spawn0 ??= { maxGruppi: SPAWN.maxGruppi, ogniOre: SPAWN.ogniOre };
        SPAWN.maxGruppi = N.maxGruppi; SPAWN.ogniOre = N.ogniOre;
        st.notteVinti = 0; g.ui.toast(N.inizio, 'bad'); g.audio.sfx('bad');
      } else if (this._spawn0) {
        Object.assign(SPAWN, this._spawn0);
        g.ui.toast(fill(N.fine, { n: st.notteVinti || 0 }), 'good');
      }
    }
  }
  notte() { const d = this.s.day; return (d % N.ogni === 0 || this.st.notteForzata === d) && this._ora() >= N.ore[0]; }

  _giorno() {
    this._settimana();
  }

  // ---------- Concilio del Gambalone ----------
  _valori(chi, chiave, frazione = 1) {
    const [stag, anno] = chiave.split('@'), A = +anno || 1;
    if (chi === 'garonio') {
      const t = this.game.azienda?.totali?.(chiave) || {};
      return { maiale: t.maiale || 0, uova: t.uova || 0, latte: (t.latte || 0) + (t.formaggio || 0) * 10, mais: t.mais || 0, grano: t.grano || 0, guadagni: t.guadagni || 0 };
    }
    const C = K.cascine[chi], mal = 1 - (this.st.concilio.malus[chi] || 0);
    const out = {};
    for (const [cat, v] of Object.entries(C.prod)) {
      const m = MOD[stag]?.[cat] ?? 1, r = 0.85 + dado(`${chiave}:${chi}:${cat}`) * 0.3;
      out[cat] = v * GIORNI * frazione * m * r * (1 + K.crescitaAnno * (A - 1)) * mal;
    }
    return out;
  }
  _inGara() { return !!this.game.azienda?.comprata?.(); }
  classifica(chiave, parziale = false) {
    const fr = parziale ? clamp(((this.s.day - 1) % GIORNI + 1) / GIORNI, 0.05, 1) : 1;
    const chi = [...Object.keys(K.cascine), ...(this._inGara() ? ['garonio'] : [])];
    const righe = chi.map(c => ({ chi: c, nome: c === 'garonio' ? 'Azienda Agricola Garonio' : K.cascine[c].nome, icona: c === 'garonio' ? '🏡' : K.cascine[c].icona, val: this._valori(c, chiave, fr), punti: 0, primi: [] }));
    for (const cat of Object.keys(K.categorie)) {
      const ord = [...righe].sort((a, b) => b.val[cat] - a.val[cat]);
      ord.forEach((r, i) => { if (r.val[cat] > 0) r.punti += K.punti[i] || 0; });
      if (ord[0].val[cat] > 0) ord[0].primi.push(cat);
    }
    return righe.sort((a, b) => b.punti - a.punti);
  }
  _punteggia(chiave) {
    const anno = chiave.split('@')[1], P = (this.st.concilio.punti[anno] ??= {});
    if (P[`_${chiave}`]) return this.classifica(chiave);
    const cl = this.classifica(chiave);
    for (const r of cl) P[r.chi] = (P[r.chi] || 0) + r.punti;
    P[`_${chiave}`] = true;
    return cl;
  }

  async concilio(chiave) {
    const g = this.game, st = this.st, s = this.s, [stag, anno] = chiave.split('@');
    const cl = this._punteggia(chiave);
    st.concilio.malus = {};
    const v = { nome: K.nome, stagione: `${NOMI_STAGIONI[stag] || stag} dell'anno ${anno}` };
    const pres = testo => ({ name: K.presidente, text: testo });
    const fmt = (cat, n) => cat === 'guadagni' ? `${euro(n)}€` : cat === 'mais' || cat === 'grano' ? `${euro(n)} q` : euro(n);
    const pagine = K.apertura.map(t => pagina({ testo: fill(t, v) }));
    if (!this._inGara()) pagine.push(pagina({ testo: K.noGara }));
    const cat = Object.entries(K.categorie).map(([c, C]) => {
      const ord = [...cl].sort((a, b) => b.val[c] - a.val[c]).slice(0, 3).filter(r => r.val[c] > 0);
      return ord.length ? `${C.icona} ${C.nome}: ${ord.map((r, i) => `${i + 1}. ${r.nome} (${fmt(c, r.val[c])})`).join(' · ')}` : `${C.icona} ${C.nome}: nessuno (è ${stag})`;
    });
    pagine.push(pres(cat.slice(0, 3).join('\n')), pres(cat.slice(3).join('\n')));
    pagine.push(pres(`Classifica di stagione: ${cl.map((r, i) => `${i + 1}. ${r.icona} ${r.nome} ${r.punti} pt`).join(' · ')}`));
    const primo = cl[0];
    pagine.push(pagina({ testo: primo.chi === 'garonio' ? pick(K.vince) : primo.chi === 'gigante' ? pick(K.giganteVince) : fill(K.altroVince, { nome: primo.nome }) }));
    const pos = cl.findIndex(r => r.chi === 'garonio');
    if (pos >= 0 && pos < K.premioStagione.length) {
      s.money += K.premioStagione[pos];
      pagine.push(pagina({ testo: `🏆 ${pos + 1}° posto: premio di ${euro(K.premioStagione[pos])}€ dalla Pro Loco.` }));
      if (pos === 0) this._rec('concili', 1);
    }
    st.concilio.storia.push({ chiave, classifica: cl.map(r => [r.chi, r.punti]) });
    // a fine inverno: l'Agricoltore dell'Anno
    let primoAnno = null;
    if (stag === 'inverno') {
      const P = st.concilio.punti[anno] || {};
      const anno_ = Object.entries(P).filter(([k]) => !k.startsWith('_')).sort((a, b) => b[1] - a[1]);
      primoAnno = anno_[0]?.[0];
      pagine.push(...K.finale.map(t => pagina({ testo: t })));
      pagine.push(pres(`Classifica dell'anno ${anno}: ${anno_.map(([c, p], i) => `${i + 1}. ${c === 'garonio' ? '🏡 Garonio' : `${K.cascine[c].icona} ${K.cascine[c].nome}`} ${p} pt`).join(' · ')}`));
      if (primoAnno === 'garonio') {
        pagine.push(pagina({ testo: pick(K.annoGaronio) }));
        s.money += K.premioAnno.soldi; this._rec('anni', 1);
        const tro = K.premioAnno.vestito, ha = g.prog.haVestito(tro);
        if (!ha) g.prog.daiVestito(tro);
        pagine.push(pagina({ testo: `🥇 Agricoltore dell'Anno! +${euro(K.premioAnno.soldi)}€${ha ? '' : ` e il ${VESTITI[tro].nome}`}.` }));
      } else pagine.push(pagina({ testo: primoAnno === 'gigante' ? K.annoGigante : fill(K.annoAltro, { nome: K.cascine[primoAnno]?.nome || '' }) }));
      st.concilio.storia[st.concilio.storia.length - 1].anno = primoAnno;
    }
    g.audio.sfx('level');
    g.emit('concilio', { chiave, primo: primo.chi, anno: primoAnno });
    await g.ui.dialog(pagine);
  }

  // ---------- Taglie ----------
  taglie() { return this.st.taglie.lista; }
  _settimana() {
    const T = this.st.taglie, w = Math.floor((this.s.day - 1) / 7);
    if (T.settimana === w) return;
    T.settimana = w; T.lista = [];
    const lv = this.s.level, nemici = Object.entries(NEMICI).filter(([id, n]) => n.lv && !n.boss && ENEMIES[id] && !ENEMIES[id].bar && !ENEMIES[id].boss
      && (n.zone || []).some(z => ZONE[z] || z === 'ovunque') && !(n.zone || []).includes('bar') && lv >= (n.min || 1));
    const modelli = TG.modelli.filter(m => !m.azienda || this.game.azienda?.comprata?.());
    const usati = new Set();
    for (let i = 0; i < TG.perSettimana; i++) {
      const m = pick(modelli.filter(x => x.tipo === 'nemico' || !usati.has(x.tipo)) );
      usati.add(m.tipo);
      const t = { id: `${w}:${i}`, tipo: m.tipo, n: rint(...m.n), prog: 0, soldi: m.soldi, gettoni: m.gettoni };
      if (m.tipo === 'nemico') {
        const liberi = nemici.filter(([id]) => !T.lista.some(x => x.nemico === id));
        if (!liberi.length) { t.tipo = 'feroci'; t.testo = TG.modelli.find(x => x.tipo === 'feroci').testo; } else { const [id, n] = pick(liberi); t.nemico = id; t.nomeNemico = n.nome || ENEMIES[id].name; }
      }
      if (m.tipo === 'stagione') t.n = 500;
      t.testo = fill(t.testo || m.testo, { n: t.n, nome: t.nomeNemico || '' });
      // più ricche a livello alto
      t.soldi = Math.round(t.soldi * (1 + lv / 15));
      T.lista.push(t);
    }
  }
  _taglia(tipo, nemico = null, k = 1) {
    for (const t of this.st.taglie.lista) {
      if (t.fatta || t.prog >= t.n || t.tipo !== tipo || (tipo === 'nemico' && t.nemico !== nemico)) continue;
      t.prog = Math.min(t.n, t.prog + k);
      if (t.prog >= t.n) setTimeout(() => this.game.ui.toast(`📌 Taglia compiuta! Riscuotila alla bacheca in piazza.`, 'good'), 1800);
    }
  }
  bersaglio() {
    const g = this.game; if (g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position;
    if (Math.hypot(P.x - TG.bacheca.x, P.z - TG.bacheca.z) < 1.3) return { label: TG.titolo, fn: () => this.apriBacheca() };
    return null;
  }
  async apriBacheca() {
    const g = this.game, st = this.st, s = this.s;
    const pag = () => {
      const sc = [];
      for (const t of st.taglie.lista) {
        if (t.fatta) { sc.push({ label: `✔ ${t.testo}`, fn: () => [pag()] }); continue; }
        const ok = t.prog >= t.n;
        sc.push({ label: `${ok ? '💰 Riscuoti' : '📌'} ${t.testo} ${t.tipo === 'stagione' ? `(${euro(t.prog)}/${t.n}€)` : `(${t.prog}/${t.n})`} · ${euro(t.soldi)}€ +${t.gettoni}🪙`, fn: () => {
          if (!ok) return [{ text: 'Non è ancora fatta. Il Comune paga a lavoro finito. Il Comune, eh.' }, pag()];
          t.fatta = true; s.money += t.soldi; st.gettoni += t.gettoni; this._rec('taglie', 1);
          g.audio.sfx('coin'); g.emit('taglia', { id: t.id });
          return [{ text: fill(TG.riscossa, { soldi: euro(t.soldi), gettoni: t.gettoni }) }, pag()];
        } });
      }
      sc.push({ label: `🪙 Spendi i gettoni (${st.gettoni})`, fn: () => [negozio()] });
      sc.push({ label: 'Chiudi', fn: null });
      const tutte = st.taglie.lista.every(t => t.fatta);
      return { name: TG.titolo, text: tutte ? TG.vuota : `Taglie della settimana. Gettoni in tasca: ${st.gettoni} 🪙.`, choices: sc };
    };
    const negozio = () => ({ name: '🪙 Negozio dei gettoni', text: `Hai ${st.gettoni} 🪙. Roba che non si trova da nessun'altra parte (tranne la torta: quella la fa anche la nonna).`, choices: [
      ...TG.negozio.map(o => {
        const gia = (o.vestito && g.prog.haVestito(o.vestito)) || (o.arma && g.prog.haArma(o.arma));
        return { label: `${o.nome} · ${o.gettoni} 🪙${gia ? ' (ce l\'hai)' : ''}`, fn: () => {
          if (gia) return [{ text: 'Ce l\'hai già.' }, negozio()];
          if (st.gettoni < o.gettoni) return [{ text: 'Non hai abbastanza gettoni. Caccia di più.' }, negozio()];
          st.gettoni -= o.gettoni; g.audio.sfx('coin');
          let msg = `Preso: ${o.nome}.`;
          if (o.id === 'pergamena') msg = this._marchia(g.prog.p.arma, true);
          else if (o.oggetto) g.prog.dai(o.oggetto, 1);
          else if (o.vestito) g.prog.daiVestito(o.vestito);
          else if (o.arma) g.prog.daiArma(o.arma);
          return [{ text: msg }, negozio()];
        } };
      }),
      { label: 'Indietro', fn: () => [pag()] },
    ] });
    await g.ui.dialog([pag()]);
  }

  // ---------- Marchi delle armi ----------
  marchio(id) { return this.st.marchi[id]; }
  _nomeArma(id) {
    const a = ARMI[id]; if (!a) return;
    const base = this.marchiBase[id] ?? a.nome, m = MARCHI[this.st.marchi[id]];
    a.nome = m ? `${base} ${m.nome}` : base;
  }
  _marchia(id, sempre = false) {
    if (!ARMI[id]) return '';
    if (!sempre && Math.random() > PROB_MARCHIO) return '';
    const leggenda = this.notte() && Math.random() < N.leggenda;
    const pool = Object.entries(MARCHI).filter(([k, m]) => m.peso > 0 && k !== this.st.marchi[id]);
    let tot = pool.reduce((t, [, m]) => t + m.peso, 0), r = Math.random() * tot;
    const k = leggenda ? 'leggende' : (pool.find(([, m]) => (r -= m.peso) < 0) || pool[0])[0];
    this.st.marchi[id] = k;
    this._nomeArma(id);
    const b = MARCHI[k].bonus, desc = Object.entries(b).map(([x, v]) => x === 'critico' ? `critico ${v > 0 ? '+' : ''}${Math.round(v * 100)}%` : `${x === 'atk' ? 'attacco' : 'difesa'} ${v > 0 ? '+' : ''}${v}`).join(', ');
    const msg = `🗡️ ${ARMI[id].nome}: ${desc}.`;
    setTimeout(() => this.game.ui.toast(msg, b.atk < 0 ? 'bad' : 'good'), 1200);
    return msg;
  }

  // ---------- Scheda 📜 ----------
  _scheda() {
    const st = this.st, out = [];
    const el = (tag, cls, text, kids) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; for (const k of kids || []) if (k) e.appendChild(k); return e; };
    const riga = (icona, titolo, desc, ok) => el('div', 'mn-trofeo' + (ok ? ' ok' : ''), null, [el('span', 'mn-icon', icona), el('div', 'mn-nota-c', null, [el('b', null, titolo), el('small', 'mn-desc2', desc)])]);
    out.push(el('div', 'mn-cartello', '📜 Record di Garonio'));
    const L = el('div', 'mn-trofei');
    for (const [k, nome] of RECORD) {
      const v = this.record(k), [ic, ...t] = nome.split(' ');
      L.appendChild(riga(ic, t.join(' '), k.endsWith('Max') ? `${euro(v)}€` : String(v), v > 0));
    }
    L.appendChild(riga('🪙', 'Gettoni', `${st.gettoni} (si spendono alla bacheca delle taglie)`, st.gettoni > 0));
    out.push(L);
    // concilio
    const chiave = st.concilio.corrente || this._chiave();
    out.push(el('div', 'mn-cartello', `🏆 Concilio del Gambalone · ${chiave.replace('@', ', anno ')} (provvisoria)`));
    const C = el('div', 'mn-trofei');
    this.classifica(chiave, true).forEach((r, i) => C.appendChild(riga(r.icona, `${i + 1}. ${r.nome}`, `${r.punti} punti${r.primi.length ? ` · primo in ${r.primi.map(c => K.categorie[c].icona).join(' ')}` : ''}`, r.chi === 'garonio')));
    if (!this._inGara()) C.appendChild(riga('🔒', 'Garonio non è in gara', 'Serve un\'azienda agricola: la Cascina dei Salici, in comune.', false));
    out.push(C);
    const storia = st.concilio.storia.slice(-6).reverse();
    if (storia.length) out.push(el('div', 'mn-desc2', storia.map(h => `${h.chiave.replace('@', ' ')}: 1° ${h.classifica[0][0]}${h.anno ? ` · Agricoltore dell'Anno: ${h.anno}` : ''}`).join(' · ')));
    // marchi
    const marchi = Object.entries(st.marchi).filter(([id]) => this.game.prog.haArma(id));
    if (marchi.length) { out.push(el('div', 'mn-cartello', '🗡️ Armi col marchio')); out.push(el('div', 'mn-desc2', marchi.map(([id]) => ARMI[id].nome).join(' · '))); }
    return out;
  }

  _stile() {
    if (document.getElementById('stile-endgame')) return;
    const css = document.createElement('style');
    css.id = 'stile-endgame';
    css.textContent = `body.notte-leggende::after { content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 5;
      background: radial-gradient(ellipse at 50% 45%, rgba(200,30,40,0.10), rgba(110,0,20,0.42)); }
      body.notte-leggende.in-battle::after { display: none; }`;
    document.head.appendChild(css);
  }
}
