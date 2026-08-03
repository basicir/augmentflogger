with open('src/components/FlightRecorderModal.tsx', 'r') as f:
    content = f.read()

old_modal_box = """<div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', height: activeTab === 'comments' ? '100%' : 'auto', marginBottom: '10vh', display: 'flex', flexDirection: 'column' }}>"""
new_modal_box = """<div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '85vh', height: activeTab === 'comments' ? '85vh' : 'auto', marginBottom: '10vh', display: 'flex', flexDirection: 'column' }}>"""
content = content.replace(old_modal_box, new_modal_box)

with open('src/components/FlightRecorderModal.tsx', 'w') as f:
    f.write(content)

print("Done")
