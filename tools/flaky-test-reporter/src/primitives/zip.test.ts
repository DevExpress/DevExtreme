import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { extractFileFromZip } from './zip';

function makeZip(files: Record<string, string>, zipArgs: string[] = []): Buffer {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'flaky-zip-'));
  try {
    for (const [name, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(dir, name), content);
    }
    const zipPath = path.join(dir, 'out.zip');
    execFileSync('zip', ['-q', ...zipArgs, zipPath, ...Object.keys(files)], { cwd: dir });
    return fs.readFileSync(zipPath);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

describe('extractFileFromZip', () => {
  it('reads a deflated entry', () => {
    // Repetitive content so the compressor actually chooses DEFLATE.
    const content = JSON.stringify({ candidates: Array(200).fill({ test: 'a' }) });
    const zip = makeZip({ 'flaky-candidates.json': content });

    expect(extractFileFromZip(zip, 'flaky-candidates.json')?.toString('utf-8')).toBe(content);
  });

  it('reads a stored (uncompressed) entry', () => {
    const content = '{"schemaVersion":1,"candidates":[]}';
    const zip = makeZip({ 'flaky-candidates.json': content }, ['-0']);

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
