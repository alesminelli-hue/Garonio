// Interfaccia: barre, orologio, missione, dialoghi stile JRPG, menu e notifiche.
import { portrait } from './pixel.js';

const $ = id => document.getElementById(id);
const MODO_KEY = 'garonio-avvisi';

export class UI {
  constructor(audio) {
    this.audio = audio;
    this.queue = null;      // dialogo in corso
    this.typing = null;
    this.modal = null;      // finestra a tutto schermo aperta (es. il menu di Garonio): ha un metodo key(code)
    // avvisi: 'importanti' (fissi solo quelli importanti, gli altri spariscono da soli) | 'tutti' (tutti fissi) | 'tempo'
    try { this.modoAvvisi = localStorage.getItem(MODO_KEY) || 'importanti'; } catch { this.modoAvvisi = 'importanti'; }
  }

  setModoAvvisi(m) { this.modoAvvisi = m; try { localStorage.setItem(MODO_KEY, m); } catch { } }

  // un avviso è importante se avverte di un guaio (rosso) o riguarda il Gigante, le missioni, il telefono, i mezzi a secco
  _importante(text, kind) {
    if (kind === 'importante') return true;
    if (/^Stress [+−-]\d+$/.test(text)) return false;
    if (kind === 'bad') return true;
    return /SMS|[Cc]hiamata|[Mm]issione|Gigante|PAPÀ|Mister Mountain|❗|a secco|tanica/.test(text);
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

  // Avvisi: restano a schermo finché il giocatore non li chiude (tocco sull'avviso o ✕), così da telefono
  // non se ne perde nessuno. Solo i «float» piccoli (+1 uovo, attrezzo alzato...) spariscono da soli.
  toast(text, kind = '') {
    try { this.onToast?.(text, kind); } catch {} // il diario degli avvisi (menu di Garonio) li tiene da parte
    const box = $('toasts');
    const tutti = [...box.querySelectorAll(':scope > .toast:not(.out)')];
    if (kind === 'small') {
      const last = tutti[tutti.length - 1];
      if (last && last.dataset.testo === text) return;
      const t = document.createElement('div');
      t.className = 'toast small'; t.textContent = text; t.dataset.testo = text;
      box.appendChild(t);
      setTimeout(() => t.classList.add('out'), 2600);
      setTimeout(() => { t.remove(); this._tuttiAvvisi(); }, 3200);
      return;
    }
    // lo stesso avviso ancora aperto (anche se cambiano solo i numeri, es. «3 perse oggi»): niente doppione,
    // si aggiorna il testo e sale il contatore
    const chiave = text.replace(/[\d.,]+/g, '#');
    const uguale = tutti.find(t => t.dataset.chiave === chiave && t.classList.contains('fisso'));
    if (uguale) {
      const n = (+uguale.dataset.n || 1) + 1; uguale.dataset.n = n;
      uguale.dataset.testo = text; uguale.querySelector('.toast-t').textContent = text;
      uguale.querySelector('.toast-n').textContent = `×${n}`;
      box.appendChild(uguale); uguale.classList.remove('nuovo'); void uguale.offsetWidth; uguale.classList.add('nuovo');
      return;
    }
    // al massimo 12 aperti: i più vecchi restano comunque nel diario degli avvisi (menu J)
    const fissi = tutti.filter(t => t.classList.contains('fisso'));
    for (let i = 0; i <= fissi.length - 12; i++) fissi[i].remove();
    const t = document.createElement('div');
    t.className = 'toast fisso nuovo ' + kind; t.dataset.testo = text; t.dataset.chiave = chiave;
    // gli avvisi non importanti (o tutti, in modalità «a tempo») spariscono da soli dopo qualche secondo
    const fisso = this.modoAvvisi === 'tutti' || (this.modoAvvisi === 'importanti' && this._importante(text, kind));
    if (!fisso) {
      t.classList.add('tempo');
      setTimeout(() => { if (!t.isConnected) return; t.classList.add('out'); setTimeout(() => { t.remove(); this._tuttiAvvisi(); }, 500); }, 5000);
    }
    const testo = document.createElement('span'); testo.className = 'toast-t'; testo.textContent = text;
    const n = document.createElement('b'); n.className = 'toast-n';
    const x = document.createElement('button'); x.className = 'toast-x'; x.type = 'button'; x.textContent = '✕'; x.setAttribute('aria-label', 'Chiudi avviso');
    t.append(testo, n, x);
    const chiudi = e => {
      e.preventDefault(); e.stopPropagation();
      if (document.body.classList.contains('sposta')) return;   // si sta spostando il pannello degli avvisi
      t.classList.add('out'); setTimeout(() => { t.remove(); this._tuttiAvvisi(); }, 300);
    };
    t.addEventListener('pointerdown', chiudi);
    box.appendChild(t);
    this._tuttiAvvisi();
  }

  // con due o più avvisi aperti compare «Chiudi tutti»
  _tuttiAvvisi() {
    const box = $('toasts');
    const n = box.querySelectorAll(':scope > .toast.fisso:not(.out)').length;
    let b = box.querySelector(':scope > .toast-tutti');
    if (n < 2) { b?.remove(); return; }
    if (!b) {
      b = document.createElement('button'); b.type = 'button'; b.className = 'toast-tutti';
      b.addEventListener('pointerdown', e => {
        e.preventDefault(); e.stopPropagation();
        if (document.body.classList.contains('sposta')) return;
        box.querySelectorAll(':scope > .toast.fisso').forEach(t => t.remove()); b.remove();
      });
    }
    b.textContent = `✕ Chiudi tutti (${n})`;
    box.prepend(b);
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
    [...$('dlg-choices').children].forEach((b, i) => { b.classList.toggle('sel', i === this.queue.sel); if (i === this.queue.sel) b.scrollIntoView?.({ block: 'nearest' }); });
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
