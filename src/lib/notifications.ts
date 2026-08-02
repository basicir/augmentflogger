export async function sendNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  
  if (Notification.permission !== 'granted') {
    return;
  }

  try {
    // Try native notification first (works on Chrome, Firefox, macOS Safari sometimes)
    new Notification(title, options);
    return;
  } catch (e) {
    console.warn("Native Notification failed, trying ServiceWorker...", e);
    // On iOS Safari, the native constructor throws an error
    // and we MUST use a ServiceWorker.
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        if (registration.active) {
          await registration.showNotification(title, options);
        } else {
          const readyReg = await navigator.serviceWorker.ready;
          await readyReg.showNotification(title, options);
        }
      } catch (swError) {
        console.error("ServiceWorker notification also failed", swError);
      }
    }
  }
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return 'default';
  if (!('Notification' in window)) {
    alert('Your browser does not support notifications. (On iPhone, you must Add to Home Screen first!)');
    return 'denied';
  }
  
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'denied') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        alert('On iPhone, push notifications only work if you add the app to your Home Screen (Add to Home Screen) and launch it from there!');
      }
    }
    return perm;
  } catch (e) {
    console.error("Error requesting permission", e);
    return 'default';
  }
}
