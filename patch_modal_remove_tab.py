import re

with open("src/components/FlightRecorderModal.tsx", "r") as f:
    content = f.read()

# 1. Update activeTab type and default
content = content.replace(
    "const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters' | 'task-description'>('flight-parameters')",
    "const [activeTab, setActiveTab] = useState<'flight-parameters' | 'task-parameters'>('flight-parameters')"
)

# 2. Remove Task Description Tab
old_tabs = """          <button
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

new_tabs = """        </div>"""
content = content.replace(old_tabs, new_tabs)

# 3. Remove Task Description Panel
old_panel = """          {activeTab === 'task-description' && (
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

new_panel = """          {activeTab === 'task-parameters' && (
            <>"""
content = content.replace(old_panel, new_panel)

# Note: We can leave taskDescription state and cache logic in the code, it doesn't break anything, it's just unused, but it's cleaner to remove it if possible. Let's not risk breaking the useEffects by trying to remove the exact lines, since it's harmless.

with open("src/components/FlightRecorderModal.tsx", "w") as f:
    f.write(content)
