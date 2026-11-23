// La Vigilessa (GDD 19.4): cono di vista segnato a terra, multe per urti, Vespa senza casco
// e corsa in paese; multe da pagare al municipio entro 3 giorni, poi raddoppiano; con 3 multe
// non pagate sequestra la Vespa o la Punto per un giorno. Con Parlantina 2 si può provare a convincerla.
//
// API (game.vigilessa):
//   vede(x, z)              true se la Vigilessa vede quel punto adesso (per le missioni truffaldine)
//   multa(tipo, dato)       la Vigilessa ferma Garonio e fa la multa (tipi in src/data/officina.js: VIGILESSA.infrazioni)
//   daPagare()              totale delle multe non pagate
//   sequestrato(mezzo)      true se quel mezzo ha la ganascia
// Eventi: ascolta 'urto'; manda 'multa' { importo, tipo, pagata }.
// Stato: s.flags.vigilessa = { multe: [{ id, tipo, importo, giorno, doppia }], ultima: { tipo: minuti }, sequestro, ultimoSequestro }
import * as THREE from 'three';
import { VIGILESSA as V, MUNICIPIO } from './data/officina.js';
import { BUILDINGS } from './map.js';
import { pick } from './racconto.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const NOMI = { vespa: 'Vespa', punto: 'Punto' };

export class Vigilessa {
  constructor(game) {
    this.game = game;
    this.coda = [];          // multe in attesa di essere mostrate (non si apre un dialogo sopra un altro)
    game.moduli.push(this);
    game.bersagli.push(() => this._bersaglioMunicipio());
    game.png.aggiungiScelte('vigilessa', () => this.daPagare() > 0 ? [{ label: `Paga le multe (${this.daPagare()}€)`, fn: () => [this._paginaPaga('vigilessa')] }] : []);
    game.on('urto', e => this._urto(e));
    game.on('nuovoGiorno', () => this._nuovoGiorno());
    game.vehicles.blocchi.push(v => this.sequestrato(v.id) ? V.sequestrata(NOMI[v.id]) : null);
    this._makeCono();
  }

  get s() { return this.game.s; }
  get f() {
    const f = (this.s.flags.vigilessa ??= {});
    f.multe ??= []; f.ultima ??= {};
    return f;
  }

  // ---------- Cono di vista ----------
  _makeCono() {
    const { raggio, angolo } = V.vista;
    const geo = new THREE.CircleGeometry(raggio, 20, -angolo, angolo * 2).rotateX(-Math.PI / 2);
    this.conoMat = new THREE.MeshBasicMaterial({ color: 0xffe040, transparent: true, opacity: 0.22, depthWrite: false });
    this.cono = new THREE.Mesh(geo, this.conoMat);
    this.cono.position.y = 0.035; this.cono.visible = false; this.cono.renderOrder = 2;
    this.game.world.scene.add(this.cono);
    // anello dell'udito quando la marmitta sportiva fa rumore
    const ring = new THREE.RingGeometry(V.udito - 0.25, V.udito, 40).rotateX(-Math.PI / 2);
    this.anello = new THREE.Mesh(ring, new THREE.MeshBasicMaterial({ color: 0xff6040, transparent: true, opacity: 0.25, depthWrite: false }));
    this.anello.position.y = 0.035; this.anello.visible = false;
    this.game.world.scene.add(this.anello);
  }

  _lei() {
    const p = this.game.png.dove('vigilessa'); if (!p) return null;
    const n = this.game.png.list.find(n => n.id === 'vigilessa');
    return { x: p.x, z: p.z, dir: n?.dir ?? 1 };
  }

  vede(x, z) {
    const l = this._lei(); if (!l) return false;
    if (this.game.prog.bonus('invisibileVigilessa')) return false;
    const dx = x - l.x, dz = z - l.z, d = Math.hypot(dx, dz);
    if (d < 1.2) return true;
    if (d < V.vista.raggio) {
      const a = Math.atan2(dz, dx), facing = l.dir > 0 ? 0 : Math.PI;
      let diff = Math.abs(a - facing); if (diff > Math.PI) diff = Math.PI * 2 - diff;
      if (diff < V.vista.angolo) return true;
    }
    // la marmitta sportiva si sente anche alle spalle
    const v = this.game.vehicles.driving;
    if (v && this.game.officina?.mod(v).rumore && Math.abs(v.speed) > 1 && d < V.udito) return true;
    return false;
  }

  // ---------- Ogni fotogramma ----------
  animate() {
    const l = this._lei();
    this.cono.visible = !!l; this.anello.visible = false;
    if (!l) return;
    this.cono.position.set(l.x, 0.035, l.z);
    this.cono.rotation.y = l.dir > 0 ? 0 : Math.PI;
    const P = this.game.player.group.position;
    const allarme = this.vede(P.x, P.z);
    this.conoMat.color.setHex(allarme ? 0xff4030 : 0xffe040);
    this.conoMat.opacity = allarme ? 0.32 : 0.2;
    const v = this.game.vehicles.driving;
    if (v && this.game.officina?.mod(v).rumore) { this.anello.visible = true; this.anello.position.set(l.x, 0.035, l.z); }
  }

  update() {
    const g = this.game, s = this.s;
    if (this.coda.length && !g.ui.busy() && !g.locked) { this._ferma(this.coda.shift()); return; }
    const v = g.vehicles.driving; if (!v) return;
    const P = g.player.group.position;
    if (!this.vede(P.x, P.z)) return;
    if (v.kind === 'vespa' && !g.prog.bonus('casco') && Math.abs(v.speed) > 0.5) this.multa('casco');
    const Z = V.paese;
    if (Math.abs(v.speed) > V.velocitaPaese && P.x > Z.x0 && P.x < Z.x1 && P.z > Z.z0 && P.z < Z.z1) this.multa('corsa');
    // trattore con l'attrezzo abbassato sulla provinciale (l'attrezzo arriva col lavoro sui trattori)
    if (v.kind === 'trattore' && g.attrezzi?.abbassato?.(v) && g.world.tile(Math.floor(P.x), Math.floor(P.z)) === 'a') this.multa('attrezzo');
  }

  _urto(e) {
    if (!e.velocita || e.velocita < 1.2) return;
    if (this.vede(e.x, e.z)) this.multa('urto', e.danno || 0);
  }

  // ---------- Multe ----------
  multa(tipo, dato = 0) {
    const I = V.infrazioni[tipo]; if (!I) return false;
    const f = this.f, ora = this.s.day * 1440 + this.s.minutes;
    if (ora - (f.ultima[tipo] ?? -1e9) < V.pausa) return false;
    if (this.coda.length) return false; // una multa alla volta: la Vigilessa ha un solo blocchetto
    f.ultima[tipo] = ora;
    this.coda.push({ tipo, importo: I.importo(dato) });
    return true;
  }

  async _ferma({ tipo, importo }) {
    const g = this.game, s = this.s, I = V.infrazioni[tipo];
    const v = g.vehicles.driving; if (v) v.speed = 0;
    g.audio.sfx('bad');
    const m = { id: Date.now() % 1e9, tipo, importo, giorno: s.day, doppia: false };
    const scusaOk = (g.prog.grado?.('parlantina') || 0) >= 2;
    const testo = (t, imp) => `${t} Multa: ${imp}€ per ${I.nome}.`;
    const scelte = (conScusa) => [
      { label: `${V.pagaOra} (${m.importo}€)`, disabled: s.money < m.importo, fn: () => { s.money -= m.importo; g.audio.sfx('coin'); g.emit('multa', { importo: m.importo, tipo, pagata: true }); return [this._pag(pick(V.pagato))]; } },
      { label: V.pagaDopo, fn: () => { this.f.multe.push(m); g.emit('multa', { importo: m.importo, tipo, pagata: false }); this._controllaSequestro(); return [this._pag(pick(V.rimandato))]; } },
      ...(conScusa ? [{ label: `«${V.scuse}» (Parlantina)`, fn: () => {
        if (Math.random() < 1 / 3) { g.ui.toast('Multa annullata. Il piccione ringrazia.', 'good'); return [this._pag(pick(V.scusaOk))]; }
        m.importo *= 2;
        return [this._pag(testo(pick(V.scusaKo), m.importo), scelte(false))];
      } }] : []),
    ];
    await g.ui.dialog([this._pag(testo(pick(V.frasi[tipo]), m.importo), scelte(scusaOk))]);
  }

  _pag(text, choices) { return { who: 'vigilessa', name: 'La Vigilessa', text, choices }; }

  daPagare() { return this.f.multe.reduce((t, m) => t + m.importo, 0); }

  _paginaPaga(chi) {
    const g = this.game, s = this.s, f = this.f;
    const page = chi === 'vigilessa' ? (t, c) => this._pag(t, c) : (t, c) => ({ name: 'Municipio', text: t, choices: c });
    if (!f.multe.length) return page(MUNICIPIO.niente, [{ label: 'Esci', fn: null }]);
    const tot = this.daPagare();
    const choices = f.multe.map(m => ({
      label: `${V.infrazioni[m.tipo]?.nome ?? m.tipo}, giorno ${m.giorno}: ${m.importo}€${m.doppia ? ' (raddoppiata)' : ''}`,
      disabled: s.money < m.importo,
      fn: () => { s.money -= m.importo; f.multe.splice(f.multe.indexOf(m), 1); g.audio.sfx('coin'); return [this._paginaPaga(chi)]; },
    }));
    if (f.multe.length > 1) choices.unshift({ label: `Paga tutto (${tot}€)`, disabled: s.money < tot, fn: () => { s.money -= tot; f.multe = []; g.audio.sfx('coin'); g.ui.toast('Multe pagate. Fedina pulita, per ora.', 'good'); return [page(pick(V.pagato), [{ label: 'Esci', fn: null }])]; } });
    choices.push({ label: 'Esci', fn: null });
    const scad = f.multe.filter(m => !m.doppia).map(m => m.giorno + V.scadenza - s.day);
    const nota = scad.length ? ` La prossima scade tra ${Math.max(0, Math.min(...scad))} giorni, poi raddoppia.` : '';
    return page(`${chi === 'vigilessa' ? 'Contanti, grazie.' : pick(MUNICIPIO.saluti)} Totale: ${tot}€.${nota}`, choices);
  }

  _bersaglioMunicipio() {
    const b = BUILDINGS.find(b => b.id === 'municipio'); if (!b) return null;
    const P = this.game.player.group.position;
    const x = b.x0 + b.w / 2, z = b.z0 + b.d + 0.5;
    if (Math.hypot(P.x - x, P.z - z) > 1.1) return null;
    const tot = this.daPagare();
    return { label: tot ? `Municipio: paga le multe (${tot}€)` : 'Municipio: ufficio multe', fn: () => this.game.ui.dialog([this._paginaPaga('municipio')]) };
  }

  // ---------- Scadenze e sequestro ----------
  _nuovoGiorno() {
    const s = this.s, f = this.f, g = this.game;
    if (f.sequestro && s.day >= f.sequestro.fino) { g.ui.toast(V.restituita(NOMI[f.sequestro.mezzo]), 'good'); f.sequestro = null; }
    let raddoppiate = false;
    for (const m of f.multe) if (!m.doppia && s.day - m.giorno >= V.scadenza) { m.importo *= 2; m.doppia = true; raddoppiate = true; }
    if (raddoppiate) { g.ui.toast(V.raddoppio(this.daPagare()), 'bad'); g.audio.sfx('bad'); }
    this._controllaSequestro();
  }

  _controllaSequestro() {
    const s = this.s, f = this.f, g = this.game;
    if (f.sequestro || f.multe.length < V.sequestroDopo) return;
    if (f.ultimoSequestro != null && s.day - f.ultimoSequestro < V.scadenza) return;
    const veh = g.vehicles;
    const scelta = ['vespa', 'punto'].filter(id => veh.get(id) && veh.driving?.id !== id);
    if (!scelta.length) return;
    const mezzo = scelta[Math.random() * scelta.length | 0];
    f.sequestro = { mezzo, fino: s.day + V.sequestroGiorni };
    f.ultimoSequestro = s.day;
    g.ui.toast(V.sequestro(NOMI[mezzo]), 'bad');
  }

  sequestrato(id) { const q = this.f.sequestro; return !!q && q.mezzo === id && this.s.day < q.fino; }
}
