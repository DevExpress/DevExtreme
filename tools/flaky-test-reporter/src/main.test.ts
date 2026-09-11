import { parseArgs } from './main';

const flags = [
  '--repo',
  'o/r',
  '--workflow',
  'testcafe_tests.yml',
  '--artifact',
  'flaky-candidates',
  '--branch',
  'main',
  '--window-hours',
  '48',
  '--out-json',
  'report.json',
  '--out-markdown',
  'report.md',
];

describe('parseArgs', () => {
  it('parses the flags', () => {
    expect(parseArgs(flags)).toMatchObject({
      repo: 'o/r',
      workflow: 'testcafe_tests.yml',
      artifact: 'flaky-candidates',
      branch: 'main',
      windowHours: 48,
      outJson: 'report.json',
      outMarkdown: 'report.md',
    });
  });

  it('parses identically when invoked through `pnpm run <script> --`, which forwards the separator', () => {
    expect(parseArgs(['--', ...flags])).toMatchObject(parseArgs(flags));
  });

  it('rejects an unknown flag rather than silently ignoring it', () => {
    expect(() => parseArgs([...flags, '--bogus', '1'])).toThrow();
  });

  it('rejects a missing required flag', () => {
    expect(() => parseArgs(['--repo', 'o/r'])).toThrow(/Missing required argument/i);
  });
});
