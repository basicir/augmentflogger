self.addEventListener('push', function(event) {
  console.log('Push received');
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
});
