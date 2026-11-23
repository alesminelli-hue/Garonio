// Pilot di prova dell'annata: un menu di scorciatoie per provare in pochi minuti stagioni, meteo,
// attrezzi dei trattori, maiali, obiettivi e finali. Si accende con ?pilot nell'indirizzo
// (pulsante 🧪 in alto a destra), oppure dalla console: garonio.pilot.apri().
// Altri lavori possono aggiungere le loro voci: garonio.pilot.sezione('Bar', () => [{ label, fn }]).
import { AREAS } from './map.js';
import { STAGIONI, LAVORO_CAMPI as L, GIORNI_STAGIONE, GRANO_MINUTI, ATTREZZI } from './data/stagioni.js';

const H = 60;
const POSTI = {
  'Tettoia degli attrezzi': [94.6, 67.2],
  'Campo di mais': [74, 23.6],
  'Campo del grano': [37, 22.4],
  'Fienile (scarico cassone)': [54.5, 26.2],
  'Capannone dei maiali': [134, 69],
  'Recinto dei maiali': [139.5, 71.8],
  'Canale (acqua per la turbina)': [100, 8.2],
  'Officina (Zeno)': [85, 68.5],
};

const GUIDA = [
  "COSA PROVARE (1/4) · ATTREZZI. Tettoia accanto all'officina: E sulla rastrelliera. Il rosso parte con l'aratro, il verde con la seminatrice. Cambia attrezzo, fai il pieno di gasolio, ordina la semente. Nel campo a piedi non si zappa più: serve il trattore.",
  "COSA PROVARE (2/4) · CAMPI. Aratro sul campo di mais: le zolle si arano dietro al trattore. Poi seminatrice (consuma semente). Turbina sul rosso vicino al canale: spruzza e bagna. Falciatrice sul verde: raccoglie il maturo nel cassone (40), che si scarica al fienile. Uscendo dal campo fermati per alzare l'attrezzo, sennò la Vigilessa multa.",
  "COSA PROVARE (3/4) · MAIALI. Arrivano il giorno 3. Capannone o cancello del recinto: nutri, pulisci, cura (veterinario o pomata), rinfresca col caldo, vendi. Il giorno 9 di notte c'è il parto (veglia dopo le 21). In autunno, giorno 10, la fiera: servono maiali sani e contenti.",
  "COSA PROVARE (4/4) · ANNATA. Riga dell'annata sotto le barre (tocca per i dettagli): stagione, meteo, fiducia, obiettivo. A fine stagione il Gigante controlla l'obiettivo; dopo l'inverno c'è il finale alla cena di Natale (alto, medio o basso). Missioni nuove per stagione: trebbia, irriga, maiali, semina del grano, salumificio, manutenzione.",
];

export class Pilot {
  constructor(game) { this.game = game; this.extra = []; }
  get s() { return this.game.s; }

  init() {
    const on = /[?&#]pilot/.test(location.search + location.hash);
    if (!on) return;
    const b = document.createElement('button');
    b.id = 'btn-pilot'; b.title = 'Pilot di prova'; b.textContent = '🧪';
    b.addEventListener('click', e => { e.stopPropagation(); this.apri(); });
    document.getElementById('hud')?.appendChild(b);
    setTimeout(() => this.game.ui.toast('🧪 Pilot di prova attivo: pulsante in alto a destra.', 'good'), 2500);
  }

  sezione(nome, fn) { this.extra.push({ nome, fn }); }

  async apri() {
    const g = this.game;
    if (g.ui.busy() || g.locked || g.combat?.active) return;
    await g.ui.dialog([this._home()]);
  }

  _p(text, choices) { return { who: 'garonio', name: '🧪 Pilot dell\'annata', text, choices: [...choices, { label: 'Chiudi', fn: null }] }; }
  _ok(msg) { this.game.ui.toast('🧪 ' + msg, 'good'); return null; }

  _home() {
    const i = this.game.stagioni.info();
    return this._p(`Anno ${i.anno} · ${i.nome} giorno ${i.giorno}/14 · fiducia ${i.fiducia} · ${Math.floor(this.s.money)}€\nScorciatoie per provare tutto in fretta.`, [
      { label: '📖 Cosa provare (guida)', fn: () => GUIDA.map(t => ({ who: 'garonio', name: '🧪 Guida', text: t })) },
      { label: '🎒 Kit completo: attrezzi, 500€, gasolio, semente, maiali', fn: () => { this.kit(); return this._ok('Kit completo: tutti gli attrezzi, 500€, pieno, 10 sacchi di semente, maiali arrivati.'); } },
      { label: '🚜 Prove pronte coi trattori', fn: () => [this._trattori()] },
      { label: '🗺️ Teletrasporto', fn: () => [this._posti()] },
      { label: '🌦️ Meteo di oggi', fn: () => [this._meteo()] },
      { label: '🐖 Maiali', fn: () => [this._maiali()] },
      { label: '📅 Stagioni, obiettivi e finale', fn: () => [this._stagioni()] },
      { label: '🕘 Ora: salta alle 8:00 / 21:00', fn: () => [this._p('Che ora?', [
        { label: '08:00', fn: () => { this.s.minutes = 8 * H; return this._ok('Sono le 8.'); } },
        { label: '21:00', fn: () => { this.s.minutes = 21 * H; return this._ok('Sono le 21.'); } },
      ])] },
      ...this.extra.map(e => ({ label: e.nome, fn: () => [this._p(e.nome, e.fn())] })),
    ]);
  }

  // ---------- Azioni ----------
  kit() {
    const g = this.game, A = g.attrezzi.st;
    for (const a of Object.keys(ATTREZZI)) { A.posseduti[a] = true; A.stato[a] = 100; }
    A.gasolio.trattore1 = 100; A.gasolio.trattore2 = 100;
    A.semente += 10 * L.sementeSacco;
    this.s.money += 500;
    g.maiali.arriva();
    g.maiali.st.mangime += 5;
  }

  vai(x, z) {
    const g = this.game, v = g.vehicles.driving;
    if (v) { v.st.x = x; v.st.z = z; v.speed = 0; }
    g.player.group.position.set(x, 0, z);
  }

  // mette un trattore con l'attrezzo in un posto e ci fa salire Garonio
  pronto(idT, a, x, z, h = 0) {
    const g = this.game, V = g.vehicles;
    if (!g.attrezzi.ha(a)) { g.attrezzi.st.posseduti[a] = true; g.attrezzi.st.stato[a] = 100; }
    g.attrezzi.aggancia(idT, a);
    g.attrezzi.st.gasolio[idT] = 100;
    if (V.driving) V.dismount(true);
    const v = V.get(idT);
    v.st.cond = 100; v.st.x = x; v.st.z = z; v.st.h = h;
    g.player.group.position.set(x, 0, z + 1.2);
    V._mount(v);
  }

  _semina(crop, n = 999, stage = 0) {
    const s = this.s, W = this.game.world;
    const zone = crop === 'mais' ? AREAS.field : L.campoGrano;
    let k = 0;
    for (let z = zone.z0; z < zone.z1 && k < n; z++) for (let x = zone.x0; x < zone.x1 && k < n; x++) {
      const key = x + ',' + z;
      const g = crop === 'grano' ? GRANO_MINUTI * [0, 0.08, 0.5, 1][stage] : (stage === 3 ? 1e4 : 0);
      s.plots[key] = { crop, stage, water: false, g };
      W.setPlot(x, z, s.plots[key]); k++;
    }
    return k;
  }

  _trattori() {
    return this._p('Il trattore giusto, con l\'attrezzo giusto, già acceso sul posto.', [
      { label: '⛏️ Rosso con l\'aratro, al campo di mais', fn: () => { this.pronto('trattore1', 'aratro', 66, 23.5, -Math.PI / 2); return this._ok('Vai su nel campo: le zolle si arano dietro.'); } },
      { label: '🌱 Verde con la seminatrice, al campo di mais', fn: () => { this.pronto('trattore2', 'seminatrice', 70, 23.5, -Math.PI / 2); return this._ok('Passa sulle zolle arate: semina 2 file alla volta.'); } },
      { label: '💦 Rosso con la turbina vicino al canale (con mais seminato)', fn: () => { this._semina('mais', 120); this.pronto('trattore1', 'turbina', 74, 13, 0); return this._ok('Mais seminato e trattore sul campo: guarda gli spruzzi.'); } },
      { label: '🌾 Verde con la falciatrice al grano MATURO', fn: () => { this._semina('grano', 999, 3); this.pronto('trattore2', 'falciatrice', 37, 22.6, -Math.PI / 2); return this._ok('Trebbia! Poi porta il cassone al fienile (a est del campo).'); } },
      { label: '🌽 Verde con la falciatrice, mais maturo', fn: () => { this._semina('mais', 120, 3); this.pronto('trattore2', 'falciatrice', 66, 23.5, -Math.PI / 2); return this._ok('Raccogli il mais: pannocchie al fienile, poi alla cassa.'); } },
      { label: '⛽ Svuota il gasolio del trattore guidato', fn: () => { const v = this.game.vehicles.driving; if (v?.kind === 'trattore') this.game.attrezzi.st.gasolio[v.id] = 3; return this._ok('Quasi a secco: guida finché si ferma.'); } },
      { label: '🔧 Rovina gli attrezzi (stato 10%)', fn: () => { const st = this.game.attrezzi.st; for (const a of Object.keys(st.stato)) st.stato[a] = 10; return this._ok('Attrezzi malconci: Zeno li ripara.'); } },
    ]);
  }

  _posti() {
    return this._p('Dove vuoi andare? (se guidi, viene anche il mezzo)', Object.entries(POSTI).map(([n, [x, z]]) => ({ label: n, fn: () => { this.vai(x, z); return null; } })));
  }

  _meteo() {
    const St = this.game.stagioni;
    return this._p('Il meteo di oggi cambia subito, con i suoi effetti.', ['sereno', 'pioggia', 'caldo', 'grandine', 'nebbia', 'neve'].map(k => ({ label: k, fn: () => { St.meteoOggi(k); return null; } })));
  }

  _maiali() {
    const g = this.game, M = g.maiali;
    const serve = () => { if (!M.st.arrivati) M.arriva(); return M.st; };
    return this._p('I maiali (arrivano da soli il giorno 3).', [
      { label: 'Falli arrivare adesso', fn: () => { serve(); return this._ok('Maiali nel capannone e nel recinto (a est, oltre i silos).'); } },
      { label: 'Affamati e box sporchi', fn: () => { const st = serve(); st.sporco = 80; st.nutritiOggi = false; st.lista.forEach(p => { p.salute = 55; p.umore = 30; }); return this._ok('Ora vanno accuditi.'); } },
      { label: 'Uno si ammala', fn: () => { const st = serve(); const p = st.lista[0]; if (p) { p.malato = true; p.salute = 40; } return this._ok(`${p?.nome} sta male: veterinario o pomata.`); } },
      { label: 'Parto stanotte (salta alle 21)', fn: () => { const st = serve(); const p = st.lista.find(p => p.sesso === 'scrofa') || st.lista[0]; if (p) p.incinta = true; st.partoGiorno = this.s.day; this.s.minutes = 21 * H; return this._ok('Vai al capannone e veglia la scrofa.'); } },
      { label: 'Fiera di paese oggi (autunno, giorno 10)', fn: () => { serve(); this._giorno(2, 10); this.s.minutes = 9 * H; M.st.lista.forEach(p => { p.salute = 92; p.umore = 85; p.peso = 120; p.malato = false; }); return this._ok('È il giorno della fiera: porta i maiali dal capannone.'); } },
      { label: 'Inverno: salumificio', fn: () => { serve(); this._giorno(3, 2); return this._ok('D\'inverno il salumificio paga di più.'); } },
    ]);
  }

  // salta a un giorno di una stagione senza far passare la notte (per le prove)
  _giorno(idx, giorno) {
    const anno = this.game.stagioni.info().anno;
    this.s.day = (anno - 1) * GIORNI_STAGIONE * 4 + idx * GIORNI_STAGIONE + giorno;
  }

  _stagioni() {
    const St = this.game.stagioni, st = St.st;
    return this._p('Stagioni: si passa la notte e il Gigante controlla l\'obiettivo della stagione appena finita.', [
      ...STAGIONI.map((S, i) => ({ label: `${S.icona} Vai a ${S.nome} (cap. ${S.capitolo}) dormendo`, fn: () => { setTimeout(() => St.vaiAStagione(i), 50); return null; } })),
      { label: '⏭️ Ultimo giorno di questa stagione (poi vai a dormire)', fn: () => { const i = St.info(); this.s.day += i.giorniTot - i.giorno; return this._ok('Ultimo giorno: dormi a casa (dopo le 20) e il Gigante fa i conti.'); } },
      { label: '🎯 Completa l\'obiettivo di stagione', fn: () => { const i = St.info(); for (const o of i.obiettivi) { if (o.bilancio) st.soldiInizio = Math.min(st.soldiInizio, this.s.money - 100); else if (o.chiave === 'maialiSani') { this.game.maiali.arriva(); this.game.maiali.st.lista.forEach(p => { p.salute = 90; p.malato = false; }); } else st.prog[o.chiave] = o.n; } return this._ok('Obiettivo fatto.'); } },
      { label: '🤝 Fiducia del Gigante: 90', fn: () => { st.fiducia = 90; return this._ok('Fiducia 90: paga più alta.'); } },
      { label: '🤝 Fiducia del Gigante: 50', fn: () => { st.fiducia = 50; return null; } },
      { label: '🤝 Fiducia del Gigante: 15', fn: () => { st.fiducia = 15; return this._ok('Fiducia 15: ti trattiene la paga.'); } },
      { label: '🎄 Finale alto (campo tutto suo)', fn: () => { setTimeout(() => St.finale('alta'), 50); return null; } },
      { label: '🎄 Finale medio (garzone a vita)', fn: () => { setTimeout(() => St.finale('media'), 50); return null; } },
      { label: '🎄 Finale basso (Mister Mountain a Natale)', fn: () => { setTimeout(() => St.finale('bassa'), 50); return null; } },
      { label: '📢 Rivedi il titolo del capitolo', fn: () => { St.banner(); return null; } },
    ]);
  }
}
