export interface PinnedStudent {
  id: string
  firstName: string
  lastName: string
  callSign: string | null
  avatarUrl: string | null
}

interface StudentCardProps {
  student: PinnedStudent
  onUnpin: (id: string) => void
}

export default function StudentCard({ student, onUnpin }: StudentCardProps) {
  const initials = `${student.firstName[0] ?? ''}${student.lastName[0] ?? ''}`.toUpperCase()
  const fullName = `${student.firstName} ${student.lastName}`

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

      {student.callSign && (
        <div className="student-callsign">
          <span>✦</span>
          {student.callSign}
        </div>
      )}
    </article>
  )
}
