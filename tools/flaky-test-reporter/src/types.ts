export const FLAKY_TESTS_REPORT_FILENAME = 'flaky-tests-report.json';

/** Verdict of the quarantine rerun. `passed` means the test is genuinely flaky. */
export type FlakyVerdict = 'passed' | 'failed';

/**
 * `flaky-candidates.json` as produced by the quarantine job of `testcafe_tests.yml`.
 * One file per workflow run.
 */
export interface FlakyCandidate {
  test: string;
  sourceJob: string;
  theme: string;
  componentFolder: string;
  timezone: string;
  platform: string;
  verdict: FlakyVerdict;
}

export interface FlakyCandidatesFile {
  schemaVersion: number;
  candidates: FlakyCandidate[];
}

/** Run metadata the collector attaches to every candidate it reads. */
export interface RunInfo {
  id: number;
  runNumber: number;
  headSha: string;
  event: string;
  createdAt: string;
  htmlUrl: string;
}

export interface AggregatedTest {
  test: string;
  /** How many times the test was forwarded as a flaky candidate in the window. */
  occurrences: number;
  /** Occurrences that passed the quarantine rerun — genuinely flaky. */
  flakyConfirmed: number;
  /** Occurrences that failed all attempts — more likely a real regression. */
  failedAllAttempts: number;
  /** Distinct head commits the test flaked on. The strongest flakiness signal. */
  distinctShas: number;
  jobs: string[];
  themes: string[];
  platforms: string[];
  firstSeen: string;
  lastSeen: string;
  runUrls: string[];
}

export interface FlakyTestsReport {
  succeeded: boolean;
  error?: string;
  generatedAt: string;
  windowHours: number;
  from: string;
  to: string;
  repo: string;
  workflow: string;
  artifact: string;
  runsScanned: number;
  runsWithCandidates: number;
  runsUnreadable: number;
  totalCandidates: number;
  /** True when `tests` was capped, so the report is not the full picture. */
  truncated: boolean;
  tests: AggregatedTest[];
}
