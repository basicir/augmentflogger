import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
const envStr = fs.readFileSync('.env.local', 'utf8')
const env: Record<string, string> = {}
for (const line of envStr.split('\n')) {
  const match = line.match(/^([^=]+)=(.*)$/)
  if (match) env[match[1]] = match[2].replace(/^["']|["']$/g, '')
}
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function main() {
  const { data, error } = await supabase.from('flights').select('programs_cache, selected_program, selected_task, student_id').order('created_at', { ascending: false }).limit(1).single()
  if (data) {
    const prog = data.programs_cache.find((p: any) => p.programName === data.selected_program)
    let task = null
    if (prog) {
      for (const phase of prog.phases) {
        task = phase.tasks.find((t: any) => t.taskId === data.selected_task)
        if (task) break
      }
    }
    console.log("Task UserLectureId:", task?.userLectureId)
    console.log("Program UserProgramId:", prog?.userProgramId)
    console.log("Task details:", JSON.stringify(task, null, 2))
  } else {
    console.log("Error:", error)
  }
}
main()
