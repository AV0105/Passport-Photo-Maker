const ICONS = { passed: '✓', warning: '!', failed: '✕', unknown: '?' };

/**
 * Screen C: structured validation results. Each check shows a status icon,
 * message and (when relevant) a suggested corrective action. Hard failures
 * block progress; warnings let the user continue knowingly.
 */
export default function ValidationResults({ result, onContinue, onReplace, busy }) {
  if (!result) return null;

  const bannerClass = {
    pass: 'overall-pass',
    warn: 'overall-warn',
    fail: 'overall-fail',
    unknown: 'overall-unknown',
  }[result.status];

  return (
    <div className="card">
      <h2>Suitability check</h2>

      <div className={`overall-banner ${bannerClass}`} role="status">
        {result.overall}
      </div>

      <p className="muted" style={{ fontSize: '0.82rem' }}>
        These checks help you take a better photo — they do not guarantee
        acceptance by any passport authority. Passing means “suitable for
        editing”, not “officially compliant”.
      </p>

      <ul className="check-list">
        {result.checks.map((c) => (
          <li key={c.id} className={`check-item status-${c.status}`}>
            <span className="check-icon" aria-hidden="true">
              {ICONS[c.status]}
            </span>
            <span>
              <strong>{c.label}:</strong> {c.message}
              {c.action && <span className="check-action">→ {c.action}</span>}
            </span>
          </li>
        ))}
      </ul>

      <div className="btn-row">
        {result.canContinue ? (
          <button className="primary" onClick={onContinue} disabled={busy}>
            Continue to size selection
          </button>
        ) : (
          <button className="primary" onClick={onReplace} disabled={busy}>
            Upload another photo
          </button>
        )}
        <button onClick={onReplace} disabled={busy}>
          Replace image
        </button>
      </div>
    </div>
  );
}
