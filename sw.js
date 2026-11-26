/* Mode hors connexion : l'application et ses icônes sont gardées sur l'appareil.
   La vidéo n'est pas mise en cache (4 Mo) : elle se charge quand l'appareil est en ligne. */
const V='compta-plus-v1.1';
const FILES=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/maskable-512.png','icons/apple-touch-icon.png','icons/favicon-32.png','icons/favicon.svg','guide-poster.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
 const r=e.request;
 if(r.method!=='GET'||new URL(r.url).origin!==location.origin||r.url.endsWith('.mp4')||r.headers.has('range'))return;
 e.respondWith(fetch(r).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp));}return res;}).catch(()=>caches.match(r).then(m=>m||caches.match('index.html'))));
});
