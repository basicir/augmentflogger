import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentDetailClient from './StudentDetailClient'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_STUDENT_QUERY = `
  query GetStudentDetails($id: String!) {
    user(id: $id) {
      id
      firstName
      lastName
      callSign
      avatarUrl
      firstFlights: flights(first: 1, all: true) {
        nodes {
          id
          departureAirport { name }
          arrivalAirport { name }
          activityRegistration {
            __typename
            ... on Training {
              id
              name
              status
              comment
              instructor { firstName lastName }
              userCategories {
                name
                exercises {
                  name
                  grade
                  comment
                  gradedCompetencies {
                    coreCompetencyName
                    grade
                  }
                }
              }
            }
          }
          primaryLog {
            startsAt
          }
        }
      }
      lastFlights: flights(last: 1, all: true) {
        nodes {
          id
          departureAirport { name }
          arrivalAirport { name }
          activityRegistration {
            __typename
            ... on Training {
              id
              name
              status
              comment
              instructor { firstName lastName }
              userCategories {
                name
                exercises {
                  name
                  grade
                  comment
                  gradedCompetencies {
                    coreCompetencyName
                    grade
                  }
                }
              }
            }
          }
          primaryLog {
            startsAt
          }
        }
      }
    }
  }
`

export default async function StudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('fl_api_key')
    .eq('id', user.id)
    .single()

  const apiKey = profile?.fl_api_key

  if (!apiKey) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>API Key Missing</h2>
        <p>Please configure your FlightLogger API key in Settings.</p>
      </div>
    )
  }

  const flResponse = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      query: GET_STUDENT_QUERY,
      variables: { id },
    }),
    cache: 'no-store'
  })

  if (!flResponse.ok) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Error loading student</h2>
        <p>FlightLogger API responded with status {flResponse.status}</p>
      </div>
    )
  }

  const flData = await flResponse.json()

  // Only bail out if there is genuinely no user object.
  if (!flData.data?.user) {
    console.error('GraphQL Error (no user data):', flData.errors)
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <h2>Student not found</h2>
        <p>This student could not be loaded from FlightLogger.</p>
        {flData.errors?.[0]?.message && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{flData.errors[0].message}</p>
        )}
      </div>
    )
  }

  if (flData.errors) {
    console.warn('GraphQL partial errors:', flData.errors)
  }

  const u = flData.data.user

  // Flatten into the FlightData shape StudentDetailClient expects.
  // departureAirport/arrivalAirport/activityRegistration are on Flight directly;
  // startsAt is on Flight.primaryLog (FlightLog type).
  const toFlightData = (node: {
    id: string
    departureAirport?: { name: string } | null
    arrivalAirport?: { name: string } | null
    activityRegistration?: unknown
    primaryLog?: { startsAt?: string } | null
  } | null) => {
    if (!node) return null
    return {
      id: node.id,
      startsAt: node.primaryLog?.startsAt ?? '',
      departureAirport: node.departureAirport ?? null,
      arrivalAirport: node.arrivalAirport ?? null,
      activityRegistration: (node.activityRegistration as { __typename: string } | null) ?? null,
    }
  }

  const f1 = toFlightData(u.firstFlights?.nodes?.[0] ?? null)
  const f2 = toFlightData(u.lastFlights?.nodes?.[0] ?? null)

  let lastFlight = null
  if (f1 && f2) {
    lastFlight = new Date(f1.startsAt) > new Date(f2.startsAt) ? f1 : f2
  } else {
    lastFlight = f1 || f2 || null
  }

  const studentData = {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    callSign: u.callSign,
    avatarUrl: u.avatarUrl,
  }

  return (
    <main>
      <StudentDetailClient student={studentData} lastFlight={lastFlight} />
    </main>
  )
}
