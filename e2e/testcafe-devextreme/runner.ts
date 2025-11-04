/* eslint-disable spellcheck/spell-checker */
import createTestCafe, { ClientFunction } from 'testcafe';
import * as fs from 'fs';
import * as process from 'process';
import parseArgs from 'minimist';
import { globSync } from 'glob';
import { DEFAULT_BROWSER_SIZE } from './helpers/const';
import {
  clearTestPage,
  loadAxeCore,
} from './helpers/testPageUtils';
import 'nconf';

interface ParsedArgs {
  concurrency: number;
  browsers: string;
  test: string;
  reporter: string | string[];
  componentFolder: string;
  file: string;
  cache: boolean;
  quarantineMode: boolean;
  indices: string;
  platform: string;
  theme: string;
  shadowDom: boolean;
  skipUnstable: boolean;
}

const LAUNCH_RETRY_ATTEMPTS = 5;
const LAUNCH_RETRY_TIMEOUT = 20000;
const TESTCAFE_CONFIG: Partial<TestCafeConfigurationOptions> = {
  hostname: 'localhost',
  port1: 1437,
  port2: 1438,
};

const getCurrentTheme = async (t: TestController): Promise<string> => {
  // eslint-disable-next-line @stylistic/max-len
  const currentTheme = await ClientFunction(() => (window as any).DevExpress.ui.themes.current()).with({ boundTestRun: t })();

  return currentTheme;
};

const changeTheme = async (t: TestController, themeName: string): Promise<void> => {
  const changeThemeClientFn = ClientFunction(() => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(themeName);
  }), { dependencies: { themeName } });

  return changeThemeClientFn.with({ boundTestRun: t })();
};

const addShadowRootTree = async (t: TestController): Promise<void> => {
  const addShadowRootClientFn = ClientFunction(() => {
    const root = document.querySelector('#parentContainer') as HTMLElement;
    const { childNodes } = root;

    if (!root.shadowRoot) {
      root.attachShadow({ mode: 'open' });
    }

    const shadowContainer = document.createElement('div');
    shadowContainer.append(...Array.from(childNodes));

    root.shadowRoot!.appendChild(shadowContainer);
  });

  await addShadowRootClientFn.with({ boundTestRun: t })();
};

const wait = async (
  timeout: number,
// eslint-disable-next-line no-promise-executor-return
): Promise<void> => new Promise((resolve) => setTimeout(resolve, timeout));

const retry = async <T>(action: () => Promise<T>, attempt: number): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    if (attempt <= 1) {
      throw error;
    }

    /* eslint-disable no-console */
    console.log('\n > error occurred during testcafe launch!\n');
    console.error(error);
    console.info(`\n > waiting ${LAUNCH_RETRY_TIMEOUT / 1000} seconds...\n`);
    await wait(LAUNCH_RETRY_TIMEOUT);
    console.info('\n > retry launching testcafe\n');
    /* eslint-enable no-console */
    return retry(action, attempt - 1);
  }
};

function setTestingPlatform(args: ParsedArgs): void {
  process.env.platform = args.platform;
}

function setTestingTheme(args: ParsedArgs): void {
  process.env.theme = args.theme || 'fluent.blue.light';
}

function setShadowDom(args: ParsedArgs): void {
  process.env.shadowDom = args.shadowDom.toString();
}

function expandBrowserAlias(browser: string): string {
  switch (browser) {
    case 'chrome:devextreme-shr2':
      return 'chrome:headless --no-sandbox --disable-dev-shm-usage --disable-gpu --window-size=1200,800 --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl="swiftshader" --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning';
    case 'chrome:docker':
      return 'chromium:headless --no-sandbox --disable-gpu --window-size=1200,800';
    default:
      return browser;
  }
}

function getArgs(): ParsedArgs {
  return parseArgs(process.argv.slice(1), {
    default: {
      concurrency: 0,
      browsers: 'chrome',
      test: '',
      reporter: [process.env.CI === 'true' ? 'list' : 'minimal'],
      componentFolder: '',
      file: '*',
      cache: true,
      quarantineMode: false,
      indices: '',
      platform: '',
      theme: '',
      shadowDom: false,
      skipUnstable: true,
    },
  }) as ParsedArgs;
}

const split = <T>(array: T[], chunkCount: number): T[][] => {
  const fixturesInChunkCount = Math.ceil(array.length / chunkCount);
  const arr = [...array];
  const res: T[][] = [];

  while (arr.length) {
    res.push(arr.splice(0, fixturesInChunkCount));
  }

  return res;
};

// eslint-disable-next-line @typescript-eslint/init-declarations
let testCafe: TestCafe;

createTestCafe(TESTCAFE_CONFIG)
  .then(async (tc: TestCafe) => {
    testCafe = tc;

    const args = getArgs();
    const testName = args.test.trim();
    const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
    const indices = args.indices.trim();
    let componentFolder = args.componentFolder.trim();
    const file = args.file.trim();

    setTestingPlatform(args);
    setTestingTheme(args);
    setShadowDom(args);

    componentFolder = componentFolder ? `${componentFolder}/**` : '**';
    if (fs.existsSync('./screenshots')) {
      fs.rmSync('./screenshots', { recursive: true });
    }

    const browsers = args.browsers
      .split(' ')
      .map((browser) => expandBrowserAlias(browser));

    // eslint-disable-next-line no-console
    console.info('Browsers:', browsers);

    const runner: Runner = testCafe.createRunner()
      .browsers(browsers)
      .reporter(reporter)
      .src([`./tests/${componentFolder}/${file}.ts`]);

    runner.compilerOptions({
      typescript: {
        customCompilerModulePath: '../../node_modules/typescript',
      },
    });

    runner.concurrency(args.concurrency || 4);

    const filters: FilterFunction[] = [];

    if (indices) {
      const [current, total] = indices.split(/_|of|\\|\//ig).map((x) => +x);
      const fixtures = globSync([`./tests/${componentFolder}/*.ts`]);
      const fixtureChunks = split(fixtures, total);
      const targetFixtureChunk = fixtureChunks[current - 1] ?? [];
      const targetFixtureChunkSet = new Set(targetFixtureChunk);

      /* eslint-disable no-console */
      console.info(' === test run config ===');
      console.info(` > indices: current = ${current} | total = ${total}`);
      console.info(' > glob: ', [`./tests/${componentFolder}/*.ts`]);
      console.info(' > all fixtures: ', fixtureChunks);
      console.info(' > fixtures: ', targetFixtureChunk, '\n');
      /* eslint-enable no-console */

      filters.push((
        _testName: string,
        _fixtureName: string,
        fixturePath: string,
      ) => {
        const testPath = fixturePath.split('/testcafe-devextreme/')[1];
        return targetFixtureChunkSet.has(testPath);
      });
    }

    if (testName) {
      filters.push((name: string) => name === testName);
    }

    if (args.skipUnstable) {
      filters.push((
        _testName: string,
        _fixtureName: string,
        _fixturePath: string,
        testMeta?: any,
      ) => !(testMeta)?.unstable);
    }

    if (filters.length) {
      runner.filter((...filterArgs: Parameters<FilterFunction>) => {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < filters.length; i += 1) {
          if (!filters[i](...filterArgs)) {
            return false;
          }
        }
        return true;
      });
    }

    if (args.cache) {
      (runner as any).cache = args.cache;
    }

    const runOptions: RunOptions = {
      quarantineMode: { successThreshold: 1, attemptLimit: 2 },
      disableNativeAutomation: true,
      // @ts-expect-error ts-error
      hooks: {
        test: {
          before: async (t: TestController) => {
            if (!componentFolder.includes('accessibility')) {
              await ClientFunction(() => {
                if (document.activeElement && document.activeElement !== document.body) {
                  (document.activeElement as HTMLElement).blur();
                }

                window.getSelection()?.removeAllRanges();
              }).with({ boundTestRun: t })();

              await t.hover('html');

              const [width, height] = DEFAULT_BROWSER_SIZE;
              await t.resizeWindow(width, height);
            } else {
              await loadAxeCore(t);
            }

            if (args.shadowDom) {
              await addShadowRootTree(t);
            }

            if (!file.includes('xss')) {
              const currentTheme = await getCurrentTheme(t) || 'fluent.blue.light';
              const newTheme = args.theme || 'fluent.blue.light';

              if (currentTheme !== newTheme) {
                await changeTheme(t, newTheme);
              }
            }
          },
          after: async (t: TestController) => {
            await clearTestPage(t);
          },
        },
      },
    };

    if (args.browsers === 'chrome:docker') {
      runOptions.disableScreenshots = true;
    }

    return retry(() => runner.run(runOptions), LAUNCH_RETRY_ATTEMPTS);
  })
  .then((failedCount: number) => {
    testCafe.close();
    process.exit(failedCount);
  })
  .catch((error: Error) => {
    // eslint-disable-next-line no-console
    console.error('TestCafe execution failed:', error);
    if (testCafe) {
      testCafe.close();
    }
    process.exit(1);
  });
