// public/service-worker.js
self.addEventListener('install', (event) => {
    console.log('Service Worker installing.');
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/logo192.png',
          '/logo512.png',
          '/manifest.json',
          '/static/js/bundle.js',
          '/static/js/0.chunk.js',
          '/static/js/main.chunk.js',
          '/static/css/main.chunk.css',
        ]);
      })
    );
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    console.log('Service Worker activating.');
    const cacheWhitelist = ['my-cache'];
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!cacheWhitelist.includes(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
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
  
  self.addEventListener('push', function (event) {
    const data = event.data?.json() || { title: 'Default title', body: 'No body' };
  
    const options = {
      body: data.body,
      icon: 'logo192.png',
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  