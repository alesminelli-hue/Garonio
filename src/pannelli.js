// Pannelli spostabili: barre di Garonio, missione, minimappa, pulsanti rapidi, pannello di guida, dialoghi e menu.
// Si trascinano col dito o col mouse (basta spostarli di qualche pixel: un tocco semplice resta un tocco).
// La posizione si ricorda per orientamento (verticale e orizzontale hanno disposizioni diverse).
// Barre e missione hanno anche un pulsantino ▾ per ridurle a una riga.
//
// Modalità «Sposta» (pulsante ✥ della barra rapida o Opzioni del menu): il gioco si ferma, ogni pannello
// mostra una cornice e una maniglia, e basta trascinarlo; «Fatto» per tornare a giocare.
//
// API (window.__garonio.pannelli):  ripristina()   rimette tutto al suo posto
//                                    aggiungi(el, id)  rende spostabile un altro pannello
//                                    sposta(on)     accende o spegne la modalità «Sposta»
const KEY = 'garonio-pannelli-v1';
const SOGLIA = 9; // px prima che un tocco diventi un trascinamento

function carica() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } }
function salva(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
const orient = () => (innerWidth > innerHeight ? 'o' : 'v');

export class Pannelli {
  constructor(ui) {
    this.ui = ui;
    this.dati = carica();          // { v: { id: { dx, dy, ridotto } }, o: {...} }
    this.els = {};
    this.zitto = false;            // true subito dopo un trascinamento: il click che segue non conta
    window.addEventListener('click', e => {
      const inPannello = this.attivo && e.target.closest?.('.spostabile') && !e.target.closest('.rid-btn');
      if (this.zitto || inPannello) { e.stopPropagation(); e.preventDefault(); }
    }, true);
    window.addEventListener('resize', () => { clearTimeout(this._rt); this._rt = setTimeout(() => this.applicaTutti(), 150); });
  }

  _pos(id) { const o = (this.dati[orient()] ??= {}); return (o[id] ??= { dx: 0, dy: 0 }); }

  aggiungi(el, id, { riducibile = false, maniglia = null } = {}) {
    if (!el || this.els[id]) return;
    this.els[id] = el;
    el.classList.add('spostabile');
    const presa = maniglia || el;
    let st = null;
    // durante il trascinamento si ascolta tutta la finestra: il dito può uscire dal pannello
    const muovi = e => {
      if (!st || e.pointerId !== st.pid) return;
      const mx = e.clientX - st.x, my = e.clientY - st.y;
      if (!st.via && Math.hypot(mx, my) < (this.attivo ? 2 : SOGLIA)) return;
      if (!st.via) { st.via = true; el.classList.add('trascina'); }
      const p = this._pos(id); p.dx = st.dx + mx; p.dy = st.dy + my;
      this.applica(id);
      e.preventDefault();
    };
    const fine = e => {
      if (!st || e.pointerId !== st.pid) return;
      window.removeEventListener('pointermove', muovi, true);
      window.removeEventListener('pointerup', fine, true);
      window.removeEventListener('pointercancel', fine, true);
      if (st.via) {
        el.classList.remove('trascina');
        this.applica(id, true); salva(this.dati);
        this.zitto = true; setTimeout(() => { this.zitto = false; }, 80);
      }
      st = null;
    };
    presa.addEventListener('pointerdown', e => {
      if (e.button > 0 || el.classList.contains('big') || st) return;
      if (e.target.closest('.rid-btn, .mn-close, .mn-tab, .mn-body, input')) return;
      if (this.attivo) e.preventDefault();
      const p = this._pos(id);
      st = { x: e.clientX, y: e.clientY, dx: p.dx, dy: p.dy, via: false, pid: e.pointerId };
      window.addEventListener('pointermove', muovi, true);
      window.addEventListener('pointerup', fine, true);
      window.addEventListener('pointercancel', fine, true);
    });
    const grip = document.createElement('span');
    grip.className = 'grip'; grip.textContent = '✥';
    el.appendChild(grip);
    if (riducibile) {
      const b = document.createElement('button');
      b.className = 'rid-btn'; b.type = 'button'; b.title = 'Riduci / allarga';
      b.addEventListener('click', e => {
        e.stopPropagation();
        const p = this._pos(id); p.ridotto = !p.ridotto; salva(this.dati); this.applica(id, true);
      });
      el.appendChild(b);
    }
    // se un modulo riscrive il pannello con innerHTML, rimette maniglia e pulsantino ▾
    const tieni = [...el.querySelectorAll(':scope > .grip, :scope > .rid-btn')];
    new MutationObserver(() => { for (const k of tieni) if (k.parentNode !== el) el.appendChild(k); }).observe(el, { childList: true });
    this.applica(id);
  }

  // sposta il pannello; con "tieni" lo riporta dentro lo schermo se è uscito
  applica(id, tieni = false) {
    const el = this.els[id]; if (!el) return;
    const p = this._pos(id);
    el.classList.toggle('ridotto', !!p.ridotto);
    const rb = el.querySelector(':scope > .rid-btn'); if (rb) rb.textContent = p.ridotto ? '▸' : '▾';
    el.style.translate = p.dx || p.dy ? `${Math.round(p.dx)}px ${Math.round(p.dy)}px` : '';
    if (tieni && el.offsetParent !== null) {
      const r = el.getBoundingClientRect(), m = 4;
      let ax = 0, ay = 0;
      if (r.right > innerWidth - m) ax = innerWidth - m - r.right;
      if (r.left + ax < m) ax = m - r.left;
      if (r.bottom > innerHeight - m) ay = innerHeight - m - r.bottom;
      if (r.top + ay < m) ay = m - r.top;
      if (ax || ay) { p.dx += ax; p.dy += ay; el.style.translate = `${Math.round(p.dx)}px ${Math.round(p.dy)}px`; }
    }
  }

  // ---------- Modalità «Sposta» ----------
  sposta(on = !this.attivo) {
    if (on === !!this.attivo) return;
    if (on && this.ui.busy()) return;
    this.attivo = on;
    document.body.classList.toggle('sposta', on);
    if (!this.barra) {
      const b = this.barra = document.createElement('div');
      b.id = 'sposta-bar';
      b.innerHTML = '<span>✥ Trascina i pannelli dove vuoi. ▾ li riduce.</span><div><button data-a="r">↺ Ripristina</button><button data-a="ok" class="ok">✔ Fatto</button></div>';
      b.addEventListener('click', e => {
        const a = e.target.closest('button')?.dataset.a; e.stopPropagation();
        if (a === 'r') this.ripristina(); else if (a === 'ok') this.sposta(false);
      });
      document.body.appendChild(b);
    }
    this.barra.hidden = !on;
    // il gioco resta fermo finché si spostano i pannelli (Esc o Invio per finire)
    this._modal ??= { key: code => { if (['Escape', 'Enter', 'KeyJ', 'Space'].includes(code)) this.sposta(false); } };
    if (on) this.ui.modal = this._modal;
    else { if (this.ui.modal === this._modal) this.ui.modal = null; this.applicaTutti(); }
  }

  applicaTutti() { for (const id of Object.keys(this.els)) this.applica(id, true); }

  ripristina() { this.dati = {}; salva(this.dati); for (const id of Object.keys(this.els)) this.applica(id); }
}
