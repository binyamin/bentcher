/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */
const sw = self;

const addResourcesToCache = async (resources) => {
    const cache = await caches.open("v1");
    await cache.addAll(resources);
};

sw.addEventListener('install', (event) => {
    // event.waitUntil(addResourcesToCache(FILES));
    event.waitUntil(addResourcesToCache([
        '/index.html',
        '/manifest.json',
        '/assets/style.css',
        '/assets/app_logo.png',
        '/assets/icons/external-link.svg',
        '/assets/js/index.js',
    ]))
})