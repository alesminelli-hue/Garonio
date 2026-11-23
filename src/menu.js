// Menu di Garonio (tasto J o pulsante 📓): scheda, abilità, arma ed equipaggiamento, zaino, diario delle missioni.
// Usa i normali dialoghi dell'interfaccia (ui.dialog), così funziona uguale su PC e telefono.
import { RAMI, GRADI_LIVELLO, LIVELLI } from './data/progressione.js';
import { ARMI, VESTITI, OGGETTI, SLOT, NOMI_SLOT } from './data/armi.js';
import { PNG } from './data/png.js';

const pallini = (g, max = 4) => '●'.repeat(g) + '○'.repeat(max - g);

export class Menu {
  constructor(game) { this.game = game; }
  get s() { return this.game.s; }
  get prog() { return this.game.prog; }

  async apri() {
    const g = this.game;
    if (g.ui.busy() || g.locked || g.combat?.active) return;
    await g.ui.dialog([this._home()]);
  }

  _page(text, choices) { return { who: 'garonio', name: 'Garonio', text, choices }; }

  _home() {
    const s = this.s, p = this.prog;
    const xp = s.level >= LIVELLI.max ? 'livello massimo' : `esperienza ${Math.floor(s.xp)}/${p.xpNext()}`;
    const text = `Livello ${s.level} · «${p.titolo()}» · ${xp}\n` +
      `Attacco ${p.atk()} · Difesa ${p.def()} · Vita ${Math.round(s.health)}/${s.maxHealth} · Arma: ${p.arma().nome}` +
      (s.prog.punti ? `\nHai ${s.prog.punti} punt${s.prog.punti === 1 ? 'o' : 'i'} abilità da spendere!` : '');
    const attive = this.game.quests.attive().length;
    return this._page(text, [
      { label: `Abilità${s.prog.punti ? ` (${s.prog.punti} da spendere)` : ''}`, fn: () => [this._abilita()] },
      { label: 'Arma ed equipaggiamento', fn: () => [this._equip()] },
      { label: 'Zaino', fn: () => [this._zaino()] },
      { label: `Diario delle missioni${attive ? ` (${attive})` : ''}`, fn: () => [this._diario()] },
      { label: 'Chiudi', fn: null },
    ]);
  }

  _abilita(msg) {
    const s = this.s, p = this.prog;
    const choices = Object.entries(RAMI).map(([id, r]) => {
      const gr = p.grado(id);
      const next = r.gradi[gr];
      const req = gr < 4 ? GRADI_LIVELLO[gr] : null;
      const lab = gr >= 4 ? `${r.nome} ${pallini(gr)} completo`
        : `${r.nome} ${pallini(gr)} → ${next.desc}${s.level < req ? ` (Lv ${req})` : ''}`;
      return { label: lab, disabled: !p.puoiAlzare(id), fn: () => {
        p.alza(id); this.game.audio.sfx('level');
        return [this._abilita(`${r.nome} grado ${gr + 1}: ${next.desc}.`)];
      } };
    });
    choices.push({ label: 'Indietro', fn: () => [this._home()] });
    return this._page(msg || `Punti abilità: ${s.prog.punti}. Un punto a ogni livello; i gradi più alti chiedono livello 5, 10 e 15.`, choices);
  }

  _equip(msg) {
    const p = this.prog, s = this.s;
    const choices = [{ label: `Arma: ${p.arma().nome} (attacco +${p.arma().atk})`, fn: () => [this._scegliArma()] }];
    for (const slot of SLOT) {
      const id = p.indossato(slot), v = VESTITI[id];
      const n = s.prog.vestiti.filter(x => VESTITI[x]?.slot === slot).length;
      choices.push({ label: `${NOMI_SLOT[slot]}: ${v ? `${v.nome} (${v.desc})` : '—'}`, disabled: !n, fn: () => [this._scegliVestito(slot)] });
    }
    choices.push({ label: 'Indietro', fn: () => [this._home()] });
    return this._page(msg || 'Cosa vuoi cambiare? Armi e vestiti si comprano dal Bubetto o si guadagnano con le missioni.', choices);
  }

  _scegliArma() {
    const p = this.prog;
    const choices = this.s.prog.armi.map(id => ({
      label: `${ARMI[id].nome} · attacco +${ARMI[id].atk}${p.arma().id === id ? ' ✔' : ''}`,
      fn: () => { p.impugna(id); return [this._equip(`Garonio impugna: ${ARMI[id].nome}.`)]; },
    }));
    choices.push({ label: 'Indietro', fn: () => [this._equip()] });
    return this._page('Quale arma impugni?', choices);
  }

  _scegliVestito(slot) {
    const p = this.prog;
    const choices = this.s.prog.vestiti.filter(id => VESTITI[id]?.slot === slot).map(id => ({
      label: `${VESTITI[id].nome}: ${VESTITI[id].desc}${p.indossato(slot) === id ? ' ✔' : ''}`,
      fn: () => { p.indossa(id); return [this._equip(`Garonio indossa: ${VESTITI[id].nome}.`)]; },
    }));
    if (p.indossato(slot)) choices.push({ label: 'Togli', fn: () => { p.togli(slot); return [this._equip()]; } });
    choices.push({ label: 'Indietro', fn: () => [this._equip()] });
    return this._page(`${NOMI_SLOT[slot]}: cosa indossi?`, choices);
  }

  _zaino(msg) {
    const s = this.s;
    const items = Object.entries(s.inv).filter(([id, n]) => n > 0 && OGGETTI[id]);
    const choices = items.map(([id, n]) => {
      const o = OGGETTI[id], usabile = !!o.effetto?.health || !!o.effetto?.tired || !!o.effetto?.stress;
      return { label: `${o.icona || ''} ${o.nome} ×${n}${usabile ? ' · usa' : ''}`, disabled: !usabile, fn: () => {
        this.prog.usa(id); this.game.audio.sfx('eat');
        return [this._zaino(`Garonio usa: ${o.nome}.`)];
      } };
    });
    choices.push({ label: 'Indietro', fn: () => [this._home()] });
    return this._page(msg || (items.length ? 'Nello zaino:' : 'Lo zaino è vuoto. C\'è solo una caramella del 2014, incollata al fondo.'), choices);
  }

  _diario() {
    const s = this.s, m = s.mission;
    const righe = [];
    if (m) righe.push(`Il Gigante: ${m.text} (${m.done ? 'fatta' : m.failed ? 'fallita' : `${Math.min(m.progress, m.n)}/${m.n}`})`);
    for (const q of this.game.quests.attive()) {
      const chi = PNG[q.def.obiettivo.a || q.def.da]?.nome || q.def.da;
      const st = q.stato === 'pronta' ? `fatto, torna da ${PNG[q.def.da]?.nome}` : q.def.obiettivo.consegna ? `${q.progresso}/${q.n}, da portare a ${chi}` : `${q.progresso}/${q.n}`;
      righe.push(`${q.def.truffaldina ? '🤫 ' : ''}${q.def.titolo}: ${st}`);
    }
    const fatte = s.quests.fatte.length;
    return this._page((righe.length ? righe.join('\n') : 'Nessuna missione in corso. Parla con la gente in giro: chi ha un ❗ ha un lavoretto per te.') +
      (fatte ? `\nMissioni secondarie completate: ${fatte}` : ''), [{ label: 'Indietro', fn: () => [this._home()] }]);
  }
}
