/* Service Worker — Mémo Santé (offline-first)
   Cache les fichiers de l'app pour fonctionnement hors-ligne total. */
const CACHE = "memo-sante-v2";
const ASSETS = [
  "./",
  "./index.html",
  "./routine.js",
  "./manifest.json",
  "./sw.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png",
  "./icons/favicon-32.png",
  "./icons/apple-touch-180.png"
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

self.addEventListener("fetch", e=>{
  if(e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then(hit=>{
      if(hit) return hit;
      return fetch(e.request).then(resp=>{
        // Mettre en cache les nouvelles réponses OK
        if(resp && resp.status===200 && resp.type==="basic"){
          const copy = resp.clone();
          caches.open(CACHE).then(c=> c.put(e.request, copy));
        }
        return resp;
      }).catch(()=> caches.match("./index.html"));
    })
  );
});
