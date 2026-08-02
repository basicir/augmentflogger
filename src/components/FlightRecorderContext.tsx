'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export interface OngoingFlight {
  id: string
  student_id: string
  student_name: string
  start_time: string
  aircraft_registration: string | null
  pilot_function: string | null
  flight_rules: string | null
  time_of_day: string | null
  flight_type: string | null
  departure_aerodrome: string | null
  destination_aerodrome: string | null
  desired_flight_time: string | null
  selected_program: string | null
  selected_task: string | null
  programs_cache: any | null
  task_exercises_cache: any | null
  task_description_cache: string | null
  grades: Record<string, string> | null
  exercise_comments: Record<string, string> | null
  general_comment: string | null
}

interface FlightRecorderContextType {
  ongoingFlight: OngoingFlight | null
  isModalOpen: boolean
  startFlight: (studentId: string, studentName: string) => Promise<void>
  stopFlight: () => Promise<void>
  updateFlight: (updates: Partial<OngoingFlight>) => Promise<void>
  setIsModalOpen: (open: boolean) => void
  loading: boolean
}

const FlightRecorderContext = createContext<FlightRecorderContextType | undefined>(undefined)

export function FlightRecorderProvider({ children }: { children: React.ReactNode }) {
  const [ongoingFlight, setOngoingFlight] = useState<OngoingFlight | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const fetchOngoingFlight = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('flights')
        .select('*')
        .eq('instructor_id', user.id)
        .is('end_time', null)
        .maybeSingle()

      if (data && !error) {
        setOngoingFlight(data)
      }
      setLoading(false)
    }

    fetchOngoingFlight()
  }, [])

  const startFlight = async (studentId: string, studentName: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Ensure no ongoing flight
    if (ongoingFlight) {
      alert("A flight is already in progress.")
      return
    }

    const newFlight = {
      instructor_id: user.id,
      student_id: studentId,
      student_name: studentName,
      start_time: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('flights')
      .insert(newFlight)
      .select()
      .single()

    if (error) {
      console.error("Error starting flight", error)
      alert("Failed to start flight.")
    } else {
      setOngoingFlight(data)
      setIsModalOpen(true)
      router.refresh()
    }
  }

  const stopFlight = async () => {
    if (!ongoingFlight) return

    const { error } = await supabase
      .from('flights')
      .update({ end_time: new Date().toISOString() })
      .eq('id', ongoingFlight.id)

    if (error) {
      console.error("Error stopping flight", error)
      alert("Failed to stop flight.")
    } else {
      setOngoingFlight(null)
      setIsModalOpen(false)
      router.refresh()
    }
  }

  const updateFlight = async (updates: Partial<OngoingFlight>) => {
    if (!ongoingFlight) return

    // Optimistic UI update
    setOngoingFlight({ ...ongoingFlight, ...updates })

    const { error } = await supabase
      .from('flights')
      .update(updates)
      .eq('id', ongoingFlight.id)

    if (error) {
      console.error("Error updating flight", error)
      alert("Failed to update flight parameters.")
    } else {
      router.refresh()
    }
  }

  return (
    <FlightRecorderContext.Provider
      value={{
        ongoingFlight,
        isModalOpen,
        startFlight,
        stopFlight,
        updateFlight,
        setIsModalOpen,
        loading,
      }}
    >
      {children}
    </FlightRecorderContext.Provider>
  )
}

export function useFlightRecorder() {
  const context = useContext(FlightRecorderContext)
  if (context === undefined) {
    throw new Error('useFlightRecorder must be used within a FlightRecorderProvider')
  }
  return context
}
