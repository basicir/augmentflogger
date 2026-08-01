'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface NavbarProps {
  username?: string
}

export default function Navbar({ username }: NavbarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <Link href="/dashboard" className="navbar-brand">
        <div className="navbar-brand-icon">✈</div>
        <span className="navbar-brand-name">Augment<span>Flogger</span></span>
      </Link>

      <div className="navbar-actions">
        <Link
          href="/dashboard"
          className={`navbar-link ${pathname === '/dashboard' ? 'active' : ''}`}
          id="nav-dashboard"
        >
          <span>⊞</span>
          <span className="nav-link-text">Dashboard</span>
        </Link>

        <Link
          href="/settings"
          className={`navbar-link ${pathname === '/settings' ? 'active' : ''}`}
          id="nav-settings"
        >
          <span>⚙</span>
          <span className="nav-link-text">Settings</span>
        </Link>

        <div className="navbar-divider" aria-hidden="true" />

        {username && (
          <span className="navbar-username" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0 4px' }}>
            {username}
          </span>
        )}

        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="btn btn-ghost btn-sm"
          id="nav-logout"
          aria-label="Sign out"
        >
          {loggingOut ? (
            <span className="spinner spinner-sm" />
          ) : (
            <>
              <span className="nav-logout-icon">→</span>
              <span className="nav-link-text">Sign out</span>
            </>
          )}
        </button>
      </div>
    </nav>
  )
}
