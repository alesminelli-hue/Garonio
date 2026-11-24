// =====================================================================
//  INCONTRI SPECIALI (src/speciali.js, GDD capitolo 25)
//  - Il Mostro della Palude: salta 100 volte sulla riva del laghetto e lui esce (boss livello 30, src/data/boss.js → BOSS.palude)
//  - Babbo Natale smemorato: certe notti appare nel bosco. Se lo porti al Night Welcome e gli paghi
//    una ragazza, si ricorda chi è e ti fa un regalo. Madame Svetlana gli fa tornare la memoria del tutto:
//    arma leggendaria. Tono da barzelletta, niente scene: si chiacchiera, si balla, si prendono sberle.
// =====================================================================

export const PALUDE = {
  centro: [35, 83.5],     // il laghetto
  raggio: 9,              // i salti contano solo qui vicino (sulla riva)
  salti: 100,
  // avvisi mentre conti
  avvisi: {
    20: "🫧 Dal laghetto sale una bolla. Grossa. Forse è solo una carpa.",
    40: "🫧 Altre bolle. L'acqua puzza di fosso più del solito.",
    60: "🐸 Le rane hanno smesso di gracidare. Ti guardano. Tutte.",
    80: "🌫️ Sulla superficie del laghetto si forma un vortice. Qualcuno, sotto, si sta svegliando.",
    95: "👁️ Due occhi gialli ti fissano dal fondo. Mancano pochi salti...",
  },
  arrivo: [
    { testo: "Centesimo salto. Il laghetto smette di muoversi. Silenzio. Anche le zanzare trattengono il fiato." },
    { testo: "Poi l'acqua esplode. Dalla melma si alza una figura verde, gocciolante, coperta di alghe, con una carpa incastrata in un orecchio." },
    { chi: 'garonio', testo: "Scusi... l'ho svegliata io?" },
    { testo: "«CENTO. SALTI.» La voce gorgoglia come uno scarico. «Sono quarant'anni che dormo qua sotto. E tu SALTI.»" },
  ],
};

export const BABBO = {
  nome: 'Il vecchietto smemorato',
  nomeVero: 'Babbo Natale',
  bosco: [12, 89, 148, 96],   // rettangolo dove può comparire (x0, z0, x1, z1)
  ora: 20,                    // compare alle 20, quando apre il Welcome; a mezzanotte sparisce
  probabilita: 0.3,           // ogni sera
  daGiorno: 3,                // non prima del giorno 3
  pausa: 6,                   // giorni prima di poterlo rincontrare
  arrivo: "🔔 Dal bosco a sud arriva un tintinnio di campanelli... (c'è qualcuno di strano tra gli alberi: punto bianco sulla minimappa)",
  incontro: [
    { testo: "Tra gli alberi c'è un vecchio con la barba bianca lunghissima, il vestito rosso e un cappello col pon pon. Si guarda intorno spaesato." },
    { chi: 'babbo', nome: 'Il vecchietto smemorato', testo: "Scusi, giovanotto... dove sono? E soprattutto: CHI sono? Mi sono svegliato nel bosco con un sacco vuoto e un gran mal di testa." },
    { chi: 'garonio', testo: "Lei è vestito da Babbo Natale. Nel bosco. Di notte. Fuori stagione, forse." },
    { chi: 'babbo', nome: 'Il vecchietto smemorato', testo: "Babbo chi? Mi ricordo solo... delle luci colorate. Rosse e viola. E una musica: «tunz tunz». Lei sa dov'è un posto così?" },
    { chi: 'garonio', testo: "(Luci rosse e viola, tunz tunz... è il Night Welcome. Ovvio.)" },
  ],
  scelte: { segui: "🎅 «Mi segua, nonno: so io dove andare»", lascia: 'Lascialo nel bosco' },
  segue: "🎅 Il nonnino ti segue. Portalo al Night Welcome (aperto fino a mezzanotte) e parla con Sandokan al catalogo.",
  lasciato: "Il vecchietto si siede su un ceppo e comincia a contare le stelle. «Una... due... renna... no, stella...»",
  parlaSegue: [
    "«Ho una strana voglia di latte e biscotti. E di entrare dai camini. È normale?»",
    "«Sento che conosco una certa... Svetlana? O era una renna? No, una renna non si chiama Svetlana.»",
    "«Perché tutti mi guardano e dicono \"ho ho ho\"? È un saluto di qui?»",
    "«Ho freddo ai piedi. Di solito ho una slitta riscaldata. Credo.»",
  ],
  perso: "🎅 Mezzanotte: il nonnino si è perso di nuovo. Lo hanno visto salire su un trattore e partire verso Lodi.",
  // al Welcome, dal catalogo di Sandokan
  welcome: {
    voce: '🎅 Una ragazza per il nonnino (paghi tu)',
    sandokan: "Sandokan squadra il vecchio: «Ma questo è... no. Non può essere. Va bene, entra nonno. Però paga il ragazzo.» Garonio sospira e apre il portafoglio.",
    lascia: 'Lascia perdere',
    // per ogni ragazza del catalogo (id di src/data/vita.js → PARADISO.catalogo)
    jessica: {
      scena: [
        "Jessica fa sedere il nonno sul divanetto e gli racconta per un'ora del cugino DJ a Riccione. Il nonno annuisce, annuisce... e si addormenta.",
        "Si sveglia di colpo: «Ho... ho... no. Niente. Mi ricordo solo che mi piacciono i biscotti. E che tu, ragazzo, sei stato un po' cattivo quest'anno.»",
      ],
      premio: { oggetti: { biscotti: 3, carbone: 1 } },
    },
    samantha: {
      scena: [
        "Samantha gli mette in testa la sua corona di Miss Sagra del Cotechino: «Sei il re della serata, nonnino!» Ballano un liscio. Lui è bravissimo.",
        "Il vecchio si guarda allo specchio: corona, barba bianca, pancia. «Io... io ho una slitta! Credo. E dei folletti che non pago da secoli.» Ricorda a metà, ma è felice.",
      ],
      premio: { vestiti: ['cappelloNatale'], oggetti: { biscotti: 3 } },
    },
    natasha: {
      scena: [
        "Natasha fa la spaccata (da qualche parte nel mondo è venerdì). Il nonno applaude, poi scatta in piedi: «DONNER! BLITZEN! Le mie renne facevano così sul tetto!»",
        "«Mi ricordo quasi tutto! Tranne dove ho parcheggiato la slitta. Ragazzo, questo l'ha fatto mia moglie a maglia. Tienilo tu: a me tira sulla pancia.»",
      ],
      premio: { vestiti: ['maglioneRenne'], soldi: 150 },
    },
    svetlana: {
      scena: [
        "Madame Svetlana si avvicina, lo guarda negli occhi e gli molla una sberla che si sente fino a Codogno.",
        "«NIKOLAI! Trent'anni che non vieni a trovarmi! E ogni Natale, nella mia calza, CARBONE!»",
        "Il vecchio sbatte le palpebre. La barba si gonfia. Le campanelle suonano da sole. «Svetlana...? IO... IO SONO BABBO NATALE! HO HO HO!» Sandokan si commuove e si soffia il naso nella tenda.",
        "Prima di volare via dal tetto del Welcome, Babbo Natale ti mette in mano il suo bastone: «Per te, Garonio. Quest'anno sei nella lista dei buoni. Più o meno.»",
      ],
      premio: { armi: ['bastoneZucchero'] },
      premioRipeti: { soldi: 400, oggetti: { biscotti: 5 } },
    },
    saluto: "🎅 «Ho ho ho! Grazie, Garonio!» Il nonnino esce dal Welcome fischiettando «Jingle Bells». Fuori, nessuno ha visto una slitta. Nessuno ammetterà di averla vista.",
    pocoSoldi: "Non hai abbastanza soldi. Sandokan: «Il nonno è simpatico, ma qui si paga in contanti. Anche lui.»",
  },
};
