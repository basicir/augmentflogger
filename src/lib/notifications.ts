export async function sendNotification(title: string, options?: NotificationOptions) {
  if (typeof window === 'undefined') return;
  if (!('Notification' in window)) return;
  
  if (Notification.permission !== 'granted') {
    return;
  }

  // Fallback function for basic notification
  const tryNativeNotification = () => {
    try {
      new Notification(title, options);
      return true;
    } catch (e) {
      console.warn("Native Notification failed (likely iOS/Safari), trying ServiceWorker...", e);
      return false;
    }
  };

  // On some devices (like iOS/macOS Safari), the native constructor throws an error
  // and we MUST use a ServiceWorker.
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      if (registration.active) {
        await registration.showNotification(title, options);
        return;
      } else {
        // Wait for it to become ready
        const readyReg = await navigator.serviceWorker.ready;
        await readyReg.showNotification(title, options);
        return;
      }
    } catch (swError) {
      console.error("ServiceWorker notification failed", swError);
      tryNativeNotification(); // fallback to native
    }
  } else {
    tryNativeNotification();
  }
}

export async function requestNotificationPermission() {
  if (typeof window === 'undefined') return 'default';
  if (!('Notification' in window)) return 'denied';
  
  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch (e) {
    console.error("Error requesting permission", e);
    return 'default';
  }
}
