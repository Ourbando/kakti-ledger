const CACHE = "kakti-1789014835";
const FILES = ["./", "./index.html", "./manifest.json", "./icon-180.png", "./icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  let u; try { u = new URL(e.request.url); } catch(err) { return; }
  if (u.origin !== self.location.origin) return;
  e.respondWith(fetch(e.request).then((r) => { if (r && r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); } return r; }).catch(() => caches.match(e.request, {ignoreSearch: true}).then((m) => m || caches.match("./index.html"))));
});
