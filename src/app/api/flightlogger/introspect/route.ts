import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('fl_api_key').eq('id', user.id).single()
    const apiKey = profile?.fl_api_key

    const query = `
    query {
      __type(name: "UserProgram") {
        fields {
          name
          type {
            name
            kind
            ofType { name kind }
          }
        }
      }
    }
    `
    const flResponse = await fetch('https://api.flightlogger.net/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ query })
    })
    return NextResponse.json(await flResponse.json())
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
