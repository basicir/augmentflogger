import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryKey = searchParams.get('key')

  let apiKey: string | null = queryKey

  if (!apiKey) {
    const supabase = await createClient()
    const { data: profile } = await supabase
      .from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
    apiKey = profile?.fl_api_key ?? null
  }

  if (!apiKey) return NextResponse.json({ error: 'No API key' }, { status: 400 })

  const query = `{
    userCategory: __type(name: "UserCategory") {
      name
      fields { name type { name kind ofType { name kind } } }
    }
    exercise: __type(name: "Exercise") {
      name
      fields { name type { name kind ofType { name kind } } }
    }
    gradedCompetency: __type(name: "GradedCompetency") {
      name
      fields { name type { name kind ofType { name kind } } }
    }
    training: __type(name: "Training") {
      name
      fields { name type { name kind ofType { name kind } } }
    }
    user: __type(name: "User") {
      name
      fields(includeDeprecated: false) { name type { name kind ofType { name kind } } }
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
