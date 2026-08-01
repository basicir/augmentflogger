'use client'

import { useState } from 'react'

export interface PinnedStudent {
  id: string
  firstName: string
  lastName: string
  callSign: string | null
  avatarUrl: string | null
  group?: string | null
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

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center', marginTop: 4 }}>
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
