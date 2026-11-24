// Officina di Zeno (GDD 19.2, 20.2‑20.4): riparazioni a fasce di danno, umore del giorno,
// fregature (sovrapprezzo, lavoro a metà, pezzo usato), fattura, traino ed elaborazioni di Vespa e Punto.
//
// API (game.officina):
//   umore()               'buono' | 'normale' | 'cattivo' (cambia ogni giorno; il Consulente può leggerlo)
//   fascia(cond)          fascia di danno { id, nome, prezzo, minuti, lento }
//   mod(v)                effetti di danni ed elaborazioni su un mezzo, letti da vehicles.js:
//                         { vel, sterzo, spegni, benzina, fora, nonParte, rumore, stereo, gratta }
//   scelte()              scelte per il dialogo (Zeno, bancone dell'officina, vecchia porta)
//   elaborazioni()        scelte del ponte sollevatore
// Stato: s.flags.officina = { giorno, umore, conto, elab: { vespa: { marmitta: true } }, guai: [], usati: [] }
import { FASCE, TRAINO, RIMORCHIO, FATTURA, UMORI, PARLANTINA_SCONTO, USATO, META, ZENO, ELABORAZIONI, MEZZI_NOMI } from './data/officina.js';
import { PLACES } from './map.js';
import { pick } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const kindOf = id => id.startsWith('trattore') ? 'trattore' : id;
const fmtMin = m => m >= 60 ? `${+(m / 60).toFixed(1)}h` : `${m} min`;

export class Officina {
  constructor(game) {
    this.game = game;
    this._ultimoMin = null;
    this._grattaT = 0;
    game.moduli.push(this);
    // scelte dirette nel dialogo di Zeno: riparazioni (mezzi e attrezzi) ed elaborazioni
    game.png.aggiungiScelte('zeno', () => {
      const n = this._daRiparare().length + this._attrezziRotti().length;
      return [
        { label: `🔧 Ripara mezzi e attrezzi${n ? ` (${n} da sistemare)` : ''} · Zeno ${UMORI[this.umore()].icona}`, fn: () => [n ? this._paginaRip() : this._zeno(ZENO.nienteDaFare, [{ label: 'Indietro', fn: () => [this._pagina()] }])] },
        { label: '⚙️ Elaborazioni di Vespa e Punto', fn: () => [this._paginaElab()] },
      ];
    });
    game.interni?.aggancia?.('officina:ponte', () => game.ui.dialog([this._paginaElab()]));
    game.on('nuovoGiorno', () => this._nuovoGiorno());
    game.vehicles.blocchi.push(v => this._nonParte(v));
  }

  get s() { return this.game.s; }
  get f() {
    const f = (this.s.flags.officina ??= {});
    f.elab ??= {}; f.guai ??= []; f.usati ??= []; f.conto ??= 0;
    return f;
  }

  // ---------- Umore ----------
  umore() {
    const f = this.f;
    if (f.giorno !== this.s.day || !UMORI[f.umore]) {
      f.giorno = this.s.day;
      let r = Math.random() * 100;
      f.umore = 'normale';
      for (const [k, u] of Object.entries(UMORI)) { if ((r -= u.peso) < 0) { f.umore = k; break; } }
    }
    return f.umore;
  }

  fascia(cond) { return FASCE.find(x => cond >= x.min) || FASCE[FASCE.length - 1]; }

  // ---------- Effetti sui mezzi (letti da vehicles.js) ----------
  mod(v) {
    const f = this.f, st = v.st;
    const F = this.fascia(st.cond);
    const m = { vel: 1 - (F.id === 'rotto' ? 0 : F.lento), sterzo: 1, spegni: 1, benzina: 1, fora: 1, nonParte: 0, rumore: 0, stereo: 0, gratta: 0 };
    const add = fx => {
      if (fx.vel) m.vel += fx.vel;
      if (fx.sterzo) m.sterzo += fx.sterzo;
      if (fx.spegni != null) m.spegni *= fx.spegni;
      if (fx.benzina) m.benzina *= fx.benzina;
      if (fx.fora != null) m.fora *= fx.fora;
      if (fx.nonParte) m.nonParte = Math.max(m.nonParte, fx.nonParte);
      if (fx.rumore) m.rumore = 1;
      if (fx.stereo) m.stereo += fx.stereo;
      if (fx.gratta) m.gratta = 1;
    };
    const E = ELABORAZIONI[v.id];
    if (E) for (const id of Object.keys(f.elab[v.id] || {})) if (E[id]) add(E[id].fx);
    for (const g of f.guai) if (g.mezzo === v.id && this._attivo(g)) add(g.fx);
    return m;
  }

  _attivo(g) { return !g.fino || this.s.day < g.fino; }

  // il mezzo non parte (motore revisionato andato male, batteria dello stereo)
  _nonParte(v) {
    const p = this.mod(v).nonParte;
    if (p > 0 && Math.random() < p) return v.kind === 'punto' ? 'Clic. Clic. La batteria della Punto è a terra (grazie, Zeno). Riprova.' : 'La Vespa non ne vuole sapere: il motore «revisionato» da Zeno fa i capricci. Riprova.';
    return null;
  }

  // ---------- Ogni fotogramma (fuori dai dialoghi) ----------
  update(dt) {
    const s = this.s, veh = this.game.vehicles, v = veh.driving;
    const prev = this._ultimoMin ?? s.minutes; this._ultimoMin = s.minutes;
    if (!v || !ELABORAZIONI[v.id]) return;
    const m = this.mod(v);
    // stereo: stress −2 all'ora di gioco mentre guidi
    if (m.stereo && Math.abs(v.speed) > 0.5) s.stress = clamp(s.stress - m.stereo * (s.minutes - prev) / 60, 0, 100);
    // marmitta sportiva: le nutrie scappano da lontano
    if (m.rumore && Math.abs(v.speed) > 1.5) for (const n of this.game.nutrie) if (n.state !== 'flee' && Math.hypot(n.x - v.st.x, n.z - v.st.z) < 4.5) this.game._flee(n, true);
    // assetto ribassato andato male: gratta sugli sterrati
    if (m.gratta && Math.abs(v.speed) > 1) {
      const ch = this.game.world.tile(Math.floor(v.st.x), Math.floor(v.st.z));
      if (ch === 'p' || ch === 'g' || ch === 's') {
        v.st.cond = clamp(v.st.cond - 0.6 * dt, 1, 100);
        this._grattaT -= dt;
        if (this._grattaT <= 0) { this._grattaT = 3; this.game.ui.float('Scrrr! La Punto ribassata gratta sullo sterrato.'); }
      }
    }
  }

  _nuovoGiorno() {
    const s = this.s, f = this.f, veh = this.game.vehicles;
    this.umore();
    for (const u of [...f.usati]) if (s.day >= u.giorno) {
      const v = veh.get(u.mezzo);
      if (v && v.st.cond > 0) { v.st.cond = clamp(v.st.cond - USATO.perdita, 0, 100); this.game.ui.toast(ZENO.usatoCede(MEZZI_NOMI[u.mezzo]), 'bad'); }
      f.usati.splice(f.usati.indexOf(u), 1);
    }
    f.guai = f.guai.filter(g => this._attivo(g));
  }

  // ---------- Dialoghi ----------
  _zeno(text, choices) { return { who: 'zeno', name: 'Zeno il meccanico', text, choices }; }

  _pagina(primo = false) {
    const u = this.umore();
    const text = primo ? pick(ZENO.saluti[u]) : 'Allora? Il tempo è denaro. Il tuo, soprattutto.';
    return this._zeno(text, [...this.scelte(), { label: 'Esci', fn: null }]);
  }

  // scelte riusabili ovunque (dialogo di Zeno, bancone, porta dell'officina)
  scelte() {
    const s = this.s, veh = this.game.vehicles, out = [];
    const n = this._daRiparare().length + this._attrezziRotti().length;
    out.push({
      label: n ? `🔧 Ripara mezzi e attrezzi (${n} da sistemare)` : '🔧 Riparazioni: niente da fare',
      fn: () => [n ? this._paginaRip() : this._zeno(ZENO.nienteDaFare, [{ label: 'Indietro', fn: () => [this._pagina()] }])],
    });
    out.push({ label: 'Elaborazioni di Vespa e Punto', fn: () => [this._paginaElab()] });
    // pieno e gomma: servizi semplici, senza fregature
    const p = veh.get('punto');
    if (p) {
      const T = p.T;
      if (p.st.flat) out.push({ label: `Cambia la gomma della Punto (${T.tyre.price}€)`, disabled: s.money < T.tyre.price, fn: this._servizio(T.tyre.price, T.tyre.minutes, () => { p.st.flat = false; }, 'Gomma nuova. Le altre tre pregano.') });
      if (p.st.fuel < 95) out.push({ label: `Pieno alla Punto (${T.refuel.price}€): benzina ${Math.round(p.st.fuel)}%`, disabled: s.money < T.refuel.price, fn: this._servizio(T.refuel.price, T.refuel.minutes, () => { p.st.fuel = 100; }, 'Pieno fatto. La Punto ringrazia.') });
    }
    if (this.f.conto > 0) out.push({ label: `Salda il conto con Zeno (${this.f.conto}€)`, disabled: s.money <= 0, fn: () => { const n = Math.min(s.money, this.f.conto); s.money -= n; this.f.conto -= n; this.game.audio.sfx('coin'); return [this._zeno(this.f.conto ? `Mancano ${this.f.conto}€. Me li ricordo, eh.` : 'Pari. Per oggi.', [{ label: 'Indietro', fn: () => [this._pagina()] }])]; } });
    return out;
  }

  _servizio(price, minutes, fx, msg) {
    return () => { this.s.money -= price; this.s.minutes += minutes; fx(); this.game.audio.sfx('coin'); this.game.ui.toast(msg, 'good'); return [this._pagina()]; };
  }

  _daRiparare() { return this.game.vehicles.list.filter(v => v.st.cond < 100 || this._guaiFissi(v.id).length); }

  // attrezzi dei trattori rovinati (src/attrezzi.js li ripara nel suo menu)
  _attrezziRotti() {
    const A = this.game.attrezzi, st = A?.st; if (!st?.stato) return [];
    return Object.entries(st.stato).filter(([id, v]) => (A.ha?.(id) ?? true) && v < 100).map(([id, v]) => ({ id, stato: v }));
  }

  // Garonio chiama Zeno vicino a un mezzo rotto o a secco: riparazione (di giorno) oppure solo rimorchio fino a casa
  chiama(v) {
    const g = this.game, aperto = this._zenoAperto(), rotto = v.st.cond <= 0;
    const nome = MEZZI_NOMI[v.id], o = v.kind === 'trattore' ? 'o' : 'a';
    const choices = [];
    if (rotto && aperto) choices.push({ label: `🔧 Riparalo (traino incluso)`, fn: () => [this._conferma(v)] });
    if (!this.aCasa(v)) choices.push({ label: this.etichettaRimorchio(v), fn: () => this.rimorchio(v) });
    choices.push({ label: 'Lascia stare', fn: null });
    const testo = !aperto ? `${pick(ZENO.rimorchioNotte)} Riparazioni solo di giorno, dalle ${RIMORCHIO.ore[0]} alle ${RIMORCHIO.ore[1]}.`
      : rotto ? `Pronto? ${nome} rott${o}? Che novità. Te l${o} riparo o te l${o} riporto a casa e basta?`
      : `Pronto? ${nome} ${g.vehicles.aSecco(v) ? 'a secco' : 'piantat' + o}? Ti mando il carro.`;
    return g.ui.dialog([this._zeno(testo, choices)]);
  }

  _zenoAperto() { const h = (this.s.minutes / 60) % 24; return h >= RIMORCHIO.ore[0] && h < RIMORCHIO.ore[1]; }
  prezzoRimorchio(v) { return RIMORCHIO.prezzo[kindOf(v.id)] * (this._zenoAperto() ? 1 : RIMORCHIO.notte); }
  etichettaRimorchio(v) {
    const p = this.prezzoRimorchio(v), debito = this.s.money < p;
    return `🚚 Rimorchio fino in azienda: ${p}€${debito ? ' (a debito)' : ''}${this._zenoAperto() ? '' : ', tariffa notte'}`;
  }
  // il mezzo è già al suo posto in azienda?
  aCasa(v) { const p = this.game.vehicles.parking[v.id]; return !!p && Math.hypot(v.st.x - p.x, v.st.z - p.z) < 4; }

  // Solo trasporto: il mezzo torna al suo posto in azienda, Garonio viaggia con Zeno.
  // Si paga quello che si ha, il resto va sul conto di Zeno (debito).
  rimorchio(v) {
    const g = this.game, s = this.s, f = this.f, veh = g.vehicles;
    const prezzo = this.prezzoRimorchio(v), paga = Math.max(0, Math.min(Math.floor(s.money), prezzo)), debito = prezzo - paga;
    s.money -= paga; f.conto += debito;
    s.minutes += RIMORCHIO.minuti;
    // Garonio sale sul carro solo se è lì col mezzo (dal telefono può chiamare da lontano)
    const P0 = g.player.group.position, conLui = veh.driving === v || (!g.interni?.attivo && Math.hypot(P0.x - v.st.x, P0.z - v.st.z) < 6);
    if (veh.driving === v) veh.leave();
    const p = veh.parking[v.id];
    v.st.x = p.x; v.st.z = p.z; v.st.h = p.h; v.speed = 0; v.bloccatoT = 0;
    if (!veh._free(v, v.st.x, v.st.z)) veh._findFree(v);
    veh._pose(v);
    // a secco: Zeno lascia un goccio, giusto per arrivare alla cisterna o al distributore
    if (v.kind === 'punto') v.st.fuel = Math.max(v.st.fuel, RIMORCHIO.goccio);
    const A = g.attrezzi;
    if (v.kind === 'trattore' && A?.st?.gasolio) A.st.gasolio[v.id] = Math.max(A.gasolio(v.id), RIMORCHIO.goccio);
    // Garonio scende dal carro accanto al mezzo
    const [hx, hz] = v.T.box, P = g.player.group.position;
    if (conLui) for (const [dx, dz] of [[0, hz + 0.5], [hx + 0.5, 0], [-(hx + 0.5), 0], [0, -(hz + 0.5)], [0, hz + 1.5]]) {
      if (!g.world.blocked(v.st.x + dx, v.st.z + dz)) { P.set(v.st.x + dx, 0, v.st.z + dz); break; }
    }
    g.audio.sfx('coin');
    g.emit('carroAttrezzi', { mezzo: v.id, prezzo, debito });
    g.ui.toast(`🚚 ${MEZZI_NOMI[v.id]} riportat${v.kind === 'trattore' ? 'o' : 'a'} in azienda: ${prezzo}€${debito ? ` (${debito}€ sul conto di Zeno)` : ''}`, debito ? 'bad' : 'good');
    const righe = [pick(this._zenoAperto() ? ZENO.rimorchio : ZENO.rimorchioNotte)];
    if (debito) righe.push(ZENO.rimorchioDebito(debito));
    if (v.st.cond <= 0) righe.push('Rotto resta rotto, eh. Per quello vieni in officina.');
    return [this._zeno(righe.join(' '), [{ label: 'Grazie, Zeno', fn: null }])];
  }

  _guaiFissi(id) { return this.f.guai.filter(g => g.mezzo === id && !g.fino); }

  // prezzo del lavoro, con traino e conto vecchio
  preventivo(v) {
    const F = this.fascia(v.st.cond), kind = kindOf(v.id);
    const lavoro = v.st.cond >= 100 ? FASCE[0].prezzo[kind] : F.prezzo[kind]; // solo guasti delle elaborazioni: prezzo minimo
    const off = PLACES.parking.officina;
    const traino = v.st.cond <= 0 && Math.hypot(v.st.x - off.x, v.st.z - off.z) > TRAINO.distanza ? TRAINO.prezzo : 0;
    return { F, lavoro, traino, minuti: v.st.cond >= 100 ? FASCE[0].minuti : F.minuti };
  }

  _paginaRip() {
    const s = this.s, veh = this.game.vehicles;
    const choices = veh.list.filter(v => v.st.cond < 100 || this._guaiFissi(v.id).length).map(v => {
      const P = this.preventivo(v), tot = P.lavoro + P.traino;
      const guai = this._guaiFissi(v.id).length ? ' + guasto' : '';
      return {
        label: `${MEZZI_NOMI[v.id]}: ${P.F.nome} ${Math.round(v.st.cond)}%${guai} → ${tot}€${P.traino ? ' (traino incluso)' : ''}, ${fmtMin(P.minuti)}`,
        disabled: s.money < tot + this.f.conto,
        fn: () => [this._conferma(v)],
      };
    });
    const A = this.game.attrezzi, rotti = this._attrezziRotti();
    if (rotti.length && A?._paginaZeno) choices.push({ label: `🚜 Attrezzi: ${rotti.map(r => `${r.id} ${Math.round(r.stato)}%`).join(', ')}`, fn: () => [A._paginaZeno()] });
    choices.push({ label: 'Indietro', fn: () => [this._pagina()] });
    const text = this.f.conto > 0 ? ZENO.conto(this.f.conto) : 'Cosa ti sistemo? Scegli, che il listino cambia mentre parli.';
    return this._zeno(text, choices);
  }

  _conferma(v) {
    const s = this.s, P = this.preventivo(v), base = P.lavoro + P.traino, conFattura = Math.ceil(base * (1 + FATTURA));
    const conto = this.f.conto;
    return this._zeno(`${MEZZI_NOMI[v.id]}, ${P.F.nome}. Fa ${base}€${conto ? ` più i ${conto}€ del conto vecchio` : ''}. Con la fattura ${conFattura}€.`, [
      { label: `Paga ${base}€ e incrocia le dita`, disabled: s.money < base + conto, fn: () => this._ripara(v, false) },
      { label: `Con la fattura: ${conFattura}€, niente fregature`, disabled: s.money < conFattura + conto, fn: () => this._ripara(v, true) },
      { label: 'Lascia stare', fn: () => [this._paginaRip()] },
    ]);
  }

  // probabilità di una fregatura, ridotta dalla Parlantina
  _rischio(tipo) {
    const g = this.game.prog.grado?.('parlantina') || 0;
    return UMORI[this.umore()][tipo] * Math.max(0, 1 - PARLANTINA_SCONTO * g);
  }

  _ripara(v, fattura) {
    const s = this.s, f = this.f, g = this.game, P = this.preventivo(v);
    let prezzo = P.lavoro + P.traino;
    if (fattura) prezzo = Math.ceil(prezzo * (1 + FATTURA));
    s.money -= prezzo + f.conto; f.conto = 0;
    s.minutes += P.minuti;
    if (P.traino) this._traina(v);
    v.st.cond = 100;
    f.guai = f.guai.filter(x => !(x.mezzo === v.id && !x.fino)); // i guasti permanenti delle elaborazioni si sistemano qui
    f.usati = f.usati.filter(x => x.mezzo !== v.id);
    const righe = [P.traino ? ZENO.traino + ' ' + pick(ZENO.riparato) : pick(ZENO.riparato)];
    if (fattura) righe.unshift(pick(ZENO.fattura));
    else {
      if (Math.random() < this._rischio('meta')) { v.st.cond = META; righe.push(pick(ZENO.meta) + ` (${MEZZI_NOMI[v.id]} all'${META}%)`); }
      if (Math.random() < this._rischio('usato')) { f.usati.push({ mezzo: v.id, giorno: s.day + USATO.giorni }); righe.push(pick(ZENO.usato)); }
      if (Math.random() < this._rischio('sovrapprezzo')) {
        const extra = Math.ceil(prezzo * 0.5);
        const paga = Math.max(0, Math.min(s.money, extra));
        s.money -= paga; f.conto += extra - paga;
        righe.push(`${pick(ZENO.sovrapprezzo)} Altri ${extra}€.${extra > paga ? ` Quelli che non hai li segno sul conto.` : ''}`);
        g.png.cambiaAmicizia?.('zeno', -1);
      }
    }
    g.audio.sfx('coin');
    g.emit('riparato', { mezzo: v.id, prezzo, fattura });
    g.ui.toast(`${MEZZI_NOMI[v.id]} riparat${v.kind === 'trattore' ? 'o' : 'a'}: stato ${Math.round(v.st.cond)}%`, v.st.cond >= 100 ? 'good' : 'bad');
    return [this._zeno(righe.join(' '), [{ label: 'Indietro', fn: () => [this._pagina()] }, { label: 'Ciao', fn: null }])];
  }

  // il carro attrezzi porta il mezzo davanti all'officina
  _traina(v) {
    const veh = this.game.vehicles, o = PLACES.parking.officina;
    if (veh.driving === v) return;
    v.st.x = o.x; v.st.z = o.z + 2.5; v.st.h = o.dir;
    if (!veh._free(v, v.st.x, v.st.z)) veh._findFree(v);
    veh._pose(v);
  }

  // ---------- Elaborazioni ----------
  riuscita(e) { return clamp(e.riuscita + UMORI[this.umore()].riuscita, 0.05, 0.98); }

  elaborazioni() {
    const s = this.s, f = this.f, veh = this.game.vehicles, out = [];
    for (const [mezzo, lista] of Object.entries(ELABORAZIONI)) {
      const v = veh.get(mezzo); if (!v) continue;
      for (const [id, e] of Object.entries(lista)) {
        const fatta = f.elab[mezzo]?.[id];
        const guaio = f.guai.some(g => g.mezzo === mezzo && g.mod === id && this._attivo(g));
        let label = `${MEZZI_NOMI[mezzo]} · ${e.nome} (${e.prezzo}€, riesce al ${Math.round(this.riuscita(e) * 100)}%): ${e.desc}`;
        let disabled = s.money < e.prezzo;
        if (fatta) { label = `${MEZZI_NOMI[mezzo]} · ${e.nome} ✔`; disabled = true; }
        else if (v.st.cond <= 0) { label = `${MEZZI_NOMI[mezzo]} · ${e.nome}: prima va riparata`; disabled = true; }
        else if (guaio) { label = `${MEZZI_NOMI[mezzo]} · ${e.nome}: prima ripara il guasto`; disabled = true; }
        out.push({ label, disabled, fn: () => this._elabora(v, id, e) });
      }
    }
    return out;
  }

  _paginaElab() {
    const choices = [...this.elaborazioni(), { label: 'Indietro', fn: () => [this._pagina()] }];
    return this._zeno('Sul ponte. Cosa vuoi, la Vespa da corsa? Riesce. Forse. I soldi li prendo prima.', choices);
  }

  _elabora(v, id, e) {
    const s = this.s, f = this.f, g = this.game;
    s.money -= e.prezzo; s.minutes += 120;
    g.audio.sfx('coin');
    if (Math.random() < this.riuscita(e)) {
      (f.elab[v.id] ??= {})[id] = true;
      g.audio.sfx('level');
      g.ui.toast(`${e.nome}: riuscita! ${e.desc}`, 'good');
      g.emit('elaborazione', { mezzo: v.id, id, esito: 'ok' });
      return [this._zeno(pick(ZENO.elaboraBene), [{ label: 'Indietro', fn: () => [this._paginaElab()] }, { label: 'Ciao', fn: null }])];
    }
    const M = e.male;
    if (M.danno === true) v.st.cond = 0; else if (M.danno) v.st.cond = clamp(v.st.cond - M.danno, 0, 100);
    if (Object.keys(M.fx).length) f.guai.push({ mezzo: v.id, mod: id, fx: M.fx, fino: M.giorni ? s.day + M.giorni : 0 });
    g.audio.sfx('bad');
    g.ui.toast(`${e.nome} andata male: ${M.testo}.`, 'bad');
    g.emit('elaborazione', { mezzo: v.id, id, esito: 'male' });
    return [this._zeno(`${pick(ZENO.elaboraMale)} (${M.testo})`, [{ label: 'Indietro', fn: () => [this._paginaElab()] }, { label: 'Ciao', fn: null }])];
  }
}
