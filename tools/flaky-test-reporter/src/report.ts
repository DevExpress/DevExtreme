import { GitHubOptions, downloadArtifactFile, findArtifactId, listRuns } from './primitives/github';
import {
  AggregatedTest,
  FlakyCandidate,
  FlakyCandidatesFile,
  FlakyTestsReport,
  RunInfo,
} from './types';
import { mapWithConcurrency, warn } from './utils';

/**
 * The rendered markdown ends up in a GitHub issue body, which is capped at 65,536 characters
 * and already carries the monitor's own sections. Twenty entries leave comfortable room.
 */
export const MAX_TESTS = 20;
const DOWNLOAD_CONCURRENCY = 8;
const CANDIDATES_FILENAME = 'flaky-candidates.json';

export interface CollectedRun {
  run: RunInfo;
  candidates: FlakyCandidate[];
}

export interface AggregateInput {
  repo: string;
  workflow: string;
  artifact: string;
  windowHours: number;
  from: Date;
  to: Date;
  runsScanned: number;
  runsUnreadable: number;
  collected: CollectedRun[];
}

/**
 * A candidate file written by an older workflow revision must not abort the sweep, so
 * anything unrecognised is dropped rather than trusted.
 */
/** Matrix context every candidate carries; empty strings are normal, missing ones are not. */
const CONTEXT_FIELDS = ['sourceJob', 'theme', 'componentFolder', 'timezone', 'platform'] as const;

export function parseCandidatesFile(content: string): FlakyCandidate[] {
  const parsed: unknown = JSON.parse(content);
  const candidates = (parsed as FlakyCandidatesFile | null)?.candidates;

  if (!Array.isArray(candidates)) {
    throw new Error('missing "candidates" array');
  }

  return candidates.filter(
    (candidate): candidate is FlakyCandidate =>
      typeof candidate?.test === 'string'
      && candidate.test.length > 0
      // aggregate() reads anything that is not 'failed' as a confirmed flake, so an entry
      // with a missing or unknown verdict would be recommended for quarantine.
      && (candidate.verdict === 'passed' || candidate.verdict === 'failed')
      // The predicate claims a whole FlakyCandidate, so every field has to hold.
      && CONTEXT_FIELDS.every((field) => typeof candidate[field] === 'string'),
  );
}

function sortedUnique(values: Iterable<string>): string[] {
  return [...new Set([...values].filter(Boolean))].sort();
}

export function aggregate(input: AggregateInput): FlakyTestsReport {
  interface Accumulator {
    occurrences: number;
    flakyConfirmed: number;
    failedAllAttempts: number;
    shas: Set<string>;
    jobs: Set<string>;
    themes: Set<string>;
    platforms: Set<string>;
    firstSeen: string;
    lastSeen: string;
    runUrls: string[];
  }

  const byTest = new Map<string, Accumulator>();
  let totalCandidates = 0;

  for (const { run, candidates } of input.collected) {
    for (const candidate of candidates) {
      totalCandidates += 1;

      let acc = byTest.get(candidate.test);
      if (!acc) {
        acc = {
          occurrences: 0,
          flakyConfirmed: 0,
          failedAllAttempts: 0,
          shas: new Set(),
          jobs: new Set(),
          themes: new Set(),
          platforms: new Set(),
          firstSeen: run.createdAt,
          lastSeen: run.createdAt,
          runUrls: [],
        };
        byTest.set(candidate.test, acc);
      }

      acc.occurrences += 1;
      if (candidate.verdict === 'failed') {
        acc.failedAllAttempts += 1;
      } else {
        acc.flakyConfirmed += 1;
      }

      acc.shas.add(run.headSha);
      acc.jobs.add(candidate.sourceJob);
      acc.themes.add(candidate.theme);
      acc.platforms.add(candidate.platform);

      if (run.createdAt < acc.firstSeen) acc.firstSeen = run.createdAt;
      if (run.createdAt > acc.lastSeen) acc.lastSeen = run.createdAt;
      if (!acc.runUrls.includes(run.htmlUrl)) acc.runUrls.push(run.htmlUrl);
    }
  }

  const tests: AggregatedTest[] = [...byTest.entries()]
    .map(([test, acc]) => ({
      test,
      occurrences: acc.occurrences,
      flakyConfirmed: acc.flakyConfirmed,
      failedAllAttempts: acc.failedAllAttempts,
      distinctShas: acc.shas.size,
      jobs: sortedUnique(acc.jobs),
      themes: sortedUnique(acc.themes),
      platforms: sortedUnique(acc.platforms),
      firstSeen: acc.firstSeen,
      lastSeen: acc.lastSeen,
      runUrls: acc.runUrls,
    }))
    // A test that flaked on several distinct commits is a flake; one that failed once on a
    // single commit is more likely just a broken commit.
    .sort(
      (a, b) =>
        b.flakyConfirmed - a.flakyConfirmed
        || b.distinctShas - a.distinctShas
        || b.occurrences - a.occurrences
        || a.test.localeCompare(b.test),
    );

  return {
    succeeded: true,
    generatedAt: new Date().toISOString(),
    windowHours: input.windowHours,
    from: input.from.toISOString(),
    to: input.to.toISOString(),
    repo: input.repo,
    workflow: input.workflow,
    artifact: input.artifact,
    runsScanned: input.runsScanned,
    runsWithCandidates: input.collected.filter((entry) => entry.candidates.length > 0).length,
    runsUnreadable: input.runsUnreadable,
    totalCandidates,
    truncated: tests.length > MAX_TESTS,
    tests: tests.slice(0, MAX_TESTS),
  };
}

export interface CollectOptions {
  repo: string;
  workflow: string;
  artifact: string;
  windowHours: number;
  token: string;
}

export async function collect(options: CollectOptions): Promise<FlakyTestsReport> {
  const to = new Date();
  const from = new Date(to.getTime() - options.windowHours * 60 * 60 * 1000);
  const github: GitHubOptions = { repo: options.repo, token: options.token };

  const runs = await listRuns(github, options.workflow, from);
  console.log(
    `Scanning ${runs.length} completed "${options.workflow}" run(s) since ${from.toISOString()}`,
  );

  let runsUnreadable = 0;

  // One bad run must never abort the sweep: a skipped run is counted and reported as data.
  const collected = await mapWithConcurrency(
    runs,
    DOWNLOAD_CONCURRENCY,
    async (run): Promise<CollectedRun> => {
      try {
        const artifactId = await findArtifactId(github, run.id, options.artifact);
        if (artifactId === null) return { run, candidates: [] };

        const content = await downloadArtifactFile(github, artifactId, CANDIDATES_FILENAME);
        if (content === null) {
          runsUnreadable += 1;
          warn(`run ${run.id}: artifact holds no ${CANDIDATES_FILENAME}`);
          return { run, candidates: [] };
        }

        return { run, candidates: parseCandidatesFile(content) };
      } catch (error) {
        runsUnreadable += 1;
        warn(`run ${run.id}: ${error instanceof Error ? error.message : String(error)}`);
        return { run, candidates: [] };
      }
    },
  );

  return aggregate({
    repo: options.repo,
    workflow: options.workflow,
    artifact: options.artifact,
    windowHours: options.windowHours,
    from,
    to,
    runsScanned: runs.length,
    runsUnreadable,
    collected,
  });
}

/**
 * A failed sweep still has to produce a report. The consumer treats a missing file as
 * "the check is broken", which is far less useful than an explicit failure reason — and
 * flaky collection must never break the surrounding health check.
 */
export function buildFailedReport(options: CollectOptions, error: unknown): FlakyTestsReport {
  const to = new Date();
  const from = new Date(to.getTime() - options.windowHours * 60 * 60 * 1000);

  return {
    succeeded: false,
    error: error instanceof Error ? error.message : String(error),
    generatedAt: to.toISOString(),
    windowHours: options.windowHours,
    from: from.toISOString(),
    to: to.toISOString(),
    repo: options.repo,
    workflow: options.workflow,
    artifact: options.artifact,
    runsScanned: 0,
    runsWithCandidates: 0,
    runsUnreadable: 0,
    totalCandidates: 0,
    truncated: false,
    tests: [],
  };
}
