import * as fs from 'fs'
const envStr = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
for (const line of envStr.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '')
}

async function main() {
  const res = await fetch('http://localhost:3000/api/flightlogger/programs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentId: "154208" })
  })
  const json = await res.json()
  console.log(JSON.stringify(json, null, 2))
}
main()
