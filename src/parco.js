// Parco Oglio (GDD capitolo 26): il bosco e il fiume in fondo alla mappa.
//  - MOSTRI DELLA NOTTE: dalle 20 a mezzanotte nel parco girano gruppi di mostri (fantasmi, scheletri, alieni,
//    pagliacci, mummie, streghe, maghi, vampiri, lupi mannari, diavoletti) di livelli molto diversi. Usano il
//    sistema dei gruppi sulla mappa (src/spawn.js, zona 'parco'). Bottino proprio, qualche pezzo raro.
//  - COPPIETTE: certe sere (19-24) una coppia del paese si sbaciucchia nel bosco (cuoricino sulla minimappa).
//    «👀 Spia la coppietta»: se non ti beccano, una Foto sfocata; se ti beccano, li combatti tutti e due.
//  - GUARDIE DEL PARCO: due guardie (livello 30) fanno il giro dei sentieri; il capo è Boss MM, al casotto.
//    Se ti vedono fare un danno nel parco, tocca combatterle. Di notte vedono meno.
//  - IL VECCHIO CAMPER: nella cascina accanto al parco. Dà sei «lavoretti» in fila: tagliare alberi del parco,
//    svitare i cartelli, rubare le uova dell'anatra protetta, pescare di frodo, rubare la carriola delle guardie
//    e infine il cappello di Boss MM (boss livello 32, src/data/boss.js → BOSS.bossmm). Paga benissimo.
// Dati e testi: src/data/parco.js. Personaggi: src/data/png.js (camper, bossmm, guardia1, guardia2).
//
// API (game.parco):
//   danno(tipo, i)     fa un danno nel parco (tipo di DANNI) sul bersaglio i: rischia le guardie
//   coppietta(x, z)    fa comparire una coppietta (senza x,z: nel bosco)
//   guardie(x, z)      la guardia più vicina che vede quel punto, o null
// Eventi: emette  sabotaggio { tipo }, coppietta { esito }, guardie { esito }
// Stato: s.flags.parco = { tagliati: { i: giorno }, presi: { 'tipo:i': giorno }, carriola, coppia, cappelli, multe }
import * as PIX from './pixel.js';
import { ENEMIES } from './combat.js';
import { NEMICI, refHp, refAtk } from './data/nemici.js';
import { ZONE, GRUPPI } from './data/bestie.js';
import { BOTTINO, BOSS } from './data/boss.js';
import { ATLANTE } from './data/sprite_personaggi.js';
import { ARMI, VESTITI, OGGETTI } from './data/armi.js';
import { PARCO } from './map.js';
import { MOSTRI, BOTTINO_MOSTRI, COPPIE, COPPIETTE as CP, GUARDIE as GU, BOSS_MM, DANNI, OGGETTI_DANNO, CAMPER, PARCO_TESTI as T } from './data/parco.js';
import { cartelloParco, carriola, ceppo, nidoAnatra, cuore, galleggiante } from './sprite_parco.js';
import { pagina, pagine, pick, fill } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const dentroParco = (x, z) => x >= PARCO.x0 && x <= PARCO.x1 && z >= PARCO.z0 && z <= PARCO.z1;

// aspetto di un personaggio del foglio (sprite del foglio personaggi) e le sue misure sulla mappa
const umano = (sprite, extra = {}) => ({ sprite, w: 16, h: 24, skin: '#e8b48a', hair: '#2a1a10', hairStyle: 'flat', shirt: '#4a4a52', pants: '#2a2a32', boots: '#111', eyes: 'angry', ...extra });
const nemicoFrames = o => () => [0, 1, 2].map(f => PIX.mirror(PIX.humanoid(o, f)));     // rivolti a sinistra
function misure(sprite) {
  const a = ATLANTE[sprite]; if (!a) return { w: 1.3, h: 1.9 };
  const h = 24 * a[4] / 16 * 1.25;
  return { w: h * a[2] / (a[3] + 1), h };
}

// ---------- I nemici del parco entrano nel combattimento ----------
for (const [id, m] of Object.entries(MOSTRI)) {
  const key = 'mostro_' + id, cons = Math.round((m.lv[0] + m.lv[1]) / 2);
  ENEMIES[key] = {
    name: m.nome, hp: Math.round(refHp(cons) * 2.0 * m.k[0]), atk: Math.round(refAtk(cons) * 0.85 * m.k[1]), def: Math.round(cons * 0.5),
    spd: m.spd, xp: Math.round(cons * 1.9), money: 0, size: 8.6, mappa: misure(m.sprite).w,
    fuga: m.fuga, moves: m.moves, frames: nemicoFrames(umano(m.sprite)), mostro: true,
  };
  NEMICI[key] = { nome: m.nome, min: m.min, cons, zone: ['parco'], quando: 'notte', gruppo: [1, 2], lv: m.lv, nuovo: true };
  GRUPPI.push({ zona: 'parco', quando: 'notte', membri: [key], cresce: key, max: 2, peso: 1 });
  BOTTINO[key] = BOTTINO_MOSTRI[id].filter(o => !o.vestito && !o.arma);
}
// due mostri insieme, ogni tanto
GRUPPI.push({ zona: 'parco', quando: 'notte', membri: ['mostro_fantasma', 'mostro_scheletro'], peso: 0.6 });
GRUPPI.push({ zona: 'parco', quando: 'notte', membri: ['mostro_strega', 'mostro_mago'], peso: 0.5 });
GRUPPI.push({ zona: 'parco', quando: 'notte', membri: ['mostro_vampiro', 'mostro_lupo_mannaro'], peso: 0.4 });
ZONE.parco = { nome: 'Parco Oglio', rett: [[46, 88, 156, 94], [46, 103, 156, 109], [76, 95, 101, 99], [106, 95, 132, 99]] };

// guardia del parco: sempre livello 30
ENEMIES.guardia_parco = {
  name: GU.nome, hp: Math.round(refHp(GU.livello) * 3.2), atk: Math.round(refAtk(GU.livello) * 1.0), def: Math.round(GU.livello * 0.7),
  spd: 9, xp: 70, money: 0, size: 9, fuga: GU.fuga, moves: GU.moves, frames: nemicoFrames(umano('soldato')),
};
NEMICI.guardia_parco = { nome: GU.nome, min: 1, cons: GU.livello, zone: ['guardie'], lv: [GU.livello, GU.livello] };

// gli innamorati: vicini al livello di Garonio, ma in due
const AMANTI = {};
COPPIE.forEach((c, i) => {
  [c.a, c.b].forEach((sp, k) => {
    const key = `amante_${i}_${k}`;
    AMANTI[key] = sp;
    ENEMIES[key] = { name: c.nomi[k].replace(/^(il|la) /, m => m[0].toUpperCase() + m.slice(1)), hp: Math.round(refHp(10) * 1.05), atk: Math.round(refAtk(10) * 0.62),
      def: 4, spd: 8, xp: 22, money: 6, size: 8.4, fuga: 'scappa a casa coprendosi la faccia.', moves: CP.moves, frames: nemicoFrames(umano(sp)) };
    NEMICI[key] = { nome: c.nomi[k], min: 1, cons: 10, zone: ['coppiette'], lv: [2, 34] };
  });
});

export class Parco {
  constructor(game) {
    this.game = game;
    this.segni = {};       // 'tipo:i' -> sprite sulla mappa (cartelli, nidi, galleggianti, carriola)
    this.ceppi = {};       // indice albero -> sprite del ceppo
    this.coppia = null;    // { a, b, cuore, x, z, i }
    this._tex = {};
  }
  get s() { return this.game.s; }
  get st() {
    const f = (this.s.flags ??= {});
    const st = (f.parco ??= {});
    st.tagliati ??= {}; st.presi ??= {};
    return st;
  }
  _ora() { return (this.s.minutes / H); }

  init() {
    const g = this.game, W = g.world;
    this.punti = {};
    for (const [tipo, d] of Object.entries(DANNI)) if (d.punti) this.punti[tipo] = d.punti.map(([x, z]) => this._libero(x, z));
    // alberi del parco: quelli dentro il rettangolo, raggiungibili
    this.alberiParco = (W.alberi || []).map((a, i) => [a, i]).filter(([a]) => !a.bordo && dentroParco(a.x, a.z)
      && [[0, 0.9], [0, -0.9], [0.9, 0], [-0.9, 0]].some(([dx, dz]) => !W.blocked(a.x + dx, a.z + dz))).map(([, i]) => i);
    this._missioni();
    this._disegna();
    g.on('nuovoGiorno', () => { this._via(); this._disegna(); });
    g.on('ora', d => this._oraNuova(d.ora));
    g.on('nemicoSconfitto', d => this._rari(d));
    g.bersagli.unshift(() => this.bersaglio());          // prima dello «Scuoti l'albero»
    g.moduli.push({ update: dt => this.update(dt), animate: dt => this.animate(dt) });
    g.pilot?.sezione?.('🌲 Parco Oglio', () => this._prova());
    // ricaricando: la coppietta di stasera è ancora lì
    const c = this.st.coppia;
    if (c && c.giorno === this.s.day && this._ora() >= CP.ore[0]) this._creaCoppia(c);
    else this.st.coppia = null;
  }

  // ---------- Le missioni del Vecchio Camper ----------
  _missioni() {
    const g = this.game;
    for (const [id, m] of Object.entries(CAMPER.missioni)) {
      g.quests.aggiungi(id, {
        da: 'camper', titolo: `🧓 ${m.titolo}`, offerta: m.offerta, accetta: 'Ci sto, nonno', rifiuta: 'Magari dopo',
        obiettivo: { evento: 'sabotaggio', filtro: { tipo: m.tipo }, n: m.n },
        premio: m.premio, requisiti: { livello: m.livello, ...(m.dopo ? { dopo: m.dopo } : {}) }, grazie: m.grazie, parco: m.tipo,
      });
    }
  }
  _attiva(tipo) {
    const q = this.game.quests;
    return Object.entries(CAMPER.missioni).some(([id, m]) => m.tipo === tipo && q.stato(id) === 'attiva');
  }

  // ---------- Oggetti del parco sulla mappa ----------
  _t(nome, fn) { return (this._tex[nome] ??= PIX.toTexture(fn())); }
  _segno(key, tex, x, z, w, h) {
    const W = this.game.world;
    if (this.segni[key]) return;
    const spr = W.sprite(tex, { w, h });
    spr.position.set(x, h / 2, z);
    W.scene.add(spr);
    this.segni[key] = spr;
  }
  _togliSegno(key) {
    const spr = this.segni[key]; if (!spr) return;
    this.game.world.scene.remove(spr); this.game.world.spriteMats?.delete(spr.material);
    delete this.segni[key];
  }
  _preso(tipo, i) { return this.st.presi[`${tipo}:${i}`] != null; }

  _disegna() {
    const st = this.st, W = this.game.world, oggi = this.s.day;
    // le cose rubate tornano: i cartelli dopo 4 giorni, nidi e pesci il giorno dopo
    const torna = { cartello: 4, nido: 1, pesca: 1 };
    for (const [k, d] of Object.entries(st.presi)) { const tipo = k.split(':')[0]; if (torna[tipo] && oggi - d >= torna[tipo]) delete st.presi[k]; }
    for (const [i, d] of Object.entries(st.tagliati)) if (oggi - d >= 5) delete st.tagliati[i];
    for (const k of Object.keys(this.segni)) this._togliSegno(k);
    this.punti.cartello.forEach((p, i) => { if (!this._preso('cartello', i)) this._segno('cartello:' + i, this._t('cartello', cartelloParco), p.x, p.z, 0.75, 1.05); });
    this.punti.nido.forEach((p, i) => { if (!this._preso('nido', i)) this._segno('nido:' + i, this._t('nido', () => nidoAnatra(true)), p.x, p.z, 0.8, 0.6); });
    this.punti.pesca.forEach((p, i) => { if (!this._preso('pesca', i)) this._segno('pesca:' + i, this._t('pesca', galleggiante), p.x, p.z + 0.9, 0.7, 0.4); });
    if (!st.carriola) { const p = this.punti.carriola[0]; this._segno('carriola:0', this._t('carriola', carriola), p.x, p.z, 1.2, 0.8); }
    // alberi tagliati: al loro posto un ceppo
    for (const [i, spr] of Object.entries(this.ceppi)) { W.scene.remove(spr); delete this.ceppi[i]; }
    for (const i of this.alberiParco) {
      const a = W.alberi[i], via = st.tagliati[i] != null;
      a.spr.visible = !via; a.tagliato = via;
      if (via) {
        const spr = W.sprite(this._t('ceppo', ceppo), { w: 1.1, h: 0.65 });
        spr.position.set(a.x, 0.33, a.z); W.scene.add(spr); this.ceppi[i] = spr;
      }
    }
  }

  _libero(x, z) {
    const W = this.game.world;
    for (let r = 0; r < 3; r += 0.3) for (let k = 0; k < 8; k++) {
      const a = k * Math.PI / 4, px = x + Math.cos(a) * r, pz = z + Math.sin(a) * r;
      if (!W.blocked(px, pz, 0.3)) return { x: px, z: pz };
    }
    return { x, z };
  }

  // ---------- Prompt del tasto E ----------
  bersaglio() {
    const g = this.game;
    if (g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position;
    if (!dentroParco(P.x, P.z) && Math.hypot(P.x - 55, P.z - 90) > 8) return null;
    const vicino = (p, r = 1.3) => Math.hypot(P.x - p.x, P.z - p.z) < r;
    // la coppietta
    const c = this.coppia;
    if (c && !c.fatto && vicino(c, 3.2)) return { label: CP.etichetta, fn: () => this.spia() };
    // il cappello di Boss MM: solo la sera, con la missione
    if (this._attiva('cappello')) {
      const p = { x: BOSS_MM.posto.x + 1.6, z: BOSS_MM.posto.z - 0.4 };
      if (vicino(p, 1.8)) {
        const h = this._ora();
        return h >= 19 && h < 23 ? { label: DANNI.cappello.etichetta, fn: () => this.danno('cappello', 0) } : { label: '🎩 Il cappello di Boss MM', fn: () => g.ui.toast(T.cappelloSera) };
      }
    }
    if (!this.st.carriola && this._attiva('carriola') && vicino(this.punti.carriola[0], 1.5)) return { label: DANNI.carriola.etichetta, fn: () => this.danno('carriola', 0) };
    for (const tipo of ['cartello', 'nido', 'pesca']) {
      const i = this.punti[tipo].findIndex((p, k) => !this._preso(tipo, k) && vicino(p, tipo === 'pesca' ? 1.6 : 1.2));
      if (i >= 0) return { label: DANNI[tipo].etichetta, fn: () => this.danno(tipo, i) };
    }
    // gli alberi del parco si tagliano solo per il Camper (gli altri giorni si scuotono e basta)
    if (this._attiva('albero')) {
      let best = -1, bd = 1.35;
      for (const i of this.alberiParco) {
        const a = g.world.alberi[i]; if (a.tagliato) continue;
        const d = Math.hypot(P.x - a.x, P.z - a.z);
        if (d < bd) { bd = d; best = i; }
      }
      if (best >= 0) return { label: DANNI.albero.etichetta, fn: () => this.danno('albero', best) };
    }
    return null;
  }

  // ---------- I danni (e le guardie) ----------
  guardie(x, z, raggio = null) {
    const g = this.game, notte = this._ora() >= 20 || this._ora() < 6;
    let r = raggio ?? (notte ? GU.vistaNotte : GU.vista);
    if (g.prog.bonus('guardie')) r *= 0.5;                 // col cappello di Boss MM sembri uno di loro
    let best = null, bd = r;
    for (const id of ['guardia1', 'guardia2']) {
      const p = g.png.dove(id); if (!p) continue;
      const d = Math.hypot(p.x - x, p.z - z);
      if (d < bd) { bd = d; best = { id, ...p, d }; }
    }
    return best;
  }

  async danno(tipo, i) {
    const g = this.game, s = this.s, D = DANNI[tipo], P = g.player.group.position;
    if (g.combat.active || g.ui.busy()) return;
    if (tipo === 'cappello') return this._cappello();
    g.actT = 0.6; g.actName = 'attack'; g.audio.sfx('blip');
    s.tired = clamp(s.tired + D.tempo * 1.5, 0, 100);
    s.minutes += Math.round(D.tempo * 10);
    // le guardie: chi è vicino ti vede (più tempo ci metti, più si avvicinano)
    const visto = this.guardie(P.x, P.z, null);
    const allunga = visto ? null : this.guardie(P.x, P.z, (this._ora() >= 20 ? GU.vistaNotte : GU.vista) + D.tempo * 0.8);
    const chi = visto || (allunga && Math.random() < 0.5 ? allunga : null);
    if (chi) {
      const res = await this._beccato(chi);
      if (res !== 'win') return;
    }
    this._fatto(tipo, i);
  }

  _fatto(tipo, i) {
    const g = this.game, st = this.st, D = DANNI[tipo];
    const cose = [];
    for (const [o, n] of Object.entries(OGGETTI_DANNO[tipo] || {})) { g.prog.dai(o, n); cose.push(`${OGGETTI[o].icona} ${OGGETTI[o].nome}${n > 1 ? ` ×${n}` : ''}`); }
    if (tipo === 'albero') { st.tagliati[i] = this.s.day; g.ui.shake?.(); g.audio.sfx('splat'); }
    else if (tipo === 'carriola') st.carriola = true;
    else st.presi[`${tipo}:${i}`] = this.s.day;
    this._disegna();
    g._xp?.(6);
    g.ui.toast(`${D.testo}${cose.length ? ` (${cose.join(', ')})` : ''}`, 'good');
    g.emit('sabotaggio', { tipo });
    g.save?.();
  }

  // una guardia ti ha visto: si combatte (una sola; due se l'altra è vicina)
  async _beccato(chi) {
    const g = this.game, s = this.s;
    g.audio.sfx('bad'); g.ui.shake?.();
    await g.ui.dialog([{ who: chi.id, name: g.png.list.find(n => n.id === chi.id)?.def.nome || GU.nome, text: GU.beccato }]);
    const altra = this.guardie(chi.x, chi.z, 5);
    const due = altra && altra.id !== chi.id;
    const enemies = [{ id: 'guardia_parco', lv: GU.livello, feroce: false }, ...(due ? [{ id: 'guardia_parco', lv: GU.livello, feroce: false }] : [])];
    const res = await g.combat.start({ enemies, place: 'bosco' + (this._ora() >= 20 ? ' notte' : ''), intro: 'Le guardie del parco: livello 30. Non sono qui per scherzare.' });
    if (res === 'win') g.ui.toast(GU.vinto, 'good');
    else {
      const multa = Math.min(s.money, GU.multa * (due ? 2 : 1));
      s.money -= multa; s.stress = clamp(s.stress + (res === 'lose' ? 15 : 6), 0, 100);
      this.st.multe = (this.st.multe || 0) + 1;
      if (res === 'lose') {
        g.player.group.position.set(76, 0, 84);           // fuori dal parco, all'ingresso
        await g.ui.dialog([pagina({ testo: `${GU.sconfitta} (Multa: ${multa}€)` })]);
      } else g.ui.toast(`Scappato! Ma ti hanno riconosciuto: multa di ${multa}€ in cassetta della posta.`, 'bad');
    }
    g.emit('guardie', { esito: res });
    return res;
  }

  // l'ultima missione: il cappello di Boss MM
  async _cappello() {
    const g = this.game, s = this.s, st = this.st, b = BOSS.bossmm;
    g.audio.sfx('bad');
    await g.ui.dialog([pagina({ testo: "Garonio si avvicina al chiodo del casotto, allunga la mano... e il cappello è suo! Poi si gira." }), pagina({ testo: T.bossIntro })]);
    const res = await g.boss.affronta('bossmm');
    if (res === 'win') {
      const prima = !st.bossmm; st.bossmm = true;
      const cose = g.speciali._dai(prima ? b.bottino : b.bottinoRipeti);
      g.audio.sfx('coin');
      await g.ui.dialog([...pagine(prima ? b.vittoria : b.vittoriaRipeti), pagina({ testo: `Bottino: ${cose.join(', ')}` })]);
      g.emit('bossSconfitto', { id: 'bossmm', leggenda: false });
      g.emit('sabotaggio', { tipo: 'cappello' });
    } else if (res === 'lose') {
      s.stress = clamp(s.stress + 15, 0, 100);
      const multa = Math.min(s.money, GU.multa * 2); s.money -= multa;
      g.player.group.position.set(76, 0, 84);
      await g.ui.dialog([pagina({ testo: `${b.sconfitta} (Multa: ${multa}€)` })]);
    } else if (res) await g.ui.dialog([pagina({ testo: b.scappato })]);
    g.save?.();
    return res;
  }

  // bottino raro dei mostri (vestiti e armi)
  _rari(d) {
    const id = d.id?.startsWith('mostro_') ? d.id.slice(7) : null;
    if (!id || d.noXp) return;
    const g = this.game;
    for (const o of BOTTINO_MOSTRI[id] || []) {
      if (!o.vestito && !o.arma) continue;
      if (o.vestito ? g.prog.haVestito(o.id) : g.prog.haArma(o.id)) continue;
      if (Math.random() >= o.p * (d.feroce ? 2 : 1)) continue;
      if (o.vestito) g.prog.daiVestito(o.id); else g.prog.daiArma(o.id);
      setTimeout(() => g.ui.toast(`⭐ Il mostro ha lasciato cadere: ${(o.vestito ? VESTITI : ARMI)[o.id].nome}!`, 'good'), 1200);
    }
  }

  // ---------- Coppiette ----------
  _oraNuova(ora) {
    const st = this.st;
    if (ora === 0) return this._via();
    if (ora === CP.ore[0] && !st.coppia && Math.random() < CP.probabilita) this.coppietta();
  }

  coppietta(x, z) {
    const W = this.game.world;
    if (x == null) {
      // in mezzo agli alberi del parco, lontano dai sentieri delle guardie
      const pool = this.alberiParco.map(i => W.alberi[i]).filter(a => !a.tagliato && Math.abs(a.z - 91) > 4);
      for (let t = 0; t < 40 && pool.length; t++) {
        const a = pool[Math.floor(Math.random() * pool.length)];
        const px = a.x + rand(-1.5, 1.5), pz = a.z + rand(0.8, 1.6);
        if (!W.blocked(px, pz, 0.4) && !W.blocked(px + 0.9, pz, 0.3)) { x = px; z = pz; break; }
      }
      if (x == null) return false;
    }
    const c = { giorno: this.s.day, i: Math.floor(Math.random() * COPPIE.length), x, z };
    this.st.coppia = c;
    this._creaCoppia(c);
    this.game.ui.toast(CP.arrivo);
    return true;
  }

  _creaCoppia(c) {
    const W = this.game.world, C = COPPIE[c.i];
    this._togliCoppia();
    const attore = (sp, dx, dir) => {
      const o = umano(sp, { eyes: 'normal' }), fr = [0, 1, 2].map(f => PIX.humanoid(o, f));
      const a = W.actor([...fr, ...fr.map(PIX.mirror)], { ...misure(sp), shadow: 0.35 });
      a.group.position.set(c.x + dx, 0, c.z); a.setFrame(dir > 0 ? 0 : 3);
      return a;
    };
    const cu = W.sprite(this._t('cuore', cuore), { w: 0.5, h: 0.45 });
    cu.position.set(c.x + 0.42, 2.1, c.z); W.scene.add(cu);
    this.coppia = { ...c, a: attore(C.a, 0, 1), b: attore(C.b, 0.85, -1), cuore: cu, t: 0 };
    window.__garonio?.minimap?.setMarker('coppietta', c.x, c.z, '#ff70a0');
  }
  _togliCoppia() {
    const c = this.coppia; if (!c) return;
    c.a.remove(); c.b.remove();
    this.game.world.scene.remove(c.cuore); this.game.world.spriteMats?.delete(c.cuore.material);
    this.coppia = null;
    window.__garonio?.minimap?.setMarker('coppietta', null);
  }
  _via() { this._togliCoppia(); this.st.coppia = null; }

  async spia(forza = null) {
    const g = this.game, s = this.s, c = this.coppia; if (!c || c.fatto) return;
    const C = COPPIE[c.i], P = g.player.group.position;
    c.fatto = true;
    const d = Math.hypot(P.x - c.x - 0.42, P.z - c.z);
    const beccato = forza != null ? forza : Math.random() < (d < 1.8 ? CP.scopertiVicino : CP.scoperti);
    const nomi = { a: C.nomi[0], b: C.nomi[1] };
    const pp = [pagina({ testo: pick(CP.spia) }), pagina({ testo: fill(CP.visti, nomi) }), pagina({ testo: C.battuta })];
    if (!beccato) {
      pp.push(pagina({ testo: CP.ok }));
      await g.ui.dialog(pp);
      g.prog.dai('fotoSfocata', 1); g._xp?.(25);
      s.stress = clamp(s.stress - 8, 0, 100);
      g.audio.sfx('coin');
      g.emit('coppietta', { esito: 'foto' });
      this._via();
      return 'foto';
    }
    return this._litigio(pp.concat(pagina({ testo: CP.beccato })));
  }

  async _litigio(pp) {
    const g = this.game, s = this.s, c = this.coppia;
    g.audio.sfx('bad');
    await g.ui.dialog(pp);
    const res = await g.combat.start({ enemies: [`amante_${c.i}_0`, `amante_${c.i}_1`], place: 'bosco' + (this._ora() >= 20 ? ' notte' : ''), intro: 'Due innamorati furiosi. Le ciabatte volano.' });
    if (res === 'win') g.ui.toast(CP.vinto, 'good');
    else if (res === 'lose') s.stress = clamp(s.stress + 12, 0, 100);
    g.emit('coppietta', { esito: res });
    this._via();
    return res;
  }

  update(dt) {
    const g = this.game, c = this.coppia;
    if (!c || c.fatto || g.combat.active || g.locked || g.ui.busy() || g.interni?.attivo || g.vehicles?.driving) return;
    const P = g.player.group.position;
    // passi troppo vicino: ti vedono
    if (Math.hypot(P.x - c.x - 0.42, P.z - c.z) < 0.8) { c.fatto = true; this._litigio([pagina({ testo: CP.troppoVicino })]); }
  }

  animate(dt) {
    const c = this.coppia;
    const dentro = !!this.game.interni?.attivo;
    for (const spr of Object.values(this.segni)) spr.visible = !dentro;
    if (!c) return;
    c.t += dt;
    c.a.group.visible = c.b.group.visible = c.cuore.visible = !dentro;
    c.cuore.position.y = 2.1 + Math.sin(c.t * 3) * 0.12;
    c.cuore.scale.setScalar(0.5 + Math.abs(Math.sin(c.t * 4)) * 0.08);
    // si sbaciucchiano: ogni tanto si avvicinano
    const k = Math.sin(c.t * 2.2) > 0.6 ? 0.12 : 0;
    c.a.group.position.x = c.x + k; c.b.group.position.x = c.x + 0.85 - k;
  }

  // ---------- Prove (?pilot) ----------
  _prova() {
    const g = this.game, s = this.s;
    const notte = h => { s.minutes = Math.floor(s.minutes / (24 * H)) * 24 * H + h * H; };
    return [
      { label: '🌲 Vai al Parco Oglio (ingresso)', fn: () => { g.interni?.attivo && g.interni.esci?.(); g.player.group.position.set(76, 0, 90); return null; } },
      { label: '🧓 Vai dal Vecchio Camper', fn: () => { g.player.group.position.set(55.5, 0, 90.6); return null; } },
      { label: '👻 Notte (ore 21) e un mostro qui accanto', fn: () => {
        notte(21);
        const gr = GRUPPI.filter(x => x.zona === 'parco' && x.membri.length === 1);
        g.bestie?.spawn?.crea(gr[Math.floor(Math.random() * gr.length)], true); return null;
      } },
      { label: '💕 Coppietta qui accanto (ore 19:30)', fn: () => { notte(19.5); const P = g.player.group.position; this.coppietta(P.x + 2, P.z); return null; } },
      { label: '🚨 Fatti beccare dalle guardie', fn: () => { setTimeout(() => this._beccato({ id: 'guardia1', x: 76, z: 91 }), 50); return null; } },
      { label: '🎩 Combatti Boss MM', fn: () => { g.boss?._prepara?.(30); setTimeout(() => this._cappello(), 50); return null; } },
      { label: `🧓 Missioni del Camper: ${Object.keys(CAMPER.missioni).map(id => g.quests.stato(id) || '·').join(' ')}`, fn: () => null },
    ];
  }
}
