/* Global configuration knobs for the Passport Photo Maker MVP.
   These are product-level thresholds, NOT official passport requirements. */

export const CONFIG = {
  // Upload constraints
  ACCEPTED_MIME_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png'],
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB (configurable per brief)

  // Minimum source resolution (product threshold; presets may demand more)
  MIN_RESOLUTION: { width: 600, height: 600 },

  // Face-detection / suitability thresholds
  FACE_MIN_CONFIDENCE: 0.5,          // ignore low-confidence detections
  FACE_MIN_HEIGHT_RATIO: 0.12,       // face must be >= 12% of image height
  FACE_EDGE_MARGIN_RATIO: 0.03,      // how close to an edge triggers a warning
  FACE_EDGE_MARGIN_FAIL: 0.0,        // touching/cut off by edge -> fail-ish warn
  BLUR_LOW_VAR_THRESHOLD: 70,        // variance-of-Laplacian below this = blurry
  BLUR_UNCERTAIN_VAR_THRESHOLD: 140, // below this = possible blur (warning only)

  // Export defaults
  DEFAULT_EXPORT: 'jpeg',            // 'jpeg' | 'png'
  JPEG_QUALITY: 0.92,
};
