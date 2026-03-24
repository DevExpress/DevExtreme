import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

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
        dataSource: [
          {
            field1: 'test1', field2: 'test2', field3: 'group1', field4: 'test4', amount: 100,
          },
          {
            field1: 'test5', field2: 'test6', field3: 'group1', field4: 'test8', amount: 200,
          },
          {
            field1: 'test9', field2: 'test10', field3: 'group2', field4: 'test12', amount: 300,
          },
        ],
        rtlEnabled,
        columns: [
          { dataField: 'field1', fixed: true },
          { dataField: 'field2' },
          { dataField: 'field3', groupIndex: 0 },
          { dataField: 'field4' },
          { dataField: 'amount' },
        ],
        summary: {
          groupItems: [{
            column: 'amount',
            summaryType: 'sum',
            showInGroupFooter: false,
            alignByColumn: true,
          }],
        },
      });

      const dataGrid = new DataGrid(page);
      await expect(dataGrid.getContainer()).toBeVisible();

      const groupRow = dataGrid.getGroupRow(0);
      await expect(groupRow.element).toBeVisible();

      await testScreenshot(page, `sticky-columns-grouping-summary-rtl-${rtlEnabled}.png`, {
        element: '#container',
      });
    });
  });
});
