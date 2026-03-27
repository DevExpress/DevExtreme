import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sticky columns - Adaptability', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
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
        width: 400,
        dataSource: [
          {
            field1: 'test1', field2: 'test2', field3: 'test3', field4: 'test4',
          },
        ],
        rtlEnabled,
        columnHidingEnabled: true,
        columns: [
          { dataField: 'field1', fixed: true, width: 150 },
          { dataField: 'field2', width: 150 },
          { dataField: 'field3', width: 150 },
          { dataField: 'field4', width: 150 },
        ],
      });

      const dataGrid = new DataGrid(page);
      await expect(dataGrid.getContainer()).toBeVisible();

      await dataGrid.apiExpandAdaptiveDetailRow('test1');

      const adaptiveRow = dataGrid.getAdaptiveRow(0);
      await expect(adaptiveRow.element).toBeVisible();

      await testScreenshot(page, `adaptability_sticky_columns_with_adaptive_detail_row_1_(rtlEnabled_=_${rtlEnabled}).png`, {
        element: '#container',
      });
    });
  });
});
