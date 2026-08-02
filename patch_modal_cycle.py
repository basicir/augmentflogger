import re

with open("src/components/FlightRecorderModal.tsx", "r") as f:
    content = f.read()

# 1. Update default values in useEffect
content = content.replace("setPilotFunction(ongoingFlight.pilot_function || 'DUAL')", "setPilotFunction(ongoingFlight.pilot_function || 'Not Specified')")
content = content.replace("setFlightRules(ongoingFlight.flight_rules || 'VFR')", "setFlightRules(ongoingFlight.flight_rules || 'Not Specified')")
content = content.replace("setTimeOfDay(ongoingFlight.time_of_day || 'DAY')", "setTimeOfDay(ongoingFlight.time_of_day || 'Not Specified')")
content = content.replace("setFlightType(ongoingFlight.flight_type || 'LOCAL')", "setFlightType(ongoingFlight.flight_type || 'Not Specified')")

# 2. Add fallback airports
fallback = """const FALLBACK_AIRPORTS = ["EPKR","EPML","EPRZ","LBHC","LHBC","LHBP","LHBS","LHBY","LHDB","LHDC","LHDK","LHEM","LHER","LHHO","LHJK","LHKE","LHKK","LHKM","LHMC","LHMR","LHNK","LHNY","LHPK","LHPP","LHPR","LHSA","LHSK","LHSM","LHSN","LHTJ","LHTL","LHUD","LHZK","LRAR","LRBM","LROD","LRSM","LRSN","LRTR","LZKC","LZKZ","LZSL","LZTT","ZZZZ"]

  useEffect(() => {"""
content = content.replace("  useEffect(() => {", fallback, 1)

# Modify fetchAirports
old_fetch_airports = """  useEffect(() => {
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
  }, [isModalOpen])"""

new_fetch_airports = """  useEffect(() => {
    const fetchAirports = async () => {
      try {
        const res = await fetch('/api/flightlogger/airports')
        if (res.ok) {
          const data = await res.json()
          if (data.airports && data.airports.length > 0) {
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
  }, [isModalOpen])"""
content = content.replace(old_fetch_airports, new_fetch_airports)

# 3. Add cycle functions
cycle_funcs = """  const cyclePilotFunction = () => {
    const opts = ['Not Specified', 'DUAL', 'PIC', 'SPIC', 'PICUS'];
    const idx = opts.indexOf(pilotFunction);
    setPilotFunction(opts[(idx + 1) % opts.length]);
  };
  const cycleFlightRules = () => {
    const opts = ['Not Specified', 'VFR', 'IFR', 'SVFR'];
    const idx = opts.indexOf(flightRules);
    setFlightRules(opts[(idx + 1) % opts.length]);
  };
  const cycleTimeOfDay = () => {
    const opts = ['Not Specified', 'DAY', 'NIGHT'];
    const idx = opts.indexOf(timeOfDay);
    setTimeOfDay(opts[(idx + 1) % opts.length]);
  };
  const cycleFlightType = () => {
    const opts = ['Not Specified', 'LOCAL', 'CROSS_COUNTRY'];
    const idx = opts.indexOf(flightType);
    setFlightType(opts[(idx + 1) % opts.length]);
  };
"""
content = content.replace("  const handleSave = async () => {", cycle_funcs + "\n  const handleSave = async () => {")

# 4. Replace UI elements for Pilot Function, Flight Rules, Time of Day, Flight Type
# We will use Regex to replace the whole <select> blocks with simple buttons

content = re.sub(
    r'<select value=\{pilotFunction\} onChange=\{e => setPilotFunction\(e.target.value\)\}.*?</select>',
    r'<button onClick={cyclePilotFunction} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'var(--radius-md)\', border: \'1px solid var(--border-default)\', background: \'var(--bg-elevated)\', color: \'white\', cursor: \'pointer\', textAlign: \'left\' }}>{pilotFunction}</button>',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<select value=\{flightRules\} onChange=\{e => setFlightRules\(e.target.value\)\}.*?</select>',
    r'<button onClick={cycleFlightRules} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'var(--radius-md)\', border: \'1px solid var(--border-default)\', background: \'var(--bg-elevated)\', color: \'white\', cursor: \'pointer\', textAlign: \'left\' }}>{flightRules}</button>',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<select value=\{timeOfDay\} onChange=\{e => setTimeOfDay\(e.target.value\)\}.*?</select>',
    r'<button onClick={cycleTimeOfDay} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'var(--radius-md)\', border: \'1px solid var(--border-default)\', background: \'var(--bg-elevated)\', color: \'white\', cursor: \'pointer\', textAlign: \'left\' }}>{timeOfDay}</button>',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<select value=\{flightType\} onChange=\{e => setFlightType\(e.target.value\)\}.*?</select>',
    r'<button onClick={cycleFlightType} style={{ width: \'100%\', padding: \'10px\', borderRadius: \'var(--radius-md)\', border: \'1px solid var(--border-default)\', background: \'var(--bg-elevated)\', color: \'white\', cursor: \'pointer\', textAlign: \'left\' }}>{flightType}</button>',
    content,
    flags=re.DOTALL
)

# 5. Make sure the buttons auto-save on change. Wait, button clicks don't auto-save to context unless updateFlight is called.
# It's better to update state and updateFlight at the same time in the cycle functions. Let's fix cycle functions to do both.

cycle_funcs_improved = """  const cyclePilotFunction = () => {
    const opts = ['Not Specified', 'DUAL', 'PIC', 'SPIC', 'PICUS'];
    const idx = opts.indexOf(pilotFunction);
    const next = opts[(idx + 1) % opts.length];
    setPilotFunction(next);
    updateFlight({ pilot_function: next });
  };
  const cycleFlightRules = () => {
    const opts = ['Not Specified', 'VFR', 'IFR', 'SVFR'];
    const idx = opts.indexOf(flightRules);
    const next = opts[(idx + 1) % opts.length];
    setFlightRules(next);
    updateFlight({ flight_rules: next });
  };
  const cycleTimeOfDay = () => {
    const opts = ['Not Specified', 'DAY', 'NIGHT'];
    const idx = opts.indexOf(timeOfDay);
    const next = opts[(idx + 1) % opts.length];
    setTimeOfDay(next);
    updateFlight({ time_of_day: next });
  };
  const cycleFlightType = () => {
    const opts = ['Not Specified', 'LOCAL', 'CROSS_COUNTRY'];
    const idx = opts.indexOf(flightType);
    const next = opts[(idx + 1) % opts.length];
    setFlightType(next);
    updateFlight({ flight_type: next });
  };
"""
content = content.replace(cycle_funcs, cycle_funcs_improved)

# 6. Remove X button
content = content.replace('<button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>', "")

# 7. Remove Save Parameters button
save_btn = """        <div style={{ padding: '16px', borderTop: '1px solid var(--border-default)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button 
            onClick={() => setIsModalOpen(false)}
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--bg-elevated)', color: 'white', cursor: 'pointer', fontWeight: 500 }}
          >
            Close
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            style={{ padding: '10px 20px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--primary)', color: 'black', cursor: saving ? 'not-allowed' : 'pointer', fontWeight: 600 }}
          >
            {saving ? 'Saving...' : 'Save Parameters'}
          </button>
        </div>"""
content = content.replace(save_btn, "")
# Wait, the close button is part of this block too. I will remove the whole div. Let me check if there's any other buttons in that div. No.

# Also remove `<button onClick={() => setIsModalOpen(false)} ...` from there? Let me replace it cleanly using regex if it doesn't match perfectly.
content = re.sub(
    r'<div style=\{\{ padding: \'16px\', borderTop: \'1px solid var\(--border-default\)\', display: \'flex\', justifyContent: \'flex-end\', gap: \'12px\' \}\}>.*?</button>\s*</div>',
    '',
    content,
    flags=re.DOTALL
)

with open("src/components/FlightRecorderModal.tsx", "w") as f:
    f.write(content)
