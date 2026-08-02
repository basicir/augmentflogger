import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId') || '134966'
  const programId = searchParams.get('programId') || '2242'

  const supabase = await createClient()
  const { data: profile } = await supabase.from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  const apiKey = profile?.fl_api_key

  const query = `
    query GetTrainingDetails($studentId: Id!, $programId: Id!) {
      trainings(
        userIds: [$studentId], 
        programIds: [$programId], 
        first: 1000, 
        all: true
      ) {
        nodes {
          id
          status
          lecture {
            id
            name
          }
        }
      }
    }
  `

  const flResponse = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ query, variables: { studentId, programId } })
  })

  const flData = await flResponse.json()
  return NextResponse.json(flData)
}
