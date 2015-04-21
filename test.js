console.log('Registering service worker');
window.performance.mark('service-worker-registering');

navigator.serviceWorker.register('sw.js', {
  scope: './'
}).then(function(worker) {
  window.performance.mark('service-worker-registered');
  console.log('Registered');
}, function(e) {
  console.error('Not registered:' + e);
});

navigator.serviceWorker.ready.then(function(sw) {
  sw.active.postMessage('ready');
});

navigator.serviceWorker.onmessage = function(msg) {
  if (msg.type != 'mark') {
    return;
  }
  // XXX remove delta
  window.performance.mark(msg.mark);
};
