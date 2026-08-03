import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Flight } from '@/components/FlightList'
import LogbookTable from '@/components/LogbookTable'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'Aircraft Technical Logbook - AugmentFlogger',
}

export default async function LogbookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile for utc_offset and username
  const { data: profile } = await supabase
    .from('profiles')
    .select('utc_offset, username')
    .eq('id', user.id)
    .single()
    
  const utcOffsetHours = profile?.utc_offset || 0
  const fallbackUsername = user.user_metadata?.username || user.email?.split('@')[0] || 'instructor'
  const instructorUsername = profile?.username || fallbackUsername

  // Fetch all completed flights for the logged in instructor
  const { data: flights, error } = await supabase
    .from('flights')
    .select('*')
    .eq('instructor_id', user.id)
    .not('end_time', 'is', null)
    .order('start_time', { ascending: true }) // Sort ascending so they are chronological in the logbook

  if (error) {
    console.error('Error fetching flights:', error)
  }

  const typedFlights = (flights || []) as Flight[]

  // Group flights by Date and Aircraft
  // groupedFlights[dateKey][aircraft] = Flight[]
  const groupedFlights: Record<string, Record<string, Flight[]>> = {}

  typedFlights.forEach(flight => {
    const startMs = new Date(flight.start_time).getTime() + (utcOffsetHours * 60 * 60 * 1000)
    const localStart = new Date(startMs)
    const dateKey = `${localStart.getUTCFullYear()}-${(localStart.getUTCMonth()+1).toString().padStart(2, '0')}-${localStart.getUTCDate().toString().padStart(2, '0')}`
    
    const aircraft = flight.aircraft_registration || 'Unknown Aircraft'

    if (!groupedFlights[dateKey]) {
      groupedFlights[dateKey] = {}
    }
    if (!groupedFlights[dateKey][aircraft]) {
      groupedFlights[dateKey][aircraft] = []
    }
    
    groupedFlights[dateKey][aircraft].push(flight)
  })

  // Sort dates descending
  const sortedDates = Object.keys(groupedFlights).sort((a, b) => b.localeCompare(a))

  return (
    <div className="page-wrapper">
      <Navbar username={instructorUsername} />
      
      <main className="dashboard-layout" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
        <header style={{ marginBottom: '32px' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>Aircraft Technical Logbook</h1>
        </header>

      {(!flights || flights.length === 0) ? (
        <div style={{ 
          background: 'var(--bg-glass)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', 
          padding: '48px', textAlign: 'center', color: 'var(--text-secondary)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
          <h3>No flights recorded yet</h3>
          <p>Complete a flight to see logbook entries.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {sortedDates.map(dateKey => {
            const aircrafts = Object.keys(groupedFlights[dateKey]).sort()
            
            return aircrafts.map(aircraft => (
              <LogbookTable
                key={`${dateKey}-${aircraft}`}
                dateKey={dateKey}
                aircraft={aircraft}
                flights={groupedFlights[dateKey][aircraft]}
                instructorUsername={instructorUsername}
                utcOffsetHours={utcOffsetHours}
              />
            ))
          })}
        </div>
      )}
      </main>
    </div>
  )
}
