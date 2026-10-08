import { RunInfo } from '../types';
import { warn } from '../utils';
import { extractFileFromZip } from './zip';

const API_ROOT = 'https://api.github.com';
const RUNS_PER_PAGE = 100;
/** Runs are listed newest-first, so this caps the sweep at 1000 runs. */
const MAX_RUN_PAGES = 10;

export interface GitHubOptions {
  repo: string;
  token: string;
}

function headers(token: string): Record<string, string> {
  return {
    accept: 'application/vnd.github+json',
    authorization: `Bearer ${token}`,
    'x-github-api-version': '2022-11-28',
    'user-agent': 'devextreme-flaky-test-reporter',
  };
}

async function getJson<T>(url: string, token: string): Promise<T> {
  const response = await fetch(url, { headers: headers(token) });
  if (!response.ok) {
    throw new Error(`GET ${url} -> ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

interface RawRun {
  id: number;
  run_number: number;
  head_sha: string;
  event: string;
  created_at: string;
  html_url: string;
}

function toRunInfo(run: RawRun): RunInfo {
  return {
    id: run.id,
    runNumber: run.run_number,
    headSha: run.head_sha,
    event: run.event,
    createdAt: run.created_at,
    htmlUrl: run.html_url,
  };
}

/** Completed runs of `workflow` created at or after `since`, newest first. */
export async function listRuns(
  { repo, token }: GitHubOptions,
  workflow: string,
  since: Date,
): Promise<RunInfo[]> {
  const runs: RunInfo[] = [];

  for (let page = 1; page <= MAX_RUN_PAGES; page += 1) {
    const query = new URLSearchParams({
      created: `>=${since.toISOString()}`,
      status: 'completed',
      exclude_pull_requests: 'true',
      per_page: String(RUNS_PER_PAGE),
      page: String(page),
    });
    const url = `${API_ROOT}/repos/${repo}/actions/workflows/${workflow}/runs?${query}`;
    const body = await getJson<{ workflow_runs?: RawRun[] }>(url, token);
    const batch = body.workflow_runs ?? [];

    runs.push(...batch.map(toRunInfo));

    if (batch.length < RUNS_PER_PAGE) return runs;
  }

  // Falling out of the loop means the window holds more runs than the cap allows. Say so:
  // a silently short sweep would understate every count in the report.
  warn(
    `run listing hit the ${MAX_RUN_PAGES}-page cap (${runs.length} runs); older runs in the window were not scanned`,
  );

  return runs;
}

interface RawArtifact {
  id: number;
  name: string;
  expired: boolean;
}

/** Artifact id, or `null` when the run produced none by that name (or it has expired). */
export async function findArtifactId(
  { repo, token }: GitHubOptions,
  runId: number,
  artifactName: string,
): Promise<number | null> {
  const url = `${API_ROOT}/repos/${repo}/actions/runs/${runId}/artifacts?per_page=100`;
  const body = await getJson<{ artifacts?: RawArtifact[] }>(url, token);
  const artifact = body.artifacts?.find((candidate) => candidate.name === artifactName);

  if (!artifact || artifact.expired) return null;
  return artifact.id;
}

export async function downloadArtifactFile(
  { repo, token }: GitHubOptions,
  artifactId: number,
  filename: string,
): Promise<string | null> {
  const url = `${API_ROOT}/repos/${repo}/actions/artifacts/${artifactId}/zip`;

  // The download 302s to blob storage, which rejects a forwarded Authorization header with
  // a 400. Follow the redirect by hand so the credential never leaves api.github.com.
  const redirect = await fetch(url, { headers: headers(token), redirect: 'manual' });

  let response = redirect;
  if (redirect.status >= 300 && redirect.status < 400) {
    const location = redirect.headers.get('location');
    if (!location) {
      throw new Error(`artifact ${artifactId}: ${redirect.status} without a location header`);
    }
    response = await fetch(location);
  }

  if (!response.ok) {
    throw new Error(`download artifact ${artifactId} -> ${response.status} ${response.statusText}`);
  }

  const zip = Buffer.from(await response.arrayBuffer());
  const file = extractFileFromZip(zip, filename);

  return file ? file.toString('utf-8') : null;
}
