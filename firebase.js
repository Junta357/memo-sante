/* ============================================================
   FIREBASE.JS — Synchronisation des cochages via Firestore
   ------------------------------------------------------------
   Stocke l'état du jour (cochages + clôture) dans Firestore,
   pour synchroniser entre PC et smartphone.
   ============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore, doc, setDoc, getDoc, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAfWuVAQ1UAvXKMcgLcYohjUSrZBjfqdy4",
  authDomain: "memo-sante.firebaseapp.com",
  projectId: "memo-sante",
  storageBucket: "memo-sante.firebasestorage.app",
  messagingSenderId: "567221423411",
  appId: "1:567221423411:web:eb0b8c9e09e66d5d6d0246",
  measurementId: "G-6ZHTVW9KCD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// L'ID utilisateur — FIXE et partagé entre tous tes appareils.
// Comme c'est ton app perso, un ID fixe suffit : le PC et le téléphone
// liront/écriront dans le MÊME document Firestore, donc ils se synchronisent.
const UID = "memo-gilles-2026";

/* Récupère l'état d'un jour depuis Firestore.
   Retourne {done:{}, closed:false} ou null si inexistant. */
async function loadRemote(dateKey){
  try{
    const ref = doc(db, "memo-sante", UID + "-" + dateKey);
    const snap = await getDoc(ref);
    if(snap.exists()){
      const data = snap.data();
      console.log("[memo-sync] loadRemote OK:", dateKey, data);
      return data;
    }
    console.log("[memo-sync] loadRemote: aucun doc pour", dateKey);
    return null;
  }catch(e){
    console.warn("[memo-sync] loadRemote error:", e);
    return null;
  }
}

/* Sauvegarde l'état d'un jour vers Firestore. */
async function saveRemote(dateKey, state){
  try{
    const ref = doc(db, "memo-sante", UID + "-" + dateKey);
    await setDoc(ref, state);
    console.log("[memo-sync] saveRemote OK:", dateKey, Object.keys(state.done||{}).length, "items");
    return true;
  }catch(e){
    console.warn("[memo-sync] saveRemote error:", e);
    return false;
  }
}

/* Écoute en temps réel les changements d'un jour.
   Retourne une fonction pour arrêter d'écouter. */
function listenRemote(dateKey, onChange){
  const ref = doc(db, "memo-sante", UID + "-" + dateKey);
  return onSnapshot(ref, (snap)=>{
    if(snap.exists()){
      console.log("[memo-sync] onSnapshot update:", dateKey);
      onChange(snap.data());
    }
  }, (err)=>{
    console.warn("[memo-sync] onSnapshot error:", err);
  });
}

// Exposer pour index.html (qui n'est pas un module)
window.memoSync = { loadRemote, saveRemote, listenRemote, UID };
console.log("[memo-sync] firebase.js chargé. UID =", UID);
