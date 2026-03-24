import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Focused row - new rows T1162227', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('It should fire events after new rows were added', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).focusedRowChangingCount = 0;
      (window as any).focusedRowChangedCount = 0;
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
      ],
      keyExpr: 'id',
      focusedRowEnabled: true,
      editing: {
        mode: 'batch',
        allowAdding: true,
      },
      onFocusedRowChanging() {
        (window as any).focusedRowChangingCount += 1;
      },
      onFocusedRowChanged() {
        (window as any).focusedRowChangedCount += 1;
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.apiAddRow();

    const firstDataCell = dataGrid.getDataCell(0, 0).element;
    await firstDataCell.click();

    const changingCount = await page.evaluate(() => (window as any).focusedRowChangingCount);
    const changedCount = await page.evaluate(() => (window as any).focusedRowChangedCount);

    expect(changingCount).toBeGreaterThan(0);
    expect(changedCount).toBeGreaterThan(0);
  });
});
