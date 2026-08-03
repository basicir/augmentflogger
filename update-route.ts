import * as fs from 'fs';

const file = fs.readFileSync('src/app/api/flightlogger/programs/route.ts', 'utf8');

const newCode = file.replace(
  /const GET_STUDENT_PROGRAMS_QUERY = `[\s\S]*?`;/,
  `const GET_STUDENT_PROGRAMS_QUERY = \`
  query GetStudentPrograms($studentId: Id!) {
    userPrograms(userIds: [$studentId], status: [ACTIVE], first: 5, all: true) {
      nodes {
        id
        name
        status
        program {
          id
        }
        programRevision {
          name
          programPhases {
            name
            lectures {
              id
              name
            }
          }
        }
      }
    }
  }
\`;

const GET_TRAININGS_QUERY = \`
  query GetTrainings($studentId: Id!, $cursor: String) {
    trainings(userIds: [$studentId], first: 100, after: $cursor, all: true) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        status
        lecture { id }
        userProgram { id }
      }
    }
  }
\`;`
).replace(
  /const flData = await flRes\.json\(\)[\s\S]*?const programs = \(flData\.data\?\.userPrograms\?\.nodes \|\| \[\]\)\.map\(\(up: ProgramData\) => \{/,
  `const flData = await flRes.json()

    if (flData.errors) {
      console.error('GraphQL errors:', flData.errors)
      return NextResponse.json({ error: 'GraphQL error fetching programs' }, { status: 500 })
    }

    // Fetch all trainings with pagination
    let allTrainings: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const tRes = await fetch(FLIGHTLOGGER_GRAPHQL, {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${apiKey}\`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: GET_TRAININGS_QUERY,
          variables: { studentId, cursor }
        })
      });
      const tData = await tRes.json();
      if (tData.errors || !tData.data?.trainings) break;
      
      const trainingsConnection = tData.data.trainings;
      allTrainings = allTrainings.concat(trainingsConnection.nodes || []);
      hasNextPage = trainingsConnection.pageInfo?.hasNextPage;
      cursor = trainingsConnection.pageInfo?.endCursor;
    }

    const decodeId = (base64Id: string) => {
      if (!base64Id) return base64Id;
      try {
        const decoded = atob(base64Id);
        const match = decoded.match(/--(\\d+)$/);
        return match ? match[1] : base64Id;
      } catch (e) {
        return base64Id;
      }
    };

    const programs = (flData.data?.userPrograms?.nodes || []).map((up: ProgramData) => {
      const completedLectures: Record<string, string> = {};
      const userLectureIds: Record<string, string> = {};

      // Filter trainings that belong to this program
      const programTrainings = allTrainings.filter(t => t.userProgram?.id === up.id);

      programTrainings.forEach((t: any) => {
        if (t.lecture) {
          completedLectures[t.lecture.id] = t.status;
          userLectureIds[t.lecture.id] = t.id;
        }
      });
`
).replace(
  /if \(up\.trainings && up\.trainings\.nodes\) \{[\s\S]*?\}\n/,
  ''
);

fs.writeFileSync('src/app/api/flightlogger/programs/route.ts', newCode);
