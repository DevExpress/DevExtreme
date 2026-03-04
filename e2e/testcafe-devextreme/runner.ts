/* eslint-disable spellcheck/spell-checker */
import createTestCafe, { ClientFunction } from 'testcafe';
import * as fs from 'fs';
import * as process from 'process';
import parseArgs from 'minimist';
import { DEFAULT_BROWSER_SIZE } from './helpers/const';
import {
  addShadowRootTree,
  clearTestPage,
  loadAxeCore,
  loadShadowDomExtension,
} from './helpers/testPageUtils';
import { getCurrentTheme } from './helpers/themeUtils';

const LAUNCH_RETRY_ATTEMPTS = 3;
const LAUNCH_RETRY_TIMEOUT = 10000;
const FAILED_TESTS_RETRY_ATTEMPTS = 2;

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
  disableScreenshots: boolean;
  retryFailed: boolean;
}

const getTestCafeConfig = (cache: boolean): Partial<TestCafeConfigurationOptions> => ({
  hostname: 'localhost',
  port1: 1437,
  port2: 1438,
  cache,
});

const changeTheme = async (t: TestController, themeName: string): Promise<void> => {
  const changeThemeClientFn = ClientFunction(() => new Promise<void>((resolve) => {
    (window as any).DevExpress.ui.themes.ready(resolve);
    (window as any).DevExpress.ui.themes.current(themeName);
  }), { dependencies: { themeName } });

  return changeThemeClientFn.with({ boundTestRun: t })();
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
      return 'chrome:headless --no-sandbox --disable-dev-shm-usage --disable-gpu --window-size=1200,800 --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl=swiftshader --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning';
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
      reporter: 'spec-time',
      componentFolder: '',
      file: '*',
      cache: false,
      quarantineMode: false,
      indices: '',
      platform: '',
      theme: '',
      shadowDom: false,
      skipUnstable: true,
      disableScreenshots: false,
      retryFailed: true,
    },
  }) as ParsedArgs;
}

async function main() {
  let testCafe: Awaited<ReturnType<typeof createTestCafe>> | null = null;

  try {
    const args = getArgs();
    testCafe = await createTestCafe(getTestCafeConfig(args.cache));

    const testName = args.test.trim();
    const reporter = typeof args.reporter === 'string' ? args.reporter.trim() : args.reporter;
    const indices = args.indices.trim();
    const file = args.file.trim();

    setTestingPlatform(args);
    setTestingTheme(args);
    setShadowDom(args);

    const componentFolderArg = typeof args.componentFolder === 'string' ? args.componentFolder.trim() : '';
    const componentFolder = componentFolderArg ? `${componentFolderArg}/**` : '**';

    if (fs.existsSync('./screenshots')) {
      fs.rmSync('./screenshots', { recursive: true });
    }

    const browsers = args.browsers
      .split(' ')
      .map((browser) => expandBrowserAlias(browser));

    // eslint-disable-next-line no-console
    console.info('Browsers:', browsers);

    const failedTests: Set<string> = new Set();

    const createRunner = (filterByFailedTests = false, testsToFilter?: Set<string>) => {
      const runner: Runner = testCafe!.createRunner()
        .browsers(browsers)
        .reporter(reporter)
        .src([`./tests/${componentFolder}/${file}.ts`]);

      runner.compilerOptions({
        typescript: {
          customCompilerModulePath: '../../node_modules/typescript',
        },
      });

      runner.concurrency(filterByFailedTests ? 1 : (args.concurrency || 4));

      const filters: FilterFunction[] = [];

      if (indices && !filterByFailedTests) {
        const [current, total] = indices.split(/_|of|\\|\//ig).map((x) => +x);

        /* eslint-disable no-console */
        console.info(' === test run config ===');
        console.info(` > indices: current = ${current} | total = ${total}`);
        console.info(' > strategy: round-robin by test (not by file)');
        console.info(' > glob: ', [`./tests/${componentFolder}/*.ts`]);
        console.info('\n');
        /* eslint-enable no-console */

        let globalTestIndex = 0;
        filters.push(() => {
          globalTestIndex += 1;
          const testChunk = ((globalTestIndex - 1) % total) + 1;
          return testChunk === current;
        });
      }

      if (testName) {
        filters.push((name: string) => name === testName);
      }

      if (filterByFailedTests && testsToFilter && testsToFilter.size > 0) {
        filters.push((name: string) => testsToFilter.has(name));
      }

      if (args.skipUnstable) {
        filters.push((
          _testName: string,
          _fixtureName: string,
          _fixturePath: string,
          testMeta?: any,
        ) => !(testMeta)?.unstable);
      }

      filters.push((
        _testName: string,
        _fixtureName: string,
        _fixturePath: string,
        testMeta?: any,
      ) => {
        if (testMeta?.runInTheme) {
          return testMeta.runInTheme === process.env.theme;
        }
        return true;
      });

      if (!componentFolderArg && args.theme) {
        filters.push((
          _testName: string,
          _fixtureName: string,
          _fixturePath: string,
          testMeta?: any,
        ) => {
          if (testMeta?.runInTheme === process.env.theme) {
            return true;
          }

          if (!testMeta?.themes || !Array.isArray(testMeta.themes)) {
            return false;
          }

          return testMeta.themes.includes(args.theme);
        });
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

      return runner;
    };

    const runOptions: RunOptions = {
      quarantineMode: false,
      // @ts-expect-error ts-error
      hooks: {
        test: {
          before: async (t: TestController) => {
            if (args.shadowDom) {
              await loadShadowDomExtension(t);
              await addShadowRootTree(t);
            }

            if (!componentFolder.includes('accessibility')) {
              // @ts-expect-error ts-errors
              const { meta } = t.testRun.test;

              await ClientFunction(() => {
                if (document.activeElement && document.activeElement !== document.body) {
                  (document.activeElement as HTMLElement).blur();
                }

                window.getSelection()?.removeAllRanges();
              }).with({ boundTestRun: t })();

              await t.hover('html', { offsetX: -9999, offsetY: -9999 });

              const [width, height] = meta?.browserSize ?? DEFAULT_BROWSER_SIZE;
              await t.resizeWindow(width, height);
            } else {
              await loadAxeCore(t);
            }

            const currentTheme = await getCurrentTheme(t) || 'fluent.blue.light';
            const newTheme = args.theme || 'fluent.blue.light';

            if (currentTheme !== newTheme) {
              await changeTheme(t, newTheme);
            }
          },
          after: async (t: TestController) => {
            await clearTestPage(t);

            if (args.retryFailed) {
              // @ts-expect-error ts-errors
              const { test, errs } = t.testRun;
              if (errs && errs.length > 0) {
                failedTests.add(test.name);
              }
            }
          },
        },
      },
    };

    if (args.browsers === 'chrome:docker' || args.disableScreenshots) {
      runOptions.disableScreenshots = true;
    }

    // First run - all tests
    const runner = createRunner(false);
    let failedCount = await retry(() => runner.run(runOptions), LAUNCH_RETRY_ATTEMPTS);

    // Retry failed tests multiple times if enabled and there are failures
    if (args.retryFailed && failedTests.size > 0 && failedCount > 0) {
      const initialFailedCount = failedTests.size;
      let attemptsLeft = FAILED_TESTS_RETRY_ATTEMPTS;

      while (attemptsLeft > 0 && failedCount > 0) {
        const attemptNumber = FAILED_TESTS_RETRY_ATTEMPTS - attemptsLeft + 1;

        /* eslint-disable no-console */
        console.info('\n');
        console.info('='.repeat(60));
        console.info(`RETRY ATTEMPT ${attemptNumber}/${FAILED_TESTS_RETRY_ATTEMPTS}`);
        console.info(`Retrying ${failedTests.size} failed test(s)`);
        console.info('='.repeat(60));
        console.info('Failed tests:');
        failedTests.forEach((failedTestName) => console.info(`  - ${failedTestName}`));
        console.info('='.repeat(60));
        console.info('\n');
        /* eslint-enable no-console */

        const testsToRetry = new Set(failedTests);
        failedTests.clear();

        const retryRunner = createRunner(true, testsToRetry);

        failedCount = await retry(
          () => retryRunner.run(runOptions),
          LAUNCH_RETRY_ATTEMPTS,
        );

        attemptsLeft -= 1;

        /* eslint-disable no-console */
        console.info('\n');
        console.info('='.repeat(60));
        console.info(`ATTEMPT ${attemptNumber} RESULTS`);
        console.info('='.repeat(60));
        console.info(`Tests retried: ${testsToRetry.size}`);
        console.info(`Still failing: ${failedCount}`);
        console.info(`Passed on this attempt: ${Math.max(0, testsToRetry.size - failedCount)}`);
        console.info('='.repeat(60));
        console.info('\n');
        /* eslint-enable no-console */

        if (failedCount === 0) {
          /* eslint-disable no-console */
          console.info('✅ All previously failed tests now pass!');
          console.info('\n');
          /* eslint-enable no-console */
          break;
        }
      }

      /* eslint-disable no-console */
      console.info('\n');
      console.info('='.repeat(60));
      console.info('FINAL RETRY RESULTS');
      console.info('='.repeat(60));
      console.info(`Initially failed: ${initialFailedCount}`);
      console.info(`Total retry attempts used: ${FAILED_TESTS_RETRY_ATTEMPTS - attemptsLeft}`);
      console.info(`Final failing count: ${failedCount}`);
      console.info(`Successfully recovered: ${initialFailedCount - failedCount}`);
      console.info('='.repeat(60));
      console.info('\n');
      /* eslint-enable no-console */
    }

    await testCafe.close();

    process.exit(failedCount);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error occurred during test execution:', error);

    // Ensure TestCafe is properly closed
    if (testCafe) {
      try {
        await testCafe.close();
      } catch (closeError) {
        // eslint-disable-next-line no-console
        console.error('Error closing TestCafe:', closeError);
      }
    }

    process.exit(1);
  }
}

main();
