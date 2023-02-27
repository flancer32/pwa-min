'use strict';
// Cache store name to save static resources
const CACHE_STATIC = 'static-cache-v1';
// Minimal set of files to cache to be a PWA
const FILES_TO_CACHE = [
    './',
    './favicon.ico',
    './img/favicon-512.png',
    './index.html',
    './pwa.json',
];

// FUNCS

/**
 * Load and store required static resources on installation.
 * @param {ExtendableEvent} evt
 */
function hndlEventInstall(evt) {
    // FUNCS
    async function cacheStaticFiles() {
        const cacheStat = await caches.open(CACHE_STATIC);
        // load all resources at the same time (parallel)
        await Promise.all(
            FILES_TO_CACHE.map(function (url) {
                return cacheStat.add(url).catch(function (reason) {
                    console.log(`'${url}' failed: ${String(reason)}`);
                });
            })
        );
    }

    // MAIN
    //  wait until all static files will be cached
    evt.waitUntil(cacheStaticFiles());
}

/**
 * Return static resource from cache (if exists) or fetch from network.
 * @param {FetchEvent} evt
 */
function hndlEventFetch(evt) {
    async function cacheOrFetch(req) {
        const cache = await self.caches.open(CACHE_STATIC);
        const cachedResponse = await cache.match(req);
        return cachedResponse ?? await fetch(req);
    }

    evt.respondWith(cacheOrFetch(evt.request));
}

// MAIN
self.addEventListener('install', hndlEventInstall);
self.addEventListener('fetch', hndlEventFetch);