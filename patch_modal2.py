import os

with open('src/components/FlightRecorderModal.tsx', 'r') as f:
    content = f.read()

# 1. Update task description cache to include task name
old_desc_logic = """const desc = foundTask.description || ''"""
new_desc_logic = """const desc = `<h3 style="margin-top:0;margin-bottom:8px;color:var(--primary);font-size:16px;">Matched Task: ${foundTask.task_name}</h3><hr style="border:0;border-bottom:1px solid var(--border-default);margin-bottom:16px;" />` + (foundTask.description || '')"""
content = content.replace(old_desc_logic, new_desc_logic)

# 2. Swap Description and Comments tabs in FlightRecorderModal
# We will use regex or simple string replacement.
old_tabs = """          <button
            onClick={() => setActiveTab('description')}
            style={{
              flex: 1, padding: '12px', background: 'none', border: 'none', color: activeTab === 'description' ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === 'description' ? '2px solid var(--primary)' : '2px solid transparent',
              fontWeight: activeTab === 'description' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            Description
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
          </button>"""

new_tabs = """          <button
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
          </button>"""
content = content.replace(old_tabs, new_tabs)

# 3. Update Comments Tab textarea to use flex: 1
old_comments_tab = """          {activeTab === 'comments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--border-default)', paddingBottom: '8px', marginBottom: '12px' }}>
                  General Comment
                </h3>
                <textarea 
                  value={generalComment}
                  onChange={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                    setGeneralComment(e.target.value);
                  }}
                  onBlur={() => updateFlight({ general_comment: generalComment })}
                  placeholder="📝 Write a general comment for this task..."
                  style={{ width: '100%', minHeight: '100px', padding: '16px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', overflow: 'hidden', resize: 'none' }}
                />
              </div>
            </div>
          )}"""

new_comments_tab = """          {activeTab === 'comments' && (
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
          )}"""
content = content.replace(old_comments_tab, new_comments_tab)

with open('src/components/FlightRecorderModal.tsx', 'w') as f:
    f.write(content)

with open('src/app/dashboard/flights/[id]/FlightDetails.tsx', 'r') as f:
    fd_content = f.read()

# Swap tabs in FlightDetails
old_tabs_fd = """        <button
          onClick={() => setActiveTab('description')}
          style={{
            flex: 1, padding: '16px', background: 'none', border: 'none', color: activeTab === 'description' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'description' ? '2px solid var(--primary)' : '2px solid transparent',
            fontWeight: activeTab === 'description' ? 600 : 500, cursor: 'pointer', whiteSpace: 'nowrap'
          }}
        >
          Description
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
        </button>"""

new_tabs_fd = """        <button
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
        </button>"""
fd_content = fd_content.replace(old_tabs_fd, new_tabs_fd)

old_comments_tab_fd = """        {activeTab === 'comments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <h4 style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px', textTransform: 'uppercase' }}>General Comment</h4>
              {isEditing ? (
                <textarea
                  value={editData.general_comment ?? flight.general_comment ?? ''}
                  onChange={e => {
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                    setEditData({ ...editData, general_comment: e.target.value })
                  }}
                  style={{ width: '100%', minHeight: '100px', padding: '12px', fontSize: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white', overflow: 'hidden', resize: 'none' }}
                />
              ) : (
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', minHeight: '60px', whiteSpace: 'pre-wrap' }}>
                  {flight.general_comment || <span style={{ color: 'var(--text-secondary)' }}>No general comment.</span>}
                </div>
              )}
            </div>
          </div>
        )}"""

new_comments_tab_fd = """        {activeTab === 'comments' && (
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
        )}"""
fd_content = fd_content.replace(old_comments_tab_fd, new_comments_tab_fd)

with open('src/app/dashboard/flights/[id]/FlightDetails.tsx', 'w') as f:
    f.write(fd_content)

print("Done")
