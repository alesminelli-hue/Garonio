// =====================================================================
//  NEMICI LEGATI AL LIVELLO (GDD capitoli 11.2 e 18.4)
//  id = chiave in ENEMIES di src/combat.js (i nemici "nuovi" vanno aggiunti lì con sprite e mosse).
//  min = livello minimo per comparire negli incontri casuali, cons = livello consigliato.
//  zone = dove compaiono, quando = momento del giorno, gruppo = [min, max] della grandezza.
// =====================================================================

export const NEMICI = {
  nutria:          { nome: 'Nutria',            min: 1,  cons: 1,  zone: ['campi', 'canale'], quando: 'giorno', gruppo: [1, 3] },
  ratto:           { nome: 'Ratto',             min: 1,  cons: 2,  zone: ['capannoni', 'silos', 'cantina'], quando: 'notte', gruppo: [2, 4], nuovo: true },
  ubriaco:         { nome: 'Cliente ubriaco',   min: 1,  cons: 2,  zone: ['bar'] },
  volpe:           { nome: 'Volpe',             min: 2,  cons: 3,  zone: ['pollaio'], quando: 'sera', gruppo: [1, 2] },
  bullo:           { nome: 'Bullo del paese',   min: 3,  cons: 4,  zone: ['bar'] },
  nutria_gigante:  { nome: 'Mamma Nutria',      min: 4,  cons: 5,  zone: ['campi', 'canale'], quando: 'giorno', gruppo: [1, 1] },
  ratto_fogna:     { nome: 'Ratto di fogna gigante', min: 5, cons: 6, zone: ['capannoni', 'silos'], quando: 'notte', gruppo: [1, 1], nuovo: true },
  re_ratti:        { nome: 'Re dei Ratti',      min: 6,  cons: 8,  zone: ['tana_ratti'], boss: true, nuovo: true },
  gazza:           { nome: 'Gazza ladra',       min: 6,  cons: 7,  zone: ['ovunque'], quando: 'giorno', gruppo: [1, 1], nuovo: true },
  piccione:        { nome: 'Piccione',          min: 1,  cons: 1,  zone: ['silos', 'paese'], quando: 'giorno', gruppo: [2, 5], nuovo: true },
  ermes:           { nome: 'Cugino Ermes',      min: 7,  cons: 8,  zone: ['bar'], nuovo: true },
  cinghiale:       { nome: 'Cinghiale',         min: 8,  cons: 10, zone: ['bosco', 'campi'], quando: 'sempre', gruppo: [1, 2] },
  nutria_corazzata:{ nome: 'Nutria corazzata',  min: 9,  cons: 11, zone: ['canale'], quando: 'giorno', gruppo: [1, 2], nuovo: true },
  lupo_giovane:    { nome: 'Lupo giovane',      min: 10, cons: 12, zone: ['bosco'], quando: 'notte', gruppo: [2, 3], nuovo: true },
  re_nutrie:       { nome: 'Re delle Nutrie',   min: 11, cons: 13, zone: ['tana_nutrie'], boss: true, nuovo: true },
  bruno:           { nome: 'Bruno «il Toro»',   min: 12, cons: 13, zone: ['bar'], nuovo: true },
  cinghiale_maschio:{ nome: 'Cinghiale maschio', min: 13, cons: 15, zone: ['bosco'], quando: 'sempre', gruppo: [1, 1], nuovo: true },
  lupo:            { nome: 'Lupo',              min: 14, cons: 16, zone: ['bosco'], quando: 'notte', gruppo: [1, 3], nuovo: true },
  rocco:           { nome: 'Rocco il camionista', min: 15, cons: 17, zone: ['bar'], nuovo: true },
  re_lupi:         { nome: 'Re dei Lupi',       min: 17, cons: 19, zone: ['radura'], boss: true, nuovo: true },
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
