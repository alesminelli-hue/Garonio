// Collega i testi di src/data/ (dialoghi e missioni) al formato dei dialoghi dell'interfaccia.
import { NOMI, ASPETTO, BAR } from './data/dialoghi.js';
import { CHARACTERS } from './pixel.js';

// i personaggi del bar hanno il loro ritratto
for (const [k, v] of Object.entries(ASPETTO)) if (!CHARACTERS[k]) CHARACTERS[k] = v;

const NOMI_AVVENTORI = Object.fromEntries(BAR.avventori.map(a => [a.id, a.nome]));

export const pick = arr => Array.isArray(arr) ? arr[Math.floor(Math.random() * arr.length)] : arr;

// sostituisce {n}, {ora}, ... con i valori
export function fill(text, vars = {}) {
  return String(text).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
}

export function nome(chi) { return NOMI[chi] || NOMI_AVVENTORI[chi] || ''; }

// { chi, testo } -> { who, name, text } usato da ui.dialog
export function pagina(p, vars) {
  const out = { text: fill(pick(p.testo), vars) };
  if (p.chi) { out.who = CHARACTERS[p.chi] ? p.chi : undefined; out.name = p.nome || nome(p.chi); }
  if (p.choices) out.choices = p.choices;
  return out;
}

export const pagine = (list, vars) => list.map(p => pagina(p, vars));

export const ora = h => `${String(Math.floor(h)).padStart(2, '0')}:00`;

// variabili per i testi di una missione in corso
export function variabiliMissione(m) {
  return { n: m.n, ora: ora(m.deadline / 60), missione: m.text.charAt(0).toLowerCase() + m.text.slice(1), fatto: Math.min(m.progress || 0, m.n) };
}
