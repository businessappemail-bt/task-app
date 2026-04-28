const CACHE_NAME = "taskmint-cache-v1";

const filesToCache = [
"index.html",
"signup.html",
"login.html",
"how-it-works.html",
"manifest.json"
];

self.addEventListener("install", event => {
event.waitUntil(
caches.open(CACHE_NAME).then(cache => {
return cache.addAll(filesToCache);
})
);
});

self.addEventListener("fetch", event => {
event.respondWith(
caches.match(event.request).then(response => {
return response || fetch(event.request);
})
);
});