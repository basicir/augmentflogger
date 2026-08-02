import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const envContent = fs.readFileSync('.env.local', 'utf-8')
const env = envContent.split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=')
  if (key && key.trim() && !key.startsWith('#')) {
    acc[key.trim()] = val.join('=').trim().replace(/(^"|"$)/g, '')
  }
  return acc
}, {})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)
const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

async function main() {
  const { data: profile, error } = await supabase.from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  if (error) {
    console.error("Supabase error:", error)
    return
  }
  const apiKey = profile?.fl_api_key
  if (!apiKey) {
    console.error("No API key found in profiles.")
    return
  }

  const query = `
    query GetTrainingDetails($studentId: Id!) {
      trainings(
        userIds: [$studentId], 
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
      variables: { studentId: "134966" }
    })
  })
  
  let data = await res.json()
  if (data.errors) {
    console.error("GraphQL errors:", data.errors)
    return
  }
  const trainings = data.data.trainings.nodes
  console.log(`Total trainings in public API: ${trainings.length}`)
  
  const training352660 = trainings.find((t) => t.lecture?.id === "352660")
  console.log(`Training for 352660:`, training352660)

  const training352653 = trainings.find((t) => t.lecture?.id === "352653")
  console.log(`Training for 352653:`, training352653)
}
main()
