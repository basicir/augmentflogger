import re

with open('src/components/FlightRecorderModal.tsx', 'r') as f:
    content = f.read()

# 1. Add viewportHeight state
state_search = "const [availableAircraft, setAvailableAircraft] = useState<string[]>([])"
state_replacement = """const [availableAircraft, setAvailableAircraft] = useState<string[]>([])
  
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
  }, []);"""
content = content.replace(state_search, state_replacement)

# 2. Update modal-box style
old_modal_style = """<div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: '85dvh', height: activeTab === 'comments' ? '85dvh' : 'auto', marginBottom: '10dvh', display: 'flex', flexDirection: 'column' }}>"""
new_modal_style = """<div className="modal-box" style={{ maxWidth: '600px', width: '100%', maxHeight: `${viewportHeight * 0.85}px`, height: activeTab === 'comments' ? `${viewportHeight * 0.85}px` : 'auto', marginBottom: `${viewportHeight * 0.10}px`, display: 'flex', flexDirection: 'column' }}>"""
content = content.replace(old_modal_style, new_modal_style)

with open('src/components/FlightRecorderModal.tsx', 'w') as f:
    f.write(content)

with open('src/app/dashboard/flights/[id]/FlightDetails.tsx', 'r') as f:
    fd_content = f.read()

fd_state_search = "const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})"
fd_state_replacement = """const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})

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
  }, []);"""
if "const [viewportHeight" not in fd_content:
    fd_content = fd_content.replace(fd_state_search, fd_state_replacement)

old_fd_style = """<div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-default)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', minHeight: '600px', height: activeTab === 'comments' ? '85dvh' : 'auto' }}>"""
new_fd_style = """<div style={{ maxWidth: '800px', margin: '0 auto', background: 'var(--bg-default)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column', minHeight: '600px', height: activeTab === 'comments' ? `${viewportHeight * 0.85}px` : 'auto' }}>"""
fd_content = fd_content.replace(old_fd_style, new_fd_style)

with open('src/app/dashboard/flights/[id]/FlightDetails.tsx', 'w') as f:
    f.write(fd_content)

print("Done")
