/// <reference lib="webworker" />

/** @type {ServiceWorkerGlobalScope} */
const sw = self;

const cacheName = 'v1.2.0';

const addResourcesToCache = async (resources) => {
	const cache = await caches.open(cacheName);
	await cache.addAll(resources);
};

sw.addEventListener('install', (event) => {
	event.waitUntil(addResourcesToCache([
		'/index.html',
		'/manifest.webmanifest',
		'/js/main.js',
		'/css/style.css',
		'/css/style.css.map',
		'/assets/logo/logo.svg',
		'/assets/logo/logo.webp',
		...[48, 72, 96, 144, 168, 192].map((n) => `/assets/logo/logo-${n}.png`),
		'/fonts/noto-serif-hebrew/wght.css',
		'/fonts/noto-serif-hebrew/files/noto-serif-hebrew-hebrew-wght-normal.woff2',
		'/fonts/noto-serif-hebrew/files/noto-serif-hebrew-latin-wght-normal.woff2',
		'/fonts/noto-serif-hebrew/files/noto-serif-hebrew-latin-ext-wght-normal.woff2',
	]));
});

// Clear old caches
sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key === cacheName) return;
				return caches.delete(key);
			}));
		}),
	);
});

sw.addEventListener('fetch', (event) => {
	event.respondWith((async () => {
		const r = await caches.match(event.request);
		console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
		if (r) {
			return r;
		} else {
			const response = await fetch(event.request);
			const cache = await caches.open(cacheName);
			console.log(
				`[Service Worker] Caching new resource: ${event.request.url}`,
			);
			cache.put(event.request, response.clone());
			return response;
		}
	})());
});
