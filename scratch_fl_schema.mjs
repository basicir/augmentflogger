import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  const { data: profile } = await supabase.from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  const apiKey = profile.fl_api_key

  const query = `
  query {
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
    body: JSON.stringify({ query })
  })
  const data = await res.json()
  fs.writeFileSync('schema.json', JSON.stringify(data, null, 2))
}
run()
