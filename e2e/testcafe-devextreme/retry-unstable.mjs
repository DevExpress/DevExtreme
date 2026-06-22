/* eslint-disable spellcheck/spell-checker */

import {
  existsSync, readdirSync, statSync, readFileSync, writeFileSync, appendFileSync, mkdtempSync, rmSync,
} from 'fs';
import { join, resolve } from 'path';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';
import { argv, env, exit } from 'process';

// Plain-node ESM script (no third-party deps) so the "decide" phase can run
// before dependencies are installed in CI. Only the "retry" phase needs deps,
// because it shells out to `pnpm run test`.

const TIMEZONE_PATTERN = /^[A-Za-z0-9_+\-/]+$/;
const DEFAULT_ATTEMPTS = 2;
const DEFAULT_BROWSERS = 'chrome:devextreme-shr2';

function parseArguments() {
  const result = {
    mode: 'decide',
    dir: './failed-lists',
    out: './retry-plan.json',
    attempts: DEFAULT_ATTEMPTS,
    browsers: DEFAULT_BROWSERS,
  };

  const raw = argv.slice(2);
  for (let i = 0; i < raw.length; i += 1) {
    const token = raw[i];
    if (!token.startsWith('--')) {
      continue;
    }

    const eq = token.indexOf('=');
    let key;
    let value;
    if (eq >= 0) {
      key = token.slice(2, eq);
      value = token.slice(eq + 1);
    } else {
      key = token.slice(2);
      value = raw[i + 1];
      i += 1;
    }

    if (key === 'attempts') {
      result[key] = Number(value);
    } else if (key in result) {
      result[key] = value;
    }
  }

  return result;
}

function readEntries(dir) {
  if (!existsSync(dir)) {
    return [];
  }

  const jsonFiles = [];
  const walk = (current) => {
    for (const name of readdirSync(current)) {
      const full = join(current, name);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else if (name.endsWith('.json')) {
        jsonFiles.push(full);
      }
    }
  };
  walk(dir);

  return jsonFiles.map((file) => JSON.parse(readFileSync(file, 'utf8')));
}

function buildGroups(entries) {
  const groups = new Map();

  for (const entry of entries) {
    if (!Array.isArray(entry.tests) || entry.tests.length === 0) {
      continue;
    }

    const componentFolder = entry.componentFolder ?? '';
    const theme = entry.theme ?? '';
    const timezone = entry.timezone ?? '';
    const file = entry.file ?? '*';
    const key = [componentFolder, theme, timezone, file].join('|');

    if (!groups.has(key)) {
      groups.set(key, {
        label: entry.label ?? componentFolder, componentFolder, theme, timezone, file, tests: new Set(),
      });
    }

    const group = groups.get(key);
    for (const test of entry.tests ?? []) {
      group.tests.add(test);
    }
  }

  return [...groups.values()].map((group) => ({ ...group, tests: [...group.tests] }));
}

function countTests(groups) {
  return groups.reduce((sum, group) => sum + group.tests.length, 0);
}

function describeGroup(group) {
  const parts = [group.label || group.componentFolder || '<root>', group.theme || 'default'];
  if (group.timezone) {
    parts.push(`tz=${group.timezone}`);
  }
  return parts.join(' | ');
}

function printGroups(groups) {
  for (const group of groups) {
    console.log(`\n[${describeGroup(group)}]`);
    for (const test of group.tests) {
      console.log(`  - ${test}`);
    }
  }
}

function setOutput(name, value) {
  if (env.GITHUB_OUTPUT) {
    appendFileSync(env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
}

function decide(options) {
  const groups = buildGroups(readEntries(options.dir));
  const total = countTests(groups);

  // Matrix jobs only hand off tests when they had few enough failures to stay
  // green (see runner.ts --deferThreshold). Big regressions already fail at the
  // job level, so here we just retry whatever was deferred.
  let action;
  if (total === 0) {
    console.log('No unstable tests were collected — nothing to retry.');
    action = 'pass';
  } else {
    console.log(`Collected ${total} potentially-unstable test(s) from passing jobs.`);
    console.log('They will be re-run in isolation to tell flaky tests apart from real failures.');
    printGroups(groups);
    action = 'retry';
  }

  writeFileSync(options.out, JSON.stringify({ action, total, groups }, null, 2));

  setOutput('action', action);
  setOutput('total', total);
}

function runGroupOnce(group, tests, options) {
  const workDir = mkdtempSync(join(tmpdir(), 'retry-unstable-'));
  const namesFile = join(workDir, 'tests.txt');
  const outputFile = join(workDir, 'still-failing.json');
  writeFileSync(namesFile, tests.join('\n'));

  if (group.timezone) {
    if (!TIMEZONE_PATTERN.test(group.timezone)) {
      throw new Error(`Refusing to use unsafe timezone value: ${group.timezone}`);
    }
    spawnSync('sudo', ['ln', '-sf', `/usr/share/zoneinfo/${group.timezone}`, '/etc/localtime'], { stdio: 'inherit' });
  }

  spawnSync('pnpm', [
    'run', 'test',
    `--browsers=${options.browsers}`,
    '--componentFolder', group.componentFolder,
    '--theme', group.theme || 'fluent.blue.light',
    '--testNamesFile', namesFile,
    '--failedTestsOutput', outputFile,
    '--deferFailures', 'false',
  ], { stdio: 'inherit' });

  let stillFailing = [];
  if (existsSync(outputFile)) {
    stillFailing = JSON.parse(readFileSync(outputFile, 'utf8')).tests ?? [];
  }
  rmSync(workDir, { recursive: true, force: true });

  return stillFailing;
}

function retryGroups(options) {
  const plan = JSON.parse(readFileSync(resolve(options.out), 'utf8'));
  const recovered = [];
  const broken = [];

  for (const group of plan.groups) {
    let remaining = group.tests;

    for (let attempt = 1; attempt <= options.attempts && remaining.length > 0; attempt += 1) {
      console.log(`\n=== Retry attempt ${attempt}/${options.attempts} — [${describeGroup(group)}] (${remaining.length} test(s)) ===`);
      remaining = runGroupOnce(group, remaining, options);
    }

    const stillFailing = new Set(remaining);
    for (const test of group.tests) {
      const record = { group: describeGroup(group), test };
      if (stillFailing.has(test)) {
        broken.push(record);
      } else {
        recovered.push(record);
      }
    }
  }

  printSummary(recovered, broken);
  exit(broken.length > 0 ? 1 : 0);
}

function printSummary(recovered, broken) {
  const lines = [];
  lines.push('## Unstable tests retry summary', '');
  lines.push(`- Recovered (flaky, passed on retry): **${recovered.length}**`);
  lines.push(`- Still failing (treated as real failures): **${broken.length}**`);

  if (recovered.length > 0) {
    lines.push('', '### Flaky tests (recovered on retry)');
    for (const item of recovered) {
      lines.push(`- \`${item.test}\` — ${item.group}`);
    }
  }

  if (broken.length > 0) {
    lines.push('', '### Tests that still fail');
    for (const item of broken) {
      lines.push(`- \`${item.test}\` — ${item.group}`);
    }
  }

  const report = lines.join('\n');
  console.log(`\n${report}`);

  if (env.GITHUB_STEP_SUMMARY) {
    appendFileSync(env.GITHUB_STEP_SUMMARY, `${report}\n`);
  }
}

const options = parseArguments();

if (options.mode === 'retry') {
  retryGroups(options);
} else {
  decide(options);
}
