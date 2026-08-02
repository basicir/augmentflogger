import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      setIsSupported(true)
      setPermission(Notification.permission)
      
      // Register service worker if not already registered
      navigator.serviceWorker.register('/sw.js').catch((err) => {
        console.error('Service Worker registration failed:', err)
      })

      // Check current subscription
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          if (sub) setIsSubscribed(true)
        })
      })
    }
  }, [])

  const subscribeToPush = async (userId: string) => {
    if (!isSupported) return false
    
    setLoading(true)
    try {
      const permissionResult = await Notification.requestPermission()
      setPermission(permissionResult)

      if (permissionResult !== 'granted') {
        throw new Error('Notification permission not granted.')
      }

      const registration = await navigator.serviceWorker.ready
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      
      if (!vapidPublicKey) {
        throw new Error('VAPID public key not found in env')
      }

      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
      })

      const subData = subscription.toJSON()
      
      if (!subData.endpoint || !subData.keys?.p256dh || !subData.keys?.auth) {
        throw new Error('Invalid subscription data received')
      }

      // Save to Supabase
      const { error } = await supabase.from('push_subscriptions').upsert({
        user_id: userId,
        endpoint: subData.endpoint,
        p256dh: subData.keys.p256dh,
        auth: subData.keys.auth
      }, { onConflict: 'endpoint' })

      if (error) throw error

      setIsSubscribed(true)
      setLoading(false)
      return true
    } catch (err) {
      console.error('Failed to subscribe to push notifications:', err)
      setLoading(false)
      return false
    }
  }

  return {
    isSupported,
    permission,
    isSubscribed,
    loading,
    subscribeToPush
  }
}
