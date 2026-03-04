import createTestCafe from 'testcafe';
import { ClientFunction } from 'testcafe';
import fs from 'fs';

const LAUNCH_RETRY_ATTEMPTS = 3;
const LAUNCH_RETRY_TIMEOUT = 10000;

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

function accessibilityTestCafeReporter() {
  return {
    violationsCount: {
      minor: 0,
      moderate: 0,
      serious: 0,
      critical: 0,
    },

    appendAxeViolationsCount(reportData, browsers) {
      if (!reportData) { return; }

      if (!Object.values(reportData).some((data) => (data as any[]).length)) { return; }

      browsers.forEach(({ testRunId }) => {
        const browserReportData = reportData[testRunId];

        if (!browserReportData) { return; }

        browserReportData.forEach((data) => {
          Object.keys(data).forEach((violation) => {
            this.violationsCount[violation] += data[violation];
          });
        });
      });
    },

    reportFixtureStart() {},

    reportTaskStart() {},

    reportTestStart() {},

    reportTestDone(name, testRunInfo) {
      this.appendAxeViolationsCount(testRunInfo.reportData, testRunInfo.browsers);
    },

    reportTaskDone() {
      const {
        minor, moderate, serious, critical,
      } = this.violationsCount;
      const total = minor + minor + serious + critical;

      fs.writeFileSync(process.env.ACCESSIBILITY_TESTCAFE_REPORT_PATH || 'accessibility_report.txt', `Axe report: ${total} accessibility issues found (${critical} critical, ${serious} serious, ${moderate} moderate, and ${minor} minor)`);
    },
  };
}

async function main() {
  const tester = await createTestCafe({});
  const runner = tester.createRunner();
  const concurrency = (process.env.CONCURRENCY && (+process.env.CONCURRENCY)) || 1;

  const reporters = ['spec-time'];

  if (process.env.STRATEGY === 'accessibility') {
    // @ts-expect-error ts-error
    reporters.push(accessibilityTestCafeReporter);
  }

  const getQuarantineMode = () => {
    if (process.env.TCQUARANTINE) {
      return { successThreshold: 1, attemptLimit: 3 };
    }
    
    return false;
  }

  const failedCount = await retry(() => runner
    .reporter(reporters)
    .browsers(process.env.BROWSERS || 'chrome --no-sandbox --disable-dev-shm-usage --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl=swiftshader --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning')
    .concurrency(concurrency || 1)
    .run({
      quarantineMode: getQuarantineMode(),
      // @ts-expect-error ts-error
      hooks: {
        test: {
          before: async (t: TestController) => {
            await t.click('body', { offsetX: 0, offsetY: 0 });
            await ClientFunction(() => {
              if (document.activeElement && document.activeElement !== document.body) {
                (document.activeElement as HTMLElement).blur();
              }
              window.getSelection()?.removeAllRanges();
            }).with({ boundTestRun: t })();
          },
        },
      },
    }), LAUNCH_RETRY_ATTEMPTS);

  await tester.close();
  process.exit(failedCount);
}

main();
