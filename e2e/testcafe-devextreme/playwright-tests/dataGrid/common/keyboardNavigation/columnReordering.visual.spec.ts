import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - Column Reordering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [true, false].forEach((rtlEnabled) => {
    test(`reorder column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          {
            field1: 'test1', field2: 'test2', field3: 'test3',
          },
        ],
        rtlEnabled,
        allowColumnReordering: true,
        columns: [
          { dataField: 'field1' },
          { dataField: 'field2' },
          { dataField: 'field3' },
        ],
      });

      const dataGrid = new DataGrid(page);
      const headerRow = dataGrid.getHeaderRow();
      const firstHeaderCell = headerRow.locator('td').nth(0);

      await firstHeaderCell.click();

      const arrowKey = rtlEnabled ? 'ArrowLeft' : 'ArrowRight';
      await page.keyboard.press(arrowKey);

      await testScreenshot(page, `column-reorder-keyboard-rtl-${rtlEnabled}.png`, {
        element: '#container',
      });
    });
  });
});
