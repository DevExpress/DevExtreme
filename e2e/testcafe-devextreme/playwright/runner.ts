/* eslint-disable no-console, no-continue */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { spawnSync } from 'child_process';
import parseArgs from 'minimist';

interface ParsedArgs {
  browsers: string;
  componentFolder: string;
  concurrency: number;
  disableScreenshots: boolean;
  file: string;
  indices: string;
  platform: string;
  reporter: string;
  shadowDom: boolean;
  skipUnstable: boolean;
  test: string;
  theme: string;
}

const KNOWN_ARGS_WITH_VALUE = new Set([
  'browsers',
  'componentFolder',
  'concurrency',
  'file',
  'indices',
  'platform',
  'reporter',
  'test',
  'theme',
]);

const KNOWN_BOOLEAN_ARGS = new Set([
  'cache',
  'disableScreenshots',
  'quarantineMode',
  'retryFailed',
  'shadowDom',
  'skipUnstable',
]);

function getArgs(): ParsedArgs {
  return parseArgs(getRawArgs(), {
    boolean: Array.from(KNOWN_BOOLEAN_ARGS),
    // Treat value-args as strings so a bare flag (e.g. empty `--componentFolder`
    // in the generic CI job) resolves to '' instead of `true` and does not
    // swallow the following `--theme` token. `concurrency` stays numeric.
    string: Array.from(KNOWN_ARGS_WITH_VALUE).filter((name) => name !== 'concurrency'),
    default: {
      browsers: 'chrome:devextreme-shr2',
      componentFolder: '',
      concurrency: 0,
      disableScreenshots: false,
      file: '*',
      indices: '',
      platform: '',
      reporter: '',
      shadowDom: false,
      skipUnstable: true,
      test: '',
      theme: '',
    },
  }) as ParsedArgs;
}

function getRawArgs(): string[] {
  const args = process.argv.slice(2);
  return args[0] === '--' ? args.slice(1) : args;
}

function getForwardedPlaywrightArgs(): string[] {
  const result: string[] = [];
  const args = getRawArgs();

  for (let index = 0; index < args.length; index += 1) {
    const current = args[index];

    if (!current.startsWith('--')) {
      result.push(current);
      continue;
    }

    const [nameWithPrefix] = current.split('=', 1);
    const name = nameWithPrefix.replace(/^--/, '');

    if (KNOWN_ARGS_WITH_VALUE.has(name)) {
      // Only consume the next token as this arg's value when it actually is a
      // value. A bare flag (empty value, e.g. `--componentFolder`) is followed
      // by another `--option`, which must NOT be swallowed — otherwise the real
      // value token leaks to Playwright as a positional test filter.
      if (!current.includes('=')) {
        const next = args[index + 1];
        if (next !== undefined && !next.startsWith('--')) {
          index += 1;
        }
      }
      continue;
    }

    if (KNOWN_BOOLEAN_ARGS.has(name)) {
      // Boolean flags may be passed with an explicit value (e.g. CI emits
      // `--cache true`). Consume the following `true`/`false` token so it does
      // not leak to Playwright as a positional test filter.
      if (!current.includes('=')) {
        const next = args[index + 1];
        if (next === 'true' || next === 'false') {
          index += 1;
        }
      }
      continue;
    }

    result.push(current);
  }

  return result;
}

const args = getArgs();
const theme = args.theme || 'fluent.blue.light';
const env = {
  ...process.env,
  BROWSERS: args.browsers,
  COMPONENT_FOLDER: args.componentFolder,
  CONCURRENCY: String(args.concurrency || process.env.CONCURRENCY || 4),
  PLAYWRIGHT_COMPONENT_DISABLE_SCREENSHOTS: String(args.disableScreenshots),
  PLAYWRIGHT_COMPONENT_FILE: args.file,
  PLAYWRIGHT_COMPONENT_INDICES: args.indices,
  PLAYWRIGHT_COMPONENT_SKIP_UNSTABLE: String(args.skipUnstable),
  PLAYWRIGHT_COMPONENT_TEST: args.test,
  SHADOW_DOM: String(args.shadowDom),
  THEME: theme,
  platform: args.platform || process.env.platform || '',
  shadowDom: String(args.shadowDom),
  theme,
};

const playwrightArgs = [
  'exec',
  'playwright',
  'test',
  '--config=playwright.config.ts',
  ...getForwardedPlaywrightArgs(),
];

console.info(`Playwright component args: ${playwrightArgs.slice(2).join(' ')}`);

const result = spawnSync('pnpm', playwrightArgs, {
  cwd: process.cwd(),
  env,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
