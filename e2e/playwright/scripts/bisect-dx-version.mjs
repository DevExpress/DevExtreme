import { execSync, spawnSync } from 'child_process';
import path from 'path';

const repoRoot = path.resolve(process.cwd());
const testConfig = path.join(repoRoot, 'e2e', 'playwright', 'playwright.config.ts');
const testFile = path.join(
  repoRoot,
  'e2e',
  'playwright',
  'tests',
  'datagrid-bulk-delete.spec.ts'
);

const semverPattern = /^\d+\.\d+\.\d+$/;
const rangeStart = '18.2.3';
const rangeEnd = '25.2.4';

function parseVersion(version) {
  return version.split('.').map((part) => Number(part));
}

function compareVersions(a, b) {
  for (let i = 0; i < 3; i += 1) {
    const diff = a[i] - b[i];
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

function getVersionTags() {
  const tags = execSync('git tag --list', { encoding: 'utf-8' })
    .split('\n')
    .map((line) => line.trim())
    .filter((tag) => semverPattern.test(tag));

  return tags
    .filter((tag) => compareVersions(parseVersion(tag), parseVersion(rangeStart)) >= 0)
    .filter((tag) => compareVersions(parseVersion(tag), parseVersion(rangeEnd)) <= 0)
    .sort((left, right) => compareVersions(parseVersion(left), parseVersion(right)));
}

function runReproTest(version) {
  const env = { ...process.env, DX_VERSION: version };
  const result = spawnSync(
    'pnpm',
    [
      'exec',
      'playwright',
      'test',
      '-c',
      testConfig,
      testFile,
      '--project=chromium'
    ],
    { env, stdio: 'inherit' }
  );

  return result.status === 0;
}

async function main() {
  const versions = getVersionTags();
  if (!versions.length) {
    throw new Error('No semver tags found in repository for the requested range.');
  }

  const minIndex = 0;

  const maxIndex = versions.length - 1;
  const minVersion = versions[minIndex];
  const maxVersion = versions[maxIndex];

  console.log(`Using range ${minVersion} .. ${maxVersion}`);

  const minPass = runReproTest(minVersion);
  const maxPass = runReproTest(maxVersion);

  if (!minPass) {
    throw new Error(`Baseline ${minVersion} already fails the repro test.`);
  }
  if (maxPass) {
    throw new Error(`Latest ${maxVersion} does not reproduce the bug.`);
  }

  let left = minIndex;
  let right = maxIndex;
  while (right - left > 1) {
    const mid = Math.floor((left + right) / 2);
    const version = versions[mid];
    console.log(`\nTesting ${version} (range ${versions[left]}..${versions[right]})`);
    const pass = runReproTest(version);
    if (pass) {
      left = mid;
    } else {
      right = mid;
    }
  }

  console.log(
    `\nRegression introduced between ${versions[left]} (pass) and ${versions[right]} (fail).`
  );
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
