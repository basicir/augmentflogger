import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

async function main() {
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

  let res = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ 
      query: query,
      variables: { studentId: "134966", programId: "2242" }
    })
  })
  
  let data = await res.json()
  const trainings = data.data.trainings.nodes
  console.log(`Total trainings in public API: ${trainings.length}`)
  
  const training352660 = trainings.find((t: any) => t.lecture?.id === "352660")
  console.log(`Training for 352660:`, training352660)

  const training352653 = trainings.find((t: any) => t.lecture?.id === "352653")
  console.log(`Training for 352653:`, training352653)
}
main()
