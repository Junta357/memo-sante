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

/* ============================================================
   CYCLES COMPLÉMENTS — automatique passif
   ------------------------------------------------------------
   Chaque complément alterne cure → pause → cure… indéfiniment.
   Comptage calendaire en jours civils (Date.UTC, insensible
   aux changements d'heure). En pause : l'item disparaît du flux
   de routine. À la reprise : il réapparaît automatiquement.
   dateDebut = date d'initialisation de la première cure (par
   défaut 1ᵉʳ juillet 2026, cf. compte rendu de la mission).
   ============================================================ */
const CYCLES = [
  { id:"omega3",      nom:"Omega 3",             cure:105, pause:21, dateDebut:"2026-07-01" },
  { id:"magnesium",   nom:"Magnésium Marin+Vég", cure:42,  pause:14, dateDebut:"2026-07-01" },
  { id:"ashwagandha", nom:"Ashwagandha 500 mg",  cure:49,  pause:21, dateDebut:"2026-07-01" },
  { id:"spiruline",   nom:"Spiruline Blue Bio",  cure:21,  pause:7,  dateDebut:"2026-07-01" },
  { id:"tyrosine",    nom:"Tyrosine 500 mg",     cure:35,  pause:21, dateDebut:"2026-07-01" },
  { id:"rhodiola",    nom:"Rhodiola Rosea",      cure:25,  pause:10, dateDebut:"2026-07-01" },
];

// Nombre de jours civils entre deux dates (insensible aux changements d'heure).
// Utilise Date.UTC pour comparer des minuits en temps universel.
function joursCivilsEntre(dateDebutISO, dateFin){
  const d1 = Date.UTC(dateDebutISO.slice(0,4), dateDebutISO.slice(5,7)-1, dateDebutISO.slice(8,10));
  const d2 = Date.UTC(dateFin.getFullYear(), dateFin.getMonth(), dateFin.getDate());
  return Math.floor((d2 - d1) / 86400000);
}

// Calcule l'état d'un cycle à la date donnée.
// Retourne { etat, jour, total, reste }
//   etat  : "cure" | "pause"
//   jour  : jour courant dans la phase (1-indexé)
//   total : durée totale de la phase
//   reste : nombre de jours avant la fin de la phase (0 = dernier jour)
// Le jour de reprise est le lendemain du dernier jour de pause :
//   pause j1/7 → reste 6 (reprise dans 7 j, car on ne compte pas le jour courant)
//   pause j7/7 → reste 0 (reprise demain)
//   Le lendemain → cure j1
function etatCycle(cycle, date){
  const cycleTotal = cycle.cure + cycle.pause;
  const jour0 = joursCivilsEntre(cycle.dateDebut, date);            // 0 = premier jour de cure
  const posCycle = ((jour0 % cycleTotal) + cycleTotal) % cycleTotal; // 0 .. cycleTotal-1
  if(posCycle < cycle.cure){
    const jour = posCycle + 1;
    return { etat:"cure", jour, total:cycle.cure, reste:cycle.cure - jour };
  } else {
    const jour = posCycle - cycle.cure + 1;
    return { etat:"pause", jour, total:cycle.pause, reste:cycle.pause - jour };
  }
}

// Raccourci : état d'un cycle aujourd'hui
function etatCycleAujourdhui(cycle){
  return etatCycle(cycle, new Date());
}

// Raccourci : un complément est-il en cure aujourd'hui ?
function enCure(id){
  const c = CYCLES.find(c => c.id === id);
  if(!c) return true; // inconnu → par sécurité, afficher (ex: D3+K2 non listé)
  return etatCycleAujourdhui(c).etat === "cure";
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
  const samedi = dow===6;                      // sam (soirée repos olfactif)
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
  dayItems.push({ h:"", type:"lien", t:"🤝 Contact vivant", sub:"🐱 chat + 🤝 humain — quand l'occasion se présente, sans heure fixe." });
  sections.push({ titre:"📌 Aujourd'hui", open:true, items:dayItems });

  /* ====== MATIN ====== */
  const matin = [
    { h:"06h30", t:"Réveil", sub:"simulateur d'aube" },
    { h:"06h35", t:"👁️ Yoga des yeux", sub:"5 clignements conscients.", today:true },
    { h:"06h35", t:"🕷️ Araignée crânienne", sub:"30 s–1 min.", today:true },
    { h:"06h40", t:"💪 Stomach vacuum", sub:"2 min, 2–3 reps" },
  ];
  // 06h30 / 06h40 — adaptogène au réveil, à jeun (avant café, ~30 min avant la course).
  // Rotation hebdo Tyrosine/Rhodiola, MAIS seulement si le complément est en cure.
  // Si l'adaptogène du jour est en pause de cycle → aucun adaptogène affiché (sauté).
  let adaptoNom = null, adaptoEnCure = true;
  if (rhodiola) { adaptoNom = "Rhodiola"; adaptoEnCure = enCure("rhodiola"); }
  else if (tyrosine) { adaptoNom = "Tyrosine"; adaptoEnCure = enCure("tyrosine"); }
  if (adaptoNom && adaptoEnCure) {
    matin.push({ h:"06h40", t:`💊 ${adaptoNom} (rotation)`, sub:"À jeun, au réveil — 30 min avant le café. Favorise l'absorption.", today:true });
  }
  matin.push({ h:"06h45", t:"☕ Café 1", sub:"noir bio" });
  // 06h50 — aromathérapie conditionnelle : stick les jours de course, diffusion les autres
  if (jourCourse) {
    matin.push({ h:"06h50", type:"he", t:"🌿 Stick « Départ / Focalisation »", sub:"Stick 1 Romarin — 1 inspiration/narine, juste avant de partir. Remplace la diffusion du matin.", today:true });
  } else {
    matin.push({ h:"06h50", type:"he", t:"🌿 Diffusion tonique", sub:"Romarin 2 + Pin 1 + Menthe 1 — jusqu'à 1 h max, fenêtre ouverte, arrêt manuel possible plus tôt.", today:true });
  }
  // 07h00 → ~08h30 — course (lun/mer/ven), renforcement (mar/jeu), ou repos actif (sam/dim)
  if (jourCourse) {
    matin.push({ h:"07h00", t:"🏃 Course / entraînement", sub:"07h00 → ~08h30 · si > 25 °C ressenti → repos actif (marche/mobilité)", today:true });
    matin.push({ h:"~08h30", type:"he", t:"🌿 Friction post-course", sub:"Gingembre 2 + Immortelle 1 + Laurier 1 + Pin 1 / amande 10 ml — cuisses, 3-5 min. Après transpiration, peau sèche.", today:true });
  } else if (renforcement) {
    matin.push({ h:"07h00", t:"💪 Renforcement 25 min", sub:"Squat, fente, pompe inclinée, planche, pont + bras haltères 5 kg (curl + élévation latérale) + suspension barre traction. Garde-fou épaules : jamais jusqu'à l'échec.", today:true });
  } else {
    matin.push({ h:"07h00", t:"🚶 Repos actif", sub:"marche, vélo, mobilité", today:false });
  }
  // 09h00 — encas post-course (sans adaptogène : il est pris au réveil à 6h40)
  matin.push({
    h:"09h00",
    t:"🍊 Encas + 🍵 Thé vert",
    sub: "1 orange bio + fromage d'abbaye + 1 tasse de thé vert",
    today: true
  });
  sections.push({ titre:"🌅 Matin", open:true, items:matin });

  /* ====== JOURNÉE ====== */
  const jourItems = [
    { h:"11h00", t:"☕ Café 2 + noix 30 g", sub:"mélange + noix du Brésil = 1 SEULE/jour" },
  ];
  // Spiruline — affichée seulement si en cure (sinon : pause de cycle, disparaît du flux)
  if (enCure("spiruline")) {
    jourItems.push({ h:"13h00", t:"💊 Spiruline Blue Bio", sub:"2 gélules, à jeun", today:true });
  }
  jourItems.push(
    { h:"14h00", t:"🥗 Repas 1 + D3+K2",
      sub:`légumes crus + fruits + jus Kuvings + 1 goutte D3+K2 · 🥤 ${jusSanteDuJour.nom} (${jusSanteDuJour.compo} — composition résumée, recette complète dans reference-jus-kuvings.md)` + (plaisirWeekend ? ` · 🍹 Alternative plaisir week-end (selon l'envie, remplace le jus santé) : ${plaisirWeekend.nom}` : ""),
      today:true },
    { h:"14h15", t:"🍵 Matcha", sub:"1 c. à café (~2 g), eau 80 °C" },
    { h:"16h00", t:"🍫 Chocolat noir 85 %", sub:"20–30 g bio · DERNIÈRE caféine" }
  );
  // Rituel bien-être dominical (~25 min, dimanche — moment libre dans la journée)
  if (dimanche) {
    jourItems.push({ h:"", t:"🧘 Rituel bien-être dominical", sub:"Fauteuil shiatsu MC825 (15 min, arrêt auto, mode au ressenti) + casque Sennheiser (méditation/bols) + diffusion Orange 2 + Lavande 2 + Cèdre 1. ~25 min, moment libre. Pas de caféine (eau).", today:true });
  }
  sections.push({ titre:"🌤️ Journée", open:true, items:jourItems });

  /* ====== SOIR ====== */
  // Valeur du jour (rotation 7 valeurs, dossier Mon parcours) — constat de fin de journée
  { const v = valeurDuJour();
    const valueItems = [
      { h:"", type:"croy", t:"⚓ Valeur du jour — " + v.nom, sub:v.q + " (Mon parcours)" },
    ];
    sections.push({ titre:"⚓ Valeur du jour", open:true, items:valueItems });
  }

  // Souper — compléments du soir affichés seulement si en cure
  const compltsSoir = [];
  if (enCure("omega3"))      compltsSoir.push("Omega-3");
  if (enCure("magnesium"))   compltsSoir.push("Mg");
  if (enCure("ashwagandha")) compltsSoir.push("Ashwagandha");
  const subSouper = "protéines + légumes cuits + glucides" + (compltsSoir.length ? " + " + compltsSoir.join(" + ") : "");

  const soirItems = [
    { h:"18h00", t:"🍲 Souper", sub: subSouper },
    { h:"18h10", t:"🚶 Marche post-prandiale", sub:"10 min (si temp. OK)" },
    { h:"19h00", t:"🫖 Tisane", sub:"fenouil/gingembre/cannelle si besoin — digestion (après souper)" },
  ];
  if (bainPiedsRelax) {
    soirItems.push({ h:"20h30", type:"he", t:"🦶 Bain de pieds relaxation",
      sub:"Lavande 2 + Camomille noble 1 + Néroli 1 (4 gt) / 1 bouchon Base Neutre Puressentiel → eau chaude. 10-20 min. ❌ Jamais menthe ni eucalyptus. Remplace la diffusion du soir.", today:true });
  }
  if (bainPiedsSport) {
    soirItems.push({ h:"20h30", type:"he", t:"🦶 Bain de pieds sportif (au ressenti)",
      sub:"Pin sylvestre 2 + Gingembre 1 + Lavande 1 (4 gt) / 1 bouchon Base Neutre Puressentiel → eau + sel Epsom séparément. 15-20 min. Retour au calme + hydratation avant. Ne remplace pas la friction. Remplace la diffusion du soir.", today:true });
  }
  soirItems.push({ h:"21h00", t:"🧘 Mobilité douce + stomach vacuum", sub:"2–3 min — mobilité générale selon le confort (pas d'étirement ciblé comme traitement)." });
  // Diffusion soirée : supprimée les soirs de bain de pieds (le bain remplace la diffusion) et le samedi (soirée repos olfactif)
  if (!bainPiedsRelax && !bainPiedsSport && !samedi) {
    soirItems.push({ h:"21h00", type:"he", t:"🌿 Diffusion soirée", sub:"Orange douce 2 + Lavande 2 + Cèdre 1 — jusqu'à 1 h max, fenêtre ouverte.", today:true });
  }
  soirItems.push({ h:"21h10", t:"🕷️ Araignée crânienne", sub:"30 s–1 min.", today:true });
  // 21h15 — yoga des yeux : index + palming en semaine ; index seul le vendredi (le Yin remplace le palming)
  if (!yogaYin) {
    soirItems.push({ h:"21h15", t:"👁️ Yoga des yeux", sub:"exercice de l'index + palming (anti-presbytie + nerf vague)" });
  } else {
    soirItems.push({ h:"21h15", t:"👁️ Yoga des yeux", sub:"exercice de l'index seul — palming remplacé par le Yoga Yin", today:true });
  }
  if (yogaYin) {
    soirItems.push({ h:"21h45", t:"🧘 Yoga Yin", sub:"30 min (vendredi soir) — 8 postures débutant, sans matériel. Détail dans reference-yoga-yin.md", today:true });
  }
  soirItems.push({ h:"22h15", type:"he", t:"💆 Massage Apaisement signature", sub:"Camomille noble 6 + Lavande 3 gt / amande 30 ml — plexus, trapèzes, côtés+arrière du cou. Massage lent.", today:true });
  soirItems.push({ h:"22h30", t:"🌙 Coucher", sub:"Fenêtre de jeûne : du souper (18h) jusqu'à l'adaptogène du réveil (6h40) — ~12-13 h." });
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
      { h:"", type:"alerte", t:"🦵 Genou droit — signe neuro", sub:"Avis médical à programmer. Fourmillements / perte de sensation → consulter. Les HE ne traitent pas ce symptôme neurologique." },
      { h:"", type:"alerte", t:"🌞 Grains de beauté — bras gauche", sub:"Dermato annuel. Pas d'HE d'agrume (citron, bergamote, orange) appliquée sur la peau avant soleil (photosensibilisation cutanée). L'ingestion d'un jus d'agrume ne nécessite pas d'éviter le soleil." },
      { h:"", type:"alerte", t:"🫘 Atrophie rénale congénitale", sub:"Suivie par néphrologue. Pas d'ingestion d'HE. Hydratation forte. Menthe proscrite en ingestion." },
      { h:"", type:"alerte", t:"🐱 Chat", sub:"Diffusion en bas → fenêtre ouverte. Jamais d'HE appliquée sur le chat." },
      { h:"", type:"alerte", t:"🌡️ Météo > 25 °C à 7h", sub:"pas de course → repos actif (marche / mobilité)" },
      { h:"", type:"alerte", t:"🦵 Douleur aine/pli de hanche G > 3/10", sub:"réduire l'allure / marcher · mobilité douce selon confort (pas d'étirement comme traitement) · 2 ajustements max puis consult" },
      { h:"", type:"alerte", t:"💧 Transit trop rapide", sub:"réduire magnésium" },
      { h:"", type:"alerte", t:"☕ Anxiété, palpitations, insomnie", sub:"réduire caféine et/ou Tyrosine/Rhodiola" },
    ]
  });

  /* ====== CYCLES COMPLÉMENTS (tableau de bord automatique) ====== */
  // Affiche où en est chaque complément à cycle. Non cochable (info, pas action).
  const cycleItems = CYCLES.map(c => {
    const e = etatCycleAujourdhui(c);
    const jr = e.jour > 1 ? "jours" : "jour";
    if(e.etat === "cure"){
      return { h:"", type:"cycle", t:`${c.nom} — cure ${e.jour}/${e.total} ${jr}`,
              sub: e.reste===0 ? "dernier jour de cure" : `fin dans ${e.reste} j`,
              today: e.reste===0 };
    } else {
      const repriseDans = e.reste + 1; // reste n'inclut pas le jour courant
      return { h:"", type:"cycle", t:`${c.nom} — pause ${e.jour}/${e.total} ${jr}`,
              sub: e.reste===0 ? "reprise demain" : `reprise dans ${repriseDans} j`,
              today: e.reste===0 };
    }
  });
  sections.push({ titre:"💊 Cycles compléments", open:false, items:cycleItems });

  /* ====== RECETTES HE (référence) ====== */
  sections.push({
    titre: "🌿 Recettes HE (référence)",
    open: false,
    items: [
      { h:"", type:"recette", t:"Massage Apaisement signature", sub:"Camomille noble 6 + Lavande 3 / amande 30 ml (flacon permanent). Plexus, trapèzes, cou. Recours de l'endormissement difficile et de la rumination." },
      { h:"", type:"recette", t:"Friction post-course", sub:"Gingembre 2 + Immortelle 1 + Laurier 1 + Pin 1 / amande 10 ml (flacon d'essai). Cuisses et zone musculaire périphérique confortable, 3-5 min. Bénéfice Immortelle observé personnellement." },
      { h:"", type:"recette", t:"Roll-on Laurier — focalisation", sub:"Laurier noble 2 + Romarin cinéole 2 / jojoba 10 ml. Poignets au début d'une session de réflexion ou pour un trac." },
      { h:"", type:"recette", t:"Sérum visage", sub:"Rose musquée 10 ml + Jojoba 5 ml + Palmarosa 1 + Lavande 1 (flacon 15 ml). Le soir selon le besoin, 2-4 gt, visage+cou. Max 1/jour. Éviter contour des yeux." },
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
  { date:"Déc. 2026", t:"Prise de sang complète (Dr Colin Rasson) — cible LDL 100 mg/dL + PSA (prostate)" },
  { date:"Fin 2026", t:"Bilan ophtalmo (pression intra-oculaire, fond d'œil, accommodation)" },
  { date:"Annuel", t:"Dermatologue (grains de beauté bras gauche)" },
];
