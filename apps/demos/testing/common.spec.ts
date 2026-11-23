import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';
import {
  FRAMEWORKS,
  globalReadFrom,
  settings,
  shouldRunFramework,
  shouldRunTestAtIndex,
  shouldRunTestExplicitly,
  shouldSkipDemo,
  updateConfig,
} from '../utils/visual-tests/matrix-test-core';
import { getScreenshotName } from '../utils/visual-tests/helpers/theme-utils';
import { mockApi } from '../utils/visual-tests/playwright/api-mocks';
import { BASE_URL, THEME } from '../utils/visual-tests/playwright/const';
import {
  getConsoleMessages,
  getVendorVizWidgets,
  openDemo,
  prepareDemoPage,
  runTestCode,
  trackPageActivity,
} from '../utils/visual-tests/playwright/demo-page';
import { knownWarnings } from './known-warnings';
import { getTestGlobalsScriptPath } from '../utils/visual-tests/test-globals-bundle';
import { skippedTests } from './skipped-tests';

type DemoSteps = (page: Page) => Promise<void>;

// The other frameworks still run in TestCafe (common.test.ts).
const MIGRATED_FRAMEWORKS = [FRAMEWORKS.jquery, FRAMEWORKS.react, FRAMEWORKS.vue, FRAMEWORKS.angular];

const DEMOS_ROOT = join(__dirname, '..');

// Demos are selected by name with --grep, so the command line holds no demo masks.
updateConfig({ explicitTestArgs: [], verbose: false });

const demoPaths = glob.sync('Demos/*/*', { cwd: DEMOS_ROOT }).sort();

MIGRATED_FRAMEWORKS.forEach((approach) => {
  if (!shouldRunFramework(approach)) { return; }

  // The widgets test-code.js reaches through window.DevExpress; the React and Vue bundles expose them only with this script.
  const testGlobalsPath = getTestGlobalsScriptPath(approach);
  const testGlobals = testGlobalsPath ? readFileSync(testGlobalsPath, 'utf8') : null;
  const vendorVizWidgets = getVendorVizWidgets(approach);

  test.describe(approach, () => {
    demoPaths.forEach((demoPath, index) => {
      const demoDir = join(DEMOS_ROOT, demoPath);

      if (!shouldRunTestAtIndex(index + 1) || !existsSync(join(demoDir, approach))) { return; }

      const [, widgetName, demoName] = demoPath.split(/[/\\]/);
      const testName = `${widgetName}-${demoName}`;
      const pageURL = `${BASE_URL}/apps/demos/Demos/${widgetName}/${demoName}/${approach}/`;

      const clientScript = globalReadFrom(demoDir, 'client-script.js', null);
      const testCode = globalReadFrom(demoDir, 'test-code.js', null);
      const testStyles = globalReadFrom(demoDir, 'test-styles.css', null);
      const testSettings = globalReadFrom(demoDir, 'visualtestrc.json', (x) => JSON.parse(x));
      const stepsPath = join(demoDir, 'playwright-test-code.js');

      if (process.env.CI && !['all', 'ignore'].includes(process.env.DISABLE_DEMO_TEST_SETTINGS)) {
        const mergedTestSettings = { ...testSettings, ...testSettings?.[approach.toLowerCase()] };

        if (mergedTestSettings.ignore) { return; }
      }

      if (shouldSkipDemo(approach, widgetName, demoName, skippedTests)) { return; }

      if (settings.explicitTests && !shouldRunTestExplicitly(pageURL)) { return; }

      test(testName, async ({ page }) => {
        const pageErrors: string[] = [];

        page.on('pageerror', (error) => pageErrors.push(error.stack ?? error.message));

        const waitForIdle = trackPageActivity(page);

        await mockApi(page);
        await prepareDemoPage(page, pageURL, THEME, clientScript, testGlobals, vendorVizWidgets);
        await openDemo(page, pageURL, waitForIdle);

        if (testStyles) {
          await page.addStyleTag({ content: testStyles });
        }

        if (testCode) {
          await runTestCode(page, testCode);
        }

        if (existsSync(stepsPath)) {
          // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-require-imports
          const { default: steps } = require(stepsPath) as { default: DemoSteps };

          await steps(page);
        }

        await waitForIdle();

        const consoleMessages = (await getConsoleMessages(page))
          .filter((message) => !knownWarnings.some((warning) => message.startsWith(warning)));

        expect(consoleMessages, 'console errors and warnings').toEqual([]);
        expect(pageErrors, 'uncaught errors in the page').toEqual([]);

        await expect(page).toHaveScreenshot([getScreenshotName(`${testName}.png`, THEME)]);
      });
    });
  });
});
