window.performance.mark('service-worker-registering');

/*navigator.serviceWorker.register('sw.js', {
  scope: './'
}).then(function(worker) {
  window.performance.mark('service-worker-registered');
}, function(e) {
  console.error('Not registered:' + e);
});

navigator.serviceWorker.ready.then(function(sw) {
  sw.active.postMessage('ready');
  // This sucks, but we need a way to finish the test.
  setTimeout(function() {
    window.performance.mark('fullyLoaded');
  }, 2000);
});

navigator.serviceWorker.onmessage = function(msg) {
  if (msg.data.type != 'mark') {
    return;
  }
  // XXX remove delta
  window.performance.mark(msg.data.mark);
};*/

window.performance.mark('fullyLoaded');
