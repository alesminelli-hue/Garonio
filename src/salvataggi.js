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
//   esporta()                   file .json con tutti i salvataggi (da tenere su iCloud/Drive o spostare su un altro telefono)
//   importa(testo)              rimette i salvataggi da quel file (sostituisce quelli che ci sono)
// In partita: new Salvataggi(game).init() aggiunge la scheda 💾 al menu.

import * as APP from './app.js';

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
  static cancella(id) { ls.del(chiave(id)); ls.del(chiave(id) + '-alba'); }
  // «alba»: copia della partita all'inizio della giornata, per rifarla se le missioni vanno male
  static scriviAlba(s) { return ls.set(chiave(Salvataggi.attivo()) + '-alba', JSON.stringify(s)); }
  static leggiAlba() { try { return JSON.parse(ls.get(chiave(Salvataggi.attivo()) + '-alba')); } catch { return null; } }
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

  // ---------- esporta / importa ----------
  // Tutte le chiavi 'garonio-*' (slot, slot in uso, volumi, pannelli): una copia completa.
  static esporta() {
    const dati = {};
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith('garonio-') && k !== K_RICHIESTA) dati[k] = localStorage.getItem(k);
      }
    } catch {}
    return JSON.stringify({ tipo: 'garonio-salvataggi', versione: 1, esportatoIl: new Date().toISOString(), dati }, null, 1);
  }
  static nomeFile() { const i = Salvataggi.info(Salvataggi.attivo()); return `gt-tractor-salvataggi${i ? '-giorno' + i.giorno : ''}-${new Date().toISOString().slice(0, 10)}.json`; }
  // restituisce quanti slot ha rimesso, o lancia un errore con un messaggio da mostrare
  static importa(testo) {
    let f; try { f = JSON.parse(testo); } catch { throw new Error('Questo file non è un salvataggio.'); }
    if (f?.tipo !== 'garonio-salvataggi' || !f.dati || typeof f.dati !== 'object') throw new Error('Questo file non è un salvataggio di GT Tractor.');
    const chiavi = Object.keys(f.dati).filter(k => k.startsWith('garonio-') && typeof f.dati[k] === 'string');
    if (!chiavi.some(k => k.startsWith('garonio-slot-') && k !== K_ATTIVO)) throw new Error('Nel file non ci sono partite.');
    for (const id of [...SLOT, AUTO]) ls.del(chiave(id));
    for (const k of chiavi) if (!ls.set(k, f.dati[k])) throw new Error('Spazio pieno: non riesco a salvare.');
    return chiavi.filter(k => k.startsWith('garonio-slot-') && k !== K_ATTIVO).length;
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
    out.push(...this._copia(m));
    out.push(...this._app(m));
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

  // ---------- copia di sicurezza: esporta / importa un file ----------
  _copia(m) {
    const g = this.game, out = [m._cartello('Copia di sicurezza')];
    out.push(h('p', 'sv-come', 'Esporta un file con tutte le partite: tienilo su iCloud o Google Drive, oppure aprilo su un altro telefono con «Importa».'));
    const riga = h('div', 'sv-azioni');
    riga.appendChild(m._azione('📤 Esporta salvataggi', () => {
      g.save();
      this._esporta().then(msg => { if (msg && m.aperto()) { m.msg = msg; m._render(); } });
      return '📤 Preparo il file...';
    }, { cls: 'small' }));
    riga.appendChild(m._azione(this.conferma === 'importa' ? '⚠️ Sicuro?' : '📥 Importa salvataggi', () => {
      if (this.conferma !== 'importa') { this.conferma = 'importa'; return 'Le partite di questo telefono verranno sostituite da quelle del file: tocca ancora per scegliere il file.'; }
      this.conferma = null;
      this._scegliFile(testo => {
        try {
          const n = Salvataggi.importa(testo);
          g.ui.toast(`📥 ${n} partite importate.`, 'good');
          setTimeout(() => Salvataggi.ricaricaCon(Salvataggi.ultimo() || '1'), 600);
        } catch (e) { m.msg = '❌ ' + e.message; if (m.aperto()) m._render(); }
      });
      return '📥 Scegli il file del salvataggio.';
    }, { cls: 'small' }));
    out.push(riga);
    return out;
  }

  _scegliFile(fn) {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,application/json,text/plain';
    inp.style.display = 'none';
    inp.addEventListener('change', () => {
      const f = inp.files?.[0]; inp.remove();
      if (!f) return;
      const r = new FileReader(); r.onload = () => fn(String(r.result)); r.readAsText(f);
    });
    document.body.appendChild(inp); inp.click();
  }

  // Android (APK): file nella cache dell'app e finestra «Condividi» (Drive, WhatsApp, File...).
  // iPhone e browser: «Condividi» col file se si può (Salva su File → iCloud), altrimenti si scarica.
  async _esporta() {
    const testo = Salvataggi.esporta(), nome = Salvataggi.nomeFile();
    const C = window.Capacitor;
    if (APP.nativa() && C?.nativePromise) {
      try {
        const w = await C.nativePromise('Filesystem', 'writeFile', { path: nome, data: testo, directory: 'CACHE', encoding: 'utf8' });
        await C.nativePromise('Share', 'share', { title: nome, files: [w.uri] });
        return '📤 File pronto.';
      } catch (e) { if (/cancel/i.test(String(e?.message || e))) return ''; }
    }
    const file = new File([testo], nome, { type: 'application/json' });
    try {
      if (navigator.canShare?.({ files: [file] })) { await navigator.share({ files: [file], title: nome }); return '📤 File pronto.'; }
    } catch (e) { if (e?.name === 'AbortError') return ''; }
    try {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(file); a.download = nome; document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 2000);
      return `📤 Scaricato: ${nome}`;
    } catch { return '❌ Non riesco a creare il file su questo telefono.'; }
  }

  // ---------- app sul telefono ----------
  _app(m) {
    if (APP.nativa()) return [];
    const out = [m._cartello('App sul telefono')];
    if (APP.installata()) out.push(h('p', 'mn-vuoto', '📱 Stai giocando con l\'app installata: funziona anche senza internet.'));
    else if (APP.puoInstallare()) out.push(m._azione('📲 Installa il gioco', () => { APP.installa().then(ok => { if (ok) this.game.ui.toast('📲 Installato!', 'good'); }); return ''; }));
    else {
      const sis = APP.sistema();
      out.push(h('p', 'sv-come', sis === 'ios'
        ? '📲 Su iPhone: apri il gioco con Safari, tocca Condividi (il quadrato con la freccia) e poi «Aggiungi alla schermata Home». Si apre a schermo intero e funziona offline.'
        : sis === 'android'
          ? '📲 Su Android: menu ⋮ di Chrome → «Installa app» o «Aggiungi a schermata Home». Oppure scarica l\'APK.'
          : '📲 Dal telefono apri questa pagina e aggiungila alla schermata Home: diventa un\'app a schermo intero che funziona anche offline.'));
    }
    if (!APP.installata() && APP.puoSchermoIntero()) out.push(m._azione('⛶ Schermo intero on/off', () => { APP.schermoIntero(); return ''; }));
    return out;
  }
}
