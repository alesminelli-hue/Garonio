// Menu di Garonio (tasto J o pulsante 📓): una finestra a schede, uguale su PC e telefono.
//   📋 Missioni  · missione del Gigante, secondarie in corso, chi ha un lavoretto, completate
//   🎒 Zaino     · oggetti con quantità ed effetto, si usano da qui
//   🧥 Equip     · arma e vestiti indossati, si cambiano con un tocco
//   ⭐ Abilità   · rami di abilità coi loro gradi, si spendono i punti
//   📊 Scheda    · statistiche di Garonio e amicizie
//
// API (game.menu):
//   apri(scheda?)                      apre il menu (scheda: 'missioni' | 'zaino' | 'equip' | 'abilita' | 'scheda')
//   chiudi() / aperto()
//   aggiungiScheda(id, { nome, icona, render(menu) => [elementi] })   altri lavori aggiungono schede
//   aggiungiStatistica(fn)             fn(game) => [[etichetta, valore], ...] righe in più nella Scheda
//
// Tastiera: ←/→ (o A/D, 1-5) cambia scheda · ↑/↓ scegli · E/Invio usa · J/Esc chiude.
import { RAMI, GRADI_LIVELLO, LIVELLI } from './data/progressione.js';
import { ARMI, VESTITI, OGGETTI, SLOT, NOMI_SLOT } from './data/armi.js';
import { PNG } from './data/png.js';

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

// descrizione breve degli effetti di un oggetto
function effetti(o) {
  const e = o.effetto || {}, r = [];
  if (e.health) r.push(`Vita +${e.health}`);
  if (e.tired) r.push(`Stanchezza ${e.tired}`);
  if (e.stress) r.push(`Stress ${e.stress}`);
  if (e.danno) r.push(`lancialo: ${e.danno} danni`);
  if (e.stordisce) r.push('stordisce un nemico');
  if (e.guarisce) r.push('cura (anche i maiali)');
  if (o.missione) r.push('per una missione');
  if (o.vendita) r.push(`vale ${o.vendita}€`);
  return r.join(' · ') || '—';
}

export class Menu {
  constructor(game) {
    this.game = game;
    this.tab = 'missioni';
    this.msg = '';
    this.sel = 0;
    this.extraStat = [];
    this.schede = {
      missioni: { icona: '📋', nome: 'Missioni', render: () => this._missioni() },
      zaino: { icona: '🎒', nome: 'Zaino', render: () => this._zaino() },
      equip: { icona: '🧥', nome: 'Equip', render: () => this._vestiario() },
      abilita: { icona: '⭐', nome: 'Abilità', render: () => this._abilita() },
      scheda: { icona: '📊', nome: 'Scheda', render: () => this._scheda() },
      opzioni: { icona: '⚙️', nome: 'Opzioni', render: () => this._opzioni() },
    };
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
    this.head = h('div', 'mn-head', null, [h('div', 'mn-title', 'Garonio'), close]);
    this.msgEl = h('div', 'mn-msg');
    this.body = h('div', 'mn-body');
    const hint = h('div', 'mn-hint', '←/→ schede · ↑/↓ scegli · E usa · J o Esc chiude');
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
    if (id === 'missioni') return this.game.quests.attive().length + (this.s.mission && !this.s.mission.done && !this.s.mission.failed ? 1 : 0);
    return 0;
  }

  _render() {
    const titolo = `Garonio · Lv ${this.s.level} «${this.prog.titolo()}» · € ${Math.floor(this.s.money)}`;
    this.head.firstChild.textContent = titolo;
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

  // ---------- 📋 Missioni ----------
  _missioni() {
    const s = this.s, g = this.game, out = [];
    const m = s.mission;
    out.push(h('h3', null, '👹 Il Gigante'));
    if (m) {
      const dl = `${String(Math.floor(m.deadline / 60)).padStart(2, '0')}:00`;
      const st = m.done ? '✅ fatta' : m.failed ? '❌ fallita' : `${Math.min(m.progress, m.n)}/${m.n} · entro le ${dl}`;
      out.push(h('div', 'mn-card' + (m.done ? ' ok' : m.failed ? ' ko' : ''), null, [
        h('b', null, m.text), barra(Math.min(m.progress, m.n), m.n), h('small', null, st)]));
    } else out.push(h('p', 'mn-vuoto', 'Oggi niente ordini dal Gigante. Per ora. Non abituarti.'));

    const attive = g.quests.attive();
    out.push(h('h3', null, `❗ Missioni secondarie in corso (${attive.length})`));
    if (!attive.length) out.push(h('p', 'mn-vuoto', 'Nessuna. Chi in giro ha un ❗ sopra la testa ha un lavoretto per te.'));
    for (const q of attive) {
      const d = q.def, da = PNG[d.da]?.nome || (d.da === 'gigante' ? 'Il Gigante' : d.da);
      const dest = PNG[d.obiettivo.a || d.da]?.nome || da;
      let st;
      if (q.stato === 'pronta') st = `✅ Fatto! Torna da ${da} a riscuotere.`;
      else if (d.obiettivo.consegna) st = `Da portare a ${dest}: ` + Object.entries(d.obiettivo.consegna).map(([o, n]) => `${OGGETTI[o]?.icona || ''} ${Math.min(n, s.inv[o] || 0)}/${n}`).join('  ');
      else if (d.obiettivo.parla) st = `Vai a parlare con ${PNG[d.obiettivo.parla]?.nome || d.obiettivo.parla}.`;
      else st = `${q.progresso}/${q.n}`;
      const scad = d.giorni ? ` · scade tra ${Math.max(0, d.giorni - (s.day - (s.quests.attive[q.id]?.giorno ?? s.day)))} giorni` : '';
      out.push(h('div', 'mn-card' + (q.stato === 'pronta' ? ' ok' : ''), null, [
        h('b', null, `${d.truffaldina ? '🤫 ' : ''}${d.titolo}`), h('small', 'mn-da', `da ${da}${scad}`),
        d.offerta ? h('p', 'mn-desc', `«${d.offerta}»`) : null,
        q.n > 1 && q.stato !== 'pronta' ? barra(q.progresso, q.n) : null,
        h('small', null, st)]));
    }

    // chi ha un lavoretto da offrire (solo i nomi: i dettagli li dice lui)
    const chi = Object.keys(PNG).filter(p => g.quests.disponibili(p).length);
    if (chi.length) {
      out.push(h('h3', null, '💬 Chi ha un lavoretto per te'));
      out.push(h('p', 'mn-desc', chi.map(p => `❗ ${PNG[p].nome}`).join('   ')));
    }

    const fatte = s.quests.fatte.map(id => g.quests.defs[id]?.titolo).filter(Boolean);
    const fallite = s.quests.fallite.map(id => g.quests.defs[id]?.titolo).filter(Boolean);
    if (fatte.length || fallite.length) {
      out.push(h('h3', null, `📜 Archivio (${fatte.length} fatte${fallite.length ? `, ${fallite.length} fallite` : ''})`));
      const ul = h('ul', 'mn-list');
      for (const t of fatte) ul.appendChild(h('li', 'ok', `✔ ${t}`));
      for (const t of fallite) ul.appendChild(h('li', 'ko', `✘ ${t}`));
      out.push(ul);
    }
    return out;
  }

  // ---------- 🎒 Zaino ----------
  _zaino() {
    const s = this.s, out = [];
    const items = Object.entries(s.inv).filter(([id, n]) => n > 0 && OGGETTI[id]);
    const altri = Object.entries(s.inv).filter(([id, n]) => n > 0 && !OGGETTI[id]);
    if (!items.length && !altri.length) return [h('p', 'mn-vuoto', 'Lo zaino è vuoto. C\'è solo una caramella del 2014, incollata al fondo.')];
    const grid = h('div', 'mn-grid');
    for (const [id, n] of items) {
      const o = OGGETTI[id], e = o.effetto || {};
      const usabile = !!(e.health || e.tired || e.stress);
      const cell = h('div', 'mn-item', null, [
        h('div', 'mn-icon', o.icona || '📦'), h('b', null, `${o.nome} ×${n}`), h('small', null, effetti(o)),
        usabile ? this._azione('Usa', () => {
          const prima = { v: Math.round(s.health), st: Math.round(s.stress), f: Math.round(s.tired) };
          if (!this.prog.usa(id)) return 'Non si può usare adesso.';
          this.game.audio.sfx('eat');
          const d = [Math.round(s.health) - prima.v && `Vita ${Math.round(s.health) - prima.v > 0 ? '+' : ''}${Math.round(s.health) - prima.v}`,
            Math.round(s.stress) - prima.st && `Stress ${Math.round(s.stress) - prima.st}`,
            Math.round(s.tired) - prima.f && `Stanchezza ${Math.round(s.tired) - prima.f}`].filter(Boolean);
          return `Garonio usa: ${o.nome}. ${d.join(', ') || 'Non succede niente, ma era buono.'}`;
        }, { cls: 'small' }) : null]);
      grid.appendChild(cell);
    }
    for (const [id, n] of altri) grid.appendChild(h('div', 'mn-item', null, [h('div', 'mn-icon', '❔'), h('b', null, `${id} ×${n}`)]));
    out.push(grid);
    out.push(h('p', 'mn-desc', `Vita ${Math.round(s.health)}/${s.maxHealth} · Stress ${Math.round(s.stress)} · Stanchezza ${Math.round(s.tired)}`));
    return out;
  }

  // ---------- 🧥 Equipaggiamento ----------
  _vestiario() {
    const p = this.prog, s = this.s, out = [];
    out.push(h('h3', null, `🗡️ Arma · attacco totale ${p.atk()}`));
    const armi = h('div', 'mn-rows');
    for (const id of s.prog.armi) {
      const a = ARMI[id]; if (!a) continue;
      const su = p.arma().id === id, aff = s.prog.affilatura?.[id];
      armi.appendChild(this._azione(`${su ? '✔ ' : ''}${a.nome} · attacco +${a.atk}${aff ? ` · affilata ${aff}` : ''}${a.fuori ? ` · fuori: ${a.fuori}` : ''}`,
        () => { if (su) return `${a.nome}: ce l'hai già in mano.`; p.impugna(id); return `Garonio impugna: ${a.nome}.`; }, { cls: su ? 'on' : '' }));
    }
    out.push(armi);
    out.push(h('h3', null, `🧥 Vestiti · difesa totale ${p.def()}`));
    for (const slot of SLOT) {
      const cur = p.indossato(slot);
      const mie = s.prog.vestiti.filter(x => VESTITI[x]?.slot === slot);
      const rows = h('div', 'mn-rows', null, [h('div', 'mn-slot', `${NOMI_SLOT[slot]}: ${cur ? VESTITI[cur].nome : '—'}`)]);
      if (!mie.length) rows.appendChild(h('small', 'mn-vuoto', 'Niente. Il Bubetto vende, le missioni regalano.'));
      for (const id of mie) {
        const v = VESTITI[id], su = cur === id;
        rows.appendChild(this._azione(`${su ? '✔ ' : ''}${v.nome} · ${v.desc}`, () => {
          if (su) { p.togli(slot); return `Garonio si toglie: ${v.nome}.`; }
          p.indossa(id); return `Garonio indossa: ${v.nome}.`;
        }, { cls: su ? 'on' : '' }));
      }
      out.push(rows);
    }
    out.push(h('p', 'mn-desc', 'Tocca un vestito indossato per toglierlo.'));
    return out;
  }

  // ---------- ⭐ Abilità ----------
  _abilita() {
    const p = this.prog, s = this.s, out = [];
    out.push(h('p', 'mn-desc' + (s.prog.punti ? ' gold' : ''), s.prog.punti
      ? `Hai ${s.prog.punti} punt${s.prog.punti === 1 ? 'o' : 'i'} abilità da spendere!`
      : `Nessun punto da spendere. Ne guadagni uno a ogni livello (gradi 2, 3 e 4 chiedono livello ${GRADI_LIVELLO.slice(1).join(', ')}).`));
    for (const [id, r] of Object.entries(RAMI)) {
      const gr = p.grado(id);
      const lista = h('ul', 'mn-gradi');
      r.gradi.forEach((x, i) => lista.appendChild(h('li', i < gr ? 'ok' : s.level < GRADI_LIVELLO[i] ? 'lock' : '', `${i < gr ? '●' : '○'} ${x.desc}${i >= gr && s.level < GRADI_LIVELLO[i] ? ` (Lv ${GRADI_LIVELLO[i]})` : ''}`)));
      const next = r.gradi[gr];
      const card = h('div', 'mn-card', null, [h('b', null, `${r.nome} ${pallini(gr)}`), lista]);
      if (gr < 4) card.appendChild(this._azione(`+ ${next.desc}`, () => {
        p.alza(id); this.game.audio.sfx('level'); return `${r.nome} grado ${gr + 1}: ${next.desc}.`;
      }, { off: !p.puoiAlzare(id), cls: 'small' }));
      out.push(card);
    }
    return out;
  }

  // ---------- ⚙️ Opzioni ----------
  _opzioni() {
    const g = this.game, out = [];
    out.push(h('h3', null, '🖐️ Pannelli'));
    out.push(h('p', 'mn-desc', 'Tocca ✥ Sposta (in alto a destra) e trascina barre, missione, minimappa e pulsanti dove vuoi, poi ✔ Fatto. Col mouse si possono trascinare anche senza. Il pulsantino ▾ riduce barre e missione a una riga.'));
    out.push(this._azione('✥ Sposta i pannelli', () => { this.chiudi(); setTimeout(() => g.pannelli?.sposta(true), 50); return ''; }));
    out.push(this._azione('↺ Rimetti i pannelli al loro posto', () => { g.pannelli?.ripristina(); return 'Pannelli rimessi al loro posto.'; }));
    out.push(h('h3', null, '🎵 Audio'));
    out.push(this._azione('♪ Musica on/off', () => { document.getElementById('btn-music')?.click(); return 'Musica cambiata.'; }));
    out.push(h('h3', null, '⌨️ Comandi su PC'));
    out.push(h('p', 'mn-desc', 'Frecce/WASD muovi · Shift corri · E/Spazio agisci · Q salta (clacson sui mezzi) · J menu · N mappa · M musica'));
    out.push(h('h3', null, '📱 Comandi su telefono'));
    out.push(h('p', 'mn-desc', 'Levetta a sinistra (spingi fino in fondo per correre) · E agisci · Q salta · in alto a destra: Menu, Mappa, Musica'));
    return out;
  }

  // ---------- 📊 Scheda ----------
  _scheda() {
    const s = this.s, p = this.prog, g = this.game, out = [];
    const xpNext = s.level >= LIVELLI.max ? 0 : p.xpNext();
    out.push(h('div', 'mn-card', null, [
      h('b', null, `Livello ${s.level} · «${p.titolo()}»`),
      xpNext ? barra(s.xp, xpNext, 'xp') : null,
      h('small', null, xpNext ? `Esperienza ${Math.floor(s.xp)}/${xpNext}` : 'Livello massimo'),
    ]));
    const bars = h('div', 'mn-bars', null, [
      h('label', null, '❤ Vita'), barra(s.health, s.maxHealth, 'health'), h('span', null, `${Math.round(s.health)}/${s.maxHealth}`),
      h('label', null, '⚡ Stress'), barra(s.stress, 100, 'stress'), h('span', null, String(Math.round(s.stress))),
      h('label', null, '💤 Stanch.'), barra(s.tired, 100, 'tired'), h('span', null, String(Math.round(s.tired))),
    ]);
    out.push(bars);
    const righe = [
      ['🗡️ Attacco', p.atk()], ['🛡️ Difesa', p.def()], ['🪓 Arma', p.arma().nome],
      ['🥵 Fatica dei lavori', `${Math.round(p.fatica() * 100)}%`],
      ['👟 Velocità', `+${Math.round(p.bonus('velocita') * 100)}%`],
      ['💰 Soldi', `€ ${Math.floor(s.money)}`], ['📅 Giorno', s.day],
    ];
    const crit = p.bonus('critico'); if (crit) righe.push(['🎯 Critico', `${Math.round(crit * 100)}%`]);
    const ann = s.flags?.annata; if (ann?.fiducia != null) righe.push(['🤝 Fiducia del Gigante', Math.round(ann.fiducia)]);
    try { const r = g.bar?.rispetto?.(); if (r != null) righe.push(['🍺 Rispetto al bar', Math.round(r)]); } catch {}
    const t = s.today; if (t) righe.push(['🌾 Oggi', `${t.raccolti || 0} raccolti · ${t.uova || 0} uova · ${t.nutrie || 0} nutrie`]);
    for (const fn of this.extraStat) { try { righe.push(...(fn(g) || [])); } catch {} }
    const tab = h('div', 'mn-kv');
    for (const [k, v] of righe) tab.append(h('span', null, k), h('b', null, String(v)));
    out.push(tab);
    const amici = Object.entries(PNG).filter(([id]) => s.png?.[id]);
    if (amici.length) {
      out.push(h('h3', null, '👥 Amicizie'));
      const am = h('div', 'mn-bars');
      for (const [id, d] of amici) { const v = g.png.amicizia(id), max = d.amicizia?.[1] ?? 100; am.append(h('label', null, d.nome), barra(v, max, 'friend'), h('span', null, String(Math.round(v)))); }
      out.push(am);
    }
    return out;
  }
}
