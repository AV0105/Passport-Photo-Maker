import { describe, it, expect } from 'vitest';
import {
  computeInitialCrop,
  clampCrop,
  panCrop,
  zoomCrop,
} from '../src/utils/cropGeometry.js';

const AR = 35 / 45; // portrait aspect (w/h)
const face = { x: 180, y: 100, width: 120, height: 160, right: 300, bottom: 260, centerX: 240, centerY: 180 };

describe('computeInitialCrop', () => {
  it('produces a crop matching the requested aspect ratio', () => {
    const c = computeInitialCrop(480, 640, face, AR);
    expect(c.width / c.height).toBeCloseTo(AR, 4);
  });

  it('stays fully inside the image', () => {
    const c = computeInitialCrop(480, 640, face, AR);
    expect(c.x).toBeGreaterThanOrEqual(0);
    expect(c.y).toBeGreaterThanOrEqual(0);
    expect(c.x + c.width).toBeLessThanOrEqual(480 + 1e-6);
    expect(c.y + c.height).toBeLessThanOrEqual(640 + 1e-6);
  });

  it('centers horizontally on the face', () => {
    const c = computeInitialCrop(480, 640, face, AR);
    expect(Math.abs(c.x + c.width / 2 - face.centerX)).toBeLessThan(2);
  });

  it('falls back to a centered crop without a face', () => {
    const c = computeInitialCrop(1000, 500, null, AR);
    expect(c.width / c.height).toBeCloseTo(AR, 4);
    expect(Math.abs(c.x + c.width / 2 - 500)).toBeLessThan(1);
  });

  it('handles very wide images (aspect wider than image)', () => {
    const c = computeInitialCrop(2000, 100, face, 35 / 25);
    expect(c.width).toBeLessThanOrEqual(2000);
    expect(c.height).toBeGreaterThan(0);
    expect(c.width / c.height).toBeCloseTo(35 / 25, 2);
  });
});

describe('clampCrop / panCrop', () => {
  it('keeps the crop inside bounds when panning past edges', () => {
    let c = computeInitialCrop(480, 640, face, AR);
    c = panCrop(c, -9999, -9999, 480, 640, AR);
    expect(c.x).toBe(0);
    expect(c.y).toBe(0);
    c = panCrop(c, 9999, 9999, 480, 640, AR);
    expect(c.x + c.width).toBeLessThanOrEqual(480 + 1e-6);
    expect(c.y + c.height).toBeLessThanOrEqual(640 + 1e-6);
  });

  it('preserves aspect ratio when clamping', () => {
    const c = clampCrop({ x: 10, y: 10, width: 5000, height: 5000 }, 480, 640, AR);
    expect(c.width / c.height).toBeCloseTo(AR, 4);
    expect(c.width).toBeLessThanOrEqual(480);
  });
});

describe('zoomCrop', () => {
  it('zooms in (smaller source region) and stays in bounds', () => {
    const base = computeInitialCrop(480, 640, face, AR);
    const z = zoomCrop(base, 1.5, 480, 640, AR);
    expect(z.height).toBeLessThan(base.height);
    expect(z.width / z.height).toBeCloseTo(AR, 3);
    expect(z.x).toBeGreaterThanOrEqual(0);
    expect(z.y).toBeGreaterThanOrEqual(0);
  });

  it('clamps minimum crop size', () => {
    let c = computeInitialCrop(480, 640, face, AR);
    for (let i = 0; i < 20; i++) c = zoomCrop(c, 1.5, 480, 640, AR);
    expect(c.height).toBeGreaterThanOrEqual(640 * 0.15 - 1);
  });
});
