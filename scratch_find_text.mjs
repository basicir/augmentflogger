async function run() {
    const q = `
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
`;
    const res = await fetch('https://api.flightlogger.net/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 7f695d9df5bded7e30aca3188f08705b`
        },
        body: JSON.stringify({ query: q })
    });
    
    const data = await res.json();
    
    const keywords = ['comment', 'remark', 'detail', 'content', 'text', 'instruction', 'summary', 'note', 'html', 'body'];
    
    const typesWithText = data.data.__schema.types.filter(t => 
        t.name && !t.name.startsWith('__') && 
        t.fields && 
        t.fields.some(f => keywords.some(k => f.name.toLowerCase().includes(k)))
    );
    
    const result = typesWithText.map(t => {
        return {
            name: t.name,
            fields: t.fields.filter(f => keywords.some(k => f.name.toLowerCase().includes(k))).map(f => f.name)
        };
    });
    
    console.log(JSON.stringify(result, null, 2));
}
run();
