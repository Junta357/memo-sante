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
  dayItems.push({ h:"", type:"lien", t:"🤝 Contact humain aujourd'hui", sub:"Visite, appel, main sur l'épaule, câlin court. Co-régulation émotionnelle + ocytocine. Levier longévité (module OMS n°5 — lien social)." });
  sections.push({ titre:"📌 Aujourd'hui", open:true, items:dayItems });

  /* ====== MATIN ====== */
  const matin = [
    { h:"06h30", t:"Réveil", sub:"simulateur d'aube" },
    { h:"06h35", t:"👁️ Yoga des yeux", sub:"5 clignements conscients — hydrate la cornée, réveille les yeux.", today:true },
    // Acupression — réveil (araignée crânienne)
    { h:"06h35", t:"🕷️ Araignée crânienne", sub:"Réveil du sommet du crâne (30 s–1 min) : circulation + clarté + détente.", today:true },
    { h:"06h40", t:"💪 Stomach vacuum", sub:"2 min, 2–3 reps, cou relâché" },
    { h:"06h45", t:"☕ Café 1", sub:"noir bio" },
    // HE — Diffusion tonique au lever
    { h:"06h50", type:"he", t:"🌿 Diffusion tonique (Pranarôm hypersonique)", sub:"Romarin 2 + Pin 2 + Menthe poivrée 1 — 10 min, pièce de vie.", today:true },
    { h:"07h00", t: weekend ? "🚶 Repos actif" : "🏃 Course 5–7,5 km",
      sub: weekend ? "marche, vélo, stretching (pas de course)" : "ou repos actif si > 25 °C ressenti à 7h",
      today: !weekend },
  ];
  if (rhodiola) {
    matin.push({ h:"07h30", t:"💊 Rhodiola (à jeun)", sub:"pas de Tyrosine aujourd'hui", today:true });
  }
  if (jourCourse) {
    matin.push({ h:"08h05", type:"he", t:"🌿 Friction post-course", sub:"Laurier 4 + Gingembre 3 + Pin 2 + Immortelle 2 / 1 c.c. amande — adducteurs + cuisses. Immortelle : 1-2 gt suffisent.", today:true });
  }
  matin.push({
    h:"08h30",
    t: tyrosine ? "💊 Tyrosine + encas" : "🍊 Encas post-course",
    sub: tyrosine ? "1 orange bio + fromage d'abbaye (pas de Rhodiola aujourd'hui)" : "1 orange bio + morceau fromage d'abbaye",
    today: tyrosine
  });
  matin.push({ h:"08h45", t:"🍵 Thé vert", sub:"1 tasse" });
  sections.push({ titre:"🌅 Matin", open:true, items:matin });

  /* ====== JOURNÉE ====== */
  sections.push({
    titre: "🌤️ Journée",
    open: true,
    items: [
      { h:"10h00", t:"☕ Café 2 + noix 30 g", sub:"mélange + noix du Brésil = 1 SEULE/jour" },
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
    { h:"21h00", t:"🧘 Étirements adducteurs", sub:"papillon + fente latérale + stomach vacuum · 2–3 min" },
    { h:"21h00", type:"he", t:"🌿 Diffusion soirée (Pranarôm hypersonique)", sub:"Orange douce 2 + Lavande 2 + Cèdre 1 — pièce.", today:true },
    { h:"21h10", t:"🕷️ Araignée crânienne", sub:"30 s–1 min : circulation + relâchement des tensions crâniennes. Prépare le palming.", today:true },
    { h:"21h15", t:"👁️ Yoga des yeux", sub:"exercice de l'index + palming (anti-presbytie + nerf vague)" },
    { h:"21h30", t:"🫖 Tisane", sub:"fenouil/gingembre/cannelle si besoin" },
    { h:"22h15", type:"lien", t:"🐱 Un moment avec ton chat", sub:"Quelques minutes de contact — ocytocine bilatérale (toi + chat), baisse du cortisol. Levier de longévité (module OMS n°5)." },
  );
  // Massage sommeil : lundi + vendredi (après Yoga Yin le vendredi)
  if (dow===1 || dow===5) {
    soirItems.push({ h:"22h15", type:"he", t:"🌿 Massage coucher", sub:"Camomille noble 2 + Lavande 1 gt / 1 c.c. amande — épaules, cou, plexus. Camomille = ton n°1 sommeil.", today:true });
  } else {
    // Spray oreiller : facultatif les autres soirs
    soirItems.push({ h:"22h25", type:"he", t:"🌿 Spray oreiller (facultatif)", sub:"Camomille 8 + Lavande 6 + Néroli 3 gt / 30 ml eau — 2-3 pschitts (loin des yeux)", today:false });
  }
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
      { h:"", type:"alerte", t:"🦵 Adducteur > 3/10 ou boiterie", sub:"réduire / marcher, étirements obligatoires" },
      { h:"", type:"alerte", t:"💧 Transit trop rapide", sub:"réduire magnésium" },
      { h:"", type:"alerte", t:"☕ Anxiété, palpitations, insomnie", sub:"réduire caféine et/ou Tyrosine/Rhodiola" },
    ]
  });

  /* ====== RECETTES HE (référence) ====== */
  sections.push({
    titre: "🌿 Recettes HE (référence)",
    open: false,
    items: [
      { h:"", type:"recette", t:"Sommeil — Camomille noble (n°1)", sub:"Massage : Camomille 2 + Lavande 1 / 5 ml amande (épaules/cou/plexus). Spray oreiller : Camomille 8 + Lavande 6 + Néroli 3 / 30 ml eau." },
      { h:"", type:"recette", t:"Récup. course", sub:"Friction : Laurier 4 + Gingembre 3 + Pin 2 + Immortelle 2 / 5 ml amande (adducteurs+cuisses). Immortelle 1-2 gt max." },
      { h:"", type:"recette", t:"Genou droit", sub:"Immortelle 2 + Laurier 2 / 5 ml amande. ⚠️ Signe neuro → avis médical, l'HE accompagne seulement." },
      { h:"", type:"recette", t:"Énergie / concentration", sub:"Roll-on : Pin 3 + Épinette 3 + Romarin 2 + Menthe 2 / jojoba. Roll-on réflexion : Laurier 4 + Citronnier 3 + Romarin 3 / amande." },
      { h:"", type:"recette", t:"Ventre gonflé / digestion", sub:"Cardamome 2 + Menthe 1 + Gingembre 1 / 5 ml amande — massage circulaire sens horaire." },
      { h:"", type:"recette", t:"Sérum visage", sub:"Palmarosa 2-3 + Lavande 2-3 / 1 c.à s. Rose musquée — 1-2×/jour. Éviter contour des yeux." },
      { h:"", type:"recette", t:"Bain de pieds relaxation (mer/dim)", sub:"Lavande 2 + Camomille noble 1 + Néroli 1 (4 gt) / 1 bouchon Base Neutre Puressentiel → eau. Jamais d'HE directe dans l'eau. Sel Epsom séparé." },
      { h:"", type:"recette", t:"Bain de pieds sportif (au ressenti)", sub:"Pin sylvestre 2 + Gingembre 1 + Lavande 1 (4 gt) / 1 bouchon Base Neutre → eau + sel Epsom séparé. 1-2×/sem max." },
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
