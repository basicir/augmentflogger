'use client'

import { useState } from 'react'
import Link from 'next/link'

interface GradedCompetency {
  coreCompetencyName: string | null
  grade: number | null
  comment?: string | null
}

interface Exercise {
  name: string
  grade: number | null
  comment: string | null
  gradedCompetencies: GradedCompetency[]
}

interface UserCategory {
  name: string | null
  exercises: Exercise[]
}

interface Instructor {
  firstName: string
  lastName: string
}

interface Training {
  __typename: 'Training'
  id: string
  name: string
  status: string
  comment: string | null
  instructor: Instructor | null
  userCategories: UserCategory[]
}

interface Airport {
  name: string
}

interface FlightData {
  id: string
  startsAt: string
  departureAirport: Airport | null
  arrivalAirport: Airport | null
  activityRegistration: Training | { __typename: string } | null
}

interface StudentDetailClientProps {
  student: {
    id: string
    firstName: string
    lastName: string
    callSign: string | null
    avatarUrl: string | null
  }
  lastFlight: FlightData | null
}

export default function StudentDetailClient({ student, lastFlight }: StudentDetailClientProps) {
  const [activeTab, setActiveTab] = useState<'last-flight' | 'logbook' | 'statistics'>('last-flight')

  const fullName = `${student.firstName} ${student.lastName}`
  const initials = `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase()

  const training = lastFlight?.activityRegistration?.__typename === 'Training' 
    ? (lastFlight.activityRegistration as Training) 
    : null

  return (
    <div className="student-detail-container" style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <Link href="/" className="back-btn" style={{ 
          background: 'var(--bg-glass)', 
          border: '1px solid var(--border-default)', 
          borderRadius: 'var(--radius-full)', 
          padding: '8px 16px', 
          textDecoration: 'none', 
          color: 'var(--text-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span>←</span> Back
        </Link>

        {student.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={student.avatarUrl} 
            alt={fullName} 
            style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-full)', objectFit: 'cover', border: '2px solid var(--primary)' }} 
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
          style={{ 
            width: '80px', height: '80px', 
            borderRadius: 'var(--radius-full)', 
            background: 'var(--gradient-primary)', 
            display: student.avatarUrl ? 'none' : 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '32px', fontWeight: 600, color: 'white'
          }}
        >
          {initials}
        </div>

        <div>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700 }}>{fullName}</h1>
          {student.callSign && (
            <div style={{ color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>✦</span> {student.callSign}
            </div>
          )}
        </div>
      </header>

      {/* Tabs */}
      <div className="tabs" style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-default)', marginBottom: '24px', overflowX: 'auto', whiteSpace: 'nowrap', paddingBottom: '4px' }}>
        <button 
          onClick={() => setActiveTab('last-flight')}
          style={{
            background: 'transparent', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600,
            cursor: 'pointer', color: activeTab === 'last-flight' ? 'var(--primary)' : 'var(--text-secondary)',
            borderBottom: activeTab === 'last-flight' ? '2px solid var(--primary)' : '2px solid transparent',
            transition: 'all 0.2s'
          }}
        >
          Last Flight
        </button>
        <button 
          disabled
          style={{
            background: 'transparent', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600,
            cursor: 'not-allowed', color: 'var(--text-disabled)', opacity: 0.5
          }}
          title="Coming Soon"
        >
          Logbook
        </button>
        <button 
          disabled
          style={{
            background: 'transparent', border: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 600,
            cursor: 'not-allowed', color: 'var(--text-disabled)', opacity: 0.5
          }}
          title="Coming Soon"
        >
          Statistics
        </button>
      </div>

      {/* Last Flight Tab Content */}
      {activeTab === 'last-flight' && (
        <section>
          {lastFlight ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Flight Meta Card */}
              <div style={{ 
                background: 'var(--gradient-card)', border: '1px solid var(--border-default)', 
                borderRadius: 'var(--radius-lg)', padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'
              }}>
                <div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Date</div>
                  <div style={{ fontWeight: 500 }}>{new Date(lastFlight.startsAt).toLocaleString()}</div>
                </div>
                {training?.name && (
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Task</div>
                    <div style={{ fontWeight: 500 }}>{training.name}</div>
                  </div>
                )}
                {lastFlight.departureAirport && lastFlight.arrivalAirport && (
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Route</div>
                    <div style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {lastFlight.departureAirport.name}
                      <span style={{ color: 'var(--primary)' }}>✈</span>
                      {lastFlight.arrivalAirport.name}
                    </div>
                  </div>
                )}
                {training?.instructor && (
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Instructor</div>
                    <div style={{ fontWeight: 500 }}>{training.instructor.firstName} {training.instructor.lastName}</div>
                  </div>
                )}
                {training?.status && (
                  <div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '4px' }}>Status</div>
                    <div style={{ 
                      display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '12px', fontWeight: 600,
                      background: 'rgba(16, 185, 129, 0.1)', color: 'rgb(16, 185, 129)'
                    }}>
                      {training.status}
                    </div>
                  </div>
                )}
              </div>

              {/* General Comment */}
              {training?.comment && (
                <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: 'var(--primary)' }}>💬</span> General Comment
                  </h3>
                  <div
                    style={{ lineHeight: 1.6, color: 'var(--text-secondary)' }}
                    dangerouslySetInnerHTML={{ __html: training.comment }}
                  />
                </div>
              )}

              {/* Tasks / Exercises */}
              {training?.userCategories && training.userCategories.length > 0 && (
                <div>
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Tasks & Gradings</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {training.userCategories.map((cat, i) => (
                      <div key={i} style={{ marginBottom: '16px' }}>
                        {cat.name && <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-secondary)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{cat.name}</h4>}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          {cat.exercises.map((ex, j) => (
                            <div key={j} style={{ 
                              background: 'var(--bg-glass)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', padding: '16px',
                              display: 'flex', flexDirection: 'column', gap: '12px'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                                <div style={{ fontWeight: 600, fontSize: '16px' }}>{ex.name}</div>
                                {ex.grade !== null && (
                                  <div style={{ 
                                    background: 'var(--gradient-primary)', color: 'white', padding: '4px 12px', borderRadius: 'var(--radius-full)',
                                    fontWeight: 700, fontSize: '14px', minWidth: '32px', textAlign: 'center'
                                  }}>
                                    {ex.grade}
                                  </div>
                                )}
                              </div>
                              {ex.comment && (
                                <div
                                  style={{ color: 'var(--text-secondary)', fontSize: '14px', background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: 'var(--radius-sm)' }}
                                  dangerouslySetInnerHTML={{ __html: ex.comment }}
                                />
                              )}
                              {ex.gradedCompetencies && ex.gradedCompetencies.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                                  {ex.gradedCompetencies.map((comp, k) => (
                                    <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-default)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{comp.coreCompetencyName}</span>
                                        {comp.grade !== null && <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '13px' }}>{comp.grade}</span>}
                                      </div>
                                      {comp.comment && (
                                        <div
                                          style={{ color: 'var(--text-muted)', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '4px', marginTop: '2px' }}
                                          dangerouslySetInnerHTML={{ __html: comp.comment }}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ 
              background: 'var(--bg-glass)', border: '1px solid var(--border-default)', borderRadius: 'var(--radius-lg)', 
              padding: '48px', textAlign: 'center', color: 'var(--text-secondary)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>✈️</div>
              <h3>No flights recorded</h3>
              <p>This student hasn't logged any flights yet.</p>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
