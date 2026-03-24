import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Pagination', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['full', 'compact'].forEach((displayMode) => {
    [undefined, 'Total {2} items. Page {0} of {1}'].forEach((infoText) => {
      [true, false].forEach((showInfo) => {
        [true, false].forEach((showNavigationButtons) => {
          [true, false].forEach((showPageSizeSelector) => {
            test(`Pagination dm_${displayMode}-`
              + `${infoText ? 'has' : 'has_no'}_it-`
              + `si_${showInfo.toString()}-`
              + `snb_${showNavigationButtons.toString()}-`
              + `spss_${showPageSizeSelector.toString()}`, async ({ page }) => {
    await createWidget(page, 'dxPagination', {
              itemCount: 50,
              displayMode,
              infoText,
              showInfo,
              showNavigationButtons,
              showPageSizeSelector,
            });

              await testScreenshot(page,
                `pagination-dm_${displayMode}-`
                  + `${infoText ? 'has' : 'has_no'}_it-`
                  + `si_${showInfo.toString()}-`
                  + `snb_${showNavigationButtons.toString()}-`
                  + `spss_${showPageSizeSelector.toString()}`
                  + '.png',
              );

    });
          });
        });
      });
    });
  });
});
