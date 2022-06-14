/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */
const sw = self;

const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

sw.addEventListener('install', (event) => {
    event.waitUntil(addResourcesToCache([
        '/index.html',
        '/manifest.webmanifest',
        '/js/main.js',
        '/js/wiring.js',
        '/css/style.css',
        '/assets/icons.sprite.svg',
        '/assets/logo/logo.svg',
        '/assets/logo/logo.webp',
        ...[48, 72, 96, 144, 168, 192].map(n => `/assets/logo/logo-${n}.png`),
        '/fonts/noto-serif-hebrew/variable.css',
        '/fonts/noto-serif-hebrew/files/noto-serif-hebrew-hebrew-variable-wghtOnly-normal.woff2',
    ]))
})

sw.addEventListener('fetch', async (event) => {
    const r = await caches.match(event.request);
    console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
    if (r) {
        event.respondWith(r)
    } else {
        const response = await fetch(event.request);
        const cache = await caches.open(cacheName);
        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
        cache.put(event.request, response.clone());
        event.respondWith(response);
    }
})
