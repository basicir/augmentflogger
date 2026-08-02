'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Flight {
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
}

export default function FlightList({ flights, utcOffsetHours }: { flights: Flight[], utcOffsetHours: number }) {
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters' | 'comments'>('flight-parameters')
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

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

  const handleFlightClick = (e: React.MouseEvent, flight: Flight) => {
    e.preventDefault()
    setSelectedFlight(flight)
    setActiveTab('flight-parameters')
  }

  const formatTime = (d: Date) => `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`

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
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: isToday ? '#10b981' : 'var(--text-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                {isToday ? 'Today' : headerDateStr}
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <a
                      href="#"
                      onClick={(e) => handleFlightClick(e, flight)}
                      key={flight.id} 
                      style={{ 
                        background: bgStyle,
                        color: '#ffffff',
                        borderRadius: '6px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'stretch',
                        padding: '16px',
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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px', paddingRight: '16px' }}>
                          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>{monthShort}</div>
                          <div style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0' }}>{day}</div>
                          <div style={{ fontSize: '10px', color: isToday ? '#a7f3d0' : '#94A3B8' }}>{year}</div>
                        </div>

                        <div style={{ width: '1px', backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#334155', height: '50px', marginRight: '16px' }}></div>

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                          
                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '60px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>{depTime}</div>
                            <div style={{ fontSize: '12px', fontWeight: 500 }}>{flight.departure_aerodrome || 'N/A'}</div>
                          </div>

                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', justifyContent: 'center' }}>
                            <div style={{ fontSize: '11px', marginBottom: '6px', color: isToday ? '#d1fae5' : '#E2E8F0', textAlign: 'center' }}>
                              {flight.aircraft_registration || 'Unknown'} {flight.aircraft_type ? `(${flight.aircraft_type})` : ''}
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                              <div style={{ flex: 1, height: '1px', backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : '#475569' }}></div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-4px' }}>
                                <span style={{ fontSize: '14px', transform: 'rotate(45deg)', display: 'inline-block' }}>✈️</span>
                                <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>{durationFormatted}</span>
                              </div>
                              <div style={{ flex: 1, height: '1px', backgroundColor: isToday ? 'rgba(255,255,255,0.3)' : '#475569' }}></div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', width: '60px' }}>
                            <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>{arrTime}</div>
                            <div style={{ fontSize: '12px', fontWeight: 500 }}>{flight.destination_aerodrome || 'N/A'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Row - Badges */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '12px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
                        {flight.pilot_function && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                            {flight.pilot_function}
                          </span>
                        )}
                        {flight.flight_rules && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                            {flight.flight_rules}
                          </span>
                        )}
                        {flight.time_of_day && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                            {flight.time_of_day === 'Day' ? '☀️' : (flight.time_of_day === 'Night' ? '🌙' : flight.time_of_day)}
                          </span>
                        )}
                        {flight.flight_type && (
                          <span style={{ backgroundColor: isToday ? 'rgba(255,255,255,0.2)' : '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                            {flight.flight_type}
                          </span>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* Flight Details Modal */}
      {selectedFlight && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setSelectedFlight(null) }} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', background: 'var(--bg-default)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column' }}>
            <div className="modal-header" style={{ flexShrink: 0, padding: '16px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Flight Details - {selectedFlight.student_name}</h2>
              <button onClick={() => setSelectedFlight(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)', overflowX: 'auto', flexShrink: 0 }}>
              <button
                onClick={() => setActiveTab('flight-parameters')}
                style={{
                  flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'flight-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'flight-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: activeTab === 'flight-parameters' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                Flight
              </button>
              <button
                onClick={() => setActiveTab('task-parameters')}
                style={{
                  flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'task-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'task-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: activeTab === 'task-parameters' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                Grading
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                style={{
                  flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'comments' ? 'var(--primary)' : 'var(--text-secondary)',
                  borderBottom: activeTab === 'comments' ? '2px solid var(--primary)' : '2px solid transparent',
                  fontWeight: activeTab === 'comments' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
                }}
              >
                Comments
              </button>
            </div>

            <div style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeTab === 'flight-parameters' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Aircraft</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.aircraft_registration || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Pilot Function</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.pilot_function || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Flight Rules</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.flight_rules || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Time of Day</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.time_of_day || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Flight Type</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.flight_type || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Desired Time</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.desired_flight_time || 'N/A'}</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Departure</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.departure_aerodrome || 'N/A'}</div>
                    </div>
                    <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Destination</div>
                      <div style={{ fontWeight: 600 }}>{selectedFlight.destination_aerodrome || 'N/A'}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center' }}>
                    <Link href={`/student/${selectedFlight.student_id}`} style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: 'var(--radius-md)', textDecoration: 'none', fontWeight: 600 }}>
                      View Student Profile
                    </Link>
                  </div>
                </>
              )}

              {activeTab === 'task-parameters' && (
                <>
                  <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Program</div>
                    <div style={{ fontWeight: 600 }}>{selectedFlight.selected_program || 'N/A'}</div>
                  </div>
                  
                  <div style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Task</div>
                    <div style={{ fontWeight: 600 }}>
                      {(() => {
                        // try to find task name from programs_cache
                        if (selectedFlight.selected_task && selectedFlight.programs_cache) {
                          const prog = selectedFlight.programs_cache.find((p: any) => p.programName === selectedFlight.selected_program)
                          if (prog) {
                            for (const phase of prog.phases) {
                              const task = phase.tasks.find((t: any) => t.taskId === selectedFlight.selected_task)
                              if (task) return task.taskName
                            }
                          }
                        }
                        return selectedFlight.selected_task || 'N/A'
                      })()}
                    </div>
                  </div>

                  {selectedFlight.task_exercises_cache && selectedFlight.task_exercises_cache.length > 0 ? (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                        Grading
                      </h3>
                      {(() => {
                        const grouped: Record<string, any[]> = {}
                        selectedFlight.task_exercises_cache.forEach(ex => {
                          if (!grouped[ex.categoryName]) grouped[ex.categoryName] = []
                          grouped[ex.categoryName].push(ex)
                        })

                        return Object.entries(grouped).map(([catName, exercises]) => (
                          <div key={catName} style={{ marginBottom: '16px' }}>
                            <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              {catName}
                            </h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {exercises.map(ex => (
                                <div key={ex.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '48px' }}>
                                    
                                    <button 
                                      onClick={() => setExpandedComments(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                                      style={{ position: 'relative', width: '32px', height: '100%', background: 'none', border: 'none', color: selectedFlight.exercise_comments?.[ex.id] ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
                                    >
                                      {expandedComments[ex.id] ? '▼' : '▶'}
                                      {selectedFlight.exercise_comments?.[ex.id] && !expandedComments[ex.id] && (
                                        <span style={{ position: 'absolute', top: '24px', right: '0px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                                      )}
                                    </button>

                                    <div style={{ flex: 1, paddingRight: '8px' }}>
                                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {ex.name}
                                      </span>
                                    </div>
                                    
                                    <div style={{ width: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', padding: '6px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                      <span style={{ fontWeight: 900, fontSize: '18px', color: selectedFlight.grades?.[ex.id] ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                        {selectedFlight.grades?.[ex.id] || "N/A"}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  {(expandedComments[ex.id] || (selectedFlight.exercise_comments?.[ex.id] && expandedComments[ex.id] !== false)) && selectedFlight.exercise_comments?.[ex.id] && (
                                    <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', fontSize: '14px', color: 'var(--text-primary)' }}>
                                      {selectedFlight.exercise_comments[ex.id]}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '16px' }}>No exercises found for this task.</p>
                  )}
                </>
              )}

              {activeTab === 'comments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border-default)', paddingBottom: '8px', marginBottom: '12px' }}>
                      General Comment
                    </h3>
                    {selectedFlight.general_comment ? (
                      <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '15px', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                        {selectedFlight.general_comment}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-secondary)' }}>No general comment recorded.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
