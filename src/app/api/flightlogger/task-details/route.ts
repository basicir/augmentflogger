import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FLIGHTLOGGER_GRAPHQL = 'https://api.flightlogger.net/graphql'

const GET_TRAINING_DETAILS_QUERY = `
  query GetTrainingDetails($studentId: Id!, $programId: Id!) {
    trainings(
      userIds: [$studentId], 
      programIds: [$programId], 
      first: 200, 
      all: true
    ) {
      nodes {
        id
        status
        lecture {
          id
          name
        }
        userCategories {
          id
          name
          exercises {
            id
            name
          }
        }
      }
    }
  }
`

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const studentId = searchParams.get('studentId')
  const programId = searchParams.get('programId')
  const lectureId = searchParams.get('lectureId')

  if (!studentId || !programId || !lectureId) {
    return NextResponse.json(
      { error: 'studentId, programId, and lectureId are required' },
      { status: 400 }
    )
  }

  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile, error: tsError } = await supabase
      .from('profiles')
      .select('fl_api_key')
      .eq('id', user.id)
      .single()

    const apiKey = profile?.fl_api_key

    if (tsError || !apiKey) {
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
        query: GET_TRAINING_DETAILS_QUERY,
        variables: { studentId, programId }
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

    const trainings = flData.data?.trainings?.nodes || []
    const matchingTraining = trainings.find((t: any) => t.lecture?.id === lectureId)

    if (!matchingTraining) {
      return NextResponse.json(
        { error: 'Training not found for this lecture' },
        { status: 404 }
      )
    }

    // Extract all exercises flatly
    const exercises: { id: string, name: string, categoryName: string }[] = []
    
    if (matchingTraining.userCategories) {
      for (const cat of matchingTraining.userCategories) {
        if (cat.exercises) {
          for (const ex of cat.exercises) {
            exercises.push({
              id: ex.id,
              name: ex.name,
              categoryName: cat.name
            })
          }
        }
      }
    }

    return NextResponse.json({
      trainingId: matchingTraining.id,
      lectureName: matchingTraining.lecture.name,
      exercises
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal error' },
      { status: 500 }
    )
  }
}
