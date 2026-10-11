/**
 * Browser-based face detection using MediaPipe Face Detection.
 *
 * Privacy note: the user's PHOTOGRAPH never leaves the device — detection runs
 * entirely in the browser. The only external network request is the one-time
 * download of the versioned MediaPipe model/WASM assets from a public CDN
 * (jsDelivr). No image data is transmitted. This is explained in the UI's
 * privacy notice as required by the brief.
 */

import { CONFIG } from '../config.js';

let detectorSingleton = null;
let loadPromise = null;

/**
 * Lazily create + warm up a single shared FaceDetector instance.
 * @returns {Promise<object|null>} detector or null if unavailable
 */
export async function getFaceDetector() {
  if (detectorSingleton) return detectorSingleton;
  if (!loadPromise) {
    loadPromise = createDetector().catch((err) => {
      loadPromise = null; // allow retry after failure
      throw err;
    });
  }
  return loadPromise;
}

async function createDetector() {
  // Dynamic import so the app still loads if the package fails to resolve.
  const mod = await import('@mediapipe/face_detection');
  const { FaceDetection } = mod;

  const detector = new FaceDetection({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection@0.4/${file}`,
  });

  // "short" model suits close-up portraits (selfies), which is our main use case.
  detector.setOptions({
    model: 'short',
    minDetectionConfidence: CONFIG.FACE_MIN_CONFIDENCE,
  });

  // MediaPipe is callback-driven; wrap it in a promise queue.
  detector.onResults(() => {}); // no-op; we read results from detect()

  return detector;
}

/**
 * Detect faces in an HTMLImageElement / HTMLCanvasElement.
 * Returns normalized detections with pixel bounding boxes.
 *
 * NOTE: If the model cannot be loaded (offline, blocked CDN), we return
 * `{ available: false }` so validation can mark face checks as
 * "Unable to determine" instead of hard-failing the user's photo.
 */
export async function detectFaces(imageSource) {
  let detector;
  try {
    detector = await getFaceDetector();
  } catch (err) {
    console.warn('Face detection model failed to load:', err);
    return { available: false, error: String(err && err.message ? err.message : err), faces: [] };
  }

  const width = imageSource.naturalWidth || imageSource.width;
  const height = imageSource.naturalHeight || imageSource.height;

  try {
    const results = await detector.send({ image: imageSource });
    const raw = results.detections || [];

    const faces = raw.map((d) => {
      // MediaPipe returns a relative bounding box [xmin, ymin, w, h] in
      // normalized [0,1] coordinates plus 6 keypoints (also normalized).
      const bb = d.boundingBox;
      const box = {
        x: Math.round(bb.xmin * width),
        y: Math.round(bb.ymin * height),
        width: Math.round(bb.width * width),
        height: Math.round(bb.height * height),
      };
      box.right = box.x + box.width;
      box.bottom = box.y + box.height;
      box.centerX = box.x + box.width / 2;
      box.centerY = box.y + box.height / 2;

      const keypoints = (d.keypoints || []).map((k) => ({
        name: k.name || '',
        x: Math.round(k.x * width),
        y: Math.round(k.y * height),
      }));

      return {
        confidence: typeof d.score === 'number' ? d.score : null,
        box,
        keypoints,
      };
    });

    // Keep only confident detections, largest first.
    faces.sort(
      (a, b) => b.box.height * b.box.width - a.box.height * a.box.width,
    );

    return { available: true, faces };
  } catch (err) {
    console.warn('Face detection run failed:', err);
    return { available: false, error: String(err && err.message ? err.message : err), faces: [] };
  }
}

/** Release underlying WASM resources (called on full app reset). */
export async function disposeFaceDetector() {
  if (detectorSingleton) {
    try {
      await detectorSingleton.close();
    } catch {
      /* ignore */
    }
    detectorSingleton = null;
    loadPromise = null;
  }
}
