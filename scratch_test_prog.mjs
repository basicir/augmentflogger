import fetch from 'node-fetch'
import 'dotenv/config'

async function run() {
  const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'
  const studentId = '154208' // or '80290'
  const apiKey = process.env.FLIGHTLOGGER_API_KEY // or I can get it from the DB
  console.log("running...")
}
run()
