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
      users(first: 20) {
        nodes {
          userPrograms(first: 5, status: [ACTIVE]) {
            nodes {
              trainings(first: 5) {
                nodes {
                  id
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
  
  // Find a training that actually has userCategories
  let exampleTraining = null;
  if (rawData.data?.users?.nodes) {
    for (const u of rawData.data.users.nodes) {
      if (u.userPrograms?.nodes) {
        for (const p of u.userPrograms.nodes) {
          if (p.trainings?.nodes) {
            for (const t of p.trainings.nodes) {
              if (t.userCategories && t.userCategories.length > 0) {
                exampleTraining = t;
                break;
              }
            }
          }
          if (exampleTraining) break;
        }
      }
      if (exampleTraining) break;
    }
  }

  return NextResponse.json({ foundTraining: exampleTraining || 'No training with categories found in the first 20 users.', rawData })
}
