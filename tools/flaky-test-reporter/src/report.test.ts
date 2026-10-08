import { AggregateInput, CollectedRun, MAX_TESTS, aggregate, parseCandidatesFile } from './report';
import { FlakyCandidate, RunInfo } from './types';

function run(id: number, overrides: Partial<RunInfo> = {}): RunInfo {
  return {
    id,
    runNumber: id,
    headSha: `sha-${id}`,
    event: 'pull_request',
    createdAt: `2026-09-0${id}T00:00:00Z`,
    htmlUrl: `https://github.com/o/r/actions/runs/${id}`,
    ...overrides,
  };
}

function candidate(test: string, overrides: Partial<FlakyCandidate> = {}): FlakyCandidate {
  return {
    test,
    sourceJob: 'grids / generic.light',
    theme: 'generic.light',
    componentFolder: 'grids',
    timezone: 'GMT',
    platform: '',
    verdict: 'passed',
    ...overrides,
  };
}

function input(collected: CollectedRun[], overrides: Partial<AggregateInput> = {}): AggregateInput {
  return {
    repo: 'o/r',
    workflow: 'testcafe_tests.yml',
    artifact: 'flaky-candidates',
    windowHours: 48,
    branch: 'main',
    from: new Date('2026-09-01T00:00:00Z'),
    to: new Date('2026-09-03T00:00:00Z'),
    runsScanned: collected.length,
    runsUnreadable: 0,
    collected,
    ...overrides,
  };
}

describe('parseCandidatesFile', () => {
  it('reads the candidates array', () => {
    const content = JSON.stringify({ schemaVersion: 1, candidates: [candidate('a')] });
    expect(parseCandidatesFile(content)).toHaveLength(1);
  });

  it('drops entries without a test name instead of trusting them', () => {
    const content = JSON.stringify({
      schemaVersion: 1,
      candidates: [candidate('a'), { sourceJob: 'x' }, { test: '' }],
    });
    expect(parseCandidatesFile(content).map((c) => c.test)).toEqual(['a']);
  });

  it('drops an entry whose verdict is missing or unknown, rather than calling it flaky', () => {
    const content = JSON.stringify({
      schemaVersion: 1,
      candidates: [
        candidate('kept', { verdict: 'passed' }),
        candidate('kept too', { verdict: 'failed' }),
        { test: 'no verdict' },
        { test: 'bad verdict', verdict: 'maybe' },
      ],
    });

    expect(parseCandidatesFile(content).map((c) => c.test)).toEqual(['kept', 'kept too']);
  });

  it('drops an entry that is missing its matrix context, which the type claims is present', () => {
    const content = JSON.stringify({
      schemaVersion: 1,
      candidates: [candidate('kept'), { test: 'no context', verdict: 'passed' }],
    });

    expect(parseCandidatesFile(content).map((c) => c.test)).toEqual(['kept']);
  });

  it('throws when the file has no candidates array', () => {
    expect(() => parseCandidatesFile('{"tests":[]}')).toThrow(/candidates/);
  });

  it('throws on malformed JSON', () => {
    expect(() => parseCandidatesFile('not json')).toThrow();
  });
});

describe('branch scoping', () => {
  it('keeps only the candidates whose run targeted the reported branch', () => {
    const content = JSON.stringify({
      schemaVersion: 1,
      candidates: [
        candidate('on main', { baseBranch: 'main' }),
        candidate('on 26_1', { baseBranch: '26_1' }),
      ],
    });

    // parseCandidatesFile keeps both; scoping happens in collect().
    expect(parseCandidatesFile(content).map((c) => c.baseBranch)).toEqual(['main', '26_1']);
  });
});

describe('aggregate', () => {
  it('counts a test repeated across distinct commits', () => {
    const report = aggregate(
      input([
        { run: run(1), candidates: [candidate('flaky one')] },
        { run: run(2), candidates: [candidate('flaky one')] },
        { run: run(3), candidates: [candidate('flaky one')] },
      ]),
    );

    expect(report.tests).toHaveLength(1);
    expect(report.tests[0]).toMatchObject({
      test: 'flaky one',
      occurrences: 3,
      flakyConfirmed: 3,
      failedAllAttempts: 0,
      distinctShas: 3,
    });
    expect(report.totalCandidates).toBe(3);
    expect(report.runsWithCandidates).toBe(3);
  });

  it('separates rerun verdicts', () => {
    const report = aggregate(
      input([
        { run: run(1), candidates: [candidate('t', { verdict: 'passed' })] },
        { run: run(2), candidates: [candidate('t', { verdict: 'failed' })] },
      ]),
    );

    expect(report.tests[0]).toMatchObject({ flakyConfirmed: 1, failedAllAttempts: 1 });
  });

  it('does not inflate distinctShas when one commit is retried', () => {
    const report = aggregate(
      input([
        { run: run(1), candidates: [candidate('t')] },
        { run: run(2, { headSha: 'sha-1' }), candidates: [candidate('t')] },
      ]),
    );

    expect(report.tests[0]).toMatchObject({ occurrences: 2, distinctShas: 1 });
  });

  it('ranks a multi-commit flake above a single-commit blip', () => {
    const report = aggregate(
      input([
        { run: run(1), candidates: [candidate('blip'), candidate('real flake')] },
        { run: run(2), candidates: [candidate('real flake')] },
      ]),
    );

    expect(report.tests.map((t) => t.test)).toEqual(['real flake', 'blip']);
  });

  it('ranks a confirmed flake above a test that only ever failed all attempts', () => {
    const report = aggregate(
      input([
        {
          run: run(1),
          candidates: [
            candidate('regression', { verdict: 'failed' }),
            candidate('regression', { verdict: 'failed' }),
            candidate('flake', { verdict: 'passed' }),
          ],
        },
      ]),
    );

    expect(report.tests[0].test).toBe('flake');
  });

  it('collects the distinct context a test flaked in', () => {
    const report = aggregate(
      input([
        {
          run: run(1),
          candidates: [candidate('t', { theme: 'generic.light', platform: 'desktop' })],
        },
        {
          run: run(2),
          candidates: [
            candidate('t', { theme: 'material.blue.light', platform: '', sourceJob: 'editors' }),
          ],
        },
      ]),
    );

    expect(report.tests[0]).toMatchObject({
      themes: ['generic.light', 'material.blue.light'],
      platforms: ['desktop'],
      jobs: ['editors', 'grids / generic.light'],
    });
  });

  it('tracks the first and last time a test was seen', () => {
    const report = aggregate(
      input([
        { run: run(3), candidates: [candidate('t')] },
        { run: run(1), candidates: [candidate('t')] },
        { run: run(2), candidates: [candidate('t')] },
      ]),
    );

    expect(report.tests[0].firstSeen).toBe('2026-09-01T00:00:00Z');
    expect(report.tests[0].lastSeen).toBe('2026-09-03T00:00:00Z');
  });

  it('keeps every occurrence, so each one can be linked', () => {
    const collected = Array.from({ length: 7 }, (_, i) => ({
      run: run(i + 1),
      candidates: [candidate('t')],
    }));

    const report = aggregate(input(collected));

    expect(report.tests[0].occurrences).toBe(7);
    expect(report.tests[0].runUrls).toHaveLength(7);
  });

  it('does not repeat a run url when one run reports the test twice', () => {
    const report = aggregate(
      input([{ run: run(1), candidates: [candidate('t'), candidate('t')] }]),
    );

    expect(report.tests[0].occurrences).toBe(2);
    expect(report.tests[0].runUrls).toHaveLength(1);
  });

  it('truncates the test list and says so', () => {
    const candidates = Array.from({ length: MAX_TESTS + 5 }, (_, i) => candidate(`test ${i}`));
    const report = aggregate(input([{ run: run(1), candidates }]));

    expect(report.truncated).toBe(true);
    expect(report.tests).toHaveLength(MAX_TESTS);
    expect(report.totalCandidates).toBe(MAX_TESTS + 5);
  });

  it('is not truncated when everything fits', () => {
    const report = aggregate(input([{ run: run(1), candidates: [candidate('t')] }]));
    expect(report.truncated).toBe(false);
  });

  it('reports an empty window without failing', () => {
    const report = aggregate(input([], { runsScanned: 12 }));

    expect(report).toMatchObject({
      succeeded: true,
      tests: [],
      totalCandidates: 0,
      runsScanned: 12,
      runsWithCandidates: 0,
      truncated: false,
    });
  });

  it('counts runs scanned separately from runs that had candidates', () => {
    const report = aggregate(
      input(
        [
          { run: run(1), candidates: [] },
          { run: run(2), candidates: [candidate('t')] },
        ],
        { runsScanned: 40, runsUnreadable: 2 },
      ),
    );

    expect(report).toMatchObject({ runsScanned: 40, runsWithCandidates: 1, runsUnreadable: 2 });
  });
});
