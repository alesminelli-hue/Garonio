// Edifici del paese esplorabili: chiesa, castello, farmacia, studio medico, palestra, pizzeria e kebab
// (più il caffè e il garzone da Zeno). Le stanze stanno in src/data/interni.js e le costruisce src/interni.js;
// qui ci sono le azioni dei mobili (agganciate con game.interni.aggancia) e le scelte dei personaggi
// (game.png.aggiungiScelte). Testi e prezzi in src/data/edifici.js, personaggi in src/data/png.js.
//
// API (game.edifici):
//   vitaExtra()     vita massima guadagnata in palestra (letta da progressione.bonus('vitaMax'))
// Stato: s.flags.edifici = { giorno: { ...cose già fatte oggi }, palestra: { allenamenti, vitaMax }, conte: { lavori, chiave },
//                            cassapanca, libro, forziere }
import { PREZZI, FARMACIA, LAVORI_CONTE, CHIAVE_FORZIERE, TESTI_EDIFICI as T } from './data/edifici.js';
import { PNG } from './data/png.js';
import { OGGETTI } from './data/armi.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const PALESTRA = { ogni: 5, vita: 2, max: 20 };   // ogni 5 allenamenti +2 di vita massima, fino a +20

export class EdificiPaese {
  constructor(game) { this.game = game; }

  get s() { return this.game.s; }
  get f() {
    const f = (this.s.flags.edifici ??= {});
    if (f.giorno?.d !== this.s.day) f.giorno = { d: this.s.day };
    f.palestra ??= { allenamenti: 0, vitaMax: 0 };
    f.conte ??= { lavori: 0, chiave: false };
    return f;
  }
  get oggi() { return this.f.giorno; }

  vitaExtra() { return this.s.flags?.edifici?.palestra?.vitaMax || 0; }

  init() {
    const g = this.game, I = g.interni;
    // la vita massima guadagnata in palestra entra nei bonus di Garonio
    const prog = g.prog, bonus = prog.bonus.bind(prog);
    prog.bonus = key => bonus(key) + (key === 'vitaMax' ? this.vitaExtra() : 0);
    if (I?.aggancia) for (const [zona, fn] of Object.entries(this._azioni())) I.aggancia(zona, ctx => fn(ctx.mobile, ctx));
    this._scelte();
  }

  // ---------- Aiuti ----------
  _dice(text, name = '', who) { return this.game.ui.dialog([{ name, text, who }]); }
  _pg(id, text, choices) { return { who: id, name: PNG[id]?.nome || '', text, choices }; }
  _c() { const s = this.s; s.stress = clamp(s.stress, 0, 100); s.tired = clamp(s.tired, 0, 100); s.health = clamp(s.health, 0, s.maxHealth); }
  _paga(n) { const s = this.s; if (s.money < n) return false; s.money = Math.round((s.money - n) * 100) / 100; this.game.audio.sfx('coin'); return true; }
  _c_ora() { return (this.s.minutes / H) % 24; }
  _qui(id) { return !!this.game.png.dove(id); }

  // ---------- Mobili (tasto E) ----------
  _azioni() {
    const g = this.game, s = () => this.s;
    const C = T.chiesa, K = T.castello, F = T.farmacia, D = T.dottore, P = T.palestra, Z = T.pizzeria, B = T.kebab, M = T.meccanico;
    return {
      // ----- chiesa -----
      'chiesa:altare': () => this._dice(C.altare, 'Altare'),
      'chiesa:confessionale': () => this._confessa(),
      'chiesa:candele': () => {
        if (this.oggi.cero) return this._dice(C.ceroGia, 'Ceri');
        if (!this._paga(PREZZI.cero)) return this._dice(C.ceroPovero, 'Ceri');
        this.oggi.cero = true; s().stress -= 4; g._xp(2); this._c();
        return this._dice(C.cero, 'Ceri');
      },
      'chiesa:banco': async () => {
        const st = s();
        if (st.tired < 10) return this._dice(C.bancoNo, 'Banco');
        await this._dice(C.banco, 'Banco');
        await g.ui.fade(true);
        st.minutes += 30;
        const sveglia = this._qui('donPeppino') && Math.random() < 0.3;
        if (sveglia) st.stress += 2; else { st.tired -= 12; st.stress -= 3; }
        this._c();
        await g.ui.fade(false);
        return this._dice(sveglia ? C.bancoSveglia : C.bancoDormi, sveglia ? PNG.donPeppino.nome : 'Banco', sveglia ? 'donPeppino' : undefined);
      },
      'chiesa:acquasantiera': () => { if (!this.oggi.acqua) { this.oggi.acqua = true; s().stress -= 1; s().tired -= 2; this._c(); } return this._dice(C.acquasantiera, 'Acquasantiera'); },
      'chiesa:offerte': () => g.ui.dialog([{ name: 'Offerte', text: C.offerte, choices: [
        { label: `Lascia un'offerta (${PREZZI.offerta}€)`, disabled: s().money < PREZZI.offerta, fn: () => {
          this._paga(PREZZI.offerta); g.paradiso?.cambiaReputazione?.(1); g.png.cambiaAmicizia('donPeppino', 1);
          return [{ name: 'Offerte', text: C.offerta }];
        } },
        { label: 'Lascia stare', fn: null },
      ] }]),
      'chiesa:paramenti': () => this._dice(C.paramenti, 'Paramenti'),
      'chiesa:vino': () => {
        if (this._qui('suoraCarmela')) { s().stress += 3; this._c(); g.png.cambiaAmicizia('suoraCarmela', -1); return this._dice(C.vinoSuora, PNG.suoraCarmela.nome, 'suoraCarmela'); }
        if (this.oggi.vino) return this._dice(C.vinoGia, 'Sagrestia');
        this.oggi.vino = true; s().stress -= 8; s().tired += 4; s().minutes += 5; this._c();
        return this._dice(C.vino, 'Sagrestia');
      },
      'chiesa:campane': async () => {
        if (this.oggi.campane) return this._dice(C.campaneGia, 'Campane');
        this.oggi.campane = true; s().stress -= 6; this._c();
        g.audio.sfx('clink'); g.audio.sfx('clink');
        await this._dice(C.campane, 'Campane');
        if (this._qui('donPeppino')) { g.png.cambiaAmicizia('donPeppino', -2); await this._dice(C.campaneDon, PNG.donPeppino.nome, 'donPeppino'); }
      },
      // ----- castello -----
      'castello:armatura': () => this._dice(pick(K.armatura), 'Armatura'),
      'castello:arazzo': () => this._dice(K.arazzo, 'Arazzo'),
      'castello:cassapanca': () => {
        if (this.f.cassapanca) return this._dice(K.cassapancaVuota, 'Cassapanca');
        this.f.cassapanca = true; s().money += 5; g.audio.sfx('coin');
        return this._dice(K.cassapanca, 'Cassapanca');
      },
      'castello:camino': () => { s().tired -= 3; s().stress -= 3; s().minutes += 15; this._c(); return this._dice(K.camino, 'Camino'); },
      'castello:trono': () => {
        if (this._qui('conte')) { g.png.cambiaAmicizia('conte', -1); return this._dice(K.tronoConte, PNG.conte.nome, 'conte'); }
        if (!this.oggi.trono) { this.oggi.trono = true; s().stress -= 5; this._c(); }
        return this._dice(K.trono, 'Trono');
      },
      'castello:ritratto': () => this._dice(K.ritratto, 'Ritratti'),
      'castello:banchetto': () => this._dice(K.banchetto, 'Banchetto'),
      'castello:libreria': () => {
        if (this.f.libro) return this._dice(K.libreriaGia, 'Biblioteca');
        this.f.libro = true; s().minutes += 60; g._xp(30);
        return this._dice(K.libreria, 'Biblioteca');
      },
      'castello:mappa': () => this._dice(K.mappa, 'Mappa'),
      'castello:forziere': () => {
        if (this.f.forziere) return this._dice(K.forziereVuoto, 'Forziere');
        if (!this.f.conte.chiave) return this._dice(K.forziereChiuso, 'Forziere');
        this.f.forziere = true; s().money += 50; g.prog.dai('grappa', 2); g.audio.sfx('coin'); g._xp(10);
        return this._dice(K.forziere, 'Forziere');
      },
      // ----- farmacia -----
      'farmacia:bancone': () => (this._qui('pastiglia') ? g.ui.dialog([this._negozioFarmacia(true)]) : this._dice(F.chiuso, 'Farmacia')),
      'farmacia:espositore': () => this._dice(F.espositore, 'Offerte'),
      'farmacia:bilancia': () => {
        if (s().money < PREZZI.bilancia) return this._dice(F.povero, 'Bilancia');
        this._paga(PREZZI.bilancia);
        const peso = 78 + s().level + Math.round((s().inv.panino || 0) + (100 - s().tired) / 20);
        return this._dice(fill(F.bilancia, { peso, commento: pick(F.commentiPeso) }), 'Bilancia');
      },
      // ----- studio medico -----
      'dottore:accettazione': () => (this._qui('assunta') ? this._dice(D.accettazione, PNG.assunta.nome, 'assunta') : this._dice(D.accettazioneVuota, 'Accettazione')),
      'dottore:attesa': () => { s().minutes += 20; s().stress += 2; this._c(); return this._dice(D.attesa, 'Sala d\'attesa'); },
      'dottore:riviste': () => this._dice(pick(D.riviste), 'Riviste'),
      'dottore:avvisi': () => this._dice(D.avvisi, 'Avvisi'),
      'dottore:scrivania': () => this._dice(D.scrivania, 'Scrivania'),
      'dottore:lettino': () => (this._qui('dottorMutua') ? g.ui.dialog([this._visita()]) : this._dice(D.visitaVuota, 'Lettino')),
      'dottore:ottotipo': () => this._dice(D.ottotipo, 'Tabella'),
      'dottore:armadietto': () => this._dice(D.armadietto, 'Armadietto'),
      // ----- palestra -----
      'palestra:panca': () => this._allenati('panca', { stress: 10, fatica: 16, xp: 4, minuti: 45 }),
      'palestra:tapis': () => this._allenati('tapis', { stress: 8, fatica: 14, xp: 4, minuti: 40 }),
      'palestra:sacco': () => this._allenati('sacco', { stress: 16, fatica: 12, xp: 3, minuti: 30 }),
      'palestra:specchio': () => this._dice(this.f.palestra.allenamenti >= 10 ? P.specchioForte : pick(P.specchio), 'Specchio'),
      'palestra:doccia': () => { s().tired -= 10; s().stress -= 3; s().minutes += 15; this._c(); return this._dice(P.doccia, 'Doccia'); },
      'palestra:armadietto': () => this._dice(P.armadietto, 'Armadietto'),
      'palestra:abbonamenti': () => this._dice(P.abbonamenti, 'Bacheca'),
      // ----- pizzeria -----
      'pizzeria:bancone': () => (this._qui('gennaro') ? g.png.parla('gennaro') : this._dice(TESTI_CHIUSO.pizzeria, 'Pizzeria')),
      'pizzeria:forno': () => this._dice(Z.forno, 'Forno'),
      'pizzeria:vesuvio': () => this._dice(Z.vesuvio, 'Il Vesuvio'),
      'pizzeria:tavolo': () => (this._qui('concetta') || this._qui('gennaro') ? g.ui.dialog([this._menuPizza(true)]) : this._dice(Z.tavolo, 'Tavolo')),
      // ----- kebab -----
      'kebab:bancone': () => (this._qui('kemal') ? g.png.parla('kemal') : this._dice(TESTI_CHIUSO.kebab, 'Kebab')),
      'kebab:spiedo': () => this._dice(B.spiedo, 'Spiedo'),
      'kebab:menu': () => this._dice(B.menu, 'Menu'),
      'kebab:tavolino': () => this._dice(B.tavolino, 'Tavolino'),
      'kebab:frigo': () => (this._qui('kemal') ? g.ui.dialog([{ name: 'Frigo', text: B.frigo, choices: [this._bibita(), { label: 'Lascia stare', fn: null }] }]) : this._dice(B.frigo, 'Frigo')),
      // ----- Zeno -----
      'meccanico:calendario': () => this._dice(M.calendario, 'Calendario'),
      'meccanico:caffe': () => {
        if (!this._paga(PREZZI.caffeZeno)) return this._dice(M.cafPovero, 'Macchinetta');
        s().tired -= 10; s().minutes += 5; this._c(); g.audio.sfx('eat');
        return this._dice(M.caffe, 'Macchinetta');
      },
    };
  }

  // ---------- Chiesa ----------
  async _confessa() {
    const g = this.game, s = this.s, C = T.chiesa;
    if (!this._qui('donPeppino')) return this._dice(C.confessaVuoto, 'Confessionale');
    if (this.oggi.confessato) return this._dice(C.confessaGia, PNG.donPeppino.nome, 'donPeppino');
    const peccati = [...C.peccati];
    let multe = 0; try { multe = g.vigilessa?.daPagare?.() || 0; } catch (e) { console.error(e); }
    if (multe) peccati.unshift(C.peccatoMulte);
    if (Object.keys(s.flags.cascine || {}).length) peccati.push(C.peccatoTruffe);
    const assolvi = p => () => {
      this.oggi.confessato = true;
      s.stress -= 12; s.minutes += 20; this._c();
      g.png.cambiaAmicizia('donPeppino', 1); g._xp(3);
      return [this._pg('donPeppino', p.dice), { name: 'Confessionale', text: C.assolto }];
    };
    await g.ui.dialog([this._pg('donPeppino', C.confessa, [...peccati.slice(0, 4).map(p => ({ label: p.label, fn: assolvi(p) })), { label: 'Niente, ho sbagliato porta', fn: null }])]);
  }

  // ---------- Farmacia ----------
  _negozioFarmacia(primo) {
    const s = this.s, F = T.farmacia;
    const choices = FARMACIA.map(v => ({
      label: `${OGGETTI[v.id].icona} ${OGGETTI[v.id].nome} (${v.prezzo}€)${s.inv[v.id] ? ` · ne hai ${s.inv[v.id]}` : ''}`,
      disabled: s.money < v.prezzo,
      fn: () => { this._paga(v.prezzo); this.game.prog.dai(v.id); this.game.ui.toast(fill(F.comprato, { nome: OGGETTI[v.id].nome }), 'good'); return [this._pg('pastiglia', v.dice), this._negozioFarmacia(false)]; },
    }));
    choices.push({ label: 'Basta così', fn: null });
    return this._pg('pastiglia', primo ? F.banco : 'Altro?', choices);
  }

  // ---------- Dottore ----------
  _visita() {
    const g = this.game, s = this.s, D = T.dottore, pr = PREZZI.visitaMedica;
    if (this.oggi.visita) return this._pg('dottorMutua', D.visitaGia);
    if (s.money < pr) return this._pg('dottorMutua', fill(D.visitaPovero, { prezzo: pr }));
    return this._pg('dottorMutua', `La visita costa ${pr}€. Si stenda.`, [
      { label: `Paga ${pr}€ e stenditi`, fn: () => {
        this._paga(pr); this.oggi.visita = true;
        s.health = s.maxHealth; s.stress -= 5; s.minutes += 30; this._c();
        g.png.cambiaAmicizia('dottorMutua', 1);
        return [this._pg('dottorMutua', D.visita)];
      } },
      { label: 'Lascia stare', fn: null },
    ]);
  }

  // ---------- Palestra ----------
  async _allenati(attrezzo, { stress, fatica, xp, minuti }) {
    const g = this.game, s = this.s, P = T.palestra;
    if (!this.oggi.palestra) {
      const ok = await new Promise(res => g.ui.dialog([this._pg('sergente', fill(P.ingresso, { prezzo: PREZZI.palestra }), [
        { label: fill(P.paga, { prezzo: PREZZI.palestra }), disabled: s.money < PREZZI.palestra, fn: () => { this._paga(PREZZI.palestra); this.oggi.palestra = true; res(true); return null; } },
        { label: 'Lascia stare', fn: () => { res(false); return null; } },
      ])]).then(() => res(false)));
      if (!ok) return;
    }
    if (s.tired > 85) return this._dice(P.stanco, PNG.sergente.nome, 'sergente');
    const fat = Math.round(fatica * g.prog.fatica());
    await g.ui.fade(true);
    s.stress -= stress; s.tired += fat; s.minutes += minuti; this._c(); g._xp(xp);
    await g.ui.fade(false);
    await this._dice(`${pick(P[attrezzo])} ${fill(P.effetto, { stress, fatica: fat, xp })}`, 'Palestra');
    await this._contaAllenamento(1);
  }

  async _contaAllenamento(n) {
    const g = this.game, s = this.s, st = this.f.palestra;
    const prima = Math.floor(st.allenamenti / PALESTRA.ogni);
    st.allenamenti += n;
    const dopo = Math.floor(st.allenamenti / PALESTRA.ogni);
    if (dopo > prima && st.vitaMax < PALESTRA.max) {
      st.vitaMax = Math.min(PALESTRA.max, st.vitaMax + PALESTRA.vita * (dopo - prima));
      s.maxHealth = g.prog.maxHealth(); s.health = Math.min(s.maxHealth, s.health + PALESTRA.vita);
      g.audio.sfx('level');
      g.ui.toast(fill(T.palestra.vitaSu, { n: PALESTRA.vita, tot: st.allenamenti }), 'good');
    }
  }

  // ---------- Pizzeria e kebab ----------
  _menuPizza(primo) {
    const g = this.game, s = this.s, Z = T.pizzeria;
    const chi = this._qui('concetta') ? 'concetta' : 'gennaro';
    return this._pg(chi, primo ? 'Cosa ti porto?' : 'Altro?', [
      { label: fill(Z.ordina, { prezzo: PREZZI.pizza }), disabled: s.money < PREZZI.pizza, fn: () => {
        this._paga(PREZZI.pizza); s.health += 30; s.stress -= 10; s.minutes += 40; this._c(); g.audio.sfx('eat'); g.png.cambiaAmicizia('gennaro', 1);
        return [{ name: 'Pizzeria', text: pick(Z.mangiata) }];
      } },
      { label: fill(Z.asporto, { prezzo: PREZZI.pizzaAsporto }), disabled: s.money < PREZZI.pizzaAsporto, fn: () => {
        this._paga(PREZZI.pizzaAsporto); g.prog.dai('pizza'); g.ui.toast('🍕 Pizza da asporto nello zaino', 'good');
        return [this._pg('gennaro', Z.asportoDice)];
      } },
      { label: 'Niente, grazie', fn: null },
    ]);
  }

  _bibita() {
    const g = this.game, s = this.s, B = T.kebab;
    return { label: fill(B.bibita, { prezzo: PREZZI.bibita }), disabled: s.money < PREZZI.bibita, fn: () => {
      this._paga(PREZZI.bibita); s.tired -= 8; s.minutes += 5; this._c(); g.audio.sfx('eat');
      return [{ name: 'Kebab', text: B.bibitaDice }];
    } };
  }

  // ---------- Scelte dei personaggi ----------
  _scelte() {
    const g = this.game, s = () => this.s;
    const P = g.png;
    // Don Peppino e Suor Carmela
    P.aggiungiScelte('donPeppino', () => [
      { label: `${T.donPeppino.benedizione}`, disabled: s().money < PREZZI.benedizione && !this.oggi.benedetto, fn: () => {
        if (this.oggi.benedetto) return [this._pg('donPeppino', T.donPeppino.giaBenedetto)];
        this._paga(PREZZI.benedizione); this.oggi.benedetto = true; s().stress -= 5; this._c(); g.png.cambiaAmicizia('donPeppino', 2);
        return [this._pg('donPeppino', T.donPeppino.benedetto)];
      } },
      { label: T.donPeppino.chiediConte, fn: () => [this._pg('donPeppino', T.donPeppino.conte)] },
    ]);
    P.aggiungiScelte('suoraCarmela', () => [
      { label: T.suoraCarmela.aiuta, fn: () => {
        const S = T.suoraCarmela;
        if (this.oggi.sagrestia) return [this._pg('suoraCarmela', S.giaAiutato)];
        if (s().tired > 80) return [this._pg('suoraCarmela', S.stanco)];
        this.oggi.sagrestia = true; s().money += 8; s().tired += Math.round(10 * g.prog.fatica()); s().minutes += 60; this._c();
        g.audio.sfx('coin'); g._xp(5); g.png.cambiaAmicizia('suoraCarmela', 2);
        return [this._pg('suoraCarmela', S.aiutato)];
      } },
    ]);
    // il Conte e Ambrogio
    P.aggiungiScelte('conte', () => [
      { label: T.conte.lavoro, fn: () => this._lavoroConte() },
      { label: T.conte.storie, fn: () => { s().minutes += 15; s().stress -= 2; this._c(); return [this._pg('conte', pick(T.conte.raccontiDice))]; } },
    ]);
    P.aggiungiScelte('ambrogio', () => [
      { label: T.ambrogio.visita, disabled: s().money < PREZZI.visita && !this.f.visita, fn: () => {
        if (this.f.visita) return [this._pg('ambrogio', T.ambrogio.visitaGia)];
        this._paga(PREZZI.visita); this.f.visita = true; s().minutes += 60; g._xp(15);
        return [this._pg('ambrogio', T.ambrogio.visitaDice)];
      } },
      { label: T.ambrogio.te, fn: () => [this._pg('ambrogio', T.ambrogio.teDice)] },
    ]);
    // farmacia e dottore
    P.aggiungiScelte('pastiglia', () => [
      { label: '💊 Compra qualcosa', fn: () => [this._negozioFarmacia(true)] },
      { label: T.farmacia.consiglio, fn: () => {
        const st = s(), K = T.farmacia.consigli;
        const t = st.stress > 60 ? K.stress : st.health < st.maxHealth * 0.5 ? K.vita : st.tired > 60 ? K.stanco : K.bene;
        return [this._pg('pastiglia', t)];
      } },
    ]);
    P.aggiungiScelte('dottorMutua', () => [
      { label: fill(T.dottorMutua.visita, { prezzo: PREZZI.visitaMedica }), fn: () => [this._visita()] },
      { label: T.dottorMutua.certificato, fn: () => [this._pg('dottorMutua', pick(T.dottorMutua.certificatoDice))] },
    ]);
    // palestra
    P.aggiungiScelte('sergente', () => [
      { label: fill(T.palestra.sergente, { prezzo: PREZZI.sergente }), disabled: s().money < PREZZI.sergente, fn: () => {
        const st = s();
        if (st.tired > 75) return [this._pg('sergente', T.palestra.stanco)];
        this._paga(PREZZI.sergente); this.oggi.palestra = true;
        const fat = Math.round(25 * g.prog.fatica());
        st.stress -= 15; st.tired += fat; st.minutes += 60; this._c(); g._xp(10);
        setTimeout(() => this._contaAllenamento(2), 0);
        return [this._pg('sergente', T.palestra.sergenteDice), { name: 'Palestra', text: fill(T.palestra.effetto, { stress: 15, fatica: fat, xp: 10 }) }];
      } },
    ]);
    // pizzeria
    P.aggiungiScelte('gennaro', () => [{ label: '🍕 Ordina', fn: () => [this._menuPizza(true)] }]);
    P.aggiungiScelte('concetta', () => [
      { label: '🍕 Ordina', fn: () => [this._menuPizza(true)] },
      { label: T.pizzeria.pettegolezzi, fn: () => { s().minutes += 10; return [this._pg('concetta', pick(T.pizzeria.voci))]; } },
    ]);
    // kebab
    P.aggiungiScelte('kemal', () => {
      const B = T.kebab, notte = this._c_ora() >= 22, pr = notte ? PREZZI.kebabNotte : PREZZI.kebab;
      return [
        { label: fill(notte ? B.ordinaNotte : B.ordina, { prezzo: pr }), disabled: s().money < pr, fn: () => {
          const st = s();
          this._paga(pr); st.health += 25; st.tired -= 5; st.minutes += 20; g.audio.sfx('eat'); g.png.cambiaAmicizia('kemal', 1);
          const out = [{ name: 'Kebab', text: B.mangiato }];
          if (Math.random() < 0.2) { st.stress += 5; out.push({ name: 'Kebab', text: B.malDiPancia }); }
          this._c();
          return out;
        } },
        { label: fill(B.asporto, { prezzo: PREZZI.kebabAsporto }), disabled: s().money < PREZZI.kebabAsporto, fn: () => {
          this._paga(PREZZI.kebabAsporto); g.prog.dai('kebab'); g.ui.toast('🥙 Kebab nello zaino', 'good');
          return [this._pg('kemal', B.asportoDice)];
        } },
        this._bibita(),
      ];
    });
    // il garzone di Zeno sa com'è l'umore del capo
    P.aggiungiScelte('ivan', () => [
      { label: T.ivan.umore, fn: () => {
        let u = 'normale'; try { u = g.officina?.umore?.() || 'normale'; } catch { u = 'normale'; }
        return [this._pg('ivan', T.ivan.umori[u] || T.ivan.umori.normale)];
      } },
    ]);
  }

  _lavoroConte() {
    const g = this.game, s = this.s, Cn = T.conte, st = this.f.conte;
    if (this.oggi.conte) return [this._pg('conte', Cn.lavoroGia)];
    if (s.tired > 75) return [this._pg('conte', Cn.stanco)];
    const L = LAVORI_CONTE[(s.day + st.lavori) % LAVORI_CONTE.length];
    return [this._pg('conte', `${Cn.lavoroDice} ${L.testo}`, [
      { label: `Accetta (${L.ore} ore, ${L.paga}€)`, fn: () => {
        this.oggi.conte = true; st.lavori++;
        s.money += L.paga; s.tired += Math.round(L.fatica * g.prog.fatica()); s.minutes += L.ore * H; this._c();
        g.audio.sfx('coin'); g._xp(8); g.png.cambiaAmicizia('conte', 2);
        const out = [this._pg('conte', fill(Cn.lavoroFatto, { paga: L.paga }))];
        if (!st.chiave && st.lavori >= CHIAVE_FORZIERE) { st.chiave = true; out.push(this._pg('conte', Cn.chiave)); g.ui.toast('🗝️ Chiave del forziere del Conte', 'good'); }
        return out;
      } },
      { label: 'Un\'altra volta', fn: null },
    ])];
  }
}

// cartelli quando il personaggio al banco non c'è (succede solo negli orari di confine)
const TESTI_CHIUSO = {
  pizzeria: "Il banco è vuoto. Dal retro arriva Gennaro che canta sotto la doccia. Meglio ripassare.",
  kebab: "Il banco è vuoto. Lo spiedo gira da solo. Inquietante.",
};
