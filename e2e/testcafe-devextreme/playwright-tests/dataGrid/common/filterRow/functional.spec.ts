import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('FilterRow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Filter should reset if the filter row editor text is cleared (T1257261)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ],
      keyExpr: 'id',
      filterRow: { visible: true },
      columns: ['id', 'name'],
    });

    const dataGrid = new DataGrid(page);
    const filterEditor = await dataGrid.getFilterEditor(1);

    await filterEditor.click();
    await filterEditor.fill('Alice');
    await page.keyboard.press('Enter');

    await expect(dataGrid.dataRows).toHaveCount(1);

    await filterEditor.click();
    await filterEditor.fill('');
    await page.keyboard.press('Enter');

    await expect(dataGrid.dataRows).toHaveCount(3);
  });
});
