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
            const duration = `${hours}h ${mins}m`

            return (
              <div 
                key={flight.id} 
                style={{ 
                  background: 'var(--bg-glass)', 
                  border: '1px solid var(--border-default)', 
                  borderRadius: 'var(--radius-lg)', 
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                  <div>
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Link href={`/student/${flight.student_id}`} style={{ color: 'var(--primary)', textDecoration: 'none' }}>
                        {flight.student_name}
                      </Link>
                    </h3>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                      {start.toLocaleDateString()} • {start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {duration}
                    </div>
                    {flight.desired_flight_time && (
                      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                        Target: {flight.desired_flight_time}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                  {flight.aircraft_registration && (
                    <span style={{ background: 'var(--bg-elevated)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500 }}>
                      ✈️ {flight.aircraft_registration}
                    </span>
                  )}
                  {flight.departure_aerodrome && flight.destination_aerodrome && (
                    <span style={{ background: 'var(--bg-elevated)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 500 }}>
                      📍 {flight.departure_aerodrome} → {flight.destination_aerodrome}
                    </span>
                  )}
                  {flight.pilot_function && (
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600 }}>
                      {flight.pilot_function}
                    </span>
                  )}
                  {flight.flight_rules && (
                    <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'rgb(16, 185, 129)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600 }}>
                      {flight.flight_rules}
                    </span>
                  )}
                  {flight.time_of_day && (
                    <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'rgb(245, 158, 11)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600 }}>
                      {flight.time_of_day}
                    </span>
                  )}
                  {flight.flight_type && (
                    <span style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'rgb(139, 92, 246)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600 }}>
                      {flight.flight_type}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
