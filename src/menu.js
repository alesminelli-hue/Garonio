// Menu di Garonio (tasto J o pulsante 📓): una finestra a schede, uguale su PC e telefono.
//   📋 Missioni  · missione del Gigante, secondarie in corso, chi ha un lavoretto, completate
//   🎒 Zaino     · oggetti con quantità ed effetto, si usano da qui
//   🧥 Equip     · arma e vestiti indossati, si cambiano con un tocco
//   ⭐ Abilità   · rami di abilità coi loro gradi, si spendono i punti
//   📊 Scheda    · statistiche di Garonio e amicizie
//   🏆 Trofei    · trofei e collezionabili (aggiunta da src/diario.js); il 📍 sui lavori sceglie dove punta la freccia
//
// API (game.menu):
//   apri(scheda?)                      apre il menu (scheda: 'missioni' | 'zaino' | 'equip' | 'abilita' | 'scheda')
//   chiudi() / aperto()
//   aggiungiScheda(id, { nome, icona, render(menu) => [elementi] })   altri lavori aggiungono schede
//   aggiungiStatistica(fn)             fn(game) => [[etichetta, valore], ...] righe in più nella Scheda
//
// Tastiera: ←/→ (o A/D, 1-5) cambia scheda · ↑/↓ scegli · E/Invio usa · J/Esc chiude.
import { RAMI, GRADI_LIVELLO, LIVELLI } from './data/progressione.js';
import { ARMI, VESTITI, OGGETTI, SLOT, NOMI_SLOT, MOSSE_ARMI, AFFILATURA } from './data/armi.js';
import { PNG } from './data/png.js';
import { portrait } from './pixel.js';

const pallini = (g, max = 4) => '●'.repeat(g) + '○'.repeat(max - g);

function h(tag, cls, text, kids) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text != null) e.textContent = text;
  for (const k of kids || []) if (k) e.appendChild(k);
  return e;
}
const barra = (v, max, cls = '') => {
  const t = h('div', 'mn-track ' + cls); const f = h('div', 'mn-fill');
  f.style.width = `${Math.max(0, Math.min(100, v / (max || 1) * 100)).toFixed(1)}%`; t.appendChild(f); return t;
};

export class Menu {
  constructor(game) {
    this.game = game;
    this.tab = 'missioni';
    this.msg = '';
    this.sel = 0;
    this.extraStat = [];
    this.schede = {
      missioni: { icona: '📋', nome: 'Lavori', render: () => this._missioni() },
      zaino: { icona: '🎒', nome: 'Zaino', render: () => this._zaino() },
      equip: { icona: '🧥', nome: 'Equip', render: () => this._vestiario() },
      abilita: { icona: '⭐', nome: 'Abilità', render: () => this._abilita() },
      scheda: { icona: '📊', nome: 'Scheda', render: () => this._scheda() },
      diario: { icona: '📔', nome: 'Diario', render: () => this._diario() },
      opzioni: { icona: '⚙️', nome: 'Opzioni', render: () => this._opzioni() },
    };
    // ogni avviso che compare a schermo finisce nel diario (salvato con la partita)
    game.ui.onToast = (text, kind) => this._annota(text, kind);
  }

  _annota(text, kind) {
    const s = this.game.s; if (!s || !text || kind === 'small') return;
    const d = (s.flags.diario ??= []);
    const last = d[d.length - 1];
    if (last && last.t === text && last.g === s.day && Math.abs(last.m - s.minutes) < 30) return;
    d.push({ g: s.day, m: Math.floor(s.minutes), t: String(text), k: kind || '' });
    if (d.length > 300) d.splice(0, d.length - 300);
  }
  get s() { return this.game.s; }
  get prog() { return this.game.prog; }

  aggiungiScheda(id, def) { this.schede[id] = { icona: def.icona || '•', nome: def.nome, render: () => def.render(this) }; if (this.el) this._tabs(); }
  aggiungiStatistica(fn) { this.extraStat.push(fn); }
  aperto() { return !!this.el && !this.el.hidden; }

  // ---------- Apertura e chiusura ----------
  apri(tab) {
    const g = this.game;
    if (this.aperto()) { if (tab) this.vai(tab); return; }
    if (g.ui.busy() || g.locked || g.combat?.active || !g.s) return;
    this._build();
    if (tab && this.schede[tab]) this.tab = tab;
    else if (this.s.prog.punti) this.tab = 'abilita';
    this.msg = ''; this.sel = 0;
    this.el.hidden = false;
    g.ui.modal = this;
    g.audio.sfx('blip');
    this._tabs(); this._render();
  }

  chiudi() {
    if (!this.aperto()) return;
    this.el.hidden = true;
    if (this.game.ui.modal === this) this.game.ui.modal = null;
    this.game.audio.sfx('blip');
  }

  vai(tab) { if (!this.schede[tab]) return; this.tab = tab; this.msg = ''; this.sel = 0; this._tabs(); this._render(); this.body.scrollTop = 0; }

  // Compatibilità col vecchio menu a dialoghi (es. l'armadio degli interni: ui.dialog([menu._equip(testo)])):
  // restituisce una pagina di dialogo col testo; appena il dialogo si chiude si apre la scheda Equip.
  _equip(msg) {
    const t = setInterval(() => { if (!this.game.ui.busy()) { clearInterval(t); this.apri('equip'); } }, 60);
    setTimeout(() => clearInterval(t), 30000);
    return { who: 'garonio', name: 'Garonio', text: msg || 'Vediamo cosa mi metto.' };
  }

  _build() {
    if (this.el) return;
    const el = this.el = h('div', null); el.id = 'menu'; el.hidden = true;
    const box = h('div', 'mn-box');
    this.tabsEl = h('div', 'mn-tabs');
    const close = h('button', 'mn-close', '✕'); close.title = 'Chiudi (J o Esc)';
    close.addEventListener('click', e => { e.stopPropagation(); this.chiudi(); });
    this.titolo = h('div', 'mn-title');
    this.head = h('div', 'mn-head', null, [this.titolo, close]);
    this.msgEl = h('div', 'mn-msg');
    this.body = h('div', 'mn-body');
    const hint = h('div', 'mn-hint', '← → schede · ↑ ↓ scegli · E usa · J chiude');
    box.append(this.head, this.tabsEl, this.msgEl, this.body, hint);
    el.appendChild(box);
    el.addEventListener('pointerdown', e => { if (e.target === el) this.chiudi(); });
    for (const t of ['pointerdown', 'click', 'touchstart']) box.addEventListener(t, e => e.stopPropagation(), { passive: true });
    document.body.appendChild(el);
    this.game.pannelli?.aggiungi(box, 'menu', { maniglia: this.head });
  }

  _tabs() {
    if (!this.tabsEl) return;
    this.tabsEl.innerHTML = '';
    const ids = Object.keys(this.schede);
    ids.forEach((id, i) => {
      const d = this.schede[id];
      const b = h('button', 'mn-tab' + (id === this.tab ? ' on' : ''), null, [h('span', 'ic', d.icona), h('span', 'tx', d.nome)]);
      const badge = this._badge(id); if (badge) b.appendChild(h('span', 'mn-badge', String(badge)));
      b.title = `${d.nome} (${i + 1})`;
      b.addEventListener('click', () => { this.game.audio.sfx('blip'); this.vai(id); });
      this.tabsEl.appendChild(b);
    });
  }

  _badge(id) {
    if (id === 'abilita') return this.s.prog.punti || 0;
    if (id === 'diario') return Math.max(0, (this.s.flags.diario?.length || 0) - (this.s.flags.diarioLetti || 0));
    if (id === 'missioni') return this.game.quests.attive().length + (this.s.mission && !this.s.mission.done && !this.s.mission.failed ? 1 : 0);
    return 0;
  }

  _render() {
    this.titolo.innerHTML = '';
    this.titolo.append(this._faccia('garonio', '🧑‍🌾'), h('span', 'mn-insegna', 'GARONIO'),
      h('span', 'chip lv', `Lv ${this.s.level}`), h('span', 'chip soldi', `💶 ${Math.floor(this.s.money)}`));
    this.msgEl.textContent = this.msg; this.msgEl.hidden = !this.msg;
    const top = this.body.scrollTop;
    this.body.innerHTML = '';
    for (const n of this.schede[this.tab].render() || []) if (n) this.body.appendChild(n);
    this.body.scrollTop = top;
    this.acts = [...this.body.querySelectorAll('.mn-act:not(.off)')];
    this.sel = Math.min(this.sel, Math.max(0, this.acts.length - 1));
    this._mark(false);
  }

  _mark(scroll = true) {
    this.acts?.forEach((b, i) => b.classList.toggle('sel', i === this.sel));
    if (scroll && this.acts?.[this.sel]) this.acts[this.sel].scrollIntoView({ block: 'nearest' });
  }

  // un'azione dentro una scheda: esegue fn, mostra il messaggio e ridisegna
  _azione(label, fn, { off = false, cls = '' } = {}) {
    const b = h('button', 'mn-act ' + cls + (off ? ' off' : ''), label);
    b.addEventListener('click', e => {
      e.stopPropagation();
      if (off) { this.game.audio.sfx('bad'); return; }
      const m = fn();
      if (typeof m === 'string') this.msg = m;
      this.acts && (this.sel = Math.max(0, this.acts.indexOf(b)));
      this._tabs(); this._render();
    });
    return b;
  }

  // tastiera (chiamata da main.js quando il menu è aperto)
  key(code) {
    const ids = Object.keys(this.schede), i = ids.indexOf(this.tab);
    if (['KeyJ', 'Escape', 'Backspace', 'KeyX'].includes(code)) { this.chiudi(); return; }
    if (code === 'ArrowLeft' || code === 'KeyA') { this.game.audio.sfx('blip'); this.vai(ids[(i + ids.length - 1) % ids.length]); return; }
    if (code === 'ArrowRight' || code === 'KeyD') { this.game.audio.sfx('blip'); this.vai(ids[(i + 1) % ids.length]); return; }
    if (/^Digit[1-9]$/.test(code)) { const t = ids[+code.slice(5) - 1]; if (t) this.vai(t); return; }
    const n = this.acts?.length || 0;
    if ((code === 'ArrowUp' || code === 'KeyW') && n) { this.sel = (this.sel + n - 1) % n; this._mark(); this.game.audio.sfx('blip'); return; }
    if ((code === 'ArrowDown' || code === 'KeyS') && n) { this.sel = (this.sel + 1) % n; this._mark(); this.game.audio.sfx('blip'); return; }
    if (['KeyE', 'Enter', 'Space'].includes(code) && n) this.acts[this.sel].click();
  }

  // ritratto pixel di un personaggio (o un'icona se non c'è)
  _faccia(who, icona = '👤') {
    try { const src = portrait(who); if (src) { const i = h('img', 'mn-face'); i.src = src; i.alt = ''; return i; } } catch {}
    return h('span', 'mn-face ic', icona);
  }

  _cartello(testo) { return h('div', 'mn-cartello', testo); }

  // riga del volume: − [cursore] + (i pulsanti funzionano anche da tastiera, il cursore col dito)
  _volume(icona, nome, get, set, prova) {
    const pct = () => `${Math.round(get() * 100)}%`;
    const val = h('small', 'mn-vol-val', pct());
    const r = h('input', 'mn-vol-range'); r.type = 'range'; r.min = 0; r.max = 100; r.step = 5; r.value = Math.round(get() * 100);
    r.setAttribute('aria-label', `Volume ${nome}`);
    r.addEventListener('input', () => { set(r.value / 100); val.textContent = pct(); });
    r.addEventListener('change', () => prova?.());
    r.addEventListener('keydown', e => e.preventDefault());   // le frecce restano al menu
    const passo = d => () => { set(Math.round((get() + d) * 20) / 20); prova?.(); return `${icona} ${nome}: ${pct()}`; };
    return h('div', 'mn-vol', null, [h('span', 'mn-vol-nome', `${icona} ${nome}`), this._azione('−', passo(-0.1), { cls: 'mn-vol-btn' }), r, this._azione('+', passo(0.1), { cls: 'mn-vol-btn' }), val]);
  }

  // ---------- 📋 Missioni ----------
  _missioni() {
    const s = this.s, g = this.game, out = [];
    const m = s.mission;
    out.push(this._cartello('Ordini del Gigante'));
    if (m) {
      const dl = `${String(Math.floor(m.deadline / 60)).padStart(2, '0')}:00`;
      out.push(h('div', 'mn-nota' + (m.done ? ' ok' : m.failed ? ' ko' : ''), null, [
        this._faccia('gigante', '👹'),
        h('div', 'mn-nota-c', null, [
          h('b', null, m.text), barra(Math.min(m.progress, m.n), m.n),
          h('div', 'mn-chips', null, [h('span', 'chip', `${Math.min(m.progress, m.n)}/${m.n}`), h('span', 'chip', m.done ? '✅' : m.failed ? '❌' : `⏰ ${dl}`)]),
        ]),
        m.done ? h('span', 'mn-timbro ok', 'FATTA') : m.failed ? h('span', 'mn-timbro ko', 'FALLITA') : g.diario?.bottone(this, 'gigante'),
      ]));
    } else out.push(h('p', 'mn-vuoto', '😴 Oggi niente ordini.'));

    const attive = g.quests.attive();
    out.push(this._cartello(`Lavoretti (${attive.length})`));
    if (!attive.length) out.push(h('p', 'mn-vuoto', 'Cerca chi ha il ❗ sopra la testa.'));
    for (const q of attive) {
      const d = q.def, da = PNG[d.da]?.nome || (d.da === 'gigante' ? 'Il Gigante' : d.da);
      const dest = d.obiettivo.a || d.da;
      const chips = [];
      if (q.stato === 'pronta') chips.push(h('span', 'chip ok', `💰 da ${da}`));
      else if (d.obiettivo.consegna) for (const [o, n] of Object.entries(d.obiettivo.consegna)) chips.push(h('span', 'chip', `${OGGETTI[o]?.icona || '📦'} ${Math.min(n, s.inv[o] || 0)}/${n}`));
      else if (d.obiettivo.parla) chips.push(h('span', 'chip', `💬 ${PNG[d.obiettivo.parla]?.nome || d.obiettivo.parla}`));
      else chips.push(h('span', 'chip', `${q.progresso}/${q.n}`));
      if (d.obiettivo.consegna && dest !== d.da) chips.push(h('span', 'chip', `➜ ${PNG[dest]?.nome || dest}`));
      if (d.giorni) chips.push(h('span', 'chip warn', `⏳ ${Math.max(0, d.giorni - (s.day - (s.quests.attive[q.id]?.giorno ?? s.day)))}g`));
      if (d.truffaldina) chips.push(h('span', 'chip', '🤫'));
      out.push(h('div', 'mn-nota' + (q.stato === 'pronta' ? ' ok' : ''), null, [
        this._faccia(d.da),
        h('div', 'mn-nota-c', null, [h('b', null, d.titolo), q.n > 1 && q.stato !== 'pronta' ? barra(q.progresso, q.n) : null, h('div', 'mn-chips', null, chips)]),
        q.stato === 'pronta' ? h('span', 'mn-timbro ok', 'FATTO') : null,
        g.diario?.bottone(this, 'quest', q.id),
      ]));
    }

    const chi = Object.keys(PNG).filter(p => g.quests.disponibili(p).length);
    if (chi.length) {
      out.push(this._cartello('Chi ti cerca'));
      out.push(h('div', 'mn-facce', null, chi.map(p => h('div', 'mn-chi', null, [this._faccia(p), h('span', 'bang', '❗'), h('small', null, PNG[p].nome.replace(/^(Il|La|Lo) /, ''))]))));
    }
    const fatte = s.quests.fatte.length, fallite = s.quests.fallite.length;
    if (fatte || fallite) out.push(h('p', 'mn-vuoto', `📜 Completate ${fatte}${fallite ? ` · fallite ${fallite}` : ''}`));
    out.push(...(g.diario?.righe(this) || []));   // freccia e dritte (src/diario.js)
    return out;
  }

  // ---------- 🎒 Zaino ----------
  _chipsEffetto(o) {
    const e = o.effetto || {}, c = [];
    if (e.health) c.push(`❤️+${e.health}`);
    if (e.tired) c.push(`💤${e.tired}`);
    if (e.stress) c.push(`⚡${e.stress}`);
    if (e.danno) c.push(`💥${e.danno}`);
    if (e.stordisce) c.push('💫');
    if (e.guarisce) c.push('🩹');
    if (o.vendita) c.push(`💶${o.vendita}`);
    return h('div', 'mn-chips', null, c.map(t => h('span', 'chip', t)));
  }

  _zaino() {
    const s = this.s;
    const items = Object.entries(s.inv).filter(([id, n]) => n > 0 && OGGETTI[id]);
    const out = [this._cartello('Lo zaino')];
    if (!items.length) { out.push(h('p', 'mn-vuoto', '🍬 Solo una caramella del 2014.')); return out; }
    const grid = h('div', 'mn-cassette');
    for (const [id, n] of items) {
      const o = OGGETTI[id], e = o.effetto || {};
      const usabile = !!(e.health || e.tired || e.stress);
      const cell = h('div', 'mn-cassetta', null, [
        h('div', 'mn-icon', o.icona || '📦'), h('span', 'mn-qta', `×${n}`), h('small', 'mn-nome', o.nome), this._chipsEffetto(o),
        usabile ? this._azione('Usa', () => {
          const prima = { v: Math.round(s.health), st: Math.round(s.stress), f: Math.round(s.tired) };
          if (!this.prog.usa(id)) return 'Non si può usare adesso.';
          this.game.audio.sfx('eat');
          const d = [Math.round(s.health) - prima.v && `❤️ ${Math.round(s.health) - prima.v > 0 ? '+' : ''}${Math.round(s.health) - prima.v}`,
            Math.round(s.stress) - prima.st && `⚡ ${Math.round(s.stress) - prima.st}`,
            Math.round(s.tired) - prima.f && `💤 ${Math.round(s.tired) - prima.f}`].filter(Boolean);
          return `${o.icona || ''} ${o.nome}: ${d.join('  ') || 'buono!'}`;
        }, { cls: 'timbro' }) : null]);
      grid.appendChild(cell);
    }
    out.push(grid);
    out.push(this._misuratori(true));
    return out;
  }

  // ---------- 🧥 Equipaggiamento ----------
  _vestiario() {
    const p = this.prog, s = this.s, out = [];
    out.push(this._cartello(`Attrezzi · 🗡️ ${p.atk()}`));
    const armi = h('div', 'mn-cassette');
    for (const id of s.prog.armi) {
      const a = ARMI[id]; if (!a) continue;
      const su = p.arma().id === id, aff = s.prog.affilatura?.[id];
      const b = this._azione('', () => { if (su) return `${a.nome}: già in mano.`; p.impugna(id); return `🪓 ${a.nome}`; }, { cls: 'mn-cassetta scelta' + (su ? ' on' : '') });
      b.append(h('div', 'mn-icon', ICONE_ARMI[id] || '🔧'), h('small', 'mn-nome', a.nome), h('div', 'mn-chips', null, [h('span', 'chip', `🗡️+${a.atk}`), aff ? h('span', 'chip', `✨${aff}`) : null]));
      if (su) b.appendChild(h('span', 'mn-spunta', '✔'));
      armi.appendChild(b);
    }
    out.push(armi);
    out.push(this._cartello(`Vestiti · 🛡️ ${p.def()}`));
    const grid = h('div', 'mn-cassette');
    for (const slot of SLOT) {
      const mie = s.prog.vestiti.filter(x => VESTITI[x]?.slot === slot);
      if (!mie.length) { grid.appendChild(h('div', 'mn-cassetta vuota', null, [h('div', 'mn-icon', ICONE_SLOT[slot]), h('small', 'mn-nome', NOMI_SLOT[slot])])); continue; }
      for (const id of mie) {
        const v = VESTITI[id], su = p.indossato(slot) === id;
        const b = this._azione('', () => { if (su) { p.togli(slot); return `Tolto: ${v.nome}`; } p.indossa(id); return `${ICONE_SLOT[slot]} ${v.nome}`; }, { cls: 'mn-cassetta scelta' + (su ? ' on' : '') });
        b.append(h('div', 'mn-icon', ICONE_SLOT[slot]), h('small', 'mn-nome', v.nome), h('small', 'mn-desc2', v.desc));
        if (su) b.appendChild(h('span', 'mn-spunta', '✔'));
        grid.appendChild(b);
      }
    }
    out.push(grid);
    return out;
  }

  // ---------- ⭐ Abilità ----------
  _abilita() {
    const p = this.prog, s = this.s, out = [];
    out.push(this._cartello(s.prog.punti ? `🌱 ${s.prog.punti} da piantare` : 'Abilità'));
    for (const [id, r] of Object.entries(RAMI)) {
      const gr = p.grado(id), next = r.gradi[gr];
      const semi = h('div', 'mn-semi', null, r.gradi.map((x, i) => {
        const e = h('span', i < gr ? 'on' : s.level < GRADI_LIVELLO[i] ? 'lock' : '', i < gr ? '🌳' : s.level < GRADI_LIVELLO[i] ? '🔒' : '🌱');
        e.title = x.desc + (i >= gr && s.level < GRADI_LIVELLO[i] ? ` (Lv ${GRADI_LIVELLO[i]})` : ''); return e;
      }));
      const riga = h('div', 'mn-ramo', null, [
        h('div', 'mn-icon', ICONE_RAMI[id] || '⭐'),
        h('div', 'mn-nota-c', null, [h('b', null, r.nome), semi, next ? h('small', 'mn-desc2', `➜ ${next.desc}${s.level < GRADI_LIVELLO[gr] ? ` · Lv ${GRADI_LIVELLO[gr]}` : ''}`) : h('small', 'mn-desc2', '🏆 completo')]),
        gr < 4 ? this._azione('+', () => { p.alza(id); this.game.audio.sfx('level'); return `${ICONE_RAMI[id] || '⭐'} ${r.nome} ${gr + 1}: ${next.desc}`; }, { off: !p.puoiAlzare(id), cls: 'piu' }) : null,
      ]);
      out.push(riga);
    }
    return out;
  }

  // ---------- 📊 Scheda ----------
  _misuratori(corto = false) {
    const s = this.s;
    const r = (ic, v, max, cls, t) => h('div', 'mn-mis', null, [h('span', 'ic', ic), barra(v, max, cls), h('b', null, t)]);
    return h('div', 'mn-misuratori' + (corto ? ' corto' : ''), null, [
      r('❤️', s.health, s.maxHealth, 'health', `${Math.round(s.health)}`),
      r('⚡', s.stress, 100, 'stress', `${Math.round(s.stress)}`),
      r('💤', s.tired, 100, 'tired', `${Math.round(s.tired)}`),
    ]);
  }

  _scheda() {
    const s = this.s, p = this.prog, g = this.game, out = [];
    const xpNext = s.level >= LIVELLI.max ? 0 : p.xpNext();
    out.push(h('div', 'mn-tessera', null, [
      this._faccia('garonio', '🧑‍🌾'),
      h('div', 'mn-nota-c', null, [h('b', null, `«${p.titolo()}»`), h('small', null, `Livello ${s.level} · Giorno ${s.day}`),
        xpNext ? barra(s.xp, xpNext, 'xp') : null, h('small', null, xpNext ? `⭐ ${Math.floor(s.xp)}/${xpNext}` : '⭐ MAX')]),
    ]));
    out.push(this._misuratori());
    const tile = (ic, v, t) => h('div', 'mn-tile', null, [h('span', 'ic', ic), h('b', null, String(v)), h('small', null, t)]);
    const tiles = [tile('🗡️', p.atk(), 'attacco'), tile('🛡️', p.def(), 'difesa'), tile('💶', Math.floor(s.money), 'euro'),
      tile('🥵', `${Math.round(p.fatica() * 100)}%`, 'fatica'), tile('👟', `+${Math.round(p.bonus('velocita') * 100)}%`, 'passo')];
    const crit = p.bonus('critico'); if (crit) tiles.push(tile('🎯', `${Math.round(crit * 100)}%`, 'critico'));
    const ann = s.flags?.annata; if (ann?.fiducia != null) tiles.push(tile('🤝', Math.round(ann.fiducia), 'Gigante'));
    try { const r = g.bar?.rispetto?.(); if (r != null) tiles.push(tile('🍺', Math.round(r), 'bar')); } catch {}
    const t = s.today; if (t) tiles.push(tile('🌽', t.raccolti || 0, 'oggi'), tile('🥚', t.uova || 0, 'uova'));
    for (const fn of this.extraStat) { try { for (const [k, v] of fn(g) || []) tiles.push(tile(String(k).split(' ')[0], v, String(k).split(' ').slice(1).join(' '))); } catch {} }
    out.push(h('div', 'mn-tiles', null, tiles));
    const amici = Object.entries(PNG).filter(([id]) => s.png?.[id]);
    if (amici.length) {
      out.push(this._cartello('Amici e nemici'));
      out.push(h('div', 'mn-facce', null, amici.map(([id, d]) => {
        const v = Math.round(g.png.amicizia(id));
        return h('div', 'mn-chi', null, [this._faccia(id), h('span', 'cuore', v >= 50 ? '❤️' : v >= 20 ? '🧡' : v >= 0 ? '🤍' : '💔'), h('small', null, `${d.nome.replace(/^(Il|La|Lo) /, '')} ${v}`)]);
      })));
    }
    return out;
  }

  // ---------- 📔 Diario degli avvisi ----------
  _diario() {
    const s = this.s, d = s.flags.diario || [], out = [];
    s.flags.diarioLetti = d.length;
    queueMicrotask(() => this._tabs());
    out.push(this._cartello('Diario di Garonio'));
    if (!d.length) { out.push(h('p', 'mn-vuoto', '✏️ Pagine bianche. Per ora non è successo niente.')); return out; }
    const ora = m => `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(Math.floor(m % 60 / 10) * 10).padStart(2, '0')}`;
    const icona = k => ({ good: '✅', bad: '❌', warn: '⚠️' }[k] || '•');
    let giorno = null, pagina = null;
    for (let i = d.length - 1; i >= 0; i--) {
      const e = d[i];
      if (e.g !== giorno) {
        giorno = e.g;
        pagina = h('div', 'mn-pagina', null, [h('div', 'mn-data', giorno === s.day ? `Giorno ${giorno} · oggi` : `Giorno ${giorno}`)]);
        out.push(pagina);
      }
      pagina.appendChild(h('div', 'mn-riga ' + (e.k || ''), null, [h('span', 'ora', ora(e.m)), h('span', 'ic', icona(e.k)), h('span', 'tx', e.t)]));
    }
    return out;
  }

  // ---------- ⚙️ Opzioni ----------
  _opzioni() {
    const g = this.game, out = [];
    out.push(this._cartello('Pannelli'));
    out.push(this._azione('✥ Sposta i pannelli', () => { this.chiudi(); setTimeout(() => g.pannelli?.sposta(true), 50); return ''; }));
    out.push(this._azione('↺ Rimetti a posto', () => { g.pannelli?.ripristina(); return '↺ Fatto.'; }));
    out.push(this._cartello('Audio'));
    out.push(this._azione(g.audio.enabled ? '🔊 Audio acceso (tocca per spegnere)' : '🔇 Audio spento (tocca per accendere)', () => { document.getElementById('btn-music')?.click(); return g.audio.enabled ? '🔊' : '🔇'; }));
    out.push(this._volume('🎵', 'Musica', () => g.audio.musicVolume, v => g.audio.setMusicVolume(v), null));
    out.push(this._volume('💥', 'Effetti', () => g.audio.sfxVolume, v => g.audio.setSfxVolume(v), () => g.audio.sfx('coin')));
    out.push(this._cartello('Comandi'));
    out.push(h('div', 'mn-tasti', null, [
      ['WASD', 'muovi'], ['Shift', 'corri'], ['E', 'agisci'], ['Q', 'salta'], ['J', 'menu'], ['N', 'mappa'], ['M', 'musica'], ['R', 'attrezzo'],
    ].map(([k, t]) => h('span', null, null, [h('kbd', null, k), h('small', null, t)]))));
    return out;
  }
}

const ICONE_RAMI = { resistenza: '💪', nervi: '🧘', agricoltore: '🌽', allevatore: '🐖', furbizia: '🦊', lottatore: '👊', parlantina: '🗣️', meccanico: '🔧' };
const ICONE_SLOT = { testa: '🧢', corpo: '🦺', piedi: '🥾', portafortuna: '🍀' };
const ICONE_ARMI = { zappa: '⛏️', rastrello: '🧹', badile: '🪏', forcone: '🔱', falce: '🌙', roncola: '🔪', motosega: '🪚', zappaFolgorata: '⚡', piedeDiPorco: '🪝', forchettone: '🍴', chiaveInglese: '🔧', arpione: '🔱', spadone: '⚔️', zappaDoro: '🏆', palaForno: '🍕' };
