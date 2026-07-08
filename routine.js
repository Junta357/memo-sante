/* ============================================================
   ROUTINE.JS — Données de ta routine (santé + huiles essentielles)
   ------------------------------------------------------------
   C'est LE fichier à éditer pour modifier ta routine.
   Tu n'as pas besoin de toucher au reste de l'application.
   Syntaxe : JavaScript simple. Respecte les virgules et les guillemets.
   ============================================================ */

// dow : 0=dimanche, 1=lundi, 2=mardi, 3=mercredi, 4=jeudi, 5=vendredi, 6=samedi
const JOURS = ["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];

function routinePour(dow) {
  // --- Conditions du jour ---
  const rhodiola = dow===3 || dow===6;         // mer, sam
  const tyrosine = [0,1,2,4,5].includes(dow);  // dim,lun,mar,jeu,ven
  const jourCourse = dow===1 || dow===3 || dow===5; // lun,mer,ven
  const sardines = dow===2 || dow===6;         // mar,sam
  const yogaYin = dow===5;                     // ven
  const bainRecup = dow===4;                   // jeu (récupération sport)
  const weekend = dow===0 || dow===6;

  const sections = [];

  /* ====== AUJOURD'HUI (contexte immédiat, en premier) ====== */
  const dayItems = [];
  if (weekend)      dayItems.push({ h:"", t:"🚶 Repos actif", sub:"marche, vélo, stretching — pas de course", today:true });
  else              dayItems.push({ h:"", t:"🏃 Jour de course", sub:"5–7,5 km · privilégie le Jus B au repas 1 + friction post-course", today:true });
  if (rhodiola)     dayItems.push({ h:"", t:"💊 Rhodiola aujourd'hui", sub:"7h30 à jeun · pas de Tyrosine aujourd'hui", today:true });
  if (tyrosine)     dayItems.push({ h:"", t:"💊 Tyrosine aujourd'hui", sub:"8h30 · pas de Rhodiola aujourd'hui", today:true });
  if (sardines)     dayItems.push({ h:"", t:"🐟 Sardines", sub:"1 boîte au souper", today:true });
  if (bainRecup)    dayItems.push({ h:"", t:"🛁 Bain récupération", sub:"ce soir — Gingembre/Pin/Épinette + sel Epsom", today:true });
  if (yogaYin)      dayItems.push({ h:"", t:"🧘 Yoga Yin 30 min", sub:"ce soir", today:true });
  sections.push({ titre:"📌 Aujourd'hui", open:true, items:dayItems });

  /* ====== MATIN ====== */
  const matin = [
    { h:"06h30", t:"Réveil", sub:"simulateur d'aube" },
    { h:"06h35", t:"👁️ Yoga des yeux", sub:"5 clignements conscients + 1 palming (1 min)", today:true },
    { h:"06h40", t:"💪 Stomach vacuum", sub:"2 min, 2–3 reps, cou relâché" },
    { h:"06h45", t:"☕ Café 1", sub:"noir bio" },
    // HE — Diffusion tonique au lever
    { h:"06h50", type:"he", t:"🌿 Diffusion tonique", sub:"Romarin 2 + Pin 2 + Menthe poivrée 1 — 10 min, pièce de vie. 🐱 Chat en bas → fenêtre ouverte.", today:true },
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
        sub:`légumes crus + fruits + jus Kuvings + 1 goutte D3+K2 · ${jourCourse?"Jus B (cardio)":"Jus A ou B au choix"}`,
        today:jourCourse },
      { h:"14h15", t:"🍵 Matcha", sub:"1 c. à café (~2 g), eau 80 °C" },
      { h:"16h00", t:"🍫 Chocolat noir 85 %", sub:"20–30 g bio · DERNIÈRE caféine" },
    ]
  });

  /* ====== SOIR ====== */
  const soirItems = [
    { h:"18h00", t:"🍲 Souper", sub:"protéines + légumes cuits + glucides + Omega-3 + Mg + Ashwagandha" },
    { h:"18h10", t:"🚶 Marche post-prandiale", sub:"10 min (si temp. OK)" },
  ];
  if (bainRecup) {
    soirItems.push({ h:"20h30", type:"he", t:"🛁 Bain récupération sport",
      sub:"Gingembre 2 + Pin 2 + Épinette 2 gt + poignée sel Epsom — 20 min. Pré-diluer dans ½ c.c. d'huile. ❌ Jamais menthe ni eucalyptus dans le bain.", today:true });
  }
  soirItems.push(
    { h:"21h00", t:"🧘 Étirements adducteurs", sub:"papillon + fente latérale + stomach vacuum · 2–3 min" },
    { h:"21h00", type:"he", t:"🌿 Diffusion soirée", sub:"Orange douce 2 + Lavande 2 + Cèdre 1 — pièce. 🐱 Chat → fenêtre ouverte.", today:true },
    { h:"21h15", t:"👁️ Yoga des yeux", sub:"exercice de l'index + palming (anti-presbytie + nerf vague)" },
    { h:"21h30", t:"🫖 Tisane", sub:"fenouil/gingembre/cannelle si besoin" },
    { h:"22h15", type:"he", t:"🌿 Massage coucher", sub:"Camomille noble 2 + Lavande 1 gt / 1 c.c. amande — épaules, cou, plexus. Camomille = ton n°1 sommeil.", today:true },
    { h:"22h25", type:"he", t:"🌿 Spray oreiller", sub:"Camomille 8 + Lavande 6 + Néroli 3 gt / 30 ml eau — 2-3 pschitts (loin des yeux)", today:true },
    { h:"22h30", t:"🌙 Début jeûne nocturne", sub:"~14 h jusqu'à 8h30" },
  );
  if (yogaYin) {
    soirItems.push({ h:"21h45", t:"🧘 Yoga Yin", sub:"30 min (vendredi soir)", today:true });
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

  return sections;
}

/* Échéances à venir (affichées dans l'app) */
const ECHEANCES = [
  { date:"09/07/2026", t:"Marche 20 km + point adducteur", warn:true },
  { date:"Déc. 2026", t:"Prise de sang complète (Dr Collin Rasson) — cible LDL 100 mg/dL" },
  { date:"Fin 2026", t:"Bilan ophtalmo (pression intra-oculaire, fond d'œil, accommodation)" },
  { date:"Annuel", t:"Dermatologue (grains de beauté bras gauche)" },
];
