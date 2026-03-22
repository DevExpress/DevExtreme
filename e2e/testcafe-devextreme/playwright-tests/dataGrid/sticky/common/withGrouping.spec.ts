import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: import defaultConfig from sticky helpers or inline the data

test.describe('FixedColumns - Grouping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  [false, true].forEach((rtlEnabled) => {

  test(`Sticky columns with grouping & summary (rtl=${rtlEnabled})`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        ...defaultConfig,
        rtlEnabled,
        customizeColumns(columns) {
          columns[2].groupIndex = 0;
        },
        summary: {
          groupItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'City',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
            showInGroupFooter: false,
            alignByColumn: true,
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
            showInGroupFooter: true,
          }],
          totalItems: [{
            column: 'OrderNumber',
            summaryType: 'count',
            displayFormat: '{0} orders',
          }, {
            column: 'SaleAmount',
            summaryType: 'max',
            valueFormat: 'currency',
          }, {
            column: 'TotalAmount',
            summaryType: 'max',
            valueFormat: 'currency',
          }, {
            column: 'TotalAmount',
            summaryType: 'sum',
            valueFormat: 'currency',
            displayFormat: 'Total: {0}',
          }],
        },
      });

          expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

      await testScreenshot(page, `grouping-scroll-begin-rtl=${rtlEnabled}.png`, { element: page.locator('#container') });

      await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: rtlEnabled ? 500 : 100 });
      await testScreenshot(page, `grouping-scroll-center=${rtlEnabled}.png`, { element: page.locator('#container') });

      await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: rtlEnabled ? 0 : 10000 });
      await testScreenshot(page, `grouping-scroll-end=${rtlEnabled}.png`, { element: page.locator('#container') });
    });
    // TODO: .after() block removed
});
