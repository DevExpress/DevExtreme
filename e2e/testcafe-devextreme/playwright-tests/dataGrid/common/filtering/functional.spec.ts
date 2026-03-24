import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Don\'t calculate additional filter when filtering column list is empty', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      filterValue: ['id', '>=', 1],
      dataSource: null,
      columns: [],
      showBorders: true,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.option({
      columns: [
        { dataField: 'id', caption: 'ID', dataType: 'number' },
        { dataField: 'name', caption: 'Name', dataType: 'string' },
      ],
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ],
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await dataGrid.option({
      columns: [],
      dataSource: undefined,
    });

    const consoleErrors: string[] = [];
    page.on('pageerror', (err) => { consoleErrors.push(err.message); });

    expect(consoleErrors.every((msg) => !msg.includes('E1047'))).toBeTruthy();
  });
});
