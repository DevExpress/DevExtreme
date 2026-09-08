import { extractFileFromZip } from './zip';
import { makeZip } from './zip.test.utils';

describe('extractFileFromZip', () => {
  it('reads a deflated entry', () => {
    // Repetitive content so the compressor actually chooses DEFLATE.
    const content = JSON.stringify({ candidates: Array(200).fill({ test: 'a' }) });
    const zip = makeZip({ 'flaky-candidates.json': content });

    expect(extractFileFromZip(zip, 'flaky-candidates.json')?.toString('utf-8')).toBe(content);
  });

  it('reads a stored (uncompressed) entry', () => {
    const content = '{"schemaVersion":1,"candidates":[]}';
    const zip = makeZip({ 'flaky-candidates.json': content }, { deflate: false });

    expect(extractFileFromZip(zip, 'flaky-candidates.json')?.toString('utf-8')).toBe(content);
  });

  it('picks the requested entry out of several', () => {
    const zip = makeZip({ 'a.json': '"a"', 'flaky-candidates.json': '"wanted"', 'z.json': '"z"' });

    expect(extractFileFromZip(zip, 'flaky-candidates.json')?.toString('utf-8')).toBe('"wanted"');
  });

  it('round-trips non-ascii content', () => {
    const content = JSON.stringify({ test: 'Пример — юникод' });
    const zip = makeZip({ 'flaky-candidates.json': content });

    expect(extractFileFromZip(zip, 'flaky-candidates.json')?.toString('utf-8')).toBe(content);
  });

  it('returns null when the archive does not hold the file', () => {
    const zip = makeZip({ 'other.json': '{}' });

    expect(extractFileFromZip(zip, 'flaky-candidates.json')).toBeNull();
  });

  it('throws on a buffer that is not a ZIP, so a bad download is not read as an absent file', () => {
    expect(() => extractFileFromZip(Buffer.from('not a zip at all'), 'x.json')).toThrow(/ZIP/);
  });
});
