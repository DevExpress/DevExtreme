/* eslint-env node */
const path = require('path');
const { execSync } = require('child_process');

const BASE_DIR = process.cwd();
const report = path.join(BASE_DIR, 'playwright-report');
const results = path.join(BASE_DIR, 'test-results');
const snapshots = path.join(BASE_DIR, 'snapshots');

const extraArgs = process.argv.slice(2).join(' ');

const command = [
    'docker run --rm',
    `-v "${report}:/app/playwright-report"`,
    `-v "${results}:/app/test-results"`,
    `-v "${snapshots}:/app/snapshots"`,
    extraArgs,
    'playwright-tests'
].join(' ');

execSync(command, { stdio: 'inherit' });
