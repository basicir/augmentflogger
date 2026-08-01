'use client'

import { useState, useEffect, useCallback } from 'react'
import type { PinnedStudent } from './StudentCard'

interface SearchResult {
  id: string
  firstName: string
  lastName: string
  callSign: string | null
  avatarUrl: string | null
}

interface SearchModalProps {
  availableGroups: string[]
  onClose: () => void
  onPin: (student: PinnedStudent) => void
  pinnedIds: string[]
}

export default function SearchModal({
  availableGroups,
  onClose,
  onPin,
  pinnedIds,
}: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [apiError, setApiError] = useState('')
  const [selectedGroupMap, setSelectedGroupMap] = useState<Record<string, string>>({})

  const search = useCallback(async (callSign: string) => {
    if (!callSign.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    setApiError('')

    try {
      const res = await fetch('/api/flightlogger/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callSign: callSign.trim().toUpperCase() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setApiError(data.error ?? 'Failed to search. Check your API key in Settings.')
        setResults([])
      } else {
        setResults(data.users ?? [])
      }
    } catch {
      setApiError('Network error. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
      setSearched(true)
    }
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      search(query)
    }
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  useEffect(() => {
    const el = document.getElementById('search-input')
    el?.focus()
  }, [])

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Search students"
      onClick={handleOverlayClick}
    >
      <div className="modal-box">
        <div className="modal-header">
          <h2 className="modal-title">Search Student to Pin</h2>
          <button
            className="modal-close"
            onClick={onClose}
            aria-label="Close search"
            id="search-modal-close"
          >
            ✕
          </button>
        </div>

        <div className="modal-search">
          <div className="search-input-wrapper">
            <span className="search-input-icon" aria-hidden="true">✦</span>
            <input
              id="search-input"
              type="text"
              className="search-input"
              placeholder="Enter callsign (e.g. ABC123)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              spellCheck={false}
            />
          </div>
        </div>

        {apiError && (
          <div style={{ padding: '0 24px 16px' }}>
            <div className="alert alert-error">
              <span>⚠</span>
              <span>{apiError}</span>
            </div>
          </div>
        )}

        {loading && (
          <div className="modal-empty">
            <span className="spinner" />
          </div>
        )}

        {!loading && results.length > 0 && (
          <ul className="modal-results" role="list">
            {results.map((user) => {
              const isPinned = pinnedIds.includes(user.id)
              const initials = `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()
              const selectedGroup = selectedGroupMap[user.id] || ''

              return (
                <li key={user.id} className="result-item" role="listitem">
                  {user.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="result-avatar"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                        const ph = img.nextElementSibling as HTMLElement
                        if (ph) ph.style.display = 'flex'
                      }}
                    />
                  ) : null}
                  <div
                    className="result-avatar-placeholder"
                    style={{ display: user.avatarUrl ? 'none' : 'flex' }}
                    aria-hidden="true"
                  >
                    {initials}
                  </div>
                  <div className="result-info">
                    <div className="result-name">{user.firstName} {user.lastName}</div>
                    {user.callSign && (
                      <div className="result-callsign">{user.callSign}</div>
                    )}
                  </div>

                  {!isPinned && availableGroups.length > 0 && (
                    <select
                      className="modal-group-select"
                      value={selectedGroup}
                      onChange={(e) =>
                        setSelectedGroupMap((prev) => ({ ...prev, [user.id]: e.target.value }))
                      }
                    >
                      <option value="">No Group</option>
                      {availableGroups.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  )}

                  <button
                    className={`result-pin-btn ${isPinned ? 'pinned' : ''}`}
                    onClick={() => {
                      if (!isPinned) {
                        onPin({
                          id: user.id,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          callSign: user.callSign,
                          avatarUrl: user.avatarUrl,
                          group: selectedGroup || null,
                        })
                      }
                    }}
                    disabled={isPinned}
                    aria-label={isPinned ? 'Already pinned' : `Pin ${user.firstName} ${user.lastName}`}
                    id={`pin-btn-${user.id}`}
                  >
                    {isPinned ? '✓ Pinned' : '+ Pin'}
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {!loading && searched && results.length === 0 && !apiError && (
          <div className="modal-empty">
            No student found with callsign &ldquo;{query}&rdquo;
          </div>
        )}

        <div className="modal-hint">
          Type an exact callsign and press <kbd style={{ fontFamily: 'monospace', padding: '1px 5px', background: 'var(--bg-elevated)', borderRadius: '4px', fontSize: '0.75rem' }}>Enter</kbd> to search
        </div>
      </div>
    </div>
  )
}
