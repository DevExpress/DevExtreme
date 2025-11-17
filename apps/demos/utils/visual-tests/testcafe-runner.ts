import createTestCafe from 'testcafe';
import { ClientFunction } from 'testcafe';
import { THEME } from './helpers/theme-utils';
import fs from 'fs';

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
  const tester = await createTestCafe({
    cache: true,
  });
  const runner = tester.createRunner();
  const concurrency = (process.env.CONCURRENCY && (+process.env.CONCURRENCY)) || 1;

  const reporters = ['spec-time'];

  if (process.env.STRATEGY === 'accessibility') {
    // @ts-expect-error ts-error
    reporters.push(accessibilityTestCafeReporter);
  }

  const getQuarantineMode = () => {
    // if(process.env.THEME === THEME.material) {
    //   return { successThreshold: 1, attemptLimit: 5 };
    // }

    // if (process.env.TCQUARANTINE) {
    //   return { successThreshold: 1, attemptLimit: 2 };
    // }
    
    return false;
  }

  const failedCount = await runner
    .reporter(reporters)
    .browsers(process.env.BROWSERS || 'chrome --no-sandbox --disable-dev-shm-usage --disable-partial-raster --disable-skia-runtime-opts --run-all-compositor-stages-before-draw --disable-new-content-rendering-timeout --disable-threaded-animation --disable-threaded-scrolling --disable-checker-imaging --disable-image-animation-resync --use-gl="swiftshader" --disable-features=PaintHolding --js-flags=--random-seed=2147483647 --font-render-hinting=none --disable-font-subpixel-positioning')
    .concurrency(concurrency || 1)
    .run({
      quarantineMode: getQuarantineMode(),
      // @ts-expect-error ts-error
      hooks: {
        test: {
          before: async (t: TestController) => {
            await ClientFunction(() => {
              if (document.activeElement && document.activeElement !== document.body) {
                (document.activeElement as HTMLElement).blur();
              }
              window.getSelection()?.removeAllRanges();
            }).with({ boundTestRun: t })();
          },
        },
      },
    });

  await tester.close();
  process.exit(failedCount);
}

main();
