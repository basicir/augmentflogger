import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'

const envStr = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
for (const line of envStr.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '')
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
// Wait, I don't have SUPABASE_SERVICE_ROLE_KEY!
// I can't read the profiles table directly without it.
