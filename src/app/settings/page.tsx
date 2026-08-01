'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')

  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      if (!authUser) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('username, fl_api_key')
        .eq('id', authUser.id)
        .single()

      if (profile) {
        setUser({ id: authUser.id, username: profile.username })
        setApiKey(profile.fl_api_key ?? '')
        setSavedApiKey(profile.fl_api_key ?? '')
      }
      setLoading(false)
    }
    loadData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setSaveStatus('idle')

    const { error } = await supabase
      .from('profiles')
      .update({ fl_api_key: apiKey.trim() || null })
      .eq('id', user.id)

    if (error) {
      setSaveStatus('error')
    } else {
      setSavedApiKey(apiKey.trim())
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
    setSaving(false)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestStatus('idle')
    setTestMessage('')

    try {
      const res = await fetch('/api/flightlogger/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ callSign: '__TEST__', _testKey: apiKey.trim() }),
      })
      const data = await res.json()

      if (data.error && data.error.includes('API key')) {
        setTestStatus('error')
        setTestMessage('Invalid API key — FlightLogger rejected the request.')
      } else {
        // Any response that isn't an auth error = key works
        setTestStatus('success')
        setTestMessage('API key is valid! FlightLogger connection successful.')
      }
    } catch {
      setTestStatus('error')
      setTestMessage('Network error — could not reach FlightLogger.')
    } finally {
      setTesting(false)
    }
  }

  const hasChanges = apiKey.trim() !== savedApiKey

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-loading">
          <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
          <p className="page-loading-text">Loading settings…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <Navbar username={user?.username} />

      <main>
        <div className="settings-layout">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">Manage your account and FlightLogger integration</p>

          {/* Account Info */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span className="settings-section-title-icon">👤</span>
              Account
            </div>
            <p className="settings-section-desc">Your AugmentFlogger account details.</p>

            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-input"
                value={user?.username ?? ''}
                readOnly
                style={{ opacity: 0.7, cursor: 'not-allowed' }}
              />
              <p className="form-hint">Username cannot be changed.</p>
            </div>
          </div>

          {/* FlightLogger API Key */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span className="settings-section-title-icon">🔑</span>
              FlightLogger API Key
              {savedApiKey ? (
                <span className="badge badge-success">✓ Connected</span>
              ) : (
                <span className="badge badge-warning">⚠ Not set</span>
              )}
            </div>
            <p className="settings-section-desc">
              Your FlightLogger API key is stored securely and used to fetch student data.
              You can generate an API key from your FlightLogger account settings under{' '}
              <strong>Administration → API</strong>.
            </p>

            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="api-key-input" className="form-label">API Key</label>
                <div className="api-key-field">
                  <input
                    id="api-key-input"
                    type="password"
                    className="api-key-input"
                    placeholder="Paste your FlightLogger API token here"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ width: 'auto', whiteSpace: 'nowrap' }}
                    onClick={handleTest}
                    disabled={testing || !apiKey.trim()}
                    id="test-api-key-btn"
                  >
                    {testing ? <span className="spinner spinner-sm" /> : 'Test Key'}
                  </button>
                </div>

                {testStatus === 'success' && (
                  <div className="alert alert-success" style={{ marginTop: 12 }}>
                    <span>✓</span> {testMessage}
                  </div>
                )}
                {testStatus === 'error' && (
                  <div className="alert alert-error" style={{ marginTop: 12 }}>
                    <span>⚠</span> {testMessage}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: 'auto' }}
                  disabled={saving || !hasChanges}
                  id="save-api-key-btn"
                >
                  {saving ? (
                    <><span className="spinner spinner-sm" /> Saving…</>
                  ) : 'Save API Key'}
                </button>

                {saveStatus === 'success' && (
                  <span style={{ color: 'var(--accent-success)', fontSize: '0.875rem' }}>
                    ✓ Saved successfully
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span style={{ color: 'var(--accent-danger)', fontSize: '0.875rem' }}>
                    ✕ Save failed. Try again.
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="settings-section" style={{ borderColor: 'rgba(239,68,68,0.15)' }}>
            <div className="settings-section-title">
              <span className="settings-section-title-icon">⚠</span>
              Danger Zone
            </div>
            <p className="settings-section-desc">
              Removing your API key will disconnect FlightLogger. You will not be able to search for students until you add a new key.
            </p>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              style={{ width: 'auto' }}
              disabled={!savedApiKey}
              onClick={async () => {
                if (!user) return
                setApiKey('')
                setSavedApiKey('')
                await supabase.from('profiles').update({ fl_api_key: null }).eq('id', user.id)
              }}
              id="remove-api-key-btn"
            >
              Remove API Key
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
