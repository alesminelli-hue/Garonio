// Il paese reagisce all'azienda (GDD capitolo 27.5). Quando Garonio ha la Cascina dei Salici:
//  - gli agricoltori (Potato, Postman, Frank, Camper, Rodella) lo salutano da collega;
//  - gli altri, a volte, invece del saluto solito commentano l'azienda (3-4 frasi a testa, buone o cattive);
//  - Ludovica, Federica, Sabrina e Ilenia sono più facili: ogni risposta non sbagliata vale qualche punto
//    di affinità in più, e a volte salutano parlando dell'azienda.
// Funziona cambiando per un attimo i saluti del personaggio mentre parla (src/png.js, src/ragazze.js).
// Dati: src/data/paese.js.
import { PNG } from './data/png.js';
import { RAGAZZE } from './data/ragazze.js';
import { AGRICOLTORI, COMMENTI, RAGAZZE_AZIENDA, PROB_COMMENTO, PROB_PARI } from './data/paese.js';

export class Paese {
  constructor(game) { this.game = game; }
  _azienda() { return !!this.game.azienda?.comprata?.(); }

  init() {
    const g = this.game, png = g.png, rag = g.ragazze;
    const parla = png.parla.bind(png);
    png.parla = async id => {
      const def = PNG[id], righe = this._righe(id);
      if (!righe || !def) return parla(id);
      const orig = def.saluti;
      def.saluti = righe;
      try { return await parla(id); } finally { def.saluti = orig; }
    };
    if (rag) {
      const parlaR = rag._parla.bind(rag);
      rag._parla = async id => {
        const R = RAGAZZE[id], extra = RAGAZZE_AZIENDA[id];
        if (!R || !extra || !this._azienda() || Math.random() > 0.45) return parlaR(id);
        const orig = R.saluti; R.saluti = extra.saluti;
        try { return await parlaR(id); } finally { R.saluti = orig; }
      };
      const risp = rag._risposta.bind(rag);
      rag._risposta = (id, v, testo, conto) => {
        const out = risp(id, v, testo, conto), extra = RAGAZZE_AZIENDA[id];
        if (extra && v >= 0 && this._azienda()) { g.png.cambiaAmicizia(id, extra.bonus); setTimeout(() => g.ui.float(`🏡 +${extra.bonus} (l'azienda fa colpo)`), 500); }
        return out;
      };
    }
  }

  // i saluti da usare stavolta (null = quelli soliti)
  _righe(id) {
    if (!this._azienda()) return null;
    if (AGRICOLTORI[id]) return Math.random() < PROB_PARI ? AGRICOLTORI[id] : null;
    if (COMMENTI[id]) return Math.random() < PROB_COMMENTO ? COMMENTI[id] : null;
    return null;
  }
}
