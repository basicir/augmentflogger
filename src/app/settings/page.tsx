'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/Navbar'
import { sendNotification, requestNotificationPermission } from '@/lib/notifications'
import { usePushNotifications } from '@/hooks/usePushNotifications'

export default function SettingsPage() {
  const [user, setUser] = useState<{ id: string; username: string } | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [savedApiKey, setSavedApiKey] = useState('')
  const [utcOffset, setUtcOffset] = useState<number>(0)
  const [savedUtcOffset, setSavedUtcOffset] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [saveError, setSaveError] = useState('')
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [testMessage, setTestMessage] = useState('')
  const { subscribeToPush, permission, isSupported } = usePushNotifications()
  const [notificationPermission, setNotificationPermission] = useState<string>('default')
  const [testPushStatus, setTestPushStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [testPushMsg, setTestPushMsg] = useState('')
  const [scriptContent, setScriptContent] = useState('')
  const [scriptCopied, setScriptCopied] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
    
    // Fetch the master script content
    fetch('/master_script.user.js')
      .then(res => res.text())
      .then(setScriptContent)
      .catch(err => console.error('Failed to load master script:', err))
  }, [])

  const copyScript = () => {
    if (scriptContent) {
      navigator.clipboard.writeText(scriptContent)
      setScriptCopied(true)
      setTimeout(() => setScriptCopied(false), 2000)
    }
  }

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
        .select('username, fl_api_key, utc_offset')
        .eq('id', authUser.id)
        .maybeSingle()

      if (error) {
        console.error('Error fetching profile:', error)
      }

      const currentUsername = profile?.username || fallbackUsername
      setUser({ id: authUser.id, username: currentUsername })
      setApiKey(profile?.fl_api_key ?? '')
      setSavedApiKey(profile?.fl_api_key ?? '')
      setUtcOffset(profile?.utc_offset ?? 0)
      setSavedUtcOffset(profile?.utc_offset ?? 0)
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
    setSaveError('')

    const cleanKey = apiKey.trim() || null

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username: user.username,
          fl_api_key: cleanKey,
          utc_offset: utcOffset,
        },
        { onConflict: 'id' }
      )

    if (error) {
      console.error('Error saving settings:', error)
      setSaveStatus('error')
      setSaveError(error.message || 'Failed to save settings.')
    } else {
      setSavedApiKey(cleanKey ?? '')
      setApiKey(cleanKey ?? '')
      setSavedUtcOffset(utcOffset)
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 4000)
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

  const handleRemove = async () => {
    if (!user) return
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .upsert(
        {
          id: user.id,
          username: user.username,
          fl_api_key: null,
        },
        { onConflict: 'id' }
      )

    if (!error) {
      setApiKey('')
      setSavedApiKey('')
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
    setSaving(false)
  }

    const hasChanges = apiKey.trim() !== savedApiKey || utcOffset !== savedUtcOffset

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

              <div className="form-group" style={{ marginTop: 24 }}>
                <label htmlFor="utc-offset-input" className="form-label">UTC Offset</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <select
                    id="utc-offset-input"
                    className="form-input"
                    value={utcOffset}
                    onChange={(e) => setUtcOffset(Number(e.target.value))}
                    style={{ width: '200px' }}
                  >
                    {[...Array(27)].map((_, i) => {
                      const offset = i - 12;
                      return (
                        <option key={offset} value={offset}>
                          UTC {offset >= 0 ? `+${offset}` : offset}
                        </option>
                      );
                    })}
                  </select>
                  <p className="form-hint" style={{ margin: 0 }}>
                    Select your timezone offset for displaying flight times.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 32 }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: 'auto' }}
                  disabled={saving || !hasChanges}
                  id="save-settings-btn"
                >
                  {saving ? (
                    <><span className="spinner spinner-sm" /> Saving…</>
                  ) : 'Save Settings'}
                </button>

                {saveStatus === 'success' && (
                  <span style={{ color: 'var(--accent-success)', fontSize: '0.875rem', fontWeight: 600 }}>
                    ✓ Settings Saved Successfully!
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span style={{ color: 'var(--accent-danger)', fontSize: '0.875rem' }}>
                    ✕ {saveError || 'Save failed. Try again.'}
                  </span>
                )}
              </div>
            </form>
          </div>

          {/* Push Notifications */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span className="settings-section-title-icon">🔔</span>
              Push Notifications
              {notificationPermission === 'granted' ? (
                <span className="badge badge-success">✓ Enabled</span>
              ) : notificationPermission === 'denied' ? (
                <span className="badge badge-danger">✕ Denied</span>
              ) : (
                <span className="badge badge-warning">⚠ Not Set</span>
              )}
            </div>
            <p className="settings-section-desc">
              Enable push notifications to receive alerts when your planned flight time is almost up.
            </p>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {notificationPermission !== 'granted' && (
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ width: 'auto' }}
                  onClick={async () => {
                    const p = await requestNotificationPermission();
                    setNotificationPermission(p);
                  }}
                >
                  Enable Notifications
                </button>
              )}
              
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: 'auto' }}
                disabled={testPushStatus === 'loading'}
                onClick={async () => {
                  if (notificationPermission !== 'granted') {
                    alert('Please enable notifications first!');
                    return;
                  }
                  
                  if (!user) return;
                  
                  setTestPushStatus('loading')
                  setTestPushMsg('')

                  try {
                    // Make sure we have a fresh subscription in the database before testing
                    await subscribeToPush(user.id)

                    // Call the Edge Function to send a real Web Push to this user
                    const res = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/flight-push-worker`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
                      },
                      body: JSON.stringify({ test_user_id: user.id })
                    })
                    
                    const data = await res.json()
                    
                    if (res.ok && data.success) {
                      setTestPushStatus('success')
                      setTestPushMsg('Push sent via Supabase!')
                    } else {
                      setTestPushStatus('error')
                      setTestPushMsg(data.error || 'Failed to send push.')
                    }
                  } catch (e) {
                    setTestPushStatus('error')
                    setTestPushMsg('Network error.')
                  }
                }}
              >
                {testPushStatus === 'loading' ? <span className="spinner spinner-sm" /> : 'Test Web Push'}
              </button>
            </div>
            
            {testPushStatus === 'success' && (
              <div className="alert alert-success" style={{ marginTop: 12 }}>
                <span>✓</span> {testPushMsg}
              </div>
            )}
            {testPushStatus === 'error' && (
              <div className="alert alert-error" style={{ marginTop: 12 }}>
                <span>⚠</span> {testPushMsg}
              </div>
            )}
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
              disabled={!savedApiKey || saving}
              onClick={handleRemove}
              id="remove-api-key-btn"
            >
              Remove API Key
            </button>
          </div>

          {/* Tampermonkey Script Section */}
          <div className="settings-section">
            <div className="settings-section-title">
              <span className="settings-section-title-icon">📜</span>
              FlightLogger Exporter Script (Tampermonkey)
            </div>
            <p className="settings-section-desc" style={{ marginBottom: '16px' }}>
              Ezzel a kóddal automatizálhatod a repülési adatok áttöltését a FlightLoggerbe. A script telepítéséhez 
              szükséged lesz a <strong>Tampermonkey</strong> (vagy Greasemonkey) bővítményre a böngésződben.
              <br/><br/>
              <strong>Telepítés lépései:</strong>
              <ol style={{ marginLeft: '24px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <li>Telepítsd a Tampermonkey kiegészítőt.</li>
                <li>Másold ki az alábbi kódot a "Copy Script" gombbal.</li>
                <li>A Tampermonkey ikonjára kattintva válaszd a "Create a new script..." opciót.</li>
                <li>Töröld ki az alapértelmezett kódot, illeszd be az imént kimásoltat, majd mentsd el (Ctrl+S / Cmd+S).</li>
              </ol>
            </p>
            
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '12px' }}>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ width: 'auto' }}
                onClick={copyScript}
                disabled={!scriptContent}
              >
                {scriptCopied ? '✓ Copied!' : 'Copy Script'}
              </button>
              <a 
                href="/master_script.user.js" 
                download="master_script.user.js"
                className="btn btn-secondary btn-sm"
                style={{ width: 'auto', textDecoration: 'none' }}
              >
                Download File
              </a>
            </div>

            <div style={{
              backgroundColor: '#1e1e1e',
              color: '#d4d4d4',
              padding: '16px',
              borderRadius: '8px',
              maxHeight: '300px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {scriptContent || 'Loading script...'}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
