// La trama dell'annata (GDD 18.1): 4 stagioni da 14 giorni, obiettivi di stagione controllati dal Gigante,
// meteo del giorno, fiducia del Gigante (0-100) e finale dell'anno alla cena di Natale.
// Testi e numeri in src/data/stagioni.js.
//
// API (game.stagioni):
//   info()                 { nome, chiave, capitolo, icona, titolo, giorno, giorniTot, anno, obiettivo, obiettivi, progresso,
//                            fiducia, meteo, meteoIeri, evento, bilancio }
//   conta(chiave, n=1)     avanza un contatore della stagione (maisSeminato, granoVenduto, maisRaccolto, maialiPremiati...)
//   cambiaFiducia(k|n)     chiave di FIDUCIA (es. 'maialeMorto') oppure un numero
//   missionePossibile(m)   filtro per le missioni del Gigante: stagione, serveAttrezzo, serveMaiali
//   vaiAStagione(i), meteoOggi(k), finale(livello)   usati dal pilot
// Eventi: stagione { nome, capitolo, chiave, anno }, meteo { tipo }, finale { livello, fiducia, bilancio }
// Stato salvato in s.flags.annata.
import { STAGIONI, METEO, FIDUCIA, VERIFICA, FINALE, EVENTI, GIORNI_STAGIONE, LAVORO_CAMPI, GRANO_MINUTI } from './data/stagioni.js';
import { STORIA, INTRO } from './data/dialoghi.js';
import { pick, pagine } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let introAggiunta = false;

export class Stagioni {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get st() { return this.s.flags.annata; }

  init() {
    const s = this.s, g = this.game;
    s.flags.annata ??= { anno: 1, fiducia: FIDUCIA.iniziale, meteo: 'sereno', meteoIeri: null, prog: {}, soldiInizio: s.money, finali: [], storico: [] };
    this._campoGrano();
    // nuova partita: il primo capitolo si racconta subito dopo l'introduzione
    if (!s.introDone && !introAggiunta) { introAggiunta = true; INTRO.push(...STAGIONI[0].intro); }
    if (s.day === 1 && !this.st.bannerVisto) this._bannerDopo = true;
    g.on('nuovoGiorno', () => this._giorno());
    g.on('missioneFatta', d => this._missione(true, d));
    g.on('missioneFallita', () => this.cambiaFiducia('missioneFallita'));
    g.on('entrato', d => this._sagra(d));
    g.on('ora', () => this._controllaTrattori());
    // col caldo ogni lavoro stanca il 20% in più
    const fatica = g.prog.fatica.bind(g.prog);
    g.prog.fatica = () => fatica() * (this.st.meteo === 'caldo' ? 1.2 : 1);
    g.moduli.push({ animate: dt => this._frame(dt) });
    this._hud();
    this._fx();
    this._agganciaInterni();
    g.on('entrato', () => this._agganciaInterni());
  }

  // ---------- Dove siamo nell'anno ----------
  _indice(day = this.s.day) { return Math.floor((day - 1) / GIORNI_STAGIONE) % 4; }

  info() {
    const s = this.s, st = this.st, i = this._indice(), S = STAGIONI[i];
    const giorno = (s.day - 1) % GIORNI_STAGIONE + 1;
    const obiettivi = S.obiettivi.map(o => ({ ...o, fatto: this._progresso(o) }));
    return {
      nome: S.nome, chiave: S.chiave, capitolo: S.capitolo, icona: S.icona, titolo: S.titolo,
      giorno, giorniTot: GIORNI_STAGIONE, anno: Math.floor((s.day - 1) / (GIORNI_STAGIONE * 4)) + 1,
      obiettivo: obiettivi.map(o => `${o.testo} ${Math.floor(o.fatto)}/${o.n}`).join(' · '),
      obiettivi, progresso: obiettivi.every(o => o.fatto >= o.n),
      fiducia: Math.round(st.fiducia), meteo: st.meteo, meteoIeri: st.meteoIeri,
      evento: S.eventi[giorno] || null, bilancio: Math.round(s.money - st.soldiInizio),
    };
  }

  _progresso(o) {
    if (o.chiave === 'maialiSani') return this.game.maiali?.sani() ?? 0;
    if (o.bilancio) return Math.max(0, this.s.money - this.st.soldiInizio);
    return this.st.prog[o.chiave] || 0;
  }

  conta(k, n = 1) { this.st.prog[k] = (this.st.prog[k] || 0) + n; }

  cambiaFiducia(k) {
    const d = typeof k === 'number' ? k : FIDUCIA[k] || 0;
    this.st.fiducia = clamp(this.st.fiducia + d, 0, 100);
    return d;
  }

  missionePossibile(m) {
    if (m.stagione && ![].concat(m.stagione).includes(this.info().chiave)) return false;
    if (m.serveAttrezzo && !this.game.attrezzi?.ha(m.serveAttrezzo)) return false;
    if (m.serveMaiali && !this.game.maiali?.st.arrivati) return false;
    return true;
  }

  // ---------- Missioni del Gigante: fiducia e paga ----------
  _missione(ok, d) {
    this.cambiaFiducia('missioneFatta');
    const m = this.s.mission; if (!m) return;
    const bonus = Math.round(m.pay * (this.st.fiducia - 50) * FIDUCIA.pagaPerPunto);
    if (!bonus) return;
    this.s.money += bonus;
    setTimeout(() => this.game.ui.toast(bonus > 0 ? `Il Gigante si fida: ci aggiunge ${bonus}€` : `Il Gigante non si fida: trattiene ${-bonus}€`, bonus > 0 ? 'good' : 'bad'), 900);
  }

  _controllaTrattori() {
    const n = this.s.today.trattoriRotti || 0;
    if (n > (this._rotti || 0)) this.cambiaFiducia('trattoreRotto');
    this._rotti = n;
  }

  _sagra(d) {
    const i = this.info();
    if (d.edificio !== 'bar' || i.evento !== 'sagra' || this.s.minutes < 18 * H || this.st.sagra === this.s.day) return;
    this.st.sagra = this.s.day;
    this.s.stress = clamp(this.s.stress - 25, 0, 100);
    this.game.ui.toast('Sagra del paese! Liscio, salamelle e lambrusco: stress -25', 'good');
  }

  // ---------- Ogni mattina ----------
  _giorno() {
    const s = this.s, st = this.st, g = this.game;
    this._rotti = 0;
    const i = this.info();
    const pagineDelGiorno = [];
    if (i.giorno === 1 && s.day > 1) {
      // il Gigante controlla la stagione appena finita
      const prev = (this._indice() + 3) % 4;
      pagineDelGiorno.push(...this._verifica(prev));
      if (prev === 3) pagineDelGiorno.push(...this._fineAnno());
      st.prog = {};
      this._cicloGrano(i.chiave);
      pagineDelGiorno.push(...STAGIONI[this._indice()].intro);
      g.emit('stagione', { nome: i.nome, capitolo: i.capitolo, chiave: i.chiave, anno: i.anno });
      this._bannerDopo = true;
    }
    // meteo del giorno
    st.meteoIeri = st.meteo;
    this.meteoOggi(this._tiraMeteo(STAGIONI[this._indice()].meteo), false);
    if (st.meteo !== 'sereno') pagineDelGiorno.push({ testo: `${METEO[st.meteo].icona} ${METEO[st.meteo].testo}` });
    // eventi del giorno
    const ev = this.info().evento;
    if (ev === 'arrivoMaiali' && !g.maiali?.st.arrivati) pagineDelGiorno.push(...EVENTI.arrivoMaiali);
    else if (ev && EVENTI[ev] && ev !== 'arrivoMaiali') pagineDelGiorno.push(...EVENTI[ev]);
    if (g.maiali?.st.partoGiorno === s.day) pagineDelGiorno.push(...EVENTI.parto);
    if (pagineDelGiorno.length) STORIA[s.day] = [...(STORIA[s.day] || []), ...pagineDelGiorno];
  }

  _tiraMeteo(tab) {
    let r = Math.random();
    for (const [k, p] of Object.entries(tab)) if ((r -= p) < 0) return k;
    return 'sereno';
  }

  // imposta il meteo di oggi e ne applica gli effetti
  meteoOggi(k, avviso = true) {
    const s = this.s, g = this.game, st = this.st;
    st.meteo = k;
    if (k === 'pioggia') {
      for (const [key, p] of Object.entries(s.plots)) if (p.crop && !p.water) { p.water = true; const [x, z] = key.split(',').map(Number); g.world.setPlot(x, z, p); }
    }
    if (k === 'grandine') {
      const piante = Object.entries(s.plots).filter(([, p]) => p.crop && p.stage > 0);
      let n = 0;
      for (const [key, p] of piante) if (Math.random() < 0.18) {
        Object.assign(p, { crop: null, stage: 0, g: 0, water: false, stoppie: p.crop === 'grano' || p.crop === 'mais' || undefined });
        const [x, z] = key.split(',').map(Number); g.world.setPlot(x, z, p); n++;
      }
      st.grandine = n;
    }
    this._fxClass();
    g.emit('meteo', { tipo: k });
    if (avviso && k !== 'sereno') g.ui.toast(`${METEO[k].icona} ${METEO[k].testo}`);
  }

  // ---------- Verifica di fine stagione ----------
  _verifica(idx) {
    const S = STAGIONI[idx], st = this.st, g = this.game;
    const righe = S.obiettivi.map(o => {
      const fatto = Math.floor(o.bilancio ? this.s.money - st.soldiInizio : this._progresso(o));
      return { o, fatto, ok: o.bilancio ? fatto > 0 : fatto >= o.n };
    });
    const ok = righe.every(r => r.ok);
    const d = this.cambiaFiducia(ok ? 'obiettivoRiuscito' : 'obiettivoFallito');
    if (ok) this.s.money += VERIFICA.premio; else this.s.stress = clamp(this.s.stress + 15, 0, 100);
    st.storico.push({ anno: this.info().anno - (idx === 3 ? 1 : 0), stagione: S.chiave, ok });
    const elenco = righe.map(r => `${r.ok ? '✅' : '❌'} ${r.o.testo}: ${r.fatto}${r.o.bilancio ? '€' : '/' + r.o.n}`).join('\n');
    g.emit('obiettivoStagione', { stagione: S.chiave, riuscito: ok });
    return [
      { testo: `Fine del capitolo ${S.capitolo} · ${S.nome}. Il Gigante tira fuori il quaderno.\n${elenco}` },
      { chi: 'gigante', testo: pick(ok ? VERIFICA.riuscita : VERIFICA.fallita) },
      { testo: ok ? `Obiettivo riuscito: +${VERIFICA.premio}€, fiducia del Gigante +${d} (${Math.round(st.fiducia)}).` : `Obiettivo mancato: stress +15, fiducia del Gigante ${d} (${Math.round(st.fiducia)}).` },
    ];
  }

  _livelloFinale() {
    const f = this.st.fiducia, b = this.s.money - this.st.soldiInizio, T = FIDUCIA.soglie;
    if (f >= T.alta && b > 0) return 'alta';
    if (f < T.bassa || (b <= 0 && f < 50)) return 'bassa';
    return 'media';
  }

  _fineAnno(livello = this._livelloFinale()) {
    const st = this.st, s = this.s;
    const bilancio = Math.round(s.money - st.soldiInizio);
    st.finali.push({ anno: this.info().anno - 1, livello, fiducia: Math.round(st.fiducia), bilancio });
    if (livello === 'alta') st.campoSuo = true;
    if (livello === 'bassa') s.stress = clamp(s.stress + 35, 0, 100);
    st.soldiInizio = s.money;
    this.game.emit('finale', { livello, fiducia: Math.round(st.fiducia), bilancio });
    return [{ testo: `Bilancio dell'anno: ${bilancio >= 0 ? '+' : ''}${bilancio}€ · fiducia del Gigante ${Math.round(st.fiducia)}` }, ...FINALE[livello]];
  }

  // il grano si semina d'autunno, spunta d'inverno, cresce in primavera e si trebbia d'estate
  _cicloGrano(chiave) {
    const s = this.s, W = this.game.world;
    for (const [key, p] of Object.entries(s.plots)) {
      let cambia = false;
      if (p.crop === 'grano') {
        if (chiave === 'estate' && p.stage < 3) { p.stage = 3; p.g = GRANO_MINUTI; cambia = true; }
        if (chiave === 'inverno' && p.stage === 0) { p.stage = 1; p.g = GRANO_MINUTI * 0.08; cambia = true; }
        if (chiave === 'primavera' && p.stage === 1) { p.stage = 2; p.g = GRANO_MINUTI * 0.5; cambia = true; }
      } else if (p.crop === 'mais' && chiave === 'inverno') { // il gelo si prende il mais rimasto nel campo
        Object.assign(p, { crop: null, stage: 0, g: 0, water: false, stoppie: true }); cambia = true;
      }
      if (cambia) { const [x, z] = key.split(',').map(Number); W.setPlot(x, z, p); }
    }
  }

  // il campo del grano del Gigante: all'inizio è già seminato (dall'autunno scorso)
  _campoGrano() {
    const st = this.st, s = this.s, c = LAVORO_CAMPI.campoGrano;
    if (st.granoPronto) return;
    st.granoPronto = true;
    const k = this._indice();
    const stage = k === 1 ? 3 : k === 0 ? 2 : k === 3 ? 1 : 0;
    for (let z = c.z0; z < c.z1; z++) for (let x = c.x0; x < c.x1; x++) {
      const key = x + ',' + z;
      if (s.plots[key]) continue;
      s.plots[key] = stage ? { crop: 'grano', stage, water: false, g: GRANO_MINUTI * [0, 0.08, 0.5, 1][stage] } : { crop: null, stage: 0, water: false, g: 0, stoppie: true };
      this.game.world.setPlot(x, z, s.plots[key]);
    }
  }

  // ---------- Interfaccia ----------
  _hud() {
    const stats = document.getElementById('stats'); if (!stats) return;
    const el = document.createElement('div');
    el.id = 'annata-hud';
    el.title = 'L\'annata: tocca per i dettagli';
    el.addEventListener('click', e => { e.stopPropagation(); this.apriCalendario(); });
    stats.appendChild(el);
    this.hudEl = el;
    const b = document.createElement('div');
    b.id = 'capitolo-banner'; b.hidden = true;
    document.body.appendChild(b);
    this.bannerEl = b;
  }

  _aggiornaHud() {
    if (!this.hudEl) return;
    const i = this.info(), M = METEO[i.meteo] || METEO.sereno;
    const obj = i.obiettivi.map(o => `${o.testo.replace(/ \(€\)$/, '')} ${Math.floor(o.fatto)}${o.euro ? '€' : ''}/${o.n}${o.euro ? '€' : ''}`).join(' · ');
    const html = `<span class="st">${i.icona} ${i.nome} ${i.giorno}/${i.giorniTot}</span><span class="mt">${M.icona}</span><span class="fd" title="Fiducia del Gigante">🤝 ${i.fiducia}</span><div class="obj">${i.progresso ? '✅' : '🎯'} ${obj}</div>`;
    if (html !== this._hudHtml) { this._hudHtml = html; this.hudEl.innerHTML = html; }
  }

  banner(i = this.info()) {
    const b = this.bannerEl; if (!b) return;
    b.innerHTML = `<small>Anno ${i.anno} · Capitolo ${i.capitolo}</small><b>${i.icona} ${i.nome}</b><em>«${i.titolo}»</em>`;
    b.hidden = false; b.classList.remove('out'); void b.offsetWidth; b.classList.add('on');
    clearTimeout(this._bT);
    this._bT = setTimeout(() => { b.classList.add('out'); setTimeout(() => { b.hidden = true; b.classList.remove('on', 'out'); }, 700); }, 3200);
  }

  async apriCalendario() {
    const g = this.game;
    if (g.ui.busy() || g.locked) return;
    const i = this.info(), st = this.st, S = STAGIONI[this._indice()];
    const prossimi = Object.entries(S.eventi).filter(([d]) => +d >= i.giorno).map(([d, e]) => `giorno ${d}: ${{ arrivoMaiali: 'arrivano i maiali', parto: 'parto della scrofa', sagra: 'sagra del paese', fiera: 'fiera di paese', natale: 'Natale e conti dell\'anno' }[e]}`);
    const fid = st.fiducia >= FIDUCIA.soglie.alta ? 'alta: paga in più' : st.fiducia < FIDUCIA.soglie.bassa ? 'bassa: ti trattiene la paga' : 'media';
    await g.ui.dialog([{ who: 'gigante', name: `Anno ${i.anno} · ${i.icona} ${i.nome}: «${i.titolo}»`,
      text: `Giorno ${i.giorno} di ${i.giorniTot} · meteo: ${METEO[i.meteo].nome}\nObiettivo di stagione: ${i.obiettivo}\nFiducia del Gigante: ${i.fiducia} (${fid})\nBilancio dell'anno: ${i.bilancio >= 0 ? '+' : ''}${i.bilancio}€${prossimi.length ? '\nIn arrivo: ' + prossimi.join(', ') : ''}` }]);
  }

  // effetti del meteo: pioggia, neve, caldo (sovrapposti) e nebbia (foschia della scena)
  _fx() {
    const d = document.createElement('div');
    d.id = 'meteo-fx';
    document.body.appendChild(d);
    this.fxEl = d;
    this._fxClass();
  }
  _fxClass() { if (this.fxEl) this.fxEl.className = this.st.meteo || ''; }

  _frame(dt) {
    const g = this.game;
    this._hT = (this._hT || 0) - dt;
    if (this._hT <= 0) { this._hT = 0.4; this._aggiornaHud(); }
    if (this._bannerDopo && !g.ui.busy() && !g.locked) { this._bannerDopo = false; this.st.bannerVisto = true; this.banner(); }
    // nebbia: la foschia si avvicina
    const fog = g.world.scene.fog; if (!fog) return;
    const want = this.st.meteo === 'nebbia' ? [6, 26] : this.st.meteo === 'neve' ? [14, 48] : null;
    if (!want) { if (this._fogSet) { fog.near = this._fogBase[0]; fog.far = this._fogBase[1]; this._fogSet = false; } this._fogBase = [fog.near, fog.far]; return; }
    if (!this._fogSet || fog.near !== want[0]) { if (!this._fogSet) this._fogBase = [fog.near, fog.far]; fog.near = want[0]; fog.far = want[1]; this._fogSet = true; }
  }

  // ---------- Per il pilot ----------
  async vaiAStagione(idx) {
    const s = this.s;
    const anno = this.info().anno;
    let target = (anno - 1) * GIORNI_STAGIONE * 4 + idx * GIORNI_STAGIONE + 1;
    if (target <= s.day) target += GIORNI_STAGIONE * 4;
    s.day = target - 1;
    await this.game.sleep(false);
  }

  async finale(livello) {
    const pages = this._fineAnno(livello);
    this.st.finali.pop();
    await this.game.ui.dialog(pagine(pages));
  }

  // ---------- Interni (lavoro A): calendario e quaderno dei conti in casa ----------
  _agganciaInterni() {
    const I = this.game.interni;
    if (!I?.aggancia || this._interniOk) return;
    this._interniOk = true;
    I.aggancia('casa:calendario', () => this.apriCalendario());
    I.aggancia('casa:conti', async () => {
      const i = this.info(), st = this.st;
      const storia = st.storico.slice(-8).map(r => `${r.ok ? '✅' : '❌'} anno ${r.anno}, ${r.stagione}`).join('\n') || 'Nessuna stagione chiusa, per ora.';
      await this.game.ui.dialog([{ who: 'gigante', name: 'Il quaderno dei conti', text: `Bilancio dell'anno: ${i.bilancio >= 0 ? '+' : ''}${i.bilancio}€ · fiducia ${i.fiducia}\n${storia}` }]);
    });
  }
}
