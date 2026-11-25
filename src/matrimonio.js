// Matrimonio in chiesa e divorzio in comune (GDD capitolo 28.2). Dati: src/data/matrimonio.js.
//  - Nel dialogo di una ragazza già conquistata compare «💍 Chiedile di sposarti»: anello, e se l'affinità basta
//    le nozze sono il giorno dopo tra le 10 e le 13 in chiesa. All'altare, «💒 Sposati»: in chiesa compaiono
//    gli invitati (Gigante, Mamma, Patata, Loredana, Rodella, il Sergente...) e Don Peppino celebra.
//  - Da sposato: ogni mattina meno stress, a volte il pranzo al sacco. Non ci si può sposare con un'altra.
//  - Divorzio all'Anagrafe (targa sul fianco est del municipio, 8-13): avvocato e poi alimenti ogni giorno,
//    per ogni ex. Poi si può sposare un'altra.
//
// API (game.matrimonio):  moglie() → id | null · ex() → [id] · nozze() → { id, giorno } | null
// Eventi: emette  matrimonio { id }, divorzio { id }
// Stato: s.flags.matrimonio = { moglie, nozze: { id, giorno }, ex: [id], debito }
import * as PIX from './pixel.js';
import { PNG } from './data/png.js';
import { RAGAZZE } from './data/ragazze.js';
import { NOZZE as N, TESTI_NOZZE as T } from './data/matrimonio.js';
import { cartelloScritta } from './sprite_azienda.js';
import { pagina, pick, fill } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const euro = n => Math.round(n).toLocaleString('it-IT');

export class Matrimonio {
  constructor(game) { this.game = game; this.attori = []; }
  get s() { return this.game.s; }
  get st() { const f = (this.s.flags ??= {}); const st = (f.matrimonio ??= {}); st.ex ??= []; return st; }
  moglie() { return this.st.moglie || null; }
  ex() { return this.st.ex; }
  nozze() { return this.st.nozze || null; }
  _ora() { return this.s.minutes / 60; }
  _nome(id) { return RAGAZZE[id]?.nome || PNG[id]?.nome || id; }

  init() {
    const g = this.game, rag = g.ragazze;
    // la proposta, nel dialogo della ragazza
    if (rag) {
      const menu = rag._menu.bind(rag);
      rag._menu = id => {
        const out = menu(id), sc = this._sceltaProposta(id);
        if (sc) out.splice(out.length - 1, 0, sc);
        return out;
      };
    }
    // l'altare
    g.interni?.bersaglioExtra?.(({ edificio, vicino }) => {
      const nz = this.st.nozze;
      if (edificio !== 'chiesa' || !nz || nz.giorno !== this.s.day) return null;
      const h = this._ora(); if (h < N.ore[0] || h >= N.ore[1]) return null;
      if (!vicino('altare', 3)) return null;
      return { label: fill(T.celebra, { nome: this._nome(nz.id) }), fn: () => this.cerimonia() };
    });
    g.on('nuovoGiorno', () => this._giorno());
    // l'Anagrafe
    const W = g.world, spr = W.sprite(PIX.toTexture(cartelloScritta(['ANAGRAFE'], { fondo: '#2a5aa8', testo: '#ffffff', ombra: '#10204a' })), { w: 0.95, h: 0.6 });
    spr.position.set(N.anagrafe.x, 0.3, N.anagrafe.z); W.scene.add(spr);
    g.bersagli.push(() => this._bersaglio());
    g.menu?.aggiungiStatistica?.(() => [
      ...(this.moglie() ? [['💍 Sposato con', this._nome(this.moglie())]] : []),
      ...(this.ex().length ? [['💸 Alimenti', `${this.ex().length * N.alimenti}€ al giorno (${this.ex().map(i => this._nome(i)).join(', ')})`]] : []),
    ]);
    g.pilot?.sezione?.('💍 Matrimonio', () => {
      const conq = Object.keys(RAGAZZE);
      return [
        { label: '💍 Nozze oggi alle 11 con una ragazza a caso', fn: () => { const id = conq[Math.floor(Math.random() * conq.length)]; this.st.nozze = { id, giorno: this.s.day }; this.s.minutes = Math.max(this.s.minutes, 10.5 * 60); return null; } },
        { label: '💒 Celebra subito', fn: () => { if (!this.st.nozze) this.st.nozze = { id: conq[0], giorno: this.s.day }; this.cerimonia(); return null; } },
        { label: '🏛️ Vai all\'Anagrafe', fn: () => { g.player.group.position.set(N.anagrafe.x + 0.6, 0, N.anagrafe.z + 0.3); return null; } },
      ];
    });
  }

  _P(id, testo, choices) { const R = RAGAZZE[id]; return { who: id, name: R ? `${R.icona} ${R.nome}` : this._nome(id), text: testo, choices }; }

  _sceltaProposta(id) {
    const g = this.game, st = this.st, r = g.ragazze?._st?.(id);
    if (!r?.conquiste) return null;
    if (st.moglie === id) return null;
    if (st.nozze?.id === id && st.nozze.giorno >= this.s.day) return { label: '💒 Le nozze sono fissate: domani alle 11 in chiesa', fn: () => [this._P(id, '«Non dimenticarlo. Alle undici. In chiesa. Lavato.»')] };
    if (st.moglie) return { label: '💍 Chiedile di sposarti', fn: () => [{ text: fill(T.sposataGia, { nome: this._nome(st.moglie) }) }] };
    return { label: fill(T.proposta, { prezzo: euro(N.anello) }), fn: () => {
      if (this.s.money < N.anello) return [{ text: fill(T.pocoSoldi, { prezzo: euro(N.anello) }) }];
      if (g.png.amicizia(id) < N.affinita) return [this._P(id, T.propostaNo)];
      this.s.money -= N.anello;
      st.nozze = { id, giorno: this.s.day + 1 };
      g.audio.sfx('level');
      return [{ text: T.propostaSi[0] }, this._P(id, T.propostaSi[1])];
    } };
  }

  _giorno() {
    const g = this.game, st = this.st, s = this.s, msg = [];
    // nozze saltate
    if (st.nozze && st.nozze.giorno < s.day) {
      g.png.cambiaAmicizia(st.nozze.id, N.saltato);
      msg.push([fill(T.saltato, { nome: this._nome(st.nozze.id) }), 'bad']);
      st.nozze = null;
    }
    if (st.nozze?.giorno === s.day) msg.push([fill(T.promemoria, { nome: this._nome(st.nozze.id) }), 'good']);
    // la moglie
    if (st.moglie) {
      s.stress = clamp(s.stress + N.stressGiorno, 0, 100);
      msg.push([fill(pick(T.mattino), { nome: this._nome(st.moglie), stress: N.stressGiorno }), 'good']);
      if (Math.random() < N.pranzo) { const o = pick(N.pranzi); g.prog.dai(o, 1); msg.push([fill(T.pranzo, { nome: this._nome(st.moglie), cosa: o === 'panino' ? 'un panino col salame' : o === 'tortaMele' ? 'una torta di mele' : 'uno zabaione' }), 'good']); }
    }
    // alimenti
    if (st.ex.length) {
      const tot = st.ex.length * N.alimenti;
      if (s.money >= tot) { s.money -= tot; msg.push([fill(T.alimenti, { tot }), '']); }
      else { s.stress = clamp(s.stress + 10, 0, 100); msg.push([fill(T.alimentiNo, { tot }), 'bad']); }
    }
    msg.forEach(([m, k], i) => setTimeout(() => g.ui.toast(m, k), 3500 + i * 2200));
  }

  // ---------- La cerimonia ----------
  _attore(id, x, z, dir = 0) {
    const g = this.game, def = PIX.CHARACTERS[id]; if (!def) return null;
    const a = g.world.actor(PIX.characterFrames(id), { w: (def.w || 16) / 16 * 1.25, h: (def.h || 24) / 16 * 1.25, shadow: 0.4 });
    const p = g.interni.mondo('chiesa', x, z);
    a.group.position.set(p.x, 0, p.z); a.setFrame(dir);
    this.attori.push(a);
    return a;
  }
  _via() { for (const a of this.attori) a.remove(); this.attori = []; }

  async cerimonia() {
    const g = this.game, st = this.st, s = this.s, nz = st.nozze; if (!nz) return;
    const id = nz.id, nome = this._nome(id);
    if (!g.interni?.attivo || g.interni.edificio !== 'chiesa') await g.interni?.entra?.('chiesa');
    g.locked = true;
    try {
      await g.ui.fade?.(true);
      // invitati sui banchi (solo chi non è già in chiesa), sposa e prete all'altare
      const inChiesa = new Set((g.png.list || []).filter(n => n.visible && n.def.posti?.some(p => p.interno === 'chiesa')).map(n => n.id));
      for (const [chi, x, z] of N.invitati) if (!inChiesa.has(chi) && chi !== id) this._attore(chi, x, z, 3);
      this._attore(id, N.sposa.x, N.sposa.z, 3);
      // Don Peppino (quello vero) va davanti all'altare
      const posto = PNG.donPeppino?.posti?.find(p => p.interno === 'chiesa');
      if (posto) { this._posto = { p: posto, x: posto.x, z: posto.z }; posto.x = N.prete.x; posto.z = N.prete.z; g.png.update?.(0, true); }
      else this._attore('donPeppino', N.prete.x, N.prete.z, 0);
      const P = g.interni.mondo('chiesa', N.sposo.x, N.sposo.z);
      g.player.group.position.set(P.x, 0, P.z);
      await g.ui.fade?.(false);
      g.audio.sfx('level');
      const pag = p => p.chi === 'sposa' ? this._P(id, fill(p.testo, { nome })) : pagina({ chi: p.chi, nome: p.chi ? PNG[p.chi]?.nome || undefined : undefined, testo: fill(p.testo, { nome }) });
      const pagine = T.cerimonia.map(pag);
      pagine[pagine.length - 1].choices = T.risposte.map(r => ({ label: r.t, fn: () => [{ text: r.r }, ...T.fine.map(pag)] }));
      await g.ui.dialog(pagine);
      // sposati
      st.moglie = id; st.nozze = null;
      s.stress = clamp(s.stress + N.stressNozze, 0, 100);
      g._xp?.(N.xpNozze);
      g.png.cambiaAmicizia(id, 20);
      g.emit('matrimonio', { id });
      g.ui.toast(fill(T.sposati, { nome, stress: N.stressNozze, xp: N.xpNozze }), 'good');
      g.save?.();
      await new Promise(r => setTimeout(r, 2500));
    } finally {
      this._via();
      if (this._posto) { this._posto.p.x = this._posto.x; this._posto.p.z = this._posto.z; this._posto = null; }
      g.locked = false;
    }
  }

  // ---------- Anagrafe ----------
  _bersaglio() {
    const g = this.game; if (g.vehicles?.driving || g.interni?.attivo) return null;
    const P = g.player.group.position;
    if (Math.hypot(P.x - N.anagrafe.x, P.z - N.anagrafe.z) < 1.2) return { label: T.anagrafeTitolo, fn: () => this.anagrafe() };
    return null;
  }

  async anagrafe() {
    const g = this.game, st = this.st, s = this.s, h = this._ora();
    if (h < 8 || h >= 13) return g.ui.toast(T.anagrafeChiusa);
    const cav = (text, choices) => ({ name: T.impiegato, text, choices });
    const scelte = [];
    if (st.moglie) {
      const v = { nome: this._nome(st.moglie), avvocato: euro(N.avvocato), alimenti: N.alimenti };
      scelte.push({ label: fill(T.divorzia, v), fn: () => {
        if (s.money < N.avvocato) return [cav(fill(T.pocoAvvocato, v))];
        s.money -= N.avvocato;
        const ex = st.moglie; st.ex.push(ex); st.moglie = null;
        g.png.cambiaAmicizia(ex, -40);
        g.emit('divorzio', { id: ex });
        g.audio.sfx('bad');
        return T.divorzioFatto.map(t => cav(fill(t, v)));
      } });
    } else scelte.push({ label: '⚖️ Divorzio', fn: () => [cav(T.nonSposato)] });
    if (st.ex.length) scelte.push({ label: `📄 Stato di famiglia`, fn: () => [cav(`«Ex mogli: ${st.ex.map(i => this._nome(i)).join(', ')}. Alimenti: ${st.ex.length * N.alimenti}€ al giorno. Le consiglio di non sposarsi più. O di sposare una ricca.»`)] });
    scelte.push({ label: 'Arrivederci', fn: null });
    await g.ui.dialog([cav(pick(T.anagrafe), scelte)]);
  }
}
