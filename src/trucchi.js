// Codici trucco (GDD capitolo 28.1). Si scrivono nel campo «🔑 Codici»: nella schermata del titolo (il codice
// vale per la partita nuova che parte subito dopo) o nella scheda 🔑 del menu J. Riscrivere un codice che si
// accende e spegne lo spegne. La scheda 📜 Record segna «partita con trucchi».
//
// API (game.trucchi):  usa(parola) → testo · attivo(id)
// Stato: s.flags.trucchi = { attivi: { id: true }, usati: true }
import { ARMI, OGGETTI } from './data/armi.js';
import { STRUTTURE } from './data/azienda.js';

const H = 60;
// fisso = si accende e resta (es. soldi); interruttore = acceso/spento
export const CODICI = {
  EREDEDELGIGANTE: { id: 'endgame', desc: 'Salta all\'endgame: livello 30, storia finita, 15.000€, missioni dell\'erede pronte', fisso: true },
  GRATTAEVINCI: { id: 'lotteria', desc: 'Biglietto della lotteria vincente: +100.000€', fisso: true },
  PIENODIROBA: { id: 'roba', desc: 'Zaino pieno di cibo, semi, ricambi e mangime', fisso: true },
  TUTTOCOMPRATO: { id: 'azienda', desc: 'Cascina dei Salici comprata, tutte le strutture al massimo', fisso: true },
  FERROBATTUTO: { id: 'mezzi', desc: 'Mezzi indistruttibili: mai rotti, mai forati, pieno sempre fatto' },
  UNPUGNO: { id: 'unpugno', desc: 'Nemici KO con un colpo' },
  MAMMAMIA: { id: 'vita', desc: 'Vita infinita' },
  MAISTANCO: { id: 'stanco', desc: 'Stanchezza sempre a zero' },
  ZENSUBITO: { id: 'zen', desc: 'Stress sempre a zero' },
  CRESCITUTTO: { id: 'crescita', desc: 'Orto e campi crescono subito' },
  NOVIGILESSA: { id: 'multe', desc: 'Niente multe della Vigilessa' },
};
const CHIAVE_TITOLO = 'garonio-codice-titolo';

// schermata del titolo: il campo per il codice (prima di «Nuova partita»)
export function campoTitolo(box) {
  if (!box || box.querySelector('.cod-titolo')) return;
  const wrap = document.createElement('div'); wrap.className = 'cod-titolo';
  const inp = Object.assign(document.createElement('input'), { placeholder: '🔑 Codice (facoltativo)', maxLength: 24, autocomplete: 'off', spellcheck: false });
  const msg = document.createElement('small');
  inp.addEventListener('input', () => {
    const c = inp.value.trim().toUpperCase().replace(/\s+/g, '');
    const ok = CODICI[c];
    msg.textContent = ok ? `✔ ${ok.desc}. Premi «Nuova partita».` : '';
    try { if (ok) sessionStorage.setItem(CHIAVE_TITOLO, c); else sessionStorage.removeItem(CHIAVE_TITOLO); } catch { /* niente */ }
  });
  inp.addEventListener('keydown', e => e.stopPropagation());
  wrap.append(inp, msg);
  const st = document.createElement('style');
  st.textContent = `.cod-titolo { margin: 6px auto 4px; display: flex; flex-direction: column; align-items: center; gap: 3px; }
.cod-titolo input { font: inherit; font-size: 14px; padding: 6px 10px; width: 220px; max-width: 80vw; text-align: center; border-radius: 6px; border: 2px solid #5a3a1a; background: #f4ecd6; color: #3a2414; text-transform: uppercase; }
.cod-titolo small { color: #e8f0c0; min-height: 1em; font-size: 12px; text-shadow: 0 1px 0 #000; }
.mn-codice { display: flex; gap: 6px; margin: 6px 0; } .mn-codice input { flex: 1; font: inherit; padding: 6px 8px; border-radius: 6px; border: 2px solid #5a3a1a; background: #fffaf0; text-transform: uppercase; }`;
  document.head.appendChild(st);
  const nuova = box.querySelector('#btn-new');
  box.insertBefore(wrap, nuova?.nextSibling || null);
}

export class Trucchi {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); const st = (f.trucchi ??= {}); st.attivi ??= {}; return st; }
  attivo(id) { return !!this.st.attivi[id]; }

  init() {
    const g = this.game, p = g.prog;
    // un colpo, un KO
    const hit = g.combat._hitEnemy.bind(g.combat);
    g.combat._hitEnemy = (t, d, crit) => hit(t, this.attivo('unpugno') ? Math.max(d, t.hp) : d, crit);
    // crescita istantanea
    const bonus = p.bonus.bind(p);
    p.bonus = key => bonus(key) + (key === 'crescita' && this.attivo('crescita') ? 200 : 0);
    // niente multe
    if (g.vigilessa?.multa) { const m = g.vigilessa.multa.bind(g.vigilessa); g.vigilessa.multa = (...a) => this.attivo('multe') ? false : m(...a); }
    // mezzi indistruttibili (anche niente schianti che rompono il trattore)
    if (g.vehicles?._breakTractor) { const b = g.vehicles._breakTractor.bind(g.vehicles); g.vehicles._breakTractor = (...a) => this.attivo('mezzi') ? undefined : b(...a); }
    g.moduli.push({ update: () => this._tick() });
    g.menu?.aggiungiScheda?.('codici', { icona: '🔑', nome: 'Codici', render: m => this._scheda(m) });
    // il codice scritto nella schermata del titolo
    let c = null; try { c = sessionStorage.getItem(CHIAVE_TITOLO); sessionStorage.removeItem(CHIAVE_TITOLO); } catch { /* niente */ }
    if (c && CODICI[c]) this._quando(() => g.ui.toast(this.usa(c), 'good'));
  }

  _quando(fn) {
    const g = this.game;
    const prova = () => { if (g.ui.busy?.() || g.locked || g.combat?.active) return setTimeout(prova, 1200); fn(); };
    setTimeout(prova, 1500);
  }

  _tick() {
    const s = this.s, A = this.st.attivi;
    if (A.vita && s.maxHealth) s.health = s.maxHealth;
    if (A.stanco) s.tired = 0;
    if (A.zen) s.stress = 0;
    if (A.mezzi) for (const v of this.game.vehicles?.list || []) { v.st.cond = 100; v.st.flat = false; v.st.fuel = 100; const ga = this.game.attrezzi?.st?.gasolio; if (ga && v.kind === 'trattore') ga[v.id] = 100; }
  }

  usa(parola) {
    const c = String(parola || '').trim().toUpperCase().replace(/\s+/g, '');
    const C = CODICI[c];
    if (!C) return '🔑 Codice sbagliato. Il Gigante ti guarda male.';
    this.st.usati = true;
    if (!C.fisso) {
      this.st.attivi[C.id] = !this.st.attivi[C.id];
      return `🔑 ${C.desc}: ${this.st.attivi[C.id] ? 'ATTIVO' : 'spento'}.`;
    }
    this[`_${C.id}`]?.();
    this.game.save?.();
    return `🔑 ${C.desc}. Fatto!`;
  }

  _endgame() {
    const g = this.game, s = this.s;
    g.boss?._prepara?.(30);
    const B = g.boss?.st; if (B) { for (const id of Object.keys(B.boss || {})) B.boss[id].vinto = true; (B.boss.mountain ??= {}).vinto = true; B.endgame = true; }
    g.boss?._segni?.();
    s.money += 15000;
    if (g.azienda && !g.azienda.st.erede) { g.azienda.st.erede = true; setTimeout(() => g.azienda._annuncio(), 600); }
    g.audio.sfx('level');
  }
  _lotteria() { this.s.money += 100000; this.game.audio.sfx('coin'); }
  _roba() {
    const g = this.game;
    for (const [o, n] of [['panino', 10], ['caffe', 10], ['tortaMele', 5], ['zabaione', 5], ['rottame', 10], ['mangimeGold', 6],
      ['semiZucchina', 10], ['semiInsalata', 10], ['semiZucca', 10], ['semiPeperone', 10], ['semiFragola', 10]]) if (OGGETTI[o]) g.prog.dai(o, n);
  }
  _azienda() {
    const A = this.game.azienda; if (!A) return;
    A.st.erede = true;
    if (!A.comprata()) A._compra(true);
    for (const [id, S] of Object.entries(STRUTTURE)) A.st.lv[id] = S.livelli.length;
    this.s.maxHealth = this.game.prog.maxHealth();
    A._aggiorna();
  }

  _scheda() {
    const out = [], el = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; };
    out.push(el('div', 'mn-cartello', '🔑 Codici trucco'));
    const riga = el('div', 'mn-codice');
    const inp = Object.assign(el('input'), { placeholder: 'Scrivi il codice e premi Invio', maxLength: 24, autocomplete: 'off', spellcheck: false });
    const msg = el('div', 'mn-desc2', 'Riscrivi un codice acceso per spegnerlo.');
    const vai = () => { msg.textContent = this.usa(inp.value); inp.value = ''; this.game.menu?._render?.(); };
    inp.addEventListener('keydown', e => { e.stopPropagation(); if (e.key === 'Enter') vai(); });
    const btn = el('button', 'mn-btn', 'Usa'); btn.addEventListener('click', vai);
    riga.append(inp, btn);
    out.push(riga, msg);
    const att = Object.entries(CODICI).filter(([, C]) => !C.fisso && this.attivo(C.id));
    out.push(el('div', 'mn-desc2', att.length ? `Attivi: ${att.map(([, C]) => C.desc).join(' · ')}` : 'Nessun trucco attivo.'));
    setTimeout(() => inp.focus(), 50);
    return out;
  }
}
