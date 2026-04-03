import createTestCafe, { ClientFunction } from 'testcafe';
import fs from 'fs';

const LAUNCH_RETRY_ATTEMPTS = 3;
const LAUNCH_RETRY_TIMEOUT = 10000;

const wait = async (
  timeout: number,
): Promise<void> => new Promise((resolve) => setTimeout(resolve, timeout));

const retry = async <T>(action: () => Promise<T>, attempt: number): Promise<T> => {
  try {
    return await action();
  } catch (error) {
    if (attempt <= 1) {
      throw error;
    }

    console.log('\n > error occurred during testcafe launch!\n');
    console.error(error);
    console.info(`\n > waiting ${LAUNCH_RETRY_TIMEOUT / 1000} seconds...\n`);
    await wait(LAUNCH_RETRY_TIMEOUT);
    console.info('\n > retry launching testcafe\n');

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

  const getDomDebugState = ClientFunction(() => {
    const activeElement = document.activeElement as HTMLElement | null;
    const htmlRect = document.documentElement?.getBoundingClientRect();

    return {
      activeElementTag: activeElement?.tagName || null,
      activeElementId: activeElement?.id || null,
      activeElementClassName: activeElement?.className || null,
      selectionType: window.getSelection()?.type || null,
      selectionRangeCount: window.getSelection()?.rangeCount || 0,
      htmlRect: htmlRect
        ? {
          top: htmlRect.top,
          left: htmlRect.left,
          width: htmlRect.width,
          height: htmlRect.height,
        }
        : null,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      readyState: document.readyState,
      url: window.location.href,
    };
  });

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
  };

  const failedCount = await retry(() => runner
    .reporter(reporters)
    .browsers(process.env.BROWSERS || 'chrome --no-sandbox --disable-dev-shm-usage --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl=swiftshader --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning')
    .concurrency(concurrency || 1)
    .run({
      quarantineMode: getQuarantineMode(),
      // @ts-expect-error ts-error
      hooks: {
        test: {
          // eslint-disable-next-line no-undef
          before: async (t: TestController) => {
            try {
              await ClientFunction(() => {
                if (document.activeElement && document.activeElement !== document.body) {
                  (document.activeElement as HTMLElement).blur();
                }
                window.getSelection()?.removeAllRanges();
              }).with({ boundTestRun: t })();

              await t.hover('html', { offsetX: 1, offsetY: 1 });
            } catch (error) {
              let domState = null;

              try {
                domState = await getDomDebugState.with({ boundTestRun: t })();
              } catch (domStateError) {
                console.error('Failed to collect DOM debug state:', domStateError);
              }

              console.error('TestCafe before-hook failed while running blur/selection cleanup or html hover.');
              const unsafeController = t as TestController & {
                testRun?: {
                  test?: {
                    name?: string;
                    fixture?: {
                      name?: string;
                    };
                  };
                };
              };

              console.error('Test context:', {
                testName: unsafeController.testRun?.test?.name,
                fixtureName: unsafeController.testRun?.test?.fixture?.name,
              });
              console.error('DOM state snapshot:', domState);
              console.error('Original error:', error);

              throw error;
            }
          },
        },
      },
    }), LAUNCH_RETRY_ATTEMPTS);

  await tester.close();
  process.exit(failedCount);
}

main();
