const cacheName = "wc-planner-v1.0";

const filesToCache = [
    "./index.html",
    "./manifest.json",
    "./icons/icon_small.png",
    "./icons/icon_medium.png",
    "./icons/icon_large.png",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache);
        }),
    );
});

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

self.addEventListener("fetch", (e) => {
    if (
        e.request.url.includes("maps.googleapis.com") ||
        e.request.url.includes("maps.gstatic.com") ||
        e.request.url.includes("openweathermap.org") ||
        e.request.url.includes("wikipedia.org")
    ) {
        return;
    }

    e.respondWith(
        fetch(e.request)
            .then((response) => {
                return response;
            })
            .catch(() => {
                return caches.match(e.request).then((response) => {
                    if (response) {
                        return response;
                    }
                    return caches.match("./index.html");
                });
            }),
    );
});
