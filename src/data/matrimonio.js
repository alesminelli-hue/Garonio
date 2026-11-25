// =====================================================================
//  MATRIMONIO E DIVORZIO (src/matrimonio.js, GDD capitolo 28.2)
//  - Una ragazza conquistata (src/ragazze.js) si può chiedere in sposa: anello, e il matrimonio è il giorno dopo
//    alle 11 in chiesa (tra le 10 e le 13, all'altare). Ci sono Don Peppino, la Mamma, il Gigante e mezzo paese.
//  - Da sposato: ogni mattina stress più basso e a volte un pranzo al sacco.
//  - Per sposarne un'altra bisogna divorziare all'Anagrafe del comune (8-13) e pagare gli alimenti ogni giorno.
//  Tutto comico, niente di esplicito: gli sposi si sbaciucchiano e basta.
// =====================================================================

export const NOZZE = {
  anello: 1500,              // prezzo dell'anello (si paga quando si chiede)
  affinita: 70,              // affinità minima perché dica sì
  ore: [10, 13],             // quando si può celebrare, il giorno dopo
  stressNozze: -40, xpNozze: 150,
  stressGiorno: -6,          // ogni mattina, da sposato
  pranzo: 0.35,              // probabilità del pranzo al sacco della mattina
  pranzi: ['panino', 'tortaMele', 'zabaione'],
  saltato: -30,              // affinità se Garonio non si presenta
  avvocato: 2500,            // divorzio
  alimenti: 60,              // al giorno, per ogni ex moglie
  anagrafe: { x: 30.3, z: 47.2 },
  // dove stanno nella chiesa (coordinate locali dell'interno «chiesa», src/data/interni.js)
  prete: { x: 6.5, z: 2.0 },
  sposo: { x: 6.1, z: 2.9 }, sposa: { x: 7.0, z: 2.9 },
  invitati: [
    ['gigante', 3.2, 3.8], ['mamma', 4.4, 3.8], ['patata', 9.0, 3.8], ['loredana', 10.3, 3.8],
    ['rodella', 2.2, 5.3], ['sergente', 3.6, 5.3], ['camper', 8.6, 5.3], ['frank', 10.0, 5.3],
    ['conte', 2.6, 6.8], ['concetta', 4.2, 6.8], ['postino', 9.2, 6.8], ['ivan', 10.8, 6.8],
  ],
};

export const TESTI_NOZZE = {
  proposta: '💍 Chiedile di sposarti (anello {prezzo}€)',
  propostaNo: "«Garonio... sei dolce. Ma sposarti? Conosciamoci meglio. Tipo altri dieci anni.» (serve più affinità)",
  propostaSi: [
    "Garonio si inginocchia. Il ginocchio scrocchia. Lei ride, poi vede l'anello e smette di ridere.",
    "«Sì! SÌ! Ma domani, alle undici, in chiesa. Se arrivi tardi ti sposo lo stesso, ma poi ti uccido.»",
  ],
  pocoSoldi: "L'anello costa {prezzo}€. Garonio ha in tasca un anello di latta delle patatine. Meglio di no.",
  promemoria: "💒 Oggi ti sposi con {nome}! In chiesa tra le 10 e le 13: vai all'altare.",
  celebra: '💒 Sposati con {nome}',
  saltato: "💔 Non ti sei presentato in chiesa. {nome} ha aspettato fino all'una con il bouquet in mano. In paese non si parla d'altro.",
  // la cerimonia: chi = id del personaggio (o 'sposa'), testo
  cerimonia: [
    { chi: null, testo: "Chiesa di San Garonio, ore undici. Fiori di campo, il tappeto rosso un po' spelacchiato e mezzo paese sui banchi. Il campanile suona da solo: è Ivan che si è appeso alla corda." },
    { chi: 'mamma', testo: "(soffiandosi il naso in un fazzoletto grande come una tovaglia) «Il mio bambino... il mio bambino si sposa... Ho portato le lasagne. Sono in macchina. Sei teglie.»" },
    { chi: 'gigante', testo: "(in giacca, per la prima volta dal 1987) «Garonio. Stai dritto. E se dice di no, il trattore te lo riprendo.»" },
    { chi: 'donPeppino', testo: "«Carissimi, siamo qui riuniti... Patata, smetti di mangiare i confetti, sono per dopo... siamo qui riuniti per unire Garonio e {nome} nel santo vincolo del matrimonio.»" },
    { chi: 'rodella', testo: "(sottovoce, dal terzo banco) «Garonio! Psst! Il regalo di nozze è il trattore arancione. A rate. Sessanta rate. Ne parliamo dopo.»" },
    { chi: 'donPeppino', testo: "«Se qualcuno ha qualcosa in contrario, parli ora o taccia per sempre.»" },
    { chi: 'sergente', testo: "«IO HO QUALCOSA IN CONTRARIO: QUELLA PANCIA! VENTI FLESSIONI PRIMA DEL SÌ!»" },
    { chi: 'donPeppino', testo: "«...Il Sergente non conta. Garonio, vuoi tu prendere {nome} come tua sposa, nella buona e nella cattiva sorte, nella salute e nella malattia, nella semina e nel raccolto?»" },
  ],
  risposte: [
    { t: '«Sì, lo voglio.»', r: "Un applauso parte dal fondo. È il Conte. Applaude a tutto, anche ai funerali." },
    { t: '«Sì! Lo voglio! Più delle lasagne!»', r: "La Mamma sviene di gioia. La rianimano con un confetto." },
    { t: '«Posso pensarci un attimo?»', r: "Il Gigante si alza in piedi. Tutto il banco scricchiola. «...Sì, lo voglio», dice Garonio, in fretta." },
  ],
  fine: [
    { chi: 'sposa', testo: "«Sì, lo voglio. E lo voglio anche quando russa. Più o meno.»" },
    { chi: 'donPeppino', testo: "«Per il potere conferitomi dalla Chiesa, dal Comune e dalla Pro Loco, vi dichiaro marito e moglie. Puoi baciare la sposa. Con decenza, siamo in chiesa.»" },
    { chi: null, testo: "Garonio e {nome} si sbaciucchiano. Il Patata piange. Mister Frank spara un colpo in aria dalla contentezza, fuori, per fortuna. Loredana lancia il riso. È riso per risotto, ma va bene lo stesso." },
    { chi: 'gigante', testo: "(stringendoti la mano fino a farti male) «Bravo. Adesso sei un uomo. Domani alle sei nei campi, come sempre.»" },
  ],
  sposati: "💍 Sposato con {nome}! Stress {stress} · +{xp} XP. Ogni mattina, da oggi, un po' meno stress.",
  mattino: [
    "☕ {nome} ti ha fatto il caffè. Stress {stress}.",
    "🥰 {nome} ti saluta dalla finestra. Stress {stress}.",
    "📝 {nome} ti ha lasciato un biglietto: «Non tornare tardi. E lavati i piedi.» Stress {stress}.",
  ],
  pranzo: "🧺 {nome} ti ha preparato il pranzo al sacco: {cosa}.",
  sposataGia: '💍 Sei sposato con {nome}. Per sposarne un\'altra devi prima divorziare, all\'Anagrafe del comune.',
  // Anagrafe e divorzio
  anagrafeTitolo: '🏛️ Anagrafe',
  anagrafeChiusa: "L'Anagrafe apre dalle 8 alle 13. Sul vetro: «Per divorzi, nascite e lamentele: prendere il numero».",
  impiegato: 'Il ragionier Cavilli',
  anagrafe: [
    "«Anagrafe, buongiorno. Nascite allo sportello uno, matrimoni al due, divorzi al tre. Lo sportello tre sono sempre io, ma con la faccia più seria.»",
    "«Ah, Garonio. Certificato di residenza? Stato di famiglia? Pentimento?»",
  ],
  divorzia: '⚖️ Divorzia da {nome} (avvocato {avvocato}€, poi {alimenti}€ di alimenti al giorno)',
  divorzioFatto: [
    "Il ragionier Cavilli timbra quattro moduli in silenzio. Poi alza gli occhi: «Mi dispiace. Cioè, a me no. Ma in generale sì.»",
    "«Alimenti: {alimenti}€ al giorno, ogni mattina, a {nome}. Se non paghi, ti cerca. E ti trova. Ha il numero di tua madre.»",
  ],
  nonSposato: "«Lei non risulta sposato. Risulta solo... confuso.»",
  pocoAvvocato: "L'avvocato costa {avvocato}€. Senza soldi, al massimo un divorzio a voce. Non vale.",
  alimenti: '💸 Alimenti alle ex: −{tot}€.',
  alimentiNo: '💸 Non hai i soldi per gli alimenti ({tot}€): le ex ti chiamano tutte insieme. Stress +10.',
};
