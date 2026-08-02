'use client'

import { useEffect, useState } from 'react'
import { useFlightRecorder } from './FlightRecorderContext'
import { sendNotification, requestNotificationPermission } from '@/lib/notifications'

export default function FlightRecorderGlobal() {
  const { ongoingFlight, setIsModalOpen } = useFlightRecorder()
  const [elapsed, setElapsed] = useState('00:00:00')
  const [isWarning, setIsWarning] = useState(false)
  const [notificationSent, setNotificationSent] = useState(false)

  useEffect(() => {
    // Request notification permission if we haven't already
    const initNotifications = async () => {
      if (typeof window !== 'undefined' && 'Notification' in window) {
        if (Notification.permission === 'default') {
          await requestNotificationPermission();
        }
      }
    };
    initNotifications();
  }, [])

  useEffect(() => {
    if (!ongoingFlight?.start_time) return

    const startTime = new Date(ongoingFlight.start_time).getTime()
    
    // Calculate desired duration in ms
    let desiredMs = Infinity
    if (ongoingFlight.desired_flight_time) {
      const [h, m] = ongoingFlight.desired_flight_time.split(':')
      const hrs = parseInt(h || '0', 10)
      const mins = parseInt(m || '0', 10)
      desiredMs = (hrs * 60 + mins) * 60 * 1000
    }

    const updateTimer = () => {
      const now = Date.now()
      const diff = now - startTime
      if (diff < 0) return

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)

      setElapsed(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      )

      if (desiredMs !== Infinity) {
        const timeRemaining = desiredMs - diff
        const warningThreshold = 10 * 60 * 1000 // 10 minutes
        
        if (timeRemaining <= warningThreshold) {
          setIsWarning(true)
          if (!notificationSent && timeRemaining > 0) { // Don't send if already way past
            sendNotification('Flight Recorder', {
              body: `Figyelem! 10 percen belül lejár a tervezett repülési idő! (${ongoingFlight.desired_flight_time})`
            });
            setNotificationSent(true)
          }
        } else {
          setIsWarning(false)
          setNotificationSent(false)
        }
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [ongoingFlight])

  if (!ongoingFlight) return null

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50,
      }}
    >
      <button
        onClick={() => setIsModalOpen(true)}
        style={{
          background: isWarning ? 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)' : 'var(--gradient-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '9999px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: isWarning 
            ? '0 10px 25px -5px rgba(239, 68, 68, 0.5), 0 8px 10px -6px rgba(239, 68, 68, 0.1)'
            : '0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '16px',
          transition: 'all 0.3s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        <span style={{ fontSize: '20px' }}>⏱</span>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <span style={{ fontSize: '12px', opacity: 0.9, lineHeight: 1 }}>{ongoingFlight.student_name}</span>
          <span>{elapsed}</span>
        </div>
      </button>
    </div>
  )
}
