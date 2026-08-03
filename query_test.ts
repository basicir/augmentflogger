import { createClient } from '@supabase/supabase-js'

async function run() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { data: profile } = await supabase.from('profiles').select('fl_api_key').not('fl_api_key', 'is', null).limit(1).single()
  const apiKey = profile?.fl_api_key
  if (!apiKey) { console.log('no api key'); return }

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
  const res = await fetch('https://api.flightlogger.net/graphql', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  })
  console.log(JSON.stringify(await res.json(), null, 2))
}
run()
