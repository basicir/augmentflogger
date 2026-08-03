'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Flight } from '@/components/FlightList'
import { Loader2, ArrowLeft, PlaneTakeoff, RefreshCw, Trash2, Edit2, X, ExternalLink } from 'lucide-react'
export default function FlightDetails({ initialFlight, utcOffsetHours }: { initialFlight: Flight, utcOffsetHours: number }) {
  const [flight, setFlight] = useState<Flight>(initialFlight)
  const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters' | 'comments' | 'description'>('flight-parameters')
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

  // Viewport Height for mobile keyboard fix
  const [viewportHeight, setViewportHeight] = useState(typeof window !== 'undefined' ? window.innerHeight : 800)

  useEffect(() => {
    const updateViewport = () => {
      if (window.visualViewport) {
        setViewportHeight(window.visualViewport.height);
      } else {
        setViewportHeight(window.innerHeight);
      }
    };
    updateViewport();
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewport);
    } else {
      window.addEventListener('resize', updateViewport);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewport);
      } else {
        window.removeEventListener('resize', updateViewport);
      }
    };
  }, []);

  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState<Partial<Flight>>({})
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // If programs_cache is missing userProgramId (old cache format), fetch the updated cache from the API
    if (flight.programs_cache && flight.programs_cache.length > 0 && flight.programs_cache[0].userProgramId === undefined) {
      const refreshCache = async () => {
        try {
          const res = await fetch('/api/flightlogger/programs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId: flight.student_id })
          })
          if (res.ok) {
            const data = await res.json()
            if (data.programs) {
              setFlight(prev => ({ ...prev, programs_cache: data.programs }))
              // Silently update DB so it doesn't need to fetch next time
              supabase.from('flights').update({ programs_cache: data.programs }).eq('id', flight.id).then()
            }
          }
        } catch (e) {
          console.error("Failed to refresh programs cache for old flight", e)
        }
      }
      refreshCache()
    }
  }, [flight.programs_cache, flight.student_id, flight.id, supabase])

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

  let flightloggerUrl: string | null = null;
  let isTaskInstantiated = false;
  
  if (flight.selected_task && flight.programs_cache) {
    const prog = flight.programs_cache.find((p: any) => p.programName === flight.selected_program)
    if (prog && prog.userProgramId) {
      for (const phase of prog.phases) {
        const task = phase.tasks.find((t: any) => t.taskId === flight.selected_task)
        if (task) {
          if (task.userLectureId) {
            flightloggerUrl = `https://trener.flightlogger.net/users/${flight.student_id}/user_programs/${prog.userProgramId}/user_lectures/${task.userLectureId}/edit`
            isTaskInstantiated = true;
          } else {
            // Fallback: The task hasn't been booked/instantiated in FlightLogger yet, 
            // or the cache is old. We open the syllabus page where the user can click it.
            // We append the taskName so a Tampermonkey script can automatically find and click it!
            flightloggerUrl = `https://trener.flightlogger.net/users/${flight.student_id}/user_programs/${prog.userProgramId}#auto_open_task=${encodeURIComponent(task.taskName)}`
            isTaskInstantiated = false
          }
          break
        }
      }
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', borderRadius: '12px', display: 'flex', flexDirection: 'column', minHeight: '600px', height: activeTab === 'comments' ? `${viewportHeight * 0.85}px` : 'auto' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Flight Details - {flight.student_name}</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          {!isEditing ? (
            <>
              <button
                onClick={async () => {
                   if (flightloggerUrl) {
                     try {
                       let parsedGrades = flight.grades;
                       if (typeof parsedGrades === 'string') {
                         try { parsedGrades = JSON.parse(parsedGrades); } catch (e) {}
                       }
                       let parsedExerciseComments = flight.exercise_comments;
                       if (typeof parsedExerciseComments === 'string') {
                         try { parsedExerciseComments = JSON.parse(parsedExerciseComments); } catch (e) {}
                       }

                       const exportData = {
                         start_time: flight.start_time,
                         end_time: flight.end_time,
                         aircraft_registration: flight.aircraft_registration,
                         pilot_function: flight.pilot_function,
                         flight_rules: flight.flight_rules,
                         time_of_day: flight.time_of_day,
                         flight_type: flight.flight_type,
                         departure_aerodrome: flight.departure_aerodrome,
                         destination_aerodrome: flight.destination_aerodrome,
                         grades: parsedGrades,
                         exercise_comments: parsedExerciseComments,
                         general_comment: flight.general_comment,
                         touch_and_goes: flight.touch_and_goes,
                         landings_data: flight.landings_data
                       };
                       
                       const b64Data = btoa(unescape(encodeURIComponent(JSON.stringify(exportData))));
                       let finalUrl = flightloggerUrl;
                       if (finalUrl.includes('#')) {
                         finalUrl += `&export_data=${b64Data}`;
                       } else {
                         finalUrl += `#export_data=${b64Data}`;
                       }
                       
                       console.log('Opening FlightLogger URL:', finalUrl);
                       window.open(finalUrl, '_blank');
                     } catch (err) {
                       console.error('Failed to encode export data: ', err);
                       alert('Hiba az adatok exportálásakor!');
                     }
                   }
                }}
                disabled={!flightloggerUrl}
                style={{ width: '36px', height: '36px', padding: 0, background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: flightloggerUrl ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: flightloggerUrl ? 1 : 0.5 }}
                title={!flightloggerUrl ? "Loading program data..." : (isTaskInstantiated ? "Export and Open specific task in FlightLogger" : "Task not yet instantiated. Auto-opening Program Syllabus instead.")}
              >
                <ExternalLink size={18} />
              </button>
              <button 
                onClick={() => { setIsEditing(true); setEditData(flight) }} 
                title="Edit flight"
                style={{ width: '36px', height: '36px', padding: 0, background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={async () => {
                  if (window.confirm('Are you sure you want to delete this flight? This action cannot be undone.')) {
                    setIsSaving(true);
                    try {
                      const { error } = await supabase.from('flights').delete().eq('id', flight.id);
                      if (error) throw error;
                      router.push('/dashboard/flights');
                      router.refresh();
                    } catch (e: any) {
                      console.error("Failed to delete flight", e);
                      alert("Failed to delete flight: " + e.message);
                      setIsSaving(false);
                    }
                  }
                }} 
                disabled={isSaving}
                title="Delete flight"
                style={{ width: '36px', height: '36px', padding: 0, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Trash2 size={18} />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setIsEditing(false)} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Cancel
              </button>
              <button onClick={handleSave} disabled={isSaving} style={{ padding: '8px 16px', background: 'rgba(59, 130, 246, 0.2)', color: 'var(--primary)', border: '1px solid rgba(59, 130, 246, 0.5)', borderRadius: 'var(--radius-md)', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </>
          )}
        </div>
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
        <button
          onClick={() => setActiveTab('description')}
          style={{
            flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'description' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'description' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'description' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Description
        </button>
      </div>

      <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {activeTab === 'task-parameters' && (
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginBottom: '16px', fontWeight: 700 }}>
            GRADING DETAILS
          </h3>
        )}
        {activeTab === 'comments' && (
          <h3 style={{ fontSize: '13px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0, marginBottom: '16px', fontWeight: 700 }}>
            COMMENTS
          </h3>
        )}

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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '150px', fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)' }}>LANDINGS</div>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(() => {
                      // Determine the landings data to display
                      const rawLandings = editData.landings_data || flight.landings_data || [];
                      // If empty, fallback to the old touch_and_goes value for the first row
                      let landings = rawLandings.length > 0 ? rawLandings : [
                        { airport: editData.destination_aerodrome || flight.destination_aerodrome || '', count: editData.touch_and_goes ?? flight.touch_and_goes ?? 0 }
                      ];

                      return (
                        <>
                          {landings.map((l: any, idx: number) => (
                            <div key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', padding: '12px 16px' }}>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>AIRPORT</div>
                                {isEditing ? (
                                  <input 
                                    value={l.airport} 
                                    onChange={e => {
                                      const newLandings = [...landings];
                                      newLandings[idx].airport = e.target.value.toUpperCase();
                                      setEditData({...editData, landings_data: newLandings});
                                    }}
                                    placeholder="e.g. LHBP"
                                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontWeight: 'bold', fontSize: '16px' }}
                                  />
                                ) : (
                                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{l.airport || 'N/A'}</span>
                                )}
                              </div>
                              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>TOUCH & GOES</div>
                                {isEditing ? (
                                  <input 
                                    type="number"
                                    min="0"
                                    value={l.count} 
                                    onChange={e => {
                                      const val = parseInt(e.target.value, 10);
                                      const newLandings = [...landings];
                                      newLandings[idx].count = isNaN(val) ? 0 : Math.max(0, val);
                                      setEditData({...editData, landings_data: newLandings});
                                    }}
                                    style={{ background: 'transparent', border: 'none', color: 'white', outline: 'none', width: '100%', fontWeight: 'bold', fontSize: '16px' }}
                                  />
                                ) : (
                                  <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{l.count}</span>
                                )}
                              </div>
                              {isEditing && landings.length > 1 && (
                                <button 
                                  onClick={() => {
                                    const newLandings = landings.filter((_: any, i: number) => i !== idx);
                                    setEditData({...editData, landings_data: newLandings});
                                  }}
                                  style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '16px', padding: '4px' }}
                                  title="Remove"
                                >
                                  ✕
                                </button>
                              )}
                            </div>
                          ))}
                          {isEditing && (
                            <button
                              onClick={() => {
                                const newLandings = [...landings, { airport: '', count: 0 }];
                                setEditData({...editData, landings_data: newLandings});
                              }}
                              style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 600, fontSize: '13px', textAlign: 'center' }}
                            >
                              + Add Touch & Go Airport
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '150px', fontWeight: 700, fontSize: '13px', color: 'var(--text-secondary)' }}>FINAL ARRIVAL</div>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', flexShrink: 0 }}>General Comment</h4>
              {isEditing ? (
                <textarea
                  value={editData.general_comment ?? flight.general_comment ?? ''}
                  onChange={e => {
                    setEditData({ ...editData, general_comment: e.target.value })
                  }}
                  style={{ width: '100%', flex: 1, padding: '12px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', overflow: 'auto', resize: 'none' }}
                />
              ) : (
                <div style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', overflowY: 'auto' }}>
                  {flight.general_comment || <span style={{ color: 'var(--text-secondary)' }}>No general comment.</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'description' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div 
              className="trix-content"
              style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', lineHeight: '1.6' }}
              dangerouslySetInnerHTML={{ __html: flight.task_description_cache || '<p style="color:var(--text-secondary)">No description available for this task.</p>' }}
            />
          </div>
        )}
      </div>
    </div>
  )
}
