import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

async function main() {
  const envStr = fs.readFileSync('.env.local', 'utf8')
  const env: Record<string, string> = {}
  for (const line of envStr.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '')
  }
  const token = env.FLIGHTLOGGER_API_TOKEN || "your_token_here"
  
  // We need to fetch from FL API directly
  // We don't have the token directly, wait, does env have FLIGHTLOGGER_API_TOKEN?
  console.log("Token exists:", !!env.FLIGHTLOGGER_API_TOKEN)
  
  const query = `
    query GetStudentPrograms($studentId: Id!) {
      userPrograms(userIds: [$studentId], status: [ACTIVE], first: 1) {
        nodes {
          id
          name
          programRevision {
            programPhases {
              name
              lectures {
                id
                name
              }
            }
          }
          trainings(first: 5, all: true) {
            nodes {
              id
              lecture { id name }
            }
          }
        }
      }
    }
  `;
  
  const res = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.FLIGHTLOGGER_API_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query, variables: { studentId: "154208" } }) // using the student ID from the user's message
  })
  
  const json = await res.json()
  console.log(JSON.stringify(json, null, 2))
}
main()
