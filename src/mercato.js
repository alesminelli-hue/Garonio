// Mercato del giovedì in piazza (GDD 22): bancarelle davanti al municipio, a sud della provinciale.
// Ogni giovedì dalle 7 alle 13 si vendono uova, pomodori, patate, mais e salami a prezzi che
// cambiano ogni settimana (la TV di casa li anticipa). Ogni banco ha il suo venditore buffo,
// si può trattare (una volta per banco) e più vendi allo stesso banco più il prezzo cala.
// Nando delle pentole vende cianfrusaglie e gratta e vinci. Testi e numeri: MERCATO in src/data/mercato.js.
//
// API (game.mercato):
//   aperto()                 true se adesso il mercato è aperto
//   giornoDiMercato(day)     true se quel giorno è giovedì
//   prezzo(prodotto, day)    prezzo di partenza della settimana di quel giorno
//   prossimo()               { day, prezzi: { uova, ... }, notizia } del prossimo mercato
//   apri(id)                 async: dialogo con il banco (lo fa già il tasto E)
// Eventi mandati: mercato { banco, prodotto, n, tot } · venduto { tot, mercato: true }
// Stato: s.flags.mercato = { giorno, venduti: { banco: n }, trattativa: { banco: moltiplicatore } }
import * as PIX from './pixel.js';
import * as SM from './sprite_mercato.js';
import { OGGETTI } from './data/armi.js';
import { MERCATO as M, giornoSettimana, nomeGiorno } from './data/mercato.js';
import { pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hash = s => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);

export class Mercato {
  constructor(game) {
    this.game = game;
    this.t = 0;
    this.visibile = null;
    this.banchi = [];
    game.moduli.push(this);
    // il salame entra nello zaino come un consumabile qualsiasi
    OGGETTI.salame ??= M.salame;
  }
  get s() { return this.game.s; }
  get f() { return this.s.flags.mercato; }

  init() {
    const g = this.game, W = g.world;
    this.s.flags.mercato ??= {};
    this._azzera();
    this._piazzola();
    for (const b of M.banchi) {
      const key = 'merc_' + b.id;
      PIX.CHARACTERS[key] ??= b.aspetto;   // sprite e ritratto nei dialoghi
      const tex = b.carretto ? SM.carretto() : SM.bancarella(b.tenda, b.merce, b.nome);
      const banco = W.sprite(tex, { w: tex.width / PIX.PX, h: tex.height / PIX.PX });
      banco.position.set(b.x, 0, b.z); W.scene.add(banco);
      const a = W.actor(PIX.characterFrames(key), { w: b.aspetto.w / 16, h: b.aspetto.h / 16, shadow: 0.35 });
      a.group.position.set(b.x + (b.carretto ? 1.9 : 0), 0, b.z - (b.carretto ? -0.1 : 0.3));
      const hw = tex.width / PIX.PX / 2;
      const solido = { x0: b.x - hw + 0.1, z0: b.z - 0.9, x1: b.x + hw - 0.1, z1: b.z + 0.15 };
      this.banchi.push({ def: b, key, banco, a, solido, t: Math.random() * 3 });
    }
    // cartello sempre visibile all'angolo della piazzola
    const c = PIX.signpost('MERCATO');
    const cs = W.sprite(c, { w: c.width / PIX.PX, h: c.height / PIX.PX });
    cs.position.set(M.cartello.x, 0, M.cartello.z); W.scene.add(cs);
    W.solids.push({ x0: M.cartello.x - 0.1, z0: M.cartello.z - 0.1, x1: M.cartello.x + 0.1, z1: M.cartello.z + 0.1 });

    g.bersagli.push(() => this._bersaglio());
    g.on('nuovoGiorno', ({ day }) => this._nuovoGiorno(day));
    g.on('maiale', e => { if (e.evento === 'venduto') this._salami(); });
    // la TV di casa anticipa i prezzi del prossimo giovedì
    g.interni?.aggancia?.('casa:tv', async ctx => { await ctx.predefinito(); await g.ui.dialog([{ name: 'TV · Mercato del giovedì', text: this._testoTv() }]); });
    g.pilot?.sezione?.('Mercato e gare', () => this._pilot());
    this._mostra(this._visibile());
  }

  // ---------- Calendario ----------
  giornoDiMercato(day = this.s.day) { return giornoSettimana(day) === M.giorno; }
  _ora() { return (this.s.minutes / H); }
  aperto() { const h = this._ora(); return this.giornoDiMercato() && h >= M.ore[0] && h < M.ore[1]; }
  _visibile() { const h = this._ora(); return this.giornoDiMercato() && h >= M.ore[0] - 1 && h < M.ore[1] + 1; }

  _azzera() {
    const f = this.f;
    if (f.giorno !== this.s.day) { f.giorno = this.s.day; f.venduti = {}; f.trattativa = {}; }
  }

  // ---------- Prezzi ----------
  _settimana(day) { return Math.floor((day - 1) / 7); }
  _notizia(day) { const r = PIX.rng(this._settimana(day) * 17 + 3); return M.notizie[Math.floor(r() * M.notizie.length)]; }
  prezzo(id, day = this.s.day) {
    const p = M.prodotti[id]; if (!p) return 0;
    const r = PIX.rng(this._settimana(day) * 131 + hash(id));
    let k = M.oscillazione[0] + r() * (M.oscillazione[1] - M.oscillazione[0]);
    const n = this._notizia(day);
    if (n.su === id) k = Math.max(k, 1.6);
    if (n.giu === id) k = Math.min(k, 0.75);
    return Math.max(1, Math.round(p.base * k));
  }
  prossimo() {
    let day = this.s.day;
    if (this.giornoDiMercato(day) && this._ora() >= M.ore[1]) day++;
    while (!this.giornoDiMercato(day)) day++;
    const prezzi = {}; for (const id of Object.keys(M.prodotti)) prezzi[id] = this.prezzo(id, day);
    return { day, prezzi, notizia: this._notizia(day).testo };
  }
  _testoTv() {
    const p = this.prossimo(), d = p.day - this.s.day;
    const quando = d === 0 ? 'oggi' : d === 1 ? 'domani' : `giorno ${p.day}, tra ${d} giorni`;
    const lista = Object.entries(p.prezzi).map(([id, v]) => `${M.prodotti[id].icona} ${v}€`).join(' · ');
    return fill(M.testi.tv, { quando, lista, notizia: p.notizia });
  }
  // prezzo del prossimo pezzo a un banco: settimana × trattativa × saturazione × bonus vendite
  _prezzoOra(banco, id) {
    const f = this.f, sold = f.venduti[banco] || 0;
    const sat = Math.max(M.saturazioneMin, 1 - sold * M.saturazione);
    return this.prezzo(id) * (f.trattativa[banco] ?? 1) * sat * (1 + this.game.prog.bonus('vendite'));
  }

  // ---------- Grafica ----------
  _piazzola() {
    const W = this.game.world, g = W.groundCtx; if (!g) return;
    const A = M.area, PX = PIX.PX;
    const pat = g.createPattern(SM.pave(), 'repeat');
    g.save(); g.fillStyle = pat;
    g.fillRect(A.x0 * PX, A.z0 * PX, (A.x1 - A.x0) * PX, (A.z1 - A.z0) * PX);
    g.fillStyle = '#6a645a';
    g.fillRect(A.x0 * PX, A.z0 * PX, (A.x1 - A.x0) * PX, 2); g.fillRect(A.x0 * PX, A.z1 * PX - 2, (A.x1 - A.x0) * PX, 2);
    g.fillRect(A.x0 * PX, A.z0 * PX, 2, (A.z1 - A.z0) * PX); g.fillRect(A.x1 * PX - 2, A.z0 * PX, 2, (A.z1 - A.z0) * PX);
    g.restore();
    W.groundTex.needsUpdate = true;
  }

  _mostra(on) {
    if (on === this.visibile) return;
    this.visibile = on;
    const W = this.game.world;
    for (const b of this.banchi) {
      b.banco.visible = on; b.a.group.visible = on;
      const i = W.solids.indexOf(b.solido);
      if (on && i < 0) W.solids.push(b.solido);
      if (!on && i >= 0) W.solids.splice(i, 1);
    }
    W._idxN = -1;
  }

  animate(dt) {
    if (!this.game.s) return;
    this.t += dt;
    this._mostra(this._visibile());
    if (!this.visibile) return;
    // i venditori si sbracciano ogni tanto per richiamare i clienti
    for (const b of this.banchi) {
      b.t -= dt;
      if (b.t < 0) b.t = 2 + Math.random() * 4;
      b.a.setFrame(b.t < 0.6 ? 1 + (Math.floor(this.t * 6) % 2) : 0);
    }
  }

  _bersaglio() {
    if (!this.visibile || this.game.vehicles.driving) return null;
    const P = this.game.player.group.position;
    for (const b of this.banchi) {
      const d = b.def;
      if (Math.abs(P.x - d.x) < (d.carretto ? 2.6 : 1.6) && P.z > d.z && P.z - d.z < 1.5) return { label: `Mercato: ${d.nome}`, fn: () => this.apri(d.id) };
    }
    return null;
  }

  // ---------- Il banco ----------
  async apri(id) {
    const g = this.game, s = this.s, b = M.banchi.find(x => x.id === id), T = M.testi;
    if (!b) return;
    if (!this.aperto()) { await g.ui.dialog([{ who: 'merc_' + id, name: b.nome, text: this._ora() < M.ore[0] ? T.prestoMattina : T.finito }]); return; }
    this._azzera();
    g.emit('entrato', { edificio: 'mercato' });
    const pagina = (text) => {
      const choices = [];
      for (const pid of b.compra) {
        const n = s.inv[pid] || 0, p = M.prodotti[pid];
        const unit = Math.max(1, Math.round(this._prezzoOra(id, pid)));
        choices.push({ label: n ? `${p.icona} Vendi ${n} ${p.nome} (${unit}€ l'uno)` : `${p.icona} ${p.nome}: ${unit}€ l'uno (non ne hai)`, disabled: !n, fn: () => [this._vendi(b, pid, n), pagina(pick(b.saluti))] });
      }
      if (b.compra.length) {
        const fatta = this.f.trattativa[id] != null;
        choices.push({ label: fatta ? '🤝 Hai già trattato con questo banco' : '🤝 Tratta sul prezzo', disabled: fatta, fn: () => [this._tratta(b), pagina('Allora? Vendi o no?')] });
      }
      for (const o of b.vende || []) {
        choices.push({ label: `🛒 ${o.nome} · ${o.prezzo}€ (${o.desc})`, disabled: s.money < o.prezzo, fn: () => [this._compra(b, o), pagina('Altro?')] });
      }
      choices.push({ label: 'Ciao', fn: null });
      return { who: 'merc_' + id, name: b.nome, text, choices };
    };
    const intro = b.compra.length && !b.compra.some(p => s.inv[p] > 0) ? `${pick(b.saluti)}\n(${T.niente})` : pick(b.saluti);
    s.minutes += 5;
    await g.ui.dialog([pagina(intro)]);
  }

  _vendi(b, pid, n) {
    const g = this.game, s = this.s, f = this.f;
    let tot = 0;
    for (let i = 0; i < n; i++) { tot += this._prezzoOra(b.id, pid); f.venduti[b.id] = (f.venduti[b.id] || 0) + 1; }
    tot = Math.round(tot);
    g.prog.togliOggetto(pid, n);
    s.money += tot; s.today.venduto = (s.today.venduto || 0) + tot;
    s.minutes += 5;
    g.audio.sfx('coin');
    g.emit('mercato', { banco: b.id, prodotto: pid, n, tot });
    g.emit('venduto', { tot, mercato: true });
    const testo = fill(M.testi.venduto, { n, nome: M.prodotti[pid].nome, soldi: tot });
    g.ui.toast(testo, 'good');
    return { who: 'merc_' + b.id, name: b.nome, text: `${testo}. ${pick(['Affare fatto!', 'Un piacere!', 'Torna giovedì prossimo!', 'Stretta di mano, e via.'])}` };
  }

  _tratta(b) {
    const g = this.game, s = this.s, T = M.trattativa;
    const parlantina = g.prog.bonus('rispostaATono') + g.prog.bonus('vittoriaAParole') * 0.5;
    const ok = Math.random() < T.riuscita + Math.min(T.bonusParlantina, parlantina);
    this.f.trattativa[b.id] = ok ? 1 + T.su : 1 - T.giu;
    s.minutes += 10;
    if (ok) { g._xp?.(2); g.audio.sfx('level'); } else { s.stress = clamp(s.stress + 3, 0, 100); g.audio.sfx('bad'); }
    return { who: 'merc_' + b.id, name: b.nome, text: `${pick(ok ? b.trattaBene : b.trattaMale)}\n(Prezzi di questo banco ${ok ? '+' + Math.round(T.su * 100) : '−' + Math.round(T.giu * 100)}% per oggi)` };
  }

  _compra(b, o) {
    const g = this.game, s = this.s;
    s.money -= o.prezzo; g.audio.sfx('coin');
    const chi = { who: 'merc_' + b.id, name: b.nome };
    if (o.speciale === 'pentola') {
      g.png?.cambiaAmicizia?.('mamma', 5);
      s.stress = clamp(s.stress - 8, 0, 100);
      return { ...chi, text: `${pick(b.pentola)}\n(Amicizia con la Mamma +5, stress −8)` };
    }
    if (o.speciale === 'gratta') {
      let r = Math.random(), premio = 0;
      for (const [p, v] of b.gratta.vinci) { if ((r -= p) < 0) { premio = v; break; } }
      if (!premio) return { ...chi, text: pick(b.gratta.niente) };
      s.money += premio; g.audio.sfx('level');
      return { ...chi, text: fill(b.gratta.vinto, { soldi: premio }) };
    }
    g.prog.dai(o.id, o.n || 1);
    return { ...chi, text: `${o.nome}: nello zaino. ${pick(['Garanzia a vita! La mia, non la tua.', 'Ottimo acquisto. Il migliore della giornata. L\'unico, anche.', 'Non si accettano resi. Né lamentele.'])}` };
  }

  // ---------- Calendario del paese ----------
  _nuovoGiorno(day) {
    this._azzera();
    if (this.giornoDiMercato(day)) setTimeout(() => this.game.ui.toast(M.testi.apre, 'good'), 2500);
    else if (this.giornoDiMercato(day + 1)) setTimeout(() => this.game.ui.toast(`Oggi è ${nomeGiorno(day)}. ${M.testi.domani}`), 2500);
  }

  // vendendo un maiale, il commerciante lascia qualche salame
  _salami() {
    const [a, b] = M.salamiPerMaiale, n = a + Math.floor(Math.random() * (b - a + 1));
    this.game.prog.dai('salame', n);
    const pl = n === 1 ? { i: 'e', n } : { i: 'i', n };
    setTimeout(() => this.game.ui.toast(fill(M.salameRegalo, pl).replace('nostrani', n === 1 ? 'nostrano' : 'nostrani').replace('nostrane', 'nostrano'), 'good'), 600);
  }

  // ---------- Pilot di prova (?pilot) ----------
  _pilot() {
    const g = this.game, s = this.s;
    const ok = t => [{ name: '🧪 Pilot', text: t }];
    return [
      { label: '🧺 Vai al mercato di giovedì (9:00) con roba da vendere', fn: () => {
        while (!this.giornoDiMercato(s.day)) s.day++;
        s.minutes = 9 * H; this._azzera();
        for (const [id, n] of Object.entries({ uova: 6, pomodoro: 5, patata: 3, mais: 4, salame: 2 })) g.prog.dai(id, n);
        s.money += 30;
        g.vehicles.driving && g.vehicles.dismount(true);
        g.player.group.position.set(31, 0, 63);
        return ok(`Giorno ${s.day} (${nomeGiorno(s.day)}), ore 9. Sei in piazza con uova, pomodori, patate, mais e salami.`);
      } },
      { label: '📺 Prezzi del prossimo mercato', fn: () => ok(this._testoTv()) },
    ];
  }
}
