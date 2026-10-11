import { useMemo } from 'react';
import { PHOTO_PRESETS, getPresetsByCountry } from '../data/photoPresets.js';

/**
 * Screen D: country → document/format selection. Preset data lives in
 * src/data/photoPresets.js (kept out of the UI). Shows physical size, pixel
 * target, background requirement and head guidance for the chosen preset,
 * plus an honest "verify against official source" note.
 */
export default function PhotoSizeSelector({ presetId, onPresetChange, onNext, onBack }) {
  const byCountry = useMemo(() => getPresetsByCountry(), []);
  const countries = Object.keys(byCountry).sort((a, b) =>
    a === 'India' ? -1 : b === 'India' ? 1 : a.localeCompare(b),
  );

  const selected = PHOTO_PRESETS.find((p) => p.id === presetId) || null;

  return (
    <div className="card">
      <h2>Choose your photo format</h2>

      <label className="field" htmlFor="country-select">
        Country / region
      </label>
      <select
        id="country-select"
        value={selected ? selected.country : ''}
        onChange={(e) => {
          const first = byCountry[e.target.value][0];
          onPresetChange(first.id);
        }}
      >
        <option value="" disabled>
          Select a country…
        </option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      <label className="field" style={{ marginTop: 14 }} htmlFor="format-select">
        Document / photo size
      </label>
      <select
        id="format-select"
        value={presetId || ''}
        onChange={(e) => onPresetChange(e.target.value)}
      >
        {!presetId && <option value="" disabled>Select a format…</option>}
        {(selected ? byCountry[selected.country] : []).map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      {selected && (
        <div className="preset-details">
          <dl>
            <dt>Print size</dt>
            <dd>
              {selected.physicalWidthMm} × {selected.physicalHeightMm} mm
            </dd>
            <dt>Pixel target</dt>
            <dd>
              {selected.widthPx} × {selected.heightPx} px (≈{selected.dpiHint} DPI)
            </dd>
            <dt>Background</dt>
            <dd>{selected.background}</dd>
            <dt>Head position</dt>
            <dd>{selected.headGuidance}</dd>
            <dt>Source</dt>
            <dd>
              {selected.source.url ? (
                <a href={selected.source.url} target="_blank" rel="noreferrer">
                  {selected.source.note}
                </a>
              ) : (
                selected.source.note
              )}{' '}
              <em>(verified: {selected.source.verifiedAt})</em>
            </dd>
          </dl>
          <p className="muted" style={{ marginBottom: 0 }}>
            Pixel targets are derived from the print size at ~300 DPI. Setting
            pixel dimensions alone does not guarantee a correct physical print
            size — always check your authority&apos;s current official rules
            before submitting.
          </p>
        </div>
      )}

      <div className="btn-row">
        <button
          className="primary"
          disabled={!presetId}
          onClick={onNext}
        >
          Continue to crop editor
        </button>
        <button onClick={onBack}>Back</button>
      </div>
    </div>
  );
}
