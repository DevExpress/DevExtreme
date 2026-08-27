 
import { spawnSync } from 'node:child_process';
import process from 'node:process';

const DEFAULT_THEME = 'fluent.blue.light';

const OPTIONS = ['componentFolder', 'indices', 'theme', 'concurrency', 'test'];

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Everything this runner does not know about goes to "playwright test" untouched, so
// "pnpm run test --headed --repeat-each 3" behaves exactly as the Playwright CLI would.
function parseArgs(argv) {
    const values = {};
    const rest = [];

    for(let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        const [flag, inlineValue] = arg.startsWith('--') ? arg.slice(2).split(/=(.*)/s) : [];

        if(OPTIONS.includes(flag)) {
            if(inlineValue === undefined) {
                i += 1;
                values[flag] = argv[i];
            } else {
                values[flag] = inlineValue;
            }
        } else {
            rest.push(arg);
        }
    }

    return { values, rest };
}

const { values, rest } = parseArgs(process.argv.slice(2));

// The matrix already covers every component folder, but the tests are migrated squad by squad,
// so a job whose folder is still TestCafe-only has nothing to run and must not fail. A run asking
// for one test by name is the opposite case: matching nothing there means the name is wrong.
const args = values.test ? [] : ['--pass-with-no-tests'];

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
    // Playwright greps the title with the tags appended, so the name can only be bounded by
    // whitespace, not anchored. Escaping matters: test names here carry ticket numbers in braces.
    args.push('--grep', `(^|\\s)${escapeRegExp(values.test)}(\\s|$)`);
} else if(values.theme && !values.componentFolder) {
    // A job that names a theme instead of a folder runs the whole suite in that theme, so it
    // takes only the tests that opted into it with a "@<theme>" tag — the etalons of the rest
    // are recorded in the default theme. The tag ends at a space, otherwise "@material.blue.light"
    // would also pick up the tests tagged "@material.blue.light.compact".
    args.push('--grep', `@${escapeRegExp(values.theme)}(\\s|$)`);
}

args.push(...rest);

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
