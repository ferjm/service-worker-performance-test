function debug(msg) {
  console.log('Service Worker', msg);
}

mark('service-worker-loaded');

debug('Loaded', performance.now());

var _client;
var _msgQueue = [];

function client() {
  if (_client) {
    return Promise.resolve(_client);
  }
  return clients.matchAll().then(function(clients) {
    if (!clients.length) {
      return Promise.reject();
    }
    _client = clients[0];
    return _client;
  });
}

function mark(mark) {
  var msg = {
    type: 'mark',
    sentAt: performance.now(),
    mark: mark
  };

  client().then(function(c) {
    if (_msgQueue.length) {
      for (var i = 0; i < _msgQueue.length; i++) {
        debug('QUEUE ' + JSON.stringify);
        c.postMessage(_msgQueue.pop());
      }
    }
    debug('Sending ' + JSON.stringify(msg));
    c.postMessage(msg);
  }).catch(function() {
    console.log('Oh crap! no client yet', msg);
    _msgQueue.push(msg);
  });
}

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

  mark('service-worker-open-cache');
  e.respondWith(
    caches.open('cache').then(function(cache) {
      mark('service-worker-cache-opened');
      mark('service-worker-cache-match-start');
      return cache.match(e.request.url);
    }).then(function(response) {
      mark('service-worker-cache-match-result');
      if (!response) {
        debug(e.request.url + ' not in the cache');
        return fetch(e.request.clone());
      }
      debug(e.request.url + ' is in the cache');
      return response;
    })
  );
});
