// Il telefonino a conchiglia di Garonio (GDD 22): tasto T o pulsante 📱.
//  - chiamate in arrivo: squilla con la suoneria scelta, vibra, banner con Rispondi / Rifiuta (T / X);
//    se nessuno risponde diventa «chiamata persa».
//  - il Gigante chiama per sollecitare la missione del giorno, per dare lavoretti (missioni secondarie
//    lampo, pagate con una telefonata) e per le truffe del lavoro «cascine» (src/cascine.js);
//  - Mister Mountain chiama a sorpresa ogni due o tre giorni: stress. Se lo rifiuti richiama;
//  - SMS: la Mamma, il Bubetto, il Gigante quando non rispondi, Mister Mountain in maiuscolo, e il
//    Consulente con la dritta del mattino (dal livello 5 di amicizia, src/consulente.js);
//  - rubrica: chiami tu Gigante, Mamma (stress giù, una volta al giorno), Consulente (una dritta al giorno),
//    Zeno (umore dell'officina), Bubetto e... NON RISPONDERE;
//  - suonerie da scegliere, modalità silenziosa, registro chiamate.
// Testi e numeri: src/data/telefono.js. Stato salvato: game.s.flags.telefono.
//
// API (game.telefono):
//   apri() / chiudi() / aperto()
//   sms(da, testo, nome?)              arriva un messaggio (da: id del contatto, es. 'consulente')
//   chiama(chi, motivo?, dati?)        fa squillare il telefono (chi: 'gigante' | 'mountain' | 'mamma' ...)
//   nonLetti()                         quanti SMS da leggere
// Eventi mandati: telefono { tipo: 'risposta' | 'rifiutata' | 'persa' | 'chiamata' | 'sms', chi }
import * as PIX from './pixel.js';
import { TEL, CONTATTI, SUONERIE, SUONERIA_MOUNTAIN, TESTI as T } from './data/telefono.js';
import { pick, fill, ora } from './racconto.js';

const H = 60, DAY = 24 * H;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const hhmm = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m % 60)).padStart(2, '0')}`;
function h(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }

export class Telefono {
  constructor(game) {
    this.game = game;
    this.coda = [];          // chiamate in attesa di squillare
    this.squillo = null;     // chiamata che sta squillando { chi, motivo, dati, fine }
    this.vista = 'home';     // home | menu | sms | leggi | rubrica | registro | suonerie | chiamata
    this.sel = 0;
    this.el = null;
  }
  get s() { return this.game.s; }
  get st() { return this.s.flags.telefono; }
  get ui() { return this.game.ui; }
  _abs() { return this.s.day * DAY + this.s.minutes; }

  init() {
    const g = this.game;
    this.s.flags.telefono ??= {};
    const st = this.st;
    st.sms ??= []; st.registro ??= []; st.suoneria ??= 'polka'; st.silenzioso ??= false;
    st.richiamate ??= []; st.commissioni ??= {}; st.mmRifiuti ??= 0;
    st.mmProssima ??= this._abs() + Math.round(rand(...TEL.mountainOgniGiorni) * DAY);
    this._css(); this._build();
    g.moduli.push(this);
    g.on('ora', d => this._ora(d.ora));
    g.on('nuovoGiorno', () => this._nuovoGiorno());
    g.on('*', () => this._controllaCommissioni());
    g.pilot?.sezione?.('Telefonino', () => this._pilot());
    window.addEventListener('keydown', e => this._tasto(e), true);
    if (!st.benvenuto) { st.benvenuto = true; setTimeout(() => this.sms('gigante', T.benvenuto), 4000); }
    this._badge();
  }

  // ---------- Contatti ----------
  _contatto(id) { return CONTATTI.find(c => c.id === id); }
  _rubrica() { return CONTATTI.filter(c => c.sempre || (c.consulente && this.s.flags.consulente?.telefono)); }
  _nome(id) { return this._contatto(id)?.nome || id; }
  _pag(chi, text, extra) {
    const c = this._contatto(chi);
    const nome = chi === 'mountain' ? 'Mister Mountain' : chi === 'gigante' ? 'Il Gigante' : (c?.nome || chi).replace(' ★', '');
    return { who: PIX.CHARACTERS[c?.who || chi] ? (c?.who || chi) : undefined, name: `📱 ${nome}`, text, ...extra };
  }
  _stress(n) {
    n = Math.round(n);
    this.s.stress = clamp(this.s.stress + n, 0, 100);
    if (n) this.ui.toast(`Stress ${n > 0 ? '+' : ''}${n}`, n > 0 ? 'bad' : 'good');
    return n;
  }
  _log(tipo, chi) {
    this.st.registro.unshift({ tipo, chi, giorno: this.s.day, ora: Math.floor(this.s.minutes) });
    this.st.registro.length = Math.min(this.st.registro.length, 20);
  }

  // ---------- SMS ----------
  sms(da, testo, nome = null) {
    const st = this.st; if (!st) return;
    st.sms.unshift({ da, nome: nome || this._nome(da), testo, giorno: this.s.day, ora: Math.floor(this.s.minutes), letto: false });
    st.sms.length = Math.min(st.sms.length, TEL.maxSms);
    this.game.emit('telefono', { tipo: 'sms', chi: da });
    this._bip();
    this.ui.toast(`✉️ SMS da ${nome || this._nome(da)}`, 'good');
    this._badge();
    if (this.aperto()) this._render();
  }
  nonLetti() { return this.st?.sms.filter(m => !m.letto).length || 0; }

  // ---------- Chiamate in arrivo ----------
  chiama(chi, motivo = 'chiacchiera', dati = {}) {
    if (this.squillo?.chi === chi || this.coda.some(c => c.chi === chi && c.motivo === motivo)) return;
    this.coda.push({ chi, motivo, dati });
  }

  _puoSquillare() {
    const g = this.game;
    return !this.ui.busy() && !g.locked && !g.mm && !g.combat?.active && !this.squillo && g.player;
  }

  update(dt) {
    const st = this.st, abs = this._abs();
    // sollecito del Gigante: missione in corso, poca strada fatta, scadenza vicina
    const m = this.s.mission;
    if (m && !m.done && !m.failed && st.sollecito !== this.s.day && m.deadline - this.s.minutes < TEL.sollecitoPrima && m.deadline - this.s.minutes > 15 && (m.progress || 0) < m.n) {
      st.sollecito = this.s.day; this.chiama('gigante', 'sollecito');
    }
    // Mister Mountain a sorpresa
    const hr = this.s.minutes / H;
    if (abs >= st.mmProssima && hr >= TEL.mountainOre[0] && hr < TEL.mountainOre[1]) {
      st.mmProssima = abs + Math.round(rand(...TEL.mountainOgniGiorni) * DAY);
      this.chiama('mountain', 'sorpresa');
    }
    // richiamate (Mister Mountain rifiutato, Gigante che paga)
    for (const r of [...st.richiamate]) if (abs >= r.quando) { st.richiamate.splice(st.richiamate.indexOf(r), 1); this.chiama(r.chi, r.motivo, r.dati || {}); }
    if (this.coda.length && this._puoSquillare()) this._squilla(this.coda.shift());
  }

  _ora(hh) {
    const st = this.st, g = this.game;
    // il Gigante chiama per un lavoretto (o una truffa)
    if (hh >= TEL.commissioneOre[0] && hh <= TEL.commissioneOre[1] && st.commissione !== this.s.day && Math.random() < TEL.commissioneProb / (TEL.commissioneOre[1] - TEL.commissioneOre[0] + 1) * 2) {
      st.commissione = this.s.day;
      let truffa = null;
      try { truffa = g.cascine?.prossima?.(); } catch { truffa = null; }
      if (truffa && Math.random() < 0.4) this.chiama('gigante', 'truffa', { id: truffa });
      else if (!Object.keys(st.commissioni).length) this.chiama('gigante', 'commissione');
    }
    if ((hh === 12 || hh === 19) && Math.random() < 0.22) this.sms('mamma', pick(T.mammaSms));
  }

  _nuovoGiorno() {
    if (Math.random() < 0.15) setTimeout(() => this.sms('bubetto', T.bubettoSms), 6000);
    this.st.mmRifiuti = 0;
  }

  _squilla(c) {
    const fine = performance.now() + TEL.ringSecondi * 1000;
    this.squillo = { ...c, fine };
    const b = this.banner;
    b.querySelector('.tsq-nome').textContent = c.chi === 'mountain' ? T.mountainSquillo : `${this._contatto(c.chi)?.icona || '📱'} ${this._nome(c.chi)}`;
    b.classList.toggle('mm', c.chi === 'mountain');
    b.hidden = false;
    this.btn.classList.add('squilla');
    this._suona(c.chi === 'mountain' ? SUONERIA_MOUNTAIN : SUONERIE[this.st.suoneria] || SUONERIE.polka);
    clearInterval(this._timer);
    this._timer = setInterval(() => { if (this.squillo && performance.now() > this.squillo.fine) this._persa(); }, 250);
  }

  _fermaSquillo() {
    this.squillo = null;
    clearInterval(this._timer); this._timer = null;
    this.banner.hidden = true;
    this.btn.classList.remove('squilla');
    this._zitto();
  }

  async rispondi() {
    const c = this.squillo; if (!c || this.ui.queue) return;
    this._fermaSquillo();
    if (this.aperto()) this.chiudi(true);
    this._log('in', c.chi);
    this.game.emit('telefono', { tipo: 'risposta', chi: c.chi });
    this.game.audio.sfx('blip');
    await this._conversa(c);
  }

  rifiuta() {
    const c = this.squillo; if (!c) return;
    this._fermaSquillo();
    this._log('rifiutata', c.chi);
    this.game.emit('telefono', { tipo: 'rifiutata', chi: c.chi });
    this._nonRisposto(c, true);
  }

  _persa() {
    const c = this.squillo; if (!c) return;
    this._fermaSquillo();
    this._log('persa', c.chi);
    this.game.emit('telefono', { tipo: 'persa', chi: c.chi });
    this.ui.toast(`${T.persa}: ${this._nome(c.chi)}`, 'bad');
    this._nonRisposto(c, false);
  }

  _nonRisposto(c, rifiutata) {
    const st = this.st;
    if (c.chi === 'mountain') {
      this._stress(rifiutata ? TEL.mountainRifiuto : TEL.mountainRifiuto / 2);
      if (rifiutata) this.ui.toast(T.mountainRifiutata, 'bad');
      if (st.mmRifiuti++ < TEL.mountainRichiamate) st.richiamate.push({ chi: 'mountain', motivo: 'richiama', quando: this._abs() + Math.round(rand(20, 45)) });
      else this.sms('mountain', pick(T.mountainSms), 'MISTER MOUNTAIN');
    } else if (c.chi === 'gigante') {
      if (c.motivo === 'paga') { this._paga(c.dati.id, false); return; }
      this._stress(3);
      this.sms('gigante', pick(T.giganteNonRisponde));
    }
  }

  // ---------- Le conversazioni ----------
  async _conversa(c) {
    const m = this.s.mission, P = this.game.prog;
    if (c.chi === 'gigante' && c.motivo === 'sollecito') {
      if (!m || m.done || m.failed) return;
      const v = this._varMissione(m);
      await this.ui.dialog([this._pag('gigante', fill(pick(T.sollecito), v), { choices: T.sollecitoRisposte.map(r => ({ label: r.label, fn: () => {
        if (r.parlantina) {
          const ok = Math.random() < 0.45 + 0.15 * (P.grado?.('parlantina') || 0);
          if (!ok) this._stress(r.stressKo);
          return [{ text: ok ? r.ok : r.ko }];
        }
        this._stress(r.stress);
        return [{ text: r.risposta }];
      } })) })]);
    } else if (c.chi === 'gigante' && c.motivo === 'commissione') {
      const cm = pick(T.commissioni);
      await this.ui.dialog([this._pag('gigante', `${pick(T.commissioniIntro)} ${cm.testo}`, { choices: [
        { label: `${T.commissioneScelte.si} (+${cm.premio.soldi}€)`, fn: () => { this._accettaCommissione(cm); return [this._pag('gigante', T.commissioneSi)]; } },
        { label: T.commissioneScelte.no, fn: () => { this._stress(3); return [this._pag('gigante', T.commissioneNo)]; } },
      ] })]);
    } else if (c.chi === 'gigante' && c.motivo === 'truffa') {
      const Q = this.game.quests, q = Q.defs[c.dati.id];
      if (!q || Q.stato(c.dati.id) || this.game.cascine?.attiva?.()) return;
      await this.ui.dialog([this._pag('gigante', T.truffaIntro), { ...this._pag('gigante', q.offerta), choices: [
        { label: `${T.truffaScelte.si} (+${q.premio?.soldi ?? 0}€)`, fn: () => { Q.accetta(c.dati.id); this.game.cascine?._dopoAccetta?.(c.dati.id); return null; } },
        { label: T.truffaScelte.no, fn: () => [this._pag('gigante', T.truffaNo)] },
      ] }]);
    } else if (c.chi === 'gigante' && c.motivo === 'paga') {
      this._paga(c.dati.id, true);
    } else if (c.chi === 'mountain') {
      await this._mountain();
    } else {
      await this._chiamaTu(c.chi);
    }
  }

  _varMissione(m) {
    const fatto = Math.min(m.progress || 0, m.n);
    return { n: m.n, fatto, mancano: `${m.n - fatto} su ${m.n}`, ora: ora(m.deadline / 60), adesso: hhmm(this.s.minutes) };
  }

  async _mountain() {
    const P = this.game.prog, st = this.st;
    const molt = Math.max(0.2, 1 - (P.bonus?.('stressRimproveri') || 0));
    const stressPieno = TEL.mountainStress * (1 + 0.5 * Math.min(2, st.mmRifiuti)) * molt;
    st.mmRifiuti = 0;
    this.game.audio.sfx('bad'); this.ui.shake();
    await this.ui.dialog([this._pag('mountain', pick(T.mountain), { choices: T.mountainScelte.map(sc => ({ label: sc.label, fn: () => {
      if (sc.tipo === 'subisci') { this._stress(stressPieno); return [{ text: T.mountainSubisci }]; }
      if (sc.tipo === 'galleria') {
        const ok = Math.random() < 0.4 + 0.15 * (P.grado?.('parlantina') || 0);
        if (ok) return [{ text: T.mountainGalleriaOk }];
        this._stress(stressPieno * 1.5); return [{ text: T.mountainGalleriaKo }];
      }
      this._stress(stressPieno / 2);
      st.richiamate.push({ chi: 'mountain', motivo: 'richiama', quando: this._abs() + 30 });
      st.mmRifiuti = 1;
      return [{ text: T.mountainRiattacca }];
    } })) })]);
  }

  // chiamate fatte da Garonio (dalla rubrica)
  async _chiamaTu(chi) {
    const g = this.game, st = this.st, s = this.s, m = s.mission;
    if (chi === 'gigante') {
      let t = pick(T.chiamaGigante);
      if (m && m.done) t = T.chiamaGiganteFatta;
      else if (m && !m.failed) t += ' ' + fill(T.chiamaGiganteMissione, this._varMissione(m));
      await this.ui.dialog([this._pag('gigante', t)]);
    } else if (chi === 'mamma') {
      if (st.mammaGiorno === s.day) { await this.ui.dialog([this._pag('mamma', T.mammaGiaChiamata)]); return; }
      st.mammaGiorno = s.day;
      await this.ui.dialog([this._pag('mamma', pick(T.mamma))]);
      this._stress(TEL.mammaStress);
    } else if (chi === 'consulente') {
      if (!s.flags.consulente?.telefono) { await this.ui.dialog([{ text: T.consulenteNo }]); return; }
      if (st.consGiorno === s.day) { await this.ui.dialog([this._pag('consulente', T.consulenteGia)]); return; }
      if (s.money < TEL.consulentePrezzo) { await this.ui.dialog([{ text: T.consulenteSenzaSoldi }]); return; }
      st.consGiorno = s.day; s.money -= TEL.consulentePrezzo;
      let dritta = '...';
      try { dritta = g.consulente.consiglio(); } catch (e) { console.error(e); }
      await this.ui.dialog([this._pag('consulente', T.consulenteRisposta), this._pag('consulente', dritta)]);
    } else if (chi === 'zeno') {
      let u = 'normale'; try { u = g.officina?.umore?.() || 'normale'; } catch { u = 'normale'; }
      // mezzi lasciati in giro: Zeno li riporta in azienda col rimorchio (anche a debito, src/officina.js)
      const O = g.officina, lontani = O?.rimorchio ? g.vehicles.list.filter(v => !O.aCasa(v)) : [];
      const choices = lontani.map(v => ({ label: `${O.etichettaRimorchio(v)} · ${v.T.label ?? v.T.name}${v.id === 'trattore1' ? ' rosso' : v.id === 'trattore2' ? ' verde' : ''}`, fn: () => O.rimorchio(v) }));
      await this.ui.dialog([this._pag('zeno', T.zeno[u] || T.zeno.normale, choices.length ? { choices: [...choices, { label: 'Niente, ciao', fn: null }] } : {})]);
    } else if (chi === 'bubetto') {
      await this.ui.dialog([this._pag('bubetto', pick(T.bubetto))]);
    } else if (chi === 'mountain') {
      await this.ui.dialog([this._pag('mountain', pick(T.chiamaMountain), { choices: T.chiamaMountainScelte.map((sc, i) => ({ label: sc.label, fn: () => {
        this._stress(sc.stress); return [{ text: T.chiamaMountainRisposte[i] }];
      } })) })]);
    }
  }

  // ---------- Lavoretti per telefono (missioni secondarie lampo) ----------
  _accettaCommissione(cm) {
    const Q = this.game.quests, id = `tel_${cm.id}@${this.s.day}`;
    Q.aggiungi(id, { da: 'gigante', titolo: `📱 ${cm.titolo}`, offerta: cm.testo, obiettivo: cm.obiettivo, premio: cm.premio, giorni: 1, torna: false });
    this.st.commissioni[id] = { premio: cm.premio, giorno: this.s.day };
    Q.accetta(id);
  }

  // dopo ogni evento: un lavoretto è pronto → il Gigante richiama per pagare; scaduto → SMS
  _controllaCommissioni() {
    const st = this.st; if (!st) return;
    const Q = this.game.quests;
    for (const [id, c] of Object.entries(st.commissioni)) {
      if (!Q.defs[id]) Q.aggiungi(id, { da: 'gigante', titolo: '📱 Lavoretto', offerta: '', obiettivo: { evento: '-', n: 1 }, premio: c.premio, torna: false, giorni: 1 });
      const stato = Q.stato(id);
      if (stato === 'pronta' && !c.chiamato) { c.chiamato = true; st.richiamate.push({ chi: 'gigante', motivo: 'paga', dati: { id }, quando: this._abs() + 5 }); }
      else if (stato === 'fallita') { delete st.commissioni[id]; this.sms('gigante', T.commissioneFallita); }
      else if (stato === 'fatta' || stato === undefined) delete st.commissioni[id];
    }
  }

  _paga(id, alTelefono) {
    const Q = this.game.quests, c = this.st.commissioni[id];
    if (!c || Q.stato(id) !== 'pronta') return;
    delete this.st.commissioni[id];
    Q.completa(id);
    const t = fill(pick(T.commissioneFatta), { soldi: c.premio.soldi });
    if (alTelefono) this.ui.dialog([this._pag('gigante', t)]);
    else this.sms('gigante', t + ' PAPÀ');
  }

  // ---------- Suonerie (Web Audio) ----------
  _suona(def, volte = Infinity) {
    this._zitto();
    try { navigator.vibrate?.([400, 200, 400, 200, 400]); } catch { }
    const A = this.game.audio;
    if (this.st.silenzioso || !A.enabled) return;
    A.unlock();
    if (!A.ctx) return;
    if (A.el) { this._musica = A.el; A.el.volume = Math.min(A.el.volume, 0.12); }
    const giro = () => {
      const t0 = A.ctx.currentTime + 0.03;
      def.note.forEach((n, i) => {
        if (!n) return;
        const t = t0 + i * def.passo, d = def.passo * 0.9;
        if (def.glissa) {
          const o = A.ctx.createOscillator(), gn = A.ctx.createGain();
          o.type = def.onda; o.frequency.setValueAtTime(440 * 2 ** ((n - 72) / 12), t);
          o.frequency.exponentialRampToValueAtTime(440 * 2 ** ((n - 69) / 12), t + d);
          gn.gain.setValueAtTime(0.05, t); gn.gain.exponentialRampToValueAtTime(0.0001, t + d);
          o.connect(gn).connect(A.ctx.destination); o.start(t); o.stop(t + d + 0.02);
        } else A._note(n, t, d, def.onda, def.onda === 'triangle' ? 0.12 : 0.05);
      });
    };
    let n = 0;
    giro();
    this._ring = setInterval(() => { if (++n >= volte) return this._zitto(); giro(); }, def.note.length * def.passo * 1000 + 350);
  }
  _zitto() {
    clearInterval(this._ring); this._ring = null;
    try { navigator.vibrate?.(0); } catch { }
    if (this._musica) { const el = this._musica; this._musica = null; if (this.game.audio.el === el) el.volume = this.game.audio.musicVolume; }
  }
  _bip() {
    const A = this.game.audio;
    try { navigator.vibrate?.([120, 80, 120]); } catch { }
    if (this.st.silenzioso || !A.enabled || !A.ctx) return;
    const t = A.ctx.currentTime;
    [[88, 0], [93, 0.1], [88, 0.3], [93, 0.4]].forEach(([n, dt]) => A._note(n, t + dt, 0.08, 'square', 0.04));
  }

  // ---------- Il telefono aperto (finestra) ----------
  aperto() { return !!this.el && !this.el.hidden; }

  apri() {
    const g = this.game;
    if (this.aperto()) return;
    if (!g.s || this.ui.busy() || g.locked || g.combat?.active || g.mm) return;
    this.vista = 'home'; this.sel = 0; this.leggi = null;
    this.el.hidden = false;
    this.el.classList.remove('chiude'); void this.el.offsetWidth; this.el.classList.add('apre');
    this.ui.modal = this;
    this._clic();
    this._render();
  }

  chiudi(subito = false) {
    if (!this.aperto()) return;
    if (this.ui.modal === this) this.ui.modal = null;
    clearTimeout(this._chiamando);
    if (subito) { this.el.hidden = true; return; }
    this._clic();
    this.el.classList.add('chiude');
    setTimeout(() => { if (this.el.classList.contains('chiude')) this.el.hidden = true; this.el.classList.remove('chiude'); }, 220);
  }

  _clic() { const A = this.game.audio; if (A.enabled && A.ctx) { const t = A.ctx.currentTime; A._note(40, t, 0.03, 'square', 0.05); A._note(64, t + 0.04, 0.03, 'square', 0.04); } }

  // voci della vista corrente: [{ testo, sub?, fn }]
  _voci() {
    const st = this.st, n = this.nonLetti();
    switch (this.vista) {
      case 'menu': return [
        { testo: `✉ Messaggi${n ? ` (${n})` : ''}`, fn: () => this._vai('sms') },
        { testo: '☎ Rubrica', fn: () => this._vai('rubrica') },
        { testo: '⟲ Chiamate', fn: () => this._vai('registro') },
        { testo: '♫ Suonerie', fn: () => this._vai('suonerie') },
        { testo: st.silenzioso ? '🔕 Silenzioso: SÌ' : '🔔 Silenzioso: NO', fn: () => { st.silenzioso = !st.silenzioso; this._render(); } },
      ];
      case 'sms': return st.sms.map((m, i) => ({ testo: `${m.letto ? '  ' : '● '}${m.nome}`, sub: `G${m.giorno} ${hhmm(m.ora)}`, fn: () => { m.letto = true; this.leggi = i; this._badge(); this._vai('leggi'); } }));
      case 'rubrica': return this._rubrica().map(c => ({ testo: `${c.icona} ${c.nome}`, fn: () => this._chiamaDaRubrica(c.id) }));
      case 'registro': return st.registro.map(r => ({ testo: `${{ in: '↙', out: '↗', persa: '✖', rifiutata: '⊘' }[r.tipo] || '·'} ${this._nome(r.chi)}`, sub: `G${r.giorno} ${hhmm(r.ora)}`, fn: () => this._chiamaDaRubrica(r.chi) }));
      case 'suonerie': return Object.entries(SUONERIE).map(([id, d]) => ({ testo: `${st.suoneria === id ? '◉' : '○'} ${d.nome}`, fn: () => { st.suoneria = id; this._suona(d, 1); this._render(); } }));
      default: return [];
    }
  }

  _vai(v) { this._storia = this.vista; this.vista = v; this.sel = 0; this._clic(); this._render(); }

  _indietro() {
    if (this.vista === 'chiamata') return;
    this._zitto();
    if (this.vista === 'home') return this.chiudi();
    this.vista = this.vista === 'leggi' ? 'sms' : this.vista === 'menu' ? 'home' : 'menu';
    this.sel = 0; this._clic(); this._render();
  }

  _ok() {
    if (this.vista === 'chiamata') return;
    if (this.vista === 'home') return this._vai('menu');
    if (this.vista === 'leggi') return this._indietro();
    const v = this._voci()[this.sel];
    if (v) { this._clic(); v.fn(); }
  }

  _chiamaDaRubrica(chi) {
    const st = this.st;
    this.vista = 'chiamata'; this._chiamato = chi; this._render();
    this._log('out', chi);
    this.game.emit('telefono', { tipo: 'chiamata', chi });
    // tuu... tuu...
    const A = this.game.audio;
    if (A.enabled && A.ctx && !st.silenzioso) { const t = A.ctx.currentTime; A._note(69, t + 0.1, 0.5, 'sine', 0.06); A._note(69, t + 0.9, 0.5, 'sine', 0.06); }
    clearTimeout(this._chiamando);
    this._chiamando = setTimeout(async () => {
      this.chiudi(true);
      this.s.minutes += 5;
      await this._chiamaTu(chi);
    }, 1500);
  }

  // tastiera quando il telefono è aperto (main.js gira i tasti a ui.modal)
  key(code) {
    if (/ArrowUp|KeyW/.test(code)) this._muovi(-1);
    else if (/ArrowDown|KeyS/.test(code)) this._muovi(1);
    else if (['Enter', 'KeyE', 'Space', 'ArrowRight', 'KeyD'].includes(code)) this._ok();
    else if (['Escape', 'Backspace', 'ArrowLeft', 'KeyA', 'KeyQ'].includes(code)) this._indietro();
    else if (code === 'KeyT' || code === 'KeyJ') this.chiudi();
  }

  _muovi(d) {
    const n = this._voci().length; if (!n) return;
    this.sel = (this.sel + d + n) % n; this._clic(); this._render();
  }

  // tasto T (e X per rifiutare) quando il telefono è chiuso. Fase di cattura: prima di main.js.
  _tasto(e) {
    if (!this.game.s || e.repeat) return;
    if (this.ui.modal || this.ui.queue) return;   // il telefono aperto riceve i tasti da main.js
    if (e.code === 'KeyT') {
      e.preventDefault(); e.stopPropagation();   // sennò main.js girerebbe la T al telefono appena aperto (e lo chiuderebbe)
      if (this.squillo) this.rispondi(); else this.apri();
    } else if (e.code === 'KeyX' && this.squillo) { e.preventDefault(); e.stopPropagation(); this.rifiuta(); }
  }

  // ---------- DOM ----------
  _css() {
    if (document.getElementById('telefono-css')) return;
    const l = document.createElement('link');
    l.id = 'telefono-css'; l.rel = 'stylesheet'; l.href = new URL('./telefono.css', import.meta.url).href;
    document.head.appendChild(l);
  }

  _build() {
    const hud = document.getElementById('hud');
    // pulsante 📱 (nella barra rapida su PC, sopra il pulsante E sul telefono)
    const b = this.btn = h('button', '', null); b.id = 'btn-tel'; b.title = 'Telefonino (T)';
    b.append(h('span', 'ic', '📱'), h('span', 'lb', 'Tel.'), h('kbd', '', 'T'), h('i', 'tel-badge'));
    b.addEventListener('click', e => { e.stopPropagation(); this.game.audio.unlock(); if (this.squillo) this.rispondi(); else if (this.aperto()) this.chiudi(); else this.apri(); });
    const qb = document.getElementById('quickbar');
    if (document.body.classList.contains('touch') || !qb) hud.appendChild(b); else qb.appendChild(b);

    // banner della chiamata in arrivo
    const sq = this.banner = h('div', '', null); sq.id = 'tel-squillo'; sq.hidden = true;
    const icona = h('div', 'tsq-ico', '📱');
    const info = h('div', 'tsq-info'); info.append(h('div', 'tsq-nome', ''), h('div', 'tsq-sub', 'ti sta chiamando...'));
    const si = h('button', 'tsq-si', '📞 Rispondi'), no = h('button', 'tsq-no', '✖ Rifiuta');
    si.append(h('kbd', '', 'T')); no.append(h('kbd', '', 'X'));
    si.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.game.audio.unlock(); this.rispondi(); });
    no.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); this.rifiuta(); });
    const bt = h('div', 'tsq-btn'); bt.append(si, no);
    sq.append(icona, info, bt);
    hud.appendChild(sq);

    // il telefono a conchiglia
    const el = this.el = h('div', '', null); el.id = 'telefono'; el.hidden = true;
    el.innerHTML = `
      <div class="tel-fondo"></div>
      <div class="tel">
        <div class="tel-sopra">
          <div class="tel-casse"><i></i><i></i><i></i><i></i></div>
          <div class="tel-schermo"><div class="tel-lcd"></div></div>
          <div class="tel-marca">GARONIA</div>
        </div>
        <div class="tel-cerniera"></div>
        <div class="tel-sotto">
          <div class="tel-soft"><button data-k="ok" class="sk">◤</button><div class="tel-dpad">
            <button data-k="su" class="dp su">▲</button><button data-k="giu" class="dp giu">▼</button>
            <button data-k="indietro" class="dp sx">◀</button><button data-k="ok" class="dp dx">▶</button>
            <button data-k="ok" class="dp ok">OK</button></div><button data-k="indietro" class="sk">◥</button></div>
          <div class="tel-verdi"><button data-k="ok" class="verde">📞</button><button data-k="chiudi" class="rosso">⏻</button></div>
          <div class="tel-tasti">${['1', '2 abc', '3 def', '4 ghi', '5 jkl', '6 mno', '7 pqrs', '8 tuv', '9 wxyz', '✱', '0 ⎵', '#'].map(t => `<button data-k="num"><b>${t.split(' ')[0]}</b><small>${t.split(' ')[1] || ''}</small></button>`).join('')}</div>
          <div class="tel-micro"></div>
        </div>
      </div>`;
    el.querySelector('.tel-fondo').addEventListener('click', () => this.chiudi());
    el.addEventListener('click', e => {
      const k = e.target.closest('button')?.dataset.k; if (!k) return;
      e.stopPropagation();
      if (k === 'su') this._muovi(-1); else if (k === 'giu') this._muovi(1);
      else if (k === 'ok') this._ok(); else if (k === 'indietro') this._indietro();
      else if (k === 'chiudi') this.chiudi(); else this._clic();
    });
    el.addEventListener('pointerdown', e => e.stopPropagation());
    this.lcd = el.querySelector('.tel-lcd');
    document.body.appendChild(el);
  }

  _badge() {
    const n = this.nonLetti(), b = this.btn?.querySelector('.tel-badge');
    if (!b) return;
    b.textContent = n ? String(n) : ''; b.hidden = !n;
  }

  _render() {
    const s = this.s, st = this.st, lcd = this.lcd;
    lcd.innerHTML = '';
    const top = h('div', 'lcd-top');
    top.append(h('span', '', '▂▄▆█'), h('span', '', hhmm(s.minutes)), h('span', '', st.silenzioso ? '🔕 ▮▮▮' : '▮▮▮'));
    lcd.appendChild(top);
    const corpo = h('div', 'lcd-corpo');
    lcd.appendChild(corpo);
    let sx = 'Menu', dx = 'Chiudi';
    if (this.vista === 'home') {
      corpo.classList.add('home');
      corpo.append(h('div', 'lcd-op', TEL.operatore), h('div', 'lcd-ora', hhmm(s.minutes)), h('div', 'lcd-data', `Giorno ${s.day}`));
      const n = this.nonLetti();
      if (n) corpo.append(h('div', 'lcd-avviso', `✉ ${n} nuov${n > 1 ? 'i' : 'o'} messaggi${n > 1 ? '' : 'o'}`));
      const perse = st.registro.filter(r => r.tipo === 'persa' && r.giorno === s.day).length;
      if (perse) corpo.append(h('div', 'lcd-avviso', `✖ ${perse} chiamat${perse > 1 ? 'e perse' : 'a persa'}`));
    } else if (this.vista === 'leggi') {
      const m = st.sms[this.leggi];
      corpo.append(h('div', 'lcd-titolo', `Da: ${m?.nome || '?'}`), h('div', 'lcd-sms', m?.testo || ''));
      sx = 'Ok'; dx = 'Indietro';
    } else if (this.vista === 'chiamata') {
      const c = this._contatto(this._chiamato);
      corpo.classList.add('home');
      corpo.append(h('div', 'lcd-op', T.chiama), h('div', 'lcd-ora piccolo', `${c?.icona || ''} ${c?.nome || ''}`), h('div', 'lcd-data lampeggia', '☎ . . .'));
      sx = ''; dx = '';
    } else {
      const tit = { menu: 'Menu', sms: 'Messaggi', rubrica: 'Rubrica', registro: 'Chiamate', suonerie: 'Suonerie' }[this.vista];
      corpo.append(h('div', 'lcd-titolo', tit));
      const voci = this._voci();
      if (!voci.length) corpo.append(h('div', 'lcd-vuoto', this.vista === 'sms' ? T.nessunSms : T.nessunaChiamata));
      const ul = h('div', 'lcd-lista');
      voci.forEach((v, i) => {
        const r = h('div', 'lcd-voce' + (i === this.sel ? ' sel' : ''));
        r.append(h('span', '', v.testo)); if (v.sub) r.append(h('small', '', v.sub));
        r.addEventListener('click', e => { e.stopPropagation(); this.sel = i; this._ok(); });
        ul.appendChild(r);
      });
      corpo.appendChild(ul);
      ul.querySelector('.sel')?.scrollIntoView({ block: 'nearest' });
      sx = 'Ok'; dx = 'Indietro';
    }
    const bot = h('div', 'lcd-bot'); bot.append(h('span', '', sx), h('span', '', dx));
    lcd.appendChild(bot);
  }

  // ---------- Pilot di prova (?pilot) ----------
  _pilot() {
    const g = this.game, ok = t => [{ name: '🧪 Telefonino', text: t }];
    const dopo = fn => { setTimeout(fn, 400); return ok('Chiudi questo messaggio: il telefono squilla tra un attimo.'); };
    return [
      { label: '📱 Squilla: il Gigante sollecita la missione', fn: () => dopo(() => this.chiama('gigante', 'sollecito')) },
      { label: '📱 Squilla: il Gigante ha un lavoretto', fn: () => dopo(() => this.chiama('gigante', 'commissione')) },
      { label: '📱 Squilla: il Gigante offre una truffa', fn: () => { const id = g.cascine?.offri?.(Object.keys(g.quests.defs).find(k => g.quests.defs[k].truffaldina && !g.quests.stato(k))); return id ? dopo(() => this.chiama('gigante', 'truffa', { id })) : ok('Nessuna truffa disponibile ora.'); } },
      { label: '⛰️ Squilla: Mister Mountain a sorpresa', fn: () => dopo(() => this.chiama('mountain', 'sorpresa')) },
      { label: '✉️ SMS della Mamma e del Bubetto', fn: () => { this.sms('mamma', pick(T.mammaSms)); this.sms('bubetto', T.bubettoSms); return ok('Due messaggi nuovi: T per aprire il telefono.'); } },
      { label: '🕶️ Consulente in rubrica (livello 5)', fn: () => { g.consulente.provaAmicizia(80); g.s.flags.consulente.telefono = true; return ok('Il Consulente è in rubrica e domattina scrive.'); } },
    ];
  }
}
