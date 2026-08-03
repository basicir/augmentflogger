const fs = require('fs');
const query = fs.readFileSync('/Users/szabobendeguz/Desktop/AugmentFlogger/full_query.graphql', 'utf8');
const script = fs.readFileSync('/Users/szabobendeguz/Desktop/scraper.js', 'utf8');

const newScript = script.replace(/const graphqlQuery = `[\s\S]*?`;/, 'const graphqlQuery = `\n' + query.replace(/`/g, '\\`').replace(/\$/g, '\\$') + '`;');

fs.writeFileSync('/Users/szabobendeguz/Desktop/scraper.js', newScript);
console.log('Script updated successfully');
