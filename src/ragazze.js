// Il dating simulator di Garonio: ragazze in giro per il paese da corteggiare con un gioco a dialoghi.
// Ogni ragazza ha una personalità (gusti per «tono» di risposta): le risposte giuste alzano l'affinità
// e i punti red pill, quelle sbagliate li fanno scendere. Con l'affinità arriva il numero, poi
// l'appuntamento la sera (pizzeria, laghetto, ponte, castello, kebab, campanile) e, se hai reputazione in paese e te la giochi bene,
// lei ti invita a salire: dissolvenza al nero e una battuta. Niente scene.
// Testi e numeri: src/data/ragazze.js.
//
// Le ragazze sono PNG come gli altri (src/png.js): posti, giro di jogging, ritratto, amicizia = affinità.
//
// API (game.ragazze):
//   redpill()                 punti red pill 0-100
//   rango()                   [soglia, nome, descrizione] del rango red pill
//   reputazione()             reputazione in paese 0-100 (la stessa del Night Paradiso)
//   affinita(id)              affinità con una ragazza
//   appuntamento()            { id, luogo, giorno, fatto } o null
// Eventi mandati: conquista { id }, appuntamento { id, luogo, esito }
// Stato: s.flags.ragazze = { redpill, app, r: { id: { conosciuta, numero, giorno, invito, bloccata, conquiste, uscite } } }
import { PNG } from './data/png.js';
import { RAGAZZE, LUOGHI, ORA_APPUNTAMENTO, RED_PILL, CUORE, TESTI_RAGAZZE as T } from './data/ragazze.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const mescola = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

// le ragazze entrano nella lista dei personaggi prima che game.png.init() li crei
const POSTI_BASE = {};
for (const [id, r] of Object.entries(RAGAZZE)) {
  POSTI_BASE[id] = r.posti;
  PNG[id] ??= {
    nome: r.nome, ruolo: r.chi, posti: r.posti, giro: r.giro, vel: r.vel, aspetto: r.aspetto,
    amicizia: [-50, 100, 0], saluti: r.saluti, chiacchiere: r.saluti, ragazza: true,
  };
}
// Una frase di un personaggio sulla ragazza con cui Garonio esce (src/data/png.js, campo sulleRagazze).
// null se Garonio non esce con nessuna o se nessuna frase vale per lei. {ragazza} = il nome della ragazza.
export function fraseSulleRagazze(s, lista) {
  const f = s.flags?.ragazze;
  if (!lista?.length || !f?.r) return null;
  const app = f.app && !f.app.fatto && f.app.giorno === s.day ? f.app.id : null;
  const frequentate = Object.keys(RAGAZZE).filter(id => f.r[id]?.uscite || f.r[id]?.conquiste);
  const id = app || (frequentate.length ? pick(frequentate) : null);
  if (!id) return null;
  const ok = lista.filter(x => typeof x === 'string' || ((!x.solo || x.solo.includes(id)) && (!x.tranne || !x.tranne.includes(id))));
  if (!ok.length) return null;
  const x = pick(ok);
  return fill(typeof x === 'string' ? x : x.t, { ragazza: RAGAZZE[id].nome });
}

// dove aspetta la sera dell'appuntamento (oggetti fissi: png.js li confronta per identità)
const POSTI_SERA = Object.fromEntries(Object.entries(LUOGHI).map(([k, l]) => [k, { ore: ORA_APPUNTAMENTO, x: l.x, z: l.z, fermo: true }]));

function h(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  for (const k of kids || []) if (k) e.appendChild(k);
  return e;
}
const barra = (v, max, col) => {
  const t = h('div', 'mn-track'), f = h('div', 'mn-fill');
  f.style.width = `${clamp(v / max * 100, 0, 100).toFixed(1)}%`; if (col) f.style.background = col;
  t.appendChild(f); return t;
};

export class Ragazze {
  constructor(game) {
    this.game = game;
    game.moduli.push(this);
  }
  get s() { return this.game.s; }
  get f() { return this.s.flags.ragazze; }

  init() {
    const g = this.game;
    this.s.flags.ragazze ??= {};
    const f = this.f;
    f.redpill ??= RED_PILL.partenza; f.r ??= {}; f.app ??= null;
    for (const id of Object.keys(RAGAZZE)) f.r[id] ??= { conosciuta: false, numero: false, giorno: 0, invito: 0, bloccata: 0, conquiste: 0, uscite: 0 };
    for (const id of Object.keys(RAGAZZE)) g.png.sostituisciDialogo(id, () => this._parla(id));
    g.on('nuovoGiorno', () => this._nuovoGiorno());
    g.menu.aggiungiScheda('cuori', { icona: '💘', nome: 'Cuori', render: m => this._scheda(m) });
    g.menu.aggiungiStatistica(() => [['💊 red pill', Math.round(f.redpill)]]);
    if (!document.getElementById('ragazze-css')) {
      const st = document.createElement('style'); st.id = 'ragazze-css';
      st.textContent = `#dialog.rz-buio { z-index: 9; }
.rz-rp .mn-fill { background: linear-gradient(90deg, #c83a3a, #ff5a7a) !important; }
.rz-rep .mn-fill { background: linear-gradient(90deg, #6a8ac8, #8ad0f0) !important; }
.rz-cuore .mn-fill { background: linear-gradient(90deg, #e86aa0, #ff3a6a) !important; }
.rz-ignota img, .rz-ignota .mn-face { filter: brightness(0) opacity(.35); }`;
      document.head.appendChild(st);
    }
    this._posti();
  }

  // ---------- Valori ----------
  redpill() { return this.f.redpill; }
  rango() { const rp = this.f.redpill; return [...RED_PILL.ranghi].reverse().find(r => rp >= r[0]) || RED_PILL.ranghi[0]; }
  reputazione() { return this.s.flags.paradiso?.reputazione ?? 50; }
  affinita(id) { return this.game.png.amicizia(id); }
  appuntamento() { return this.f.app; }
  _ora() { return (this.s.minutes / H) % 24; }
  _st(id) { return this.f.r[id]; }

  _cambiaRp(d) {
    if (!d) return;
    const f = this.f, prima = this.rango();
    f.redpill = clamp(f.redpill + d, 0, 100);
    const dopo = this.rango();
    if (dopo !== prima && d > 0) this.game.ui.toast(`💊 Nuovo rango: ${dopo[1]}`, 'good');
  }
  _cambiaRep(d) {
    const p = (this.s.flags.paradiso ??= {});
    p.reputazione = clamp((p.reputazione ?? 50) + d, 0, 100);
  }

  // ---------- Ogni fotogramma ----------
  update() {
    const app = this.f?.app;
    if (app && !app.fatto && app.giorno === this.s.day && this._ora() >= ORA_APPUNTAMENTO[1]) this._buca();
    this._posti();
  }

  // la sera dell'appuntamento la ragazza aspetta al luogo scelto
  _posti() {
    const app = this.f?.app, oggi = this.s.day;
    for (const id of Object.keys(RAGAZZE)) {
      const vuole = app && app.id === id && !app.fatto && app.giorno === oggi ? [POSTI_SERA[app.luogo], ...POSTI_BASE[id]] : POSTI_BASE[id];
      if (PNG[id].posti !== vuole) PNG[id].posti = vuole;
    }
  }

  _buca() {
    const app = this.f.app, r = RAGAZZE[app.id];
    this.f.app = null;
    this.game.png.cambiaAmicizia(app.id, CUORE.mancato);
    this._cambiaRp(RED_PILL.mancato);
    this._cambiaRep(-3);
    this.game.ui.toast(fill(T.mancato, { nome: r.nome, luogo: LUOGHI[app.luogo].breve }), 'bad');
    this.game.emit('appuntamento', { id: app.id, luogo: app.luogo, esito: 'buca' });
  }

  _nuovoGiorno() {
    const f = this.f;
    if (f.app && !f.app.fatto && f.app.giorno < this.s.day) this._buca();
    else if (f.app?.fatto) f.app = null;
    if (f.ieri) { const r = RAGAZZE[f.ieri]; setTimeout(() => this.game.ui.toast(`Bepi: «${fill(pick(T.pettegolezzo), { nome: r.nome })}»`, 'small'), 4000); f.ieri = null; }
  }

  // ---------- Dialoghi ----------
  _P(id, text, choices) { const r = RAGAZZE[id]; return { who: id, name: `${r.icona} ${r.nome}, ${r.eta}`, text, choices }; }

  async _parla(id) {
    const g = this.game, r = RAGAZZE[id], st = this._st(id), s = this.s, app = this.f.app;
    if (st.bloccata > s.day) return g.ui.dialog([{ text: r.blocco }]);
    // appuntamento di stasera
    if (app && app.id === id && app.giorno === s.day && !app.fatto) {
      const h0 = this._ora();
      if (h0 >= ORA_APPUNTAMENTO[0] && h0 < ORA_APPUNTAMENTO[1]) return this._serata(id);
      return g.ui.dialog([this._P(id, fill(T.promemoria, { luogo: LUOGHI[app.luogo].breve }))]);
    }
    const pagine = [];
    const jogging = r.jogging && !PNG[id].posti[0]?.fermo;
    if (jogging) { s.tired = clamp(s.tired + 3, 0, 120); pagine.push({ text: T.affanno }); }
    if (!st.conosciuta) { st.conosciuta = true; pagine.push(this._P(id, r.primaVolta)); }
    else pagine.push(this._P(id, st.conquiste ? pick(r.conquistata) : pick(r.saluti)));
    pagine[pagine.length - 1].choices = this._menu(id);
    await g.ui.dialog(pagine);
    await this._dopo();
  }

  _menu(id) {
    const r = RAGAZZE[id], st = this._st(id), s = this.s, app = this.f.app;
    const out = [];
    out.push({ label: st.giorno === s.day ? '💬 Corteggiala (domani)' : '💬 Corteggiala', disabled: st.giorno === s.day, fn: () => this._approccio(id) });
    if (st.numero) {
      const occupato = app && app.giorno === s.day && !app.fatto;
      out.push({ label: occupato ? '🌹 Chiedile di uscire (hai già un appuntamento)' : st.invito === s.day ? '🌹 Chiedile di uscire (domani)' : '🌹 Chiedile di uscire stasera',
        disabled: occupato || st.invito === s.day, fn: () => this._invito(id) });
    }
    out.push({ label: '👋 Ciao', fn: null });
    return out;
  }

  // una catena di domande: ogni risposta dà la reazione di lei e poi la domanda dopo; alla fine fine()
  _domande(id, lista, fine) {
    const r = RAGAZZE[id], g = this.game, conto = { punti: 0, maestro: false };
    const chiedi = k => {
      const q = lista[k];
      const rp = this.f.redpill;
      const intuito = clamp((rp - RED_PILL.intuito) / 40, 0, 1);
      const scelte = mescola(q.a).map(a => {
        const v = r.gusti[a.tono] ?? 0;
        const vede = v > 0 && Math.random() < intuito;
        return { label: (vede ? '👀 ' : '') + a.t, fn: () => [this._P(id, this._risposta(id, v, a.r, conto)), ...(k + 1 < lista.length ? [chiedi(k + 1)] : fine(conto))] };
      });
      if (rp >= RED_PILL.maestroDa && !conto.maestro) scelte.push({ label: T.maestro, fn: () => { conto.maestro = true; this._cambiaRp(RED_PILL.maestro - RED_PILL.giusta); return [this._P(id, this._risposta(id, 1, r.maestro, conto)), ...(k + 1 < lista.length ? [chiedi(k + 1)] : fine(conto))]; } });
      return this._P(id, q.d, scelte);
    };
    return chiedi(0);
  }

  _risposta(id, v, testo, conto) {
    const g = this.game;
    const dA = v > 0 ? CUORE.giusta : v < 0 ? CUORE.sbagliata : CUORE.neutra;
    const dR = v > 0 ? RED_PILL.giusta : v < 0 ? RED_PILL.sbagliata : 0;
    g.png.cambiaAmicizia(id, dA);
    this._cambiaRp(dR);
    conto.punti += v;
    g.audio.sfx(v > 0 ? 'good' : v < 0 ? 'bad' : 'blip');
    g.ui.float(`${v > 0 ? '💘' : v < 0 ? '💔' : '🤍'} ${dA > 0 ? '+' : ''}${dA} · 💊 ${dR > 0 ? '+' : ''}${dR}`);
    return testo;
  }

  _approccio(id) {
    const r = RAGAZZE[id], st = this._st(id), s = this.s, g = this.game;
    st.giorno = s.day;
    s.minutes += CUORE.minuti;
    const domande = mescola(r.approccio).slice(0, 2);
    return [this._domande(id, domande, () => {
      const aff = this.affinita(id);
      if (aff <= CUORE.blocco) {
        st.bloccata = s.day + CUORE.giorniBlocco;
        g.png.cambiaAmicizia(id, -aff);           // quando le passa, si riparte da zero
        g.ui.toast(`🚫 ${r.nome} ti ha bloccato per ${CUORE.giorniBlocco} giorni`, 'bad');
        return [{ text: r.blocco }];
      }
      if (!st.numero && aff >= CUORE.numero) {
        st.numero = true; g.audio.sfx('level');
        g.ui.toast(`📱 Hai il numero di ${r.nome}!`, 'good');
        return [this._P(id, r.numero)];
      }
      return [this._P(id, aff >= 15 ? T.chiusuraBuona : T.chiusuraMale)];
    })];
  }

  _invito(id) {
    const r = RAGAZZE[id], st = this._st(id), s = this.s, g = this.game;
    st.invito = s.day;
    if (this._ora() >= ORA_APPUNTAMENTO[0] - 0.5) return [this._P(id, T.tardi)];
    if (this.affinita(id) < CUORE.appuntamento) { this._cambiaRp(-1); return [this._P(id, r.rifiuta)]; }
    return [this._P(id, r.accetta), {
      text: T.scegliLuogo,
      choices: Object.entries(LUOGHI).map(([k, l]) => ({
        label: `${l.nome} · ${l.costo ? l.costo + '€' : 'gratis'}`,
        fn: () => {
          this.f.app = { id, luogo: k, giorno: s.day, fatto: false };
          this._posti();
          g.ui.toast(`🌹 Stasera: ${r.nome} a ${l.breve}`, 'good');
          return [{ text: fill(T.appuntamentoFissato, { luogo: l.breve }) }];
        },
      })),
    }];
  }

  // ---------- La serata ----------
  async _serata(id) {
    const g = this.game, r = RAGAZZE[id], st = this._st(id), s = this.s, app = this.f.app, L = LUOGHI[app.luogo];
    app.fatto = true; st.uscite++;
    s.minutes = Math.min(s.minutes + 90, 23.75 * H);   // la serata dura un'oretta e mezza (mai oltre mezzanotte)
    const pagine = [{ text: L.intro }];
    if (L.costo) {
      if (s.money >= L.costo) { s.money -= L.costo; g.audio.sfx('coin'); pagine.push({ text: fill(T.paga, { costo: L.costo }) }); }
      else { g.png.cambiaAmicizia(id, -10); this._cambiaRp(-5); pagine.push({ text: fill(T.senzaSoldi, { costo: L.costo, soldi: Math.floor(s.money), nome: r.nome }) }); }
    }
    if (r.posto === app.luogo) { g.png.cambiaAmicizia(id, CUORE.postoPreferito); pagine.push(this._P(id, T.postoPreferito)); }
    const domande = mescola(r.appuntamento).slice(0, 3);
    pagine.push(this._domande(id, domande, conto => this._finale(id, conto)));
    await g.ui.dialog(pagine);
    await this._dopo();
  }

  _finale(id, conto) {
    const g = this.game, r = RAGAZZE[id], app = this.f.app, aff = this.affinita(id);
    const fortuna = conto.punti === 0 && Math.random() < this.f.redpill / 100;   // più red pill, più fortuna sul filo
    const bene = conto.punti >= 1 || fortuna;
    if (aff >= CUORE.sale && bene) {
      g.emit('appuntamento', { id, luogo: app.luogo, esito: 'bacio' });
      if (this.reputazione() < CUORE.reputazione) return [this._P(id, r.bacio), this._P(id, r.reputazione)];
      return [this._P(id, r.bacio), this._P(id, r.sale, mescola(T.scelte.sale).map(c => ({
        label: c.t,
        fn: () => {
          if (!c.ok) { this._cambiaRp(RED_PILL.sbagliata); g.audio.sfx('bad'); return [this._P(id, c.r)]; }
          this._notte = id;     // dissolvenza dopo la chiusura del dialogo (src/ragazze.js _dopo)
          return null;
        },
      })))];
    }
    if (aff >= CUORE.bacio && conto.punti >= 0) { g.emit('appuntamento', { id, luogo: app.luogo, esito: 'bacio' }); return [this._P(id, r.bacio)]; }
    if (aff >= 30 && conto.punti >= -1) { g.emit('appuntamento', { id, luogo: app.luogo, esito: 'guancia' }); return [{ text: T.guancia }]; }
    g.png.cambiaAmicizia(id, -5);
    g.emit('appuntamento', { id, luogo: app.luogo, esito: 'fuga' });
    return [{ text: fill(T.scappa, { nome: r.nome }) }];
  }

  // la notte: nero, una battuta, e il giorno dopo il paese lo sa
  async _dopo() {
    const id = this._notte; if (!id) return;
    this._notte = null;
    const g = this.game, r = RAGAZZE[id], st = this._st(id), s = this.s, C = CUORE.conquista;
    g.locked = true;
    await g.ui.fade(true);
    const dlg = document.getElementById('dialog');
    dlg.classList.add('rz-buio');
    try { await g.ui.dialog([{ text: T.buio }, { name: r.nome, text: r.letto }]); }
    finally { dlg.classList.remove('rz-buio'); }
    st.conquiste++;
    this.f.ieri = id;
    s.stress = clamp(s.stress - C.stress, 0, 100);
    this._cambiaRp(RED_PILL.conquista);
    this._cambiaRep(C.reputazione);
    g._xp(C.xp);
    g.emit('conquista', { id });
    // la notte finisce lì: Garonio si risveglia a casa la mattina dopo (stesso giro del letto di casa)
    await g.ui.fade(false);   // si riapre un attimo: se la giornata va rifatta, il Gigante deve vedersi
    g.locked = false;
    await g.sleep(false);
    g.audio.sfx('level');
    g.ui.toast(`❤️‍🔥 ${r.nome} · Stress −${C.stress} · +${C.xp} XP · 💊 +${RED_PILL.conquista}`, 'good');
    await g.ui.dialog([{ text: pick(T.mattino) }]);
  }

  // ---------- Scheda 💘 nel menu ----------
  _scheda(m) {
    const f = this.f, s = this.s, out = [];
    const [, nome, desc] = this.rango();
    out.push(m._cartello('Punti red pill'));
    out.push(h('div', 'mn-nota', null, [
      h('div', 'mn-icon', '💊'),
      h('div', 'mn-nota-c', null, [h('b', null, `${nome} · ${Math.round(f.redpill)}/100`), h('div', 'rz-rp', null, [barra(f.redpill, 100)]), h('small', 'mn-desc2', desc),
        h('small', 'mn-desc2', f.redpill >= RED_PILL.maestroDa ? '😎 Mossa da maestro sbloccata' : f.redpill >= RED_PILL.intuito ? `👀 Intuito: a volte vedi la risposta giusta · 😎 a ${RED_PILL.maestroDa}` : `👀 Intuito a ${RED_PILL.intuito} punti`)]),
    ]));
    const rep = this.reputazione();
    out.push(h('div', 'mn-nota', null, [
      h('div', 'mn-icon', '🏘️'),
      h('div', 'mn-nota-c', null, [h('b', null, `Reputazione in paese · ${Math.round(rep)}`), h('div', 'rz-rep', null, [barra(rep, 100)]),
        h('small', 'mn-desc2', rep >= CUORE.reputazione ? 'Abbastanza per farti invitare a salire.' : `Sotto ${CUORE.reputazione} nessuna ti invita a salire.`)]),
    ]));
    const app = f.app;
    if (app && !app.fatto && app.giorno === s.day) {
      const l = LUOGHI[app.luogo];
      out.push(h('div', 'mn-nota ok', null, [h('div', 'mn-icon', '🌹'),
        h('div', 'mn-nota-c', null, [h('b', null, `Stasera: ${RAGAZZE[app.id].nome}`), h('small', null, `${l.nome} · dalle 20 alle 23:30${l.costo ? ` · ${l.costo}€` : ''}`)])]));
    }
    out.push(m._cartello('Le ragazze del paese'));
    for (const [id, r] of Object.entries(RAGAZZE)) {
      const st = f.r[id], aff = Math.round(this.affinita(id));
      const stato = st.bloccata > s.day ? '🚫 ti ha bloccato' : st.conquiste ? `❤️‍🔥 conquistata${st.conquiste > 1 ? ` ×${st.conquiste}` : ''}` : st.numero ? '📱 hai il numero' : st.conosciuta ? '💬 conosciuta' : '❔ da conoscere';
      const chips = [h('span', 'chip', stato)];
      if (st.uscite) chips.push(h('span', 'chip', `🌹 ${st.uscite}`));
      if (st.conosciuta && LUOGHI[r.posto] && st.uscite) chips.push(h('span', 'chip', `♥ ${LUOGHI[r.posto].breve}`));
      out.push(h('div', 'mn-nota' + (st.conosciuta ? '' : ' rz-ignota'), null, [
        m._faccia(id, r.icona),
        h('div', 'mn-nota-c', null, [
          h('b', null, st.conosciuta ? `${r.icona} ${r.nome}, ${r.eta}` : `${r.icona} ???`),
          st.conosciuta ? h('small', 'mn-desc2', r.chi) : null,
          st.conosciuta ? h('div', 'rz-cuore', null, [barra(Math.max(0, aff), 100)]) : null,
          h('small', 'mn-desc2', `📍 ${r.dove}`),
          h('div', 'mn-chips', null, chips),
        ]),
      ]));
    }
    out.push(h('p', 'mn-vuoto', 'Ogni ragazza ha i suoi gusti: chi ama le battute, chi la sincerità, chi non sopporta gli sdolcinati. Spacconi, piagnoni e cafoni di solito vanno male... ma non con tutte.'));
    return out;
  }
}
