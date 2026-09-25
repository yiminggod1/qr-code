const CACHE_NAME = 'qr-code-generator-v3';
const FILES = [
  'index.html',
  'url-qr-code.html',
  'wifi-qr-code.html',
  'email-qr-code.html',
  'vcard-qr-code.html',
  'sms-qr-code.html',
  'phone-qr-code.html',
  'whatsapp-qr-code.html',
  'pdf-qr-code.html',
  'google-review-qr-code.html',
  'qr-code-scanner.html',
  'qr-code-generator-for-business.html',
  '404.html',
  'privacy.html',
  'terms.html',
  'manifest.json',
  'css/bootstrap.min.css',
  'js/qrcode.min.js'
].map(file => new URL(file, self.location).pathname);

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const isNavigation = event.request.mode === 'navigate';
  event.respondWith(
    isNavigation
      ? fetch(event.request).then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        }).catch(() => caches.match(event.request).then(cached => cached || caches.match(FILES[0])))
      : caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
