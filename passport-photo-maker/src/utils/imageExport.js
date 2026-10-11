/**
 * Canvas-based image export. Produces a JPEG/PNG data URL at the preset's
 * target pixel dimensions from a crop rectangle (source-image coordinates).
 */

import { CONFIG } from '../config.js';

/**
 * Render `crop` region of `img` into an offscreen canvas at exactly
 * (widthPx × heightPx). Uses stepwise downscaling when shrinking a lot,
 * which preserves quality far better than a single drawImage call.
 *
 * Throws on failure (e.g. memory pressure); callers must handle it.
 */
export function renderCropToCanvas(img, crop, widthPx, heightPx) {
  const canvas = document.createElement('canvas');
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser blocked canvas rendering.');

  // Fill white first so transparent PNG areas don't turn black in JPEG export.
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, widthPx, heightPx);

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  const srcW = crop.width;
  const srcH = crop.height;

  // Stepwise halving for large downscales (classic high-quality resample).
  // We draw the crop into an intermediate canvas no larger than the source,
  // then halve repeatedly until within 2× of the target, then final draw.
  const useIntermediate = srcW > widthPx * 2;
  let workCanvas = canvas;
  let workCtx = ctx;
  if (useIntermediate) {
    workCanvas = document.createElement('canvas');
    workCtx = workCanvas.getContext('2d');
    // Start at the crop size (capped to guard against max canvas dimensions),
    // keeping the crop's own aspect ratio.
    const cap = Math.min(1, 4096 / srcW);
    workCanvas.width = Math.max(1, Math.round(srcW * cap));
    workCanvas.height = Math.max(1, Math.round(srcH * cap));
    workCtx.imageSmoothingQuality = 'high';
    workCtx.drawImage(img, crop.x, crop.y, srcW, srcH, 0, 0, workCanvas.width, workCanvas.height);

    // Repeatedly halve while still more than 2× wider than the target.
    while (workCanvas.width / 2 >= widthPx) {
      const prev = workCanvas;
      workCanvas = document.createElement('canvas');
      workCanvas.width = Math.max(widthPx, Math.round(prev.width / 2));
      workCanvas.height = Math.max(1, Math.round((prev.height * workCanvas.width) / prev.width));
      workCtx = workCanvas.getContext('2d');
      workCtx.imageSmoothingQuality = 'high';
      workCtx.drawImage(prev, 0, 0, workCanvas.width, workCanvas.height);
    }

    ctx.drawImage(workCanvas, 0, 0, widthPx, heightPx);
  } else {
    ctx.drawImage(img, crop.x, crop.y, srcW, srcH, 0, 0, widthPx, heightPx);
  }

  return canvas;
}

/** Convert a canvas to a data URL. Rejects gracefully if the browser refuses. */
export function canvasToDataUrl(canvas, format = CONFIG.DEFAULT_EXPORT) {
  return new Promise((resolve, reject) => {
    try {
      if (format === 'png') {
        const url = canvas.toDataURL('image/png');
        if (!url || url.length < 50) throw new Error('PNG export returned empty data.');
        resolve(url);
      } else {
        const url = canvas.toDataURL('image/jpeg', CONFIG.JPEG_QUALITY);
        if (!url || url.length < 50) throw new Error('JPEG export returned empty data.');
        resolve(url);
      }
    } catch (err) {
      reject(new Error('Image export failed. Try a smaller photo or a different browser.'));
    }
  });
}

/** Trigger a browser download for a data URL. Returns false if blocked/failed. */
export function downloadDataUrl(dataUrl, filename) {
  try {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    return true;
  } catch {
    return false;
  }
}

/** Full pipeline: crop → canvas → data URL. Never throws silently. */
export async function exportCrop({ img, crop, preset, format }) {
  const canvas = renderCropToCanvas(img, crop, preset.widthPx, preset.heightPx);
  const fmt = format || CONFIG.DEFAULT_EXPORT;
  const dataUrl = await canvasToDataUrl(canvas, fmt);
  return { dataUrl, width: preset.widthPx, height: preset.heightPx, format: fmt };
}
