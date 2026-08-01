import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

export async function POST(request: Request) {
  try {
    const { studentIds } = (await request.json()) as { studentIds: string[] }
    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return NextResponse.json({ lastFlightDates: {} })
    }

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
      return NextResponse.json({ error: 'API key not configured' }, { status: 400 })
    }

    // Build the dynamic GraphQL query using aliases
    // IDs must be alphanumeric or follow field naming rules, we can prefix with 's_' and replace hyphens
    const aliasMap: Record<string, string> = {}
    const fields = studentIds
      .map((id) => {
        const safeAlias = `student_${id.replace(/[^a-zA-Z0-9]/g, '_')}`
        aliasMap[safeAlias] = id
        return `
          ${safeAlias}: user(id: "${id}") {
            id
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
        `
      })
      .join('\n')

    const query = `
      query GetLastFlights {
        ${fields}
      }
    `

    const flResponse = await fetch(FLIGHTLOGGER_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query }),
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

    const lastFlightDates: Record<string, string | null> = {}
    const data = flData.data || {}

    Object.keys(data).forEach((safeAlias) => {
      const originalId = aliasMap[safeAlias]
      if (originalId) {
        const u = data[safeAlias]
        const d1 = u?.firstFlights?.nodes?.[0]?.primaryLog?.startsAt || null
        const d2 = u?.lastFlights?.nodes?.[0]?.primaryLog?.startsAt || null
        
        let newestDate = null
        if (d1 && d2) {
          newestDate = new Date(d1) > new Date(d2) ? d1 : d2
        } else {
          newestDate = d1 || d2 || null
        }
        
        lastFlightDates[originalId] = newestDate
      }
    })

    return NextResponse.json({ lastFlightDates })
  } catch (error) {
    console.error('Error fetching last flown dates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
