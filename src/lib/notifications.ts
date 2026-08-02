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
    alert('A böngésződ nem támogatja az értesítéseket. (iPhone-on add hozzá a főképernyőhöz az alkalmazást!)');
    return 'denied';
  }
  
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'denied') {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      if (isIOS) {
        alert('iPhone-on az értesítések csak akkor működnek, ha hozzáadod az alkalmazást a Főképernyőhöz (Add to Home Screen) és onnan nyitod meg!');
      }
    }
    return perm;
  } catch (e) {
    console.error("Error requesting permission", e);
    return 'default';
  }
}
