'use client'

import { useState, useEffect, useRef } from 'react'
import { useFlightRecorder } from './FlightRecorderContext'
import { createClient } from '@/lib/supabase/client'
import taskData from '@/data/flightlogger_tasks.json'

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
  
  // Rewind Start Time State
  const [isRewindActive, setIsRewindActive] = useState(false)
  const [rewindMinutes, setRewindMinutes] = useState(0)
  const rewindRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ongoingFlight?.id) {
      const stored = localStorage.getItem(`rewind_minutes_${ongoingFlight.id}`)
      if (stored) {
        setRewindMinutes(parseInt(stored, 10))
      } else {
        setRewindMinutes(0)
      }
    }
  }, [ongoingFlight?.id])

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

  const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters' | 'comments' | 'description'>('flight-parameters')
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
  const [taskDescription, setTaskDescription] = useState<string>('')
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [grades, setGrades] = useState<Record<string, string>>({})
  const [exerciseComments, setExerciseComments] = useState<Record<string, string>>({})
  const [loadingTaskDetails, setLoadingTaskDetails] = useState(false)
  const [generalComment, setGeneralComment] = useState('')
  
  const supabase = createClient()

  useEffect(() => {
    if (ongoingFlight) {
      setAircraft(ongoingFlight.aircraft_registration || '')
      setPilotFunction(ongoingFlight.pilot_function || 'Not Specified')
      setFlightRules(ongoingFlight.flight_rules || 'Not Specified')
      setTimeOfDay(ongoingFlight.time_of_day || 'Not Specified')
      setFlightType(ongoingFlight.flight_type || 'Not Specified')
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

  const FALLBACK_AIRPORTS = ["EPKR","EPML","EPRZ","LBHC","LHBC","LHBP","LHBS","LHBY","LHDB","LHDC","LHDK","LHEM","LHER","LHHO","LHJK","LHKE","LHKK","LHKM","LHMC","LHMR","LHNK","LHNY","LHPK","LHPP","LHPR","LHSA","LHSK","LHSM","LHSN","LHTJ","LHTL","LHUD","LHZK","LRAR","LRBM","LROD","LRSM","LRSN","LRTR","LZKC","LZKZ","LZSL","LZTT","ZZZZ"]

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await fetch('/api/flightlogger/airports')
        if (res.ok) {
          const data = await res.json()
          if (data.airports && data.airports.length > 0) {
            // Merge with current recentAerodromes to avoid duplicates
            setRecentAerodromes(prev => {
              const combined = new Set([...prev, ...data.airports, ...FALLBACK_AIRPORTS])
              return Array.from(combined).sort()
            })
            return
          }
        }
      } catch (e) {
        console.error('Failed to fetch past airports from FlightLogger', e)
      }
      // Fallback
      setRecentAerodromes(prev => {
        const combined = new Set([...prev, ...FALLBACK_AIRPORTS])
        return Array.from(combined).sort()
      })
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
          
          // Check if flight already has a program selected
          if (ongoingFlight.selected_program && progs.some((p: ProgramData) => p.programName === ongoingFlight.selected_program)) {
            setSelectedProgram(ongoingFlight.selected_program)
          } else {
            // Auto-select last used program from localStorage
            const savedProg = localStorage.getItem(`lastProg_${ongoingFlight.student_id}`)
            if (savedProg && progs.some((p: ProgramData) => p.programName === savedProg)) {
              setSelectedProgram(savedProg)
            } else if (progs.length > 0) {
              setSelectedProgram(progs[0].programName)
            }
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
    if (ongoingFlight.task_exercises_cache && ongoingFlight.task_exercises_cache.length > 0 && ongoingFlight.selected_task === selectedTask) {
      setTaskExercises(ongoingFlight.task_exercises_cache);
      if (ongoingFlight.task_description_cache) setTaskDescription(ongoingFlight.task_description_cache);
      return;
    }

    const prog = programs.find(p => p.programName === selectedProgram)
    if (!prog?.programId) return

    const fetchTaskDetails = async () => {
      setLoadingTaskDetails(true)
      try {
        let targetTaskName = '';
        for (const phase of prog.phases || []) {
          const t = phase.tasks.find((t: any) => t.taskId === selectedTask);
          if (t) {
            targetTaskName = t.taskName;
            break;
          }
        }

        const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
        const lcsLength = (a: string[], b: string[]) => {
          const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
          for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
              if (a[i-1] === b[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
              } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
              }
            }
          }
          return dp[a.length][b.length];
        };

        const targetWords = normalize(targetTaskName);
        let bestMatch = null;
        let bestScore = 0;

        for (const t of taskData as any[]) {
          const candidateWords = normalize(t.task_name || '');
          const score = lcsLength(targetWords, candidateWords);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = t;
          }
        }
        
        const foundTask = bestMatch;
        if (foundTask) {
          const exes = (foundTask.competencies || []).map((comp: any) => ({
            id: comp.name, // Use name as ID since scraped data doesn't have IDs
            name: comp.name,
            categoryName: 'Competencies', // Default category
            grade: 'S' // Default grade
          }))
          const desc = `<h3 style="margin-top:0;margin-bottom:8px;color:var(--primary);font-size:16px;">Matched Task: ${foundTask.task_name}</h3><hr style="border:0;border-bottom:1px solid var(--border-default);margin-bottom:16px;" />` + (foundTask.description || '')
          
          setTaskExercises(exes)
          setTaskDescription(desc)
          
          const newGrades = { ...grades }
          let hasChanges = false
          exes.forEach((ex: any) => {
            if (!newGrades[ex.id]) {
              newGrades[ex.id] = 'S'
              hasChanges = true
            }
          })
          if (hasChanges) setGrades(newGrades)
          
          updateFlight({ 
            task_exercises_cache: exes, 
            task_description_cache: desc,
            selected_task: selectedTask, 
            selected_program: selectedProgram,
            grades: hasChanges ? newGrades : undefined
          })
        } else {
          // Task not found in local JSON
          setTaskExercises([])
          setTaskDescription('')
        }
      } catch (e) {
        console.error('Error fetching task details', e)
      } finally {
        setLoadingTaskDetails(false)
      }
    }
    if (ongoingFlight?.student_id) {
      fetchTaskDetails()
    }
  }, [selectedTask, ongoingFlight?.student_id, selectedProgram, programs, ongoingFlight?.task_exercises_cache, ongoingFlight?.selected_task])

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  if (!isModalOpen || !ongoingFlight) return null

  const pilotFunctionOpts = ['Not Specified', 'DUAL', 'SPIC', 'SOLO'];
  const flightRulesOpts = ['Not Specified', 'VFR', 'IFR'];
  const timeOfDayOpts = ['Not Specified', 'DAY', 'NIGHT'];
  const flightTypeOpts = ['Not Specified', 'LOCAL', 'X-COUNTRY'];

  const getNextOpt = (opts: string[], current: string) => {
    const idx = opts.indexOf(current);
    const next = opts[(idx + 1) % opts.length];
    return next === 'Not Specified' ? 'N/S' : next;
  }

  const cyclePilotFunction = () => {
    const next = pilotFunctionOpts[(pilotFunctionOpts.indexOf(pilotFunction) + 1) % pilotFunctionOpts.length];
    setPilotFunction(next);
    updateFlight({ pilot_function: next });
  };

  const cycleFlightRules = () => {
    const next = flightRulesOpts[(flightRulesOpts.indexOf(flightRules) + 1) % flightRulesOpts.length];
    setFlightRules(next);
    updateFlight({ flight_rules: next });
  };

  const cycleTimeOfDay = () => {
    const next = timeOfDayOpts[(timeOfDayOpts.indexOf(timeOfDay) + 1) % timeOfDayOpts.length];
    setTimeOfDay(next);
    updateFlight({ time_of_day: next });
  };

  const cycleFlightType = () => {
    const next = flightTypeOpts[(flightTypeOpts.indexOf(flightType) + 1) % flightTypeOpts.length];
    setFlightType(next);
    updateFlight({ flight_type: next });
  };

  const adjustTime = (minutesToAdd: number) => {
    let [hStr, mStr] = desiredTime.split(':');
    let h = parseInt(hStr || '01', 10);
    let m = parseInt(mStr || '00', 10);
    
    let totalMinutes = h * 60 + m + minutesToAdd;
    if (totalMinutes < 0) totalMinutes = 0;
    if (totalMinutes > 23 * 60 + 55) totalMinutes = 23 * 60 + 55;
    
    let newH = Math.floor(totalMinutes / 60);
    let newM = totalMinutes % 60;
    
    const newTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
    setDesiredTime(newTime);
    updateFlight({ desired_flight_time: newTime });
  };

  const adjustStartTime = (delta: number) => {
    let newRewind = rewindMinutes + delta;
    if (newRewind > 0) newRewind = 0; // Cap at 0
    const actualDelta = newRewind - rewindMinutes;
    if (actualDelta === 0) return;

    setRewindMinutes(newRewind);
    if (ongoingFlight?.id) {
      localStorage.setItem(`rewind_minutes_${ongoingFlight.id}`, newRewind.toString());
    }

    if (ongoingFlight && ongoingFlight.start_time) {
      const currentStartTime = new Date(ongoingFlight.start_time);
      const newTime = new Date(currentStartTime.getTime() + actualDelta * 60000);
      updateFlight({ start_time: newTime.toISOString() });
    }
  };

  const handleAerodromeBlur = async (field: 'departure_aerodrome' | 'destination_aerodrome', value: string) => {
    updateFlight({ [field]: value });
    if (value && !recentAerodromes.includes(value)) {
      const newRecent = [...recentAerodromes, value].sort();
      setRecentAerodromes(newRecent);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from('profiles').update({ recent_aerodromes: newRecent }).eq('id', user.id);
      }
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
      <div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: `${viewportHeight * 0.85}px`, height: activeTab === 'comments' ? `${viewportHeight * 0.85}px` : 'auto', marginBottom: `${viewportHeight * 0.10}px`, display: 'flex', flexDirection: 'column' }}>
        <div className="modal-header" style={{ flexShrink: 0 }}>
          <h2 className="modal-title">Flight Recorder - {ongoingFlight.student_name}</h2>
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
          <button
            onClick={() => setActiveTab('description')}
            style={{
              flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'description' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'description' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'description' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            Description
          </button>
        </div>

        <div style={{ padding: '16px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {activeTab === 'flight-parameters' && (
            <>
              <div>
            <select 
              value={aircraft} 
              onChange={e => {
                setAircraft(e.target.value);
                updateFlight({ aircraft_registration: e.target.value });
              }}
              style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', fontWeight: 'bold' }}
            >
              <option value="">✈️ Select Aircraft</option>
              {availableAircraft.length === 0 ? (
                <option disabled>Loading...</option>
              ) : (
                availableAircraft.map(ac => (
                  <option key={ac} value={ac}>{ac}</option>
                ))
              )}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <button onClick={cyclePilotFunction} style={{ position: 'relative', width: '100%', padding: '16px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '900', fontSize: '16px' }}>
                <span>{pilotFunction === 'Not Specified' ? 'N/S' : pilotFunction}</span>
                <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{getNextOpt(pilotFunctionOpts, pilotFunction)}</span>
              </button>
            </div>
            <div>
              <button onClick={cycleFlightRules} style={{ position: 'relative', width: '100%', padding: '16px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '900', fontSize: '16px' }}>
                <span>{flightRules === 'Not Specified' ? 'N/S' : flightRules}</span>
                <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{getNextOpt(flightRulesOpts, flightRules)}</span>
              </button>
            </div>
            <div>
              <button onClick={cycleTimeOfDay} style={{ position: 'relative', width: '100%', padding: '16px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '900', fontSize: '16px' }}>
                <span>{timeOfDay === 'Not Specified' ? 'N/S' : timeOfDay}</span>
                <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{getNextOpt(timeOfDayOpts, timeOfDay)}</span>
              </button>
            </div>
            <div>
              <button onClick={cycleFlightType} style={{ position: 'relative', width: '100%', padding: '16px 8px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', cursor: 'pointer', textAlign: 'center', fontWeight: '900', fontSize: '16px' }}>
                <span>{flightType === 'Not Specified' ? 'N/S' : flightType}</span>
                <span style={{ position: 'absolute', top: '4px', right: '8px', fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 'normal' }}>{getNextOpt(flightTypeOpts, flightType)}</span>
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            <div>
              <input 
                type="text" 
                list="recent-aero" 
                value={departure} 
                onChange={e => setDeparture(e.target.value.toUpperCase())}
                onBlur={e => handleAerodromeBlur('departure_aerodrome', e.target.value.toUpperCase())}
                placeholder="🛫 Dep (e.g. LHBP)"
                style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', fontWeight: 'bold', textAlign: 'center' }}
              />
            </div>
            <div>
              <input 
                type="text" 
                list="recent-aero" 
                value={destination} 
                onChange={e => setDestination(e.target.value.toUpperCase())}
                onBlur={e => handleAerodromeBlur('destination_aerodrome', e.target.value.toUpperCase())}
                placeholder="🛬 Dest (e.g. LHSM)"
                style={{ width: '100%', padding: '12px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', fontWeight: 'bold', textAlign: 'center' }}
              />
            </div>
            <datalist id="recent-aero">
              {recentAerodromes.map(a => <option key={a} value={a} />)}
            </datalist>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', background: 'var(--bg-elevated)', padding: '16px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => adjustTime(60)} style={{ width: '60px', padding: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>+1h</button>
                <span style={{ fontSize: '28px', fontWeight: '900' }}>{desiredTime.split(':')[0] || '01'}</span>
                <button onClick={() => adjustTime(-60)} style={{ width: '60px', padding: '8px', fontSize: '14px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>-1h</button>
              </div>
              
              <span style={{ fontSize: '28px', fontWeight: '900' }}>:</span>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => adjustTime(5)} style={{ width: '48px', padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>+5m</button>
                  <button onClick={() => adjustTime(10)} style={{ width: '48px', padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>+10m</button>
                </div>
                <span style={{ fontSize: '28px', fontWeight: '900' }}>{desiredTime.split(':')[1] || '00'}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => adjustTime(-5)} style={{ width: '48px', padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>-5m</button>
                  <button onClick={() => adjustTime(-10)} style={{ width: '48px', padding: '8px', fontSize: '12px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: 'var(--radius-sm)', fontWeight: 'bold', cursor: 'pointer' }}>-10m</button>
                </div>
              </div>

            </div>
          </div>

          {/* Rewind Start Time Container */}
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}>
            {!isRewindActive ? (
              <button 
                onClick={() => { setIsRewindActive(true); setTimeout(() => rewindRef.current?.focus(), 0); }}
                style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ⏱️ Rewind Start Time
              </button>
            ) : (
              <div 
                ref={rewindRef}
                tabIndex={-1}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    setIsRewindActive(false);
                    // intentionally not resetting rewindMinutes so it remembers the value
                  }
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid #ef4444', outline: 'none' }}
              >
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => adjustStartTime(-10)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}>-10</button>
                  <button onClick={() => adjustStartTime(-5)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}>-5</button>
                  <button onClick={() => adjustStartTime(-1)} style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold' }}>-1</button>
                </div>
                <span style={{ color: '#ef4444', fontSize: '20px', fontWeight: '900', minWidth: '40px', textAlign: 'center' }}>
                  {rewindMinutes < 0 ? rewindMinutes : 0}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => adjustStartTime(1)} disabled={rewindMinutes >= 0} style={{ padding: '6px 10px', background: rewindMinutes >= 0 ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)', color: rewindMinutes >= 0 ? 'var(--text-secondary)' : '#ef4444', border: rewindMinutes >= 0 ? '1px solid transparent' : '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', cursor: rewindMinutes >= 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>+1</button>
                  <button onClick={() => adjustStartTime(5)} disabled={rewindMinutes >= 0} style={{ padding: '6px 10px', background: rewindMinutes >= 0 ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)', color: rewindMinutes >= 0 ? 'var(--text-secondary)' : '#ef4444', border: rewindMinutes >= 0 ? '1px solid transparent' : '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', cursor: rewindMinutes >= 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>+5</button>
                  <button onClick={() => adjustStartTime(10)} disabled={rewindMinutes >= 0} style={{ padding: '6px 10px', background: rewindMinutes >= 0 ? 'rgba(255,255,255,0.05)' : 'rgba(239,68,68,0.1)', color: rewindMinutes >= 0 ? 'var(--text-secondary)' : '#ef4444', border: rewindMinutes >= 0 ? '1px solid transparent' : '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)', cursor: rewindMinutes >= 0 ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>+10</button>
                </div>
              </div>
            )}
          </div>
            </>
          )}

          {activeTab === 'task-parameters' && (
            <>
              <div>
                <select 
                  value={selectedProgram} 
                  onChange={e => setSelectedProgram(e.target.value)}
                  style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', fontWeight: 'bold' }}
                >
                  <option value="">📁 Select Program</option>
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
                <select 
                  value={selectedTask} 
                  onChange={e => setSelectedTask(e.target.value)}
                  style={{ width: '100%', padding: '16px', fontSize: '18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', fontWeight: 'bold' }}
                >
                  <option value="">📝 Select Task</option>
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
                              <div key={ex.id} style={{ padding: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '64px' }}>
                                  
                                  {/* Left Arrow Toggle for Comments */}
                                  <button 
                                    onClick={() => setExpandedComments(prev => ({ ...prev, [ex.id]: !prev[ex.id] }))}
                                    style={{ position: 'relative', width: '32px', height: '100%', background: 'none', border: 'none', color: exerciseComments[ex.id] ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}
                                  >
                                    {expandedComments[ex.id] ? '▼' : '▶'}
                                    {/* Indicator dot if there's a comment but drawer is closed */}
                                    {exerciseComments[ex.id] && !expandedComments[ex.id] && (
                                      <span style={{ position: 'absolute', top: '24px', right: '0px', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                                    )}
                                  </button>

                                  {/* Competency Title (30% width container) */}
                                  <div style={{ width: '30%', height: '100%', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '8px', containerType: 'inline-size' }}>
                                    <span style={{ fontSize: 'clamp(9px, 12cqw, 14px)', fontWeight: 600, lineHeight: 1.1, wordBreak: 'normal', color: 'var(--text-primary)', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                      {ex.name}
                                    </span>
                                  </div>
                                  
                                  {/* Grade Buttons (Remaining space) */}
                                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', padding: '6px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-default)', margin: '2px 0 2px 8px' }}>
                                    <button 
                                      onClick={() => handleGradeCycle(ex.id, 'down')}
                                      style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '4px' }}
                                    >-</button>
                                    <span style={{ fontWeight: 900, fontSize: '22px', textAlign: 'center', color: grades[ex.id] ? 'var(--primary)' : 'var(--text-secondary)' }}>
                                      {grades[ex.id] || "N/A"}
                                    </span>
                                    <button 
                                      onClick={() => handleGradeCycle(ex.id, 'up')}
                                      style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '28px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '2px' }}
                                    >+</button>
                                  </div>
                                </div>
                                {expandedComments[ex.id] && (
                                  <div style={{ marginTop: '8px', animation: 'fadeIn 0.2s ease-in-out' }}>
                                    <textarea 
                                      placeholder="✏️ Write a comment for this specific competency..." 
                                      value={exerciseComments[ex.id] || ''}
                                      onChange={e => {
                                        e.target.style.height = 'auto';
                                        e.target.style.height = e.target.scrollHeight + 'px';
                                        setExerciseComments(prev => ({ ...prev, [ex.id]: e.target.value }));
                                      }}
                                      onBlur={() => updateFlight({ exercise_comments: exerciseComments })}
                                      style={{ width: '100%', padding: '16px', fontSize: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.3)', color: 'white', minHeight: '80px', overflow: 'hidden', resize: 'none' }}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    })()
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>No exercises found for this task.</p>
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border-default)', paddingBottom: '8px', marginBottom: '12px', flexShrink: 0 }}>
                  General Comment
                </h3>
                <textarea 
                  value={generalComment}
                  onChange={e => {
                    setGeneralComment(e.target.value);
                  }}
                  onBlur={() => updateFlight({ general_comment: generalComment })}
                  placeholder="📝 Write a general comment for this task..."
                  style={{ width: '100%', flex: 1, padding: '16px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', overflow: 'auto', resize: 'none' }}
                />
              </div>
            </div>
          )}

          {activeTab === 'description' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div 
                className="trix-content"
                style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', color: 'var(--text-primary)', lineHeight: '1.6' }}
                dangerouslySetInnerHTML={{ __html: taskDescription || '<p style="color:var(--text-secondary)">No description available for this task.</p>' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
