/**
 * Crop geometry helpers. Pure math — no DOM access — so they are easy to test.
 *
 * A "crop" is a rectangle in SOURCE-image pixel coordinates: { x, y, width,
 * height }. The editor always keeps crop.width / crop.height equal to the
 * selected preset's aspect ratio, and export resamples that region into the
 * target pixel size. Because we only ever SELECT a rectangular region (never
 * resize axes independently), the photo can never be stretched or squashed.
 */

/**
 * Compute an initial crop (in source-image pixel coordinates) from a detected
 * face box, targeting `aspectRatio` (width/height).
 *
 * Heuristic for portrait ID photos: the face box should occupy ~65% of the
 * crop height, with extra room above the head (~20% of crop height) and below
 * the chin (~15%). If no face is available, fall back to a centered crop.
 */
export function computeInitialCrop(imgW, imgH, faceBox, aspectRatio) {
  const ar = aspectRatio > 0 ? aspectRatio : 1;

  let cropH;
  let faceCenterX = imgW / 2;
  let faceCenterY = imgH / 2;

  if (faceBox) {
    // Desired: faceHeight ≈ 0.65 * cropHeight
    cropH = Math.min(imgH, Math.max(faceBox.height / 0.65, 40));
    faceCenterX = faceBox.centerX;
    // Bias slightly upward so there's headroom above the hair line.
    faceCenterY = faceBox.centerY + faceBox.height * 0.08;
  } else {
    cropH = Math.min(imgH, imgW / ar);
  }

  let cropW = cropH * ar;
  if (cropW > imgW) {
    cropW = imgW;
    cropH = cropW / ar;
  }

  // Clamp center so the crop stays fully inside the image.
  let x = faceCenterX - cropW / 2;
  let y = faceCenterY - cropH / 2;
  x = Math.min(Math.max(0, x), imgW - cropW);
  y = Math.min(Math.max(0, y), imgH - cropH);

  return { x, y, width: cropW, height: cropH };
}

/** Clamp a crop rect to image bounds while preserving aspect ratio. */
export function clampCrop(crop, imgW, imgH, aspectRatio) {
  const ar = aspectRatio > 0 ? aspectRatio : 1;
  let { width, height, x, y } = crop;

  // Enforce aspect ratio based on the larger constrained dimension.
  if (width / height > ar) width = height * ar;
  else height = width / ar;

  width = Math.min(width, imgW);
  height = Math.min(height, imgH);
  if (width / height > ar) width = height * ar;
  else height = width / ar;

  x = Math.min(Math.max(0, x), imgW - width);
  y = Math.min(Math.max(0, y), imgH - height);

  return { x, y, width, height };
}

/** Move crop by dx/dy (source px), clamped inside the image. */
export function panCrop(crop, dx, dy, imgW, imgH, aspectRatio) {
  return clampCrop({ ...crop, x: crop.x + dx, y: crop.y + dy }, imgW, imgH, aspectRatio);
}

/**
 * Zoom around the crop centre. `factor > 1` zooms IN (smaller crop area =
 * subject looks bigger). Minimum crop keeps at least 15% of the image.
 */
export function zoomCrop(crop, factor, imgW, imgH, aspectRatio) {
  const minH = Math.max(20, imgH * 0.15);
  let newH = crop.height / factor; // factor>1 → smaller window → zoom in
  newH = Math.min(Math.max(newH, minH), imgH);
  let newW = newH * aspectRatio;
  if (newW > imgW) {
    newW = imgW;
    newH = newW / aspectRatio;
  }
  const centerX = crop.x + crop.width / 2;
  const centerY = crop.y + crop.height / 2;
  return clampCrop(
    { x: centerX - newW / 2, y: centerY - newH / 2, width: newW, height: newH },
    imgW,
    imgH,
    aspectRatio,
  );
}
