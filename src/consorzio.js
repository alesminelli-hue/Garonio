// Il Consorzio Agrario di Mister Rodella (GDD capitolo 27.4): capannone verde in HD (hd/edifici.js, «consorzio»)
// sulla strada, a est della Cascina dei Salici. Mister Rodella (PNG «rodella», sprite «commendatore») sta sul
// piazzale dalle 7 alle 19 e, oltre a chiacchierare:
//  - regala una volta al giorno qualche bustina di semi per l'orto (zucchine, insalata, zucche, peperoni, fragole,
//    secondo la stagione). Nell'orto si semina la verdura scelta (o quella con più bustine), si raccoglie e si vende
//    alla cassa con il resto (game.sell);
//  - vende mangime: sacchi per i maiali del Gigante, il Mangime Gold per le galline (alla mangiatoia: +3 uova) e,
//    con l'azienda, il contratto settimanale (spese della cascina −35%);
//  - vende trattori, solo all'Imprenditore Agricolo: guidabili (game.vehicles.aggiungi) e con più raccolto ai campi.
// Dati: src/data/consorzio.js.
//
// API (game.consorzio):
//   semeScelto()       coltura da seminare nell'orto ('zucchina'...) o null (pomodori)
//   usaSeme(coltura)   toglie una bustina (lo chiama game.sow)
//   scontoSpese()      sconto sulle spese giornaliere della cascina (0 se non c'è il contratto)
//   bonusCampi()       raccolto in più dei campi della cascina, dai trattori comprati
//   giornoContratto()  consuma un giorno di contratto (lo chiama src/azienda.js ogni notte)
// Eventi: emette  consorzio { tipo: 'semi'|'mangime'|'gold'|'contratto'|'trattore', id }
// Stato: s.flags.consorzio = { visto, semiGiorno, seme, contratto, trattori: [id] }
import { CONSORZIO as C, RODELLA as R } from './data/consorzio.js';
import { OGGETTI } from './data/armi.js';
import { pagina, pagine, pick, fill } from './racconto.js';
import './sprite_consorzio.js';

const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const euro = n => Math.round(n).toLocaleString('it-IT');
const SEMI = Object.entries(OGGETTI).filter(([, o]) => o.seme).map(([id, o]) => [id, o.seme]);

export class Consorzio {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); const st = (f.consorzio ??= {}); st.trattori ??= []; return st; }

  init() {
    const g = this.game;
    g.png.aggiungiScelte('rodella', () => this.scelte());
    // i trattori già comprati tornano al loro posto
    for (const id of this.st.trattori) { const t = C.trattori.find(x => x.id === id); if (t) g.vehicles?.aggiungi?.(id, { ...t.posto, color: t.colore }); }
    // il Mangime Gold alla mangiatoia
    const feed = g.feed.bind(g);
    g.feed = () => {
      feed();
      if ((this.s.inv.mangimeGold || 0) > 0) {
        g.prog.togliOggetto('mangimeGold', 1);
        for (let i = 0; i < C.goldUova; i++) if (this.s.eggs.length < 8) g._layEgg();
        setTimeout(() => g.ui.toast(`🌾 Mangime Rodella Gold: le galline impazziscono. +${C.goldUova} uova!`, 'good'), 1200);
      }
    };
    // la prima volta che lo incontri, la presentazione
    const parla = g.png.parla.bind(g.png);
    g.png.parla = async id => {
      if (id === 'rodella' && !this.st.visto) { this.st.visto = true; await g.ui.dialog(this._pagine(R.presentazione)); }
      return parla(id);
    };
    g.pilot?.sezione?.('🌱 Consorzio Rodella', () => [
      { label: '🌱 Vai al Consorzio', fn: () => { g.player.group.position.set(C.posto.x, 0, C.posto.z + 1.2); return null; } },
      { label: '🌱 Dammi tutti i semi (×5)', fn: () => { for (const [id] of SEMI) g.prog.dai(id, 5); return null; } },
      { label: '🔁 Semi gratis di nuovo disponibili', fn: () => { this.st.semiGiorno = null; return null; } },
    ]);
  }

  _pagine(lista) { return lista.map(p => pagina({ ...p, nome: p.chi === 'rodella' ? R.nome : undefined })); }
  _rod(testo, choices) { return { who: 'rodella', name: R.nome, text: testo, choices }; }

  // ---------- Orto ----------
  semeScelto() {
    const inv = this.s.inv, scelto = this.st.seme;
    if (scelto === 'pomodoro') return null;
    const sc = SEMI.find(([id, c]) => c === scelto);
    if (sc && (inv[sc[0]] || 0) > 0) return scelto;
    const best = SEMI.filter(([id]) => (inv[id] || 0) > 0).sort((a, b) => inv[b[0]] - inv[a[0]])[0];
    return best ? best[1] : null;
  }
  usaSeme(coltura) {
    const sc = SEMI.find(([, c]) => c === coltura);
    if (sc && (this.s.inv[sc[0]] || 0) > 0) this.game.prog.togliOggetto(sc[0], 1);
  }

  // ---------- Azienda ----------
  scontoSpese() { return (this.st.contratto || 0) > 0 ? C.contratto.sconto : 0; }
  giornoContratto() { if (this.st.contratto > 0) this.st.contratto--; }
  bonusCampi() { return this.st.trattori.reduce((t, id) => t + (C.trattori.find(x => x.id === id)?.campi || 0), 0); }

  // ---------- Dialogo ----------
  scelte() {
    const g = this.game, s = this.s, st = this.st, out = [];
    const dopo = () => this._rod(pick(R.dopoAcquisto));
    const paga = (prezzo, fn) => () => {
      if (s.money < prezzo) return [this._rod(fill(R.pocoSoldi, { manca: euro(prezzo - s.money) }))];
      s.money -= prezzo; g.audio.sfx('coin');
      return fn();
    };
    // semi gratis
    out.push({ label: st.semiGiorno === s.day ? '🌱 Semi gratis (domani)' : '🌱 Semi gratis!', fn: () => {
      if (st.semiGiorno === s.day) return [this._rod(pick(R.semiGiaDati))];
      st.semiGiorno = s.day;
      const lista = C.semi[g.bestie?.stagione?.() || 'primavera'] || C.semi.primavera, preso = {};
      for (let i = rint(...C.semiAlGiorno); i > 0; i--) { const id = pick(lista); preso[id] = (preso[id] || 0) + 1; }
      for (const [id, n] of Object.entries(preso)) g.prog.dai(id, n);
      g.png.cambiaAmicizia('rodella', 1);
      g.emit('consorzio', { tipo: 'semi' });
      const gag = pick(R.semi), cose = Object.entries(preso).map(([id, n]) => `${OGGETTI[id].nome.split(' (')[0]} ×${n}`).join(', ');
      return [this._rod(gag.rodella), pagina({ chi: 'garonio', testo: gag.garonio }), this._rod(gag.fine), pagina({ testo: `🌱 ${cose}. Nell'orto: zappa, semina, annaffia, raccogli e vendi alla cassa.` })];
    } });
    // cosa seminare
    out.push({ label: `🌱 Nell'orto semino: ${this.semeScelto() || 'pomodoro'}`, fn: () => {
      const ha = SEMI.filter(([id]) => (s.inv[id] || 0) > 0);
      if (!ha.length) return [this._rod(R.nessunSeme)];
      return [this._rod(R.semeScelto, [
        ...ha.map(([id, c]) => ({ label: `${OGGETTI[c].icona} ${OGGETTI[c].nome} (${s.inv[id]} bustine)`, fn: () => { st.seme = c; return null; } })),
        { label: '🍅 Pomodori (gratis, come sempre)', fn: () => { st.seme = 'pomodoro'; return null; } },
      ])];
    } });
    // mangimi
    out.push({ label: `🐷 Mangime: ${C.mangime.sacchi} sacchi per i maiali (${C.mangime.prezzo}€)`, fn: paga(C.mangime.prezzo, () => {
      const m = g.s.flags.maiali; if (m) m.mangime = (m.mangime || 0) + C.mangime.sacchi;
      g.emit('consorzio', { tipo: 'mangime' });
      return [this._rod(pick(R.mangime)), pagina({ testo: `🐷 +${C.mangime.sacchi} sacchi di mangime nel deposito dei maiali.` })];
    }) });
    out.push({ label: `🌾 Mangime Gold ×${C.gold.n} per le galline (${C.gold.prezzo}€)`, fn: paga(C.gold.prezzo, () => {
      g.prog.dai('mangimeGold', C.gold.n);
      g.emit('consorzio', { tipo: 'gold' });
      return [this._rod(R.gold), dopo()];
    }) });
    const az = g.azienda;
    if (az?.comprata?.()) {
      if (st.contratto > 0) out.push({ label: `📃 Contratto mangime: ancora ${st.contratto} giorni`, fn: () => [this._rod(fill(R.contrattoAttivo, { giorni: st.contratto }))] });
      else if (az._costoGiorno() > 0) {
        const prezzo = Math.round(az._costoGiorno() * C.contratto.giorni * (1 - C.contratto.sconto));
        out.push({ label: `📃 Contratto mangime per la cascina: ${C.contratto.giorni} giorni a −35% (${euro(prezzo)}€)`, fn: paga(prezzo, () => {
          st.contratto = C.contratto.giorni;
          g.emit('consorzio', { tipo: 'contratto' });
          return [this._rod(R.contratto), dopo()];
        }) });
      }
    }
    // trattori
    out.push({ label: '🚜 I trattori', fn: () => {
      if (!az?.comprata?.()) return [this._rod(R.trattoriChiusi)];
      return [this._rod(R.trattori, [
        ...C.trattori.map(t => st.trattori.includes(t.id)
          ? { label: `✔ ${t.nome} (già tuo)`, fn: () => [this._rod('Ce l\'hai già, giovanotto! Vuoi comprarne due uguali? Si può fare, eh.')] }
          : { label: `🚜 ${t.nome} · ${euro(t.prezzo)}€`, fn: () => [this._rod(t.desc, [
            { label: `Lo compro (${euro(t.prezzo)}€)`, fn: paga(t.prezzo, () => {
              st.trattori.push(t.id);
              g.vehicles?.aggiungi?.(t.id, { ...t.posto, color: t.colore });
              g.audio.sfx('level');
              g.emit('consorzio', { tipo: 'trattore', id: t.id });
              return this._pagine(R.trattoreComprato);
            }) },
            { label: 'Ci penso', fn: null },
          ])] }),
        { label: 'Solo guardare', fn: null },
      ])];
    } });
    return out;
  }
}
