console.log('Registering service worker');
navigator.serviceWorker.register('sw.js').then(function(worker) {
  console.log('Registered');
}, function(e) {
  console.error('Not registered:' + e);
});

