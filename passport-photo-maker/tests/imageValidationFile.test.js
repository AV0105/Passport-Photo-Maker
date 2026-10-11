import { describe, it, expect } from 'vitest';
import { checkFileBasics, formatBytes } from '../src/utils/imageValidation.js';

const mk = (name, type, size) => ({ name, type, size });

describe('checkFileBasics', () => {
  it('accepts JPEG by MIME', () => {
    expect(checkFileBasics(mk('a.jpg', 'image/jpeg', 1000)).ok).toBe(true);
  });
  it('accepts PNG', () => {
    expect(checkFileBasics(mk('b.png', 'image/png', 1000)).ok).toBe(true);
  });
  it('accepts extension fallback when MIME is empty', () => {
    expect(checkFileBasics(mk('c.JPG', '', 1000)).ok).toBe(true);
  });
  it('rejects unsupported formats (scenario 6)', () => {
    const r = checkFileBasics(mk('doc.pdf', 'application/pdf', 1000));
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/Unsupported/);
  });
  it('rejects files over the size limit (scenario 7)', () => {
    const r = checkFileBasics(mk('big.jpg', 'image/jpeg', 11 * 1024 * 1024));
    expect(r.ok).toBe(false);
    expect(r.message).toMatch(/too large/);
  });
  it('rejects empty files', () => {
    expect(checkFileBasics(mk('e.jpg', 'image/jpeg', 0)).ok).toBe(false);
  });
  it('formats byte sizes', () => {
    expect(formatBytes(999)).toBe('999 B');
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(5 * 1024 * 1024)).toBe('5.00 MB');
  });
});
