function mark(mark) {
  postMessage({
    type: 'mark',
    sentAt: performance.now(),
    mark: mark
  });
}

mark('service-worker-loaded');

function debug(msg) {
  console.log('Service Worker', msg);
}

debug('Loaded', performance.now());

this.addEventListener('install', function(e) {
  mark('service-worker-oninstall');
  debug('oninstall');
  e.waitUntil(
    caches.open('cache').then(function(cache) {
      return cache.addAll(['/img/swcache.jpg']).then(function() {
        debug('Image cached', performance.now());
        return Promise.resolve();
      }).catch(function(e) {
        debug('Error: ' + e);
        return Promise.reject();
      });
    })
  );
});

this.addEventListener('activate', function() {
  mark('service-worker-onactivate');
});

this.addEventListener('fetch', function(e) {
  debug('onfetch ' + e.request.url);

  e.respondWith(
    caches.open('cache').then(function(cache) {
      return cache.match(e.request.url);
    }).then(function(response) {
      if (!response) {
        debug(e.request.url + ' not in the cache');
        return fetch(e.request.clone());
      }
      debug(e.request.url + ' is in the cache');
      return response;
    })
  );
});
