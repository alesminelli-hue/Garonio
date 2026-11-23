// Attrezzi dei trattori (GDD 20.1): aratro, seminatrice, falciatrice e turbina, più il gasolio.
// Nei campi grandi (mais e grano) si lavora solo col trattore: il trattore fa il lavoro dell'attrezzo
// agganciato sulle zolle dove passa. Testi e numeri in src/data/stagioni.js.
//
// API (game.attrezzi):
//   ha(id)                      Garonio ha (o ha noleggiato oggi) quell'attrezzo?
//   su(idTrattore)              id dell'attrezzo agganciato ('aratro'...) o null
//   aggancia(idTrattore, id)    aggancia (lo toglie dall'altro trattore se serve)
//   gasolio(idTrattore)         0..100
//   turbinaAttiva(x, z, r=6)    c'è una turbina che spruzza entro r caselle da (x, z)? (serve al lavoro G)
//   zonaCampo(x, z)             'mais' | 'grano' | null: il campo grande sotto quella casella
//   abbassato(v)                il trattore v ha un attrezzo da campo giù (per la multa della Vigilessa sulla provinciale)
// Agganci usati da vehicles.js: velocita(v), guida(v, dist, dt), urto(v, danno), hud(v)
// Stato salvato in s.flags.attrezzi.
import * as PIX from './pixel.js';
import { VPX } from './vehicle_sprites.js';
import { BUILDINGS } from './map.js';
import { ATTREZZI, UPGRADE_ATTREZZI, TRATTORI_NOMI, LAVORO_CAMPI as L, BATTUTE_LAVORO as B } from './data/stagioni.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const TRATTORI = ['trattore1', 'trattore2'];
const nomeT = id => TRATTORI_NOMI[id] || id;

export class Attrezzi {
  constructor(game) {
    this.game = game;
    this.spr = {};          // idTrattore -> sprite dell'attrezzo
    this.drops = [];
    this.t = 0;
  }
  get s() { return this.game.s; }
  get st() { return this.s.flags.attrezzi; }

  init() {
    const s = this.s;
    s.flags ??= {};
    s.flags.attrezzi ??= {
      posseduti: { aratro: true, seminatrice: true },
      noleggio: {},
      su: { trattore1: 'aratro', trattore2: 'seminatrice' },
      stato: { aratro: 100, seminatrice: 100 },
      upg: {},
      gasolio: { trattore1: 100, trattore2: 100 },
      semente: L.sementeIniziale * L.sementeSacco,
      cassone: { mais: 0, grano: 0 },
    };
    const g = this.game, W = g.world;
    this.fienile = BUILDINGS.find(b => b.id === 'fienile');
    // rastrelliera degli attrezzi e cisterna del gasolio, accanto alla tettoia
    const R = L.rastrelliera;
    const rack = W.sprite(rackArt(), { w: 44 / 16, h: 30 / 16 });
    rack.position.set(R.x, 0, R.z); W.scene.add(rack);
    W.solids.push({ x0: R.x - 1.3, z0: R.z - 0.35, x1: R.x + 1.3, z1: R.z + 0.15 });
    // tasto E vicino alla rastrelliera (a piedi)
    g.bersagli.push(() => {
      if (g.vehicles.driving) return null;
      const P = g.player.group.position;
      if (Math.hypot(P.x - R.x, P.z - (R.z + 0.4)) < 1.9) return { label: 'Attrezzi e gasolio (tettoia)', fn: () => this.apriRastrelliera() };
      return null;
    });
    g.moduli.push({ animate: dt => this._frame(dt) });
    g.on('nuovoGiorno', () => this._nuovoGiorno());
    // Zeno vende, noleggia e ripara gli attrezzi; il Bubetto vende la semente
    g.png.aggiungiScelte('zeno', () => [{ label: '🚜 Attrezzi dei trattori', fn: () => [this._paginaZeno()] }]);
    g.png.aggiungiScelte('bubetto', () => this._sceltaSemente(L.sementePrezzo, 'bubetto'));
    this._agganciaInterni();
    g.on('entrato', () => this._agganciaInterni());
  }

  // ---------- Possesso e aggancio ----------
  ha(id) { return !!this.st.posseduti[id] || this.st.noleggio[id] === this.s.day; }
  su(idT) { const a = this.st.su[idT]; return a && this.ha(a) ? a : null; }
  gasolio(idT) { return this.st.gasolio[idT] ?? 100; }
  aggancia(idT, id) {
    const su = this.st.su;
    for (const t of TRATTORI) if (su[t] === id) su[t] = null;
    su[idT] = id;
    this.st.stato[id] ??= 100;
  }

  zonaCampo(x, z) {
    const tx = Math.floor(x), tz = Math.floor(z);
    if (this.game.world.areaAt(tx, tz) === 'field') return 'mais';
    const c = L.campoGrano;
    if (tx >= c.x0 && tx < c.x1 && tz >= c.z0 && tz < c.z1) return 'grano';
    return null;
  }

  // l'attrezzo si abbassa da solo nel campo; fuori dal campo si alza quando il trattore si ferma un attimo
  abbassato(v) { const a = v?.kind === 'trattore' && this.su(v.id); return !!a && a !== 'turbina' && !!v._giu; }

  // ---------- Agganci per vehicles.js ----------
  velocita(v) {
    if (v.kind !== 'trattore') return 1;
    if (this.gasolio(v.id) <= 0) return 0;
    return this.su(v.id) ? 0.9 : 1;
  }

  guida(v, dist, dt) {
    if (v.kind !== 'trattore') return;
    const st = this.st, id = v.id;
    // gasolio
    const before = st.gasolio[id] ?? 100;
    st.gasolio[id] = clamp(before - dist * L.gasolioPerUnita, 0, 100);
    if (before > 0 && st.gasolio[id] <= 0) { this.game.ui.toast(B.seccoGasolio, 'bad'); this.game.audio.sfx('stall'); }
    else if (before >= 15 && st.gasolio[id] < 15) this.game.ui.toast(B.riservaGasolio, 'bad');
    if (st.gasolio[id] <= 0) return;
    const a = this.su(id);
    if (!a) return;
    if (a !== 'turbina') {
      const inCampo = !!this.zonaCampo(v.st.x, v.st.z);
      if (inCampo && !v._giu) { v._giu = true; v._avvisoAlza = false; }
      else if (!inCampo && v._giu) {
        if (Math.abs(v.speed) < 0.3) { v._giu = false; this.game.ui.float(`${ATTREZZI[a].icona} Attrezzo alzato`); }
        else if (!v._avvisoAlza) { v._avvisoAlza = true; this.game.ui.toast('Attrezzo ancora giù: fermati un attimo per alzarlo prima della provinciale, sennò la Vigilessa ti multa.'); }
      }
    }
    if ((st.stato[a] ?? 100) <= 0) { if (!v._rottoAvvisato) { v._rottoAvvisato = true; this.game.ui.toast(B.attrezzoRotto, 'bad'); } return; }
    v._rottoAvvisato = false;
    if (a === 'turbina') { this._turbina(v, dt); return; }
    if (Math.abs(v.speed) < 0.4) return;
    // l'attrezzo lavora dietro al trattore, largo quanto dice ATTREZZI (l'aratro largo fa 3 zolle)
    const D = ATTREZZI[a];
    const w = a === 'aratro' && st.upg.aratroLargo ? 3 : D.larghezza || 1;
    const back = a === 'falciatrice' ? -1.9 : 1.6;           // la falciatrice lavora davanti
    const cx = Math.cos(v.st.h), cz = Math.sin(v.st.h);
    const bx = v.st.x - cx * back, bz = v.st.z - cz * back;
    for (let k = 0; k < w; k++) {
      const off = k - (w - 1) / 2;
      this._lavora(v, a, bx - cz * off, bz + cx * off);
    }
  }

  urto(v, danno) {
    const a = v.kind === 'trattore' && this.su(v.id);
    if (!a || danno <= 0) return;
    const st = this.st;
    st.stato[a] = clamp((st.stato[a] ?? 100) - Math.round(danno * 0.6), 0, 100);
    this.game.ui.toast(`Anche ${ATTREZZI[a].nome.toLowerCase().startsWith('a') ? "l'" : 'la '}${ATTREZZI[a].nome.toLowerCase()} ha preso la botta: ${Math.round(st.stato[a])}%`, 'bad');
  }

  hud(v) {
    if (v.kind !== 'trattore') return '';
    const bar = (lab, val, cls) => `<div class="vbar ${cls}"><label>${lab}</label><div class="track"><div class="fill" style="width:${clamp(val, 0, 100)}%"></div></div></div>`;
    const gas = this.gasolio(v.id);
    let html = bar('Gas.', gas, gas < 15 ? 'low' : 'fuel');
    const a = this.su(v.id);
    if (!a) return html + '<div class="warn att">Nessun attrezzo: premi R (o 🔧) per agganciarne uno</div>';
    const st = this.st, stato = Math.round(st.stato[a] ?? 100);
    let extra = '';
    if (a === 'seminatrice') extra = ` · semente ${Math.ceil(st.semente / L.sementeSacco)} sacchi (${st.semente} zolle)`;
    if (a === 'falciatrice') extra = st.upg.rimorchio ? ' · rimorchio' : ` · cassone ${st.cassone.mais + st.cassone.grano}/${L.cassone}`;
    if (a === 'turbina') extra = v._spray > 0 ? ' · 💦 spruzza' : this._acqua(v.st.x, v.st.z) > L.raggioAcqua ? ' · lontano dall\'acqua' : '';
    if (a === 'aratro' && st.upg.aratroLargo) extra = ' · largo';
    if (a !== 'turbina') extra += v._giu ? ' · ⬇ giù' : ' · ⬆ alzato';
    return html + `<div class="att">${ATTREZZI[a].icona} ${ATTREZZI[a].nome} ${stato}%${extra} · <b>${document.body.classList.contains('touch') ? '🔧' : 'R'}</b> cambia</div>`;
  }

  // la turbina c'è ed è accesa vicino a (x, z)?
  turbinaAttiva(x, z, r = 6) {
    const v = this.game.vehicles?.list.find(v => this.su(v.id) === 'turbina');
    return !!v && v === this.game.vehicles.driving && v._spray > 0 && Math.hypot(v.st.x - x, v.st.z - z) <= r;
  }

  // ---------- Il lavoro sulle zolle ----------
  _lavora(v, a, x, z) {
    const zona = this.zonaCampo(x, z);
    if (!zona) return;
    const g = this.game, s = this.s, st = this.st;
    const tx = Math.floor(x), tz = Math.floor(z), key = tx + ',' + tz;
    const p = s.plots[key];
    let fatto = false;
    if (a === 'aratro') {
      if (!p) { s.plots[key] = { crop: null, stage: 0, water: false, g: 0 }; fatto = true; }
      else if (p.stoppie) { delete p.stoppie; fatto = true; }
      if (fatto) {
        s.today.zappate = (s.today.zappate || 0) + 1;
        g.emit('azione', { tipo: 'ara' });
        if ((v.lavori = (v.lavori || 0) + 1) % 6 === 1) g.audio.sfx('dig');
      }
    } else if (a === 'seminatrice') {
      if (!p || p.crop || p.stoppie) return;
      if (st.semente <= 0) { if (!v._senzaSemente) { v._senzaSemente = true; g.ui.toast(B.niente, 'bad'); } return; }
      v._senzaSemente = false;
      st.semente--;
      Object.assign(p, { crop: zona, stage: 0, g: 0 });
      if (zona === 'mais') { s.today.seminaCampo = (s.today.seminaCampo || 0) + 1; g.stagioni?.conta('maisSeminato'); }
      else { s.today.seminaGrano = (s.today.seminaGrano || 0) + 1; g.stagioni?.conta('granoSeminato'); }
      g.emit('azione', { tipo: 'semina' });
      if ((v.lavori = (v.lavori || 0) + 1) % 5 === 1) g.audio.sfx('pick');
      fatto = true;
    } else if (a === 'falciatrice') {
      if (!p || !p.crop || p.stage < 3) {
        if (p && p.crop === 'grano' && p.stage < 3 && !v._granoVerde) { v._granoVerde = true; g.ui.toast(B.granoVerde); }
        return;
      }
      const crop = p.crop;
      if (!st.upg.rimorchio && st.cassone.mais + st.cassone.grano >= L.cassone) {
        if (!v._pieno) { v._pieno = true; g.ui.toast(B.cassonePieno, 'bad'); g.audio.sfx('bad'); }
        return;
      }
      v._pieno = false;
      s.plots[key] = { crop: null, stage: 0, water: false, g: 0, stoppie: true };
      if (st.upg.rimorchio) this._consegna(crop, 1, false); else st.cassone[crop]++;
      s.today.raccolti = (s.today.raccolti || 0) + 1;
      if (crop === 'mais') { s.today.raccoltiMais = (s.today.raccoltiMais || 0) + 1; g.stagioni?.conta('maisRaccolto'); }
      else { s.today.trebbiate = (s.today.trebbiate || 0) + 1; g.stagioni?.conta('granoTrebbiato'); }
      g.emit('raccolto', { crop });
      if ((v.lavori = (v.lavori || 0) + 1) % 5 === 1) g.audio.sfx('pick');
      fatto = true;
    }
    if (!fatto) return;
    const plot = s.plots[key];
    g.world.setPlot(tx, tz, plot);
    st.stato[a] = clamp((st.stato[a] ?? 100) - ATTREZZI[a].usura, 0, 100);
    st.gasolio[v.id] = clamp(this.gasolio(v.id) - ATTREZZI[a].gasolio, 0, 100);
    s.tired = clamp(s.tired + 0.25 * g.prog.fatica(), 0, 100);
    s.minutes += 1;
    if ((v.xpT = (v.xpT || 0) + 1) % 3 === 0) g._xp(1);
  }

  // la turbina pesca dall'acqua vicina e bagna le zolle intorno
  _turbina(v, dt) {
    const g = this.game, s = this.s, st = this.st;
    v._spray = Math.max(0, (v._spray || 0) - dt);
    if (this._acqua(v.st.x, v.st.z) > L.raggioAcqua) {
      if (!v._seccoAvvisato && this.zonaCampo(v.st.x, v.st.z)) { v._seccoAvvisato = true; g.ui.toast(B.turbinaSecca); }
      return;
    }
    v._seccoAvvisato = false;
    v._spray = 0.5;
    st.gasolio[v.id] = clamp(this.gasolio(v.id) - ATTREZZI.turbina.gasolio * dt, 0, 100);
    v._wT = (v._wT || 0) - dt;
    if (v._wT > 0) return;
    v._wT = 0.25;
    const R = ATTREZZI.turbina.raggio;
    let n = 0;
    for (let z = Math.floor(v.st.z - R); z <= v.st.z + R; z++) for (let x = Math.floor(v.st.x - R); x <= v.st.x + R; x++) {
      if (Math.hypot(x + 0.5 - v.st.x, z + 0.5 - v.st.z) > R) continue;
      const p = s.plots[x + ',' + z];
      if (!p || !p.crop || p.water) continue;
      p.water = true; g.world.setPlot(x, z, p); n++;
      s.today.annaffiate = (s.today.annaffiate || 0) + 1;
      s.today.irrigate = (s.today.irrigate || 0) + 1;
      g.emit('azione', { tipo: 'annaffia' });
    }
    if (n) { st.stato.turbina = clamp((st.stato.turbina ?? 100) - ATTREZZI.turbina.usura * n, 0, 100); g.audio.sfx('water'); }
  }

  // distanza dall'acqua più vicina: canale a nord, laghetto a sud-ovest
  _acqua(x, z) {
    const canale = Math.max(0, z - 6);
    const lx = (x - 35) / 7, lz = (z - 83.5) / 5.5;
    const lago = Math.max(0, (Math.hypot(lx, lz) - 1) * 6);
    return Math.min(canale, lago);
  }

  // consegna del raccolto: il grano lo compra il consorzio, il mais va nello zaino (si vende alla cassa)
  _consegna(crop, n, msg = true) {
    const g = this.game, s = this.s;
    if (!n) return 0;
    if (crop === 'grano') {
      const tot = Math.round(n * L.prezzoGrano * (1 + g.prog.bonus('vendite')));
      s.money += tot; s.today.venduto = (s.today.venduto || 0) + tot;
      g.stagioni?.conta('granoVenduto', tot);
      g.emit('venduto', { tot, grano: n });
      if (msg) g.ui.toast(`${B.scarico} Il consorzio paga ${n} zolle di grano: +${tot}€`, 'good');
      return tot;
    }
    s.inv.mais = (s.inv.mais || 0) + n;
    if (msg) g.ui.toast(`${B.scarico} +${n} pannocchie nello zaino: vendile alla cassa.`, 'good');
    return 0;
  }

  // ---------- Ogni fotogramma ----------
  _frame(dt) {
    this.t += dt;
    const g = this.game, V = g.vehicles;
    if (!V) return;
    for (const v of V.list) if (v.kind === 'trattore') this._posaAttrezzo(v);
    // al fienile si scarica il cassone
    const v = V.driving, c = this.st.cassone;
    if (v && v.kind === 'trattore' && c.mais + c.grano > 0 && this.fienile) {
      const f = this.fienile;
      const dx = Math.max(0, f.x0 - v.st.x, v.st.x - (f.x0 + f.w)), dz = Math.max(0, f.z0 - v.st.z, v.st.z - (f.z0 + f.d));
      if (Math.hypot(dx, dz) < 3) {
        this._consegna('grano', c.grano); this._consegna('mais', c.mais);
        c.grano = 0; c.mais = 0; g.audio.sfx('coin');
      }
    }
    // goccioline della turbina
    if (v && v._spray > 0 && this.su(v.id) === 'turbina') {
      this._dropT = (this._dropT || 0) - dt;
      if (this._dropT <= 0) { this._dropT = 0.04; this._goccia(v); }
    }
    for (const d of [...this.drops]) {
      d.life -= dt; d.vy -= 9 * dt;
      d.s.position.x += d.vx * dt; d.s.position.z += d.vz * dt; d.s.position.y = Math.max(0, d.s.position.y + d.vy * dt);
      if (d.life <= 0) { d.s.visible = false; this.drops.splice(this.drops.indexOf(d), 1); this._pool.push(d.s); }
    }
  }

  _goccia(v) {
    const W = this.game.world;
    this._pool ??= [];
    this._dropTex ??= PIX.toTexture(dropArt());
    let s = this._pool.pop();
    if (!s) { if (this.drops.length > 60) return; s = W.sprite(this._dropTex, { w: 0.18, h: 0.18, anchorBottom: false }); W.scene.add(s); }
    s.visible = true;
    const a = this.t * 5 + Math.random() * 0.6;
    s.position.set(v.st.x - Math.cos(v.st.h) * 1.5, 1.9, v.st.z - Math.sin(v.st.h) * 1.5);
    this.drops.push({ s, life: 0.7, vx: Math.cos(a) * 3.4, vz: Math.sin(a) * 2.2, vy: 2.5 });
  }

  // lo sprite dell'attrezzo segue il trattore e cambia vista con lui
  _posaAttrezzo(v) {
    const a = this.su(v.id), W = this.game.world;
    let sp = this.spr[v.id];
    if (!a) { if (sp) sp.visible = false; return; }
    const view = v.view || 'R';
    const key = a + view;
    this._tex ??= {};
    if (!this._tex[key]) { const c = attrezzoArt(a, view); this._tex[key] = { t: PIX.toTexture(c), w: c.width / VPX, h: c.height / VPX }; }
    const T = this._tex[key];
    if (!sp) { sp = W.sprite(T.t, { w: T.w, h: T.h }); W.scene.add(sp); this.spr[v.id] = sp; }
    if (sp.userData.key !== key) {
      sp.userData.key = key; sp.material.map = T.t; sp.material.needsUpdate = true; sp.scale.set(T.w, T.h, 1);
    }
    sp.visible = true;
    const front = a === 'falciatrice';
    const side = view === 'R' || view === 'L';
    const dist = side ? (front ? 2.3 : 2.35) : (front ? 1.3 : 1.25);
    const dir = front ? 1 : -1;
    const bob = v === this.game.vehicles.driving && Math.abs(v.speed) > 0.5 ? (Math.floor(this.t * 14) % 2) / VPX : 0;
    sp.position.set(v.st.x + Math.cos(v.st.h) * dist * dir, bob, v.st.z + Math.sin(v.st.h) * dist * dir + (view === 'B' && !front ? 0.05 : 0));
  }

  // ---------- Nuovo giorno: il noleggio finisce ----------
  _nuovoGiorno() {
    const st = this.st;
    for (const [id, d] of Object.entries(st.noleggio)) {
      if (d === this.s.day) continue;
      delete st.noleggio[id];
      if (!st.posseduti[id]) {
        for (const t of TRATTORI) if (st.su[t] === id) st.su[t] = null;
        this.game.ui.toast(`Zeno è passato a riprendersi ${id === 'turbina' ? 'la turbina' : 'la falciatrice'} a noleggio.`);
      }
    }
  }

  // ---------- Menu della tettoia (rastrelliera) ----------
  _trattoriVicini() {
    const R = L.rastrelliera, V = this.game.vehicles;
    return TRATTORI.map(id => V.get(id)).filter(v => v && Math.hypot(v.st.x - R.x, v.st.z - R.z) < 10);
  }

  async apriRastrelliera() { await this.game.ui.dialog([this._paginaRastrelliera()]); }

  _paginaRastrelliera(msg) {
    const g = this.game, s = this.s, st = this.st;
    const vicini = this._trattoriVicini();
    const desc = TRATTORI.map(id => {
      const a = this.su(id);
      return `${nomeT(id)}: ${a ? ATTREZZI[a].nome + ' ' + Math.round(st.stato[a] ?? 100) + '%' : 'niente'} · gasolio ${Math.round(this.gasolio(id))}%`;
    }).join('\n');
    const choices = [];
    for (const id of TRATTORI) {
      const ok = vicini.some(v => v.id === id);
      choices.push({
        label: ok ? `Cambia attrezzo al ${nomeT(id)}` : `Il ${nomeT(id)} è lontano: portalo qui`,
        disabled: !ok,
        fn: () => [this._paginaAggancio(id)],
      });
    }
    const daRiempire = vicini.filter(v => this.gasolio(v.id) < 95);
    const costo = daRiempire.length * L.pienoPrezzo;
    choices.push({
      label: daRiempire.length ? `Gasolio dalla cisterna ai trattori qui (${costo}€)` : 'Gasolio: i trattori qui sono pieni',
      disabled: !daRiempire.length || s.money < costo,
      fn: () => {
        s.money -= costo; s.minutes += L.pienoMinuti;
        daRiempire.forEach(v => { st.gasolio[v.id] = 100; });
        s.today.manutenzione = (s.today.manutenzione || 0) + 1;
        g.audio.sfx('coin');
        return [this._paginaRastrelliera('Pieno fatto. Il gasolio agricolo puzza, ma costa meno.')];
      },
    });
    choices.push(...this._sceltaSemente(L.sementePrezzoConsorzio, 'consorzio', () => this._paginaRastrelliera('Il consorzio ha portato la semente. Con calma, ma l\'ha portata.')));
    choices.push({ label: 'Esci', fn: null });
    return { who: 'garonio', name: 'Tettoia degli attrezzi', text: (msg ? msg + '\n' : '') + desc, choices };
  }

  // menu rapido dal trattore (tasto R o pulsante 🔧): scegli l'attrezzo senza andare alla tettoia
  async apriDaTrattore(idT) { await this.game.ui.dialog([this._paginaAggancio(idT, true)]); }

  _paginaAggancio(idT, rapido = false) {
    const g = this.game, s = this.s;
    const fine = msg => { if (!rapido) return [this._paginaRastrelliera(msg)]; g.ui.toast(msg, 'good'); return null; };
    const choices = Object.keys(ATTREZZI).filter(a => this.ha(a)).map(a => {
      const D = ATTREZZI[a], ok = D.trattori.includes(idT), cur = this.su(idT) === a;
      return {
        label: cur ? `${D.icona} ${D.nome} (già agganciato)` : ok ? `${D.icona} Aggancia ${D.nome.toLowerCase()}: ${D.lavoro}` : `${D.icona} ${D.nome}: solo sul ${D.trattori.map(nomeT).join(' o ')}`,
        disabled: cur || !ok,
        fn: () => {
          this.aggancia(idT, a); s.minutes += 10; g.audio.sfx('dig');
          return fine(`${D.icona} ${D.nome} agganciat${/(a|ice)$/.test(D.nome) ? 'a' : 'o'} al ${nomeT(idT)}.`);
        },
      };
    });
    if (this.su(idT)) choices.push({ label: 'Sgancia e lascia il trattore libero', fn: () => { this.st.su[idT] = null; s.minutes += 5; return fine('Attrezzo sganciato.'); } });
    choices.push(rapido ? { label: 'Chiudi', fn: null } : { label: 'Indietro', fn: () => [this._paginaRastrelliera()] });
    const cur = this.su(idT);
    const text = rapido ? `Ora c'è: ${cur ? ATTREZZI[cur].icona + ' ' + ATTREZZI[cur].nome : 'niente'}. Cosa ci attacco? (10 minuti)` : 'Cosa ci attacco?';
    return { who: 'garonio', name: `Attrezzi · ${nomeT(idT)}`, text, choices };
  }

  _sceltaSemente(prezzo, chi, back) {
    const g = this.game, s = this.s, st = this.st;
    const compra = n => () => {
      s.money -= prezzo * n; st.semente += n * L.sementeSacco; g.audio.sfx('coin');
      g.ui.toast(`+${n} sacc${n === 1 ? 'o' : 'hi'} di semente (${Math.ceil(st.semente / L.sementeSacco)} in tutto)`, 'good');
      if (chi === 'bubetto') g.png.cambiaAmicizia('bubetto', 1);
      return back ? [back()] : null;
    };
    const out = [{ label: `Sacco di semente (${prezzo}€) · ne hai ${Math.ceil(st.semente / L.sementeSacco)}`, disabled: s.money < prezzo, fn: compra(1) }];
    if (chi === 'bubetto') out.push({ label: `Cinque sacchi di semente (${prezzo * 5 - 5}€, sconto amici)`, disabled: s.money < prezzo * 5 - 5, fn: () => { s.money += 5; return compra(5)(); } });
    return out;
  }

  // ---------- Zeno: compra, noleggia, ripara ----------
  _paginaZeno(msg) {
    const g = this.game, s = this.s, st = this.st;
    const choices = [];
    for (const [a, D] of Object.entries(ATTREZZI)) {
      if (!st.posseduti[a] && D.prezzo) choices.push({
        label: `Compra ${D.nome.toLowerCase()} (${D.prezzo}€): ${D.lavoro}`, disabled: s.money < D.prezzo,
        fn: () => { s.money -= D.prezzo; st.posseduti[a] = true; st.stato[a] = 100; g.audio.sfx('coin'); return [this._paginaZeno(`${D.nome} tua. Si aggancia sotto la tettoia. Niente garanzia.`)]; },
      });
      if (!st.posseduti[a] && D.noleggio && st.noleggio[a] !== s.day) choices.push({
        label: `Noleggia ${D.nome.toLowerCase()} per oggi (${D.noleggio}€)`, disabled: s.money < D.noleggio,
        fn: () => { s.money -= D.noleggio; st.noleggio[a] = s.day; st.stato[a] ??= 100; g.audio.sfx('coin'); return [this._paginaZeno('Te la lascio sotto la tettoia. Stasera la rivoglio, e pulita.')]; },
      });
      if (this.ha(a) && (st.stato[a] ?? 100) < 100) {
        const prezzo = Math.ceil((100 - st.stato[a]) * L.riparaPerPunto);
        choices.push({
          label: `Ripara ${D.nome.toLowerCase()} (${prezzo}€): stato ${Math.round(st.stato[a])}%`, disabled: s.money < prezzo,
          fn: () => { s.money -= prezzo; st.stato[a] = 100; s.minutes += 45; s.today.manutenzione = (s.today.manutenzione || 0) + 1; g.audio.sfx('coin'); return [this._paginaZeno('Sistemato. Se fa ancora rumore, alza la radio.')]; },
        });
      }
    }
    for (const [u, U] of Object.entries(UPGRADE_ATTREZZI)) if (!st.upg[u] && st.posseduti[U.serve]) choices.push({
      label: `${U.nome} (${U.prezzo}€): ${U.desc}`, disabled: s.money < U.prezzo,
      fn: () => { s.money -= U.prezzo; st.upg[u] = true; g.audio.sfx('coin'); return [this._paginaZeno(`${U.nome}: fatto. Te l'ho saldato io, quindi regge. Credo.`)]; },
    });
    choices.push({ label: 'Indietro', fn: null });
    return { who: 'zeno', name: 'Zeno il meccanico', text: msg || 'Attrezzi? Ne ho. Costano. Tutto costa.', choices };
  }

  // la rastrelliera dentro l'officina (lavoro A, interni) fa lo stesso menu
  _agganciaInterni() {
    const I = this.game.interni;
    if (!I?.aggancia || this._interniOk) return;
    this._interniOk = true;
    I.aggancia('officina:rastrelliera', () => this.apriRastrelliera());
  }
}

// ---------- Pixel art ----------
const INK = '#1a1420';
function outline(c) {
  const g = c.getContext('2d'), { width: w, height: h } = c;
  const d = g.getImageData(0, 0, w, h).data;
  const a = (x, y) => (x < 0 || y < 0 || x >= w || y >= h) ? 0 : d[(y * w + x) * 4 + 3];
  g.fillStyle = INK;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!a(x, y) && (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1))) g.fillRect(x, y, 1, 1);
  return c;
}
function pen(w, h) {
  const [c, g] = PIX.makeCanvas(w, h);
  const P = (col, x, y, ww = 1, hh = 1) => { g.fillStyle = col; g.fillRect(x, y, ww, hh); };
  const disc = (cx, cy, r, col) => { g.fillStyle = col; for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) if (x * x + y * y <= r * r + r * 0.6) g.fillRect(cx + x, cy + y, 1, 1); };
  return { c, g, P, disc };
}

// view: R (verso destra), L, F (verso la camera), B (di spalle)
export function attrezzoArt(a, view) {
  const side = view === 'R' || view === 'L';
  const c = side ? attrezzoSide(a) : attrezzoFront(a);
  // lato: l'arte è disegnata col trattore a sinistra (attrezzo dietro, falciatrice davanti) per la vista R
  return view === 'L' ? PIX.mirror(c) : c;
}

function attrezzoSide(a) {
  if (a === 'aratro') {
    const d = pen(34, 22), { P } = d;
    P('#3a3a40', 20, 6, 14, 3);                // attacco a tre punti
    P('#c83a2a', 2, 8, 26, 4); P('#e05a40', 2, 8, 26, 1);
    for (const x of [4, 12, 20]) { P('#7a7a82', x, 12, 3, 6); P('#b8b8c0', x - 2, 17, 6, 3); P('#e8e8ee', x - 2, 17, 3, 1); }
    return outline(d.c);
  }
  if (a === 'seminatrice') {
    const d = pen(34, 30), { P, disc } = d;
    P('#3a3a40', 26, 14, 8, 3);
    P('#2a6ab0', 4, 4, 22, 12); P('#4a8ad0', 4, 4, 22, 2); P('#1a4a80', 4, 14, 22, 2);
    P('#f0d040', 8, 8, 14, 3);                  // scritta gialla
    for (const x of [6, 11, 16, 21]) P('#5a5a62', x, 16, 2, 8);
    disc(15, 25, 4, '#26262a'); disc(15, 25, 1, '#8a8a92');
    return outline(d.c);
  }
  if (a === 'falciatrice') {
    const d = pen(38, 30), { P, disc } = d;
    P('#3a3a40', 0, 14, 8, 3);                  // braccio verso il trattore
    P('#d8a020', 8, 16, 28, 9); P('#f0c040', 8, 16, 28, 2);
    for (let x = 9; x < 36; x += 3) P('#9a9aa2', x, 25, 2, 3);   // denti
    disc(22, 11, 7, '#c83a2a'); disc(22, 11, 4, '#e05a40');        // aspo rotante
    P('#5a1a12', 15, 11, 15, 1); P('#5a1a12', 22, 4, 1, 15);
    return outline(d.c);
  }
  // turbina: rullo col tubo e cannone sopra
  const d = pen(36, 40), { P, disc } = d;
  P('#3a3a40', 28, 26, 8, 3);
  P('#c8c8d0', 6, 22, 22, 12); P('#e8e8ee', 6, 22, 22, 2);
  disc(17, 26, 8, '#3a7a3a'); disc(17, 26, 5, '#2a5a2a'); disc(17, 26, 2, '#9a9aa2');
  P('#7a7a82', 16, 6, 3, 16); P('#9a9aa2', 10, 4, 12, 3); P('#5a5a62', 8, 3, 3, 4);
  disc(9, 36, 3, '#26262a'); disc(25, 36, 3, '#26262a');
  return outline(d.c);
}

function attrezzoFront(a) {
  if (a === 'aratro') {
    const d = pen(56, 20), { P } = d;
    P('#c83a2a', 4, 4, 48, 4); P('#e05a40', 4, 4, 48, 1);
    for (const x of [8, 22, 36, 48]) { P('#7a7a82', x - 1, 8, 3, 7); P('#b8b8c0', x - 3, 14, 7, 4); }
    return outline(d.c);
  }
  if (a === 'seminatrice') {
    const d = pen(56, 26), { P } = d;
    P('#2a6ab0', 4, 2, 48, 12); P('#4a8ad0', 4, 2, 48, 2); P('#f0d040', 18, 6, 20, 3);
    for (let x = 6; x < 52; x += 6) P('#5a5a62', x, 14, 2, 8);
    P('#26262a', 2, 18, 5, 8); P('#26262a', 49, 18, 5, 8);
    return outline(d.c);
  }
  if (a === 'falciatrice') {
    const d = pen(64, 24), { P } = d;
    P('#d8a020', 2, 10, 60, 10); P('#f0c040', 2, 10, 60, 2);
    P('#c83a2a', 6, 3, 52, 6); P('#e05a40', 6, 3, 52, 1);
    for (let x = 8; x < 58; x += 5) P('#5a1a12', x, 3, 1, 6);
    for (let x = 3; x < 62; x += 3) P('#9a9aa2', x, 20, 2, 3);
    return outline(d.c);
  }
  const d = pen(40, 40), { P, disc } = d;
  P('#c8c8d0', 4, 20, 32, 12); disc(20, 25, 8, '#3a7a3a'); disc(20, 25, 4, '#2a5a2a');
  P('#7a7a82', 19, 4, 3, 16); P('#9a9aa2', 14, 2, 13, 3);
  P('#26262a', 2, 30, 6, 9); P('#26262a', 32, 30, 6, 9);
  return outline(d.c);
}

function rackArt() {
  const d = pen(44, 30), { P, disc } = d;
  // cisterna verde del gasolio
  P('#3a7a3a', 26, 8, 16, 14); P('#5a9a5a', 26, 8, 16, 3); P('#2a5a2a', 26, 19, 16, 3);
  P('#f0d040', 29, 12, 10, 3); P('#5a5a62', 28, 22, 2, 7); P('#5a5a62', 38, 22, 2, 7);
  P('#26262a', 22, 14, 4, 2); P('#26262a', 21, 14, 2, 8);
  // rastrelliera di legno con gli attrezzi a mano appesi
  P('#7a4a26', 1, 6, 3, 23); P('#7a4a26', 18, 6, 3, 23); P('#9a6a3a', 1, 8, 20, 3); P('#9a6a3a', 1, 18, 20, 3);
  P('#9a9aa2', 5, 2, 2, 16); P('#c8c8d0', 3, 16, 6, 3);     // forca
  P('#6a3a1a', 11, 3, 2, 15); P('#9a9aa2', 9, 3, 6, 3);      // rastrello
  disc(15, 24, 3, '#26262a');
  return outline(d.c);
}

function dropArt() {
  const [c, g] = PIX.makeCanvas(4, 4);
  g.fillStyle = '#9ad4ff'; g.fillRect(1, 0, 2, 4); g.fillRect(0, 1, 4, 2);
  g.fillStyle = '#e8f6ff'; g.fillRect(1, 1, 1, 1);
  return c;
}
