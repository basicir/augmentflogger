'use client'

import { useState } from 'react'

export interface PinnedStudent {
  id: string
  firstName: string
  lastName: string
  callSign: string | null
  avatarUrl: string | null
  group?: string | null
  lastFlightDate?: string | null
}

interface StudentCardProps {
  student: PinnedStudent
  availableGroups: string[]
  onUnpin: (id: string) => void
  onUpdateGroup: (id: string, group: string | null) => void
}

export default function StudentCard({
  student,
  availableGroups,
  onUnpin,
  onUpdateGroup,
}: StudentCardProps) {
  const [editingGroup, setEditingGroup] = useState(false)
  const [newGroupInput, setNewGroupInput] = useState('')

  const initials = `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase()
  const fullName = `${student.firstName} ${student.lastName}`

  const handleSelectGroup = (val: string) => {
    if (val === '__NEW__') {
      setEditingGroup(true)
      setNewGroupInput('')
    } else if (val === '__NONE__') {
      onUpdateGroup(student.id, null)
      setEditingGroup(false)
    } else {
      onUpdateGroup(student.id, val)
      setEditingGroup(false)
    }
  }

  const handleSaveNewGroup = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = newGroupInput.trim()
    if (trimmed) {
      onUpdateGroup(student.id, trimmed)
    }
    setEditingGroup(false)
  }

  // Calculate relative date string & color gradient
  const flightDetails = (() => {
    if (!student.lastFlightDate) {
      return {
        text: 'Never flown',
        color: '#94a3b8', // Gray
      }
    }

    const flightDate = new Date(student.lastFlightDate)
    const now = new Date()

    // Calculate difference in milliseconds
    const diffMs = now.getTime() - flightDate.getTime()
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    // Calculate gradient color:
    // Today (0 days) = Green: RGB(16, 185, 129)
    // 1 Month (30+ days) = Red: RGB(239, 68, 68)
    const ratio = Math.max(0, Math.min(1, diffDays / 30))
    const r = Math.round(16 + (239 - 16) * ratio)
    const g = Math.round(185 + (68 - 185) * ratio)
    const b = Math.round(129 + (68 - 129) * ratio)
    const color = `rgb(${r}, ${g}, ${b})`

    // Nice text label
    let text = ''
    if (diffDays < 1) {
      const hours = Math.floor(diffMs / (1000 * 60 * 60))
      if (hours < 1) {
        text = 'Last flown: Today'
      } else {
        text = 'Last flown: Today'
      }
    } else if (diffDays < 2) {
      text = 'Last flown: Yesterday'
    } else {
      text = `Last flown: ${Math.floor(diffDays)} days ago`
    }

    return { text, color }
  })()

  return (
    <article className="student-card" aria-label={`Pinned student: ${fullName}`}>
      <button
        className="student-card-unpin"
        onClick={() => onUnpin(student.id)}
        aria-label={`Unpin ${fullName}`}
        title="Unpin student"
      >
        ✕
      </button>

      {student.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={student.avatarUrl}
          alt={`Photo of ${fullName}`}
          className="student-avatar"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            const placeholder = target.nextElementSibling as HTMLElement
            if (placeholder) placeholder.style.display = 'flex'
          }}
        />
      ) : null}
      <div
        className="student-avatar-placeholder"
        style={{ display: student.avatarUrl ? 'none' : 'flex' }}
        aria-hidden="true"
      >
        {initials}
      </div>

      <div className="student-name">{fullName}</div>

      {/* Last Flown Parameter */}
      <div
        className="student-last-flown"
        style={{ color: flightDetails.color }}
        title={student.lastFlightDate ? new Date(student.lastFlightDate).toLocaleString() : undefined}
      >
        <span>✈</span> {flightDetails.text}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 8 }}>
        {student.callSign && (
          <div className="student-callsign">
            <span>✦</span>
            {student.callSign}
          </div>
        )}

        {/* Group Badge / Selector */}
        {!editingGroup ? (
          <div className="group-badge-wrapper">
            <select
              className={`student-group-badge ${student.group ? 'has-group' : 'no-group'}`}
              value={student.group ?? '__NONE__'}
              onChange={(e) => handleSelectGroup(e.target.value)}
              title="Click to assign or change group"
            >
              <option value="__NONE__">🏷️ No Group</option>
              {availableGroups.map((g) => (
                <option key={g} value={g}>
                  📁 {g}
                </option>
              ))}
              <option value="__NEW__">+ New Group…</option>
            </select>
          </div>
        ) : (
          <form onSubmit={handleSaveNewGroup} className="new-group-form">
            <input
              type="text"
              className="new-group-input"
              placeholder="Group name..."
              value={newGroupInput}
              onChange={(e) => setNewGroupInput(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn-group-save">✓</button>
            <button
              type="button"
              className="btn-group-cancel"
              onClick={() => setEditingGroup(false)}
            >
              ✕
            </button>
          </form>
        )}
      </div>
    </article>
  )
}
