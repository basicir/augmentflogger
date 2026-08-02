const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envText = fs.readFileSync('.env.local', 'utf-8');
const SUPABASE_URL = envText.match(/NEXT_PUBLIC_SUPABASE_URL=(.*)/)?.[1];
const SUPABASE_KEY = envText.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.*)/)?.[1];

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql';

async function main() {
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('fl_api_key')
    .not('fl_api_key', 'is', null)
    .limit(1);

  if (error || !profiles || profiles.length === 0) {
    console.error('No API key found in Supabase.');
    return;
  }

  const apiKey = profiles[0].fl_api_key;
  
  const query = `
    query {
      users(first: 10) {
        nodes {
          id
          callSign
          userPrograms(first: 1, status: [ACTIVE]) {
            nodes {
              name
              programRevision {
                id
                name
                programPhases {
                  id
                  name
                  lectures {
                    id
                    name
                  }
                }
              }
              userCategories {
                id
                name
                exercises {
                  id
                  name
                  gradedCompetencies {
                    id
                    coreCompetencyName
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  console.log('Fetching data from FlightLogger...');
  const res = await fetch(FLIGHTLOGGER_GRAPHQL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({ query })
  });

  if (!res.ok) {
    console.error('Error from API:', await res.text());
    return;
  }

  const data = await res.json();
  fs.writeFileSync('dump.json', JSON.stringify(data, null, 2));
  console.log('Saved dump to dump.json. Check the file to see the structure!');
}

main();
