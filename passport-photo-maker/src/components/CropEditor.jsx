import { useCallback, useEffect, useRef, useState } from 'react';
import { computeInitialCrop, panCrop, zoomCrop } from '../utils/cropGeometry.js';

/**
 * Screen E: crop editor.
 *
 * Model: `crop` is a rectangle in SOURCE-image pixels matching the preset's
 * aspect ratio. The stage viewport has a FIXED aspect equal to the preset, and
 * the source <img> is scaled (cover-style) and translated so that exactly the
 * crop region fills the viewport. Because we only ever select a region — never
 * scale axes independently — the photo can never be stretched or distorted.
 *
 * Interactions: drag to reposition, slider + buttons to zoom, keyboard arrows
 * to nudge, reset to the face-detected initial crop, and replace-image.
 */
export default function CropEditor({
  img,
  imageUrl,
  preset,
  faceBox,
  onCropChange,
  onNext,
  onBack,
  onReplaceRequest,
}) {
  const [crop, setCrop] = useState(() =>
    computeInitialCrop(img.naturalWidth, img.naturalHeight, faceBox, preset.aspectRatio),
  );
  const stageRef = useRef(null);
  const [stageW, setStageW] = useState(0);
  const dragState = useRef(null);

  const imgW = img.naturalWidth;
  const imgH = img.naturalHeight;

  /* Stage sizing: width limited by container & by height budget (85vh). */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    const update = () => {
      const maxByHeight = (window.innerHeight * 0.6 * preset.aspectRatio);
      const w = Math.min(el.parentElement.clientWidth || 480, maxByHeight, 520);
      setStageW(Math.max(220, Math.floor(w)));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [preset.aspectRatio]);

  /* Re-suggest crop when the preset (aspect ratio) changes. */
  useEffect(() => {
    setCrop(computeInitialCrop(imgW, imgH, faceBox, preset.aspectRatio));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preset.id]);

  /* Report crop upward whenever it changes (App keeps the latest value). */
  useEffect(() => {
    onCropChange(crop);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crop]);

  /* ---- Rendering math ---- */
  const stageH = stageW ? Math.round(stageW / preset.aspectRatio) : 0;
  // Scale so the crop region covers the stage exactly.
  const scale = stageW > 0 ? stageW / crop.width : 1;
  const displayW = imgW * scale;
  const displayH = imgH * scale;
  const offsetX = -crop.x * scale; // img left position within stage
  const offsetY = -crop.y * scale;

  const faceMarkerStyle = faceBox
    ? {
        left: offsetX + faceBox.x * scale,
        top: offsetY + faceBox.y * scale,
        width: faceBox.width * scale,
        height: faceBox.height * scale,
      }
    : null;

  /* ---- Pointer interactions (mouse + touch via Pointer Events) ---- */
  const applyDrag = useCallback((clientX, clientY) => {
    const s = dragState.current;
    if (!s) return;
    const dxPx = clientX - s.startClientX;
    const dyPx = clientY - s.startClientY;
    // Moving finger right should reveal content on the LEFT → crop moves left.
    setCrop(
      panCrop(
        s.startCrop,
        -dxPx / s.scale,
        -dyPx / s.scale,
        imgW,
        imgH,
        preset.aspectRatio,
      ),
    );
  }, [imgW, imgH, preset.aspectRatio]);

  const onPointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId);
    dragState.current = { startClientX: e.clientX, startClientY: e.clientY, startCrop: crop, scale };
  };
  const onPointerMove = (e) => {
    if (dragState.current) applyDrag(e.clientX, e.clientY);
  };
  const onPointerUp = () => {
    dragState.current = null;
  };

  /* ---- Zoom ---- */
  const zoomPercent = Math.round((imgH / crop.height) * 100); // 100% = fully zoomed out
  const setZoomFromSlider = (value) => {
    // Slider 100..600 → relative zoom vs "whole image fits" baseline.
    const targetH = imgH / (value / 100);
    const factor = crop.height / targetH;
    setCrop(zoomCrop(crop, factor, imgW, imgH, preset.aspectRatio));
  };
  const zoomIn = () => setCrop(zoomCrop(crop, 1.2, imgW, imgH, preset.aspectRatio));
  const zoomOut = () => setCrop(zoomCrop(crop, 1 / 1.2, imgW, imgH, preset.aspectRatio));

  /* ---- Keyboard nudging for accessibility ---- */
  const onKeyDown = (e) => {
    const stepPx = crop.width * 0.04;
    const map = {
      ArrowLeft: [stepPx, 0],
      ArrowRight: [-stepPx, 0],
      ArrowUp: [0, stepPx],
      ArrowDown: [0, -stepPx],
    };
    if (map[e.key]) {
      e.preventDefault();
      const [dx, dy] = map[e.key];
      setCrop(panCrop(crop, dx, dy, imgW, imgH, preset.aspectRatio));
    } else if (e.key === '+' || e.key === '=') {
      zoomIn();
    } else if (e.key === '-') {
      zoomOut();
    }
  };

  const resetCrop = () =>
    setCrop(computeInitialCrop(imgW, imgH, faceBox, preset.aspectRatio));

  return (
    <div className="card">
      <h2>Adjust your crop — {preset.name}</h2>
      <p className="muted" style={{ marginTop: 0 }}>
        Drag the photo to position your head inside the frame. Aspect ratio is
        locked to {preset.physicalWidthMm} × {preset.physicalHeightMm} mm — the
        photo is never stretched.
      </p>

      <div
        ref={stageRef}
        className="crop-stage"
        style={{ width: stageW || '100%', height: stageH }}
        tabIndex={0}
        role="application"
        aria-label="Crop editor: drag or use arrow keys to reposition, plus and minus to zoom"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
      >
        {stageW > 0 && (
          <>
            <img
              className="source"
              src={imageUrl}
              alt=""
              draggable={false}
              style={{
                width: displayW,
                height: displayH,
                transform: `translate(${offsetX}px, ${offsetY}px)`,
              }}
            />
            {faceMarkerStyle && (
              <div className="crop-face-marker" style={faceMarkerStyle} aria-hidden="true" />
            )}
            <div className="crop-frame">
              <div className="crop-guide" />
            </div>
          </>
        )}
      </div>

      <div className="crop-controls">
        <button onClick={zoomOut} aria-label="Zoom out">−</button>
        <input
          type="range"
          min={100}
          max={600}
          step={5}
          value={Math.min(600, Math.max(100, zoomPercent))}
          onChange={(e) => setZoomFromSlider(Number(e.target.value))}
          aria-label="Zoom level"
        />
        <button onClick={zoomIn} aria-label="Zoom in">+</button>
        <span className="muted" style={{ fontSize: '0.8rem' }}>{zoomPercent}%</span>
      </div>

      {!faceBox && (
        <p className="hint">
          No automatic face suggestion was available — position the crop manually.
        </p>
      )}
      {faceBox && (
        <p className="hint">
          The green box marks the detected face. If the automatic positioning is
          off, simply drag the photo until your head sits comfortably in the frame.
        </p>
      )}

      <div className="btn-row">
        <button className="primary" onClick={onNext}>
          Preview final photo
        </button>
        <button onClick={resetCrop}>Reset crop</button>
        <button onClick={onBack}>Back</button>
        <button onClick={onReplaceRequest}>Replace image</button>
      </div>
    </div>
  );
}
