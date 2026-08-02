'use client'

import { useState, useEffect } from 'react'
import { useFlightRecorder } from './FlightRecorderContext'
import { createClient } from '@/lib/supabase/client'

export default function FlightRecorderModal() {
  const { ongoingFlight, isModalOpen, setIsModalOpen, updateFlight, stopFlight } = useFlightRecorder()
  
  const [aircraft, setAircraft] = useState('')
  const [pilotFunction, setPilotFunction] = useState('DUAL')
  const [flightRules, setFlightRules] = useState('VFR')
  const [timeOfDay, setTimeOfDay] = useState('DAY')
  const [flightType, setFlightType] = useState('LOCAL')
  const [departure, setDeparture] = useState('')
  const [destination, setDestination] = useState('')
  const [desiredTime, setDesiredTime] = useState('')
  const [recentAerodromes, setRecentAerodromes] = useState<string[]>([])
  const [availableAircraft, setAvailableAircraft] = useState<string[]>([])
  
  // Task Parameters state
  interface TaskData {
    taskId: string;
    taskName: string;
    status: string;
  }
  interface PhaseData {
    phaseName: string;
    tasks: TaskData[];
  }
  interface ProgramData {
    programId: string;
    programName: string;
    status: string;
    phases: PhaseData[];
  }

  const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters'>('flight-parameters')
  const [programs, setPrograms] = useState<ProgramData[]>([])
  const [selectedProgram, setSelectedProgram] = useState('')
  const [selectedTask, setSelectedTask] = useState('')
  const [loadingPrograms, setLoadingPrograms] = useState(false)
  
  interface Exercise {
    id: string;
    name: string;
    categoryName: string;
    grade?: string;
  }
  const [taskExercises, setTaskExercises] = useState<Exercise[]>([])
  const [taskDescription, setTaskDescription] = useState('')
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [exerciseComments, setExerciseComments] = useState<Record<string, string>>({})
  const [loadingTaskDetails, setLoadingTaskDetails] = useState(false)
  const [generalComment, setGeneralComment] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    if (ongoingFlight) {
      setAircraft(ongoingFlight.aircraft_registration || '')
      setPilotFunction(ongoingFlight.pilot_function || 'DUAL')
      setFlightRules(ongoingFlight.flight_rules || 'VFR')
      setTimeOfDay(ongoingFlight.time_of_day || 'DAY')
      setFlightType(ongoingFlight.flight_type || 'LOCAL')
      setDeparture(ongoingFlight.departure_aerodrome || '')
      setDestination(ongoingFlight.destination_aerodrome || '')
      setDesiredTime(ongoingFlight.desired_flight_time || '')
      
      if (ongoingFlight.selected_program && !selectedProgram) setSelectedProgram(ongoingFlight.selected_program)
      if (ongoingFlight.selected_task && !selectedTask) setSelectedTask(ongoingFlight.selected_task)
      if (ongoingFlight.programs_cache && programs.length === 0) setPrograms(ongoingFlight.programs_cache)
      if (ongoingFlight.task_exercises_cache && taskExercises.length === 0) setTaskExercises(ongoingFlight.task_exercises_cache)
      if (ongoingFlight.task_description_cache && !taskDescription) setTaskDescription(ongoingFlight.task_description_cache)
      if (ongoingFlight.grades && Object.keys(grades).length === 0) setGrades(ongoingFlight.grades)
      if (ongoingFlight.exercise_comments && Object.keys(exerciseComments).length === 0) setExerciseComments(ongoingFlight.exercise_comments)
      if (ongoingFlight.general_comment && !generalComment) setGeneralComment(ongoingFlight.general_comment)
    }
  }, [ongoingFlight])

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('recent_aerodromes').eq('id', user.id).single()
        if (data?.recent_aerodromes) {
          setRecentAerodromes(data.recent_aerodromes)
        }
      }
    }
    if (isModalOpen) fetchProfile()
  }, [isModalOpen, supabase])

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await fetch('/api/flightlogger/airports')
        if (res.ok) {
          const data = await res.json()
          if (data.airports) {
            // Merge with current recentAerodromes to avoid duplicates
            setRecentAerodromes(prev => {
              const combined = new Set([...prev, ...data.airports])
              return Array.from(combined).sort()
            })
          }
        }
      } catch (e) {
        console.error('Failed to fetch past airports from FlightLogger', e)
      }
    }
    if (isModalOpen) {
      fetchAirports()
    }
  }, [isModalOpen])

  useEffect(() => {
    const fetchAircrafts = async () => {
      try {
        const res = await fetch('/api/flightlogger/aircrafts')
        if (res.ok) {
          const data = await res.json()
          if (data.aircrafts) {
            setAvailableAircraft(data.aircrafts)
          }
        }
      } catch (e) {
        console.error('Failed to fetch aircrafts', e)
      }
    }
    if (isModalOpen && availableAircraft.length === 0) {
      fetchAircrafts()
    }
  }, [isModalOpen, availableAircraft.length])

  // Fetch active programs when modal opens
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!ongoingFlight?.student_id) return
      if (ongoingFlight.programs_cache) {
        setPrograms(ongoingFlight.programs_cache)
        return // Use cache
      }
      
      setLoadingPrograms(true)
      try {
        const res = await fetch('/api/flightlogger/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: ongoingFlight.student_id })
        })
        if (res.ok) {
          const data = await res.json()
          const progs = data.programs || []
          setPrograms(progs)
          updateFlight({ programs_cache: progs })
          
          // Auto-select last used program from localStorage
          const savedProg = localStorage.getItem(`lastProg_${ongoingFlight.student_id}`)
          if (savedProg && progs.some((p: ProgramData) => p.programName === savedProg)) {
            setSelectedProgram(savedProg)
          } else if (progs.length > 0) {
            setSelectedProgram(progs[0].programName)
          }
        }
      } catch (e) {
        console.error('Error fetching programs', e)
      } finally {
        setLoadingPrograms(false)
      }
    }
    if (isModalOpen) fetchPrograms()
  }, [isModalOpen, ongoingFlight?.student_id, ongoingFlight?.programs_cache])

  // Save selected program to localStorage when it changes
  useEffect(() => {
    if (selectedProgram && ongoingFlight?.student_id) {
      localStorage.setItem(`lastProg_${ongoingFlight.student_id}`, selectedProgram)
    }
  }, [selectedProgram, ongoingFlight?.student_id])

  // Fetch task details when selectedTask changes
  useEffect(() => {
    if (!selectedTask || !ongoingFlight?.student_id || !selectedProgram) {
      setTaskExercises([])
      return
    }

    // Use cache if this is the currently cached task
    if (ongoingFlight.task_exercises_cache && ongoingFlight.selected_task === selectedTask) {
      setTaskExercises(ongoingFlight.task_exercises_cache);
      if (ongoingFlight.task_description_cache) setTaskDescription(ongoingFlight.task_description_cache);
      return;
    }

    const prog = programs.find(p => p.programName === selectedProgram)
    if (!prog?.programId) return

    const fetchTaskDetails = async () => {
      setLoadingTaskDetails(true)
      try {
        const url = `/api/flightlogger/task-details?studentId=${ongoingFlight.student_id}&programId=${prog.programId}&lectureId=${selectedTask}`
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          const exes = data.exercises || []
          const desc = data.description || ''
          setTaskExercises(exes)
          setTaskDescription(desc)
          
          // Pre-fill existing grades if any (though typically empty for NOT_FLOWN)
          const newGrades = { ...grades }
          let hasChanges = false
          if (data.exercises) {
            data.exercises.forEach((ex: any) => {
              if (ex.grade) {
                newGrades[ex.id] = ex.grade
              } else {
                newGrades[ex.id] = 'S' // Default to 'S'
              }
              hasChanges = true
            })
          }
          if (hasChanges) setGrades(newGrades)
          
          // Save to supabase immediately
          updateFlight({ 
            task_exercises_cache: exes, 
            task_description_cache: desc,
            selected_task: selectedTask, 
            selected_program: selectedProgram,
            grades: hasChanges ? newGrades : undefined
          })
        }
      } catch (e) {
        console.error('Error fetching task details', e)
      } finally {
        setLoadingTaskDetails(false)
      }
    }
    fetchTaskDetails()
  }, [selectedTask, ongoingFlight?.student_id, selectedProgram, programs, ongoingFlight?.task_exercises_cache, ongoingFlight?.selected_task])

  if (!isModalOpen || !ongoingFlight) return null

  const handleSave = async () => {
    await updateFlight({
      aircraft_registration: aircraft,
      pilot_function: pilotFunction,
      flight_rules: flightRules,
      time_of_day: timeOfDay,
      flight_type: flightType,
      departure_aerodrome: departure,
      destination_aerodrome: destination,
      desired_flight_time: desiredTime,
      selected_program: selectedProgram,
      selected_task: selectedTask,
      grades,
      exercise_comments: exerciseComments,
      general_comment: generalComment,
    })

    // Optionally save new aerodromes to profile
    const newRecent = new Set([...recentAerodromes, departure, destination].filter(Boolean))
    if (newRecent.size > recentAerodromes.length) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ recent_aerodromes: Array.from(newRecent) }).eq('id', user.id)
      }
    }
    setIsModalOpen(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
      <div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header">
          <h2 className="modal-title">Flight Recorder - {ongoingFlight.student_name}</h2>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-default)', background: 'var(--bg-elevated)' }}>
          <button
            onClick={() => setActiveTab('flight-parameters')}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'flight-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'flight-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'flight-parameters' ? 600 : 500, cursor: 'pointer'
            }}
          >
            Flight Parameters
          </button>
          <button
            onClick={() => setActiveTab('task-parameters')}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'task-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'task-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'task-parameters' ? 600 : 500, cursor: 'pointer'
            }}
          >
            Task Parameters
          </button>
        </div>

        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeTab === 'flight-parameters' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Aircraft Registration</label>
            <select 
              value={aircraft} 
              onChange={e => setAircraft(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
            >
              <option value="">Select Aircraft</option>
              {availableAircraft.length === 0 ? (
                <option disabled>Loading...</option>
              ) : (
                availableAircraft.map(ac => (
                  <option key={ac} value={ac}>{ac}</option>
                ))
              )}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Pilot Function</label>
              <select value={pilotFunction} onChange={e => setPilotFunction(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="SPIC">SPIC</option>
                <option value="DUAL">DUAL</option>
                <option value="SOLO">SOLO</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Flight Rules</label>
              <select value={flightRules} onChange={e => setFlightRules(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="VFR">VFR</option>
                <option value="IFR">IFR</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Time of Day</label>
              <select value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="DAY">DAY</option>
                <option value="NIGHT">NIGHT</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Flight Type</label>
              <select value={flightType} onChange={e => setFlightType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="LOCAL">LOCAL</option>
                <option value="X-COUNTRY">X-COUNTRY</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Departure Aerodrome</label>
              <input 
                type="text" 
                list="recent-aero" 
                value={departure} 
                onChange={e => setDeparture(e.target.value.toUpperCase())}
                placeholder="e.g. LHBP"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Destination Aerodrome</label>
              <input 
                type="text" 
                list="recent-aero" 
                value={destination} 
                onChange={e => setDestination(e.target.value.toUpperCase())}
                placeholder="e.g. LHSM"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
              />
            </div>
            <datalist id="recent-aero">
              {recentAerodromes.map(a => <option key={a} value={a} />)}
            </datalist>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Desired Flight Time (HH:MM)</label>
            <input 
              type="text" 
              value={desiredTime} 
              onChange={e => setDesiredTime(e.target.value)}
              placeholder="01:30"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
            />
              </div>
            </>
          )}

          {activeTab === 'task-parameters' && (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Program</label>
                <select 
                  value={selectedProgram} 
                  onChange={e => setSelectedProgram(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
                >
                  <option value="">Select Program</option>
                  {loadingPrograms ? (
                    <option disabled>Loading...</option>
                  ) : (
                    programs.map((p, idx) => (
                      <option key={idx} value={p.programName}>{p.programName}</option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Task</label>
                <select 
                  value={selectedTask} 
                  onChange={e => setSelectedTask(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
                >
                  <option value="">Select Task</option>
                  {programs.find(p => p.programName === selectedProgram)?.phases?.map((phase: PhaseData, pIdx: number) => (
                    <optgroup key={pIdx} label={phase.phaseName}>
                      {phase.tasks.map((task: TaskData) => (
                        <option 
                          key={task.taskId} 
                          value={task.taskId} 
                          style={{ color: task.status === 'PENDING' ? '#10b981' : '#ef4444' }} // green if pending, red if completed
                        >
                          {task.status === 'PENDING' ? '🟢' : '🔴'} {task.taskName}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Grading Scaffold */}
              {selectedTask && (
                <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border-default)', paddingBottom: '8px' }}>
                    Grading
                  </h3>
                  
                  {loadingTaskDetails ? (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Loading task details...</p>
                  ) : taskExercises.length > 0 ? (
                    (() => {
                      // Group exercises by category
                      const grouped: Record<string, Exercise[]> = {}
                      taskExercises.forEach(ex => {
                        if (!grouped[ex.categoryName]) grouped[ex.categoryName] = []
                        grouped[ex.categoryName].push(ex)
                      })

                      const gradeScale = ["", "BS", "S-", "S", "S+", "AS"]
                      const handleGradeCycle = (exId: string, direction: 'up' | 'down') => {
                        const currentGrade = grades[exId] || ""
                        let idx = gradeScale.indexOf(currentGrade)
                        if (idx === -1) idx = 0
                        
                        if (direction === 'up') {
                          idx = (idx + 1) % gradeScale.length
                        } else {
                          idx = (idx - 1 + gradeScale.length) % gradeScale.length
                        }
                        
                        const newGrades = { ...grades, [exId]: gradeScale[idx] }
                        setGrades(newGrades)
                        updateFlight({ grades: newGrades })
                      }

                      return Object.entries(grouped).map(([catName, exercises]) => (
                        <div key={catName} style={{ marginBottom: '16px' }}>
                          <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {catName}
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {exercises.map(ex => (
                              <div key={ex.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                  <span style={{ fontSize: '14px', flex: 1, paddingRight: '12px' }}>{ex.name}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button 
                                      onClick={() => handleGradeCycle(ex.id, 'down')}
                                      style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >-</button>
                                    <span style={{ fontWeight: 600, width: '24px', textAlign: 'center', color: grades[ex.id] ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                      {grades[ex.id] || "-"}
                                    </span>
                                    <button 
                                      onClick={() => handleGradeCycle(ex.id, 'up')}
                                      style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                                    >+</button>
                                  </div>
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                  <input 
                                    type="text" 
                                    placeholder="Comment for this competency..." 
                                    value={exerciseComments[ex.id] || ''}
                                    onChange={e => setExerciseComments(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                    onBlur={() => updateFlight({ exercise_comments: exerciseComments })}
                                    style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    })()
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No exercises found for this task.</p>
                  )}

                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>General Comment</label>
                    <textarea 
                      value={generalComment}
                      onChange={e => setGeneralComment(e.target.value)}
                      onBlur={() => updateFlight({ general_comment: generalComment })}
                      placeholder="Write a general comment for this task..."
                      style={{ width: '100%', height: '100px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', resize: 'vertical' }}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-default)' }}>
            <button 
              onClick={handleSave}
              style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
            >
              Save Parameters
            </button>
            <button 
              onClick={stopFlight}
              style={{ flex: 1, padding: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
            >
              Stop Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
