import { join } from 'path';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import type { IComparerOptions, SelectorType } from 'devextreme-screenshot-comparer/build/src/options';
import type { Page } from '@playwright/test';

import { DEMOS_ROOT, THEME } from './common-screenshots-utils';

type ScreenshotComparerOptions = Partial<IComparerOptions>;

interface ScreenshotComparisonResult {
  isValid: boolean;
  errorMessage: string;
}

interface TestControllerAdapter {
  testRun: {
    opts: {
      'screenshots-comparer': ScreenshotComparerOptions;
      disableScreenshots: boolean;
    };
    test: {
      testFile: {
        filename: string;
      };
    };
  };
  eval: <T>(callback: () => T | Promise<T>) => Promise<T>;
  wait: (timeout: number) => Promise<void>;
  takeScreenshot: (filePath: string) => Promise<void>;
  takeElementScreenshot: (element: SelectorType, filePath: string) => Promise<void>;
}

function getScreenshotName(baseName: string, theme = THEME.fluent): string {
  const themePostfix = ` (${theme})`;
  return baseName.endsWith('.png')
    ? baseName.replace('.png', `${themePostfix}.png`)
    : `${baseName}${themePostfix}.png`;
}

function getComparerOptions(
  comparisonOptions?: ScreenshotComparerOptions,
): ScreenshotComparerOptions {
  // Mirror apps/demos/utils/visual-tests/helpers/theme-utils.js#testScreenshot
  // so the Playwright comparer applies the same tolerances and text-mask
  // threshold for every theme (fluent and material). Material is the most
  // visible offender because of Roboto antialiasing, but fluent diffs are
  // sensitive to the same defaults — both fail without this parity.
  return {
    ...comparisonOptions,
    textDiffTreshold: 0.2,
    path: join(DEMOS_ROOT, 'testing'),
    screenshotsRelativePath: '/screenshots',
    destinationRelativePath: '/artifacts/compared-screenshots',
    looksSameComparisonOptions: {
      ...comparisonOptions?.looksSameComparisonOptions,
      tolerance: 20,
      antialiasingTolerance: 20,
    },
  };
}

function createTestCafeAdapter(
  page: Page,
  comparisonOptions?: ScreenshotComparerOptions,
): TestControllerAdapter {
  return {
    testRun: {
      opts: {
        'screenshots-comparer': getComparerOptions(comparisonOptions),
        disableScreenshots: false,
      },
      test: {
        testFile: {
          filename: join(DEMOS_ROOT, 'testing/common.test.ts'),
        },
      },
    },
    eval: (callback) => page.evaluate(callback),
    wait: (timeout) => page.waitForTimeout(timeout),
    takeScreenshot: (filePath) => page.screenshot({
      path: filePath,
      fullPage: false,
    }).then(() => {}),
    takeElementScreenshot: async (element, filePath) => {
      if (typeof element !== 'string') {
        throw new Error('Playwright screenshot comparer adapter supports only string selectors');
      }

      await page.locator(element).screenshot({ path: filePath });
    },
  };
}

export async function compareDemoScreenshot(
  page: Page,
  screenshotName: string,
  comparisonOptions?: ScreenshotComparerOptions,
): Promise<ScreenshotComparisonResult> {
  const finalScreenshotName = getScreenshotName(screenshotName, process.env.THEME || THEME.fluent);
  const testController = createTestCafeAdapter(page, comparisonOptions);
  const { takeScreenshot, compareResults } = createScreenshotsComparer(testController as never);

  await takeScreenshot(finalScreenshotName);

  return {
    isValid: compareResults.isValid(),
    errorMessage: compareResults.errorMessages(),
  };
}
