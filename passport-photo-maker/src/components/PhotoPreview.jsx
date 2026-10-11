import { formatBytes } from '../utils/imageValidation.js';

/**
 * Screen B: preview the uploaded image with its original dimensions and file
 * size; replace / remove actions; proceed-to-validation button.
 */
export default function PhotoPreview({
  file,
  img,
  imageUrl,
  onReplaceRequest,
  onRemove,
  onValidate,
  busy,
}) {
  return (
    <div className="card">
      <h2>Your photo</h2>

      <img
        className="preview-img"
        src={imageUrl}
        alt="The photograph you just uploaded"
      />

      <div className="meta-grid">
        <div className="meta-item">
          <b>Width</b>
          {img.naturalWidth} px
        </div>
        <div className="meta-item">
          <b>Height</b>
          {img.naturalHeight} px
        </div>
        <div className="meta-item">
          <b>File size</b>
          {formatBytes(file.size)}
        </div>
        <div className="meta-item">
          <b>Format</b>
          {(file.type || 'image').replace('image/', '').toUpperCase()}
        </div>
      </div>

      <div className="btn-row">
        <button className="primary" onClick={onValidate} disabled={busy}>
          {busy ? (
            <>
              <span className="spinner" aria-hidden="true" /> Checking…
            </>
          ) : (
            'Check photo suitability'
          )}
        </button>
        <button onClick={onReplaceRequest} disabled={busy}>
          Replace image
        </button>
        <button className="danger" onClick={onRemove} disabled={busy}>
          Remove photo
        </button>
      </div>
    </div>
  );
}
