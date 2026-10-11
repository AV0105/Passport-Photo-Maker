import { describe, it, expect } from 'vitest';
import { PHOTO_PRESETS, getPresetsByCountry, findPreset } from '../src/data/photoPresets.js';

describe('photo presets', () => {
  it('every preset has required fields', () => {
    for (const p of PHOTO_PRESETS) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.country).toBeTruthy();
      expect(p.documentType).toBeTruthy();
      expect(p.widthPx).toBeGreaterThan(0);
      expect(p.heightPx).toBeGreaterThan(0);
      expect(p.physicalWidthMm).toBeGreaterThan(0);
      expect(p.physicalHeightMm).toBeGreaterThan(0);
      expect(p.background).toBeTruthy();
      expect(p.source).toBeTruthy();
    }
  });
  it('pixel targets match the physical aspect ratio', () => {
    for (const p of PHOTO_PRESETS) {
      expect(p.widthPx / p.heightPx).toBeCloseTo(p.physicalWidthMm / p.physicalHeightMm, 1);
    }
  });
  it('groups by country with India present', () => {
    const map = getPresetsByCountry();
    expect(map.India.length).toBeGreaterThanOrEqual(3);
  });
  it('findPreset returns null for unknown ids', () => {
    expect(findPreset('nope')).toBe(null);
  });
});
