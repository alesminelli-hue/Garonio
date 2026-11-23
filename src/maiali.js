// I maiali veri dei capannoni (GDD 17.3 e 18.1): nome, peso, salute, umore.
// Si nutrono, si puliscono i box, si curano, partoriscono in primavera, vanno alla fiera in autunno
// e al salumificio d'inverno. Di giorno girano nel recinto davanti ai capannoni.
// Testi e numeri in src/data/stagioni.js (MAIALI).
//
// API (game.maiali):
//   lista()            [{ id, nome, sesso, peso, salute, umore, malato, incinta, maialino }]
//   apri()             menu dei capannoni (porta del capannone, recinto, interni)
//   sani()             quanti maiali sani ci sono
//   arriva()           fa arrivare i primi 4 (lo fa da solo il giorno 3)
// Eventi: maiale { evento: 'arrivati' | 'nutriti' | 'puliti' | 'malato' | 'curato' | 'morto' | 'parto' | 'fiera' | 'venduto', nome }
// Stato salvato in s.flags.maiali.
import * as PIX from './pixel.js';
import { MAIALI as M, STAGIONI } from './data/stagioni.js';
import { ZONES } from './map.js';
import { pick, fill, pagine } from './racconto.js';

const H = 60;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const rand = (a, b) => a + Math.random() * (b - a);
const RECINTO = ZONES.find(z => z.name === 'Recinto dei maiali') || { x0: 128, x1: 152, z0: 73, z1: 83, gate: [138, 141] };

export class Maiali {
  constructor(game) { this.game = game; this.attori = new Map(); }
  get s() { return this.game.s; }
  get st() { return this.s.flags.maiali; }

  init() {
    this.s.flags.maiali ??= {
      arrivati: false, lista: [], mangime: M.mangimeIniziale, sporco: 0, prossimo: 1,
      nutritiOggi: false, pulitiOggi: false, rinfrescatiOggi: false, partoGiorno: null, fiere: [],
    };
    const g = this.game;
    g.on('nuovoGiorno', () => this._giorno());
    g.moduli.push({ animate: dt => this._frame(dt) });
    // E vicino al cancello del recinto
    const gx = (RECINTO.gate[0] + RECINTO.gate[1]) / 2, gz = RECINTO.z0 - 0.4;
    g.bersagli.push(() => {
      if (g.vehicles.driving || !this.st.arrivati) return null;
      const P = g.player.group.position;
      return Math.hypot(P.x - gx, P.z - gz) < 1.6 ? { label: 'Guarda i maiali nel recinto', fn: () => this.apri() } : null;
    });
    this._agganciaInterni();
    g.on('entrato', () => this._agganciaInterni());
  }

  lista() { return this.st.lista.map(p => ({ ...p, maialino: p.sesso === 'maialino' })); }
  sani() { return (this.st?.lista || []).filter(p => p.salute >= M.saluteSano && !p.malato).length; }
  _info(p) { return `${p.nome}${p.sesso === 'maialino' ? ' (maialino)' : ''} ${Math.round(p.peso)}kg ❤${Math.round(p.salute)} ${p.umore >= 60 ? '🙂' : p.umore >= 30 ? '😐' : '😠'}${Math.round(p.umore)}${p.malato ? ' 🤒' : ''}${p.incinta ? ' 🤰' : ''}`; }

  _nuovo(def) {
    const p = { id: this.st.prossimo++, nome: def.nome, sesso: def.sesso, peso: def.peso, salute: def.salute ?? 85, umore: def.umore ?? 65, malato: false, incinta: !!def.incinta, x: rand(RECINTO.x0 + 1, RECINTO.x1 - 1), z: rand(RECINTO.z0 + 1, RECINTO.z1 - 1) };
    this.st.lista.push(p);
    return p;
  }

  arriva() {
    if (this.st.arrivati) return;
    this.st.arrivati = true;
    M.primi.forEach(d => this._nuovo(d));
    this.st.partoGiorno = this.s.day + 6;
    this.game.emit('maiale', { evento: 'arrivati' });
  }

  // ---------- Ogni mattina ----------
  _giorno() {
    const st = this.st, s = this.s, g = this.game;
    if (!st.arrivati) {
      if (s.day >= 3) this.arriva();
      return;
    }
    const caldo = this.s.flags.annata?.meteoIeri === 'caldo' && !st.rinfrescatiOggi && !s.upgrades?.ventilatori;
    st.sporco = clamp(st.sporco + M.sporcoAlGiorno, 0, 100);
    const avvisi = [];
    for (const p of [...st.lista]) {
      const piccolo = p.sesso === 'maialino';
      if (st.nutritiOggi) {
        p.peso += rand(...M.crescita) * (piccolo ? 1.5 : 1) * (p.umore >= 60 ? 1.2 : 1);
        p.umore += 5;
        if (!p.malato && st.sporco < 60) p.salute += 6;
      } else { p.salute -= 15; p.umore -= 15; p.peso -= 1; }
      if (st.sporco >= 60) {
        p.umore -= 10;
        if (!p.malato && Math.random() < M.malattia) { p.malato = true; avvisi.push(fill(M.battute.malato, { nome: p.nome })); g.emit('maiale', { evento: 'malato', nome: p.nome }); }
      }
      if (caldo) { p.salute -= 8; p.umore -= 10; }
      if (p.malato) p.salute -= 12;
      p.salute = clamp(p.salute, 0, 100); p.umore = clamp(p.umore, 0, 100);
      if (piccolo && p.peso >= 60) p.sesso = Math.random() < 0.5 ? 'scrofa' : 'maschio';
      if (p.salute <= 0) {
        st.lista.splice(st.lista.indexOf(p), 1);
        this._togliAttore(p);
        avvisi.push(fill(M.battute.morto, { nome: p.nome }));
        g.stagioni?.cambiaFiducia('maialeMorto');
        g.emit('maiale', { evento: 'morto', nome: p.nome });
      }
    }
    if (!st.nutritiOggi) avvisi.unshift(M.battute.fame);
    // parto senza nessuno a vegliare
    if (st.partoGiorno && s.day > st.partoGiorno) {
      const mamma = st.lista.find(p => p.incinta);
      if (mamma) { mamma.incinta = false; this._nascono(1); avvisi.push(M.partoSolo); g.emit('maiale', { evento: 'parto', nome: mamma.nome, vegliato: false }); }
      st.partoGiorno = null;
    }
    // ogni primavera una scrofa resta incinta
    const sg = g.stagioni?.info();
    if (sg && sg.chiave === 'primavera' && sg.giorno === 3 && s.day > 3 && !st.partoGiorno) {
      const scrofa = st.lista.find(p => p.sesso === 'scrofa' && !p.incinta);
      if (scrofa) { scrofa.incinta = true; st.partoGiorno = s.day + 6; }
    }
    st.nutritiOggi = false; st.pulitiOggi = false; st.rinfrescatiOggi = false;
    avvisi.forEach((t, i) => setTimeout(() => g.ui.toast(t, 'bad'), 1500 + i * 900));
  }

  _nascono(n) {
    const nomi = M.nomiMaialini;
    for (let i = 0; i < n; i++) this._nuovo({ nome: nomi[(this.st.prossimo + i) % nomi.length], sesso: 'maialino', peso: 8, salute: 90, umore: 80 });
  }

  // ---------- Il menu dei capannoni ----------
  async apri() {
    const g = this.game;
    if (!this.st.arrivati) {
      await g.ui.dialog([{ name: 'Capannone dei maiali', text: 'Box vuoti e puliti, per una volta. Il Gigante dice che i maiali arrivano col camion fra qualche giorno (il giorno 3).' }]);
      return;
    }
    await g.ui.dialog([this._pagina()]);
  }

  _ora() { return (this.s.minutes / H) % 24; }

  _fatica(kind) {
    const s = this.s, g = this.game;
    s.minutes += M.minuti[kind] || 0;
    s.tired = clamp(s.tired + (M.fatica[kind] || 0) * g.prog.fatica(), 0, 100);
    g.actT = 0.3; g.actName = 'work';
  }

  _pagina(msg) {
    const g = this.game, s = this.s, st = this.st;
    const meteo = g.stagioni?.info()?.meteo;
    const testa = `Maiali: ${st.lista.length} · mangime ${st.mangime} sacchi · box ${st.sporco < 30 ? 'puliti' : st.sporco < 60 ? 'così così' : 'SPORCHI'} (${st.sporco}%)${st.nutritiOggi ? ' · già mangiato' : ' · hanno fame'}`;
    const righe = st.lista.slice(0, 8).map(p => this._info(p)).join('\n');
    const choices = [];
    choices.push({
      label: st.nutritiOggi ? 'Dai da mangiare (fatto oggi)' : st.mangime > 0 ? 'Dai da mangiare (1 sacco di mangime)' : 'Dai da mangiare: mangime finito!',
      disabled: st.nutritiOggi || st.mangime <= 0,
      fn: () => this._nutri(),
    });
    choices.push({ label: `Ordina mangime al consorzio (${M.mangimePrezzo}€ al sacco)`, disabled: s.money < M.mangimePrezzo,
      fn: () => { s.money -= M.mangimePrezzo; st.mangime++; g.audio.sfx('coin'); return [this._pagina('Un sacco di mangime in più.')]; } });
    choices.push({ label: st.sporco < 10 ? 'Pulisci i box (sono già puliti)' : 'Pulisci i box (40 min, faticoso)', disabled: st.sporco < 10, fn: () => this._pulisci() });
    if (meteo === 'caldo' && !st.rinfrescatiOggi) choices.push({ label: 'Rinfresca i maiali con la canna', fn: () => {
      st.rinfrescatiOggi = true; this._fatica('rinfresca'); g.audio.sfx('water');
      st.lista.forEach(p => { p.umore = clamp(p.umore + 8, 0, 100); });
      return [this._pagina(pick(M.battute.rinfresca))];
    } });
    const malati = st.lista.filter(p => p.malato || p.salute < M.saluteSano);
    if (malati.length) choices.push({ label: `Cura i maiali che stanno male (${malati.length})`, fn: () => [this._paginaCure()] });
    // parto: di notte, il giorno giusto
    const h = this._ora();
    if (st.partoGiorno === s.day && st.lista.some(p => p.incinta)) {
      choices.push({ label: h >= 21 ? '🤰 Veglia la scrofa stanotte' : '🤰 Stanotte c\'è il parto (torna dopo le 21)', disabled: h < 21, fn: () => { this._veglia(); return null; } });
    }
    // fiera d'autunno
    if (this._fieraOggi()) choices.push({ label: '🏆 Porta i maiali alla fiera (3 ore)', disabled: h < 8 || h >= 18, fn: () => [this._fiera()] });
    const adulti = st.lista.filter(p => p.sesso !== 'maialino');
    if (adulti.length) choices.push({ label: this._inverno() ? '🥓 Vendi un maiale al salumificio' : 'Vendi un maiale al commerciante', fn: () => [this._paginaVendi()] });
    choices.push({ label: 'Esci', fn: null });
    return { name: 'Capannone dei maiali', text: (msg ? msg + '\n' : '') + testa + '\n' + righe, choices };
  }

  _nutri() {
    const g = this.game, st = this.st, s = this.s;
    st.mangime--; st.nutritiOggi = true; this._fatica('nutri'); g.audio.sfx('pick');
    s.today.maialiNutriti = 1;
    s.today.maialiAccuditi = (s.today.maialiAccuditi || 0) + 1;
    g._xp(3);
    g.emit('azione', { tipo: 'nutriMaiali' }); g.emit('maiale', { evento: 'nutriti' });
    return [this._pagina(pick(M.battute.nutri))];
  }

  _pulisci() {
    const g = this.game, st = this.st, s = this.s;
    st.sporco = 0; st.pulitiOggi = true; this._fatica('pulisci');
    s.stress = clamp(s.stress + 2, 0, 100);
    s.today.maialiAccuditi = (s.today.maialiAccuditi || 0) + 1;
    st.lista.forEach(p => { p.umore = clamp(p.umore + 6, 0, 100); });
    g._xp(4); g.audio.sfx('dig');
    g.emit('azione', { tipo: 'pulisciBox' }); g.emit('maiale', { evento: 'puliti' });
    return [this._pagina(pick(M.battute.pulisci))];
  }

  _paginaCure(msg) {
    const g = this.game, s = this.s, st = this.st;
    const choices = [];
    for (const p of st.lista.filter(p => p.malato || p.salute < M.saluteSano)) {
      choices.push({ label: `${p.nome}: veterinario (${M.veterinario}€)`, disabled: s.money < M.veterinario, fn: () => {
        s.money -= M.veterinario; return this._cura(p, `Il veterinario visita ${p.nome}, scuote la testa, fa una puntura e si fa pagare. ${p.nome} sta già meglio.`);
      } });
      if (g.prog.ha('pomata')) choices.push({ label: `${p.nome}: usa la pomata del veterinario`, fn: () => { g.prog.togliOggetto('pomata'); return this._cura(p, `Pomata spalmata. ${p.nome} ti guarda con disprezzo, ma guarisce.`); } });
    }
    choices.push({ label: 'Indietro', fn: () => [this._pagina()] });
    return { name: 'Infermeria', text: msg || 'Chi sta male?', choices };
  }

  _cura(p, testo) {
    const g = this.game;
    p.malato = false; p.salute = clamp(p.salute + 30, 0, 100);
    this._fatica('cura'); g.audio.sfx('pick'); g._xp(3);
    g.emit('maiale', { evento: 'curato', nome: p.nome });
    return [this._paginaCure(testo)];
  }

  _veglia() {
    const g = this.game, st = this.st;
    const mamma = st.lista.find(p => p.incinta);
    setTimeout(async () => {
      await g.ui.dialog(pagine(M.partoVegliato));
      if (mamma) { mamma.incinta = false; mamma.umore = clamp(mamma.umore + 10, 0, 100); }
      this._nascono(4);
      st.partoGiorno = null;
      g.s.today.parto = 1;
      g._xp(25);
      g.emit('maiale', { evento: 'parto', nome: mamma?.nome, vegliato: true });
      g.ui.toast('Quattro maialini nati sani! Esperienza +25', 'good');
      g.sleep(true);   // Garonio torna a casa all'alba, distrutto
    }, 50);
  }

  _inverno() { return this.game.stagioni?.info()?.chiave === 'inverno'; }

  _paginaVendi(msg) {
    const g = this.game, s = this.s, st = this.st;
    const kg = this._inverno() ? M.prezzoKg.salumificio : M.prezzoKg.commerciante;
    const choices = st.lista.filter(p => p.sesso !== 'maialino').map(p => {
      const prezzo = Math.round(p.peso * kg * (0.6 + p.salute / 250) * (1 + g.prog.bonus('vendite')));
      return { label: `${p.nome}, ${Math.round(p.peso)}kg: ${prezzo}€`, fn: () => {
        st.lista.splice(st.lista.indexOf(p), 1); this._togliAttore(p);
        s.money += prezzo; s.today.venduto = (s.today.venduto || 0) + prezzo;
        s.today.maialiVenduti = (s.today.maialiVenduti || 0) + 1;
        g.stagioni?.conta('maialiVenduti');
        g.audio.sfx('coin');
        g.emit('venduto', { tot: prezzo, maiale: p.nome }); g.emit('maiale', { evento: 'venduto', nome: p.nome });
        return [this._pagina(`${p.nome} è partito col camion${this._inverno() ? ' del salumificio' : ''}. +${prezzo}€. La Mamma piange un po'.`)];
      } };
    });
    choices.push({ label: 'Indietro', fn: () => [this._pagina()] });
    return { name: this._inverno() ? 'Salumificio' : 'Commerciante di maiali', text: msg || `Paga ${kg.toFixed(1)}€ al chilo (meno se il maiale sta male).${this._inverno() ? '' : ' D\'inverno il salumificio paga di più.'}`, choices };
  }

  _fieraOggi() {
    const i = this.game.stagioni?.info();
    return !!i && i.chiave === 'autunno' && i.evento === 'fiera' && !this.st.fiere.includes(i.anno);
  }

  _punteggio(p) { return p.salute * 0.4 + p.umore * 0.4 + clamp((p.peso - 80) / 3, 0, 20) - (p.malato ? 30 : 0); }

  _fiera() {
    const g = this.game, s = this.s, st = this.st;
    st.fiere.push(g.stagioni.info().anno);
    s.minutes += M.minuti.fiera;
    const top = st.lista.filter(p => p.sesso !== 'maialino').sort((a, b) => this._punteggio(b) - this._punteggio(a)).slice(0, 2);
    const premiati = top.filter(p => this._punteggio(p) >= M.sogliaFiera);
    const righe = top.map(p => `${p.nome}: ${Math.round(this._punteggio(p))} punti ${this._punteggio(p) >= M.sogliaFiera ? '🏆 PREMIATO' : '(niente)'}`).join('\n');
    s.money += premiati.length * M.premioFiera;
    if (premiati.length) { g.stagioni?.conta('maialiPremiati', premiati.length); g.audio.sfx('coin'); }
    g._xp(10 + premiati.length * 10);
    g.emit('maiale', { evento: 'fiera', premiati: premiati.map(p => p.nome) });
    const commento = premiati.length >= 2 ? 'Due coccarde! Il Gigante finge di non commuoversi.' : premiati.length ? 'Una coccarda. Il Gigante dice «meglio di niente» con la faccia di «niente».' : 'Niente coccarde. Il maiale del Patata ha vinto tutto. Il Patata non smette di sorridere.';
    return this._pagina(`Fiera di paese! I giudici annusano, pesano, guardano le orecchie.\n${righe}\n${commento}${premiati.length ? ` +${premiati.length * M.premioFiera}€` : ''}`);
  }

  // ---------- Il recinto ----------
  _frame(dt) {
    const st = this.st; if (!st?.arrivati) return;
    const h = this._ora(), fuori = h >= 7 && h < 19 && this.game.stagioni?.info()?.meteo !== 'neve';
    for (const p of st.lista) {
      let a = this.attori.get(p.id);
      if (!a) { a = this._attore(p); this.attori.set(p.id, a); }
      a.group.visible = fuori;
      if (!fuori) continue;
      if (p.wait > 0) { p.wait -= dt; a.setFrame(p.dir > 0 ? 0 : 2); }
      else if (p.tx == null) { p.tx = rand(RECINTO.x0 + 1, RECINTO.x1 - 1); p.tz = rand(RECINTO.z0 + 1, RECINTO.z1 - 1); }
      else {
        const dx = p.tx - p.x, dz = p.tz - p.z, d = Math.hypot(dx, dz);
        if (d < 0.08) { p.tx = null; p.wait = rand(1, 5); }
        else {
          const sp = Math.min(d, (p.sesso === 'maialino' ? 1.3 : 0.8) * dt);
          p.x += dx / d * sp; p.z += dz / d * sp; p.dir = dx >= 0 ? 1 : -1;
          a.setFrame((p.dir > 0 ? 0 : 2) + (Math.floor(performance.now() / 180) % 2));
        }
      }
      a.group.position.set(p.x, 0, p.z);
    }
  }

  _attore(p) {
    this._fr ??= [maiale(0), maiale(1)];
    const fr = this._fr, small = p.sesso === 'maialino' ? 0.6 : 1;
    return this.game.world.actor([fr[0], fr[1], PIX.mirror(fr[0]), PIX.mirror(fr[1])], { w: 22 / 16 * small, h: 15 / 16 * small, shadow: 0.45 * small });
  }
  _togliAttore(p) { const a = this.attori.get(p.id); if (a) { a.remove(); this.attori.delete(p.id); } }

  // ---------- Interni (lavoro A): box, mangime, sala parto, infermeria ----------
  _agganciaInterni() {
    const I = this.game.interni;
    if (!I?.aggancia || this._interniOk) return;
    this._interniOk = true;
    const g = this.game;
    I.aggancia('maiali:box', async ctx => {
      const p = this.st.lista[ctx?.box ?? 0];
      if (!p) { await g.ui.dialog([{ name: 'Box vuoto', text: 'Box vuoto. Odora ancora di maiale, però.' }]); return; }
      await g.ui.dialog([{ name: p.nome, text: this._info(p) + (p.malato ? '\nTossisce. Serve una cura.' : ''), choices: [
        { label: 'Grattagli la schiena (umore +5)', fn: () => { p.umore = clamp(p.umore + 5, 0, 100); g.s.minutes += 5; return null; } },
        ...(p.malato || p.salute < M.saluteSano ? [{ label: 'Curalo', fn: () => [this._paginaCure()] }] : []),
        { label: 'Tutti i maiali', fn: () => [this._pagina()] },
        { label: 'Ciao', fn: null },
      ] }]);
    });
    I.aggancia('maiali:mangime', () => this.apri());
    I.aggancia('maiali:parto', () => this.apri());
    I.aggancia('maiali:infermeria', async () => { await g.ui.dialog([this._paginaCure()]); });
  }
}

// maiale rosa, di lato verso destra
function maiale(frame) {
  const [c, g] = PIX.makeCanvas(22, 15);
  const P = (col, x, y, w, h) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  P('#f0a0a8', 3, 4, 15, 7); P('#f8c0c8', 4, 4, 12, 2); P('#d88088', 3, 9, 15, 2);  // corpo
  P('#f0a0a8', 15, 3, 5, 6); P('#e88890', 19, 5, 3, 3); P('#a04a52', 20, 6, 1, 1);  // testa e grugno
  P('#d88088', 15, 1, 3, 3);                                                          // orecchio
  P('#1a1420', 17, 4, 1, 1);                                                          // occhio
  P('#d88088', 1, 4, 2, 1); P('#d88088', 0, 3, 1, 1);                                 // codino
  const l = frame ? [[4, 1], [8, 0], [12, 1], [15, 0]] : [[4, 0], [8, 1], [12, 0], [15, 1]];
  for (const [x, o] of l) P('#c87078', x + o, 11, 2, 3);
  const out = document.createElement('canvas'); out.width = 22; out.height = 15;
  const og = out.getContext('2d'); og.drawImage(c, 0, 0);
  // contorno
  const d = g.getImageData(0, 0, 22, 15).data, a = (x, y) => x < 0 || y < 0 || x >= 22 || y >= 15 ? 0 : d[(y * 22 + x) * 4 + 3];
  og.fillStyle = '#1a1420';
  for (let y = 0; y < 15; y++) for (let x = 0; x < 22; x++) if (!a(x, y) && (a(x - 1, y) || a(x + 1, y) || a(x, y - 1) || a(x, y + 1))) og.fillRect(x, y, 1, 1);
  return out;
}
