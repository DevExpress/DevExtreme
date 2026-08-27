/* eslint-disable spellcheck/spell-checker */
import { spawnSync } from 'node:child_process';
import process from 'node:process';
import { parseArgs } from 'node:util';

const DEFAULT_THEME = 'fluent.blue.light';

const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    strict: false,
    options: {
        componentFolder: { type: 'string', default: '' },
        indices: { type: 'string', default: '' },
        theme: { type: 'string' },
        concurrency: { type: 'string', default: '' },
        test: { type: 'string', default: '' },
        updateSnapshots: { type: 'boolean', default: false },
    },
});

// The matrix already covers every component folder, but the tests are migrated squad by squad,
// so a job whose folder is still TestCafe-only has nothing to run and must not fail.
const args = ['--pass-with-no-tests'];

if(values.componentFolder) {
    args.push(`tests/${values.componentFolder}/`);
}

if(values.indices) {
    const [current, total] = values.indices.split(/[_/\\]|of/i);

    if(!current || !total) {
        console.error(`❌ Invalid --indices: ${values.indices}. Pass it as "current/total", for example --indices 1/4.`);
        process.exit(1);
    }

    args.push(`--shard=${current}/${total}`);
}

if(values.concurrency) {
    args.push(`--workers=${values.concurrency}`);
}

if(values.test) {
    args.push('--grep', values.test);
} else if(values.theme && !values.componentFolder) {
    // A job that names a theme instead of a folder runs the whole suite in that theme, so it
    // takes only the tests that opted into it with a "@<theme>" tag — the etalons of the rest
    // are recorded in the default theme.
    args.push('--grep', `@${values.theme}`);
}

if(values.updateSnapshots) {
    args.push('--update-snapshots');
}

args.push(...positionals);

const { status } = spawnSync(
    'playwright',
    ['test', ...args],
    {
        stdio: 'inherit',
        shell: process.platform === 'win32',
        env: { ...process.env, THEME: values.theme ?? DEFAULT_THEME },
    },
);

process.exit(status ?? 1);
