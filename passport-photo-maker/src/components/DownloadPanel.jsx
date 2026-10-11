import { useEffect, useState } from 'react';
import { exportCrop, downloadDataUrl } from '../utils/imageExport.js';

/**
 * Screen F: final preview + download. Generates the output image with the
 * Canvas API at the preset's exact pixel dimensions, shows it before download,
 * and offers JPEG/PNG export, edit-crop, and start-over actions. Export errors
 * are surfaced with a retry — we never show a success state prematurely.
 */
export default function DownloadPanel({ img, fileName, crop, preset, onEditCrop, onStartOver }) {
  const [format, setFormat] = useState('jpeg');
  const [output, setOutput] = useState(null); // { dataUrl, width, height }
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

  /* (Re)generate whenever crop/preset/format changes. */
  useEffect(() => {
    let cancelled = false;
    setBusy(true);
    setError(null);
    setOutput(null);
    setDownloaded(false);
    // Defer to next tick so the UI can paint the loading state first.
    const t = setTimeout(() => {
      try {
        exportCrop({ img, crop, preset, format })
          .then((res) => {
            if (!cancelled) setOutput(res);
          })
          .catch((err) => {
            if (!cancelled) setError(err.message || 'Image export failed.');
          })
          .finally(() => {
            if (!cancelled) setBusy(false);
          });
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Image export failed.');
          setBusy(false);
        }
      }
    }, 30);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [img, crop, preset, format]);

  const handleDownload = () => {
    if (!output) return;
    const base = (fileName || 'passport-photo').replace(/\.[a-z]+$/i, '');
    const ok = downloadDataUrl(output.dataUrl, `${base}-${preset.id}.${format === 'png' ? 'png' : 'jpg'}`);
    if (ok) {
      setDownloaded(true);
    } else {
      setError('Your browser blocked the download. Try right-clicking the preview and choosing “Save image as…”.');
    }
  };

  return (
    <div className="card">
      <h2>Your finished photo</h2>

      <div className="meta-grid">
        <div className="meta-item"><b>Format</b>{preset.name}</div>
        <div className="meta-item">
          <b>Pixel dimensions</b>
          {output ? `${output.width} × ${output.height} px` : `${preset.widthPx} × ${preset.heightPx} px`}
        </div>
        <div className="meta-item"><b>Print size</b>{preset.physicalWidthMm} × {preset.physicalHeightMm} mm at ≈{preset.dpiHint} DPI</div>
      </div>

      <div className="final-preview-wrap">
        {busy && (
          <div className="loading-line" style={{ justifyContent: 'center' }}>
            <span className="spinner" aria-hidden="true" /> Generating final image…
          </div>
        )}
        {!busy && error && (
          <div className="error-banner" role="alert">
            {error}{' '}
            <button onClick={() => setFormat(format)} style={{ marginLeft: 8 }}>
              Retry export
            </button>
          </div>
        )}
        {!busy && !error && output && (
          <img
            className="final-preview"
            src={output.dataUrl}
            alt={`Final passport photo preview, ${output.width} by ${output.height} pixels`}
          />
        )}
      </div>

      <p className="hint">
        For best prints, print at {preset.dpiHint} DPI so the photo measures{' '}
        {preset.physicalWidthMm} × {preset.physicalHeightMm} mm on paper. Pixel
        dimensions alone do not guarantee physical print size. This tool does
        not guarantee acceptance by any passport authority.
      </p>

      <div className="btn-row" style={{ alignItems: 'center' }}>
        <div className="format-toggle" role="group" aria-label="Export file type">
          <button
            className={format === 'jpeg' ? 'active' : ''}
            onClick={() => setFormat('jpeg')}
            disabled={busy}
          >
            JPEG
          </button>
          <button
            className={format === 'png' ? 'active' : ''}
            onClick={() => setFormat('png')}
            disabled={busy}
          >
            PNG
          </button>
        </div>

        <button className="primary" onClick={handleDownload} disabled={busy || !!error || !output}>
          {downloaded ? 'Download again' : 'Download photo'}
        </button>
        <button onClick={onEditCrop} disabled={busy}>
          Edit crop
        </button>
        <button className="danger" onClick={onStartOver}>
          Start over
        </button>
      </div>

      {downloaded && (
        <p className="muted" role="status" style={{ marginTop: 10 }}>
          Photo saved to your device. Remember to verify the current official
          requirements before submitting your application.
        </p>
      )}
    </div>
  );
}
