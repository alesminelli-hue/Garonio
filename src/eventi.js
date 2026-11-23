// Piccolo sistema di eventi: i vari pezzi del gioco si parlano senza conoscersi.
// game.on('nemicoSconfitto', d => ...)   game.emit('nemicoSconfitto', { id: 'nutria' })
//
// Eventi che il gioco manda già (aggiungerne altri è libero, basta documentarli qui):
//   nuovoGiorno     { day }                    dopo il risveglio
//   ora             { ora }                    ogni ora di gioco piena
//   azione          { tipo }                   zappa, semina, annaffia, raccogli, uovo, nutri
//   raccolto        { crop }                   pianta raccolta (pomodoro, mais)
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
