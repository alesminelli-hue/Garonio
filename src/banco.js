// Il Banco del Gigante (GDD capitolo 26.8): nell'officina di casa, sul banco da lavoro del Gigante,
// si costruiscono vestiti, attrezzi e cibi con quello che Garonio trova in giro (mostri del parco, alberi,
// stalla, «lavoretti» del Camper). Prende il posto della vecchia battuta del banco (src/interni.js,
// zona 'officina:bancone'). Ricette: src/data/banco.js.
//
// API (game.banco):
//   costruisci(id)    costruisce una ricetta se ci sono gli ingredienti
//   puo(id)           { ok, manca: [...], liv }
// Eventi: emette  costruito { id, tipo }
import { BANCO as D } from './data/banco.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';
import { pick, fill } from './racconto.js';
import { TESTI as TESTI_INTERNI } from './data/interni.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const catalogo = r => (r.tipo === 'arma' ? ARMI : r.tipo === 'vestito' ? VESTITI : OGGETTI)[r.id];
const nomeOgg = (o, n) => `${OGGETTI[o]?.icona || ''} ${OGGETTI[o]?.nome || o}${n > 1 ? ` ×${n}` : ''}`;

export class Banco {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }

  init() {
    const g = this.game;
    g.interni?.aggancia?.('officina:bancone', () => this.apri());
    g.pilot?.sezione?.('🔨 Banco del Gigante', () => [
      { label: '🔨 Dai tutti gli ingredienti (×6)', fn: () => { for (const r of Object.values(D.ricette)) for (const o of Object.keys(r.serve)) g.prog.dai(o, 6); return null; } },
      { label: '🔨 Apri il banco', fn: () => { setTimeout(() => this.apri(), 50); return null; } },
    ]);
  }

  _fatta(id) { const r = D.ricette[id]; return r.tipo === 'arma' ? this.game.prog.haArma(r.id) : r.tipo === 'vestito' ? this.game.prog.haVestito(r.id) : false; }
  puo(id) {
    const r = D.ricette[id], p = this.game.prog;
    const manca = Object.entries(r.serve).filter(([o, n]) => !p.ha(o, n)).map(([o, n]) => nomeOgg(o, n - Math.min(n, this.s.inv[o] || 0)));
    const liv = (r.liv || 0) <= this.s.level;
    return { ok: !manca.length && liv && !this._fatta(id), manca, liv };
  }

  async apri() {
    const g = this.game;
    const voci = Object.entries(D.ricette).filter(([id]) => !this._fatta(id)).map(([id, r]) => {
      const c = catalogo(r), q = this.puo(id);
      const ingr = Object.entries(r.serve).map(([o, n]) => `${OGGETTI[o]?.icona || o}${(this.s.inv[o] || 0)}/${n}`).join(' ');
      const icona = r.tipo === 'arma' ? '🗡️' : r.tipo === 'vestito' ? '🧥' : c.icona;
      return { label: `${q.ok ? '' : '🔒 '}${icona} ${c.nome}${r.n > 1 ? ` ×${r.n}` : ''} · ${ingr}${!q.liv ? ` · Lv ${r.liv}` : ''}`, fn: () => { this._scelta = id; return null; } };
    });
    this._scelta = null;
    await g.ui.dialog([{ who: 'gigante', name: 'Banco del Gigante', text: D.intro, choices: [...voci, { label: D.vecchio, fn: () => { this._scelta = '_vecchio'; return null; } }, { label: 'Niente, grazie', fn: null }] }]);
    const id = this._scelta;
    if (id === '_vecchio') return g.ui.dialog([{ name: 'Banco da lavoro', text: pick(TESTI_INTERNI?.officina?.banco || ['Il banco è pieno di roba.']) }]);
    if (id) return this.costruisci(id);
  }

  async costruisci(id) {
    const g = this.game, s = this.s, r = D.ricette[id], c = catalogo(r), q = this.puo(id);
    if (!q.liv) return g.ui.dialog([{ name: 'Banco del Gigante', text: fill(D.basso, r) }]);
    if (!q.ok) return g.ui.dialog([{ name: 'Banco del Gigante', text: fill(D.manca, { cosa: q.manca.join(', ') || 'niente' }) }]);
    for (const [o, n] of Object.entries(r.serve)) g.prog.togliOggetto(o, n);
    if (r.tipo === 'arma') g.prog.daiArma(r.id);
    else if (r.tipo === 'vestito') g.prog.daiVestito(r.id, !g.prog.indossato(VESTITI[r.id].slot));
    else g.prog.dai(r.id, r.n || 1);
    s.minutes += D.minuti; s.tired = clamp(s.tired + D.fatica, 0, 100);
    g._xp?.(r.tipo === 'oggetto' ? 6 : 30);
    g.audio.sfx('level');
    await g.ui.dialog([{ name: 'Banco del Gigante', text: `${r.testo}\n\n${fill(D.fatto, { cosa: `${c.nome}${r.n > 1 ? ` ×${r.n}` : ''}` })}` }]);
    g.emit('costruito', { id: r.id, tipo: r.tipo });
    g.save?.();
  }
}
