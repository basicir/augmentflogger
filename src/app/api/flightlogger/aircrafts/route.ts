import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_AIRCRAFTS_QUERY = `
  query GetAircrafts {
    aircraft(first: 100) {
      nodes {
        id
        callSign
      }
    }
  }
`

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('fl_api_key')
      .eq('id', user.id)
      .single()

    const apiKey = profile?.fl_api_key

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 400 }
      )
    }

    const flResponse = await fetch(FLIGHTLOGGER_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: GET_AIRCRAFTS_QUERY,
      }),
      // We can cache this for some time since aircrafts don't change very often, 
      // but next: { revalidate: 3600 } is a good practice.
      next: { revalidate: 3600 }
    })

    if (!flResponse.ok) {
      return NextResponse.json(
        { error: `FlightLogger API error: ${flResponse.statusText}` },
        { status: 502 }
      )
    }

    const flData = await flResponse.json()

    if (flData.errors) {
      return NextResponse.json({ error: flData.errors[0]?.message || 'GraphQL error' }, { status: 400 })
    }

    const rawAircrafts = flData.data?.aircraft?.nodes ?? []
    const aircrafts = rawAircrafts
      .map((a: { callSign?: string }) => a.callSign)
      .filter(Boolean)
      .sort()

    return NextResponse.json({ aircrafts })
  } catch (error) {
    console.error('FlightLogger proxy error fetching aircrafts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
