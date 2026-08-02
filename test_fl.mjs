async function run() {
    const q = `
  query {
    __schema {
      queryType {
        fields {
          name
          type {
            name
          }
        }
      }
    }
  }
`;
    const res = await fetch('https://api.flightlogger.net/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 7f695d9df5bded7e30aca3188f08705b`
        },
        body: JSON.stringify({ query: q })
    });
    console.log(await res.text());
}
run();
