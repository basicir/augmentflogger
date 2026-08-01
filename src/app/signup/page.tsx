'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const usernameRegex = /^[a-zA-Z0-9_]{3,32}$/

  const validateForm = (): string | null => {
    if (!usernameRegex.test(username)) {
      return 'Username must be 3–32 characters. Only letters, numbers, and underscores.'
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters.'
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.'
    }
    return null
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    const supabase = createClient()
    const email = `${username.toLowerCase().trim()}@augmentflogger.internal`

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: username.toLowerCase().trim() },
      },
    })

    if (signUpError) {
      if (signUpError.message.includes('already registered')) {
        setError('That username is already taken. Please choose another.')
      } else {
        setError(signUpError.message)
      }
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile row
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username: username.toLowerCase().trim(),
        fl_api_key: null,
        pinned_students: [],
      })

      if (profileError && !profileError.message.includes('duplicate')) {
        console.error('Profile creation error:', profileError)
      }
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-logo">
          <div className="auth-logo-icon">✈</div>
          <div className="auth-logo-text">Augment<span>Flogger</span></div>
        </div>

        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-subtitle">Set up your instructor dashboard</p>

          {error && (
            <div className="alert alert-error" role="alert">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} noValidate>
            <div className="form-group">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="e.g. instructor_john"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                disabled={loading}
              />
              <p className="form-hint">Letters, numbers, underscores. 3–32 characters.</p>
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className="form-input"
                placeholder="Repeat your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              id="signup-submit"
              disabled={loading || !username || !password || !confirmPassword}
            >
              {loading ? (
                <>
                  <span className="spinner spinner-sm"></span>
                  Creating account…
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account?{' '}
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
