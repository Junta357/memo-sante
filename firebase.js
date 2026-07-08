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

// L'ID utilisateur — on reste simple : un identifiant partagé dans localStorage.
// Comme c'est ton app perso, un ID fixe suffit. On le génère une fois.
function getUserId(){
  let uid = localStorage.getItem("memo-uid");
  if(!uid){
    uid = "gilles-" + Math.random().toString(36).slice(2,10);
    localStorage.setItem("memo-uid", uid);
  }
  return uid;
}

const UID = getUserId();

/* Récupère l'état d'un jour depuis Firestore.
   Retourne {done:{}, closed:false} ou null si inexistant. */
async function loadRemote(dateKey){
  try{
    const ref = doc(db, "memo-sante", UID + "-" + dateKey);
    const snap = await getDoc(ref);
    if(snap.exists()){
      return snap.data();
    }
    return null;
  }catch(e){
    console.warn("loadRemote error:", e);
    return null;
  }
}

/* Sauvegarde l'état d'un jour vers Firestore. */
async function saveRemote(dateKey, state){
  try{
    const ref = doc(db, "memo-sante", UID + "-" + dateKey);
    await setDoc(ref, state);
    return true;
  }catch(e){
    console.warn("saveRemote error:", e);
    return false;
  }
}

/* Écoute en temps réel les changements d'un jour.
   Retourne une fonction pour arrêter d'écouter. */
function listenRemote(dateKey, onChange){
  const ref = doc(db, "memo-sante", UID + "-" + dateKey);
  return onSnapshot(ref, (snap)=>{
    if(snap.exists()){
      onChange(snap.data());
    }
  }, (err)=>{
    console.warn("listenRemote error:", err);
  });
}

// Exposer pour index.html (qui n'est pas un module)
window.memoSync = { loadRemote, saveRemote, listenRemote };
