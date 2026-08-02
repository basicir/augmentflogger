'use client'

import { useEffect, useState } from 'react'
import { useFlightRecorder } from './FlightRecorderContext'

export default function FlightRecorderGlobal() {
  const { ongoingFlight, setIsModalOpen } = useFlightRecorder()
  const [elapsed, setElapsed] = useState('00:00:00')

  useEffect(() => {
    if (!ongoingFlight?.start_time) return

    const startTime = new Date(ongoingFlight.start_time).getTime()

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
          background: 'var(--gradient-primary)',
          color: 'white',
          border: 'none',
          borderRadius: '9999px',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.1)',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '16px',
          transition: 'transform 0.2s',
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
