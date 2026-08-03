import { createClient } from '@supabase/supabase-js'

async function run() {
  const supabase = createClient('https://scxowkarwcjjhpysksio.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjeG93a2Fyd2NqamhweXNrc2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU1NjQ3MjMsImV4cCI6MjEwMTE0MDcyM30.gtqKhu0ZhvqGayBCy3Lan-N8q9cma1pSGE5GiKuQC5Q')
  
  // Actually, anon key might not have access to read fl_api_key. 
  // Let's use the service role key if possible. But I don't have it.
}
run()
