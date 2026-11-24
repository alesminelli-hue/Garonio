// Completi e album del bottino (GDD capitolo 26.7).
//  - COMPLETI: più pezzi dello stesso completo addosso danno un bonus in più (2 pezzi: metà; tutti: pieno).
//    Si somma a prog.bonus(), così vale ovunque (attacco, difesa, fatica, stress...). Nella scheda Equip
//    compare il completo attivo.
//  - ALBUM: ogni attrezzo, vestito o oggetto col suo disegno HD (src/sprite_loot.js, src/sprite_parco.js) che
//    Garonio trova finisce nell'album, scheda 📒 del menu J. Quelli mancanti sono sagome nere.
//    A 25, 50, 75 e 100% dell'album arriva un premio.
// Dati: src/data/collezione.js.
//
// API (game.collezione):
//   completi()       [{ id, def, n, tot }] completi con almeno un pezzo addosso
//   visto(id)        registra un pezzo nell'album
//   percentuale()
// Eventi: emette  album { id, pct }
// Stato: s.flags.album = { visti: { id: giorno }, premi: [pct] }
import { COMPLETI, ALBUM } from './data/collezione.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';
import { ICONE_LOOT } from './sprite_loot.js';
import './sprite_parco.js';

function el(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  for (const k of kids || []) if (k) e.appendChild(k);
  return e;
}
const nomeDi = id => (ARMI[id] || VESTITI[id] || OGGETTI[id])?.nome || id;
const _img = {};
function immagine(id, sagoma) {
  const k = id + (sagoma ? '#' : '');
  if (_img[k]) return _img[k];
  if (!ICONE_LOOT[id]) return '';
  const c = ICONE_LOOT[id]();
  if (sagoma) { const g = c.getContext('2d'); g.globalCompositeOperation = 'source-in'; g.fillStyle = '#2a1e18'; g.fillRect(0, 0, c.width, c.height); }
  return (_img[k] = c.toDataURL());
}

export class Collezione {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); const st = (f.album ??= {}); st.visti ??= {}; st.premi ??= []; return st; }
  // pezzi dell'album, in ordine: attrezzi, vestiti, oggetti
  get pezzi() {
    return (this._pezzi ??= [ARMI, VESTITI, OGGETTI].flatMap(T => Object.keys(T).filter(id => ICONE_LOOT[id])));
  }

  init() {
    const g = this.game, p = g.prog;
    // bonus dei completi dentro prog.bonus
    const base = p.bonus.bind(p);
    p.bonus = key => base(key) + this._bonus(key);
    // tutto quello che arriva in tasca passa dall'album
    for (const k of ['dai', 'daiArma', 'daiVestito']) {
      const f = p[k].bind(p);
      p[k] = (id, ...a) => { const r = f(id, ...a); this.visto(id); return r; };
    }
    // quello che Garonio ha già
    const sp = this.s.prog;
    for (const id of [...sp.armi, ...sp.vestiti, ...Object.keys(this.s.inv || {}).filter(i => this.s.inv[i] > 0)]) this.visto(id, true);
    g.menu?.aggiungiScheda?.('album', { icona: '📒', nome: 'Album', render: m => this._scheda(m) });
    g.pilot?.sezione?.('📒 Album e completi', () => [
      { label: `📒 Album ${this.percentuale()}%: segna tutto come trovato`, fn: () => { for (const id of this.pezzi) this.visto(id); return null; } },
      { label: '🌾 Dai e indossa il Completo del Mondino', fn: () => { for (const v of COMPLETI.mondino.pezzi) { p.daiVestito(v); p.indossa(v); } return null; } },
    ]);
  }

  // ---------- Completi ----------
  completi() {
    const eq = Object.values(this.s.prog.equip || {});
    return Object.entries(COMPLETI).map(([id, def]) => ({ id, def, n: def.pezzi.filter(v => eq.includes(v)).length, tot: def.pezzi.length })).filter(c => c.n > 0);
  }
  _bonus(key) {
    let t = 0;
    for (const c of this.completi()) {
      const v = c.def.bonus[key]; if (!v) continue;
      if (c.n >= c.tot) t += v; else if (c.n >= 2) t += v / 2;
    }
    return t;
  }

  // ---------- Album ----------
  visto(id, zitto = false) {
    if (!ICONE_LOOT[id]) return;
    const st = this.st;
    if (st.visti[id] != null) return;
    st.visti[id] = this.s.day;
    const pct = this.percentuale();
    this.game.emit('album', { id, pct });
    if (!zitto) this._premi();
  }
  percentuale() {
    const n = this.pezzi.filter(id => this.st.visti[id] != null).length;
    return Math.floor(n / this.pezzi.length * 100);
  }
  _premi() {
    const g = this.game, st = this.st, pct = this.percentuale();
    for (const P of ALBUM.premi) {
      if (pct < P.pct || st.premi.includes(P.pct)) continue;
      st.premi.push(P.pct);
      this.s.money += P.soldi || 0;
      // senza passare dall'album: è un premio, non un ritrovamento
      for (const [o, n] of Object.entries(P.oggetti || {})) this.s.inv[o] = (this.s.inv[o] || 0) + n;
      setTimeout(() => { g.ui.toast(P.testo, 'good'); g.audio.sfx('level'); }, 1800);
    }
  }

  _scheda(menu) {
    const st = this.st, out = [];
    // completi
    out.push(el('div', 'mn-cartello', 'Completi'));
    const lista = el('div', 'mn-trofei');
    const eq = Object.values(this.s.prog.equip || {});
    for (const [id, def] of Object.entries(COMPLETI)) {
      const n = def.pezzi.filter(v => eq.includes(v)).length, pieno = n >= def.pezzi.length;
      const pezzi = el('div', 'mn-completo', null, def.pezzi.map(v => {
        const ha = this.game.prog.haVestito(v), su = eq.includes(v);
        const im = Object.assign(document.createElement('img'), { src: immagine(v, !ha && st.visti[v] == null), alt: '', title: st.visti[v] != null || ha ? VESTITI[v].nome : '???' });
        im.className = 'mn-pz' + (su ? ' su' : '');
        return im;
      }));
      lista.appendChild(el('div', 'mn-trofeo' + (pieno ? ' ok' : ''), null, [
        el('span', 'mn-icon', def.icona),
        el('div', 'mn-nota-c', null, [el('b', null, `${def.nome} ${n}/${def.pezzi.length}`), el('small', 'mn-desc2', `${pieno ? '✔ ' : n >= 2 ? '½ ' : ''}${def.desc}`), pezzi]),
      ]));
    }
    out.push(lista);
    // album
    const pct = this.percentuale(), n = this.pezzi.filter(id => st.visti[id] != null).length;
    out.push(el('div', 'mn-cartello', `📒 Album del bottino ${n}/${this.pezzi.length} · ${pct}%`));
    const prossimo = ALBUM.premi.find(P => !st.premi.includes(P.pct));
    if (prossimo) out.push(el('small', 'mn-desc2 mn-premio', `🎁 Al ${prossimo.pct}%: ${prossimo.soldi}€ e una sorpresa`));
    const album = el('div', 'mn-album mn-album-loot');
    for (const id of this.pezzi) {
      const ok = st.visti[id] != null;
      const im = Object.assign(document.createElement('img'), { className: 'mn-figu-img', src: immagine(id, !ok), alt: '' });
      album.appendChild(el('div', 'mn-figu' + (ok ? ' ok' : ''), null, [im, el('small', null, ok ? nomeDi(id) : '???')]));
    }
    out.push(album);
    this._stile();
    return out;
  }

  _stile() {
    if (document.getElementById('stile-collezione')) return;
    const css = el('style', null, `
.mn-album.mn-album-loot { grid-template-columns: repeat(auto-fill, minmax(76px, 1fr)); }
.mn-album-loot .mn-figu-img { width: 36px; height: 36px; }
.mn-album-loot .mn-figu:not(.ok) .mn-figu-img { opacity: .55; }
.mn-completo { display: flex; gap: 4px; margin-top: 3px; }
.mn-completo .mn-pz { width: 26px; height: 26px; image-rendering: pixelated; border-radius: 4px; background: rgba(90,58,26,.12); padding: 1px; }
.mn-completo .mn-pz.su { background: #9ec27a; box-shadow: 0 0 0 2px #5a8a3a; }
`);
    css.id = 'stile-collezione';
    document.head.appendChild(css);
  }
}
