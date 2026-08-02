require('dotenv').config({ path: '.env.local' });
const fetch = require('node-fetch');

async function run() {
    const q = `
  query GetTrainingDetails {
    trainings(
      first: 1
    ) {
      nodes {
        id
        status
        lecture {
          id
          name
          description
        }
      }
    }
  }
`;
    const res = await fetch('https://api.flightlogger.net/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 25950a41764cb3d168bd74cb7b9cb927` // wait, I don't have the API key. 
        },
        body: JSON.stringify({ query: q })
    });
    console.log(await res.text());
}
run();
