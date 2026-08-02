import re

with open("src/components/FlightRecorderModal.tsx", "r") as f:
    content = f.read()

# 1. Update activeTab type and default
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters'>('flight-parameters')",
    "const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters' | 'task-description'>('flight-parameters')"
)

# 2. Add taskDescription state
content = content.replace(
    "const [taskExercises, setTaskExercises] = useState<Exercise[]>([])",
    "const [taskExercises, setTaskExercises] = useState<Exercise[]>([])\n  const [taskDescription, setTaskDescription] = useState('')"
)

# 3. Update useEffect to restore from ongoingFlight
old_effect = """      if (ongoingFlight.task_exercises_cache && taskExercises.length === 0) setTaskExercises(ongoingFlight.task_exercises_cache)
      if (ongoingFlight.grades && Object.keys(grades).length === 0) setGrades(ongoingFlight.grades)"""

new_effect = """      if (ongoingFlight.task_exercises_cache && taskExercises.length === 0) setTaskExercises(ongoingFlight.task_exercises_cache)
      if (ongoingFlight.task_description_cache && !taskDescription) setTaskDescription(ongoingFlight.task_description_cache)
      if (ongoingFlight.grades && Object.keys(grades).length === 0) setGrades(ongoingFlight.grades)"""
content = content.replace(old_effect, new_effect)

# 4. Update fetchTaskDetails to use and set cache
old_fetch_task = """    // Use cache if this is the currently cached task
    if (ongoingFlight.task_exercises_cache && ongoingFlight.selected_task === selectedTask) {
      setTaskExercises(ongoingFlight.task_exercises_cache);
      return;
    }"""

new_fetch_task = """    // Use cache if this is the currently cached task
    if (ongoingFlight.task_exercises_cache && ongoingFlight.selected_task === selectedTask) {
      setTaskExercises(ongoingFlight.task_exercises_cache);
      if (ongoingFlight.task_description_cache) setTaskDescription(ongoingFlight.task_description_cache);
      return;
    }"""
content = content.replace(old_fetch_task, new_fetch_task)

old_fetch_task_res = """        if (res.ok) {
          const data = await res.json()
          const exes = data.exercises || []
          setTaskExercises(exes)"""

new_fetch_task_res = """        if (res.ok) {
          const data = await res.json()
          const exes = data.exercises || []
          const desc = data.description || ''
          setTaskExercises(exes)
          setTaskDescription(desc)"""
content = content.replace(old_fetch_task_res, new_fetch_task_res)

old_update_flight = """          // Save to supabase immediately
          updateFlight({ 
            task_exercises_cache: exes, 
            selected_task: selectedTask, 
            selected_program: selectedProgram,
            grades: hasChanges ? newGrades : undefined
          })"""

new_update_flight = """          // Save to supabase immediately
          updateFlight({ 
            task_exercises_cache: exes, 
            task_description_cache: desc,
            selected_task: selectedTask, 
            selected_program: selectedProgram,
            grades: hasChanges ? newGrades : undefined
          })"""
content = content.replace(old_update_flight, new_update_flight)

# 5. Add Task Description Tab
old_tabs = """          <button
            onClick={() => setActiveTab('task-parameters')}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'task-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'task-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'task-parameters' ? 600 : 500, cursor: 'pointer'
            }}
          >
            Task Parameters
          </button>
        </div>"""

new_tabs = """          <button
            onClick={() => setActiveTab('task-parameters')}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'task-parameters' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'task-parameters' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'task-parameters' ? 600 : 500, cursor: 'pointer'
            }}
          >
            Task Parameters
          </button>
          <button
            onClick={() => setActiveTab('task-description')}
            style={{
              flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'task-description' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'task-description' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'task-description' ? 600 : 500, cursor: 'pointer'
            }}
          >
            Task Description
          </button>
        </div>"""
content = content.replace(old_tabs, new_tabs)

# 6. Add Task Description Panel
old_panel = """          {activeTab === 'task-parameters' && (
            <>"""

new_panel = """          {activeTab === 'task-description' && (
            <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', color: 'white', lineHeight: '1.6' }}>
              {loadingTaskDetails ? (
                <p style={{ color: 'var(--text-secondary)' }}>Loading task details...</p>
              ) : taskDescription ? (
                <div dangerouslySetInnerHTML={{ __html: taskDescription }} />
              ) : (
                <p style={{ color: 'var(--text-secondary)' }}>No description available for this task. Please select a task first.</p>
              )}
            </div>
          )}

          {activeTab === 'task-parameters' && (
            <>"""
content = content.replace(old_panel, new_panel)

# 7. Update handleSave to not lose task_description_cache (not strictly necessary if it's already merged by updateFlight but good to be safe)
# Actually updateFlight does a partial update, so we don't need to pass caches in handleSave. We don't pass programs_cache either.

with open("src/components/FlightRecorderModal.tsx", "w") as f:
    f.write(content)
