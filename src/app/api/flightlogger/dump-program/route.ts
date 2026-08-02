import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

export async function GET(request: Request) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()

  const apiKey = profile?.fl_api_key
  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 400 })

  const query = `
    query UserLecture_fetchExistingUserLecture($userLectureId: String!) {
      userLecture(id: $userLectureId) {
        id
        title
        categories {
          name
          exercises {
            name
            gradedCompetencies {
              coreCompetencyId
            }
          }
        }
      }
    }
  `

  const res = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ 
      query: query,
      variables: { userLectureId: "8439502" } // The ID from the user's dump
    }),
    cache: 'no-store',
  })

  const rawData = await res.json()

  return NextResponse.json({ 
    foundTraining: 'Testing internal query', 
    rawData 
  })
}
