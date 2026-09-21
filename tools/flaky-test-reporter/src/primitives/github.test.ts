import { downloadArtifactFile, findArtifactId, listRuns } from './github';
import { makeZip } from './zip.test.utils';

const github = { repo: 'o/r', token: 'secret-token' };

interface Call {
  url: string;
  init?: RequestInit;
}

let calls: Call[];

function mockFetch(handler: (url: string, init?: RequestInit) => Response): void {
  calls = [];
  global.fetch = jest.fn(async (input: Parameters<typeof fetch>[0], init?: RequestInit) => {
    const url = String(input);
    calls.push({ url, init });
    return handler(url, init);
  }) as unknown as typeof fetch;
}

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
}

function rawRun(id: number) {
  return {
    id,
    run_number: id,
    head_sha: `sha${id}`,
    event: 'pull_request',
    created_at: '2026-09-01T00:00:00Z',
    html_url: `https://github.com/o/r/actions/runs/${id}`,
  };
}

const realFetch = global.fetch;

afterEach(() => {
  jest.restoreAllMocks();
  // jest.restoreAllMocks() only undoes spies, not the direct assignment in mockFetch().
  global.fetch = realFetch;
});

describe('listRuns', () => {
  it('scopes the query to completed runs created since the window start', async () => {
    mockFetch(() => json({ workflow_runs: [rawRun(1)] }));

    await listRuns(github, 'testcafe_tests.yml', new Date('2026-09-01T12:00:00Z'));

    const url = new URL(calls[0].url);
    expect(url.pathname).toBe('/repos/o/r/actions/workflows/testcafe_tests.yml/runs');
    expect(url.searchParams.get('created')).toBe('>=2026-09-01T12:00:00.000Z');
    expect(url.searchParams.get('status')).toBe('completed');
    expect(url.searchParams.get('exclude_pull_requests')).toBe('true');
  });

  it('follows pagination until a short page ends it', async () => {
    mockFetch((url) => {
      const page = Number(new URL(url).searchParams.get('page'));
      // Two full pages, then a short one.
      const size = page <= 2 ? 100 : 7;
      return json({
        workflow_runs: Array.from({ length: size }, (_, i) => rawRun(page * 1000 + i)),
      });
    });

    const runs = await listRuns(github, 'w.yml', new Date());

    expect(runs).toHaveLength(207);
    expect(calls).toHaveLength(3);
  });

  it('throws on an API error so the caller can report the sweep as failed', async () => {
    mockFetch(() => new Response('nope', { status: 403, statusText: 'Forbidden' }));

    await expect(listRuns(github, 'w.yml', new Date())).rejects.toThrow(/403/);
  });
});

describe('findArtifactId', () => {
  it('finds the artifact by name', async () => {
    mockFetch(() =>
      json({
        artifacts: [
          { id: 1, name: 'other', expired: false },
          { id: 2, name: 'flaky-candidates', expired: false },
        ],
      }),
    );

    await expect(findArtifactId(github, 99, 'flaky-candidates')).resolves.toBe(2);
  });

  it('returns null when the run produced no such artifact', async () => {
    mockFetch(() => json({ artifacts: [{ id: 1, name: 'other', expired: false }] }));

    await expect(findArtifactId(github, 99, 'flaky-candidates')).resolves.toBeNull();
  });

  it('treats an expired artifact as absent', async () => {
    mockFetch(() => json({ artifacts: [{ id: 2, name: 'flaky-candidates', expired: true }] }));

    await expect(findArtifactId(github, 99, 'flaky-candidates')).resolves.toBeNull();
  });
});

describe('downloadArtifactFile', () => {
  const zip = makeZip({ 'flaky-candidates.json': '{"schemaVersion":1,"candidates":[]}' });

  it('follows the redirect to blob storage WITHOUT forwarding the credential', async () => {
    mockFetch((url) => {
      if (url.startsWith('https://api.github.com')) {
        return new Response(null, {
          status: 302,
          headers: { location: 'https://blob.example/zip' },
        });
      }
      return new Response(new Uint8Array(zip), { status: 200 });
    });

    const content = await downloadArtifactFile(github, 42, 'flaky-candidates.json');

    expect(content).toBe('{"schemaVersion":1,"candidates":[]}');
    expect(calls).toHaveLength(2);
    expect(calls[0].init?.headers).toMatchObject({ authorization: 'Bearer secret-token' });
    expect(calls[0].init?.redirect).toBe('manual');
    // The whole point: blob storage rejects a forwarded Authorization header with a 400.
    expect(calls[1].init?.headers).toBeUndefined();
  });

  it('reads a direct 200 response without a redirect', async () => {
    mockFetch(() => new Response(new Uint8Array(zip), { status: 200 }));

    await expect(downloadArtifactFile(github, 42, 'flaky-candidates.json')).resolves.toContain(
      'schemaVersion',
    );
    expect(calls).toHaveLength(1);
  });

  it('returns null when the archive lacks the file', async () => {
    mockFetch(() => new Response(new Uint8Array(zip), { status: 200 }));

    await expect(downloadArtifactFile(github, 42, 'absent.json')).resolves.toBeNull();
  });

  it('throws when a redirect carries no location', async () => {
    mockFetch(() => new Response(null, { status: 302 }));

    await expect(downloadArtifactFile(github, 42, 'x.json')).rejects.toThrow(/location/);
  });
});

describe('listRuns page cap', () => {
  it('warns rather than silently returning a short sweep', async () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch((url) => {
      const page = Number(new URL(url).searchParams.get('page'));
      return json({
        workflow_runs: Array.from({ length: 100 }, (_, i) => rawRun(page * 1000 + i)),
      });
    });

    const runs = await listRuns(github, 'w.yml', new Date());

    expect(runs).toHaveLength(1000);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('page cap'));
  });

  it('does not warn when the window fits', async () => {
    const warnSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockFetch(() => json({ workflow_runs: [rawRun(1)] }));

    await listRuns(github, 'w.yml', new Date());

    expect(warnSpy).not.toHaveBeenCalled();
  });
});
