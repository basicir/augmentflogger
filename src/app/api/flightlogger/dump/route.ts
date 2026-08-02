import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  const apiKey = profile?.fl_api_key

  if (!apiKey) return NextResponse.json({ error: 'No API key found in db' }, { status: 400 })

  const query = `{
    __schema {
      types {
        name
        fields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                }
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
    body: JSON.stringify({ query }),
    cache: 'no-store',
  })

  const data = await res.json()
  return NextResponse.json(data)
}
