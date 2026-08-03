'use client'

import { Flight } from '@/components/FlightList'

interface LogbookTableProps {
  dateKey: string
  aircraft: string
  flights: Flight[]
  instructorUsername: string
  utcOffsetHours: number
}

export default function LogbookTable({
  dateKey,
  aircraft,
  flights,
  instructorUsername,
  utcOffsetHours,
}: LogbookTableProps) {
  // flights should already be sorted chronologically by start_time
  
  // Format date for display
  const [y, m, d] = dateKey.split('-')
  const dateObj = new Date(Date.UTC(parseInt(y), parseInt(m) - 1, parseInt(d)))
  const displayDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  })

  const formatTime = (d: Date) =>
    `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`

  const calculateFlightTime = (start: string, end: string) => {
    const s = new Date(start)
    const e = new Date(end)
    const diffMs = e.getTime() - s.getTime()
    const diffMins = Math.round(diffMs / 60000)
    const hours = Math.floor(diffMins / 60)
    const mins = diffMins % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '16px' }}>
        {displayDate} — {aircraft}
      </h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', background: 'var(--bg-glass)', border: '1px solid var(--border-default)', borderRadius: '8px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-default)', background: 'rgba(255, 255, 255, 0.05)' }}>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>No.</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>Preflight done by</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>Off-block</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>On-block</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>Flight time</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>Ground time</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>LDGS</th>
              <th style={{ padding: '8px 4px', color: 'var(--text-secondary)', verticalAlign: 'middle' }}>Crew</th>
            </tr>
          </thead>
          <tbody>
            {/* 0th Row */}
            <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>0</td>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{instructorUsername}</td>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}></td>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}></td>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}></td>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>5'</td>
              <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}></td>
              <td style={{ padding: '8px 4px', verticalAlign: 'middle' }}>repelőtti</td>
            </tr>
            
            {/* 1+ Rows */}
            {flights.map((flight, index) => {
              const startLocal = new Date(new Date(flight.start_time).getTime() + (utcOffsetHours * 60 * 60 * 1000))
              const endLocal = new Date(new Date(flight.end_time).getTime() + (utcOffsetHours * 60 * 60 * 1000))
              
              const offBlock = formatTime(startLocal)
              const onBlock = formatTime(endLocal)
              const flightTime = calculateFlightTime(flight.start_time, flight.end_time)
              const nameParts = flight.student_name.trim().split(' ')
              const studentLastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : flight.student_name
              const crew = `${instructorUsername} - ${studentLastName}`
              // @ts-ignore - landings might be added later
              const ldgs = flight.landings !== undefined && flight.landings !== null ? flight.landings : ''

              return (
                <tr key={flight.id} style={{ borderBottom: '1px solid var(--border-default)' }}>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{index + 1}</td>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{instructorUsername}</td>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{offBlock}</td>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{onBlock}</td>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{flightTime}</td>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>2'</td>
                  <td style={{ padding: '8px 4px', borderRight: '1px solid var(--border-default)', verticalAlign: 'middle' }}>{ldgs}</td>
                  <td style={{ padding: '8px 4px', verticalAlign: 'middle' }}>{crew}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
