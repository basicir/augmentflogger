import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const SEARCH_USERS_QUERY = `
  query SearchUsers($callSign: String, $first: Int) {
    users(callSign: $callSign, first: $first) {
      nodes {
        id
        firstName
        lastName
        callSign
        avatarUrl
        lastFlights: flights(last: 1, all: true) {
          nodes {
            primaryLog {
              startsAt
            }
          }
        }
        firstFlights: flights(first: 1, all: true) {
          nodes {
            primaryLog {
              startsAt
            }
          }
        }
      }
    }
  }
`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { callSign, _testKey } = body as { callSign: string; _testKey?: string }

    // Get API key from Supabase profile (unless a test key was passed)
    let apiKey: string | null = null

    if (_testKey) {
      apiKey = _testKey
    } else {
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

      apiKey = profile?.fl_api_key ?? null
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add your FlightLogger API key in Settings.' },
        { status: 400 }
      )
    }

    // Handle test call (callSign '__TEST__') — just do a minimal query
    const variables = callSign === '__TEST__'
      ? { first: 1 }
      : { callSign, first: 10 }

    const flResponse = await fetch(FLIGHTLOGGER_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: SEARCH_USERS_QUERY,
        variables,
      }),
    })

    if (flResponse.status === 401 || flResponse.status === 403) {
      return NextResponse.json(
        { error: 'Invalid API key — FlightLogger rejected the request.' },
        { status: 400 }
      )
    }

    if (!flResponse.ok) {
      return NextResponse.json(
        { error: `FlightLogger API error: ${flResponse.statusText}` },
        { status: 502 }
      )
    }

    const flData = await flResponse.json()

    if (flData.errors) {
      const errorMsg = flData.errors[0]?.message ?? 'GraphQL error'
      // Check for auth errors
      if (errorMsg.toLowerCase().includes('unauthorized') || errorMsg.toLowerCase().includes('authentication')) {
        return NextResponse.json(
          { error: 'Invalid API key — FlightLogger rejected the request.' },
          { status: 400 }
        )
      }
      return NextResponse.json({ error: errorMsg }, { status: 400 })
    }

    const rawUsers = flData.data?.users?.nodes ?? []
    const users = rawUsers.map((u: any) => {
      const d1 = u.firstFlights?.nodes?.[0]?.primaryLog?.startsAt || null
      const d2 = u.lastFlights?.nodes?.[0]?.primaryLog?.startsAt || null
      
      let lastFlightDate = null
      if (d1 && d2) {
        lastFlightDate = new Date(d1) > new Date(d2) ? d1 : d2
      } else {
        lastFlightDate = d1 || d2 || null
      }

      return {
        id: u.id,
        firstName: u.firstName,
        lastName: u.lastName,
        callSign: u.callSign,
        avatarUrl: u.avatarUrl,
        lastFlightDate,
      }
    })
    return NextResponse.json({ users })
  } catch (error) {
    console.error('FlightLogger proxy error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
