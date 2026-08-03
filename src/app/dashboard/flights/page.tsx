import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import FlightList, { Flight } from '@/components/FlightList'
import Navbar from '@/components/Navbar'

export const metadata = {
  title: 'My Flights - AugmentFlogger',
}

export default async function FlightsPage() {
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
    .order('start_time', { ascending: false })

  if (error) {
    console.error('Error fetching flights:', error)
  }

  return (
    <div className="page-wrapper">
      <Navbar username={instructorUsername} />
      
      <main className="dashboard-layout" style={{ maxWidth: '1000px', margin: '0 auto', paddingTop: '32px', paddingLeft: '16px', paddingRight: '16px' }}>
        <header style={{ marginBottom: '32px' }}>
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
        <FlightList flights={flights as Flight[]} utcOffsetHours={utcOffsetHours} />
        )}
      </main>
    </div>
  )
}
