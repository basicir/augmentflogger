'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plane, Sun, Moon } from 'lucide-react'

export interface Flight {
  id: string
  student_id: string
  student_name: string
  start_time: string
  end_time: string
  aircraft_registration: string | null
  aircraft_type?: string | null
  pilot_function: string | null
  flight_rules: string | null
  time_of_day: string | null
  flight_type: string | null
  departure_aerodrome: string | null
  destination_aerodrome: string | null
  desired_flight_time: string | null
  selected_program: string | null
  selected_task: string | null
  programs_cache: any | null
  task_exercises_cache: any[] | null
  task_description_cache: string | null
  grades: Record<string, string> | null
  exercise_comments: Record<string, string> | null
  general_comment: string | null
  touch_and_goes?: number | null
  landings?: number | null
  landings_data?: any[] | null
}

export default function FlightList({ flights, utcOffsetHours }: { flights: Flight[], utcOffsetHours: number }) {
  // Group flights by date
  const groupedFlights: Record<string, Flight[]> = {}
  flights.forEach(flight => {
    const startMs = new Date(flight.start_time).getTime() + (utcOffsetHours * 60 * 60 * 1000)
    const localStart = new Date(startMs)
    const dateKey = `${localStart.getUTCFullYear()}-${(localStart.getUTCMonth()+1).toString().padStart(2, '0')}-${localStart.getUTCDate().toString().padStart(2, '0')}`
    if (!groupedFlights[dateKey]) groupedFlights[dateKey] = []
    groupedFlights[dateKey].push(flight)
  })

  const now = new Date()
  const nowLocal = new Date(now.getTime() + (utcOffsetHours * 60 * 60 * 1000))
  const todayKey = `${nowLocal.getUTCFullYear()}-${(nowLocal.getUTCMonth()+1).toString().padStart(2, '0')}-${nowLocal.getUTCDate().toString().padStart(2, '0')}`

  const sortedDates = Object.keys(groupedFlights).sort((a, b) => b.localeCompare(a))

  const formatTime = (d: Date) => `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
  const formatDate = (d: Date) => `${d.getUTCDate().toString().padStart(2, '0')}.${(d.getUTCMonth()+1).toString().padStart(2, '0')}.${d.getUTCFullYear()}`

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {sortedDates.map(dateKey => {
          const isToday = dateKey === todayKey
          
          // Format date for header
          const [y, m, d] = dateKey.split('-')
          const dateObj = new Date(Date.UTC(parseInt(y), parseInt(m)-1, parseInt(d)))
          const headerDateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' })

          return (
            <div key={dateKey}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: isToday ? '#10b981' : 'var(--text-secondary)', marginBottom: '12px', borderBottom: '1px solid var(--border-default)', paddingBottom: '6px' }}>
                {isToday ? 'Today' : headerDateStr}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {groupedFlights[dateKey].map((flight) => {
                  const start = new Date(flight.start_time)
                  const end = new Date(flight.end_time)
                  const diffMs = end.getTime() - start.getTime()
                  const diffMins = Math.round(diffMs / 60000)
                  const hours = Math.floor(diffMins / 60)
                  const mins = diffMins % 60
                  
                  const startMs = start.getTime() + (utcOffsetHours * 60 * 60 * 1000)
                  const endMs = end.getTime() + (utcOffsetHours * 60 * 60 * 1000)
                  const localStart = new Date(startMs)
                  const localEnd = new Date(endMs)
                  
                  const monthShort = localStart.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase()
                  const day = localStart.getUTCDate()
                  const year = localStart.getUTCFullYear()
                  
                  const depTime = formatTime(localStart)
                  const arrTime = formatTime(localEnd)
                  
                  const durationFormatted = `${hours}:${mins.toString().padStart(2, '0')}`
                  
                  // Dark green tint for today's flights, else standard background
                  const bgStyle = isToday 
                    ? 'linear-gradient(135deg, rgba(22,101,52,0.8) 0%, rgba(20,83,45,0.9) 100%)' // Green tint
                    : '#182A45'

                  return (
                    <Link
                      href={`/dashboard/flights/${flight.id}`}
                      key={flight.id} 
                      style={{ 
                        background: bgStyle,
                        color: '#ffffff',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        padding: '12px',
                        fontFamily: 'sans-serif',
                        textDecoration: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                        cursor: 'pointer',
                        transition: 'transform 0.1s ease',
                        border: isToday ? '1px solid rgba(74,222,128,0.2)' : 'none'
                      }}
                    >
                      {/* Top Row */}
                      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '50px', paddingRight: '12px' }}>
                          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.05em' }}>{monthShort}</div>
                          <div style={{ fontSize: '18px', fontWeight: 800, margin: '2px 0' }}>{day}</div>
                          <div style={{ fontSize: '9px', color: isToday ? '#a7f3d0' : '#94A3B8', marginBottom: '4px' }}>{year}</div>
                          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--text-primary)', textAlign: 'center', textTransform: 'uppercase' }}>
                            {flight.student_name}
                          </div>
                        </div>

                        <div style={{ width: '1px', backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#334155', height: '60px', marginRight: '12px' }}></div>

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>{depTime}</div>
                            <div style={{ fontSize: '11px', fontWeight: 500 }}>{flight.departure_aerodrome || 'N/A'}</div>
                          </div>

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 12px', justifyContent: 'center' }}>
                            <div style={{ fontSize: '10px', marginBottom: '4px', color: isToday ? '#d1fae5' : '#E2E8F0', textAlign: 'center' }}>
                              {flight.aircraft_registration || 'Unknown'} {flight.aircraft_type ? `(${flight.aircraft_type})` : ''}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                              <div style={{ flex: 1, height: '1px', backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : '#475569' }}></div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-4px' }}>
                                <span style={{ color: 'var(--text-secondary)' }}><Plane size={14} /></span>
                                <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>{durationFormatted}</span>
                              </div>
                              <div style={{ flex: 1, height: '1px', backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : '#475569' }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', width: '50px' }}>
                            <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>{arrTime}</div>
                            <div style={{ fontSize: '11px', fontWeight: 500 }}>{flight.destination_aerodrome || 'N/A'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - Badges */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        {flight.pilot_function && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 700 }}>
                            {flight.pilot_function}
                          </span>
                        )}
                        {flight.flight_rules && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 700 }}>
                            {flight.flight_rules}
                          </span>
                        )}
                        {flight.time_of_day && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 700 }}>
                            {flight.time_of_day === 'Day' ? <Sun size={10} style={{ display: 'inline', marginRight: '2px' }} /> : (flight.time_of_day === 'Night' ? <Moon size={10} style={{ display: 'inline', marginRight: '2px' }} /> : null)}
                            {flight.time_of_day}
                          </span>
                        )}
                        {flight.flight_type && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '8px', fontWeight: 700 }}>
                            {flight.flight_type}
                          </span>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
