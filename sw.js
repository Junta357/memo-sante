/* Service Worker — Mémo Santé (offline + mises à jour rapides)
   Stratégie :
   - network-first pour les fichiers principaux (index.html, routine.js, sw.js,
     manifest) → les mises à jour sont vues dès la prochaine ouverture.
   - cache-first pour les icônes (changent rarement, économise du réseau).
   - Fallback offline : si le réseau échoue, on sert le cache. */
const CACHE = "memo-sante-v17";
const PRINCIPAUX = ["./","./index.html","./routine.js","./manifest.json","./sw.js","./firebase.js"];
const ASSETS = [
  ...PRINCIPAUX,
  "./icons/icon-192.png","./icons/icon-512.png","./icons/icon-512-maskable.png",
  "./icons/favicon-32.png","./icons/apple-touch-180.png"
];

self.addEventListener("install", e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=> c.addAll(ASSETS)).then(()=> self.skipWaiting())
  );
});

self.addEventListener("activate", e=>{
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.filter(k=>k!==CACHE).map(k=> caches.delete(k)))
    ).then(()=> self.clients.claim())
  );
});

self.addEventListener("message", e=>{
  if(e.data==="SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if(url.origin !== self.location.origin) return;

  const isPrincipal = PRINCIPAUX.some(p=> url.pathname.endsWith(p.replace("./","/")) || url.pathname===p.replace("./","/"));

  if(isPrincipal){
    // Network-first : vérifie le réseau d'abord, met à jour le cache, fallback offline.
    e.respondWith(
      fetch(e.request).then(resp=>{
        if(resp && resp.status===200){
          const copy = resp.clone();
          caches.open(CACHE).then(c=> c.put(e.request, copy));
        }
        return resp;
      }).catch(()=> caches.match(e.request).then(hit=> hit || caches.match("./index.html")))
    );
  } else {
    // Cache-first pour les icônes (stables).
    e.respondWith(
      caches.match(e.request).then(hit=> hit || fetch(e.request).then(resp=>{
        if(resp && resp.status===200){
          const copy = resp.clone();
          caches.open(CACHE).then(c=> c.put(e.request, copy));
        }
        return resp;
      }).catch(()=> caches.match("./index.html")))
    );
  }
});
