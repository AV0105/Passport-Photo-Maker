/**
 * Image loading + validation utilities. All processing happens locally in the
 * browser (File API + Canvas API). Nothing is uploaded anywhere.
 */

import { CONFIG } from '../config.js';
import { detectFaces } from './faceDetection.js';

/* ------------------------------------------------------------------ */
/* File-level checks                                                   */
/* ------------------------------------------------------------------ */

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes)) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Step 1a: check extension/MIME type and file size. Returns {ok, message}. */
export function checkFileBasics(file) {
  const name = (file.name || '').toLowerCase();
  const extOk = CONFIG.ACCEPTED_EXTENSIONS.some((e) => name.endsWith(e));
  const mimeOk = CONFIG.ACCEPTED_MIME_TYPES.includes(file.type);

  // Some browsers report an empty MIME for .jpg — fall back to extension.
  if (!mimeOk && !extOk) {
    return {
      ok: false,
      message: 'Unsupported file format. Please upload a JPEG or PNG image.',
    };
  }
  if (file.size > CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      ok: false,
      message: `File is too large (${formatBytes(file.size)}). Maximum allowed size is ${formatBytes(
        CONFIG.MAX_FILE_SIZE_BYTES,
      )}.`,
    };
  }
  if (file.size === 0) {
    return { ok: false, message: 'The file appears to be empty.' };
  }
  return { ok: true };
}

/**
 * Step 1b: decode the file into an HTMLImageElement. Rejects corrupt or
 * truncated files (decode failure = hard failure).
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => resolve({ img, url });
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read this image. The file may be corrupt or unsupported.'));
    };
    img.src = url;
  });
}

/* ------------------------------------------------------------------ */
/* Quality helpers                                                     */
/* ------------------------------------------------------------------ */

/**
 * Lightweight blur estimate: variance of the Laplacian on a downscaled
 * grayscale copy. Blurred images have low high-frequency energy → low
 * variance. Computed at ~256px wide so it's fast and scale-independent-ish.
 * Returns the variance value, or null if it cannot be computed.
 */
export function estimateBlurVariance(img) {
  try {
    const W = 256;
    const ratio = W / img.naturalWidth;
    const H = Math.max(2, Math.round(img.naturalHeight * ratio));
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, W, H);
    const data = ctx.getImageData(0, 0, W, H).data;

    // Grayscale buffer
    const gray = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) {
      gray[i] = 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
    }

    // 4-neighbour Laplacian kernel; collect responses away from borders.
    let sum = 0;
    let sumSq = 0;
    let n = 0;
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        const i = y * W + x;
        const lap =
          4 * gray[i] - gray[i - 1] - gray[i + 1] - gray[i - W] - gray[i + W];
        sum += lap;
        sumSq += lap * lap;
        n++;
      }
    }
    if (n === 0) return null;
    const mean = sum / n;
    return sumSq / n - mean * mean; // variance
  } catch {
    return null; // tainted canvas or memory issue — treat as "unable"
  }
}

/* ------------------------------------------------------------------ */
/* Full validation pipeline (Steps 1–7 of the brief)                   */
/* ------------------------------------------------------------------ */

/**
 * Runs every suitability check and returns a structured result:
 * {
 *   status: 'pass' | 'warn' | 'fail' | 'unknown',
 *   overall: human label,
 *   checks: [{ id, label, status: 'passed'|'warning'|'failed'|'unknown', message, action? }],
 *   faces, faceInfo, canContinue
 * }
 *
 * Hard failures block progress; warnings allow the user to continue with an
 * explicit acknowledgement. Face checks become 'unknown' when the detection
 * model itself could not run — we never hard-fail on tooling problems.
 */
export async function validateImage({ file, img }) {
  const checks = [];
  const push = (c) => checks.push(c);

  /* ---- Check 1: decoding (already done if we have img) ---- */
  push({
    id: 'decodable',
    label: 'Image readable',
    status: 'passed',
    message: 'The image was decoded successfully.',
  });

  /* ---- Check 2: resolution ---- */
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const minW = CONFIG.MIN_RESOLUTION.width;
  const minH = CONFIG.MIN_RESOLUTION.height;
  if (w < minW || h < minH) {
    push({
      id: 'resolution',
      label: 'Resolution',
      status: 'warning',
      message: `Image is ${w}×${h}px, below the recommended ${minW}×${minH}px. It can still be cropped, but the exported photo may look soft or pixelated.`,
      action: 'For best quality, use the original camera photo at its highest resolution.',
    });
  } else {
    push({
      id: 'resolution',
      label: 'Resolution',
      status: 'passed',
      message: `${w}×${h}px — plenty of detail for passport-size output.`,
    });
  }

  /* ---- Checks 3–5: face detection, count, size & position ---- */
  const det = await detectFaces(img);

  if (!det.available) {
    push({
      id: 'face-detection',
      label: 'Face detection',
      status: 'unknown',
      message:
        'Face detection could not run (the model may still be downloading, or your browser blocked it). You can continue, but automatic crop suggestions are unavailable.',
    });
  } else {
    const faces = det.faces;
    if (faces.length === 0) {
      push({
        id: 'face-count',
        label: 'Face found',
        status: 'failed',
        message: 'No face detected.',
        action: 'Upload a clear portrait with your face visible and looking at the camera.',
      });
    } else if (faces.length > 1) {
      push({
        id: 'face-count',
        label: 'One face only',
        status: 'failed',
        message: `Multiple faces detected (${faces.length}).`,
        action: 'Please upload a photograph containing one person.',
      });
    } else {
      push({
        id: 'face-count',
        label: 'One face only',
        status: 'passed',
        message: 'Exactly one face detected.',
      });

      const face = faces[0];
      const faceRatio = face.box.height / h;

      // Check 4: face large enough to survive cropping
      if (faceRatio < CONFIG.FACE_MIN_HEIGHT_RATIO) {
        push({
          id: 'face-size',
          label: 'Face size',
          status: 'warning',
          message: 'The face is quite small in the frame; the cropped photo may look soft.',
          action: 'Consider uploading a photo taken closer to the subject.',
        });
      } else {
        push({
          id: 'face-size',
          label: 'Face size',
          status: 'passed',
          message: 'The face is large enough for a quality crop.',
        });
      }

      // Check 5: position / edge proximity. MediaPipe boxes include hair to
      // chin; being flush against an edge usually means the head is cut off.
      const m = CONFIG.FACE_EDGE_MARGIN_RATIO;
      // "Touching" the edge (within 1px) usually means the head is cut off.
      const touchingEdge =
        face.box.x <= 1 ||
        face.box.y <= 1 ||
        face.box.right >= w - 1 ||
        face.box.bottom >= h - 1;
      const nearEdge =
        face.box.x < w * m ||
        face.box.y < h * m ||
        face.box.right > w * (1 - m) ||
        face.box.bottom > h * (1 - m);

      if (touchingEdge) {
        push({
          id: 'face-position',
          label: 'Face position',
          status: 'warning',
          message: 'The face touches the edge of the photo — part of the head may be cut off.',
          action: 'Try another photograph or adjust the crop manually.',
        });
      } else if (nearEdge) {
        push({
          id: 'face-position',
          label: 'Face position',
          status: 'warning',
          message: 'The face is close to the edge of the photo.',
          action: 'You may need to adjust the crop, or try another photograph.',
        });
      } else {
        push({
          id: 'face-position',
          label: 'Face position',
          status: 'passed',
          message: 'The face is well positioned within the frame.',
        });
      }
    }
  }

  /* ---- Check 6: blur (best-effort; never a sole hard failure) ---- */
  const blurVar = estimateBlurVariance(img);
  if (blurVar === null) {
    push({
      id: 'sharpness',
      label: 'Sharpness',
      status: 'unknown',
      message: 'Sharpness could not be estimated for this image.',
    });
  } else if (blurVar < CONFIG.BLUR_LOW_VAR_THRESHOLD) {
    push({
      id: 'sharpness',
      label: 'Sharpness',
      status: 'warning',
      message: 'This image may be blurry.',
      action: 'Upload a sharper photograph for best results.',
    });
  } else if (blurVar < CONFIG.BLUR_UNCERTAIN_VAR_THRESHOLD) {
    push({
      id: 'sharpness',
      label: 'Sharpness',
      status: 'unknown',
      message: 'Sharpness is uncertain — please double-check the preview looks crisp.',
    });
  } else {
    push({
      id: 'sharpness',
      label: 'Sharpness',
      status: 'passed',
      message: 'No obvious blur detected.',
    });
  }

  /* ---- Step 7: aggregate ---- */
  const anyFailed = checks.some((c) => c.status === 'failed');
  const anyWarn = checks.some((c) => c.status === 'warning');
  const anyUnknown = checks.some((c) => c.status === 'unknown');

  let status = 'pass';
  if (anyFailed) status = 'fail';
  else if (anyWarn) status = 'warn';
  else if (anyUnknown) status = 'unknown';

  return {
    status,
    overall: anyFailed
      ? 'Photo not suitable yet'
      : anyWarn || anyUnknown
        ? 'Photo looks suitable (with notes)'
        : 'Suitable for editing',
    checks,
    faces: det.faces,
    primaryFace: det.faces.length === 1 ? det.faces[0] : null,
    detectorAvailable: det.available,
    canContinue: !anyFailed,
    meta: { width: w, height: h, fileSize: file ? file.size : null },
  };
}
