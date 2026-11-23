// Trama del bar: «Farsi rispettare» (GDD 17.4 e 18.2).
// Rispetto 0-100 coi ranghi, dialoghi con Orgoglio e Rabbia degli avventori (Rispondi, Ignora,
// Offri da bere, Provoca), risse con le armi da bar, la regola di Loredana, le storie in tre
// incontri dei sei avventori e la briscola con Tarcisio. Testi e numeri: BAR_STORIA in src/data/dialoghi.js.
//
// API (game.bar):
//   rispetto() / rango() / cambiaRispetto(delta)    rango = { nome, da, sconto, sblocca }
//   prezzo(euro)                prezzo al bar con lo sconto del rango
//   ingresso()                  async: false se Loredana ha bandito Garonio (regola delle tre risse)
//   bandito()                   true nei giorni del bando
//   presenti()                  [{ id, nome, posto, incontro }] avventori al bar adesso (posto: tavolo1..3, bancone, carte, biliardo)
//   parlaAvventore(id)          async: chiacchiera, incontro della sua storia, briscola (Tarcisio)
//   rissa(id, { nemici, piazza })   async: scelta dell'arma da bar e combattimento; 'win' | 'lose' | 'flee'
//   provocazione()              pagine di dialogo: un avventore attacca bottone mentre ordini (o null)
//   scelteBancone()             scelte per il menu di Loredana (rispetto, voci sulle bestie)
//   scelteTavoli()              scelte per andare ai tavoli (solo finché il bar non ha gli interni)
//   briscola()                  async: mini-gioco col Tarcisio
//
// Eventi mandati (vedi src/eventi.js): rispetto, voce, avventore, mappaCatastale, rimorchio, reBancone, bandoBar
import * as PIX from './pixel.js';
import { ENEMIES } from './combat.js';
import { BAR_STORIA as B, BAR, ASPETTO } from './data/dialoghi.js';
import { ARMI_BAR, ARMI, AFFILATURA } from './data/armi.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const metro = v => { const n = Math.round(clamp(v, 0, 100) / 10); return '█'.repeat(n) + '░'.repeat(10 - n); };
const mescola = arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- Nemici del bar (aggiunti a ENEMIES di src/combat.js senza toccarlo) ----------
const human = o => [0, 1, 2].map(f => PIX.mirror(PIX.humanoid(o, f)));
const NEMICI_BAR = {
  tarcisio: {
    name: 'Il Sciur Tarcisio', hp: 22, atk: 5, def: 1, spd: 2, xp: 8, money: 3, size: 8, bar: true,
    frames: () => human(ASPETTO.tarcisio),
    moves: [
      { name: 'Sgabellata storta', pow: 1.2, stress: 2, w: 2 },
      { name: 'Racconto del \'78', pow: 0, stress: 6, w: 2, line: '«Nel \'78 io ero un toro...»' },
      { name: 'Si appisola', pow: 0, stress: 0, skip: true, w: 1, line: 'Tarcisio russa in piedi. Hic.' },
    ],
  },
  geometra: {
    name: 'Geometra Ballarin', hp: 30, atk: 8, def: 2, spd: 5, xp: 18, money: 8, size: 8, bar: true,
    frames: () => human(ASPETTO.geometra),
    moves: [
      { name: 'Metro in faccia', pow: 1, stress: 2, w: 3 },
      { name: 'Citazione del regolamento', pow: 0, stress: 7, w: 2, line: '«Articolo 47, comma 3!»' },
      { name: 'Squadra da disegno', pow: 1.3, stress: 1, w: 1 },
    ],
  },
  ermes: {
    name: 'Cugino Ermes', hp: 70, atk: 14, def: 5, spd: 8, xp: 40, money: 20, size: 8, bar: true,
    frames: () => human(ASPETTO.ermes),
    moves: [
      { name: 'Pacca da cugino', pow: 1.1, stress: 2, w: 3 },
      { name: 'Vanto del trattore', pow: 0, stress: 8, w: 2, line: '«Il mio ha il frigo!»' },
      { name: 'Spallata', pow: 1.5, stress: 2, w: 1 },
    ],
  },
  bruno: {
    name: 'Bruno «il Toro»', hp: 110, atk: 20, def: 8, spd: 6, xp: 80, money: 40, size: 9, bar: true,
    frames: () => human(ASPETTO.bruno),
    moves: [
      { name: 'Carica del Toro', pow: 1.5, stress: 3, w: 2 },
      { name: 'Schiaffone', pow: 1, stress: 2, w: 3 },
      { name: 'Presa in giro', pow: 0, stress: 9, w: 1, line: '«Tuo padre ti paga per dormire?»' },
    ],
  },
  amicoBruno: {
    name: 'Amico di Bruno', hp: 45, atk: 13, def: 4, spd: 7, xp: 20, money: 8, size: 8, bar: true,
    frames: () => human(ASPETTO.amicoBruno),
    moves: [
      { name: 'Spintone', pow: 1, stress: 2, w: 3 },
      { name: 'Risata di gruppo', pow: 0.3, stress: 6, w: 1, line: 'Tutto il bar ride di Garonio.' },
    ],
  },
  rocco: {
    name: 'Rocco il camionista', hp: 170, atk: 26, def: 10, spd: 7, xp: 150, money: 100, size: 9, bar: true,
    frames: () => human(ASPETTO.rocco),
    moves: [
      { name: 'Gomitata da autostrada', pow: 1.2, stress: 3, w: 3 },
      { name: 'Clacson in faccia', pow: 0, stress: 10, w: 1, line: 'POOOOOOO!' },
      { name: 'Quaranta tonnellate', pow: 1.8, stress: 4, w: 1 },
    ],
  },
};
for (const [id, d] of Object.entries(NEMICI_BAR)) ENEMIES[id] ??= d;

// sfondo della piazza per le risse fuori dal bar
const CSS_PIAZZA = `
.place-piazza .b-stage { background: linear-gradient(#f0b070 0%, #f8d8a0 30%, #b8a890 30.5%, #a89880 100%); }
.place-piazza .b-stage::before { content: ''; position: absolute; left: 0; right: 0; top: 10%; height: 21%;
  background: linear-gradient(90deg, #e8c070 0 18%, transparent 18% 22%, #3a7a4a 22% 40%, transparent 40% 44%, #e8a8a0 44% 62%, transparent 62% 66%, #f0e0b0 66% 84%, transparent 84% 88%, #a8c8e0 88%); opacity: .85; }
.place-piazza .b-floor { background: repeating-linear-gradient(90deg, #a89a88 0 46px, #8a7c6a 46px 48px), repeating-linear-gradient(0deg, transparent 0 46px, #8a7c6a 46px 48px); background-blend-mode: multiply; }
`;

// ---------- Briscola ----------
const SEMI = ['Coppe', 'Denari', 'Spade', 'Bastoni'];
const NOMI_CARTE = { 1: 'Asso', 2: 'Due', 3: 'Tre', 4: 'Quattro', 5: 'Cinque', 6: 'Sei', 7: 'Sette', 8: 'Fante', 9: 'Cavallo', 10: 'Re' };
const PUNTI = { 1: 11, 3: 10, 10: 4, 9: 3, 8: 2 };
const FORZA = [2, 4, 5, 6, 7, 8, 9, 10, 3, 1];   // dalla più debole alla più forte
const forza = c => FORZA.indexOf(c.v);
const punti = c => PUNTI[c.v] || 0;
const nomeCarta = (c, br) => `${NOMI_CARTE[c.v]} di ${c.seme}${c.seme === br ? ' ★' : ''}`;

export class Bar {
  constructor(game) { this.game = game; this._azione = null; }
  get s() { return this.game.s; }
  get st() { return this.s.flags.bar; }

  init() {
    const f = this.s.flags;
    f.bar ??= {};
    const st = f.bar;
    st.rispetto ??= B.rispettoIniziale;
    st.risse ??= [];
    st.bandoFino ??= 0;
    st.caffeRe ??= 0;
    st.storie ??= {};
    for (const id of Object.keys(B.avventori)) st.storie[id] ??= { passo: 0, giorno: 0, bevute: 0 };
    for (const [k, v] of Object.entries(ASPETTO)) PIX.CHARACTERS[k] ??= v;
    if (!document.getElementById('css-bar-piazza')) {
      const el = document.createElement('style'); el.id = 'css-bar-piazza'; el.textContent = CSS_PIAZZA; document.head.appendChild(el);
    }
    this.game.on('nuovoGiorno', () => this._nuovoGiorno());
  }

  // ---------- Rispetto e ranghi ----------
  rispetto() { return this.st.rispetto; }
  rango(r = this.st.rispetto) { return [...B.ranghi].reverse().find(x => r >= x.da); }
  re() { return this.st.reBancone || this.st.rispetto >= 80; }
  sconto() { return this.rango().sconto || 0; }
  prezzo(n) { return Math.max(1, Math.round(n * (1 - this.sconto()))); }

  cambiaRispetto(d) {
    const g = this.game, st = this.st, prima = this.rango();
    st.rispetto = clamp(Math.round(st.rispetto + d), 0, 100);
    const dopo = this.rango();
    g.emit('rispetto', { valore: st.rispetto, delta: d, rango: dopo.nome });
    if (dopo !== prima) {
      const su = dopo.da > prima.da;
      g.ui.toast(fill(su ? B.rangoSu : B.rangoGiu, { rango: dopo.nome, sblocca: dopo.sblocca }), su ? 'good' : 'bad');
      if (su && dopo.da >= 40 && !st.thermos) {
        st.thermos = true;
        g.prog.daiVestito('thermos');
        setTimeout(() => g.ui.toast(B.thermos, 'good'), 1200);
      }
    }
  }

  // ---------- Regola di Loredana ----------
  _settimana(d = this.s.day) { return Math.floor((d - 1) / 7); }
  risseSettimana() { return this.st.risse.filter(d => this._settimana(d) === this._settimana()).length; }
  bandito() { return this.st.bandoFino > 0 && this.s.day <= this.st.bandoFino; }

  _contaRissa() {
    const st = this.st, R = B.regolaLoredana;
    st.risse.push(this.s.day);
    st.risse = st.risse.filter(d => this._settimana(d) === this._settimana());
    const n = st.risse.length;
    if (n >= R.risse) {
      st.bandoFino = this.s.day + R.giorni; st.risse = [];
      this.game.emit('bandoBar', { fino: st.bandoFino });
      return { chi: 'barista', testo: R.bando };
    }
    if (n === R.risse - 1) return { chi: 'barista', testo: fill(R.avviso, { n }) };
    return null;
  }

  async ingresso() {
    const g = this.game, s = this.s, st = this.st;
    if (this.bandito()) {
      const giorni = st.bandoFino - s.day + 1;
      await g.ui.dialog([{ name: 'Bar', text: `${pick(B.regolaLoredana.porta)}\n(Bando ancora per ${giorni} giorn${giorni === 1 ? 'o' : 'i'}: torna il giorno ${st.bandoFino + 1}.)` }]);
      return false;
    }
    if (this.rango().da >= 80 && st.caffeRe !== s.day) {
      st.caffeRe = s.day; s.tired = clamp(s.tired - 12, 0, 100);
      g.ui.toast(pick(B.caffeDelRe), 'good');
    }
    return true;
  }

  _nuovoGiorno() {
    const s = this.s, st = this.st;
    if (!st.pinaZitta && s.level >= B.avventori.pina.liv && Math.random() < 0.35) {
      this.cambiaRispetto(-2);
      this.game.ui.toast(pick(B.pinaParla), 'bad');
    }
  }

  // ---------- Chi c'è al bar ----------
  _ora() { return (this.s.minutes / H) % 24; }
  _presente(id) {
    const a = B.avventori[id], h = this._ora();
    return !!a && this.s.level >= a.liv && h >= a.ore[0] && h < a.ore[1] && (!a.serveRe || this.re());
  }
  presenti() {
    return Object.entries(B.avventori).filter(([id]) => this._presente(id)).map(([id, a]) => {
      const sto = this.st.storie[id];
      return { id, nome: a.nome, posto: a.posto, incontro: sto.passo < a.incontri.length ? sto.passo + 1 : null };
    });
  }
  _stato(id) {
    const a = B.avventori[id], sto = this.st.storie[id];
    if (sto.passo >= a.incontri.length) return 'storia finita';
    if (sto.giorno === this.s.day) return 'domani il prossimo incontro';
    return `incontro ${sto.passo + 1}/${a.incontri.length}`;
  }

  // ---------- Scelte da mettere nei menu ----------
  scelteBancone() {
    const g = this.game, r = this.rango();
    const out = [{ label: `Rispetto ${this.st.rispetto}/100 · «${r.nome}»`, fn: () => [this._paginaRispetto()] }];
    if (r.da >= 40) out.push({ label: 'Chiedi a Loredana delle bestie', fn: () => { g.s.minutes += 10; return [{ who: 'barista', name: 'Loredana', text: pick(B.vociBestie) }, g._barMenu(false)]; } });
    return out;
  }

  scelteTavoli() {
    const g = this.game, out = [];
    for (const p of this.presenti()) {
      out.push({ label: `Tavolo: ${p.nome} (${this._stato(p.id)})`, fn: () => { g._barFight = () => this.parlaAvventore(p.id); return null; } });
    }
    const c = g.png?.list?.find(n => n.id === 'consulente');
    if (c && g.png._posto(c.def)) out.push({ label: 'Tavolino del Consulente', fn: () => { g._barFight = () => g.png.parla('consulente'); return null; } });
    return out;
  }

  _paginaRispetto() {
    const st = this.st, r = this.rango(), next = B.ranghi.find(x => x.da > st.rispetto);
    const risse = this.risseSettimana();
    const righe = [
      `Rispetto ${st.rispetto}/100  ${metro(st.rispetto)}`,
      `Rango: «${r.nome}» — ${r.sblocca}.`,
      next ? `Prossimo: «${next.nome}» a ${next.da} (${next.sblocca}).` : 'Sei in cima. Più in alto c\'è solo il soffitto.',
      `Risse questa settimana: ${risse}/${B.regolaLoredana.risse}.`,
      '',
      ...Object.entries(B.avventori).filter(([id, a]) => this.s.level >= a.liv && (!a.serveRe || this.re()))
        .map(([id, a]) => `${a.nome}: ${this._stato(id)}`),
    ];
    const bloccati = Object.values(B.avventori).filter(a => this.s.level < a.liv).map(a => `${a.nome} (liv ${a.liv})`);
    if (bloccati.length) righe.push(`Non ancora al bar: ${bloccati.join(', ')}.`);
    return { who: 'barista', name: 'Loredana', text: righe.join('\n'), choices: [{ label: 'Torna al bancone', fn: () => [this.game._barMenu(false)] }] };
  }

  // ---------- Parlare con un avventore ----------
  async parlaAvventore(id) {
    const g = this.game, a = B.avventori[id]; if (!a) return;
    const sto = this.st.storie[id], s = this.s;
    this._azione = null;
    const choices = [];
    if (sto.passo < a.incontri.length && sto.giorno !== s.day) {
      const inc = a.incontri[sto.passo];
      choices.push({ label: `Incontro ${sto.passo + 1}/${a.incontri.length}: «${inc.titolo}»`, fn: () => { this._azione = () => this._incontro(id); return null; } });
    }
    if (id === 'tarcisio' && this.rango().da >= 20) {
      choices.push({ label: `Briscola (${B.briscola.posta}€)`, disabled: s.money < B.briscola.posta, fn: () => { this._azione = () => this.briscola(); return null; } });
    }
    choices.push({ label: 'Lascia stare', fn: null });
    let text = pick(a.chiacchiere);
    if (sto.passo >= a.incontri.length) text = `${a.fine}\n\n${text}`;
    else if (sto.giorno === s.day) text += '\n(Per oggi basta così: il prossimo incontro domani.)';
    await g.ui.dialog([{ who: id, name: a.nome, text, choices }]);
    const fn = this._azione; this._azione = null;
    if (fn) await fn();
    g.emit('parlato', { png: id });
  }

  async _incontro(id) {
    const g = this.game, a = B.avventori[id], sto = this.st.storie[id], s = this.s;
    const inc = a.incontri[sto.passo];
    sto.giorno = s.day;
    g.audio.setScene('rabbia');
    let vinto = false;
    if (inc.serveAmico && sto.bevute >= inc.serveAmico) vinto = true;      // Tarcisio amico: racconta e basta
    else if (inc.tipo === 'quiz' || inc.tipo === 'gara' || inc.tipo === 'braccio') {
      const ok = await this['_' + inc.tipo](id, inc);
      if (!ok) this.cambiaRispetto(-(inc.tipo === 'quiz' ? 3 : inc.tipo === 'gara' ? 4 : 5));
      else if (inc.rissa) vinto = (await this.rissa(id, { nemici: inc.nemici, piazza: inc.piazza })) === 'win';
      else { vinto = true; this.cambiaRispetto(B.rispetto.vittoriaParole); }
    } else {
      const esito = await this._duello(id, inc);
      if (esito === 'vinto') vinto = true;
      else if (esito === 'rissa') vinto = (await this.rissa(id, { nemici: inc.nemici, piazza: inc.piazza })) === 'win';
    }
    if (vinto && inc.serveAmico && sto.bevute < inc.serveAmico) {
      await g.ui.dialog([{ who: id, name: a.nome, text: inc.nonAmico }]);
      vinto = false;
    }
    if (vinto) await this._avanza(id, inc);
    g.audio.setScene('bar');
  }

  async _avanza(id, inc) {
    const g = this.game, a = B.avventori[id], st = this.st, sto = st.storie[id];
    sto.passo++;
    const pages = [{ who: id, name: a.nome, text: inc.vinto || inc.vintoQuiz || '' }].filter(p => p.text);
    if (inc.leggenda) {
      pages.push(...inc.leggenda.map(t => ({ who: id, name: a.nome, text: t })));
      g.emit('voce', { bestia: 're_lupi', da: id });
    }
    if (inc.segreto) {
      pages.push(...inc.segreto.map(t => ({ who: id, name: a.nome, text: t })));
      g.emit('voce', { bestia: 're_nutrie', da: id });
    }
    const fine = sto.passo >= a.incontri.length;
    if (fine && id === 'pina') st.pinaZitta = true;
    if (inc.premio === 'mappaCatastale') { st.mappaCatastale = true; g.emit('mappaCatastale', {}); g.ui.toast('Hai la mappa catastale del \'62: tane e fossi segnati!', 'good'); }
    if (inc.premio === 'rimorchio') { st.rimorchio = true; g.emit('rimorchio', {}); g.ui.toast('Ermes ti presta il rimorchio!', 'good'); }
    if (inc.premio === 'reBancone') {
      st.reBancone = true;
      if (st.rispetto < 85) this.cambiaRispetto(85 - st.rispetto);
      g.emit('reBancone', {});
    }
    if (inc.premio === 'rocco') { st.roccoBattuto = true; g._xp?.(30); }
    if (fine) pages.push({ text: `★ Storia di ${a.nome} completata. ${a.fine}` });
    g.emit('avventore', { id, passo: sto.passo, fine });
    g._xp?.(5 + a.liv);
    if (pages.length) await g.ui.dialog(pages);
  }

  // ---------- Il duello a parole: Orgoglio e Rabbia ----------
  _duello(id, inc, { casuale = false } = {}) {
    const g = this.game, s = this.s, P = g.prog, C = B.scelte, T = B.testiScelte;
    const a = B.avventori[id] || { nome: inc.nome };
    const nome = a.nome, v = { nome };
    const sto = this.st.storie[id];
    const st = { orgoglio: inc.orgoglio ?? 60, rabbia: inc.rabbia ?? 20, ignora: 0, parole: false, esito: null };
    const mulRabbia = Math.max(0.3, 1 - P.bonus('rabbiaAvventori'));
    const mulStress = Math.max(0.2, 1 - P.bonus('stressPreseInGiro'));
    const bonusTono = P.bonus('rispostaATono') + (this.st.rispetto - 30) / 300;
    const stress = n => { s.stress = clamp(s.stress + n, 0, 100); };
    const battuta = () => pick(inc.battute || ['...']);
    const narr = t => ({ text: fill(pick(t), v) });
    const gar = t => ({ who: 'garonio', name: 'Garonio', text: pick(t) });

    const fine = () => {
      if (st.orgoglio <= 0) {
        st.esito = 'vinto';
        const r = casuale ? B.rispetto.casuale : B.rispetto.vittoriaParole;
        this.cambiaRispetto(r); stress(-5); g._xp?.(3);
        return [{ text: fill(pick(T.umiliato), { nome, r }) }];
      }
      if (st.rabbia >= 100) {
        if (a.parole) {
          st.esito = 'via'; const r = B.rispetto.pinaPersa; this.cambiaRispetto(-r);
          return [{ text: fill(T.pinaVia, { r }) }];
        }
        st.esito = 'rissa';
        return [{ who: id, name: nome, text: fill(pick(T.rissa), v) }];
      }
      if (st.ignora >= C.ignora.maxIgnora) {
        st.esito = 'via'; const r = B.rispetto.ignorato; this.cambiaRispetto(-r);
        return [{ text: fill(T.scappato, { nome, r }) }];
      }
      return null;
    };
    const turno = (...prima) => { const f = fine(); return f ? [...prima, ...f] : [...prima, pagina(battuta())]; };

    const pagina = testo => {
      const prezzo = this.prezzo(C.offri.prezzo);
      const choices = [
        { label: C.rispondi.etichetta, fn: () => {
          if (Math.random() < C.rispondi.riuscita + bonusTono) {
            st.orgoglio -= rnd(...C.rispondi.orgoglio); st.rabbia += C.rispondi.rabbia * mulRabbia;
            return turno(gar(inc.risposte || ['Ah sì? Pensa per te.']), narr(T.rispondiBene));
          }
          st.rabbia += C.rispondi.rabbiaMale * mulRabbia; stress(C.rispondi.stressMale * mulStress);
          return turno(narr(T.rispondiMale));
        } },
        { label: `${C.ignora.etichetta} (stress +${Math.round(C.ignora.stress * mulStress)})`, fn: () => {
          st.ignora++; st.rabbia = Math.max(0, st.rabbia + C.ignora.rabbia); stress(C.ignora.stress * mulStress);
          return turno(narr(T.ignora));
        } },
      ];
      if (P.bonus('offriDaBere') || a.offriSempre) choices.push({
        label: `${C.offri.etichetta} (${prezzo}€)`, disabled: s.money < prezzo, fn: () => {
          s.money -= prezzo; st.rabbia = Math.max(0, st.rabbia + C.offri.rabbia); st.orgoglio -= C.offri.orgoglio;
          if (sto && !casuale) sto.bevute++;
          g.audio.sfx('coin');
          return turno(narr(T.offri));
        } });
      choices.push({ label: C.provoca.etichetta, fn: () => {
        st.rabbia += C.provoca.rabbia * mulRabbia;
        if (Math.random() < C.provoca.riuscita + bonusTono) { st.orgoglio -= rnd(...C.provoca.orgoglio); return turno(narr(T.provocaBene)); }
        return turno(narr(T.provocaMale));
      } });
      if (P.bonus('vittoriaAParole') && !st.parole) choices.push({ label: C.parole.etichetta, fn: () => {
        st.parole = true;
        if (Math.random() < C.parole.riuscita + bonusTono) { st.orgoglio = 0; return turno({ text: fill(T.paroleBene, v) }); }
        st.rabbia += 15 * mulRabbia; return turno({ text: T.paroleMale });
      } });
      return {
        who: id, name: nome,
        text: `${testo}\n\nOrgoglio ${metro(st.orgoglio)}  Rabbia ${metro(st.rabbia)}`,
        choices,
      };
    };

    const intro = inc.intro ? [{ who: id, name: nome, text: inc.intro }] : [];
    return g.ui.dialog([...intro, pagina(battuta())]).then(() => st.esito || 'via');
  }

  // ---------- Rissa con le armi da bar ----------
  async rissa(id, { nemici = null, piazza = false } = {}) {
    const g = this.game, s = this.s, P = g.prog, a = B.avventori[id];
    const nemico = a?.nemico || (ENEMIES[id] ? id : 'ubriaco');
    let arma = 'mani', aParole = false;
    const choices = Object.entries(ARMI_BAR).map(([k, w]) => ({
      label: `${w.nome} (attacco +${w.atk}${w.rispetto ? ', più rispetto' : ''})`, fn: () => { arma = k; return null; },
    }));
    if (P.bonus('vittoriaAParole')) choices.push({ label: 'Calmalo a parole prima di cominciare (Parlantina)', fn: () => { aParole = true; return null; } });
    await g.ui.dialog([{ name: 'Rissa!', text: B.rissa.scegliArma, choices }]);
    if (aParole && Math.random() < 0.5 + P.bonus('rispostaATono')) {
      this.cambiaRispetto(B.rispetto.vittoriaParole);
      await g.ui.dialog([{ text: `Garonio parla piano, guarda negli occhi, appoggia una mano sulla spalla. ${a?.nome || 'L\'avventore'} si risiede. Rissa vinta senza un pugno. Rispetto +${B.rispetto.vittoriaParole}` }]);
      return 'win';
    }
    const w = ARMI_BAR[arma];
    const orig = Object.getPrototypeOf(P).atk;
    P.atk = function () {
      const fuori = (ARMI[this.p.arma]?.atk || 0) + (this.p.affilatura[this.p.arma] || 0) * AFFILATURA.atk;
      return orig.call(this) - fuori + w.atk;
    };
    let res;
    try {
      const nomi = (nemici || [nemico]).map(n => ENEMIES[n]?.name || n);
      const intro = piazza ? `Tutti fuori, in piazza! ${nomi[0]} si toglie la giacca. Garonio impugna: ${w.nome.toLowerCase()}.`
        : `${nomi[0]} si piazza davanti a Garonio. Garonio impugna: ${w.nome.toLowerCase()}.`;
      res = await g.combat.start({ enemies: nemici || [nemico], place: piazza ? 'piazza' : 'bar', intro });
    } finally { delete P.atk; }
    const pages = [];
    if (res === 'win') {
      const r = Math.round(B.rispetto.rissaVinta * (1 + (w.rispetto || 0)));
      this.cambiaRispetto(r); pages.push({ text: fill(B.rissa.vinta, { r }) });
    } else if (res === 'lose') {
      const r = B.rispetto.rissaPersa; this.cambiaRispetto(-r); s.stress = clamp(s.stress + 10, 0, 100);
      pages.push({ text: fill(B.rissa.persa, { r }) });
    } else {
      const r = B.rispetto.fuga; this.cambiaRispetto(-r); pages.push({ text: fill(B.rissa.fuga, { r }) });
    }
    const loredana = this._contaRissa();
    if (loredana) pages.push({ who: 'barista', name: 'Loredana', text: loredana.testo });
    g.audio.setScene('bar');
    await g.ui.dialog(pages);
    return res;
  }

  // ---------- Un avventore attacca bottone mentre ordini ----------
  provocazione() {
    const g = this.game, s = this.s, r = this.rango();
    const pool = this.presenti().map(p => p.id).filter(id => {
      const a = B.avventori[id];
      if (r.da >= 60 && a.liv < 5) return false;             // i deboli non ti sfidano più
      return this.st.storie[id].passo < a.incontri.length;   // chi è diventato amico non provoca
    });
    if (s.level >= 3 && r.da < 60) pool.push('bullo');
    if (!pool.length) return null;
    const id = pick(pool);
    const gen = BAR.avventori.find(x => x.id === id);
    const a = B.avventori[id];
    const nome = gen?.nome && id === 'bullo' ? 'Il bullo del paese' : a?.nome || gen?.nome;
    const battute = gen?.battute || a.incontri[0].battute;
    const inc = { nome, battute, risposte: gen?.risposteBuone || a.incontri[0].risposte, orgoglio: 45, rabbia: 25 };
    g.audio.setScene('rabbia');
    const back = () => { g.audio.setScene('bar'); return g._barMenu(false); };
    const ign = B.scelte.ignora.stress;
    return [{
      who: PIX.CHARACTERS[id] ? id : undefined, name: nome, text: pick(battute),
      choices: [
        { label: 'Raccogli la sfida (duello a parole)', fn: () => { g._barFight = () => this._sfidaCasuale(id, inc); return null; } },
        { label: `Fai finta di niente (stress +${ign}, rispetto -1)`, fn: () => {
          s.stress = clamp(s.stress + ign, 0, 100); this.cambiaRispetto(-1);
          return [{ text: pick(B.testiScelte.ignora) }, back()];
        } },
      ],
    }];
  }

  async _sfidaCasuale(id, inc) {
    const g = this.game;
    g.audio.setScene('rabbia');
    const esito = await this._duello(id, inc, { casuale: true });
    if (esito === 'rissa') {
      const nemico = id === 'bullo' ? 'bullo' : B.avventori[id]?.nemico || 'ubriaco';
      await this.rissa(id, { nemici: [nemico] });
    }
    g.audio.setScene('bar');
  }

  // ---------- Mini-giochi degli incontri ----------
  _quiz(id, inc) {
    const g = this.game, a = B.avventori[id];
    let giuste = 0;
    const pages = [{ who: id, name: a.nome, text: inc.intro }];
    inc.domande.forEach((q, n) => {
      const ord = mescola(q.r.map((t, i) => ({ t, i })));
      pages.push({
        who: id, name: a.nome, text: `Domanda ${n + 1}/${inc.domande.length}: ${q.d}`,
        choices: ord.map(o => ({ label: o.t, fn: () => {
          if (o.i === q.giusta) { giuste++; return [{ text: 'Giusto! Ballarin si morde il labbro.' }]; }
          return [{ text: `Sbagliato. «${q.r[q.giusta]}», ovviamente. Ballarin annota qualcosa.` }];
        } })),
      });
    });
    return g.ui.dialog(pages).then(async () => {
      const ok = giuste >= inc.soglia;
      await g.ui.dialog([{ who: id, name: a.nome, text: `${giuste}/${inc.domande.length} risposte giuste. ${ok ? inc.vintoQuiz : inc.persoQuiz}` }]);
      return ok;
    });
  }

  _gara(id, inc) {
    const g = this.game, a = B.avventori[id];
    let punti = 0;
    const pages = [{ who: id, name: a.nome, text: inc.intro }];
    inc.tratti.forEach((tr, n) => {
      pages.push({
        text: `Tratto ${n + 1}/${inc.tratti.length}: ${tr.d}`,
        choices: tr.r.map(o => ({ label: `${o.t}${o.rischio >= 0.4 ? ' (rischioso)' : ''}`, fn: () => {
          if (Math.random() < o.rischio) { punti -= 1; return [{ text: inc.male }]; }
          punti += o.guadagno; return [{ text: o.guadagno ? inc.bene : 'Vai tranquillo. Ermes intanto guadagna terreno.' }];
        } })),
      });
    });
    return g.ui.dialog(pages).then(async () => {
      const ermes = inc.ermes + (Math.random() * 2 - 1);
      const ok = punti > ermes;
      await g.ui.dialog([{ who: ok ? id : undefined, name: ok ? a.nome : undefined, text: `Traguardo! Tu ${punti} punti, Ermes ${ermes.toFixed(1)}. ${ok ? inc.vintaGara : inc.persaGara}` }]);
      return ok;
    });
  }

  _braccio(id, inc) {
    const g = this.game, s = this.s, a = B.avventori[id];
    let pos = 50, round = 0, esito = null;
    const extra = Math.max(0, (g.prog.atk() - 20) / 6);   // più sei forte, più spingi
    const barra = () => { const k = Math.round(pos / 5); return `Garonio ${'█'.repeat(k)}${'░'.repeat(20 - k)} ${a.nome.split(' ')[0]}`; };
    const page = msg => ({
      who: id, name: a.nome, text: `${msg}\n\n${barra()}\nRound ${round + 1}/6`,
      choices: inc.mosse.map(m => ({ label: `${m.t}${m.rischio >= 0.4 ? ' (rischioso)' : ''}`, fn: () => {
        round++; s.tired = clamp(s.tired + m.fatica, 0, 100);
        const lui = rnd(...inc.bruno);
        let txt;
        if (Math.random() < m.rischio) { pos -= lui + 6; txt = `${m.t}... ti scivola il gomito! ${a.nome.split(' ')[0]} ne approfitta.`; }
        else { pos += m.forza + extra - lui; txt = `${m.t}! ${m.forza + extra > lui ? 'Il braccio avversario cede un po\'.' : 'Non si muove. È come spingere un trattore.'}`; }
        pos = clamp(pos, 0, 100);
        if (pos >= 100 || pos <= 0 || round >= 6) { esito = pos > 50; return [{ text: `${txt}\n\n${barra()}` }]; }
        return [page(txt)];
      } })),
    });
    return g.ui.dialog([{ who: id, name: a.nome, text: inc.intro }, page('Tre, due, uno... via!')]).then(async () => {
      const ok = !!esito;
      await g.ui.dialog([{ who: id, name: a.nome, text: ok ? inc.vintaBraccio : inc.persoBraccio }]);
      return ok;
    });
  }

  // ---------- Briscola col Tarcisio ----------
  async briscola() {
    const g = this.game, s = this.s, Bc = B.briscola;
    if (s.money < Bc.posta) { await g.ui.dialog([{ who: 'tarcisio', name: 'Tarcisio', text: Bc.poco }]); return; }
    s.money -= Bc.posta;
    const mazzo = mescola(SEMI.flatMap(seme => Array.from({ length: 10 }, (_, i) => ({ seme, v: i + 1 }))));
    const br = mazzo[mazzo.length - 1].seme;
    const mano = [mazzo.pop(), mazzo.pop(), mazzo.pop()];
    const lui = [mazzo.pop(), mazzo.pop(), mazzo.pop()];
    let tuoi = 0, suoi = 0, m = 0;
    // Tarcisio gioca la carta che vale meno (ogni tanto sbaglia: hic)
    const giocaLui = () => {
      const i = Math.random() < 0.25 ? rnd(0, lui.length - 1)
        : lui.reduce((b, c, k) => (punti(c) + (c.seme === br ? 6 : 0) < punti(lui[b]) + (lui[b].seme === br ? 6 : 0) ? k : b), 0);
      return lui.splice(i, 1)[0];
    };
    const vince2 = (c1, c2) => c2.seme === c1.seme ? forza(c2) > forza(c1) : c2.seme === br;
    const pagina = (msg = '') => {
      const sua = giocaLui();
      return {
        who: 'tarcisio', name: 'Tarcisio',
        text: `${msg}${msg ? '\n' : ''}Mano ${m + 1}/${Bc.mani} · Briscola: ${br} ★ · Tu ${tuoi} - ${suoi} Tarcisio\nTarcisio gioca: ${nomeCarta(sua, br)}. Tu cosa giochi?`,
        choices: mano.map((c, i) => ({ label: nomeCarta(c, br), fn: () => {
          const tua = mano.splice(i, 1)[0];
          const p = punti(tua) + punti(sua);
          const vinci = vince2(sua, tua);
          if (vinci) tuoi += p; else suoi += p;
          m++;
          if (mazzo.length) mano.push(mazzo.pop());
          if (mazzo.length) lui.push(mazzo.pop());
          const esito = `${vinci ? 'Prendi tu' : 'Prende Tarcisio'} (${p} punti).`;
          if (m >= Bc.mani) return [{ who: 'tarcisio', name: 'Tarcisio', text: `${esito}\nFine: tu ${tuoi}, Tarcisio ${suoi}.` }];
          return [pagina(esito)];
        } })),
      };
    };
    await g.ui.dialog([{ who: 'tarcisio', name: 'Tarcisio', text: Bc.intro }, pagina()]);
    s.minutes += 20;
    let text;
    if (tuoi > suoi) { s.money += Bc.posta * 2; this.cambiaRispetto(2); g.audio.sfx('coin'); text = fill(Bc.vinta, { tuoi, suoi, soldi: Bc.posta }); }
    else if (tuoi < suoi) text = fill(Bc.persa, { tuoi, suoi, soldi: Bc.posta });
    else text = fill(Bc.pari, { tuoi, suoi });
    g.emit('briscola', { vinta: tuoi > suoi, tuoi, suoi });
    await g.ui.dialog([{ who: 'tarcisio', name: 'Tarcisio', text }]);
  }

  // ---------- Scorciatoie per provare (console: garonio.bar.prova...) ----------
  provaRispetto(n) { this.cambiaRispetto(n - this.st.rispetto); return this.st.rispetto; }
  provaStoria(id, passo) { const sto = this.st.storie[id]; sto.passo = passo; sto.giorno = 0; return sto; }
  provaSbanna() { this.st.bandoFino = 0; this.st.risse = []; }
}
