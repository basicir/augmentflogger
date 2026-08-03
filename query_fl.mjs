async function run() {
  const query = `
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
    headers: { 'Authorization': 'Bearer 7f695d9df5bded7e30aca3188f08705b', 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { studentId: '154208' } })
  })
  console.log(JSON.stringify(await res.json(), null, 2))
}
run()
