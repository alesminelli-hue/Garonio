// Interfaccia: barre, orologio, missione, dialoghi stile JRPG, menu e notifiche.
import { portrait } from './pixel.js';

const $ = id => document.getElementById(id);

export class UI {
  constructor(audio) {
    this.audio = audio;
    this.queue = null;      // dialogo in corso
    this.typing = null;
    this.modal = null;      // finestra a tutto schermo aperta (es. il menu di Garonio): ha un metodo key(code)
  }

  busy() { return !!this.queue || !!this.modal; }

  // Scrive nel DOM solo se il valore è cambiato: su telefono riscrivere tutto a ogni fotogramma costa batteria.
  _set(id, prop, val) {
    const c = (this._hud ??= {}), k = id + prop;
    if (c[k] === val) return;
    c[k] = val;
    const el = $(id);
    if (prop === 'text') el.textContent = val;
    else if (prop === 'html') { const rb = el.querySelector(':scope > .rid-btn'); el.innerHTML = val; if (rb) el.appendChild(rb); } // tiene il pulsantino "riduci"
    else el.style[prop] = val;
  }

  hud(s, mission) {
    const hh = String(Math.floor(s.minutes / 60) % 24).padStart(2, '0');
    const mm = String(Math.floor(s.minutes % 60 / 10) * 10).padStart(2, '0');
    this._set('clock', 'text', `Giorno ${s.day} · ${hh}:${mm}`);
    this._set('money', 'text', `€ ${Math.floor(s.money)}`);
    this._set('level', 'text', `Lv ${s.level}`);
    this._set('xp', 'width', `${Math.min(100, s.xp / (s.level * 20) * 100).toFixed(1)}%`);
    for (const k of ['health', 'stress', 'tired']) {
      const max = k === 'health' ? (s.maxHealth || 100) : 100;
      const raw = Math.max(0, Math.min(max, s[k])), v = raw / max * 100;
      this._set('bar-' + k, 'width', v.toFixed(1) + '%');
      const danger = k === 'health' ? v < 25 : v > 80;
      if (this._hud['d' + k] !== danger) { this._hud['d' + k] = danger; $('bar-' + k).parentElement.parentElement.classList.toggle('danger', danger); }
      this._set('val-' + k, 'text', String(Math.round(raw)));
    }
    this._set('inv', 'text', `🥚 ${s.inv.uova}  🍅 ${s.inv.pomodoro}  🌽 ${s.inv.mais}`);
    const m = $('mission');
    if (mission) {
      const dl = `${String(Math.floor(mission.deadline / 60)).padStart(2, '0')}:00`;
      const st = mission.done ? '✅ completata' : mission.failed ? '❌ fallita' : `${Math.min(mission.progress, mission.n)}/${mission.n} · entro le ${dl}`;
      this._set('mission', 'html', `<b>Missione del Gigante</b><span>${mission.text}</span><em>${st}</em>`);
      m.classList.toggle('done', !!mission.done);
      m.classList.toggle('failed', !!mission.failed);
      m.hidden = false;
    } else m.hidden = true;
  }

  prompt(text) {
    const p = $('prompt');
    if (text) { p.textContent = text; p.hidden = false; } else p.hidden = true;
  }

  toast(text, kind = '') {
    const box = $('toasts');
    const tutti = box.querySelectorAll(':scope > .toast'), last = tutti[tutti.length - 1];
    if (last && last.textContent === text && !last.classList.contains('out')) return;
    for (let i = 0; i <= tutti.length - 4; i++) tutti[i].remove();
    const t = document.createElement('div');
    t.className = 'toast ' + kind;
    t.textContent = text;
    $('toasts').appendChild(t);
    setTimeout(() => t.classList.add('out'), 2600);
    setTimeout(() => t.remove(), 3200);
  }

  float(text) { this.toast(text, 'small'); }

  // pages: [{ who:'gigante'|'mountain'|..., name, text, choices:[{label, fn}] }]
  dialog(pages) {
    return new Promise(resolve => {
      this.queue = { pages: [...pages], resolve, sel: 0 };
      $('dialog').hidden = false;
      this._show();
    });
  }

  _show() {
    const q = this.queue;
    const p = q.pages[0];
    $('dlg-name').textContent = p.name || '';
    const img = $('dlg-portrait');
    if (p.who) { img.src = portrait(p.who); img.hidden = false; } else img.hidden = true;
    $('dialog').classList.toggle('angry', p.who === 'mountain');
    const box = $('dlg-text');
    const full = p.text;
    let i = 0;
    clearInterval(this.typing);
    box.textContent = '';
    this.typing = setInterval(() => {
      i += 2; box.textContent = full.slice(0, i);
      if (i >= full.length) { clearInterval(this.typing); this.typing = null; this._choices(); }
    }, 16);
    $('dlg-choices').innerHTML = '';
    $('dlg-next').hidden = true;
  }

  _choices() {
    const q = this.queue; if (!q) return;
    const p = q.pages[0];
    const wrap = $('dlg-choices');
    wrap.innerHTML = '';
    if (p.choices) {
      q.sel = 0;
      p.choices.forEach((c, i) => {
        const b = document.createElement('button');
        b.textContent = c.label;
        if (c.disabled) b.classList.add('disabled');
        b.onclick = e => { e.stopPropagation(); q.sel = i; this._pick(); };
        wrap.appendChild(b);
      });
      this._mark();
    } else $('dlg-next').hidden = false;
  }

  _mark() {
    [...$('dlg-choices').children].forEach((b, i) => b.classList.toggle('sel', i === this.queue.sel));
  }

  _pick() {
    const q = this.queue; const p = q.pages[0];
    const c = p.choices[q.sel];
    if (c.disabled) { this.audio.sfx('bad'); return; }
    this.audio.sfx('blip');
    const more = c.fn ? c.fn() : null;
    q.pages.shift();
    if (Array.isArray(more)) q.pages.unshift(...more);
    this._advanceOrClose();
  }

  _advanceOrClose() {
    const q = this.queue;
    if (q.pages.length) this._show();
    else { $('dialog').hidden = true; this.queue = null; q.resolve(); }
  }

  // input da tastiera/touch mentre il dialogo è aperto
  key(k) {
    const q = this.queue; if (!q) return false;
    const p = q.pages[0];
    if (this.typing) { // completa subito il testo
      clearInterval(this.typing); this.typing = null;
      $('dlg-text').textContent = p.text; this._choices(); return true;
    }
    if (p.choices) {
      if (k === 'up') { q.sel = (q.sel + p.choices.length - 1) % p.choices.length; this._mark(); this.audio.sfx('blip'); }
      else if (k === 'down') { q.sel = (q.sel + 1) % p.choices.length; this._mark(); this.audio.sfx('blip'); }
      else if (k === 'ok') this._pick();
      return true;
    }
    if (k === 'ok') { this.audio.sfx('blip'); q.pages.shift(); this._advanceOrClose(); }
    return true;
  }

  fade(on) { $('fade').classList.toggle('on', on); return new Promise(r => setTimeout(r, 600)); }

  shake() { const c = $('game'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
}
