import { createClient } from '@supabase/supabase-js'

async function run() {
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
  console.log(query)
}
run()
