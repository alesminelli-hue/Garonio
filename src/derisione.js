// Derisione: quando Garonio rompe un mezzo e qualcuno lo vede, quello ride e la voce gira.
// Ascolta l'evento 'mezzoRotto' (src/vehicles.js). Guarda chi c'è nel raggio di vista:
// paesani a spasso (src/vita.js), personaggi del paese (src/png.js), vicini e garzoni delle cascine (src/cascine.js).
// Ogni testimone fa una battuta (fumetto + avviso), la reputazione in paese scende e lo stress sale.
// Manda: derisione { chi, mezzo, reputazione }
// Valori e battute qui sotto, facili da ritoccare.

export const DERISIONE = {
  raggio: 10,            // fin dove ti vedono (caselle)
  reputazione: 3,        // reputazione persa per ogni testimone...
  max: 9,                // ...ma non più di così per un singolo guasto
  stress: 3,             // stress per ogni testimone (massimo 3 testimoni)
  battute: {
    trattore: [
      'Ahahah! Garonio ha rotto anche il trattore! Tuo padre ti appende al fienile!',
      'Guarda che fumo! Sembra la sagra della polenta!',
      'Il trattore è più furbo di te: si è fermato da solo.',
      'Lo racconto al bar, eh. Anzi, lo racconto a tutti.',
    ],
    vespa: [
      'Ahah, la Vespa ti ha mollato! Come la morosa!',
      'Spingila, campione! Spingi!',
      'Quella Vespa ha più anni di te e più giudizio.',
    ],
    punto: [
      'La Punto è morta! Chiamate il prete!',
      'Bella guida, pilota! Domani provi col monopattino?',
      'Ahahah! Fumo bianco: hanno eletto il Papa!',
    ],
  },
  commento: 'Domani lo sa tutto il paese.',
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const pick = a => a[Math.floor(Math.random() * a.length)];

export class Derisione {
  constructor(game) {
    this.game = game;
    game.on('mezzoRotto', d => this._rotto(d));
  }

  // chi vede il punto (x, z): [{ nome, x, z, gira(dir) }]
  testimoni(x, z, r = DERISIONE.raggio) {
    const g = this.game, out = [];
    const vicino = (px, pz) => Math.hypot(px - x, pz - z) < r;
    for (const p of g.vita?.paesani || []) if (p.visibile && vicino(p.x, p.z)) out.push({ nome: p.def.nome, x: p.x, z: p.z, o: p });
    for (const n of g.png?.list || []) if (n.visible && !n.posto?.interno && vicino(n.x, n.z)) out.push({ nome: n.def.nome, x: n.x, z: n.z, o: n });
    for (const gu of g.cascine?.guardie || []) {
      if (!gu.attivo || gu.dorme || !(gu.tipo === 'garzone' || gu.tipo === 'vicino')) continue;
      if (vicino(gu.x, gu.z)) out.push({ nome: (gu.def?.nome || 'Un vicino').split(',')[0], x: gu.x, z: gu.z, o: gu });
    }
    // lo stesso personaggio può comparire in due elenchi (il vicino delle cascine è anche un png)
    const visti = new Set();
    return out.filter(t => !visti.has(t.nome) && visti.add(t.nome));
  }

  _rotto({ mezzo, tipo, x, z }) {
    const g = this.game, s = g.s;
    if (g.interni?.attivo) return;
    const ts = this.testimoni(x, z);
    if (!ts.length) return;
    const persa = Math.min(DERISIONE.max, ts.length * DERISIONE.reputazione);
    const rep = g.paradiso?.cambiaReputazione?.(-persa);
    s.stress = clamp(s.stress + DERISIONE.stress * Math.min(3, ts.length), 0, 100);
    // tutti si girano a guardare e ridono
    for (const t of ts) if (t.o && 'dir' in t.o) t.o.dir = x > t.x ? 1 : -1;
    const primo = ts[0], battute = DERISIONE.battute[tipo] || DERISIONE.battute.trattore;
    const altri = ts.length > 1 ? ` (e ridono in ${ts.length})` : '';
    setTimeout(() => {
      g.audio?.sfx?.('bad');
      g.ui.toast(`${primo.nome}: «${pick(battute)}»${altri}`, 'bad');
      g.ui.toast(`Reputazione in paese −${persa} · Stress +${DERISIONE.stress * Math.min(3, ts.length)}. ${DERISIONE.commento}`, 'bad');
    }, 700);
    g.emit('derisione', { chi: ts.map(t => t.nome), mezzo, reputazione: rep });
  }
}
