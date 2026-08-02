export default function StudentDetailLoading() {
  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', margin: 0 }}>Loading student…</p>
      </div>
    </div>
  )
}
