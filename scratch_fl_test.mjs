import { writeFileSync } from 'fs';

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
    
    const relevantTypes = data.data.__schema.types.filter(t => 
        t.name && !t.name.startsWith('__') && 
        t.fields && 
        (t.name.includes('Lecture') || t.name.includes('Training') || t.name.includes('Program') || t.name.includes('Phase'))
    );
    
    const result = relevantTypes.map(t => {
        return {
            name: t.name,
            fields: t.fields.map(f => f.name)
        };
    });
    
    console.log(JSON.stringify(result, null, 2));
}
run();
