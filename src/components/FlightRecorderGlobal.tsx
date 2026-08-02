'use client'

import { useEffect, useState, useRef } from 'react'
import { useFlightRecorder } from './FlightRecorderContext'
import { sendNotification, requestNotificationPermission } from '@/lib/notifications'

export default function FlightRecorderGlobal() {
  const { ongoingFlight, setIsModalOpen, stopFlight } = useFlightRecorder()
  const [elapsed, setElapsed] = useState('00:00:00')
  const [isWarning, setIsWarning] = useState(false)
  const notificationSentRef = useRef(false)
  
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [showTrash, setShowTrash] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const initialPos = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(true)
    dragStart.current = { x: e.clientX, y: e.clientY }
    initialPos.current = { ...position }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setPosition({ x: initialPos.current.x + dx, y: initialPos.current.y + dy })
    
    if (e.clientX < 150) {
      setShowTrash(true)
    } else {
      setShowTrash(false)
    }
  }

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return
    setIsDragging(false)
    e.currentTarget.releasePointerCapture(e.pointerId)
    
    if (e.clientX < 150) {
      if (window.confirm('Are you sure you want to stop and delete this flight recording?')) {
        stopFlight()
      }
      setPosition({ x: 0, y: 0 })
      setShowTrash(false)
    } else {
      setPosition({ x: 0, y: 0 })
      setShowTrash(false)
      
      if (Math.abs(e.clientX - dragStart.current.x) < 5 && Math.abs(e.clientY - dragStart.current.y) < 5) {
        setIsModalOpen(true)
      }
    }
  }

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
          if (!notificationSentRef.current && timeRemaining > 0) {
            sendNotification('Flight Recorder', {
              body: `Warning! Less than 10 minutes remaining of the planned flight time! (${ongoingFlight.desired_flight_time})`
            });
            notificationSentRef.current = true;
          }
        } else {
          setIsWarning(false)
          notificationSentRef.current = false;
        }
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [ongoingFlight])

  if (!ongoingFlight) return null

  return (
    <>
      {isDragging && (
        <div style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          width: '150px',
          background: showTrash ? 'rgba(239, 68, 68, 0.4)' : 'rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 40,
          transition: 'background 0.3s',
          borderRight: showTrash ? '2px solid #ef4444' : '2px dashed rgba(255,255,255,0.5)',
        }}>
          <span style={{ fontSize: '48px', opacity: showTrash ? 1 : 0.5, transform: showTrash ? 'scale(1.2)' : 'scale(1)', transition: 'all 0.3s' }}>🗑️</span>
        </div>
      )}
      <div 
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
        }}
      >
        <button
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
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
            cursor: isDragging ? 'grabbing' : 'grab',
            fontWeight: 600,
            fontSize: '16px',
            transition: isDragging ? 'none' : 'box-shadow 0.3s, background 0.3s',
            transform: `translate(${position.x}px, ${position.y}px) ${isDragging ? 'scale(1.05)' : 'scale(1)'}`,
          }}
        >
          <span style={{ fontSize: '20px' }}>⏱</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', userSelect: 'none' }}>
            <span style={{ fontSize: '12px', opacity: 0.9, lineHeight: 1 }}>{ongoingFlight.student_name}</span>
            <span>{elapsed}</span>
          </div>
        </button>
      </div>
    </>
  )
}
