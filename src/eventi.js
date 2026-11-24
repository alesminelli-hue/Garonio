// Piccolo sistema di eventi: i vari pezzi del gioco si parlano senza conoscersi.
// game.on('nemicoSconfitto', d => ...)   game.emit('nemicoSconfitto', { id: 'nutria' })
//
// Eventi che il gioco manda già (aggiungerne altri è libero, basta documentarli qui):
//   nuovoGiorno     { day }                    dopo il risveglio
//   ora             { ora }                    ogni ora di gioco piena
//   azione          { tipo }                   zappa, semina, annaffia, raccogli, uovo, nutri
//   raccolto        { crop, x, z }             pianta raccolta (pomodoro, mais)
//   venduto         { tot }                    vendita alla cassa
//   nemicoSconfitto { id, place }              uno per ogni nemico battuto
//   combattimento   { esito, place, nemici }   fine scontro: 'win' | 'lose' | 'flee'
//   missioneFatta   { id }  missioneFallita { id }   missioni del Gigante
//   livello         { level }                  Garonio sale di livello
//   entrato         { edificio }               entra in casa, officina, bar...
//   parlato         { png }                    finita una chiacchierata con un personaggio
//   oggetto         { id, n }                  oggetto aggiunto (n > 0) o tolto (n < 0) dallo zaino
//   secondaria      { id, stato }              missione secondaria: 'accettata' | 'pronta' | 'fatta' | 'fallita'
//   urto            { mezzo, tipo, danno, x, z, velocita, gestito }   un mezzo sbatte (vehicles.js); gestito = true lo «prende» chi ascolta
//   multa           { importo, tipo, pagata }  la Vigilessa fa una multa (src/vigilessa.js)
//   riparato        { mezzo, prezzo, fattura } Zeno ripara un mezzo (src/officina.js)
//   elaborazione    { mezzo, id, esito }       elaborazione di Zeno: 'ok' | 'male'
//   cabina          { esito, id }              schianto contro la cabina della corrente: 'niente' | 'comune' | 'leggendario' | 'scarica'
//   truffa          { tipo, vicino }           colpo truffaldino riuscito: 'acqua' | 'prestito' (src/cascine.js)
//   alberoAbbattuto { vicino }                 albero del confine abbattuto con la motosega del Gigante
//   palettoSpostato { vicino }                 paletto del confine spostato
//   truffaScoperta  { vicino, missione, esito }  un vicino ti ha beccato: esito 'scusa' | 'bugia' | 'scappa' | 'rissa'
//   rispetto        { valore, delta, rango }   Rispetto al bar cambiato (src/bar.js)
//   voce            { bestia, da }             un avventore racconta di una bestia leggendaria ('re_lupi', 're_nutrie')
//   avventore       { id, passo, fine }        avanza la storia di un avventore del bar
//   mappaCatastale  {}                         il Geometra dà la mappa catastale (tane sulla mappa grande)
//   rimorchio       {}                         Ermes presta il rimorchio
//   carroAttrezzi   { mezzo, prezzo, debito }  Zeno riporta in azienda un mezzo bloccato, rotto o a secco (src/officina.js)
//   mezzoRotto      { mezzo, tipo, x, z }      un mezzo si è appena rotto (vehicles.js); chi lo vede ride (src/derisione.js)
//   derisione       { chi, mezzo, reputazione } i paesani ti hanno visto rompere un mezzo
//   reBancone       {}                         Garonio batte Bruno: Re del bancone
//   bandoBar        { fino }                   regola di Loredana: bar chiuso per Garonio fino al giorno "fino"
//   briscola        { vinta, tuoi, suoi }      partita a briscola con Tarcisio
//   trovato         { id, dove }               raccolto l'oggetto nascosto indicato dal Consulente
//   consulente      { livello }                sale l'amicizia col Consulente
//   traccia         { bestia, luogo }          (ascoltato) segni di un re trovati altrove (es. negli interni)
//   tracciaBestia   { id, n, tot }             traccia di un re trovata sulla mappa
//   bestiaSconfitta { id }                     un re è stato battuto (trofeo già dato)
//   gruppo          { stato, membri, zona }    gruppo sulla mappa: 'comparso' | 'win' | 'lose' | 'flee'
//   clacson         { mezzo, x, z }            Garonio suona il clacson (scaccia i gruppi piccoli)
//   buca            { mezzo, danno, x, z }     un mezzo prende una buca (src/imprevisti.js)
//   randagio        { esito }                  il cane randagio: 'scacciato' | 'amico' | 'battuto'
//   impiccione      { png, scelta }            un paesano attacca bottone: 'ascolta' | 'taglia' | 'telefono'
//   paradiso        { id, prezzo, tranvione }  serata al Night Paradiso (src/paradiso.js)
//   pescato         { esito }                  pesca al laghetto (src/lavoretti.js); legna e pesca mandano anche azione { tipo }
//   sorpresa        { tipo, esito }            easter egg ed eventi casuali (src/sorprese.js)
//   gatto           {}                         Garonio accarezza un gatto (src/vita.js)
//   beccatoDormire  {}                         il Gigante becca Garonio che dorme in giro
//   collezionabile  { id, collezione, completa }  trovato un tappo, santino o figurina (src/diario.js)
//   trofeo          { id }                     preso un trofeo (src/diario.js)
//   telefono        { tipo, chi }              telefonino (src/telefono.js): 'risposta' | 'rifiutata' | 'persa' | 'chiamata' | 'sms'
//   annaffiato      { x, z }                   zolla annaffiata a mano
//   sconfitta       { place }                  Garonio va a terra in uno scontro (il santino non l'ha salvato)
//   comprato        { tipo, id, prezzo }       acquisto nel magazzino del Bubetto (src/negozio.js)
//   affilatura      { arma, grado, fregatura } Zeno ha affilato (fregatura: null | 'sovrapprezzo' | 'meta')
//   mercato         { banco, prodotto, n, tot } vendita a un banco del mercato del giovedì (src/mercato.js)
//   gara            { rivale, esito, tempo, posta }  gara di trattori: 'vinta' | 'persa' | 'ritirato' (src/gare.js)
//   scommessa       { tipo, posta, vinta, soldi }   scommessa del Consulente pagata (src/scommesse.js)
export class Eventi {
  constructor() { this._h = {}; }
  on(name, fn) { (this._h[name] ??= []).push(fn); return () => this.off(name, fn); }
  off(name, fn) { const l = this._h[name]; if (l) l.splice(l.indexOf(fn) >>> 0, 1); }
  emit(name, data = {}) {
    for (const fn of [...(this._h[name] || [])]) {
      try { fn(data); } catch (e) { console.error(`[eventi] ${name}`, e); }
    }
    for (const fn of [...(this._h['*'] || [])]) { try { fn(name, data); } catch (e) { console.error(e); } }
  }
}
