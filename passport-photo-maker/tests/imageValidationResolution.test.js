/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/utils/faceDetection.js', () => ({
  detectFaces: vi.fn().mockResolvedValue({ available: false, faces: [] }),
}));

import { validateImage } from '../src/utils/imageValidation.js';

describe('validateImage resolution check', () => {
  beforeEach(() => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  });

  it('allows a 480x640 selfie to proceed to cropping with a resolution warning', async () => {
    const result = await validateImage({
      file: { size: 1000 },
      img: { naturalWidth: 480, naturalHeight: 640 },
    });

    const resolution = result.checks.find((check) => check.id === 'resolution');
    expect(resolution.status).toBe('warning');
    expect(result.canContinue).toBe(true);
  });
});
