import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_STUDENT_PROGRAMS_QUERY = `
  query GetStudentPrograms($studentId: Id!) {
    userPrograms(userIds: [$studentId], status: [ACTIVE], first: 5) {
      nodes {
        name
        status
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
        trainings(first: 100, all: true) {
          nodes {
            status
            lecture {
              id
            }
          }
        }
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
      return NextResponse.json({ error: flData.errors[0]?.message || 'GraphQL error' }, { status: 400 })
    }

    // Define types for the GraphQL response to avoid 'any'
    interface LectureData {
      id: string;
      name?: string;
    }
    interface TrainingData {
      status: string;
      lecture?: LectureData;
    }
    interface PhaseData {
      name: string;
      lectures?: LectureData[];
    }
    interface ProgramData {
      name: string;
      status: string;
      programRevision?: {
        programPhases?: PhaseData[];
      };
      trainings?: {
        nodes: TrainingData[];
      };
    }

    // Format the response just like the script
    const programs = (flData.data?.userPrograms?.nodes || []).map((up: ProgramData) => {
      const completedLectures: Record<string, string> = {};
      if (up.trainings && up.trainings.nodes) {
        up.trainings.nodes.forEach((t: TrainingData) => {
          if (t.lecture) {
            completedLectures[t.lecture.id] = t.status;
          }
        });
      }

      const phases = up.programRevision?.programPhases?.map((phase: PhaseData) => ({
        phaseName: phase.name,
        tasks: phase.lectures?.map((lecture: LectureData) => ({
          taskId: lecture.id,
          taskName: lecture.name,
          status: completedLectures[lecture.id] || "PENDING"
        })) || []
      })) || [];

      return {
        programName: up.name,
        status: up.status,
        phases: phases
      };
    });

    return NextResponse.json({ programs })
  } catch (error) {
    console.error('FlightLogger proxy error fetching programs:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
