'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Flight } from '@/components/FlightList'

export default function FlightDetails({ initialFlight, utcOffsetHours }: { initialFlight: Flight, utcOffsetHours: number }) {
  const [flight, setFlight] = useState<Flight>(initialFlight)
  const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters' | 'comments'>('flight-parameters')
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Flight>>({})
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const formatTime = (d: Date) => `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
  const formatDate = (d: Date) => `${d.getUTCDate().toString().padStart(2, '0')}.${(d.getUTCMonth()+1).toString().padStart(2, '0')}.${d.getUTCFullYear()}`

  const extractTime = (isoString?: string | null) => {
    if (!isoString) return ''
    const d = new Date(new Date(isoString).getTime() + utcOffsetHours * 3600000)
    return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`
  }
  const extractDate = (isoString?: string | null) => {
    if (!isoString) return ''
    const d = new Date(new Date(isoString).getTime() + utcOffsetHours * 3600000)
    return `${d.getUTCFullYear()}-${(d.getUTCMonth()+1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`
  }

  const handleSave = async () => {
    if (!editData) return
    setIsSaving(true)
    
    try {
      const { error } = await supabase.from('flights').update(editData).eq('id', flight.id)
      if (error) throw error
      
      setFlight({ ...flight, ...editData })
      setIsEditing(false)
      router.refresh()
    } catch (e) {
      console.error("Failed to save flight", e)
      alert("Failed to save flight.")
    } finally {
      setIsSaving(false)
    }
  }

  const setEditDateTime = (field: 'start_time' | 'end_time', dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return
    const [y, m, d] = dateStr.split('-').map(Number)
    const [hh, mm] = timeStr.split(':').map(Number)
    const utcMs = Date.UTC(y, m-1, d, hh, mm) - (utcOffsetHours * 3600000)
    setEditData({ ...editData, [field]: new Date(utcMs).toISOString() })
  }

  const handleGradeChange = (exId: string, grade: string) => {
    const currentGrades = editData.grades || flight.grades || {}
    setEditData({ ...editData, grades: { ...currentGrades, [exId]: grade } })
  }

  const handleCommentChange = (exId: string, comment: string) => {
    const currentComments = editData.exercise_comments || flight.exercise_comments || {}
    setEditData({ ...editData, exercise_comments: { ...currentComments, [exId]: comment } })
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-default)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Flight Details - {flight.student_name}</h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)', overflowX: 'auto', flexShrink: 0 }}>
        <button
          onClick={() => setActiveTab('flight-parameters')}
          style={{
            flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'flight-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'flight-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'flight-parameters' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Flight
        </button>
        <button
          onClick={() => setActiveTab('task-parameters')}
          style={{
            flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'task-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'task-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'task-parameters' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Grading
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          style={{
            flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'comments' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'comments' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'comments' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Comments
        </button>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* EDIT HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, fontWeight: 700 }}>
            {activeTab === 'flight-parameters' ? '' : (activeTab === 'task-parameters' ? 'GRADING DETAILS' : 'COMMENTS')}
          </h3>
          {!isEditing ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this flight? This action cannot be undone.')) {
                    setIsSaving(true);
                    try {
                      const { error } = await supabase.from('flights').delete().eq('id', flight.id);
                      if (error) throw error;
                      router.push('/dashboard/flights');
                      router.refresh();
                    } catch (e) {
                      console.error("Failed to delete flight", e);
                      alert("Failed to delete flight.");
                      setIsSaving(false);
                    }
                  }
                }} 
                disabled={isSaving}
                style={{ padding: '8px 16px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
              >
                🗑️ Delete
              </button>
              <button onClick={() => { setIsEditing(true); setEditData(flight) }} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                ✏️ Edit
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                {isSaving ? 'Saving...' : '💾 Save'}
              </button>
            </div>
          )}
        </div>

        {activeTab === 'flight-parameters' && (
          <>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              {isEditing ? (
                <input 
                  value={editData.aircraft_registration || ''} 
                  onChange={e => setEditData({...editData, aircraft_registration: e.target.value.toUpperCase()})}
                  style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)', padding: '8px', color: 'white', fontWeight: 600, fontSize: '18px', outline: 'none', width: '100%' }}
                  placeholder="Enter Call Sign"
                />
              ) : (
                <span style={{ fontWeight: 800, fontSize: '24px', letterSpacing: '0.05em' }}>{flight.aircraft_registration || 'N/A'}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '8px' }}>
              <div style={{ padding: '20px 8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', textAlign: 'center', fontWeight: 'bold' }}>
                {isEditing ? (
                  <select 
                    value={editData.pilot_function || ''} 
                    onChange={e => setEditData({...editData, pilot_function: e.target.value})}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    <option value="DUAL">DUAL</option>
                    <option value="SPIC">SPIC</option>
                    <option value="SOLO">SOLO</option>
                    <option value="PIC">PIC</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '16px' }}>{flight.pilot_function || 'N/A'}</span>
                )}
              </div>
              <div style={{ padding: '20px 8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', textAlign: 'center', fontWeight: 'bold' }}>
                {isEditing ? (
                  <select 
                    value={editData.flight_rules || ''} 
                    onChange={e => setEditData({...editData, flight_rules: e.target.value})}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    <option value="VFR">VFR</option>
                    <option value="IFR">IFR</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '16px' }}>{flight.flight_rules || 'N/A'}</span>
                )}
              </div>
              <div style={{ padding: '20px 8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', textAlign: 'center', fontWeight: 'bold' }}>
                {isEditing ? (
                  <select 
                    value={editData.time_of_day || ''} 
                    onChange={e => setEditData({...editData, time_of_day: e.target.value})}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    <option value="DAY">DAY</option>
                    <option value="NIGHT">NIGHT</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '16px' }}>{flight.time_of_day || 'N/A'}</span>
                )}
              </div>
              <div style={{ padding: '20px 8px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', textAlign: 'center', fontWeight: 'bold' }}>
                {isEditing ? (
                  <select 
                    value={editData.flight_type || ''} 
                    onChange={e => setEditData({...editData, flight_type: e.target.value})}
                    style={{ background: 'transparent', border: 'none', color: 'white', width: '100%', outline: 'none', textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}
                  >
                    <option value="LOCAL">LOCAL</option>
                    <option value="X-COUNTRY">X-COUNTRY</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '16px' }}>{flight.flight_type || 'N/A'}</span>
                )}
              </div>
            </div>

            <div style={{ marginTop: '16px', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>
                OFF BLOCK
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
                <div style={{ flex: 1, padding: '16px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                  {isEditing ? (
                    <input 
                      type="time" 
                      value={extractTime(editData.start_time)} 
                      onChange={e => setEditDateTime('start_time', extractDate(editData.start_time), e.target.value)} 
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '18px', textAlign: 'center', fontWeight: 600 }}
                    />
                  ) : (
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>{formatTime(new Date(new Date(flight.start_time).getTime() + utcOffsetHours * 3600000))}</span>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', color: 'var(--text-secondary)', fontSize: '20px' }}>🕒</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
                <div style={{ flex: 1, padding: '16px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={extractDate(editData.start_time)} 
                      onChange={e => setEditDateTime('start_time', e.target.value, extractTime(editData.start_time))} 
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '16px', textAlign: 'center', colorScheme: 'dark' }}
                    />
                  ) : (
                    <span style={{ fontSize: '16px' }}>{formatDate(new Date(new Date(flight.start_time).getTime() + utcOffsetHours * 3600000))}</span>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', color: 'var(--text-secondary)', fontSize: '20px' }}>📅</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', textAlign: 'center', fontWeight: 800, borderBottom: '1px solid var(--border-default)', color: 'var(--text-primary)' }}>
                ON BLOCK
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
                <div style={{ flex: 1, padding: '16px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                  {isEditing ? (
                    <input 
                      type="time" 
                      value={extractTime(editData.end_time)} 
                      onChange={e => setEditDateTime('end_time', extractDate(editData.end_time), e.target.value)} 
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '18px', textAlign: 'center', fontWeight: 600 }}
                    />
                  ) : (
                    <span style={{ fontSize: '18px', fontWeight: 600 }}>{formatTime(new Date(new Date(flight.end_time).getTime() + utcOffsetHours * 3600000))}</span>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', color: 'var(--text-secondary)', fontSize: '20px' }}>🕒</div>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
                <div style={{ flex: 1, padding: '16px', textAlign: 'center', borderRight: '1px solid var(--border-default)' }}>
                  {isEditing ? (
                    <input 
                      type="date" 
                      value={extractDate(editData.end_time)} 
                      onChange={e => setEditDateTime('end_time', e.target.value, extractTime(editData.end_time))} 
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '16px', textAlign: 'center', colorScheme: 'dark' }}
                    />
                  ) : (
                    <span style={{ fontSize: '16px' }}>{formatDate(new Date(new Date(flight.end_time).getTime() + utcOffsetHours * 3600000))}</span>
                  )}
                </div>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', color: 'var(--text-secondary)', fontSize: '20px' }}>📅</div>
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '20px', textAlign: 'center', fontWeight: 900, fontSize: '24px', color: 'var(--text-primary)' }}>
                {(() => {
                  const start = new Date(isEditing ? (editData.start_time || flight.start_time) : flight.start_time)
                  const end = new Date(isEditing ? (editData.end_time || flight.end_time) : flight.end_time)
                  const diffMins = Math.round((end.getTime() - start.getTime()) / 60000)
                  if (isNaN(diffMins) || diffMins < 0) return '0:00'
                  return `${Math.floor(diffMins / 60)}:${(diffMins % 60).toString().padStart(2, '0')}`
                })()}
              </div>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '150px', fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)' }}>DEPARTURE</div>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', padding: '16px' }}>
                  {isEditing ? (
                    <input 
                      value={editData.departure_aerodrome || ''} 
                      onChange={e => setEditData({...editData, departure_aerodrome: e.target.value.toUpperCase()})}
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontWeight: 'bold', fontSize: '16px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{flight.departure_aerodrome || 'N/A'}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '150px', fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)' }}>TOUCH & GOES</div>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', padding: '16px' }}>
                  {isEditing ? (
                    <input 
                      type="number"
                      min="0"
                      value={editData.touch_and_goes ?? flight.touch_and_goes ?? 0} 
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        const tng = isNaN(val) ? 0 : Math.max(0, val);
                        setEditData({...editData, touch_and_goes: tng, landings: tng + 1});
                      }}
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontWeight: 'bold', fontSize: '16px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{flight.touch_and_goes ?? 0}</span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '150px', fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)' }}>ARRIVAL</div>
                <div style={{ flex: 1, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', padding: '16px' }}>
                  {isEditing ? (
                    <input 
                      value={editData.destination_aerodrome || ''} 
                      onChange={e => setEditData({...editData, destination_aerodrome: e.target.value.toUpperCase()})}
                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontWeight: 'bold', fontSize: '16px' }}
                    />
                  ) : (
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{flight.destination_aerodrome || 'N/A'}</span>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'task-parameters' && (
          <>
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Program</div>
              <div style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>{flight.selected_program || 'N/A'}</div>
            </div>
            
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Task</div>
              <div style={{ fontWeight: 600, fontSize: '16px', marginTop: '4px' }}>
                {(() => {
                  if (flight.selected_task && flight.programs_cache) {
                    const prog = flight.programs_cache.find((p: any) => p.programName === flight.selected_program)
                    if (prog) {
                      for (const phase of prog.phases) {
                        const task = phase.tasks.find((t: any) => t.taskId === flight.selected_task)
                        if (task) return task.taskName
                      }
                    }
                  }
                  return flight.selected_task || 'N/A'
                })()}
              </div>
            </div>

            {flight.task_exercises_cache && flight.task_exercises_cache.length > 0 ? (
              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {(() => {
                  const grouped: Record<string, any[]> = {}
                  flight.task_exercises_cache.forEach(ex => {
                    if (!grouped[ex.categoryName]) grouped[ex.categoryName] = []
                    grouped[ex.categoryName].push(ex)
                  })

                  return Object.entries(grouped).map(([catName, exercises]) => (
                    <div key={catName}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                        {catName}
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {exercises.map(ex => {
                          const currentGrade = isEditing ? (editData.grades?.[ex.id] ?? flight.grades?.[ex.id]) : flight.grades?.[ex.id]
                          const currentComment = isEditing ? (editData.exercise_comments?.[ex.id] ?? flight.exercise_comments?.[ex.id]) : flight.exercise_comments?.[ex.id]
                          const isExpanded = expandedComments[ex.id] || (currentComment && expandedComments[ex.id] !== false)

                          return (
                            <div key={ex.id} style={{ padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '48px' }}>
                                
                                <button 
                                  onClick={() => setExpandedComments(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                                  style={{ position: 'relative', width: '32px', height: '100%', background: 'none', border: 'none', color: currentComment ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
                                >
                                  {expandedComments[ex.id] ? '▼' : '▶'}
                                  {currentComment && !expandedComments[ex.id] && (
                                    <span style={{ position: 'absolute', top: '24px', right: '0px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                                  )}
                                </button>

                                <div style={{ flex: 1, paddingRight: '12px' }}>
                                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                                    {ex.name}
                                  </span>
                                </div>
                                
                                <div style={{ width: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', padding: '8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                  {isEditing ? (
                                    <select 
                                      value={currentGrade || ''}
                                      onChange={(e) => handleGradeChange(ex.id, e.target.value)}
                                      style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', fontWeight: 900, fontSize: '18px', width: '100%', textAlign: 'center', appearance: 'none', cursor: 'pointer' }}
                                    >
                                      <option value="">-</option>
                                      <option value="BS">BS</option>
                                      <option value="S-">S-</option>
                                      <option value="S">S</option>
                                      <option value="S+">S+</option>
                                      <option value="AS">AS</option>
                                    </select>
                                  ) : (
                                    <span style={{ fontWeight: 900, fontSize: '18px', color: currentGrade ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                      {currentGrade || "-"}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {isExpanded && (
                                <div style={{ marginTop: '4px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)' }}>
                                  {isEditing ? (
                                    <textarea
                                      value={currentComment || ''}
                                      onChange={(e) => handleCommentChange(ex.id, e.target.value)}
                                      placeholder="Add an exercise comment..."
                                      style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none', resize: 'vertical', minHeight: '60px', fontFamily: 'inherit', fontSize: '14px' }}
                                    />
                                  ) : (
                                    <div style={{ fontSize: '14px', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                                      {currentComment || 'No comment provided.'}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                })()}
              </div>
            ) : (
              <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginTop: '24px' }}>No exercises found for this task.</p>
            )}
          </>
        )}

        {activeTab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, borderBottom: '1px solid var(--border-default)', paddingBottom: '12px', marginBottom: '16px' }}>
                General Comment
              </h3>
              {isEditing ? (
                <textarea
                  value={editData.general_comment ?? flight.general_comment ?? ''}
                  onChange={e => setEditData({ ...editData, general_comment: e.target.value })}
                  placeholder="Enter a general comment for the entire flight..."
                  style={{ width: '100%', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', color: 'white', outline: 'none', resize: 'vertical', minHeight: '200px', fontFamily: 'inherit', fontSize: '15px', lineHeight: 1.5 }}
                />
              ) : (
                <div style={{ padding: '24px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', fontSize: '16px', lineHeight: 1.6, whiteSpace: 'pre-wrap', minHeight: '100px' }}>
                  {flight.general_comment || <span style={{ color: 'var(--text-secondary)' }}>No general comment recorded.</span>}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
