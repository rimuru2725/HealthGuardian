// service-worker.js
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('emergency-portal-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/emergency-portal.html',
                '/js/emergency-portal.js',
                '/firstaid.html',
                '/js/firstaid.js',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
                'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css',
                'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});