'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import StudentCard, { type PinnedStudent } from '@/components/StudentCard'
import SearchModal from '@/components/SearchModal'
import Link from 'next/link'

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [pinnedStudents, setPinnedStudents] = useState<PinnedStudent[]>([])
  const [hasApiKey, setHasApiKey] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showSearch, setShowSearch] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, fl_api_key, pinned_students')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({ id: authUser.id, username: profile.username })
        setHasApiKey(!!profile.fl_api_key)
        setPinnedStudents((profile.pinned_students as PinnedStudent[]) ?? [])
      }

      setLoading(false)
    }

    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePin = async (student: PinnedStudent) => {
    if (!user) return
    const alreadyPinned = pinnedStudents.some((s) => s.id === student.id)
    if (alreadyPinned) return

    const updated = [...pinnedStudents, student]
    setPinnedStudents(updated)

    await supabase
      .from('profiles')
      .update({ pinned_students: updated })
      .eq('id', user.id)
  }

  const handleUnpin = async (id: string) => {
    if (!user) return
    const updated = pinnedStudents.filter((s) => s.id !== id)
    setPinnedStudents(updated)

    await supabase
      .from('profiles')
      .update({ pinned_students: updated })
      .eq('id', user.id)
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-loading">
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <p className="page-loading-text">Loading dashboard…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Navbar username={user?.username} />

      <main className="dashboard-layout">
        <div className="dashboard-header">
          <div className="dashboard-header-top">
            <div>
              <h1 className="dashboard-title">My Students</h1>
              <p className="dashboard-subtitle">
                {pinnedStudents.length > 0
                  ? `${pinnedStudents.length} student${pinnedStudents.length !== 1 ? 's' : ''} pinned`
                  : 'Pin students to monitor them quickly'}
              </p>
            </div>
            <button
              className="btn btn-primary"
              style={{ width: 'auto' }}
              onClick={() => setShowSearch(true)}
              disabled={!hasApiKey}
              id="open-search-btn"
              title={!hasApiKey ? 'Add your FlightLogger API key in Settings first' : 'Search for a student'}
            >
              <span>+</span> Pin Student
            </button>
          </div>
        </div>

        <div className="dashboard-content">
          {!hasApiKey && (
            <div className="no-api-key-banner" role="alert">
              <span>⚠</span>
              <span>
                You haven&apos;t added your FlightLogger API key yet.{' '}
                <Link href="/settings">Go to Settings</Link> to add it and unlock student search.
              </span>
            </div>
          )}

          {pinnedStudents.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">✈</div>
              <h2 className="empty-state-title">No pinned students yet</h2>
              <p className="empty-state-desc">
                Search by callsign and pin students to keep them on your dashboard for quick access.
              </p>
              {hasApiKey && (
                <button
                  className="btn btn-primary"
                  style={{ width: 'auto' }}
                  onClick={() => setShowSearch(true)}
                  id="empty-search-btn"
                >
                  <span>+</span> Pin your first student
                </button>
              )}
              {!hasApiKey && (
                <Link href="/settings" className="btn btn-secondary" style={{ width: 'auto' }}>
                  ⚙ Add API Key
                </Link>
              )}
            </div>
          ) : (
            <div className="students-grid">
              {pinnedStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onUnpin={handleUnpin}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showSearch && (
        <SearchModal
          onClose={() => setShowSearch(false)}
          onPin={(student) => {
            handlePin(student)
            setShowSearch(false)
          }}
          pinnedIds={pinnedStudents.map((s) => s.id)}
        />
      )}
    </div>
  )
}
