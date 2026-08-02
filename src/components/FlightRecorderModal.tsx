'use client'

import { useState, useEffect } from 'react'
import { useFlightRecorder } from './FlightRecorderContext'
import { createClient } from '@/lib/supabase/client'

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
  
  const supabase = createClient()

  useEffect(() => {
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

  useEffect(() => {
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

  if (!isModalOpen || !ongoingFlight) return null

  const handleSave = async () => {
    await updateFlight({
      aircraft_registration: aircraft,
      pilot_function: pilotFunction,
      flight_rules: flightRules,
      time_of_day: timeOfDay,
      flight_type: flightType,
      departure_aerodrome: departure,
      destination_aerodrome: destination,
      desired_flight_time: desiredTime,
    })

    // Optionally save new aerodromes to profile
    const newRecent = new Set([...recentAerodromes, departure, destination].filter(Boolean))
    if (newRecent.size > recentAerodromes.length) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase.from('profiles').update({ recent_aerodromes: Array.from(newRecent) }).eq('id', user.id)
      }
    }
    setIsModalOpen(false)
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) setIsModalOpen(false) }}>
      <div className="modal-box" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="modal-header">
          <h2 className="modal-title">Flight Recorder - {ongoingFlight.student_name}</h2>
          <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
        </div>

        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Aircraft Registration</label>
            <select 
              value={aircraft} 
              onChange={e => setAircraft(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
            >
              <option value="">Select Aircraft</option>
              {availableAircraft.length === 0 ? (
                <option disabled>Loading...</option>
              ) : (
                availableAircraft.map(ac => (
                  <option key={ac} value={ac}>{ac}</option>
                ))
              )}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Pilot Function</label>
              <select value={pilotFunction} onChange={e => setPilotFunction(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="SPIC">SPIC</option>
                <option value="DUAL">DUAL</option>
                <option value="SOLO">SOLO</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Flight Rules</label>
              <select value={flightRules} onChange={e => setFlightRules(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="VFR">VFR</option>
                <option value="IFR">IFR</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Time of Day</label>
              <select value={timeOfDay} onChange={e => setTimeOfDay(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="DAY">DAY</option>
                <option value="NIGHT">NIGHT</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Flight Type</label>
              <select value={flightType} onChange={e => setFlightType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}>
                <option value="LOCAL">LOCAL</option>
                <option value="X-COUNTRY">X-COUNTRY</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Departure Aerodrome</label>
              <input 
                type="text" 
                list="recent-aero" 
                value={departure} 
                onChange={e => setDeparture(e.target.value.toUpperCase())}
                placeholder="e.g. LHBP"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Destination Aerodrome</label>
              <input 
                type="text" 
                list="recent-aero" 
                value={destination} 
                onChange={e => setDestination(e.target.value.toUpperCase())}
                placeholder="e.g. LHSM"
                style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
              />
            </div>
            <datalist id="recent-aero">
              {recentAerodromes.map(a => <option key={a} value={a} />)}
            </datalist>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Desired Flight Time (HH:MM)</label>
            <input 
              type="text" 
              value={desiredTime} 
              onChange={e => setDesiredTime(e.target.value)}
              placeholder="01:30"
              style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)', background: 'var(--bg-elevated)', color: 'white' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button 
              onClick={handleSave}
              style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
            >
              Save Parameters
            </button>
            <button 
              onClick={stopFlight}
              style={{ flex: 1, padding: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: 'var(--radius-md)', fontWeight: 600, cursor: 'pointer' }}
            >
              Stop Flight
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
