// Scommesse al bar (GDD 22): il Consulente, al suo tavolino, prende le puntate.
// - la gara delle 18 tra Ermes e Mister Frank (una al giorno, si paga alle 18)
// - Garonio stesso nella prossima gara di trattori (src/gare.js), a quota secondo il rivale
// - la prossima rissa di Garonio, al bar o in piazza: su di sé o «contro» (la combine)
// - la rissa della sera tra due avventori (subito, con la cronaca)
// Quanto si può puntare dipende dal rango al bar; le vincite grosse alzano il rispetto,
// giocarsi tutto lo abbassa. Testi e numeri: SCOMMESSE in src/data/mercato.js.
//
// API (game.scommesse):
//   aperte()          le scommesse in sospeso [{ tipo, posta, quota, su, ... }]
//   massimo()         puntata massima col rango attuale
// Eventi mandati: scommessa { tipo, posta, vinta, soldi }
// Stato: s.flags.scommesse = { aperte: [], garaFinta: giorno, avventori: giorno, vinte, perse }
import { SCOMMESSE as S, GARE } from './data/mercato.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export class Scommesse {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get f() { return this.s.flags.scommesse; }

  init() {
    const g = this.game;
    this.s.flags.scommesse ??= {};
    const f = this.f; f.aperte ??= []; f.vinte ??= 0; f.perse ??= 0;
    g.png?.aggiungiScelte?.('consulente', () => [{ label: S.testi.scelta, fn: () => [this._menu()] }]);
    g.on('ora', ({ ora }) => { if (ora === S.oraGaraFinta) this._garaFinta(); });
    g.on('gara', e => this._tuaGara(e));
    g.on('combattimento', e => { if (e.place === 'bar' || e.place === 'piazza') this._rissa(e.esito); });
    g.on('nuovoGiorno', () => { f.aperte = f.aperte.filter(b => b.tipo !== 'garaFinta'); }); // le scommesse della sera non pagate scadono
    g.pilot?.sezione?.('Scommesse', () => this._pilot());
  }

  aperte() { return this.f.aperte; }
  massimo() {
    const r = this.game.bar?.rispetto?.() ?? 0;
    return [...S.puntate].reverse().find(p => r >= p.da).max;
  }
  _ha(tipo) { return this.f.aperte.some(b => b.tipo === tipo); }

  // ---------- Menu del Consulente ----------
  _pagina(text, choices) { return { who: 'consulente', name: 'Il Consulente', text, choices }; }

  _menu() {
    const s = this.s, T = S.testi, max = this.massimo();
    const h = (s.minutes / H) % 24;
    const scaduta = this.f.garaFinta === s.day || h >= S.oraGaraFinta;
    const choices = [
      { label: T.garaTitolo + (this._ha('garaFinta') ? ' ✔' : scaduta ? ' (chiusa)' : ''), disabled: this._ha('garaFinta') || scaduta, fn: () => [this._sceltaGaraFinta()] },
      { label: T.tuaGaraTitolo + (this._ha('tuaGara') ? ' ✔' : ''), disabled: this._ha('tuaGara') || !this.game.gare?.rivali().length, fn: () => [this._sceltaTuaGara()] },
      { label: T.rissaTitolo + (this._ha('rissa') ? ' ✔' : ''), disabled: this._ha('rissa'), fn: () => [this._sceltaRissa()] },
      { label: T.avventoriTitolo + (this.f.avventori === s.day ? ' (fatta)' : ''), disabled: this.f.avventori === s.day || h < 17, fn: () => [this._sceltaAvventori()] },
      { label: 'Niente, grazie', fn: null },
    ];
    let text = T.menu;
    if (max < 25) text += '\n' + fill(T.zimbello, { max });
    const aperte = this.f.aperte.map(b => `• ${b.desc}: ${b.posta}€ a ${b.quota}`).join('\n');
    if (aperte) text += `\n\nSul tovagliolino:\n${aperte}`;
    return this._pagina(text, choices);
  }

  // scelta della posta, poi registra la scommessa
  _posta(desc, quota, dati, dopo = null) {
    const s = this.s, max = this.massimo();
    const tagli = [...new Set([5, 10, 25, 50, 100, 200].filter(x => x <= max).concat([max]))].sort((a, b) => a - b);
    return this._pagina(`${desc} · quota ${quota}\n${fill(S.testi.quanto, { max })}`, [
      ...tagli.map(p => ({ label: `${p}€ (ne vinci ${Math.round(p * quota)})`, disabled: s.money < p, fn: () => {
        s.money -= p; this.game.audio.sfx('coin');
        const b = { ...dati, desc, posta: p, quota, giorno: s.day };
        if (dopo) return dopo(b);
        this.f.aperte.push(b);
        return [this._pagina(S.testi.accettata)];
      } })),
      { label: 'Ci ripenso', fn: null },
    ]);
  }

  _sceltaGaraFinta() {
    const s = this.s, T = S.testi;
    // le quote cambiano un po' ogni giorno
    const qE = +(1.5 + ((s.day * 37) % 10) / 10).toFixed(1), qF = +(1.4 + ((s.day * 53) % 12) / 10).toFixed(1);
    return this._pagina(T.gara, [
      { label: `Ermes (quota ${qE})`, fn: () => [this._posta('Gara delle 18: Ermes', qE, { tipo: 'garaFinta', su: 'ermes' })] },
      { label: `Mister Frank (quota ${qF})`, fn: () => [this._posta('Gara delle 18: Frank', qF, { tipo: 'garaFinta', su: 'frank' })] },
      { label: 'Ci ripenso', fn: null },
    ]);
  }

  _sceltaTuaGara() {
    const rivali = this.game.gare.rivali();
    return this._pagina(S.testi.tuaGara, [
      ...rivali.map(r => ({ label: `Contro ${r.nome} (quota ${r.quota})`, fn: () => [this._posta(`Tu contro ${r.nome}`, r.quota, { tipo: 'tuaGara', su: r.id })] })),
      { label: 'Ci ripenso', fn: null },
    ]);
  }

  _sceltaRissa() {
    const T = S.testi, Q = S.quote;
    return this._pagina(T.rissa, [
      { label: fill(T.suTe, { q: Q.teStessoRissa }), fn: () => [this._posta('Prossima rissa: su di te', Q.teStessoRissa, { tipo: 'rissa', su: 'te' })] },
      { label: fill(T.controTe, { q: Q.controTeStesso }), fn: () => [this._posta('Prossima rissa: contro di te', Q.controTeStesso, { tipo: 'rissa', su: 'contro' })] },
      { label: 'Ci ripenso', fn: null },
    ]);
  }

  _sceltaAvventori() {
    const s = this.s, T = S.testi;
    const sf = T.sfide[s.day % T.sfide.length];
    const esegui = lato => b => {
      this.f.avventori = s.day;
      // la quota bassa è la favorita: probabilità circa 1/quota, normalizzata
      const pa = (1 / sf.qa) / (1 / sf.qa + 1 / sf.qb);
      const vince = Math.random() < pa ? 'a' : 'b';
      const cron0 = fill(pick(T.cronaca), { v: sf[vince], p: sf[vince === 'a' ? 'b' : 'a'] });
      const cron = cron0.replace(/(^|\. )([a-z])/g, (m, a, c) => a + c.toUpperCase());
      const msg = this._paga(b, vince === lato);
      return [this._pagina(cron), this._pagina(msg)];
    };
    return this._pagina(fill(T.avventori, sf), [
      { label: `${sf.a} (quota ${sf.qa})`, fn: () => [this._posta(`Rissa: ${sf.a}`, sf.qa, { tipo: 'avventori' }, esegui('a'))] },
      { label: `${sf.b} (quota ${sf.qb})`, fn: () => [this._posta(`Rissa: ${sf.b}`, sf.qb, { tipo: 'avventori' }, esegui('b'))] },
      { label: 'Ci ripenso', fn: null },
    ]);
  }

  // ---------- Pagamenti ----------
  // incassa (o no) e sistema il rispetto; restituisce il testo da mostrare
  _paga(b, vinta, { rispettoExtra = 0 } = {}) {
    const g = this.game, s = this.s, T = S.testi, f = this.f;
    f.aperte = f.aperte.filter(x => x !== b);
    let msg;
    if (vinta) {
      const soldi = Math.round(b.posta * b.quota);
      s.money += soldi; f.vinte++;
      g.audio.sfx('coin');
      msg = fill(T.vinta, { soldi });
      if (soldi - b.posta >= 20) { g.bar?.cambiaRispetto?.(S.rispettoVincita); msg += ' ' + fill(T.grossa, { r: S.rispettoVincita }); }
      g.emit('scommessa', { tipo: b.tipo, posta: b.posta, vinta: true, soldi });
    } else {
      f.perse++;
      msg = fill(T.persa, { posta: b.posta });
      if (s.money <= 0) { g.bar?.cambiaRispetto?.(-S.rispettoBancarotta); msg += ' ' + fill(T.bancarotta, { r: S.rispettoBancarotta }); }
      g.emit('scommessa', { tipo: b.tipo, posta: b.posta, vinta: false, soldi: 0 });
    }
    if (rispettoExtra) g.bar?.cambiaRispetto?.(rispettoExtra);
    return msg;
  }

  _garaFinta() {
    const s = this.s, f = this.f;
    f.garaFinta = s.day;
    const b = f.aperte.find(x => x.tipo === 'garaFinta'); if (!b) return;
    // la favorita è quella con la quota più bassa... ma non sempre
    const vince = Math.random() < 0.5 ? 'ermes' : 'frank';
    const msg = this._paga(b, b.su === vince);
    this.game.ui.toast(`🚜 ${pick(S.testi.garaRisultato[vince])} ${msg}`, b.su === vince ? 'good' : 'bad');
  }

  _tuaGara(e) {
    const b = this.f.aperte.find(x => x.tipo === 'tuaGara' && x.su === e.rivale); if (!b) return;
    const msg = this._paga(b, e.esito === 'vinta');
    setTimeout(() => this.game.ui.toast(`🎲 ${GARE.rivali[e.rivale].nome}: ${msg}`, e.esito === 'vinta' ? 'good' : 'bad'), 400);
  }

  _rissa(esito) {
    const b = this.f.aperte.find(x => x.tipo === 'rissa'); if (!b) return;
    const g = this.game, T = S.testi;
    let msg;
    if (b.su === 'te') msg = this._paga(b, esito === 'win');
    else if (esito === 'lose') {
      const r = 4;
      this._paga(b, true, { rispettoExtra: -r });
      msg = fill(T.combineVinta, { soldi: Math.round(b.posta * b.quota), r });
    } else { this._paga(b, false); msg = esito === 'win' ? T.combinePersa : fill(T.persa, { posta: b.posta }); }
    setTimeout(() => g.ui.toast(`🎲 ${msg}`, /vinta|passa/.test(msg) ? 'good' : 'bad'), 400);
  }

  // ---------- Pilot di prova (?pilot) ----------
  _pilot() {
    const g = this.game;
    return [
      { label: '🎲 Apri le scommesse del Consulente', fn: () => { g.s.money = Math.max(g.s.money, 100); return [this._menu()]; } },
      { label: '🕕 Fai correre subito la gara delle 18', fn: () => { this._garaFinta(); return null; } },
    ];
  }
}
