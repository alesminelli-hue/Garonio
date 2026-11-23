// Salvataggi multipli: 3 slot a mano + 1 automatico a fine giornata.
//
// Ogni slot sta in localStorage con la chiave 'garonio-slot-<id>' (id: '1' | '2' | '3' | 'auto').
// La partita in corso ha uno slot attivo: il salvataggio di ogni ora e quello del letto finiscono lì.
// A ogni risveglio (fine giornata) la partita si copia anche nello slot 'auto', come rete di sicurezza.
// Il vecchio salvataggio unico ('garonio-save-v1') al primo avvio diventa lo slot 1.
//
// API statiche (Salvataggi.*):
//   leggi(id) / scrivi(id, s) / cancella(id) / info(id) => { giorno, livello, soldi, quando } | null
//   attivo() / usa(id)          slot della partita in corso
//   ultimo()                    lo slot salvato più di recente (per «Continua»), o null
//   ce()                        true se c'è almeno un salvataggio
//   ricaricaCon(id)             ricarica la pagina e apre quello slot (usato dal menu in partita)
//   richiesta()                 lo slot chiesto prima della ricarica (una volta sola), o null
//   titolo(box, { carica(id), nuova(id) })   elenco slot sulla schermata del titolo
// In partita: new Salvataggi(game).init() aggiunge la scheda 💾 al menu.

export const SLOT = ['1', '2', '3'];
const AUTO = 'auto';
const VECCHIO = 'garonio-save-v1';
const K_ATTIVO = 'garonio-slot-attivo';
const K_RICHIESTA = 'garonio-carica';
const chiave = id => 'garonio-slot-' + id;
const NOMI = { 1: 'Slot 1', 2: 'Slot 2', 3: 'Slot 3', auto: 'Automatico' };

const ls = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); return true; } catch { return false; } },
  del(k) { try { localStorage.removeItem(k); } catch {} },
};

function quando(t) {
  if (!t) return '';
  const d = new Date(t), oggi = new Date();
  const ora = d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === oggi.toDateString()) return `oggi ${ora}`;
  const ieri = new Date(oggi); ieri.setDate(oggi.getDate() - 1);
  if (d.toDateString() === ieri.toDateString()) return `ieri ${ora}`;
  return `${d.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} ${ora}`;
}

function h(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  for (const k of kids || []) if (k) e.appendChild(k);
  return e;
}

function css() {
  if (document.getElementById('salvataggi-css')) return;
  const l = document.createElement('link');
  l.id = 'salvataggi-css'; l.rel = 'stylesheet'; l.href = new URL('./salvataggi.css', import.meta.url).href;
  document.head.appendChild(l);
}

export class Salvataggi {
  // ---------- archivio ----------
  static migra() {
    const v = ls.get(VECCHIO);
    if (v && !ls.get(chiave('1'))) { ls.set(chiave('1'), v); ls.set(K_ATTIVO, '1'); }
    if (v) ls.del(VECCHIO);
  }
  static leggi(id) { try { return JSON.parse(ls.get(chiave(id))); } catch { return null; } }
  static scrivi(id, s) {
    s.salvatoIl = Date.now();
    if (id === AUTO) s.slotOrigine = Salvataggi.attivo();
    return ls.set(chiave(id), JSON.stringify(s));
  }
  static cancella(id) { ls.del(chiave(id)); }
  static info(id) {
    const s = Salvataggi.leggi(id);
    if (!s) return null;
    return { giorno: s.day || 1, livello: s.level || 1, soldi: Math.floor(s.money || 0), quando: quando(s.salvatoIl), t: s.salvatoIl || 0 };
  }
  static attivo() { const a = ls.get(K_ATTIVO); return SLOT.includes(a) ? a : '1'; }
  static usa(id) { if (SLOT.includes(id)) ls.set(K_ATTIVO, id); }
  static ultimo() {
    let best = null, t = -1;
    for (const id of [...SLOT, AUTO]) { const i = Salvataggi.info(id); if (i && i.t > t) { t = i.t; best = id; } }
    return best;
  }
  static ce() { return !!Salvataggi.ultimo(); }
  static liberi() { return SLOT.filter(id => !Salvataggi.info(id)); }

  // Prepara lo slot da cui caricare: restituisce lo stato salvato (o null) e sistema lo slot attivo.
  static apri(id) {
    const s = Salvataggi.leggi(id);
    if (id === AUTO) Salvataggi.usa(s?.slotOrigine || Salvataggi.attivo());
    else Salvataggi.usa(id);
    if (s) { delete s.slotOrigine; }
    return s;
  }

  static ricaricaCon(id) {
    try { sessionStorage.setItem(K_RICHIESTA, id); } catch {}
    location.reload();
  }
  static richiesta() {
    let id = null;
    try { id = sessionStorage.getItem(K_RICHIESTA); sessionStorage.removeItem(K_RICHIESTA); } catch {}
    return id && (SLOT.includes(id) || id === AUTO || id.startsWith('nuova:')) ? id : null;
  }

  // ---------- schermata del titolo ----------
  // box: il riquadro del titolo. Mostra l'elenco degli slot al posto dei pulsanti.
  static titolo(box, modo, { carica, nuova, indietro }) {
    css();
    box.querySelector('.sv-titolo')?.remove();
    const pannello = h('div', 'sv-titolo');
    pannello.appendChild(h('p', 'sv-tit', modo === 'nuova' ? 'Dove salvo la nuova partita?' : 'Quale partita?'));
    const ids = modo === 'nuova' ? SLOT : [...SLOT, AUTO];
    let conferma = null;
    for (const id of ids) {
      const i = Salvataggi.info(id);
      if (modo === 'carica' && !i) continue;
      const b = h('button', 'sv-slot' + (i ? '' : ' vuoto'), null, Salvataggi._righe(id, i));
      b.addEventListener('click', e => {
        e.stopPropagation();
        if (modo === 'carica') return carica(id);
        if (i && conferma !== id) { conferma = id; b.classList.add('attento'); b.querySelector('.sv-sotto').textContent = '⚠️ Tocca ancora per sovrascrivere'; return; }
        nuova(id);
      });
      pannello.appendChild(b);
    }
    const back = h('button', 'sv-indietro', '← Indietro');
    back.addEventListener('click', e => { e.stopPropagation(); pannello.remove(); indietro?.(); });
    pannello.appendChild(back);
    box.insertBefore(pannello, box.querySelector('#btn-new') || null); // subito sotto il titolo
    return pannello;
  }

  static _righe(id, i) {
    const testa = h('span', 'sv-nome', null, [h('b', null, (id === AUTO ? '🕛 ' : '💾 ') + NOMI[id])]);
    if (!i) return [testa, h('span', 'sv-sotto', 'vuoto')];
    return [testa, h('span', 'sv-sotto', `Giorno ${i.giorno} · Lv ${i.livello} · € ${i.soldi}`), h('small', 'sv-quando', i.quando)];
  }

  // ---------- in partita ----------
  constructor(game) { this.game = game; this.conferma = null; }

  init() {
    css();
    const g = this.game;
    g.menu.aggiungiScheda('salva', { icona: '💾', nome: 'Partite', render: m => this._scheda(m) });
    g.on('nuovoGiorno', () => this.auto());
  }

  // salvataggio della partita in corso nel suo slot
  salva() { return Salvataggi.scrivi(Salvataggi.attivo(), this.game.s); }
  // copia di fine giornata nello slot automatico
  auto() { const s = this.game.s; if (s) Salvataggi.scrivi(AUTO, JSON.parse(JSON.stringify(s))); }

  _scheda(m) {
    const g = this.game, out = [], att = Salvataggi.attivo();
    out.push(m._cartello('Salva la partita'));
    for (const id of SLOT) {
      const i = Salvataggi.info(id), mio = id === att;
      const riga = h('div', 'sv-riga' + (mio ? ' mio' : ''), null, [
        h('div', 'sv-info', null, [...Salvataggi._righe(id, i), mio ? h('span', 'sv-tag', 'in uso') : null]),
      ]);
      const azioni = h('div', 'sv-azioni');
      azioni.appendChild(m._azione(this.conferma === 'salva' + id ? '⚠️ Sicuro?' : '💾 Salva qui', () => {
        if (i && !mio && this.conferma !== 'salva' + id) { this.conferma = 'salva' + id; return `${NOMI[id]} contiene un'altra partita: tocca ancora per sovrascriverla.`; }
        this.conferma = null;
        g.save();                          // aggiorna posizione e salva nello slot attivo
        if (!mio) { Salvataggi.scrivi(id, g.s); Salvataggi.usa(id); }
        g.audio.sfx?.('good');
        return `💾 Salvato in ${NOMI[id]}.`;
      }, { cls: 'small' }));
      if (i && !mio) azioni.appendChild(this._carica(m, id));
      riga.appendChild(azioni);
      out.push(riga);
    }
    const ai = Salvataggi.info(AUTO);
    out.push(m._cartello('Salvataggio automatico'));
    out.push(h('div', 'sv-riga', null, [
      h('div', 'sv-info', null, [...Salvataggi._righe(AUTO, ai), h('small', 'sv-quando', 'si aggiorna ogni mattina al risveglio')]),
      ai ? h('div', 'sv-azioni', null, [this._carica(m, AUTO)]) : null,
    ]));
    out.push(h('p', 'mn-vuoto', 'La partita si salva da sola ogni ora nello slot «in uso».'));
    return out;
  }

  _carica(m, id) {
    return m._azione(this.conferma === 'carica' + id ? '⚠️ Sicuro?' : '📂 Carica', () => {
      if (this.conferma !== 'carica' + id) { this.conferma = 'carica' + id; return 'I progressi dall\'ultimo salvataggio si perdono: tocca ancora per caricare.'; }
      this.conferma = null;
      this.game.save();
      Salvataggi.ricaricaCon(id);
      return '📂 Carico...';
    }, { cls: 'small' });
  }
}
