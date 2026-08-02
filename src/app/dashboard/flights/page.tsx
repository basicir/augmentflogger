import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export const metadata = {
  title: 'My Flights - AugmentFlogger',
}

export default async function FlightsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all completed flights for the logged in instructor
  const { data: flights, error } = await supabase
    .from('flights')
    .select('*')
    .eq('instructor_id', user.id)
    .not('end_time', 'is', null)
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching flights:', error)
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <Link href="/" className="back-btn" style={{ 
          background: 'var(--bg-glass)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-full)', 
          padding: '8px 16px', 
          textDecoration: 'none', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>←</span> Back to Dashboard
        </Link>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>Recorded Flights</h1>
      </header>

      {(!flights || flights.length === 0) ? (
        <div style={{ 
          background: 'var(--bg-glass)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', 
          padding: '48px', textAlign: 'center', color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
          <h3>No flights recorded yet</h3>
          <p>Start a flight from a student&apos;s profile page.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {flights.map((flight) => {
            const start = new Date(flight.start_time)
            const end = new Date(flight.end_time)
            const diffMs = end.getTime() - start.getTime()
            const diffMins = Math.round(diffMs / 60000)
            const hours = Math.floor(diffMins / 60)
            const mins = diffMins % 60
            
            const monthShort = start.toLocaleString('en-US', { month: 'short' }).toUpperCase()
            const day = start.getDate()
            const year = start.getFullYear()
            
            const depTime = start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
            const arrTime = end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false})
            
            const durationFormatted = `${hours}:${mins.toString().padStart(2, '0')}`

            return (
              <Link 
                href={`/student/${flight.student_id}`}
                key={flight.id} 
                style={{ 
                  backgroundColor: '#182A45',
                  color: '#ffffff',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  fontFamily: 'sans-serif',
                  textDecoration: 'none',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
              >
                {/* Left Date Section */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '60px', paddingRight: '16px' }}>
                  <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.05em' }}>{monthShort}</div>
                  <div style={{ fontSize: '20px', fontWeight: 800, margin: '2px 0' }}>{day}</div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>{year}</div>
                </div>

                {/* Vertical Divider */}
                <div style={{ width: '1px', backgroundColor: '#334155', height: '50px', marginRight: '16px' }}></div>

                {/* Main Content */}
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'stretch' }}>
                  
                  {/* Departure Side */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '60px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>{depTime}</div>
                    <div style={{ fontSize: '12px', fontWeight: 500 }}>{flight.departure_aerodrome || 'N/A'}</div>
                  </div>

                  {/* Center Flight Info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 16px', justifyContent: 'center' }}>
                    <div style={{ fontSize: '11px', marginBottom: '6px', color: '#E2E8F0', textAlign: 'center' }}>
                      {flight.aircraft_registration || 'Unknown'} {flight.aircraft_type ? `(${flight.aircraft_type})` : ''}
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '8px' }}>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#475569' }}></div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '-4px' }}>
                        <span style={{ fontSize: '14px', transform: 'rotate(45deg)', display: 'inline-block' }}>✈️</span>
                        <span style={{ fontSize: '10px', fontWeight: 700, marginTop: '2px' }}>{durationFormatted}</span>
                      </div>
                      <div style={{ flex: 1, height: '1px', backgroundColor: '#475569' }}></div>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
                      {flight.pilot_function && (
                        <span style={{ backgroundColor: '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                          {flight.pilot_function}
                        </span>
                      )}
                      {flight.flight_rules && (
                        <span style={{ backgroundColor: '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                          {flight.flight_rules}
                        </span>
                      )}
                      {flight.time_of_day && (
                        <span style={{ backgroundColor: '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                          {flight.time_of_day === 'Day' ? '☀️' : (flight.time_of_day === 'Night' ? '🌙' : flight.time_of_day)}
                        </span>
                      )}
                      {flight.flight_type && (
                        <span style={{ backgroundColor: '#64748B', color: 'white', padding: '2px 6px', borderRadius: '8px', fontSize: '9px', fontWeight: 700 }}>
                          {flight.flight_type}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrival Side */}
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-end', width: '80px' }}>
                    <div style={{ fontSize: '10px', color: '#94A3B8' }}>(UTC+00:00)</div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 'auto', marginBottom: 'auto' }}>
                       <div style={{ fontSize: '18px', fontWeight: 700, lineHeight: 1.2 }}>{arrTime}</div>
                       <div style={{ fontSize: '12px', fontWeight: 500 }}>{flight.destination_aerodrome || 'N/A'}</div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#E2E8F0', marginTop: 'auto' }}>
                      {flight.organization || 'TRENER'}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
