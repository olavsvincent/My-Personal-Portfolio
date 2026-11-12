/* Service worker — makes the portfolio installable and usable offline.
   Bump CACHE_VERSION whenever you publish changes so visitors get fresh files. */
const CACHE_VERSION = "v1";
const CACHE = "portfolio-" + CACHE_VERSION;
const CORE = [
  "./", "index.html", "about.html", "skills.html", "projects.html", "contact.html",
  "editor.html", "blog.html", "resume.html", "offline.html",
  "style.css", "features.css", "theme-customizer.css", "skills.css",
  "script.js", "features.js", "voice.js", "voice.css", "project.html", "project-lab.css", "project-lab.js", "backend.js", "site-config.js", "i18n.js", "theme-customizer.js",
  "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(CORE.map((url) => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith("portfolio-") && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;               // GitHub API, fonts, etc. go straight to network
  if (/\.(mp3|wav|ogg|mp4)$/i.test(url.pathname) || req.headers.has("range")) return; // never cache audio/video

  // Pages: network first, fall back to cache, then the offline page
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); return res; })
        .catch(() => caches.match(req).then((hit) => hit || caches.match("offline.html")))
    );
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(
    caches.match(req).then((hit) => {
      const fresh = fetch(req)
        .then((res) => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
        .catch(() => hit);
      return hit || fresh;
    })
  );
});
