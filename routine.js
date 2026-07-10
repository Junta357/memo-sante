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
  // ⚠️ COURSE SUSPENDUE (09/07/2026) — pouce pied gauche Dossier #8 (fracture de stress, 5/10 + œdème après marche 20 km).
  // Suspension jusqu'à décision du 10/07. Pour réactiver la course : remettre "dow===1 || dow===3 || dow===5".
  const jourCourse = false; // ÉTAIT : dow===1 || dow===3 || dow===5 (lun,mer,ven)
  const sardines = dow===2 || dow===6;         // mar,sam
  const yogaYin = dow===5;                     // ven
  const bainRecup = dow===4;                   // jeu (récupération sport)
  const renforcement = dow===2 || dow===4;     // mar, jeu (renforcement ~25 min)
  const dimanche = dow===0;                    // dim (rituel bien-être)
  const weekend = dow===0 || dow===6;

  const sections = [];

  /* ====== AUJOURD'HUI (contexte immédiat, en premier) ====== */
  const dayItems = [];
  // Croyance du jour (rotation 18 croyances) — en tête
  dayItems.push({ h:"", type:"croy", t:"✦ Croyance du jour", sub:croyanceDuJour() + " — un rappel à laisser résonner aujourd'hui. (Développement personnel)" });
// Valeur du jour (rotation 7 valeurs, dossier Mon parcours) — distinct des croyances
// Registre différent : éthique personnelle (Mon parcours), pas performance (PNL).
  { const v = valeurDuJour(); dayItems.push({ h:"", type:"croy", t:"⚓ Valeur du jour — " + v.nom, sub:v.q + " (Mon parcours)" }); }
  if (weekend)      dayItems.push({ h:"", t:"🚶 Repos actif", sub:"marche, vélo, stretching — pas de course", today:true });
  else if (jourCourse) dayItems.push({ h:"", t:"🏃 Jour de course", sub:"5–7,5 km · privilégie le Jus B au repas 1 + friction post-course", today:true });
  else              dayItems.push({ h:"", t:"⚠️ Course suspendue (pouce pied G)", sub:"Dossier #8 — fracture de stress, en observation 24h. Remplace par marche/vélo pour éviter la pression d'avant-pied. Décision le 10/07.", today:true });
  if (rhodiola)     dayItems.push({ h:"", t:"💊 Rhodiola aujourd'hui", sub:"7h30 à jeun · pas de Tyrosine aujourd'hui", today:true });
  if (tyrosine)     dayItems.push({ h:"", t:"💊 Tyrosine aujourd'hui", sub:"8h30 · pas de Rhodiola aujourd'hui", today:true });
  if (sardines)     dayItems.push({ h:"", t:"🐟 Sardines", sub:"1 boîte au souper", today:true });
  if (bainRecup)    dayItems.push({ h:"", t:"🛁 Bain récupération", sub:"ce soir — Gingembre/Pin/Épinette + sel Epsom", today:true });
  if (yogaYin)      dayItems.push({ h:"", t:"🧘 Yoga Yin 30 min", sub:"ce soir — 8 postures, sans matériel, séquence dans reference-yoga-yin.md", today:true });
  if (renforcement) dayItems.push({ h:"", t:"💪 Renforcement (~25 min)", sub:"Jambes/core (squat, fente, pompe inclinée, planche, pont) + bras haltères 5 kg (curl biceps 2×12 + élévation latérale 2×12) + suspension barre de traction (3 séries submax, objectif 2 min — mesurer au chrono). ⚠️ Si fatigue globale ou adducteur > 3/10 → saute les bras, garde le cœur. Garde-fou épaules : jamais jusqu'à l'échec musculaire.", today:true });
  if (weekend)      dayItems.push({ h:"", type:"lien", t:"🤝 Contact humain aujourd'hui", sub:"Visite, appel, main sur l'épaule, câlin court. Co-régulation émotionnelle + ocytocine. Levier longévité (module OMS n°5 — lien social)." });
  if (dimanche)     dayItems.push({ h:"", t:"🧘 Rituel bien-être (~25 min, ~15h)", sub:"🕷️ Araignée crânienne (1 min, transition) → fauteuil shiatsu Medisana MC825 + casque Sennheiser Momentum 4 (ANC) : méditation Cléret OU bols/nature, yeux fermés. Diffuseur Pranarôm Cera : Orange douce 15 + Petit grain 6 + 1 gt Valériane. Pas de thé/tisane hors créneaux. Récupération de la semaine + nerf vague.", today:true });
  sections.push({ titre:"📌 Aujourd'hui", open:true, items:dayItems });

  /* ====== MATIN ====== */
  const matin = [
    { h:"06h30", t:"Réveil", sub:"simulateur d'aube" },
    { h:"06h35", t:"👁️ Yoga des yeux", sub:"5 clignements conscients (hydrate la cornée, réveille les yeux). ⚠️ Pas de palming le matin : il active le parasympathique (endort) — geste du soir uniquement.", today:true },
    // Acupression — réveil (araignée crânienne, remplace Du20 manuel + GI4)
    { h:"06h35", type:"acu", t:"🕷️ Araignée crânienne", sub:"Réveil du sommet du crâne (30 s–1 min) : circulation + clarté + détente. Plus agréable que Du20 manuel. (Remplace GI4+Du20 depuis le 10/07/2026.)", today:true },
    { h:"06h40", t:"💪 Stomach vacuum", sub:"2 min, 2–3 reps, cou relâché" },
    { h:"06h45", t:"☕ Café 1", sub:"noir bio" },
    // HE — Diffusion tonique au lever
    { h:"06h50", type:"he", t:"🌿 Diffusion tonique (Pranarôm Cera)", sub:"Romarin 2 + Pin 2 + Menthe poivrée 1 — 10 min, pièce de vie. 🐱 Chat en bas → fenêtre ouverte.", today:true },
    { h:"07h00", t: weekend ? "🚶 Repos actif" : "🏃 Course 5–7,5 km",
      sub: weekend ? "marche, vélo, stretching (pas de course)" : "ou repos actif si > 25 °C ressenti à 7h",
      today: !weekend },
  ];
  if (rhodiola) {
    matin.push({ h:"07h30", t:"💊 Rhodiola (à jeun)", sub:"pas de Tyrosine aujourd'hui", today:true });
  }
  if (jourCourse) {
    matin.push({ h:"08h05", type:"he", t:"🌿 Friction post-course", sub:"Laurier 4 + Gingembre 3 + Pin 2 + Immortelle 2 / 1 c.c. amande — adducteurs + cuisses. Immortelle : 1-2 gt suffisent.", today:true });
    matin.push({ h:"08h10", type:"acu", t:"🤚 ST36 (2 min/jambe)", sub:"Post-course : 4 doigts sous la rotule, 1 pouce avant le tibia. Anti-inflammatoire (axe vague-surrénale). Le point des 100 maladies." });
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
        sub:`légumes crus + fruits + jus Kuvings + 1 goutte D3+K2 · ${jourCourse?"Jus B (cardio)":"Jus A ou B au choix"} · 🥄 Faim ou soif ? Gorgée d'eau d'abord. Pause en mangeant pour estimer la faim.`,
        today:jourCourse },
      { h:"14h15", t:"🍵 Matcha", sub:"1 c. à café (~2 g), eau 80 °C" },
      // Acupression — reset parasympathique au matcha (PC6 seul, GI4 retiré)
      { h:"14h15", type:"acu", t:"🤚 PC6 (cohérence 5,5)", sub:"2 min : respiration 5 s inspire / 5 s expire. PC6 = 3 doigts au-dessus du pli du poignet, entre les 2 tendons. Reset parasympathique de mi-journée." },
      { h:"16h00", t:"🍫 Chocolat noir 85 %", sub:"20–30 g bio · DERNIÈRE caféine" },
    ]
  });

  /* ====== SOIR ====== */
  const soirItems = [
    { h:"18h00", t:"🍲 Souper", sub:"protéines + légumes cuits + glucides + Omega-3 + Mg + Ashwagandha" },
    { h:"18h10", t:"🚶 Marche post-prandiale", sub:"10 min (si temp. OK)" },
    // Acupression — digestion en marchant
    { h:"18h10", type:"acu", t:"🤚 SP6 (1 min/jambe)", sub:"En marchant, pression légère. 4 doigts au-dessus de la malléole interne, derrière le tibia. Aide la digestion. ⚠️ Blessure adducteur → membre sain uniquement." },
  ];
  if (bainRecup) {
    soirItems.push({ h:"20h30", type:"he", t:"🛁 Bain récupération sport",
      sub:"Gingembre 2 + Pin 2 + Épinette 2 gt + poignée sel Epsom — 20 min. Pré-diluer dans ½ c.c. d'huile. ❌ Jamais menthe ni eucalyptus dans le bain.", today:true });
  }
  soirItems.push(
    { h:"21h00", t:"🧘 Étirements adducteurs", sub:"papillon + fente latérale + stomach vacuum · 2–3 min" },
    { h:"21h00", type:"he", t:"🌿 Diffusion soirée (Pranarôm Cera)", sub:"Orange douce 2 + Lavande 2 + Cèdre 1 — pièce. 🐱 Chat → fenêtre ouverte.", today:true },
    { h:"21h10", type:"acu", t:"🕷️ Araignée crânienne (soir)", sub:"30 s–1 min : circulation + relâchement des tensions crâniennes. Prépare le palming (synergie tête→yeux).", today:true },
    { h:"21h15", t:"👁️ Yoga des yeux", sub:"exercice de l'index + palming (anti-presbytie + nerf vague)" },
    { h:"21h30", t:"🫖 Tisane", sub:"fenouil/gingembre/cannelle si besoin" },
    // Acupression — nourrir le Dantian
    { h:"21h30", type:"acu", t:"🤚 CV4 (main posée)", sub:"3 doigts sous le nombril, main posée + respiration basse. Nourrit le Dantian inférieur, recharge le réservoir." },
    { h:"22h15", type:"he", t:"🌿 Massage coucher", sub:"Camomille noble 2 + Lavande 1 gt / 1 c.c. amande — épaules, cou, plexus. Camomille = ton n°1 sommeil.", today:true },
    // Toucher — câlin chat (présence corporelle apaisante)
    { h:"22h15", type:"lien", t:"🐱 Un moment avec ton chat", sub:"Quelques minutes de contact — ocytocine bilatérale (toi + chat), baisse du cortisol. Levier de longévité (module OMS n°5)." },
    // Acupression — induction du sommeil
    { h:"22h15", type:"acu", t:"🤚 HT7 + Yin Tang + KD1", sub:"Au lit : HT7 (1 min/main, pli externe du poignet) + Yin Tang (30 s, entre les sourcils) + KD1 (1 min/pied, plante). Induit le sommeil." },
    { h:"22h25", type:"he", t:"🌿 Spray oreiller", sub:"Camomille 8 + Lavande 6 + Néroli 3 gt / 30 ml eau — 2-3 pschitts (loin des yeux)", today:true },
    { h:"22h30", t:"🌙 Début jeûne nocturne", sub:"~14 h jusqu'à 8h30" },
  );
  if (yogaYin) {
    soirItems.push({ h:"21h45", t:"🧘 Yoga Yin", sub:"30 min (vendredi soir) — 8 postures débutant, sans matériel (coussin + serviette). Détail dans reference-yoga-yin.md", today:true });
  }
  sections.push({ titre:"🌆 Soir", open:true, items:soirItems });

  /* ====== HYDRATATION ====== */
  sections.push({
    titre: "💧 Hydratation",
    open: false,
    items: [
      { h:"", t:"Eau Mont Roucous", sub:"1,5 à 3 L/jour (été → viser haut). Rein sensible : hydratation forte obligatoire." },
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
      { h:"", type:"alerte", t:"🌞 Grains de beauté — bras gauche", sub:"Dermato annuel. Pas d'agrume (citron, bergamote, orange) sur le bras gauche avant soleil. Photosensibilité 12h." },
      { h:"", type:"alerte", t:"🫘 Rein sensible", sub:"Pas d'ingestion d'HE. Hydratation forte. Menthe proscrite en ingestion." },
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
      { h:"", type:"recette", t:"Bain récupération (jeu)", sub:"Gingembre 2 + Pin 2 + Épinette 2 + sel Epsom. Pré-diluer. ❌ Jamais menthe ni eucalyptus." },
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
  { date:"10/07/2026", t:"Décision pouce pied gauche (Dossier #8) — si 5/10 ou œdème persiste → RDV Dr Collin Rasson", warn:true },
  { date:"Déc. 2026", t:"Prise de sang complète (Dr Collin Rasson) — cible LDL 100 mg/dL + PSA (prostate)" },
  { date:"Fin 2026", t:"Bilan ophtalmo (pression intra-oculaire, fond d'œil, accommodation)" },
  { date:"Annuel", t:"Dermatologue (grains de beauté bras gauche)" },
];
