import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: import defaultConfig from sticky helpers or inline the data

test.describe('Sticky columns - Adaptability', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  [false, true].forEach((rtlEnabled) => {

  test(`Sticky columns with adaptive detail row (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        ...defaultConfig,
        width: 800,
        rtlEnabled,
        customizeColumns(columns) {
          columns.forEach((column, index) => {
            if (index < 3) {
              column.hidingPriority = index;
            }

            column.width = 200;
          });
        },
        columnHidingEnabled: true,
      });

          const scrollLeft = rtlEnabled ? -10000 : 10000;

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

      await dataGrid.apiExpandAdaptiveDetailRow(1);

      await testScreenshot(page, `adaptability_sticky_columns_with_adaptive_detail_row_1_(rtlEnabled_=_${rtlEnabled}).png`, { element: page.locator('#container') });

      await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: scrollLeft });

      await testScreenshot(page, `adaptability_sticky_columns_with_adaptive_detail_row_2_(rtlEnabled_=_${rtlEnabled}).png`, { element: page.locator('#container') });
    });
});
