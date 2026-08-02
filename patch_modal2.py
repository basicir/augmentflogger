import re

with open("src/components/FlightRecorderModal.tsx", "r") as f:
    content = f.read()

# 1. Update fetchPrograms
old_fetch_prog = """  // Fetch active programs when modal opens
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!ongoingFlight?.student_id) return
      if (ongoingFlight.programs_cache) return // Use cache
      
      setLoadingPrograms(true)"""

new_fetch_prog = """  // Fetch active programs when modal opens
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!ongoingFlight?.student_id) return
      if (ongoingFlight.programs_cache) {
        setPrograms(ongoingFlight.programs_cache)
        return // Use cache
      }
      
      setLoadingPrograms(true)"""
content = content.replace(old_fetch_prog, new_fetch_prog)

# 2. Update fetchTaskDetails
old_fetch_task = """    // Use cache if this is the currently cached task
    if (ongoingFlight.task_exercises_cache && ongoingFlight.selected_task === selectedTask) {
      return;
    }"""

new_fetch_task = """    // Use cache if this is the currently cached task
    if (ongoingFlight.task_exercises_cache && ongoingFlight.selected_task === selectedTask) {
      setTaskExercises(ongoingFlight.task_exercises_cache);
      return;
    }"""
content = content.replace(old_fetch_task, new_fetch_task)

# 3. Update handleGradeCycle
old_grade_cycle = """                      const handleGradeCycle = (exId: string, direction: 'up' | 'down') => {
                        setGrades(prev => {
                          const currentGrade = prev[exId] || ""
                          let idx = gradeScale.indexOf(currentGrade)
                          if (idx === -1) idx = 0
                          
                          if (direction === 'up') {
                            idx = (idx + 1) % gradeScale.length
                          } else {
                            idx = (idx - 1 + gradeScale.length) % gradeScale.length
                          }
                          
                          return { ...prev, [exId]: gradeScale[idx] }
                        })
                      }"""

new_grade_cycle = """                      const handleGradeCycle = (exId: string, direction: 'up' | 'down') => {
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
                      }"""
content = content.replace(old_grade_cycle, new_grade_cycle)

# 4. Update exerciseComments input
old_ex_comment = """                                  <input 
                                    type="text" 
                                    placeholder="Komment ehhez a kompetenciához..." 
                                    value={exerciseComments[ex.id] || ''}
                                    onChange={e => setExerciseComments(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                    style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                  />"""

new_ex_comment = """                                  <input 
                                    type="text" 
                                    placeholder="Komment ehhez a kompetenciához..." 
                                    value={exerciseComments[ex.id] || ''}
                                    onChange={e => setExerciseComments(prev => ({ ...prev, [ex.id]: e.target.value }))}
                                    onBlur={() => updateFlight({ exercise_comments: exerciseComments })}
                                    style={{ width: '100%', padding: '8px', fontSize: '13px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-default)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                                  />"""
content = content.replace(old_ex_comment, new_ex_comment)

# 5. Update generalComment textarea
old_gen_comment = """                    <textarea 
                      value={generalComment}
                      onChange={e => setGeneralComment(e.target.value)}
                      placeholder="Write a general comment for this task..."
                      style={{ width: '100%', height: '100px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', resize: 'vertical' }}
                    />"""

new_gen_comment = """                    <textarea 
                      value={generalComment}
                      onChange={e => setGeneralComment(e.target.value)}
                      onBlur={() => updateFlight({ general_comment: generalComment })}
                      placeholder="Write a general comment for this task..."
                      style={{ width: '100%', height: '100px', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', resize: 'vertical' }}
                    />"""
content = content.replace(old_gen_comment, new_gen_comment)

with open("src/components/FlightRecorderModal.tsx", "w") as f:
    f.write(content)
