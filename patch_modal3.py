with open('src/components/FlightRecorderModal.tsx', 'r') as f:
    content = f.read()

# Replace modal-box style
old_modal_box = """<div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', marginBottom: '10vh', display: 'flex', flexDirection: 'column' }}>"""
new_modal_box = """<div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', height: activeTab === 'comments' ? '100%' : 'auto', marginBottom: '10vh', display: 'flex', flexDirection: 'column' }}>"""
content = content.replace(old_modal_box, new_modal_box)

with open('src/components/FlightRecorderModal.tsx', 'w') as f:
    f.write(content)

with open('src/app/dashboard/flights/[id]/FlightDetails.tsx', 'r') as f:
    fd_content = f.read()

old_fd_box = """<div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-default)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', minHeight: '600px' }}>"""
new_fd_box = """<div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-default)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', minHeight: '600px', height: activeTab === 'comments' ? '85vh' : 'auto' }}>"""
fd_content = fd_content.replace(old_fd_box, new_fd_box)

with open('src/app/dashboard/flights/[id]/FlightDetails.tsx', 'w') as f:
    f.write(fd_content)

print("Done")
