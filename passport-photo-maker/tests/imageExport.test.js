/**
 * @vitest-environment jsdom
 * Canvas export tests using the `canvas` npm package (node-canvas) so
 * document.createElement('canvas') works headlessly.
 */
import { describe, it, expect } from 'vitest';
import { createCanvas, loadImage } from 'canvas';
import { renderCropToCanvas, canvasToDataUrl, exportCrop } from '../src/utils/imageExport.js';

// Build a 1200x900 test "photo" with a distinct pattern.
async function makeSourceImage() {
  const c = createCanvas(1200, 900);
  const ctx = c.getContext('2d');
  for (let y = 0; y < 900; y += 50) {
    for (let x = 0; x < 1200; x += 50) {
      ctx.fillStyle = (x + y) % 100 === 0 ? '#ff8800' : '#2452ff';
      ctx.fillRect(x, y, 50, 50);
    }
  }
  // Load back as an image-like object accepted by drawImage in node-canvas.
  return c; // node-canvas canvases are valid drawImage sources
}

const preset = { widthPx: 413, heightPx: 531 };

describe('canvas export', () => {
  it('renders exactly the target pixel dimensions', async () => {
    const src = await makeSourceImage();
    const crop = { x: 300, y: 100, width: 600, height: 771.4 };
    const out = renderCropToCanvas(src, crop, preset.widthPx, preset.heightPx);
    expect(out.width).toBe(413);
    expect(out.height).toBe(531);
  });

  it('renders small crops without the intermediate downscale path', async () => {
    const src = await makeSourceImage();
    const crop = { x: 0, y: 0, width: 500, height: 642 };
    const out = renderCropToCanvas(src, crop, 413, 531);
    expect(out.width).toBe(413);
  });

  it('produces a JPEG data URL', async () => {
    const src = await makeSourceImage();
    const out = renderCropToCanvas(src, { x: 100, y: 100, width: 413, height: 531 }, 413, 531);
    const url = await canvasToDataUrl(out, 'jpeg');
    expect(url.startsWith('data:image/jpeg')).toBe(true);
  });

  it('produces a PNG data URL', async () => {
    const src = await makeSourceImage();
    const out = renderCropToCanvas(src, { x: 100, y: 100, width: 413, height: 531 }, 413, 531);
    const url = await canvasToDataUrl(out, 'png');
    expect(url.startsWith('data:image/png')).toBe(true);
  });

  it('composites transparent image areas onto white', () => {
    const src = createCanvas(100, 100);
    const ctx = src.getContext('2d');
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(25, 25, 50, 50);

    const out = renderCropToCanvas(src, { x: 0, y: 0, width: 100, height: 100 }, 100, 100);
    const pixel = out.getContext('2d').getImageData(0, 0, 1, 1).data;
    expect(Array.from(pixel)).toEqual([255, 255, 255, 255]);
  });

  it('exportCrop returns configured dimensions', async () => {
    const src = await makeSourceImage();
    const res = await exportCrop({
      img: src,
      crop: { x: 200, y: 50, width: 600, height: 771 },
      preset,
      format: 'jpeg',
    });
    expect(res.width).toBe(413);
    expect(res.height).toBe(531);
    expect(res.dataUrl.length).toBeGreaterThan(100);
  });

  it('handles export failure gracefully (scenario 13)', async () => {
    // A broken source that throws inside drawImage should reject, not crash.
    const fakeBroken = { naturalWidth: 10, naturalHeight: 10 };
    await expect(
      exportCrop({
        img: fakeBroken,
        crop: { x: 0, y: 0, width: 10, height: 12 },
        preset: { widthPx: 10, heightPx: 12 },
        format: 'jpeg',
      }),
    ).rejects.toBeDefined();
  });
});
