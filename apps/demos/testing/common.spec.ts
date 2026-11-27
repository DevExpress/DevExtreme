import { expect, test } from '@playwright/test';
import {
  FRAMEWORKS,
  shouldRunFramework,
  shouldSkipDemo,
} from '../utils/visual-tests/matrix-test-core';
import { getScreenshotName } from '../utils/visual-tests/helpers/theme-utils';
import { THEME } from '../utils/visual-tests/playwright/const';
import { getConsoleMessages } from '../utils/visual-tests/playwright/demo-page';
import { getDemos, loadDemo } from '../utils/visual-tests/playwright/demos';
import { knownWarnings } from './known-warnings';
import { skippedTests } from './skipped-tests';

Object.values(FRAMEWORKS).forEach((approach) => {
  if (!shouldRunFramework(approach)) { return; }

  test.describe(approach, () => {
    getDemos(approach).forEach((demo) => {
      if (shouldSkipDemo(approach, demo.widgetName, demo.demoName, skippedTests)) { return; }

      test(demo.testName, async ({ page }) => {
        const pageErrors = await loadDemo(page, demo);

        const consoleMessages = (await getConsoleMessages(page))
          .filter((message) => !knownWarnings.some((warning) => message.startsWith(warning)));

        expect(consoleMessages, 'console errors and warnings').toEqual([]);
        expect(pageErrors, 'uncaught errors in the page').toEqual([]);

        await expect(page).toHaveScreenshot([getScreenshotName(`${demo.testName}.png`, THEME)]);
      });
    });
  });
});
