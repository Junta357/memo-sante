/* ============================================================
   ROUTINE.JS — Données de ta routine (santé + huiles essentielles)
   ------------------------------------------------------------
   C'est LE fichier à éditer pour modifier ta routine.
   Tu n'as pas besoin de toucher au reste de l'application.
   Syntaxe : JavaScript simple. Respecte les virgules et les guillemets.
   ============================================================ */

// dow : 0=dimanche, 1=lundi, 2=mardi, 3=mercredi, 4=jeudi, 5=vendredi, 6=samedi
const JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

// Les 18 croyances pilotes (5 présent + 5 objectifs + 7 excellence + 1 Peterson) — rotation quotidienne
const CROYANCES = [
  // 5 croyances du présent
  "Je prends du recul : « Est-ce que j'ai le temps de prendre une tasse de thé ? »",
  "Apprendre me rend heureux.",
  "J'ancre mes souvenirs avec mes 5 sens.",
  "Je communique de façon positive et bienveillante.",
  "Je me couche et me lève à heure régulière.",
  // 5 croyances d'accomplissement
  "Je suis en bonne santé.",
  "Je prends du temps pour bien faire.",
  "Je trouve la méthode qui me convient.",
  "Je suis le chemin que je me suis tracé.",
  "Les résultats sont obtenus rapidement.",
  // 7 croyances de l'excellence
  "Tout événement se produit pour une raison précise et doit me servir.",
  "L'échec n'existe pas, seul existe les résultats.",
  "Quoiqu'il arrive, j'en assume la responsabilité.",
  "Il n'est pas nécessaire de tout comprendre pour tout utiliser.",
  "Les êtres humains sont ma plus grande ressource.",
  "Le travail est un jeu.",
  "Il n'y a pas de réussite durable sans engagement.",
  // 1 croyance Peterson (R4)
  "Ce que je vise détermine ce que je vois. (Peterson)",
];

// Croyance du jour : rotation basée sur le jour de l'année
function croyanceDuJour(){
  const d = new Date();
  const debutAnnee = new Date(d.getFullYear(),0,0);
  const diff = d - debutAnnee;
  const jourAnnee = Math.floor(diff / 86400000);
  return CROYANCES[jourAnnee % CROYANCES.length];
}

// Les 7 valeurs de base 2026 (Mon parcours) — rotation quotidienne de la question
const VALEURS = [
  { nom:"Bienveillance", q:"Ai-je été bienveillant envers moi-même et les autres aujourd'hui ? Ai-je respecté mes limites et laissé couler mes émotions ?" },
  { nom:"Sincérité",     q:"Ai-je été sincère aujourd'hui ? Ai-je accepté mes fautes sans me juger ? Ai-je osé dire ce que je ressens, sans masque social ?" },
  { nom:"Fidélité",      q:"Ai-je été fidèle à moi-même aujourd'hui ? Ai-je honoré ce que je suis, ce que j'aime, ce que je rêve, même dans les moments difficiles ?" },
  { nom:"Écoute",        q:"Ai-je vraiment écouté mon corps, mon esprit et les autres aujourd'hui ? Ai-je laissé couler les émotions avant de répondre ?" },
  { nom:"Humilité",      q:"Ai-je reconnu mes limites et mes erreurs aujourd'hui, sans me juger comme un raté ? Ai-je continué à avancer vers qui je suis ?" },
  { nom:"Patience",      q:"Ai-je accepté que les choses avancent petit à petit aujourd'hui, sans tout précipiter ? Attentif à chaque petit pas plutôt qu'au résultat ?" },
  { nom:"Sens de l'effort", q:"Ai-je vraiment donné tout ce que je pouvais aujourd'hui, sans m'abandonner ni laisser tomber ?" },
];

// Valeur du jour : rotation basée sur le jour de l'année (décalée pour ne pas
// toujours tomber sur la même que la croyance — on démarre à un autre index)
function valeurDuJour(){
  const d = new Date();
  const debutAnnee = new Date(d.getFullYear(),0,0);
  const diff = d - debutAnnee;
  const jourAnnee = Math.floor(diff / 86400000);
  return VALEURS[jourAnnee % VALEURS.length];
}

function routinePour(dow) {
  // --- Conditions du jour ---
  const rhodiola = dow===3 || dow===6;         // mer, sam
  const tyrosine = [0,1,2,4,5].includes(dow);  // dim,lun,mar,jeu,ven
  const jourCourse = dow===1 || dow===3 || dow===5;  // lun, mer, ven
  const sardines = dow===2 || dow===6;         // mar,sam
  const yogaYin = dow===5;                     // ven
  const bainPiedsRelax = dow===3 || dow===0;   // mer, dim (bain de pieds relaxation)
  const bainPiedsSport = dow===4;              // jeu (bain de pieds sportif au ressenti)
  const renforcement = dow===2 || dow===4;     // mar, jeu (renforcement ~25 min)
  const dimanche = dow===0;                    // dim (rituel bien-être)
  const weekend = dow===0 || dow===6;

  // --- Rotation des jus Kuvings ---
  // 4 jus santé en rotation cyclique A→B→C→D (modulo 4, jour de l'année)
  // + 1 jus plaisir le week-end, alterné semaine paire/impaire (joker selon l'envie)
  const JUS_SANTE = [
    { nom:"A — Vert épicé", compo:"céleri, kiwi, orange, gingembre, curcuma" },
    { nom:"B — Vasculaire nitrates", compo:"poivron rouge, pastèque, betterave, menthe" },
    { nom:"C — Rouge tomate", compo:"tomate, céleri, fenouil, huile d'olive" },
    { nom:"D — Bleu-violet", compo:"myrtilles, carotte, concombre, orange" },
  ];
  const JUS_PLAISIR = [
    { nom:"P1 — Tropical solaire", compo:"mangue, ananas, orange, pomme" },
    { nom:"P2 — Grenade royale", compo:"grenade, orange, pomme, menthe" },
  ];
  const _d = new Date();
  const _jourAnnee = Math.floor((_d - new Date(_d.getFullYear(),0,0)) / 86400000);
  const jusSanteDuJour = JUS_SANTE[_jourAnnee % 4];
  const plaisirWeekend = weekend ? JUS_PLAISIR[Math.floor(_jourAnnee/7) % 2] : null;

  const sections = [];

  /* ====== AUJOURD'HUI (contexte immédiat, en premier) ====== */
  const dayItems = [];
  // Croyance du jour (rotation 18 croyances) — en tête
  dayItems.push({ h:"", type:"croy", t:"✦ Croyance du jour", sub:croyanceDuJour() + " — un rappel à laisser résonner aujourd'hui. (Développement personnel)" });
  dayItems.push({ h:"", type:"lien", t:"🤝 Contact vivant — au fil de la journée", sub:"Leviers libres, quand l'occasion se présente — pas une tâche à heure fixe. 🐱 Contact avec ton chat (lorsqu'il est disponible) : ocytocine bilatérale, baisse du cortisol. 🤝 Contact humain (visite, appel, main sur l'épaule, câlin court) : co-régulation émotionnelle. Levier longévité (module OMS n°5 — lien social + toucher)." });
  sections.push({ titre:"📌 Aujourd'hui", open:true, items:dayItems });

  /* ====== MATIN ====== */
  const matin = [
    { h:"06h30", t:"Réveil", sub:"simulateur d'aube" },
    { h:"06h35", t:"👁️ Yoga des yeux", sub:"5 clignements conscients — hydrate la cornée, réveille les yeux.", today:true },
    // Acupression — réveil (araignée crânienne)
    { h:"06h35", t:"🕷️ Araignée crânienne", sub:"Réveil du sommet du crâne (30 s–1 min) : circulation + clarté + détente.", today:true },
    { h:"06h40", t:"💪 Stomach vacuum", sub:"2 min, 2–3 reps, cou relâché" },
    { h:"06h45", t:"☕ Café 1", sub:"noir bio" },
  ];
  // 06h50 — aromathérapie conditionnelle : diffusion tonique les jours SANS course,
  // stick Départ/Focalisation les jours AVEC course (remplace la diffusion, ne s'ajoute pas)
  if (jourCourse) {
    matin.push({ h:"06h50", type:"he", t:"🌿 Stick « Départ / Focalisation »", sub:"Stick 1 (Romarin mèche) — 1 inspiration/narine, juste avant de partir. Remplace la diffusion du matin (jour de course).", today:true });
  } else {
    matin.push({ h:"06h50", type:"he", t:"🌿 Diffusion tonique (Pranarôm hypersonique)", sub:"Romarin 2 + Pin 1 + Menthe 1 — 10 min, fenêtre ouverte. (Jour sans course.)", today:true });
  }
  // 07h00 → ~08h30 — course ou mouvement
  matin.push({ h:"07h00", t: weekend ? "🚶 Repos actif" : "🏃 Course / entraînement",
    sub: weekend ? "marche, vélo, mobilité (pas de course). Créneau 07h00 → ~08h30 libre." : "07h00 → ~08h30. Reprise en cours (suivi-reprise-course). Examen niveau 4 réussi (5 km/32 min) — passage au programme niveau 4 (objectif final 10 km/1h09) reporté tant que la douleur aine/pli de hanche G n'est pas en voie de résolution. Temps 10 km réaliste au départ : ~1h30. Si > 25 °C ressenti à 7h → repos actif. 🦶 pouce G : si >5/10 ou œdème → marcher.",
    today: !weekend });
  if (rhodiola) {
    matin.push({ h:"07h30", t:"💊 Rhodiola (à jeun)", sub:"pas de Tyrosine aujourd'hui", today:true });
  }
  // vers 08h30 — friction post-course après le retour (transpiration terminée, peau propre/sèche)
  if (jourCourse) {
    matin.push({ h:"~08h30", type:"he", t:"🌿 Friction post-course (après le retour)", sub:"Gingembre 2 + Immortelle 1 + Laurier 1 + Pin 1 / amande (flacon 10 ml) — cuisses et zone musculaire périphérique confortable, 3-5 min. Attendre fin transpiration, peau nettoyée et sèche. Immortelle : bénéfice perso observé. Confort/récupération subjective, pas un traitement de la douleur.", today:true });
  }
  // 09h00 — bloc cohérent : encas + complément du jour + thé vert
  matin.push({
    h:"09h00",
    t: tyrosine ? "💊 Tyrosine + 🍊 Encas + 🍵 Thé vert" : "🍊 Encas + 🍵 Thé vert",
    sub: tyrosine ? "1 orange bio + fromage d'abbaye + Tyrosine (pas de Rhodiola aujourd'hui) + 1 tasse de thé vert" : "1 orange bio + morceau fromage d'abbaye + 1 tasse de thé vert",
    today: true
  });
  sections.push({ titre:"🌅 Matin", open:true, items:matin });

  /* ====== JOURNÉE ====== */
  sections.push({
    titre: "🌤️ Journée",
    open: true,
    items: [
      { h:"11h00", t:"☕ Café 2 + noix 30 g", sub:"mélange + noix du Brésil = 1 SEULE/jour" },
      { h:"13h00", t:"💊 Spiruline Blue Bio", sub:"2 gélules, à jeun" },
      { h:"14h00", t:"🥗 Repas 1 + D3+K2",
        sub:`légumes crus (fenouil, carottes, poivron, chou-fleur) + fruits + jus Kuvings + 1 goutte D3+K2 · 🥤 ${jusSanteDuJour.nom} (${jusSanteDuJour.compo})` + (plaisirWeekend ? ` · 🍹 Plaisir optionnel : ${plaisirWeekend.nom}` : ""),
        today:true },
      { h:"14h15", t:"🍵 Matcha", sub:"1 c. à café (~2 g), eau 80 °C" },
      { h:"16h00", t:"🍫 Chocolat noir 85 %", sub:"20–30 g bio · DERNIÈRE caféine" },
    ]
  });

  /* ====== SOIR ====== */
  // Valeur du jour (rotation 7 valeurs, dossier Mon parcours) — constat de fin de journée
  { const v = valeurDuJour();
    const valueItems = [
      { h:"", type:"croy", t:"⚓ Valeur du jour — " + v.nom, sub:v.q + " (Mon parcours)" },
    ];
    sections.push({ titre:"⚓ Valeur du jour", open:true, items:valueItems });
  }

  const soirItems = [
    { h:"18h00", t:"🍲 Souper", sub:"protéines + légumes cuits + glucides + Omega-3 + Mg + Ashwagandha" },
    { h:"18h10", t:"🚶 Marche post-prandiale", sub:"10 min (si temp. OK)" },
  ];
  if (bainPiedsRelax) {
    soirItems.push({ h:"20h30", type:"he", t:"🦶 Bain de pieds relaxation",
      sub:"Lavande 2 + Camomille noble 1 + Néroli 1 (4 gt) / 1 bouchon Base Neutre Puressentiel → eau chaude. 10-20 min. ⚠️ Base Neutre à acheter. ❌ Jamais menthe ni eucalyptus.", today:true });
  }
  if (bainPiedsSport) {
    soirItems.push({ h:"20h30", type:"he", t:"🦶 Bain de pieds sportif (au ressenti)",
      sub:"Pin sylvestre 2 + Gingembre 1 + Lavande 1 (4 gt) / 1 bouchon Base Neutre Puressentiel → eau + sel Epsom séparément. 15-20 min. Retour au calme + hydratation avant. ⚠️ Base Neutre à acheter. Ne remplace pas la friction.", today:true });
  }
  soirItems.push(
    { h:"21h00", t:"🧘 Mobilité douce", sub:"papillon + fente latérale + stomach vacuum · 2–3 min" },
    { h:"21h00", type:"he", t:"🌿 Diffusion soirée (Pranarôm hypersonique)", sub:"Orange douce 2 + Lavande 2 + Cèdre 1 — pièce.", today:true },
    { h:"21h10", t:"🕷️ Araignée crânienne", sub:"30 s–1 min : circulation + relâchement des tensions crâniennes. Prépare le palming.", today:true },
    { h:"21h15", t:"👁️ Yoga des yeux", sub:"exercice de l'index + palming (anti-presbytie + nerf vague)" },
    { h:"21h30", t:"🫖 Tisane", sub:"fenouil/gingembre/cannelle si besoin" },
  );
  // Massage « Apaisement signature » : flacon 30 ml permanent (Camomille noble 6 + Lavande 3 / amande)
  soirItems.push({ h:"22h15", type:"he", t:"💆 Massage Apaisement signature", sub:"Camomille noble 6 + Lavande 3 gt / amande 30 ml (flacon permanent) — plexus, trapèzes, côtés+arrière du cou. Massage lent.", today:true });
  soirItems.push({ h:"22h30", t:"🌙 Début jeûne nocturne", sub:"~14 h jusqu'à 8h30" });
  if (yogaYin) {
    soirItems.push({ h:"21h45", t:"🧘 Yoga Yin", sub:"30 min (vendredi soir) — 8 postures débutant, sans matériel (coussin + serviette). Détail dans reference-yoga-yin.md", today:true });
  }
  sections.push({ titre:"🌆 Soir", open:true, items:soirItems });

  /* ====== HYDRATATION ====== */
  sections.push({
    titre: "💧 Hydratation",
    open: false,
    items: [
      { h:"", t:"Eau Mont Roucous", sub:"1,5 à 3 L/jour (été → viser haut). Atrophie rénale congénitale : hydratation forte obligatoire." },
      { h:"", t:"Vichy Célestins 500 ml", sub:"après la course" },
    ]
  });

  /* ====== ÉCRAN ====== */
  sections.push({
    titre: "🖥️ Écran",
    open: false,
    items: [
      { h:"", t:"Règle 20-20-20", sub:"toutes les 20 min → regard à 6 m pendant 20 s" },
      { h:"", t:"Post-it « CLIGNE »", sub:"viser 15 clignements/min" },
      { h:"", t:"🧠 Pause cérébrale (option)", sub:"Session d'apprentissage longue → 5 min toutes les 20 min (Olicard). Levier, pas obligation — ne pas en faire un outil de contrôle." },
      { h:"", t:"🧍 Posture — épaules en arrière", sub:"Tiens-toi droit (Peterson R1). Geste-lever de la dominance = sérotonine. Complète l'ergonomie écran." },
      { h:"", t:"👂 Flare Calmer Pro (bout alu)", sub:"Sessions écran longues + gaming/musique fort. Réduit les aigus stressants sans isoler → régulation nerveuse passive. Utilisé depuis 6-7 ans." },
    ]
  });

  /* ====== SÉCURITÉ (alertes adoucies) ====== */
  sections.push({
    titre: "🛡️ Points de vigilance",
    open: false,
    items: [
      { h:"", type:"alerte", t:"🦵 Genou droit — signe neuro", sub:"Avis médical à programmer. Fourmillements / perte de sensation → consulter. L'HE (Immortelle+Laurier) accompagne, ne traite pas." },
      { h:"", type:"alerte", t:"🌞 Grains de beauté — bras gauche", sub:"Dermato annuel. Pas d'HE d'agrume (citron, bergamote, orange) appliquée sur la peau avant soleil (photosensibilisation cutanée). L'ingestion d'un jus d'agrume ne nécessite pas d'éviter le soleil." },
      { h:"", type:"alerte", t:"🫘 Atrophie rénale congénitale", sub:"Suivie par néphrologue. Pas d'ingestion d'HE. Hydratation forte. Menthe proscrite en ingestion." },
      { h:"", type:"alerte", t:"🐱 Chat", sub:"Diffusion en bas → fenêtre ouverte. Jamais d'HE appliquée sur le chat." },
      { h:"", type:"alerte", t:"🌡️ Météo > 25 °C à 7h", sub:"pas de course → fractionné ou repos" },
      { h:"", type:"alerte", t:"🦵 Douleur aine/pli de hanche G > 3/10", sub:"réduire l'allure / marcher · mobilité douce selon confort (pas d'étirement comme traitement) · 2 ajustements max puis consult" },
      { h:"", type:"alerte", t:"🦶 Pouce pied G (Dossier #8)", sub:"fracture de stress — si >5/10, œdème ou réveil nocturne → suspendre la course (marche/vélo) + RDV Dr Collin Rasson" },
      { h:"", type:"alerte", t:"💧 Transit trop rapide", sub:"réduire magnésium" },
      { h:"", type:"alerte", t:"☕ Anxiété, palpitations, insomnie", sub:"réduire caféine et/ou Tyrosine/Rhodiola" },
    ]
  });

  /* ====== RECETTES HE (référence) ====== */
  sections.push({
    titre: "🌿 Recettes HE (référence)",
    open: false,
    items: [
      { h:"", type:"recette", t:"Massage Apaisement signature", sub:"Camomille noble 6 + Lavande 3 / amande 30 ml (flacon permanent). Plexus, trapèzes, cou. Recours de l'endormissement difficile et de la rumination." },
      { h:"", type:"recette", t:"Friction post-course", sub:"Gingembre 2 + Immortelle 1 + Laurier 1 + Pin 1 / amande 10 ml (flacon d'essai). Cuisses et zone musculaire périphérique confortable, 3-5 min. Bénéfice Immortelle observé personnellement." },
      { h:"", type:"recette", t:"Roll-on Laurier — focalisation", sub:"Laurier noble 2 + Romarin cinéole 2 / jojoba 10 ml. Poignets au début d'une session de réflexion ou pour un trac." },
      { h:"", type:"recette", t:"Sérum visage", sub:"Rose musquée 10 ml + Jojoba 5 ml + Palmarosa 1 + Lavande 1 (flacon 15 ml). Le soir, 2-4 gt, visage+cou. Éviter contour des yeux." },
      { h:"", type:"recette", t:"Huile à barbe", sub:"Jojoba 15 ml + Amande 15 ml + Cèdre 3 gt (flacon 30 ml permanent)." },
      { h:"", type:"recette", t:"Confort abdominal", sub:"Cardamome 2 + Menthe 1 + Gingembre 1 / amande 10 ml. 6-10 gt, massage abdominal ~3 min (uniquement si vrai ballonnement)." },
      { h:"", type:"recette", t:"Sticks (3)", sub:"1 Romarin (départ/focalisation) · 2 Menthe (coup de barre) · 3 Lavande (réveil nocturne). 1 inspiration/narine, refermer." },
      { h:"", type:"recette", t:"Diffusion tonique matin", sub:"Romarin 2 + Pin 1 + Menthe 1 — 1h max, fenêtre ouverte." },
      { h:"", type:"recette", t:"Diffusion soir", sub:"Orange 2 + Lavande 2 + Cèdre 1 — 1h max, fenêtre ouverte. Remplacée par bain de pieds les soirs de bain." },
      { h:"", type:"recette", t:"Bain de pieds relaxation (mer/dim)", sub:"Lavande 2 + Camomille noble 1 + Néroli 1 (4 gt) / 1 bouchon Base Neutre → eau. Jamais d'HE directe. Sel Epsom séparé." },
      { h:"", type:"recette", t:"Bain de pieds sportif (au ressenti)", sub:"Pin 2 + Gingembre 1 + Lavande 1 (4 gt) / 1 bouchon Base Neutre → eau + sel Epsom séparé. 1-2×/sem max." },
    ]
  });

  /* ====== COMMUNICATION (garde-fou permanent) ====== */
  sections.push({
    titre: "🗣️ Communication — 3 passoires de Socrate",
    open: false,
    items: [
      { h:"", type:"croy", t:"Avant de parler, 3 filtres", sub:"1. VRAI ? (vérifié, pas supposé) · 2. BIEN ? (positif, pas destructeur) · 3. UTILE ? (nécessaire, pas gratuit). Non à l'un des trois → je ne le dis pas, ou je reformule. (Valeurs : bienveillance + sincérité. Accord toltèque n°1.)" },
    ]
  });

  return sections;
}

/* Échéances à venir (affichées dans l'app) */
const ECHEANCES = [
  { date:"Déc. 2026", t:"Prise de sang complète (Dr Collin Rasson) — cible LDL 100 mg/dL + PSA (prostate)" },
  { date:"Fin 2026", t:"Bilan ophtalmo (pression intra-oculaire, fond d'œil, accommodation)" },
  { date:"Annuel", t:"Dermatologue (grains de beauté bras gauche)" },
];
