// =====================================================================
//  NEMICI LEGATI AL LIVELLO (GDD capitoli 11.2 e 18.4)
//  id = chiave in ENEMIES di src/combat.js (i nemici "nuovi" vanno aggiunti lì con sprite e mosse).
//  min = livello minimo per comparire negli incontri casuali, cons = livello consigliato.
//  zone = dove compaiono, quando = momento del giorno, gruppo = [min, max] della grandezza.
//  lv = [da, a]: livelli che può avere la bestia. Ogni nemico nasce con un suo livello (vicino a quello
//       di Garonio, dentro questo intervallo) e le statistiche crescono con lui: vedi scalaNemico().
// =====================================================================
export const NEMICI = {
  nutria:          { nome: 'Nutria',            min: 1,  cons: 1,  zone: ['campi', 'canale'], quando: 'giorno', gruppo: [1, 3], lv: [1, 14] },
  ratto:           { nome: 'Ratto',             min: 1,  cons: 2,  zone: ['capannoni', 'silos', 'cantina'], quando: 'notte', gruppo: [2, 4], nuovo: true, lv: [1, 12] },
  ubriaco:         { nome: 'Cliente ubriaco',   min: 1,  cons: 2,  zone: ['bar'] },
  volpe:           { nome: 'Volpe',             min: 2,  cons: 3,  zone: ['pollaio'], quando: 'sera', gruppo: [1, 2], lv: [2, 16] },
  bullo:           { nome: 'Bullo del paese',   min: 3,  cons: 4,  zone: ['bar'] },
  nutria_gigante:  { nome: 'Mamma Nutria',      min: 4,  cons: 5,  zone: ['campi', 'canale'], quando: 'giorno', gruppo: [1, 1], lv: [4, 20] },
  ratto_fogna:     { nome: 'Ratto di fogna gigante', min: 5, cons: 6, zone: ['capannoni', 'silos'], quando: 'notte', gruppo: [1, 1], nuovo: true, lv: [5, 22] },
  re_ratti:        { nome: 'Re dei Ratti',      min: 8,  cons: 10,  zone: ['tana_ratti'], boss: true, nuovo: true },
  gazza:           { nome: 'Gazza ladra',       min: 6,  cons: 7,  zone: ['ovunque'], quando: 'giorno', gruppo: [1, 1], nuovo: true, lv: [6, 22] },
  piccione:        { nome: 'Piccione',          min: 1,  cons: 1,  zone: ['silos', 'paese'], quando: 'giorno', gruppo: [2, 5], nuovo: true, lv: [1, 10] },
  ermes:           { nome: 'Cugino Ermes',      min: 7,  cons: 8,  zone: ['bar'], nuovo: true },
  cinghiale:       { nome: 'Cinghiale',         min: 8,  cons: 10, zone: ['bosco', 'campi'], quando: 'sempre', gruppo: [1, 2], lv: [8, 26] },
  nutria_corazzata:{ nome: 'Nutria corazzata',  min: 9,  cons: 11, zone: ['canale'], quando: 'giorno', gruppo: [1, 2], nuovo: true, lv: [9, 28] },
  lupo_giovane:    { nome: 'Lupo giovane',      min: 10, cons: 12, zone: ['bosco'], quando: 'notte', gruppo: [2, 3], nuovo: true, lv: [10, 28] },
  re_nutrie:       { nome: 'Re delle Nutrie',   min: 14, cons: 16, zone: ['tana_nutrie'], boss: true, nuovo: true },
  bruno:           { nome: 'Bruno «il Toro»',   min: 12, cons: 13, zone: ['bar'], nuovo: true },
  cinghiale_maschio:{ nome: 'Cinghiale maschio', min: 13, cons: 15, zone: ['bosco'], quando: 'sempre', gruppo: [1, 1], nuovo: true, lv: [13, 32] },
  lupo:            { nome: 'Lupo',              min: 14, cons: 16, zone: ['bosco'], quando: 'notte', gruppo: [1, 3], nuovo: true, lv: [14, 33] },
  rocco:           { nome: 'Rocco il camionista', min: 15, cons: 17, zone: ['bar'], nuovo: true },
  re_lupi:         { nome: 'Re dei Lupi',       min: 20, cons: 22, zone: ['radura'], boss: true, nuovo: true },
};

// Un nemico può comparire in un incontro casuale a questo livello?
export const puoComparire = (id, level) => !NEMICI[id] || (!NEMICI[id].boss && level >= NEMICI[id].min);

// Nemici disponibili in una zona, a questo livello (mai più di 3 livelli sopra Garonio, solo quelli già nel gioco)
export function nemiciDisponibili(zona, level, { soloPresenti = true, ENEMIES = null } = {}) {
  return Object.entries(NEMICI)
    .filter(([id, n]) => !n.boss && (n.zone.includes(zona) || n.zone.includes('ovunque')) && level >= n.min && n.min <= level + 3)
    .filter(([id]) => !soloPresenti || !ENEMIES || ENEMIES[id])
    .map(([id]) => id);
}

// =====================================================================
//  LIVELLI DEI NEMICI E DIFFICOLTÀ
//  Le statistiche scritte in ENEMIES valgono al livello "cons". A un livello diverso crescono
//  (o calano) seguendo la crescita di Garonio, così un nemico del suo livello resta sempre una minaccia.
// =====================================================================
export const DIFFICOLTA = {
  hp: 1.6,              // tutti i nemici hanno più Vita di prima...
  atk: 1.5,             // ...e picchiano più forte
  varia: [-2, 3],       // livello del nemico = livello di Garonio + un numero a caso in questo intervallo
  feroce: 0.12,         // probabilità che un nemico nasca «Feroce» (+3 livelli, più bottino)...
  feroceEndgame: 0.22,  // ...che sale al livello massimo
  feroceLv: 3, feroceHp: 1.35, feroceAtk: 1.15,
};

// curve di riferimento: quanto cresce un nemico "medio" a ogni livello (tarate sulla crescita di Garonio)
export const refHp = L => 13.5 + 2.6 * L;
export const refAtk = L => 7.6 + 1.25 * L;

// livello di un nemico che compare adesso (Garonio al livello "level")
export function livelloNemico(id, level, { feroce = false } = {}) {
  const n = NEMICI[id];
  if (!n) return level;
  if (n.boss || !n.lv) return n.cons;          // boss e nemici del bar: livello fisso
  const [a, b] = DIFFICOLTA.varia;
  const L = Math.round(level + a + Math.random() * (b - a));
  return Math.max(n.lv[0], Math.min(n.lv[1], L)) + (feroce ? DIFFICOLTA.feroceLv : 0);
}

// statistiche del nemico "d" (voce di ENEMIES) al livello L. base = livello a cui valgono i numeri di d.
export function scalaNemico(d, L, base, { feroce = false, difficolta = true } = {}) {
  const kH = refHp(L) / refHp(base), kA = refAtk(L) / refAtk(base), dl = L - base;
  const mH = (difficolta ? DIFFICOLTA.hp : 1) * (feroce ? DIFFICOLTA.feroceHp : 1);
  const mA = (difficolta ? DIFFICOLTA.atk : 1) * (feroce ? DIFFICOLTA.feroceAtk : 1);
  const premio = Math.max(0.3, 1 + 0.18 * dl) * (feroce ? 1.6 : 1);
  return {
    hp: Math.max(4, Math.round(d.hp * kH * mH)),
    atk: Math.max(2, Math.round(d.atk * kA * mA)),
    def: Math.max(0, Math.round(d.def + 0.5 * dl)),
    spd: Math.max(1, d.spd + 0.1 * dl),
    xp: Math.max(1, Math.round(d.xp * premio)),
    money: Math.round((d.money || 0) * premio),
  };
}

// Boss: statistiche ricavate dal livello (Garonio di pari livello ci mette 8-12 turni e deve curarsi).
// mul = { hp, atk, def, spd } dell'archetipo (un culturista ha più Vita, un ladro più velocità...)
export function statBoss(L, mul = {}) {
  const hp = 14 * (13 + 2.5 * L) * Math.min(1, 0.75 + 0.02 * L) * (L >= 20 ? 0.9 : 1) * (mul.hp || 1);   // i primi boss un po' più corti
  const atk = ((95 + 5 * L) / 6 + 0.5 + 0.7 * L) / 1.4 * (mul.atk || 1);
  return {
    hp: Math.round(hp), atk: Math.round(atk),
    def: Math.round((2 + 0.8 * L) * (mul.def || 1)),
    spd: Math.round((6 + 0.25 * L) * (mul.spd || 1)),
    xp: Math.round(30 * L * (mul.xp || 1)), money: 0,
  };
}
