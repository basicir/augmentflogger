export default function Loading() {
  return (
    <div className="page-wrapper">
      <div className="page-loading">
        <span className="spinner" style={{ width: 32, height: 32, borderWidth: 3 }} />
        <p className="page-loading-text">Loading…</p>
      </div>
    </div>
  );
}
