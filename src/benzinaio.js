// Fuel l'Havana: il benzinaio sulla provinciale, a est del Consorzio (mappa: src/map.js, edificio «benzinaio»).
// Pensilina turchese con le colonnine (sprite HD, src/hd/benzinaio.js), chiosco con la cassa e Pepe il benzinaio
// (PNG «pepe», sprite HD disegnato via codice), aperto dalle 6 alle 22.
//  - Da Pepe: taniche di gasolio da tenere nello zaino (ognuna mette 50% nel serbatoio di un trattore),
//    taniche di benzina (per la motosega), il pieno ai mezzi parcheggiati sul piazzale.
//  - Arrivando col trattore o con la Punto sotto la pensilina: E = pieno al volo.
// Le taniche si versano dal menu J › Zaino («Usa», vicino al trattore o guidandolo), dal menu rapido del
// trattore (R / 🔧) e quando il trattore resta a secco (E).
// Stato: nessuno (i soldi in s.money, le taniche in s.inv.tanica).
import * as PIX from './pixel.js';
import * as HDB from './hd/benzinaio.js';
import { PNG } from './data/png.js';
import { pick } from './racconto.js';

export const FUEL = {
  pompa: { x: 106, z: 59.6 },          // centro della pensilina (base dello sprite)
  orari: [6, 22],
  tanica: 15,                          // € una tanica di gasolio (+50% al serbatoio di un trattore)
  benzina: 12,                         // € una tanica di benzina (motosega)
  pienoTrattore: 14,                   // € il pieno di gasolio a un trattore
  pienoPunto: 12,                      // € il pieno di benzina alla Punto
  minuti: 10,
  testi: {
    chiuso: "La pensilina è spenta. Sul vetro del chiosco: «Pepe sta dormendo. Torna alle 6. Hasta mañana.»",
    pieno: ["Pepe infila la pistola nel serbatoio fischiettando un mambo. «Listo, amigo. Il trattore ringrazia.»",
      "«Gasolio della Bassa, raffinato all'Avana.» Non è vero, ma il trattore parte con un rombo felice.",
      "Pepe fa il pieno e ti pulisce pure il vetro con la manica. «Servizio completo. La mancia è facoltativa. Più o meno.»"],
    tanica: ["«Tieni la tanica nello zaino, amigo. Quando il trattore tossisce, glu glu glu e riparti.»",
      "Pepe ti passa la tanica come fosse un sigaro pregiato. «Venti litri di felicità. Non berla.»"],
    vuoto: "Qui non c'è niente da riempire, amigo. Porta un trattore o la Punto sotto la pensilina.",
  },
};

// Pepe il benzinaio: sprite HD registrato a mano (non è nell'atlante dei personaggi)
PIX.registraSprite('pepe', HDB.pepe(0), 1.02);
PNG.pepe ??= {
  nome: "Pepe di Fuel l'Havana", ruolo: "Il benzinaio sulla provinciale: taniche di gasolio, benzina e il pieno ai mezzi.",
  posti: [{ ore: FUEL.orari, x: 109.6, z: 61.0 }],
  aspetto: { sprite: 'pepe', w: 17, h: 24, skin: '#d89a6a', hair: '#3a2418', shirt: '#2aa8a0', pants: '#c8b48a', boots: '#f4f0e4', mustache: '#3a2418' },
  amicizia: [-30, 50, 5],
  saluti: [
    "¡Hola, amigo! Benvenuto a Fuel l'Havana. Gasolio caraibico, prezzi della Bassa.",
    "Garonio! Il trattore ha sete? Anche io, ma io bevo rum. Lui gasolio.",
    "Pieno, taniche, sigari no: il sigaro è mio. Cosa ti serve?",
    "Ah, il figlio del Gigante. Tuo padre paga sempre in pannocchie. Tu paga in euro, por favor.",
  ],
  chiacchiere: [
    "Sono nato a Codogno, ma il cuore è all'Avana. Ci sono stato una volta, in crociera. Tre ore. Bastano.",
    "Il segreto del mio gasolio? Lo saluto ogni mattina. In spagnolo.",
    "Tieni sempre una tanica nello zaino. Il trattore finisce il gasolio solo quando sei lontano da casa. È scienza.",
    "Zeno dice che il mio gasolio è annacquato. Io dico che le sue riparazioni sono incollate. Siamo amici.",
    "La palma sulla pensilina è di plastica. Le nutrie hanno provato a mangiarla lo stesso.",
    "Di notte chiudo. Il distributore automatico c'è, ma accetta solo dobloni.",
  ],
};

export class Benzinaio {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }

  init() {
    const g = this.game, W = g.world, P = FUEL.pompa;
    // la pensilina con le colonnine (96x72 px = 6 x 4.5 caselle)
    const spr = W.sprite(HDB.distributore(), { w: 6, h: 4.5 });
    spr.position.set(P.x, 0, P.z); W.scene.add(spr);
    W.solids.push({ x0: P.x - 1.9, z0: P.z - 0.35, x1: P.x + 1.9, z1: P.z + 0.1 });   // isola delle colonnine
    g.png.aggiungiScelte('pepe', () => this.scelte());
  }

  aperto() { const h = this.s.minutes / 60 % 24; return h >= FUEL.orari[0] && h < FUEL.orari[1]; }

  // mezzi da rifornire sotto la pensilina
  _mezziQui() {
    const P = FUEL.pompa, A = this.game.attrezzi;
    return (this.game.vehicles?.list || []).filter(v => Math.hypot(v.st.x - P.x, v.st.z - (P.z + 1)) < 4.5 &&
      ((v.kind === 'trattore' && (A?.gasolio(v.id) ?? 100) < 95) || (v.kind === 'punto' && v.st.fuel < 95)));
  }
  _prezzo(v) { return v.kind === 'trattore' ? FUEL.pienoTrattore : FUEL.pienoPunto; }
  _riempi(v) {
    if (v.kind === 'trattore') this.game.attrezzi.st.gasolio[v.id] = 100;
    else v.st.fuel = 100;
  }

  // bersaglio quando si guida sotto la pensilina (lo chiama vehicles.target)
  bersaglioGuida(v) {
    if (!['trattore', 'punto'].includes(v.kind)) return null;
    const P = FUEL.pompa;
    if (Math.hypot(v.st.x - P.x, v.st.z - (P.z + 1)) > 4.5) return null;
    const pieno = v.kind === 'trattore' ? (this.game.attrezzi?.gasolio(v.id) ?? 100) >= 95 : v.st.fuel >= 95;
    if (pieno) return null;
    if (!this.aperto()) return { label: "⛽ Fuel l'Havana: chiuso (apre alle 6)", fn: () => this.game.ui.dialog([{ name: "Fuel l'Havana", text: FUEL.testi.chiuso }]) };
    const p = this._prezzo(v);
    return { label: `⛽ Pieno da Fuel l'Havana (${p}€)`, fn: () => this._pieno(v) };
  }

  _pieno(v) {
    const g = this.game, s = this.s, p = this._prezzo(v);
    if (s.money < p) { g.ui.toast(`Il pieno costa ${p}€: non ce li hai. Pepe ti guarda il portafoglio con pietà.`, 'bad'); return; }
    s.money -= p; s.minutes += FUEL.minuti; this._riempi(v);
    g.audio.sfx('coin');
    g.ui.toast(`⛽ Pieno fatto: −${p}€`, 'good');
    return g.ui.dialog([{ who: 'pepe', name: PNG.pepe.nome, text: pick(FUEL.testi.pieno) }]);
  }

  scelte() {
    const g = this.game, s = this.s, F = FUEL;
    const nome = PNG.pepe.nome, n = s.inv.tanica || 0;
    const dice = t => [{ who: 'pepe', name: nome, text: t }];
    const compra = (id, k, prezzo) => () => {
      s.money -= prezzo * k; g.prog.dai(id, k); g.audio.sfx('coin');
      return dice(`${pick(F.testi.tanica)} (−${prezzo * k}€)`);
    };
    const out = [
      { label: `🛢️ Tanica di gasolio (${F.tanica}€) · ne hai ${n}`, disabled: s.money < F.tanica, fn: compra('tanica', 1, F.tanica) },
      { label: `🛢️ Tre taniche di gasolio (${F.tanica * 3}€)`, disabled: s.money < F.tanica * 3, fn: compra('tanica', 3, F.tanica) },
      { label: `⛽ Tanica di benzina per la motosega (${F.benzina}€)`, disabled: s.money < F.benzina, fn: compra('benzina', 1, F.benzina) },
    ];
    const mezzi = this._mezziQui();
    if (mezzi.length) {
      const tot = mezzi.reduce((a, v) => a + this._prezzo(v), 0);
      out.push({ label: `⛽ Pieno ai mezzi sotto la pensilina (${tot}€)`, disabled: s.money < tot, fn: () => {
        s.money -= tot; s.minutes += F.minuti; mezzi.forEach(v => this._riempi(v)); g.audio.sfx('coin');
        return dice(pick(F.testi.pieno));
      } });
    }
    return out;
  }
}
