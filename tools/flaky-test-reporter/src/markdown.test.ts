import { renderMarkdown } from './markdown';
import { AggregatedTest, FlakyTestsReport } from './types';

function test_(overrides: Partial<AggregatedTest> = {}): AggregatedTest {
  return {
    test: 'DataGrid > sorting works',
    occurrences: 3,
    flakyConfirmed: 3,
    failedAllAttempts: 0,
    distinctShas: 3,
    jobs: ['grids / generic.light'],
    themes: ['generic.light'],
    platforms: ['desktop'],
    firstSeen: '2026-09-01T00:00:00Z',
    lastSeen: '2026-09-03T00:00:00Z',
    runUrls: ['https://github.com/o/r/actions/runs/1'],
    ...overrides,
  };
}

function makeReport(overrides: Partial<FlakyTestsReport> = {}): FlakyTestsReport {
  return {
    succeeded: true,
    generatedAt: '2026-09-03T00:00:00Z',
    windowHours: 48,
    from: '2026-09-01T00:00:00Z',
    to: '2026-09-03T00:00:00Z',
    repo: 'DevExpress/devextreme',
    workflow: 'testcafe_tests.yml',
    artifact: 'flaky-candidates',
    runsScanned: 180,
    runsWithCandidates: 4,
    runsUnreadable: 0,
    totalCandidates: 6,
    truncated: false,
    tests: [test_()],
    ...overrides,
  };
}

describe('status line', () => {
  it('reports a clean window', () => {
    expect(renderMarkdown(makeReport({ tests: [], totalCandidates: 0 }))).toContain(
      '✅ no flaky candidates in 48h',
    );
  });

  it('surfaces a failed collection rather than reporting it as clean', () => {
    const description = renderMarkdown(
      makeReport({ succeeded: false, error: '401 Unauthorized', tests: [], totalCandidates: 0 }),
    );

    expect(description).toContain('collection failed');
    expect(description).toContain('401 Unauthorized');
  });

  it('counts confirmed flakes separately from tests that only ever failed', () => {
    const description = renderMarkdown(
      makeReport({
        tests: [
          test_({ test: 'a', flakyConfirmed: 2, failedAllAttempts: 0 }),
          test_({ test: 'b', flakyConfirmed: 0, failedAllAttempts: 1 }),
        ],
      }),
    );

    expect(description).toContain('1 flaky in 48h');
  });
});

describe('renderMarkdown', () => {
  it('renders the heading, window and run counts', () => {
    const description = renderMarkdown(makeReport());

    expect(description).toContain('## Flaky Test Candidates');
    expect(description).toContain('**Window:** 48h');
    expect(description).toContain('**Runs Scanned:** 180 (4 with candidates)');
  });

  it('puts each test name in its own heading, so a pipe needs no escaping', () => {
    const description = renderMarkdown(
      makeReport({ tests: [test_({ test: 'DataGrid | column fixing' })] }),
    );

    expect(description).toContain('#### `DataGrid | column fixing`');
  });

  it('gives every test a numbers-only descriptor table', () => {
    const description = renderMarkdown(
      makeReport({
        tests: [
          test_({ occurrences: 4, flakyConfirmed: 3, failedAllAttempts: 1, distinctShas: 2 }),
        ],
      }),
    );

    expect(description).toContain(
      '| Occurrences | Flaky | Failed all attempts | Distinct commits |',
    );
    expect(description).toContain('| 4 | 3 | 1 | 2 |');
  });

  it('lists every candidate, not just the first few', () => {
    const tests = Array.from({ length: 20 }, (_, i) => test_({ test: `test ${i}` }));
    const description = renderMarkdown(makeReport({ tests }));

    for (const t of tests) expect(description).toContain(`#### \`${t.test}\``);
  });

  it('collapses each entry behind a details block, leaving the counts visible', () => {
    const description = renderMarkdown(makeReport());
    const lines = description.split('\n');
    const table = lines.findIndex((l) => l.startsWith('| Occurrences'));
    const open = lines.findIndex((l, i) => l === '<details>' && i > table);

    expect(description).toContain('<summary>\u2022\u2022\u2022</summary>');
    // The numbers stay outside the block; the context goes inside it.
    expect(table).toBeLessThan(open);
    expect(description.split('<details>').at(-1)).toContain('**First seen:**');
  });

  it('includes first and last seen in each entry', () => {
    const description = renderMarkdown(
      makeReport({
        tests: [test_({ firstSeen: '2026-09-01T00:00:00Z', lastSeen: '2026-09-03T00:00:00Z' })],
      }),
    );

    expect(description).toContain('**First seen:** 2026-09-01T00:00:00Z');
    expect(description).toContain('**Last seen:** 2026-09-03T00:00:00Z');
  });

  it('offers a ready-to-paste quarantine.json for confirmed flakes only', () => {
    const description = renderMarkdown(
      makeReport({
        tests: [
          test_({ test: 'really flaky', flakyConfirmed: 4 }),
          test_({ test: 'just broken', flakyConfirmed: 0, failedAllAttempts: 3 }),
        ],
      }),
    );

    expect(description).toContain('Suggested `quarantine.json` (1)');
    expect(description).toContain('"really flaky"');
    expect(description).not.toContain('"just broken"');
  });

  it('emits the quarantine shape runner.ts actually parses', () => {
    const description = renderMarkdown(
      makeReport({ tests: [test_({ test: 'a > b' }), test_({ test: 'c > d' })] }),
    );

    const json = description.split('```json\n')[1].split('\n```')[0];

    // readQuarantinedTests() reads `{ tests: [{ test, file? }] }`; a name->array map is ignored.
    expect(JSON.parse(json)).toEqual({ tests: [{ test: 'a > b' }, { test: 'c > d' }] });
  });

  it('omits the quarantine suggestion when nothing was confirmed flaky', () => {
    const description = renderMarkdown(
      makeReport({ tests: [test_({ flakyConfirmed: 0, failedAllAttempts: 2 })] }),
    );

    expect(description).not.toContain('Suggested `quarantine.json`');
  });

  it('says so when the list was capped', () => {
    expect(renderMarkdown(makeReport({ truncated: true }))).toContain('the test list was capped');
  });

  it('mentions unreadable runs only when there are some', () => {
    expect(renderMarkdown(makeReport())).not.toContain('Runs Unreadable');
    expect(renderMarkdown(makeReport({ runsUnreadable: 3 }))).toContain('**Runs Unreadable:** 3');
  });

  it('renders a clean window without any entries', () => {
    const description = renderMarkdown(makeReport({ tests: [], totalCandidates: 0 }));

    expect(description).toContain('✅ no flaky candidates');
    expect(description).not.toContain('<details>');
  });

  it('links every run, labelled by run id', () => {
    const description = renderMarkdown(
      makeReport({
        tests: [
          test_({
            runUrls: [
              'https://github.com/o/r/actions/runs/1',
              'https://github.com/o/r/actions/runs/2',
            ],
          }),
        ],
      }),
    );

    expect(description).toContain(
      [
        '**Runs:**',
        '',
        '- [#1](https://github.com/o/r/actions/runs/1)',
        '- [#2](https://github.com/o/r/actions/runs/2)',
      ].join('\n'),
    );
  });

  it('lists a single run as a one-item list, not inline', () => {
    const description = renderMarkdown(
      makeReport({ tests: [test_({ runUrls: ['https://github.com/o/r/actions/runs/9'] })] }),
    );

    expect(description).toContain(
      ['**Runs:**', '', '- [#9](https://github.com/o/r/actions/runs/9)'].join('\n'),
    );
  });
});
