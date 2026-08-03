import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: profile } = await supabase.from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  const apiKey = profile.fl_api_key

  const GET_STUDENT_PROGRAMS_QUERY = `
    query GetStudentPrograms($studentId: Id!) {
      userPrograms(userIds: [$studentId], status: [ACTIVE], first: 5, all: true) {
        nodes {
          id
          name
          status
          program {
            id
          }
          programRevision {
            name
            programPhases {
              name
              lectures {
                id
                name
              }
            }
          }
        }
      }
    }
  `

  const res = await fetch('https://api.flightlogger.net/graphql', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: GET_STUDENT_PROGRAMS_QUERY, variables: { studentId: '80290' } })
  })
  const data = await res.json()
  console.log(JSON.stringify(data.data.userPrograms.nodes[0].programRevision.programPhases[0].lectures.slice(0, 2), null, 2))
}
run()
