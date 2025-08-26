const version = 1.0;

const urlsToCache = [
  "/",
  "/index.html",
  "/main.js",
  "/install.js",
  "/register-sw.js",
  "/sw.js",
  "/manifest.json",
  "/favicon.ico",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
  "/icons/favicon-96x96.png",
  "/icons/favicon-256x256.png",
  "/screenshots/screenshot-portrait.png",
  "/screenshots/screenshot-landscape.png",
  "/main.css",
  "https://ingrwf12.cepegra-frontend.xyz/cockpit1/api/content/items/voyages",
  "https://fonts.googleapis.com/css2?family=Oswald:wght@200..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
];

const cacheVersion = 1;

const CACHE_NAME = `pwa-cache-${cacheVersion}`;

// install

self.addEventListener("install", (e) => {
  console.log("Service Worker: Installed");
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  return self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  console.log("Service Worker: Activated");
  return self.clients.claim();
});

// proxy

// self.addEventListener("fetch", (e) => {
//   console.log("Service Worker: Fetching");
//   e.respondWith(
//     caches.match(e.request).then((response) => {
//       return response || fetch(e.request);
//     })
//   );
// });

//proxy
/*
self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then((cached) => {
        return cached;
      })
      .catch(() => {
        return fetch(e.request).then((resp) => {
          const respClone = resp.clone();
          caches.open(CACHE_NAME).then((cache) => {
            return cache.put(e.request, respClone);
          });
          return resp;
        });
      })
  );
});

*/

//proxy
// Intercepte toutes les requêtes réseau (fetch)
self.addEventListener("fetch", (e) => {
  // Ne prend en charge que les requêtes GET.
  // Pour POST/PUT/DELETE... on laisse le navigateur gérer (pas de respondWith).
  if (e.request.method !== "GET") return;

  // On remplace la réponse par notre logique de cache/réseau
  e.respondWith(
    // 1) Regarder d'abord dans le Cache Storage s'il existe déjà une réponse
    caches.match(e.request).then((cached) => {
      if (cached) return cached; // ✅ Ressource trouvée en cache → on la renvoie tout de suite (cache-first)

      // 2) Sinon, on va sur le réseau
      return fetch(e.request)
        .then((resp) => {
          // Les Response sont des streams consommables une seule fois.
          // On clone pour pouvoir à la fois renvoyer la réponse au navigateur ET l’enregistrer dans le cache.
          const clone = resp.clone();

          // On ne met en cache que si:
          // - la réponse est OK (status 200-299)
          // - la ressource est de même origine (évite de stocker des réponses opaques/CORS)
          if (
            resp.ok &&
            new URL(e.request.url).origin === self.location.origin
          ) {
            // Mise en cache en "runtime" (asynchrone, on n'attend pas)
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(e.request, clone));
          }

          // On renvoie la réponse réseau au navigateur
          return resp;
        })
        .catch(() => {
          // 3) Ici on arrive si le réseau échoue (offline, DNS, etc.)

          // Si la requête est une navigation (ex: refresh / saisie d'URL),
          // on renvoie l'index de la SPA pour avoir un fallback hors-ligne.
          if (e.request.mode === "navigate") {
            return caches.match("/index.html");
          }

          // Pour les autres requêtes (images, CSS, etc.) sans fallback spécifique,
          // on renvoie une réponse "Offline" 503.
          return new Response("Offline", {
            status: 503,
            statusText: "Offline",
          });
        });
    })
  );
});
