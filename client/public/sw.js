const cacheName = "wc-planner-v1.0";

const filesToCache = [
    "./index.html",
    "./manifest.json",
    "./icons/icon_small.png",
    "./icons/icon_medium.png",
    "./icons/icon_large.png",
];

// install — cache files
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        }),
    );
});

// activate — delete old caches
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((name) => {
                    if (name !== cacheName) {
                        return caches.delete(name);
                    }
                }),
            );
        }),
    );
});

// fetch — cache first, then network, then offline
self.addEventListener("fetch", (e) => {
    // don't intercept Google Maps requests
    if (
        e.request.url.includes("maps.googleapis.com") ||
        e.request.url.includes("maps.gstatic.com") ||
        e.request.url.includes("openweathermap.org") ||
        e.request.url.includes("wikipedia.org")
    ) {
        return;
    }

    e.respondWith(
        caches.match(e.request).then((response) => {
            if (response) {
                return response;
            }
            return fetch(e.request).catch(() => {
                return caches.match("./index.html");
            });
        }),
    );
});
