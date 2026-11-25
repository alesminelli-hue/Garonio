// L'azienda agricola (GDD capitolo 27): l'endgame dopo la storia.
//  - Battuto Mister Mountain, il Gigante dà le «missioni dell'erede» (quattro, una dopo l'altra) e poi una
//    commessa al giorno con la roba della cascina, pagata più del consorzio.
//  - All'Ufficio agricolo (cartello blu sul fianco del municipio, aperto 8-13) si compra la Cascina dei Salici
//    (titolo «L'Imprenditore Agricolo») e poi, una per una, le strutture e i loro livelli (1-4).
//  - Ogni notte le strutture producono roba nel magazzino (mangime e gasolio si pagano ogni giorno: senza soldi
//    si produce la metà), a volte una si guasta. Dal registro davanti alla casa si vende al consorzio, a prezzi
//    che cambiano ogni giorno, si ripara e si assume il garzone (vende e ripara da solo, si tiene il 10%).
//  - La casa dà meno stress ogni mattina e più Vita massima. Davanti alle strutture girano maiali, galline, mucche.
//  - Scheda 🏡 Azienda nel menu J.
// Dati: src/data/azienda.js. Sprite: src/sprite_azienda.js.
//
// API (game.azienda):
//   erede()            la storia è finita e il Gigante considera Garonio il suo erede
//   comprata()         Garonio ha la cascina
//   lv(id)             livello di una struttura (0 = non comprata)
//   magazzino          { prodotto: quantità } (con i decimali: si vende solo l'intero)
//   prezzo(p)          prezzo di oggi al consorzio
//   vendi(garzone)     vende tutto l'intero del magazzino
//   notte()            la produzione di una notte (la fa da solo a ogni nuovoGiorno)
//   totali(chiave)     prodotto e guadagnato in tutto, o nella stagione 'primavera@1'...
//   scelteGigante()    scelte in più nel dialogo del Gigante
// Eventi: emette  ufficioAgricolo {}, aziendaComprata {}, struttura { id, lv }, produzione { cose },
//                 venditaAzienda { tot }, commessa { prodotto, n }
// Stato: s.flags.azienda = { erede, comprata, lv, mag, guasti, garzone, conti, tot, stag, commessa }
import * as PIX from './pixel.js';
import { AZIENDA as A, PRODOTTI, STRUTTURE, STAGIONE_AZIENDA, EREDE, TESTI_AZIENDA as T } from './data/azienda.js';
import { ATLANTE } from './data/sprite_personaggi.js';
import { targaUfficio, vendesi, insegnaAzienda, registro, cartelloScritta } from './sprite_azienda.js';
import { pagina, pagine, pick, fill } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const euro = n => Math.round(n).toLocaleString('it-IT');
const EREDI = Object.keys(EREDE.missioni);
// numero pseudo-casuale fisso per giorno e chiave (i prezzi di oggi non cambiano ricaricando)
function dado(day, k) { let h = day * 374761393 + [...k].reduce((a, c) => a * 31 + c.charCodeAt(0), 7); h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
const NOMI_SEGNI = { casa: 'CASA', porcilaia: 'PORCILAIA', pollaio: 'POLLAIO', stalla: 'STALLA', campi: 'CAMPI' };

export class Azienda {
  constructor(game) { this.game = game; this.segni = {}; this.bestie = []; this._tex = {}; }
  get s() { return this.game.s; }
  get st() {
    const f = (this.s.flags ??= {}); const st = (f.azienda ??= {});
    st.lv ??= {}; st.mag ??= {}; st.guasti ??= {}; st.tot ??= {}; st.stag ??= {};
    return st;
  }
  get magazzino() { return this.st.mag; }
  _ora() { return (this.s.minutes / 60); }
  erede() { return !!this.st.erede; }
  comprata() { return this.st.comprata != null; }
  lv(id) { return id === 'casa' ? (this.comprata() ? (this.st.lv.casa || 1) : 0) : (this.st.lv[id] || 0); }
  _stagione() { return this.game.bestie?.stagione?.() || 'primavera'; }
  _chiaveStag() { return `${this._stagione()}@${this.game.stagioni?.info?.().anno || 1}`; }

  init() {
    const g = this.game, p = g.prog, Q = g.quests;
    // le missioni dell'erede sono missioni del Gigante (le offre e le ritira lui, qui sotto)
    EREDI.forEach((id, i) => {
      const m = EREDE.missioni[id];
      Q.aggiungi(id, { ...m, da: 'gigante', erede: true, grazie: m.grazieCamper || m.grazie, requisiti: { check: () => this.erede() && (i === 0 || Q.stato(EREDI[i - 1]) === 'fatta') } });
    });
    if (g.boss?.stato?.('mountain') === 'vinto') this.st.erede = true;
    g.on('bossSconfitto', d => { if (d.id === 'mountain' && !d.leggenda && !this.st.erede) { this.st.erede = true; setTimeout(() => this._annuncio(), 2500); } });
    g.on('nuovoGiorno', () => { if (this.comprata()) setTimeout(() => this.notte(), 900); });
    // titolo e Vita massima
    const tit = p.titolo.bind(p);
    p.titolo = (level) => level == null && this.comprata() ? A.titolo : tit(level);
    const bonus = p.bonus.bind(p);
    p.bonus = key => bonus(key) + (key === 'vitaMax' && this.comprata() ? (STRUTTURE.casa.livelli[this.lv('casa') - 1].vitaMax || 0) : 0);
    g.bersagli.push(() => this.bersaglio());
    g.moduli.push({ animate: dt => this.animate(dt) });
    g.menu?.aggiungiScheda?.('azienda', { icona: '🏡', nome: 'Azienda', render: m => this._scheda(m) });
    g.menu?.aggiungiStatistica?.(() => this.comprata() ? [['Azienda agricola', `${euro(this.st.tot.guadagni || 0)}€ incassati`]] : []);
    this._disegna();
    g.pilot?.sezione?.('🏡 Azienda agricola', () => [
      { label: '👑 Storia finita: diventa l\'erede', fn: () => { this.st.erede = true; this._annuncio(); return null; } },
      { label: '✅ Completa le missioni dell\'erede', fn: () => { this.st.erede = true; for (const id of EREDI) if (Q.stato(id) !== 'fatta') { if (!Q.stato(id)) Q.accetta(id); Q.completa(id); } return null; } },
      { label: '🏛️ Vai all\'Ufficio agricolo', fn: () => { g.player.group.position.set(A.ufficio.x + 0.6, 0, A.ufficio.z + 0.4); return null; } },
      { label: '🏡 Vai alla cascina', fn: () => { g.player.group.position.set(A.registro.x, 0, A.registro.z + 0.8); return null; } },
      { label: '💶 +50.000€', fn: () => { this.s.money += 50000; return null; } },
      { label: '🏡 Compra la cascina e tutto al livello 2', fn: () => { this.st.erede = true; this._compra(true); for (const id of Object.keys(STRUTTURE)) this.st.lv[id] = Math.max(this.lv(id), 2); this._aggiorna(); return null; } },
      { label: '🌅 Fai passare una notte di produzione', fn: () => { this.notte(); return null; } },
    ]);
  }

  async _annuncio() {
    const g = this.game;
    if (g.ui.busy?.()) return setTimeout(() => this._annuncio(), 3000);
    await g.ui.dialog(pagine(EREDE.annuncio));
    g.ui.toast(`Nuove missioni dal Gigante: ${EREDE.etichetta}`, 'good');
  }

  // ---------- Il Gigante ----------
  scelteGigante() {
    if (!this.erede()) return [];
    const Q = this.game.quests, gig = testo => pagina({ chi: 'gigante', testo });
    const id = EREDI.find(i => Q.stato(i) !== 'fatta');
    if (id) {
      const q = Q.defs[id], m = EREDE.missioni[id], stato = Q.stato(id);
      if (stato === 'pronta') return [{ label: `✅ Riscuoti: ${q.titolo}`, fn: () => { Q.completa(id); return [gig(m.grazie)]; } }];
      if (stato === 'attiva') {
        const a = Q.attive().find(x => x.id === id);
        const dove = m.obiettivo.parla ? 'Vai a parlare col Vecchio Camper, al Parco Oglio.' : `${a?.progresso || 0}/${a?.n || 1}. Dai, che ce la fai.`;
        return [{ label: `👑 ${q.titolo}`, fn: () => [gig(dove)] }];
      }
      // il commento del Gigante sul consiglio del Camper, prima della missione dopo
      const prima = EREDI[EREDI.indexOf(id) - 1], commento = prima && EREDE.missioni[prima].grazieCamper ? [gig(EREDE.missioni[prima].grazie)] : [];
      return [{ label: EREDE.etichetta, fn: () => [...commento, { ...gig(m.offerta), choices: [
        { label: `Va bene, papà (+${m.premio.soldi}€)`, fn: () => { Q.accetta(id); return null; } },
        { label: 'Un\'altra volta', fn: null },
      ] }] }];
    }
    if (!this.comprata()) return [{ label: EREDE.etichetta, fn: () => [gig(EREDE.finite)] }];
    return [this._commessa()];
  }

  _commessa() {
    const st = this.st, s = this.s, C = EREDE.commessa, gig = testo => pagina({ chi: 'gigante', testo });
    if (st.commessa?.giorno !== s.day) {
      const fanno = Object.keys(PRODOTTI).filter(p => this._prodGiorno()[p] > 0);
      if (!fanno.length) st.commessa = { giorno: s.day, niente: true };
      else {
        const p = fanno[Math.floor(dado(s.day, 'commessa') * fanno.length)], al = this._prodGiorno()[p];
        st.commessa = { giorno: s.day, p, n: Math.max(1, Math.round(al * rand(1.2, 2))), pct: 30 + Math.floor(dado(s.day, 'pct') * 5) * 5 };
      }
    }
    const c = st.commessa;
    if (c.niente || c.fatta) return { label: C.etichetta, fn: () => [gig(C.niente)] };
    const P = PRODOTTI[c.p], paga = Math.round(c.n * this.prezzo(c.p) * (1 + c.pct / 100));
    const v = { n: c.n, nome: P.nome.toLowerCase(), pct: c.pct };
    return { label: `${C.etichetta}: ${P.icona} ${c.n} (${euro(paga)}€)`, fn: () => [{ ...gig(fill(pick(C.testi), v)), choices: [
      { label: `Consegna ${c.n} ${P.icona} (+${euro(paga)}€)`, fn: () => {
        const ha = Math.floor(st.mag[c.p] || 0);
        if (ha < c.n) return [gig(fill(C.manca, { ...v, ha }))];
        st.mag[c.p] -= c.n; c.fatta = true;
        this._incassa(paga);
        this.game.audio.sfx('coin');
        this.game.emit('commessa', { prodotto: c.p, n: c.n });
        return [gig(C.fatta), pagina({ testo: `💶 +${euro(paga)}€` })];
      } },
      { label: 'Non ce li ho', fn: null },
    ] }] };
  }

  // ---------- Bersagli del tasto E ----------
  bersaglio() {
    const g = this.game;
    if (g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position, d = (x, z) => Math.hypot(P.x - x, P.z - z);
    if (d(A.ufficio.x, A.ufficio.z) < 1.3) return { label: T.ufficio, fn: () => this.ufficio() };
    if (d(A.registro.x, A.registro.z) < 1.3) return this.comprata()
      ? { label: T.registro, fn: () => this.apriRegistro() }
      : { label: 'Leggi il cartello', fn: () => g.ui.toast(T.vendesi) };
    if (!this.comprata() && d(A.vendesi.x, A.vendesi.z) < 1.3) return { label: 'Leggi il cartello', fn: () => g.ui.toast(T.vendesi) };
    return null;
  }

  // ---------- Ufficio agricolo ----------
  async ufficio() {
    const g = this.game, Q = g.quests, o = this._ora();
    if (o < 8 || o >= 13) return g.ui.toast(T.ufficioChiuso);
    g.emit('ufficioAgricolo', {});
    const bra = (testo, choices) => ({ name: T.impiegata, text: testo, choices });
    if (!this.erede() || !Q.stato('erede_carta')) return g.ui.dialog([bra(pick(T.benvenuto)), bra(T.primaStoria)]);
    const menu = () => {
      const scelte = [];
      if (!this.comprata()) {
        scelte.push({ label: '📄 La Cascina dei Salici', fn: () => [bra(fill(T.info, { prezzo: euro(A.prezzo) })), menu()] });
        scelte.push({ label: fill(T.compra, { prezzo: euro(A.prezzo) }), fn: () => {
          if (this.s.money < A.prezzo) return [bra(fill(T.pocoSoldi, { manca: euro(A.prezzo - this.s.money) }))];
          this._compra();
          return [...pagine(T.comprata), menu()];
        } });
      } else {
        for (const [id, S] of Object.entries(STRUTTURE)) {
          const lv = this.lv(id), next = S.livelli[lv];
          if (!next) { scelte.push({ label: fill(T.massimo, { icona: S.icona, nome: S.nome }), fn: () => [menu()] }); continue; }
          scelte.push({ label: fill(T.compraStruttura, { icona: S.icona, nome: S.nome, lvNome: `Lv${lv + 1}`, prezzo: euro(next.prezzo) }), fn: () => [
            bra(`${S.icona} ${next.nome}: ${next.desc}.${next.costo ? ` Mangime e gasolio: ${next.costo}€ al giorno.` : ''} Prezzo: ${euro(next.prezzo)}€.`, [
              { label: `Firmo (${euro(next.prezzo)}€)`, fn: () => {
                if (this.s.money < next.prezzo) return [bra(fill(T.pocoSoldi, { manca: euro(next.prezzo - this.s.money) })), menu()];
                this.compraStruttura(id);
                return [bra(fill(T.comprataStruttura, { nome: S.nome, lv: lv + 1 })), menu()];
              } },
              { label: 'Ci penso', fn: () => [menu()] },
            ]),
          ] });
        }
      }
      scelte.push({ label: 'Arrivederci', fn: null });
      return bra(`Soldi: ${euro(this.s.money)}€. Cosa le serve?`, scelte);
    };
    await g.ui.dialog([bra(pick(T.benvenuto)), menu()]);
  }

  _compra(gratis = false) {
    const g = this.game, st = this.st;
    if (this.comprata()) return;
    if (!gratis) this.s.money -= A.prezzo;
    st.comprata = this.s.day; st.lv.casa = 1;
    this.s.maxHealth = g.prog.maxHealth();
    this._prezzi();
    g.audio.sfx('level');
    g.emit('aziendaComprata', {});
    this._aggiorna();
    g.save?.();
  }

  compraStruttura(id) {
    const g = this.game, S = STRUTTURE[id], lv = this.lv(id), next = S.livelli[lv];
    if (!next) return;
    this.s.money -= next.prezzo;
    this.st.lv[id] = lv + 1;
    delete this.st.guasti[id];
    this.s.maxHealth = g.prog.maxHealth();
    g.audio.sfx('coin');
    g.emit('struttura', { id, lv: lv + 1 });
    this._aggiorna();
    g.save?.();
  }

  // ---------- Produzione ----------
  // produzione di un giorno normale (senza guasti né fame), con la stagione
  _prodGiorno() {
    const out = {}, mod = STAGIONE_AZIENDA[this._stagione()] || {};
    for (const [id, S] of Object.entries(STRUTTURE)) {
      const L = S.livelli[this.lv(id) - 1]; if (!L?.prod) continue;
      for (const [p, n] of Object.entries(L.prod)) out[p] = (out[p] || 0) + n * (mod[p] ?? 1) * this._extra(id);
    }
    return out;
  }
  _costoGiorno() {
    const mod = STAGIONE_AZIENDA[this._stagione()] || {};
    let t = this.st.garzone ? A.garzone.costo : 0;
    for (const [id, S] of Object.entries(STRUTTURE)) {
      const L = S.livelli[this.lv(id) - 1]; if (!L?.costo || this.st.guasti[id]) continue;
      t += id === 'campi' && mod.campiCosto != null ? L.costo * mod.campiCosto : L.costo;
    }
    return Math.round(t * (1 - (this.game.consorzio?.scontoSpese?.() || 0)));
  }
  // i trattori del Consorzio Rodella danno più raccolto ai campi
  _extra(id) { return id === 'campi' ? 1 + (this.game.consorzio?.bonusCampi?.() || 0) : 1; }
  _prezzi() {
    const st = this.st, d = this.s.day;
    st.prezzi = { giorno: d, p: Object.fromEntries(Object.entries(PRODOTTI).map(([k, P]) => [k, P.prezzo * (0.75 + dado(d, k) * 0.5)])) };
  }
  prezzo(p) {
    if (this.st.prezzi?.giorno !== this.s.day) this._prezzi();
    return this.st.prezzi.p[p];
  }
  _conta(chiave, n) {
    const st = this.st, k = this._chiaveStag();
    st.tot[chiave] = (st.tot[chiave] || 0) + n;
    const sg = (st.stag[k] ??= {}); sg[chiave] = (sg[chiave] || 0) + n;
  }
  totali(stagione) { return stagione ? (this.st.stag[stagione] || {}) : this.st.tot; }
  _incassa(tot) { this.s.money += tot; this._conta('guadagni', tot); this.st.conti.entrate += tot; }

  notte() {
    const g = this.game, st = this.st, s = this.s;
    if (!this.comprata()) return;
    this._prezzi();
    st.conti = { giorno: s.day, entrate: 0, spese: 0 };
    const msg = [];
    // la casa
    const casa = STRUTTURE.casa.livelli[this.lv('casa') - 1];
    s.stress = clamp(s.stress + casa.stress, 0, 100);
    // mangime, gasolio, garzone
    const costo = this._costoGiorno(), fame = s.money < costo;
    if (!fame) { s.money -= costo; st.conti.spese = costo; this._conta('spese', costo); this.game.consorzio?.giornoContratto?.(); }
    else msg.push(T.fame);
    // produzione
    const mod = STAGIONE_AZIENDA[this._stagione()] || {}, fatto = {};
    for (const [id, S] of Object.entries(STRUTTURE)) {
      const L = S.livelli[this.lv(id) - 1]; if (!L?.prod || st.guasti[id]) continue;
      for (const [p, n] of Object.entries(L.prod)) {
        const q = n * (mod[p] ?? 1) * (fame ? 0.5 : 1) * this._extra(id); if (!q) continue;
        st.mag[p] = (st.mag[p] || 0) + q; fatto[p] = (fatto[p] || 0) + q; this._conta(p, q);
      }
    }
    // guasti (da domani quella struttura si ferma)
    for (const id of Object.keys(STRUTTURE)) {
      if (id === 'casa' || !this.lv(id) || st.guasti[id] || Math.random() >= A.guasto) continue;
      st.guasti[id] = true; msg.push(fill(T.guasto, { nome: STRUTTURE[id].nome }));
    }
    const cose = Object.entries(fatto).map(([p, n]) => `${PRODOTTI[p].icona} ${n < 10 ? Math.round(n * 10) / 10 : Math.round(n)}`).join(' · ');
    msg.unshift(fill(T.produzione, { cose: cose || 'niente' }));
    // il garzone
    if (st.garzone) {
      const rip = [];
      for (const id of Object.keys(st.guasti)) if (this.ripara(id, true)) rip.push(STRUTTURE[id].nome);
      const tot = this.vendi(true);
      msg.push(fill(T.garzoneFatto, { nome: A.garzone.nome, tot: euro(tot), riparato: rip.length ? rip.join(', ') : 'niente' }));
    }
    g.emit('produzione', { cose: fatto });
    msg.forEach((m, i) => setTimeout(() => g.ui.toast(m, m === T.fame || m.startsWith('⚠️') ? 'bad' : 'good'), 600 + i * 2200));
    this._aggiorna();
  }

  vendi(garzone = false) {
    const st = this.st, cose = [];
    let tot = 0;
    for (const [p, q] of Object.entries(st.mag)) {
      const n = Math.floor(q); if (n <= 0) continue;
      const v = n * this.prezzo(p) * (garzone ? 1 - A.garzone.taglio : 1);
      st.mag[p] = q - n; tot += v; cose.push(`${PRODOTTI[p].icona} ${n}`);
    }
    tot = Math.round(tot);
    if (!tot) return 0;
    st.conti ??= { giorno: this.s.day, entrate: 0, spese: 0 };
    this._incassa(tot);
    this.game.emit('venditaAzienda', { tot });
    if (!garzone) { this.game.audio.sfx('coin'); this.game.ui.toast(fill(T.venduto, { cose: cose.join(', '), tot: euro(tot) }), 'good'); }
    return tot;
  }

  _costoRiparazione(id) { return Math.round(STRUTTURE[id].livelli[this.lv(id) - 1].prezzo * 0.04 / 10) * 10 || 50; }
  ripara(id, garzone = false) {
    const st = this.st, s = this.s, c = this._costoRiparazione(id);
    if (!st.guasti[id]) return false;
    if (!garzone && (s.inv.rottame || 0) >= 2) this.game.prog.togliOggetto('rottame', 2);
    else if (s.money >= c) { s.money -= c; st.conti && (st.conti.spese += c); this._conta('spese', c); }
    else return false;
    delete st.guasti[id];
    if (!garzone) { this.game.audio.sfx('blip'); this.game.ui.toast(fill(T.riparata, { nome: STRUTTURE[id].nome }), 'good'); }
    return true;
  }

  // ---------- Il registro della cascina ----------
  async apriRegistro() {
    const g = this.game, st = this.st;
    const pag = () => {
      const righe = Object.entries(PRODOTTI).map(([p, P]) => {
        const q = st.mag[p] || 0, pr = this.prezzo(p), base = P.prezzo;
        return `${P.icona} ${Math.floor(q)} × ${pr < 10 ? pr.toFixed(2) : Math.round(pr)}€ ${pr > base * 1.1 ? '↑' : pr < base * 0.9 ? '↓' : ''}`;
      }).join('   ');
      const c = st.conti ? fill(T.conti, { entrate: euro(st.conti.entrate), spese: euro(st.conti.spese) }) : '';
      const scelte = [];
      const valore = Math.round(Object.entries(st.mag).reduce((t, [p, q]) => t + Math.floor(q) * this.prezzo(p), 0));
      scelte.push({ label: valore ? `💶 Vendi tutto al consorzio (${euro(valore)}€)` : '💶 Vendi (magazzino vuoto)', fn: () => { if (!valore) return [{ text: T.magazzinoVuoto }, pag()]; this.vendi(); return [pag()]; } });
      for (const id of Object.keys(st.guasti)) scelte.push({ label: fill(T.ripara, { nome: STRUTTURE[id].nome, prezzo: euro(this._costoRiparazione(id)) }), fn: () => { if (!this.ripara(id)) return [{ text: 'Non hai né i soldi né i pezzi di ricambio.' }, pag()]; return [pag()]; } });
      scelte.push(st.garzone
        ? { label: fill(T.licenzia, { nome: A.garzone.nome }), fn: () => { st.garzone = false; return [{ text: `${A.garzone.nome}: «Va bene, cugino. Ma la bici me la tengo.»` }, pag()]; } }
        : { label: fill(T.garzone, { nome: A.garzone.nome, costo: A.garzone.costo, taglio: Math.round(A.garzone.taglio * 100) }), fn: () => { st.garzone = true; return [{ text: `${A.garzone.nome}: «Agli ordini, cugino! Comincio domattina. Vendo tutto io, tu pensa a fare il signore.»` }, pag()]; } });
      scelte.push({ label: 'Chiudi', fn: null });
      return { name: T.registro, text: `Magazzino e prezzi di oggi: ${righe}. ${c} Spese di domani: ${euro(this._costoGiorno())}€.`, choices: scelte };
    };
    await g.ui.dialog([pag()]);
  }

  // ---------- Sulla mappa: cartelli e bestie ----------
  _t(nome, fn) { return (this._tex[nome] ??= PIX.toTexture(fn())); }
  _segno(key, tex, x, z, w, h) {
    const W = this.game.world;
    const spr = W.sprite(tex, { w, h });
    spr.position.set(x, h / 2, z);
    W.scene.add(spr);
    this.segni[key] = spr;
  }
  _togliSegni() {
    const W = this.game.world;
    for (const spr of Object.values(this.segni)) { W.scene.remove(spr); W.spriteMats?.delete(spr.material); }
    this.segni = {};
  }
  _disegna() {
    this._togliSegni();
    this._segno('ufficio', this._t('ufficio', targaUfficio), A.ufficio.x, A.ufficio.z, 1.15, 0.75);
    if (!this.comprata()) {
      this._segno('vendesi', this._t('vendesi', vendesi), A.vendesi.x, A.vendesi.z, 0.95, 0.8);
    } else {
      this._segno('insegna', this._t('insegna', insegnaAzienda), A.vendesi.x, A.vendesi.z, 1.75, 0.95);
      this._segno('registro', this._t('registro', registro), A.registro.x, A.registro.z, 0.6, 0.72);
      for (const [id, S] of Object.entries(STRUTTURE)) {
        const lv = this.lv(id); if (!lv) continue;
        const tex = this._t(`${id}:${lv}`, () => cartelloScritta([id === 'campi' ? NOMI_SEGNI[id] : `LIVELLO ${lv}`], { pallini: lv }));
        this._segno(id, tex, S.posto.x, S.posto.z, 0.95, 0.62);
      }
    }
    const mm = window.__garonio?.minimap;
    mm?.setMarker?.('azienda', this.comprata() ? A.registro.x : null, A.registro.z, '#e0b030');
    this._bestie();
  }
  _aggiorna() { this._disegna(); }

  _bestie() {
    const W = this.game.world;
    for (const b of this.bestie) b.a.remove ? b.a.remove() : W.scene.remove(b.a.group);
    this.bestie = [];
    for (const [id, S] of Object.entries(STRUTTURE)) {
      const an = S.animale, lv = this.lv(id); if (!an || !lv) continue;
      const at = ATLANTE[an.sprite]; if (!at || !PIX.haSprite(an.sprite)) continue;
      const [, , sw, sh] = at, h = an.w * (sh + 1) / sw;
      const fr = (this._fr ??= {})[an.sprite] ??= [0, 1].map(f => PIX.animale(an.sprite, f, sw, sh + 1));
      const [x0, z0, x1, z1] = an.area;
      for (let i = 0; i < lv + (an.sprite === 'gallina' ? lv : 0); i++) {
        const a = W.actor([...fr, ...fr.map(PIX.mirror)], { w: an.w, h, shadow: an.w * 0.3 });
        const x = rand(x0, x1), z = rand(z0, z1);
        this.bestie.push({ a, area: an.area, vel: an.sprite === 'gallina' ? 0.6 : 0.35, x, z, tx: x, tz: z, pausa: rand(0, 5), dir: 1, t: Math.random() * 5 });
      }
    }
  }

  animate(dt) {
    if (!this.bestie.length) return;
    const dentro = !!this.game.interni?.attivo;
    for (const b of this.bestie) {
      b.a.group.visible = !dentro;
      b.t += dt;
      const [x0, z0, x1, z1] = b.area, dx = b.tx - b.x, dz = b.tz - b.z, d = Math.hypot(dx, dz);
      let cammina = false;
      if (b.pausa > 0) b.pausa -= dt;
      else if (d < 0.1) { b.pausa = rand(2, 8); b.tx = rand(x0, x1); b.tz = rand(z0, z1); }
      else {
        const st = Math.min(d, b.vel * dt);
        b.x += dx / d * st; b.z += dz / d * st; cammina = true;
        if (Math.abs(dx) > 0.05) b.dir = dx > 0 ? 1 : -1;
      }
      b.a.group.position.set(b.x, 0, b.z);
      b.a.setFrame((b.dir > 0 ? 2 : 0) + (cammina ? Math.floor(b.t * 5) % 2 : 0));
    }
  }

  // ---------- Scheda 🏡 del menu J ----------
  _scheda() {
    const st = this.st, Q = this.game.quests, out = [];
    const el = (tag, cls, text, kids) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; for (const k of kids || []) if (k) e.appendChild(k); return e; };
    const riga = (icona, titolo, desc, ok) => el('div', 'mn-trofeo' + (ok ? ' ok' : ''), null, [el('span', 'mn-icon', icona), el('div', 'mn-nota-c', null, [el('b', null, titolo), el('small', 'mn-desc2', desc)])]);
    if (!this.comprata()) {
      out.push(el('div', 'mn-cartello', '🏚️ Cascina dei Salici'));
      const L = el('div', 'mn-trofei');
      if (!this.erede()) L.appendChild(riga('🔒', 'Prima finisci la storia', 'Batti Mister Mountain: poi il Gigante avrà qualcosa da dirti.', false));
      else for (const id of EREDI) { const q = Q.defs[id], s = Q.stato(id); L.appendChild(riga(s === 'fatta' ? '✔' : '👑', q.titolo, s === 'fatta' ? 'fatta' : s ? 'in corso' : 'da chiedere al Gigante', s === 'fatta')); }
      L.appendChild(riga('🏛️', `Prezzo: ${euro(A.prezzo)}€`, 'All\'Ufficio agricolo, sul fianco del municipio (8-13).', this.s.money >= A.prezzo));
      out.push(L);
      return out;
    }
    out.push(el('div', 'mn-cartello', `🏡 ${A.nomeDopo}`));
    const L = el('div', 'mn-trofei');
    for (const [id, S] of Object.entries(STRUTTURE)) {
      const lv = this.lv(id), Lv = S.livelli[lv - 1], next = S.livelli[lv];
      const stato = st.guasti[id] ? '⚠️ guasta · ' : '';
      L.appendChild(riga(S.icona, `${S.nome} ${'●'.repeat(lv)}${'○'.repeat(4 - lv)}`, lv ? `${stato}${Lv.nome}: ${Lv.desc}${next ? ` · prossimo ${euro(next.prezzo)}€` : ' · al massimo'}` : `non comprata · ${euro(next.prezzo)}€ in comune`, lv > 0 && !st.guasti[id]));
    }
    out.push(L);
    const mag = Object.entries(PRODOTTI).map(([p, P]) => `${P.icona} ${Math.floor(st.mag[p] || 0)}`).join('  ');
    out.push(el('div', 'mn-cartello', '📦 Magazzino'));
    out.push(el('div', 'mn-desc2', `${mag} · spese al giorno ${euro(this._costoGiorno())}€${st.garzone ? ` (con ${A.garzone.nome})` : ''}`));
    const t = st.tot;
    out.push(el('div', 'mn-cartello', '📈 In tutto'));
    out.push(el('div', 'mn-desc2', `Incassati ${euro(t.guadagni || 0)}€ · spesi ${euro(t.spese || 0)}€ · 🐖 ${Math.round(t.maiale || 0)} · 🥚 ${Math.round(t.uova || 0)} · 🥛 ${Math.round(t.latte || 0)} · 🧀 ${Math.round(t.formaggio || 0)} · 🌽 ${Math.round(t.mais || 0)} q · 🌾 ${Math.round(t.grano || 0)} q`));
    return out;
  }
}
