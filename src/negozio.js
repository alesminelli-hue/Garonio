// Il magazzino del Bubetto (GDD 19.3): vestiti, armi, manuali, oggetti e l'angolo dell'usato,
// la lavagna con le sue commissioni, la fiducia del Bubetto, e l'affilatura delle armi da Zeno (GDD 16.1).
// Testi e prezzi stanno in src/data/negozio.js.
//
// API (game.negozio):
//   apri(reparto?)       apre il negozio (reparto: 'armi' | 'vestiti' | 'manuali' | 'oggetti' | 'usato' | 'vendi')
//   lavagna()            le commissioni del Bubetto (per la lavagna del magazzino)
//   affila()             il dialogo dell'affilatura (mola di Zeno)
//   capitolo()           capitolo dell'annata usato per le armi e i manuali in vendita
//   fiducia() / sconto()
//   sbloccaTutto()       per provare dalla console: tutte le armi e i manuali in vendita
// Stato salvato: s.flags.negozio = { fiducia, manuali: [], usatoSettimana, usatoComprati: [], capitolo, ferro: [] }
// Eventi emessi: comprato { tipo, id, prezzo }, affilatura { arma, grado, fregatura }
import * as PIX from './pixel.js';
import { ARMI, VESTITI, OGGETTI, AFFILATURA } from './data/armi.js';
import { NEGOZIO, VESTITI_IN_VENDITA, MANUALI, OGGETTI_IN_VENDITA, ATTREZZATURA, USATO, FRASI, LAVAGNA, FERRO_VECCHIO, AFFILA } from './data/negozio.js';
import { pick, fill } from './racconto.js';

const PILOT_GUIDA = [
  "COSA PROVARE (1/3) · NEGOZIO. Il Bubetto sta nel suo magazzino in paese (dalle 9 alle 20). Bancone: parli con lui e apri il magazzino. Scaffali: armi, vestiti, manuali (+1 punto abilità) e oggetti. Angolo dell'usato: roba rara che cambia ogni lunedì. Le armi escono man mano: in primavera fino al forcone, in estate fino alla roncola, la motosega in autunno (col Kit è già tutto in vendita).",
  "COSA PROVARE (2/3) · ARMI E MOSSE. Ogni arma porta la sua mossa nel menu Abilità dello scontro: Rastrellata (due nemici), Badilata (stordisce), Spazzata, Falciata (critico), Fendente (ignora la difesa), Motosegata (consuma benzina). Con Lottatore 3 arriva la seconda mossa. Oggetti nello scontro: trappola (stordisce), grappa (stress giù ma mira storta), pomata, panino. Il santino della nonna ti rialza una volta al giorno.",
  "COSA PROVARE (3/3) · COMMISSIONI E ZENO. Lavagna del Bubetto, una alla volta: code di nutria, 10 piccioni (tra piazza e silos), 3 pezzi di ferro nei fossi della capezzagna (luccicano), il pacco per il Postino, i soldi di Mister Frank, 5 code di ratto (i ratti dei capannoni di notte). Ogni commissione alza la fiducia: più sconto e più roba nell'usato. In officina Zeno affila l'arma (3 gradi)... a volte ti frega.",
];


// ---------- Sprite: ferro vecchio ----------
function outline(c, color = '#1a1420') {
  const g = c.getContext('2d'), { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = color;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (a(x, y) > 0) continue;
    if (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1)) g.fillRect(x, y, 1, 1);
  }
  return c;
}
function ferroSprite() {
  const [c, g] = PIX.makeCanvas(12, 8);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#4a6a2a', 0, 5, 12, 3);                   // erba del fosso
  P('#8a4a2a', 2, 3, 7, 2); P('#a85a2a', 3, 3, 3, 1); // ferro arrugginito
  P('#6a6a72', 7, 1, 2, 4);                    // tubo
  P('#fff6a0', 9, 0, 1, 1); P('#fff6a0', 1, 2, 1, 1); // luccichio
  return outline(c);
}

export class Negozio {
  constructor(game) {
    this.game = game;
    this.ferri = [];       // pezzi di ferro nei fossi
  }
  get s() { return this.game.s; }
  get st() { return this.s.flags.negozio; }
  get prog() { return this.game.prog; }

  init() {
    const g = this.game;
    this.s.flags.negozio = Object.assign({ fiducia: 0, manuali: [], usatoSettimana: -1, usatoComprati: [], capitolo: 1, ferro: [], tutto: false }, this.s.flags.negozio || {});
    // commissioni della lavagna
    for (const [id, def] of Object.entries(LAVAGNA)) g.quests.aggiungi(id, def);
    // scelte in più nei dialoghi
    g.png.aggiungiScelte('bubetto', () => [
      { label: '🛒 Vediamo il magazzino', fn: () => [this._home()] },
    ]);
    g.png.aggiungiScelte('zeno', () => [this._sceltaAffila()]);
    // eventi
    g.on('stagione', d => { if (d?.capitolo) this.st.capitolo = Math.max(this.st.capitolo, d.capitolo); });
    g.on('secondaria', d => {
      if (d.stato === 'fatta' && g.quests.defs[d.id]?.da === 'bubetto') this.st.fiducia = Math.min(100, this.st.fiducia + NEGOZIO.fiduciaMissione);
    });
    g.on('nemicoSconfitto', d => {
      if (d.id === 'ratto' || d.id === 'ratto_fogna') { this.prog.dai('codaRatto'); g.ui.float('+1 coda di ratto 🐀'); }
    });
    // bersagli sulla mappa (tasto E)
    (g.bersagli ??= []).push(() => this._bersaglio());
    // pilot di prova (?pilot): voce «Armi e negozio»
    g.pilot?.sezione?.('⚒️ Armi, negozio del Bubetto e abilità', () => this._pilot());
    // aggancio agli interni (lavoro A), appena ci sono
    this._agganciaInterni();
    g.on('entrato', () => this._agganciaInterni());
  }

  _agganciaInterni() {
    const I = this.game.interni;
    if (this._agganciato || !I?.aggancia) return;
    this._agganciato = true;
    I.aggancia('magazzino:scaffali', ctx => this.apri(ctx?.reparto));
    I.aggancia('magazzino:usato', () => this.apri('usato'));
    I.aggancia('magazzino:lavagna', () => this.lavagna());
    I.aggancia('officina:mola', () => this.affila());
  }

  // ---------- Pilot di prova ----------
  _pilot() {
    const g = this.game, s = this.s, ok = m => { g.ui.toast('🧪 ' + m, 'good'); return null; };
    const vai = (x, z) => { g.vehicles?.leave?.(); g.player.group.position.set(x, 0, z); };
    const lavagna = ['bubetto_nutrie', ...Object.keys(LAVAGNA)];
    const prossima = () => {
      const q = g.quests;
      const att = lavagna.find(id => q.stato(id) === 'attiva' || q.stato(id) === 'pronta');
      if (att) { q.completa(att); return `Completata: ${q.defs[att].titolo}`; }
      const nuova = lavagna.find(id => !q.stato(id));
      if (!nuova) return 'Lavagna finita!';
      q.accetta(nuova); return `Accettata: ${q.defs[nuova].titolo}`;
    };
    return [
      { label: '📖 Cosa provare (guida)', fn: () => PILOT_GUIDA.map(t => ({ who: 'bubetto', name: '🧪 Guida armi e negozio', text: t })) },
      { label: '🎒 Kit: livello 12, 2000€, tutto in vendita, benzina, trappole, grappa, il cane', fn: () => {
        while (s.level < 12) g.prog.addXp(g.prog.xpNext() - s.xp);
        s.money += 2000; this.sbloccaTutto(); s.flags.cane = true;
        for (const [id, n] of [['benzina', 3], ['trappola', 3], ['grappa', 2], ['panino', 2], ['pomata', 1], ['uova', 3]]) g.prog.dai(id, n);
        return ok('Livello 12, 2000€, magazzino completo, oggetti per lo scontro e il cane. Spendi i punti abilità col menu J (prova Lottatore).');
      } },
      { label: '🏪 Vai al magazzino del Bubetto', fn: () => { vai(45, 50.8); return ok('Davanti al magazzino: E sulla porta, poi bancone, scaffali, usato e lavagna.'); } },
      { label: '🔧 Vai in officina da Zeno (affilatura)', fn: () => { vai(85, 68.5); return ok('Davanti all\'officina: dentro c\'è la mola, oppure parla con Zeno.'); } },
      { label: '🕊️ Vai al silos (piccioni)', fn: () => { vai(121, 69); s.minutes = Math.max(s.minutes, 9 * 60); return ok('Silos: i piccioni girano di giorno tra la piazza e il silos.'); } },
      { label: '⚔️ Scontro di prova (2 nutrie + cinghiale)', fn: () => { setTimeout(() => g.combat.start({ enemies: ['nutria', 'nutria', 'cinghiale'], place: 'campo' }), 50); return null; } },
      { label: '📋 Lavagna: accetta o completa la prossima commissione', fn: () => ok(prossima()) },
      { label: '🗓️ Salta al lunedì dopo (nuovo usato)', fn: () => { s.day += 8 - ((s.day - 1) % 7 + 1); return ok(`Giorno ${s.day}: l'usato è cambiato.`); } },
      { label: '🎯 Abilità al massimo (Lottatore, Furbizia, Resistenza, Agricoltore)', fn: () => {
        for (const r of ['lottatore', 'furbizia', 'resistenza', 'agricoltore', 'nervi']) s.prog.rami[r] = 4;
        s.maxHealth = g.prog.maxHealth(); return ok('Cinque rami al grado 4: seconda mossa dell\'arma, due azioni nel primo turno, critico, perdono del Gigante...');
      } },
    ];
  }

  // ---------- Stato ----------
  fiducia() { return this.st.fiducia; }
  sconto() { return NEGOZIO.sconto(this.st.fiducia); }
  prezzo(p) { return Math.max(1, Math.round(p * (1 - this.sconto()))); }
  capitolo() {
    if (this.st.tutto) return 4;
    const daGiorni = 1 + Math.floor((this.s.day - 1) / NEGOZIO.giorniCapitolo);
    return Math.max(this.st.capitolo || 1, daGiorni);
  }
  settimana() { return Math.floor((this.s.day - 1) / 7); }
  sbloccaTutto() { this.st.tutto = true; return 'Tutto il magazzino è in vendita.'; }

  // ---------- Dialoghi ----------
  _page(text, choices) { return { who: 'bubetto', name: 'Il Bubetto', text, choices }; }

  async apri(reparto = null) {
    const g = this.game;
    if (g.ui.busy()) return;
    await g.ui.dialog([reparto ? this._reparto(reparto) : this._home()]);
  }

  async lavagna() {
    if (this.game.ui.busy()) return;
    await this.game.ui.dialog([this._lavagnaPage()]);
  }
  _lavagnaPage() {
    const g = this.game;
    const offerte = g.quests._scelte('bubetto');
    const attive = g.quests.attive().filter(q => q.def.da === 'bubetto');
    let text = 'LAVAGNA DEL BUBETTO — «Cercasi volenteroso. Pagamento sicuro (quasi).»';
    if (attive.length) text += '\nIn corso: ' + attive.map(q => `${q.def.titolo} (${q.progresso}/${q.n})`).join(', ');
    else if (!offerte.length) text += '\nPer ora niente. Ripassa dopo aver finito le altre commissioni.';
    return this._page(text, [...offerte, { label: 'Ciao', fn: null }]);
  }

  _home(msg) {
    const sc = Math.round(this.sconto() * 100);
    const text = msg || pick(FRASI.benvenuto) + (sc ? ' ' + fill(FRASI.sconto, { sconto: sc }) : '');
    const nuoviManuali = MANUALI.filter(m => this._manualeDisponibile(m) && !this.st.manuali.includes(m.id)).length;
    return this._page(text, [
      { label: '⚒️ Armi', fn: () => [this._reparto('armi')] },
      { label: '👕 Vestiti', fn: () => [this._reparto('vestiti')] },
      { label: `📘 Manuali (abilità)${nuoviManuali ? ` · ${nuoviManuali} nuovo` : ''}`, fn: () => [this._reparto('manuali')] },
      { label: '🪤 Oggetti e attrezzatura', fn: () => [this._reparto('oggetti')] },
      { label: '🏷️ Angolo dell\'usato', fn: () => [this._reparto('usato')] },
      { label: '💰 Vendi roba', fn: () => [this._reparto('vendi')] },
      { label: '📋 Lavagna delle commissioni', fn: () => [this._lavagnaPage()] },
      { label: 'Esci', fn: null },
    ]);
  }

  _reparto(rep, msg) {
    const f = {
      armi: () => this._armi(), vestiti: () => this._vestiti(), manuali: () => this._manuali(),
      oggetti: () => this._oggetti(), usato: () => this._usato(), vendi: () => this._vendi(),
    }[rep];
    if (!f) return this._home();
    const choices = f();
    choices.push({ label: 'Indietro', fn: () => [this._home()] });
    return this._page(`${msg || FRASI.reparti[rep]}  (Hai ${Math.floor(this.s.money)}€)`, choices);
  }

  // compra: controlla soldi e livello, poi esegue
  _compra(rep, { prezzo, liv, dopo }, fx, extra = '') {
    const s = this.s;
    if (liv && s.level < liv) return [this._reparto(rep, fill(FRASI.livelloBasso, { liv }))];
    if (dopo) return [this._reparto(rep, FRASI.nonAncora)];
    if (s.money < prezzo) { this.game.audio.sfx('bad'); return [this._reparto(rep, pick(FRASI.pocoSoldi))]; }
    s.money -= prezzo;
    const r = fx();
    this.game.audio.sfx('coin');
    this.game.emit('comprato', { tipo: rep, id: r?.id, prezzo });
    return [this._reparto(rep, `${pick(FRASI.comprato)}${r?.msg ? ' ' + r.msg : ''}${extra}`)];
  }

  _armi() {
    const p = this.prog, maxLiv = NEGOZIO.armiPerCapitolo[Math.min(3, this.capitolo())];
    return Object.entries(ARMI).filter(([id, a]) => !a.leggendario && a.prezzo > 0).map(([id, a]) => {
      const ce = p.haArma(id), presto = a.liv > maxLiv, pr = this.prezzo(a.prezzo);
      const label = ce ? `${a.nome} ✔ ce l'hai` : presto ? `${a.nome} · arriva più avanti nell'annata`
        : `${a.nome} · attacco +${a.atk} · ${pr}€${this.s.level < a.liv ? ` (Lv ${a.liv})` : ''}`;
      return { label, disabled: ce || presto, fn: () => this._compra('armi', { prezzo: pr, liv: a.liv, dopo: presto }, () => {
        p.daiArma(id);
        const meglio = a.atk > p.arma().atk;
        if (meglio) p.impugna(id);
        return { id, msg: meglio ? `Garonio impugna subito: ${a.nome}.` : 'La trovi nel menu J, alla voce Arma.' };
      }, a.benzina && !this.prog.ha('benzina') ? ' Ricordati la benzina, sennò fa solo scena.' : '') };
    });
  }

  _vestiti() {
    const p = this.prog;
    return VESTITI_IN_VENDITA.map(id => {
      const v = VESTITI[id], ce = p.haVestito(id), pr = this.prezzo(v.prezzo);
      return { label: ce ? `${v.nome} ✔` : `${v.nome} · ${v.desc} · ${pr}€${v.liv && this.s.level < v.liv ? ` (Lv ${v.liv})` : ''}`, disabled: ce,
        fn: () => this._compra('vestiti', { prezzo: pr, liv: v.liv }, () => {
          const libero = !p.indossato(v.slot);
          p.daiVestito(id, libero);
          return { id, msg: libero ? `Garonio lo indossa subito.` : 'Per indossarlo: menu J, Arma ed equipaggiamento.' };
        }) };
    });
  }

  _manualeDisponibile(m) { return this.capitolo() >= m.capitolo; }
  _manuali() {
    return MANUALI.map(m => {
      const ce = this.st.manuali.includes(m.id), ok = this._manualeDisponibile(m), pr = this.prezzo(m.prezzo);
      return { label: ce ? `${m.nome} ✔ letto` : ok ? `${m.nome} · +1 punto abilità · ${pr}€` : `${m.nome} · esce più avanti`,
        disabled: ce || !ok,
        fn: () => this._compra('manuali', { prezzo: pr }, () => {
          this.st.manuali.push(m.id); this.s.prog.punti++;
          this.game.audio.sfx('level');
          return { id: m.id, msg: `«${m.frase}» ${FRASI.manuale}` };
        }) };
    });
  }

  _oggetti() {
    const out = OGGETTI_IN_VENDITA.map(({ id, prezzo, nota }) => {
      const o = OGGETTI[id], pr = this.prezzo(prezzo);
      return { label: `${o.icona} ${o.nome} · ${pr}€${nota ? ` (${nota})` : ''} · ne hai ${this.s.inv[id] || 0}`,
        fn: () => this._compra('oggetti', { prezzo: pr }, () => { this.prog.dai(id); return { id }; }) };
    });
    for (const a of ATTREZZATURA) {
      const ce = !!this.s.upgrades?.[a.id], pr = this.prezzo(a.prezzo);
      out.push({ label: ce ? `${a.nome} ✔ montata` : `${a.nome} · ${a.desc} · ${pr}€`, disabled: ce,
        fn: () => this._compra('oggetti', { prezzo: pr }, () => { this.s.upgrades[a.id] = true; return { id: a.id, msg: 'La monto io stasera. Tu non guardare.' }; }) });
    }
    return out;
  }

  // l'angolo dell'usato: ogni lunedì cambia
  usatoDellaSettimana() {
    const w = this.settimana();
    if (this.st.usatoSettimana !== w) { this.st.usatoSettimana = w; this.st.usatoComprati = []; }
    const r = PIX.rng(w * 7919 + 13);
    const pool = [...USATO].sort(() => r() - 0.5);
    return pool.slice(0, NEGOZIO.usatoQuanti(this.st.fiducia));
  }
  _usato() {
    const p = this.prog;
    return this.usatoDellaSettimana().map((u, i) => {
      const key = `${u.tipo}:${u.id}`;
      const venduto = this.st.usatoComprati.includes(key);
      const nome = u.tipo === 'arma' ? ARMI[u.id].nome : u.tipo === 'vestito' ? VESTITI[u.id].nome : `${OGGETTI[u.id].icona} ${OGGETTI[u.id].nome} ×${u.n || 1}`;
      const ce = (u.tipo === 'arma' && p.haArma(u.id)) || (u.tipo === 'vestito' && p.haVestito(u.id));
      const pr = this.prezzo(u.prezzo);
      const liv = u.tipo === 'arma' ? ARMI[u.id].liv : 0;
      return { label: venduto ? `${nome} · venduto` : ce ? `${nome} ✔ ce l'hai` : `${nome} · ${pr}€${liv > this.s.level ? ` (Lv ${liv})` : ''}`,
        disabled: venduto || ce,
        fn: () => this._compra('usato', { prezzo: pr, liv }, () => {
          this.st.usatoComprati.push(key);
          if (u.tipo === 'arma') p.daiArma(u.id);
          else if (u.tipo === 'vestito') p.daiVestito(u.id, !p.indossato(VESTITI[u.id].slot));
          else p.dai(u.id, u.n || 1);
          return { id: u.id, msg: `«${u.nota}»` };
        }) };
    });
  }

  _vendi() {
    const p = this.prog, s = this.s, out = [];
    for (const [id, n] of Object.entries(s.inv)) {
      const o = OGGETTI[id];
      if (!o || n <= 0 || o.missione) continue;
      const v = o.vendita ?? (o.prezzo ? Math.max(1, Math.round(o.prezzo * NEGOZIO.rivendita)) : 0);
      if (!v || this._serveAMissione(id)) continue;
      const pr = Math.round(v * (1 + p.bonus('vendite')));
      out.push({ label: `${o.icona} ${o.nome} ×${n} · ${pr}€ l'uno`, fn: () => {
        p.togliOggetto(id); s.money += pr; this.game.audio.sfx('coin');
        this.game.emit('venduto', { tot: pr });
        return [this._reparto('vendi', fill(pick(FRASI.venduto), { prezzo: pr }))];
      } });
    }
    for (const id of s.prog.armi) {
      const a = ARMI[id];
      if (!a || id === 'zappa' || a.leggendario || id === s.prog.arma) continue;
      const pr = Math.round(a.prezzo * NEGOZIO.rivendita);
      out.push({ label: `⚒️ ${a.nome} · ${pr}€`, fn: () => {
        s.prog.armi.splice(s.prog.armi.indexOf(id), 1); delete s.prog.affilatura[id];
        s.money += pr; this.game.audio.sfx('coin');
        return [this._reparto('vendi', fill(pick(FRASI.venduto), { prezzo: pr }))];
      } });
    }
    if (!out.length) out.push({ label: 'Non hai niente che gli interessi', disabled: true, fn: null });
    return out;
  }
  _serveAMissione(id) {
    return this.game.quests.attive().some(q => q.def.obiettivo.consegna?.[id]);
  }

  // ---------- Affilatura da Zeno ----------
  _umoreZeno() {
    const g = this.game;
    return g.officina?.umore?.() || this.s.flags.officina?.umore || 'normale';
  }
  _sceltaAffila() {
    const a = this.prog.arma(), gr = this.s.prog.affilatura[a.id] || 0;
    if (gr >= AFFILATURA.max) return { label: `🔧 ${a.nome}: già affilata al massimo`, disabled: true, fn: null };
    const pr = AFFILATURA.prezzi[gr];
    return { label: `🔧 Affila ${a.nome} (grado ${gr + 1}/${AFFILATURA.max}, attacco +${AFFILATURA.atk}) · ${pr}€`, disabled: this.s.money < pr,
      fn: () => this._affila() };
  }
  scelteOfficina() { return [this._sceltaAffila()]; }
  async affila() {
    const g = this.game;
    if (g.ui.busy()) return;
    await g.ui.dialog([{ who: 'zeno', name: 'Zeno', text: AFFILA.frasi.proposta, choices: [this._sceltaAffila(), { label: 'Lascia stare', fn: null }] }]);
  }
  _affila() {
    const s = this.s, g = this.game, a = this.prog.arma(), gr = s.prog.affilatura[a.id] || 0, F = AFFILA.frasi;
    const say = t => [{ who: 'zeno', name: 'Zeno', text: t }];
    if (gr >= AFFILATURA.max) return say(F.massimo);
    const pr = AFFILATURA.prezzi[gr];
    if (s.money < pr) return say(F.pocoSoldi);
    s.money -= pr;
    g.audio.sfx('coin');
    let fregatura = null;
    if (Math.random() < (AFFILA.rischio[this._umoreZeno()] ?? 0.12)) fregatura = Math.random() < 0.5 ? 'sovrapprezzo' : 'meta';
    if (fregatura === 'meta') {
      g.emit('affilatura', { arma: a.id, grado: gr, fregatura });
      g.ui.toast(`Zeno ha fatto metà lavoro: ${a.nome} è come prima. −${pr}€`, 'bad');
      return say(F.meta);
    }
    s.prog.affilatura[a.id] = gr + 1;
    let testo = pick(F.fatto);
    if (fregatura === 'sovrapprezzo') {
      const extra = Math.min(Math.floor(s.money), Math.round(pr * 0.5));
      s.money -= extra;
      testo = fill(F.sovrapprezzo, { extra }) + ' ' + testo;
    }
    g.emit('affilatura', { arma: a.id, grado: gr + 1, fregatura });
    g.ui.toast(`${a.nome} affilata: grado ${gr + 1}/${AFFILATURA.max} (attacco +${AFFILATURA.atk})`, 'good');
    return say(testo);
  }

  // ---------- Sulla mappa: ferro nei fossi (i piccioni sono i gruppi del lavoro delle bestie, src/spawn.js) ----------
  _attiva(id) { return this.game.quests.stato(id) === 'attiva'; }

  update(dt) {
    const s = this.s; if (!s?.flags?.negozio) return;
    const W = this.game.world;
    // ferro vecchio
    const vuoiFerro = this._attiva('bubetto_ferro');
    if (vuoiFerro && !this.ferri.length) {
      this._ferroTex ??= PIX.toTexture(ferroSprite());
      FERRO_VECCHIO.forEach((f, i) => {
        if (this.st.ferro.includes(i)) return;
        const sp = W.sprite(this._ferroTex, { w: 0.75, h: 0.5 });
        sp.position.set(f.x, 0, f.z); W.scene.add(sp);
        this.ferri.push({ i, sp, ...f });
      });
    } else if (!vuoiFerro && this.ferri.length) { this.ferri.forEach(f => W.scene.remove(f.sp)); this.ferri = []; }
    for (const f of this.ferri) f.sp.position.y = Math.abs(Math.sin(performance.now() / 500 + f.i)) * 0.05;
  }

  _bersaglio() {
    const P = this.game.player.group.position;
    for (const f of this.ferri) if (Math.hypot(P.x - f.x, P.z - f.z) < 1.3) return { label: 'Raccogli il ferro vecchio', fn: () => this._raccogliFerro(f) };
    return null;
  }

  _raccogliFerro(f) {
    this.st.ferro.push(f.i);
    this.game.world.scene.remove(f.sp);
    this.ferri.splice(this.ferri.indexOf(f), 1);
    this.prog.dai('ferro');
    this.game.audio.sfx('coin');
    this.game.ui.float(`+1 ferro vecchio 🔩 (${this.s.inv.ferro}/3)`);
  }
}
