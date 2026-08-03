import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const studentId = searchParams.get('studentId') || '145581'

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase.from('profiles').select('fl_api_key').eq('id', user.id).single()
    const apiKey = profile?.fl_api_key

    const query = `
      query GetStudentPrograms($studentId: Id!) {
        userPrograms(userIds: [$studentId], status: [ACTIVE], first: 5, all: true) {
          nodes {
            id
            userLectures(first: 500, all: true) {
              nodes {
                id
                lecture { id }
              }
            }
          }
        }
      }
    `
    const flResponse = await fetch('https://api.flightlogger.net/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({ query, variables: { studentId } })
    })
    return NextResponse.json(await flResponse.json())
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
