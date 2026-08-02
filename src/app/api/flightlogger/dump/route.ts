import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId')
  
  if (!studentId) return NextResponse.json({ error: 'Missing studentId param' }, { status: 400 })

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  const apiKey = profile?.fl_api_key

  if (!apiKey) return NextResponse.json({ error: 'No API key found in db' }, { status: 400 })

  const query = `query DebugStudent($studentId: String!) {
    user(id: $studentId) {
      id
      firstName
      lastName
      flights(last: 1, all: true) {
        nodes {
          id
          activityRegistration {
            __typename
            ... on Training {
              id
              name
              status
              comment
              failedPerformance
              lecture { id name }
              userCategories {
                name
                exercises { name grade comment }
                extraExercises { name grade comment }
              }
              userProgram {
                id
                program { name }
              }
            }
          }
        }
      }
    }
  }`

  const res = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ query, variables: { studentId } }),
    cache: 'no-store',
  })

  const data = await res.json()
  return NextResponse.json(data)
}
