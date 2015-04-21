console.log('Registering service worker');
window.performance.mark('service-worker-registering');

navigator.serviceWorker.register('sw.js').then(function(worker) {
  window.performance.mark('service-worker-registered');
  console.log('Registered');
}, function(e) {
  console.error('Not registered:' + e);
});

navigator.serviceWorker.onmessage = function(msg) {
  if (msg.type != 'mark') {
    return;
  }
  console.log(JSON.stringify(msg));
  // XXX remove delta
  window.performance.mark(msg.mark);
};
