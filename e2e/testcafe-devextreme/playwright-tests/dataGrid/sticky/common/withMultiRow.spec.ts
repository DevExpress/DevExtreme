import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: import defaultConfig from sticky helpers or inline the data

test.describe('Sticky columns - Multi Row Header Columns', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: generic.light
  // visual: material.blue.light
  // visual: fluent.blue.light

  test('The multi row header columns should have vertical borders when a column is fixed (generic.light theme) (T1282595)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
          ...defaultConfig,
          columns: [
            {
              dataField: 'ID',
              fixed: true,
            },
            {
              caption: 'Order',
              columns: [
                'OrderNumber',
                'OrderDate',
              ],
            },
            'SaleAmount',
            'Terms',
          ],
          showBorders: true,
        });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await testScreenshot(page, 'multi_row_header_columns.png', { element: page.locator('#container') });
  });
});
