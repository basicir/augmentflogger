'use client'

import { useState, useEffect, useMemo } from 'react'
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
  const [isGroupingEnabled, setIsGroupingEnabled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('__ALL__')
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [groupInput, setGroupInput] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) {
        setLoading(false)
        return
      }

      const fallbackUsername = authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'instructor'

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username, fl_api_key, pinned_students')
        .eq('id', authUser.id)
        .maybeSingle()

      if (error) {
        console.error('Error loading dashboard profile:', error)
      }

      const currentUsername = profile?.username || fallbackUsername
      setUser({ id: authUser.id, username: currentUsername })
      const keyExists = !!profile?.fl_api_key
      setHasApiKey(keyExists)
      
      const initialStudents = (profile?.pinned_students as PinnedStudent[]) ?? []
      setPinnedStudents(initialStudents)
      setLoading(false)

      // Fetch fresh last-flown dates if they exist and key is present
      if (keyExists && initialStudents.length > 0) {
        try {
          const res = await fetch('/api/flightlogger/last-flown', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentIds: initialStudents.map((s) => s.id) }),
          })
          if (res.ok) {
            const { lastFlightDates } = await res.json()
            const updated = initialStudents.map((s) => ({
              ...s,
              lastFlightDate: lastFlightDates[s.id] !== undefined ? lastFlightDates[s.id] : s.lastFlightDate,
            }))
            
            // Save updated cache to Supabase & state
            setPinnedStudents(updated)
            await supabase
              .from('profiles')
              .upsert(
                {
                  id: authUser.id,
                  username: currentUsername,
                  pinned_students: updated,
                },
                { onConflict: 'id' }
              )
          }
        } catch (e) {
          console.error('Error refreshing last flight dates:', e)
        }
      }
    }

    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Unique list of groups
  const availableGroups = useMemo(() => {
    const set = new Set<string>()
    pinnedStudents.forEach((s) => {
      if (s.group) set.add(s.group)
    })
    return Array.from(set).sort()
  }, [pinnedStudents])

  // Grouped map: groupName -> array of PinnedStudent
  const groupedStudentsMap = useMemo(() => {
    const map: Record<string, PinnedStudent[]> = {}

    // Add entries for all existing groups
    availableGroups.forEach((g) => {
      map[g] = []
    })
    map['__UNASSIGNED__'] = []

    pinnedStudents.forEach((student) => {
      const key = student.group || '__UNASSIGNED__'
      if (!map[key]) map[key] = []
      map[key].push(student)
    })

    return map
  }, [pinnedStudents, availableGroups])

  // Which groups to display based on tab filter
  const displayGroups = useMemo(() => {
    if (selectedGroupFilter === '__ALL__') {
      const list = [...availableGroups]
      if ((groupedStudentsMap['__UNASSIGNED__'] ?? []).length > 0) {
        list.push('__UNASSIGNED__')
      }
      return list
    }
    return [selectedGroupFilter]
  }, [selectedGroupFilter, availableGroups, groupedStudentsMap])

  const savePinnedStudents = async (updated: PinnedStudent[]) => {
    if (!user) return
    setPinnedStudents(updated)

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username: user.username,
          pinned_students: updated,
        },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Error saving pinned students:', error)
    }
  }

  const handlePin = async (student: PinnedStudent) => {
    const alreadyPinned = pinnedStudents.some((s) => s.id === student.id)
    if (alreadyPinned) return
    const updated = [...pinnedStudents, student]
    await savePinnedStudents(updated)
  }

  const handleUnpin = async (id: string) => {
    const updated = pinnedStudents.filter((s) => s.id !== id)
    await savePinnedStudents(updated)
  }

  const handleUpdateGroup = async (studentId: string, group: string | null) => {
    const updated = pinnedStudents.map((s) => (s.id === studentId ? { ...s, group } : s))
    await savePinnedStudents(updated)
  }

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = groupInput.trim()
    if (trimmed) {
      setSelectedGroupFilter(trimmed)
    }
    setGroupInput('')
    setCreatingGroup(false)
  }

  const handleDeleteGroup = async (groupName: string) => {
    if (
      !confirm(
        `Are you sure you want to remove the group "${groupName}"? Students in this group will become unassigned.`
      )
    ) {
      return
    }
    const updated = pinnedStudents.map((s) => (s.group === groupName ? { ...s, group: null } : s))
    if (selectedGroupFilter === groupName) {
      setSelectedGroupFilter('__ALL__')
    }
    await savePinnedStudents(updated)
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
                  ? `${pinnedStudents.length} student${pinnedStudents.length !== 1 ? 's' : ''} pinned across ${availableGroups.length} group${availableGroups.length !== 1 ? 's' : ''}`
                  : 'Pin students to monitor and organize them in groups'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className={`btn ${isGroupingEnabled ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: 'auto' }}
                onClick={() => setIsGroupingEnabled(!isGroupingEnabled)}
                title="Toggle student grouping mode"
              >
                <span>📁</span> {isGroupingEnabled ? 'Done Grouping' : 'Group Students'}
              </button>
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

          {/* Group Filter Tabs Bar */}
          {pinnedStudents.length > 0 && (
            <div className="groups-bar">
              <div className="groups-tabs">
                <button
                  className={`group-tab ${selectedGroupFilter === '__ALL__' ? 'active' : ''}`}
                  onClick={() => setSelectedGroupFilter('__ALL__')}
                >
                  All Students ({pinnedStudents.length})
                </button>

                {availableGroups.map((group) => {
                  const count = (groupedStudentsMap[group] ?? []).length
                  const isActive = selectedGroupFilter === group
                  return (
                    <div
                      key={group}
                      className={`group-tab-wrapper ${isActive ? 'active' : ''}`}
                    >
                      <button
                        className="group-tab-title"
                        onClick={() => setSelectedGroupFilter(group)}
                      >
                        📁 {group} ({count})
                      </button>
                      <button
                        className="group-delete-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGroup(group)
                        }}
                        title={`Delete group ${group}`}
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}

                {(groupedStudentsMap['__UNASSIGNED__'] ?? []).length > 0 && (
                  <button
                    className={`group-tab ${selectedGroupFilter === '__UNASSIGNED__' ? 'active' : ''}`}
                    onClick={() => setSelectedGroupFilter('__UNASSIGNED__')}
                  >
                    Unassigned ({(groupedStudentsMap['__UNASSIGNED__'] ?? []).length})
                  </button>
                )}

                {!creatingGroup ? (
                  <button
                    className="group-tab group-tab-add"
                    onClick={() => setCreatingGroup(true)}
                  >
                    + Add Group
                  </button>
                ) : (
                  <form onSubmit={handleCreateGroup} className="new-group-inline-form">
                    <input
                      type="text"
                      className="new-group-inline-input"
                      placeholder="Group name (e.g. PPL Batch)"
                      value={groupInput}
                      onChange={(e) => setGroupInput(e.target.value)}
                      autoFocus
                    />
                    <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '4px 10px' }}>
                      Add
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      style={{ padding: '4px 8px' }}
                      onClick={() => setCreatingGroup(false)}
                    >
                      ✕
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}
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
                Search by callsign to pin students and organize them into custom groups (e.g., PPL, CPL, Solo).
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
            <div className="dashboard-groups-container">
              {displayGroups.map((groupKey) => {
                const students = groupedStudentsMap[groupKey] ?? []
                if (students.length === 0 && selectedGroupFilter === '__ALL__') return null

                const isUnassigned = groupKey === '__UNASSIGNED__'
                const groupTitle = isUnassigned ? '🏷️ Unassigned Students' : `📁 ${groupKey}`

                return (
                  <section key={groupKey} className="group-section">
                    <div className="group-section-header">
                      <h2 className="group-section-title">{groupTitle}</h2>
                      <span className="group-section-count">
                        {students.length} student{students.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    {students.length > 0 ? (
                      <div className="students-grid">
                        {students.map((student) => (
                          <StudentCard
                            key={student.id}
                            student={student}
                            availableGroups={availableGroups}
                            isGroupingEnabled={isGroupingEnabled}
                            onUnpin={handleUnpin}
                            onUpdateGroup={handleUpdateGroup}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="group-empty-placeholder">
                        No students in this group yet. Use the group badge on a student card to assign them here.
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          )}
        </div>
      </main>

      {showSearch && (
        <SearchModal
          availableGroups={availableGroups}
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
