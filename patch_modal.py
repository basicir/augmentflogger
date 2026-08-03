import re

with open('src/components/FlightRecorderModal.tsx', 'r') as f:
    content = f.read()

replacement = """
        let targetTaskName = '';
        for (const phase of prog.phases || []) {
          const t = phase.tasks.find((t: any) => t.taskId === selectedTask);
          if (t) {
            targetTaskName = t.taskName;
            break;
          }
        }

        const normalize = (s: string) => s.toLowerCase().replace(/[^\\w\\s]/g, '').split(/\\s+/).filter(Boolean);
        const lcsLength = (a: string[], b: string[]) => {
          const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
          for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
              if (a[i-1] === b[j-1]) {
                dp[i][j] = dp[i-1][j-1] + 1;
              } else {
                dp[i][j] = Math.max(dp[i-1][j], dp[i][j-1]);
              }
            }
          }
          return dp[a.length][b.length];
        };

        const targetWords = normalize(targetTaskName);
        let bestMatch = null;
        let bestScore = 0;

        for (const t of taskData as any[]) {
          const candidateWords = normalize(t.task_name || '');
          const score = lcsLength(targetWords, candidateWords);
          if (score > bestScore) {
            bestScore = score;
            bestMatch = t;
          }
        }
        
        const foundTask = bestMatch;
"""

content = content.replace("const foundTask = taskData.find((t: any) => t.task_id === selectedTask)", replacement.strip())

with open('src/components/FlightRecorderModal.tsx', 'w') as f:
    f.write(content)

print("Patched successfully")
