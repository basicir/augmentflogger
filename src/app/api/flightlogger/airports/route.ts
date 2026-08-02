import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_PAST_AIRPORTS_QUERY = `
  query GetPastAirports {
    flights(first: 100, all: true) {
      nodes {
        departureAirport {
          name
        }
        arrivalAirport {
          name
        }
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
        query: GET_PAST_AIRPORTS_QUERY,
      }),
      next: { revalidate: 300 } // Cache for 5 minutes
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

    const rawFlights = flData.data?.flights?.nodes ?? []
    const airportsSet = new Set<string>()

    rawFlights.forEach((f: { departureAirport?: { name: string } | null; arrivalAirport?: { name: string } | null }) => {
      if (f.departureAirport?.name) {
        airportsSet.add(f.departureAirport.name)
      }
      if (f.arrivalAirport?.name) {
        airportsSet.add(f.arrivalAirport.name)
      }
    })

    const airports = Array.from(airportsSet).sort()

    return NextResponse.json({ airports })
  } catch (error) {
    console.error('FlightLogger proxy error fetching airports:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
