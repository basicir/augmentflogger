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
    query {
      trainings(first: 200, all: true, status: [NOT_FLOWN]) {
        nodes {
          id
          status
          lecture { id name }
          userCategories {
            id
            name
            exercises {
              id
              name
              gradedCompetencies {
                id
                coreCompetencyName
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ query }),
    cache: 'no-store',
  })

  const rawData = await res.json()
  
  // Find a training that actually has gradedCompetencies
  let exampleTraining = null;
  if (rawData.data?.trainings?.nodes) {
    for (const t of rawData.data.trainings.nodes) {
      if (t.userCategories && t.userCategories.length > 0) {
        let hasCompetencies = false;
        for (const cat of t.userCategories) {
          if (cat.exercises) {
            for (const ex of cat.exercises) {
              if (ex.gradedCompetencies && ex.gradedCompetencies.length > 0) {
                hasCompetencies = true;
                break;
              }
            }
          }
          if (hasCompetencies) break;
        }
        if (hasCompetencies) {
          exampleTraining = t;
          break;
        }
      }
    }
  }

  return NextResponse.json({ 
    foundTraining: exampleTraining || 'No training with CBTA competencies found in the first 200 trainings. Try increasing the limit or checking if your program uses CBTA.', 
    rawData 
  })
}
