import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import FlightDetails from './FlightDetails'
import { Flight } from '@/components/FlightList'

export const metadata = {
  title: 'Flight Details - AugmentFlogger',
}

export default async function FlightDetailsPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch user profile for utc_offset
  const { data: profile } = await supabase
    .from('profiles')
    .select('utc_offset')
    .eq('id', user.id)
    .single()
    
  const utcOffsetHours = profile?.utc_offset || 0

  // Fetch the specific flight
  const { data: flight, error } = await supabase
    .from('flights')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !flight) {
    console.error('Error fetching flight:', error)
    notFound()
  }

  // Double check authorization, it should belong to the instructor
  if (flight.instructor_id !== user.id) {
    notFound()
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px' }}>
        <Link href="/dashboard/flights" style={{ 
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
          <span>←</span> Back to Flights
        </Link>
      </header>
      
      <FlightDetails initialFlight={flight as Flight} utcOffsetHours={utcOffsetHours} />
    </div>
  )
}
