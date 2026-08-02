import re

with open("src/components/FlightRecorderModal.tsx", "r") as f:
    content = f.read()

# 1. Add exerciseComments state
content = content.replace(
    "const [grades, setGrades] = useState<Record<string, string>>({})",
    "const [grades, setGrades] = useState<Record<string, string>>({})\n  const [exerciseComments, setExerciseComments] = useState<Record<string, string>>({})"
)

# 2. Update the ongoingFlight useEffect
old_effect = """  useEffect(() => {
    if (ongoingFlight) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAircraft(ongoingFlight.aircraft_registration || '')
       
      setPilotFunction(ongoingFlight.pilot_function || 'DUAL')
       
      setFlightRules(ongoingFlight.flight_rules || 'VFR')
       
      setTimeOfDay(ongoingFlight.time_of_day || 'DAY')
       
      setFlightType(ongoingFlight.flight_type || 'LOCAL')
       
      setDeparture(ongoingFlight.departure_aerodrome || '')
       
      setDestination(ongoingFlight.destination_aerodrome || '')
       
      setDesiredTime(ongoingFlight.desired_flight_time || '')
    }
  }, [ongoingFlight])"""

new_effect = """  useEffect(() => {
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
      if (ongoingFlight.grades && Object.keys(grades).length === 0) setGrades(ongoingFlight.grades)
      if (ongoingFlight.exercise_comments && Object.keys(exerciseComments).length === 0) setExerciseComments(ongoingFlight.exercise_comments)
      if (ongoingFlight.general_comment && !generalComment) setGeneralComment(ongoingFlight.general_comment)
    }
  }, [ongoingFlight])"""
content = content.replace(old_effect, new_effect)

# 3. Update fetchPrograms
old_fetch_prog = """  // Fetch active programs when modal opens
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!ongoingFlight?.student_id) return
      setLoadingPrograms(true)
      try {
        const res = await fetch('/api/flightlogger/programs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId: ongoingFlight.student_id })
        })
        if (res.ok) {
          const data = await res.json()
          setPrograms(data.programs || [])
          
          // Auto-select last used program from localStorage
          const savedProg = localStorage.getItem(`lastProg_${ongoingFlight.student_id}`)
          if (savedProg && data.programs?.some((p: ProgramData) => p.programName === savedProg)) {
            setSelectedProgram(savedProg)
          } else if (data.programs?.length > 0) {
            setSelectedProgram(data.programs[0].programName)
          }
        }
      } catch (e) {
        console.error('Error fetching programs', e)
      } finally {
        setLoadingPrograms(false)
      }
    }
    if (isModalOpen) fetchPrograms()
  }, [isModalOpen, ongoingFlight?.student_id])"""

new_fetch_prog = """  // Fetch active programs when modal opens
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!ongoingFlight?.student_id) return
      if (ongoingFlight.programs_cache) return // Use cache
      
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
  }, [isModalOpen, ongoingFlight?.student_id, ongoingFlight?.programs_cache])"""
content = content.replace(old_fetch_prog, new_fetch_prog)

# 4. Update fetchTaskDetails
old_fetch_task = """  // Fetch task details when selectedTask changes
  useEffect(() => {
    if (!selectedTask || !ongoingFlight?.student_id || !selectedProgram) {
      setTaskExercises([])
      return
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
          setTaskExercises(data.exercises || [])
          
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
        }
      } catch (e) {
        console.error('Error fetching task details', e)
      } finally {
        setLoadingTaskDetails(false)
      }
    }
    fetchTaskDetails()
  }, [selectedTask, ongoingFlight?.student_id, selectedProgram, programs])"""

new_fetch_task = """  // Fetch task details when selectedTask changes
  useEffect(() => {
    if (!selectedTask || !ongoingFlight?.student_id || !selectedProgram) {
      setTaskExercises([])
      return
    }

    // Use cache if this is the currently cached task
    if (ongoingFlight.task_exercises_cache && ongoingFlight.selected_task === selectedTask) {
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
          setTaskExercises(exes)
          
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
  }, [selectedTask, ongoingFlight?.student_id, selectedProgram, programs, ongoingFlight?.task_exercises_cache, ongoingFlight?.selected_task])"""
content = content.replace(old_fetch_task, new_fetch_task)

# 5. Update handleSave
old_handle_save = """  const handleSave = async () => {
    await updateFlight({
      aircraft_registration: aircraft,
      pilot_function: pilotFunction,
      flight_rules: flightRules,
      time_of_day: timeOfDay,
      flight_type: flightType,
      departure_aerodrome: departure,
      destination_aerodrome: destination,
      desired_flight_time: desiredTime,
    })"""

new_handle_save = """  const handleSave = async () => {
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
    })"""
content = content.replace(old_handle_save, new_handle_save)

# 6. Add comment field to exercise mapping
old_ex_map = """                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                  </div>"""

new_ex_map = """                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                    placeholder="Komment ehhez a kompetenciához..." 
                                    value={exerciseComments[ex.id] || ''}
                                    onChange={e => setExerciseComments(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                    style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                  />"""
content = content.replace(old_ex_map, new_ex_map)

# Let's write the modified content back
with open("src/components/FlightRecorderModal.tsx", "w") as f:
    f.write(content)
