import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import StudentDetailClient from './StudentDetailClient'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_STUDENT_QUERY = `
  query GetStudentDetails($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      callSign
      avatarUrl
      firstFlights: flights(first: 1, all: true) {
        nodes {
          id
          startsAt
          departureAirport { name code }
          arrivalAirport { name code }
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
        }
      }
      lastFlights: flights(last: 1, all: true) {
        nodes {
          id
          startsAt
          departureAirport { name code }
          arrivalAirport { name code }
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
        }
      }
    }
  }
`

export default async function StudentPage({ params }: { params: { id: string } }) {
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
      variables: { id: params.id },
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
  
  if (flData.errors || !flData.data?.user) {
    console.error('GraphQL Error:', flData.errors)
    notFound()
  }

  const u = flData.data.user
  
  const f1 = u.firstFlights?.nodes?.[0]
  const f2 = u.lastFlights?.nodes?.[0]
  
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
