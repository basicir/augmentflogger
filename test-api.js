const http = require('http');
const req = http.request('http://127.0.0.1:3000/api/flightlogger/programs', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, '\nBody:', data));
});
req.write(JSON.stringify({ studentId: '154208' }));
req.end();
