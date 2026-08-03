import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_STUDENT_PROGRAMS_QUERY = `
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
`

const TEST_QUERY = `
  query GetUserLectures($studentId: Id!) {
    userLectures(userId: $studentId, first: 50, all: true) {
      nodes {
        id
        lecture { id }
      }
    }
  }
`

const GET_TRAININGS_QUERY = `
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
`

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { studentId } = body as { studentId: string }

    if (!studentId) {
      return NextResponse.json({ error: 'Missing studentId' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('fl_api_key')
      .eq('id', user.id)
      .single()

    const apiKey = profile?.fl_api_key

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 400 }
      )
    }

    const flResponse = await fetch(FLIGHTLOGGER_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: GET_STUDENT_PROGRAMS_QUERY,
        variables: { studentId }
      })
    })

    if (!flResponse.ok) {
      return NextResponse.json(
        { error: `FlightLogger API error: ${flResponse.statusText}` },
        { status: 502 }
      )
    }

    const flData = await flResponse.json()

    if (flData.errors) {
      console.error("GraphQL errors:", JSON.stringify(flData.errors, null, 2))
      return NextResponse.json({ error: 'GraphQL error', details: flData.errors }, { status: 400 })
    }

    // Temporary INTROSPECTION to find UserLecture
    const introRes = await fetch(FLIGHTLOGGER_GRAPHQL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        query: `
          query {
            __schema {
              queryType {
                fields {
                  name
                  type { name }
                }
              }
            }
          }
        `
      })
    })
    const introData = await introRes.json()
    return NextResponse.json({ error: 'Introspection', details: introData }, { status: 400 })

    // Fetch all trainings with pagination
    let allTrainings: any[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const tRes: Response = await fetch(FLIGHTLOGGER_GRAPHQL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
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

    // Define types for the GraphQL response to avoid 'any'
    interface LectureData {
      id: string;
      name?: string;
    }
    interface TrainingData {
      id: string;
      status: string;
      lecture?: LectureData;
    }
    interface PhaseData {
      name: string;
      lectures?: LectureData[];
    }
    interface ProgramData {
      id: string;
      name: string;
      status: string;
      userLectures?: {
        nodes: {
          id: string;
          status: string;
          lecture: {
            id: string;
          }
        }[];
      };
      programRevision?: {
        programPhases?: PhaseData[];
      };
      program?: {
        id: string;
      };
    }

    const decodeId = (base64Id: string) => {
      if (!base64Id) return base64Id;
      try {
        const decoded = atob(base64Id);
        const match = decoded.match(/--(\d+)$/);
        return match ? match[1] : base64Id;
      } catch (e) {
        return base64Id;
      }
    };

    const programs = (flData.data?.userPrograms?.nodes || []).map((up: ProgramData) => {
      const completedLectures: Record<string, string> = {};
      const userLectureIds: Record<string, string> = {};
      
      const specificUserLectureIds: Record<string, string> = {};
      if (up.userLectures?.nodes) {
        up.userLectures.nodes.forEach(ul => {
          if (ul.lecture?.id) {
            specificUserLectureIds[ul.lecture.id] = decodeId(ul.id);
          }
        });
      }

      const programTrainings = allTrainings.filter(t => t.userProgram?.id === up.id);
      programTrainings.forEach((t: any) => {
        if (t.lecture) {
          completedLectures[t.lecture.id] = t.status;
          userLectureIds[t.lecture.id] = t.id;
        }
      });

      const phases = up.programRevision?.programPhases?.map((phase: PhaseData) => ({
        phaseName: phase.name,
        tasks: phase.lectures?.map((lecture: LectureData) => ({
          taskId: lecture.id,
          taskName: lecture.name,
          userLectureId: specificUserLectureIds[lecture.id] || (userLectureIds[lecture.id] ? decodeId(userLectureIds[lecture.id]) : null),
          status: completedLectures[lecture.id] || "PENDING"
        })).reverse() || []
      })).reverse() || [];

      return {
        userProgramId: decodeId(up.id),
        programId: up.program?.id || up.id,
        programName: up.name,
        status: up.status,
        phases: phases
      };
    });

    return NextResponse.json({ programs })
  } catch (error: any) {
    console.error('FlightLogger proxy error fetching programs:', error)
    return NextResponse.json({ error: String(error), stack: error.stack }, { status: 500 })
  }
}
