import { expect, test } from '@playwright/test';

import {
  addCommonClientScripts,
  DEMOS_ROOT,
  execCode,
  execTestCafeCode,
  FRAMEWORKS,
  getDemoParts,
  getDemoPaths,
  getPageUrl,
  isAccessibilityStrategy,
  isCspStrategy,
  prepareDemoPage,
  readDemoFile,
  resetPageState,
  shouldRunFramework,
  shouldRunTestAtIndex,
  shouldRunTestExplicitly,
  shouldSkipDemo,
  updateConfig,
  waitForAngularLoading,
  waitForStableRendering,
} from './common-screenshots-utils';
import { checkDemoAccessibility } from './accessibility';
import { collectCspViolations, writeCspReport } from './csp';
import { compareDemoScreenshot } from './screenshot-comparer';

updateConfig();

test.describe.configure({ mode: 'parallel' });

const isAccessibility = isAccessibilityStrategy();
const isCsp = isCspStrategy();

Object.values(FRAMEWORKS).forEach((approach) => {
  if (!shouldRunFramework(approach)) {
    return;
  }

  test.describe(approach, () => {
    getDemoPaths(approach).forEach((demoPath, index) => {
      if (!shouldRunTestAtIndex(index + 1)) {
        return;
      }

      const { widgetName, demoName, testName } = getDemoParts(demoPath);
      const pageURL = getPageUrl(widgetName, demoName, approach);

      if (!pageURL || !shouldRunTestExplicitly(pageURL)) {
        return;
      }

      const demoExists = readDemoFile(demoPath, 'index.html');
      if (!demoExists) {
        return;
      }

      const visualTestSettings = readDemoFile(demoPath, '../visualtestrc.json', (x) => JSON.parse(x));
      const clientScriptSource = readDemoFile(demoPath, '../client-script.js', (x) => [{ content: x }]) || [];
      const testCodeSource = readDemoFile(demoPath, '../test-code.js', (x) => x);
      const testCafeCodeSource = readDemoFile(demoPath, '../testcafe-test-code.js', (x) => x);
      const visualTestStyles = readDemoFile(
        demoPath,
        '../test-styles.css',
        (x) => `
          var style = document.createElement('style');
          style.innerHTML = \`${x}\`;
          document.getElementsByTagName('head')[0].appendChild(style);
        `,
      );

      let comparisonOptions: Parameters<typeof compareDemoScreenshot>[2];
      if (process.env.DISABLE_DEMO_TEST_SETTINGS !== 'all') {
        const approachLowerCase = approach.toLowerCase();
        const mergedTestSettings = (visualTestSettings && {
          ...visualTestSettings,
          ...visualTestSettings[approachLowerCase],
        }) || {};

        if (process.env.CI_ENV && process.env.DISABLE_DEMO_TEST_SETTINGS !== 'ignore') {
          if (mergedTestSettings.ignore) {
            return;
          }
        }
        if (process.env.DISABLE_DEMO_TEST_SETTINGS !== 'comparison-options') {
          comparisonOptions = mergedTestSettings['comparison-options'];
        }
      }

      if (!isAccessibility && shouldSkipDemo(approach, widgetName, demoName)) {
        return;
      }

      test(testName, async ({ page }) => {
        await addCommonClientScripts(page, clientScriptSource as { content: string }[]);
        prepareDemoPage(widgetName, demoName, approach);
        await page.goto(pageURL);
        await resetPageState(page);

        if (visualTestStyles) {
          await execCode(page, visualTestStyles);
        }

        if (approach === 'Angular') {
          await waitForAngularLoading(page);
        }

        if (testCodeSource) {
          await execCode(page, testCodeSource);
        }

        if (testCafeCodeSource) {
          await execTestCafeCode(page, testCafeCodeSource);
        }

        await waitForStableRendering(page);

        if (isAccessibility) {
          const accessibilityResult = await checkDemoAccessibility(page, testName);

          expect(accessibilityResult.isValid, accessibilityResult.errorMessage).toBe(true);
          return;
        }

        if (isCsp) {
          const violations = await collectCspViolations(page);
          writeCspReport(testName, approach, violations);
          return;
        }

        const compareResult = await compareDemoScreenshot(
          page,
          `${testName}.png`,
          comparisonOptions,
        );

        expect(compareResult.isValid, compareResult.errorMessage).toBe(true);
      });
    });
  });
});

test.afterAll(() => {
  // eslint-disable-next-line no-nested-ternary
  const strategyName = isAccessibility ? 'accessibility' : isCsp ? 'csp' : 'screenshots';

  console.log(`Playwright common ${strategyName} root: ${DEMOS_ROOT}`);
});
