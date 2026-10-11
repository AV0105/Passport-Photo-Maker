import { useRef, useState } from 'react';
import { CONFIG } from '../config.js';
import { checkFileBasics, formatBytes } from '../utils/imageValidation.js';

/**
 * Landing + upload screen: drag-and-drop zone, file picker button,
 * supported formats / size limit, shooting guidelines and privacy notice.
 * File-level validation (type/size) happens here; decoding errors are
 * surfaced by the parent's onFile handler.
 */
export default function PhotoUploader({ onFile, busy }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);

  const handleFiles = (files) => {
    setError(null);
    const file = files && files[0];
    if (!file) return;
    const result = checkFileBasics(file);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    onFile(file);
  };

  return (
    <div className="card">
      <h2>Create Your Passport Photo</h2>
      <p className="muted">
        Upload a photograph, we check it is suitable, you pick a size, adjust the
        crop, and download the finished photo — all in seconds, right here in
        your browser.
      </p>

      <div
        className={`dropzone${dragOver ? ' dragover' : ''}`}
        role="button"
        tabIndex={0}
        aria-label="Upload a photo: drag and drop, or press Enter to browse files"
        onClick={() => !busy && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !busy) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (!busy) handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="icon" aria-hidden="true">📷</div>
        <p><strong>Drag &amp; drop your photo here</strong></p>
        <p className="muted">or</p>
        <button
          type="button"
          className="primary"
          disabled={busy}
          onClick={(e) => {
            e.stopPropagation();
            inputRef.current?.click();
          }}
        >
          Choose file
        </button>
        <p className="formats-note">
          Supported: JPEG / JPG and PNG · Max file size:{' '}
          {formatBytes(CONFIG.MAX_FILE_SIZE_BYTES)}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = ''; // allow re-selecting the same file later
          }}
        />
      </div>

      {error && (
        <div className="error-banner" role="alert">
          {error}
        </div>
      )}

      <div className="row" style={{ marginTop: 18 }}>
        <div className="col">
          <h3>Taking a good photo</h3>
          <ul className="muted" style={{ paddingLeft: 18, margin: 0 }}>
            <li>Face the camera directly with a neutral expression.</li>
            <li>Use a plain, light, uniform background.</li>
            <li>Ensure even lighting without harsh shadows.</li>
            <li>Keep your whole head visible — not cut off by the frame edge.</li>
            <li>Take the photo at arm&apos;s length or closer for best detail.</li>
          </ul>
        </div>
        <div className="col">
          <h3>Your privacy</h3>
          <p className="muted" style={{ margin: 0 }}>
            Your photograph is processed entirely on your device using your
            browser&apos;s built-in image tools. It is never uploaded to a server
            and is never saved after you close this page. The only network
            request this app makes is a one-time download of the open-source
            face-detection model files (which contain no personal data).
          </p>
        </div>
      </div>
    </div>
  );
}
