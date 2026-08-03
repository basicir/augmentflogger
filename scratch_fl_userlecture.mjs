import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

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
  const types = data.data.__schema.types.filter(t => t.name.toLowerCase().includes('lecture') || t.name.toLowerCase().includes('training') || t.name.toLowerCase().includes('program') || t.name.toLowerCase().includes('booking'))
  types.forEach(t => console.log(t.name, t.fields?.map(f => f.name).slice(0, 5)))
}
run()
