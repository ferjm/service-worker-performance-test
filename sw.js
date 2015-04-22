function debug(msg) {
  console.log(performance.now() + ' Service Worker ' + msg);
}

mark('service-worker-loaded');

var _client;
var _ready;
var _msgQueue = [];

function client() {
  if (_client) {
    return Promise.resolve(_client);
  }
  return self.clients.matchAll().then(function(clients) {
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
    if (!_ready) {
      _msgQueue.push(msg);
      return;
    }
    c.postMessage(msg);
  }).catch(function() {
    _msgQueue.push(msg);
  });
}

this.addEventListener('install', function(e) {
  mark('service-worker-oninstall');
  e.waitUntil(
    caches.open('cache').then(function(cache) {
      return cache.addAll(['/img/swcache.jpg']).then(function() {
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
  mark('service-worker-open-cache');
  e.respondWith(
    caches.open('cache').then(function(cache) {
      mark('service-worker-cache-opened');
      mark('service-worker-cache-match-start');
      return cache.match(e.request.url);
    }).then(function(response) {
      mark('service-worker-cache-match-result');
      if (!response) {
        return fetch(e.request.clone());
      }
      return response;
    })
  );
});

this.addEventListener('message', function(msg) {
  if (!_ready) {
    _ready = true;
  }
  if (_msgQueue.length) {
    for (var i = 0; i < _msgQueue.length; i++) {
      var queuedMsg = _msgQueue.pop();
      msg.source.postMessage(queuedMsg);
    }
  }
});
