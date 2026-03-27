import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const dataSource = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Jane Johnson' },
  { id: 3, name: 'Mike Wilson' },
];

const ROW_INDEX = 1;

const baseConfig = {
  dataSource,
  keyExpr: 'id',
  height: 300,
  showBorders: true,
  editing: {
    mode: 'batch',
    allowDeleting: true,
  },
};

test.describe('DataGrid deleted row height consistency T1286265', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('When DataGrid has fixed column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...baseConfig,
      showRowLines: true,
      columns: [
        { dataField: 'id', width: 50, fixed: true },
        { dataField: 'name', width: 150 },
      ],
    });

    const dataGrid = new DataGrid(page);
    const initialRowHeight = await page.locator('.dx-data-row').nth(ROW_INDEX).evaluate((el) => el.clientHeight);

    await dataGrid.apiDeleteRow(ROW_INDEX);

    const deletedRow = page.locator('.dx-data-row').nth(ROW_INDEX);
    await expect(deletedRow).toHaveClass(/dx-row-removed/);

    const deletedRowHeight = await deletedRow.evaluate((el) => el.clientHeight);
    expect(deletedRowHeight).toBe(initialRowHeight);

    await testScreenshot(page, 'datagrid-deleted-row-height-row-lines-and-fixed-column.png', { element: page.locator('#container') });
  });

  test('When DataGrid does not have fixed column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...baseConfig,
      showRowLines: true,
      columns: [
        { dataField: 'id', width: 50 },
        { dataField: 'name', width: 150 },
      ],
    });

    const dataGrid = new DataGrid(page);
    const initialRowHeight = await page.locator('.dx-data-row').nth(ROW_INDEX).evaluate((el) => el.clientHeight);

    await dataGrid.apiDeleteRow(ROW_INDEX);

    const deletedRow = page.locator('.dx-data-row').nth(ROW_INDEX);
    await expect(deletedRow).toHaveClass(/dx-row-removed/);

    const deletedRowHeight = await deletedRow.evaluate((el) => el.clientHeight);
    expect(deletedRowHeight).toBe(initialRowHeight);

    await testScreenshot(page, 'datagrid-deleted-row-height-row-lines-and-no-fixed-column.png', { element: page.locator('#container') });
  });

  test('When not showing row lines and not fixed any column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...baseConfig,
      showRowLines: false,
      columns: [
        { dataField: 'id', width: 50 },
        { dataField: 'name', width: 150 },
      ],
    });

    const dataGrid = new DataGrid(page);
    const initialRowHeight = await page.locator('.dx-data-row').nth(ROW_INDEX).evaluate((el) => el.clientHeight);

    await dataGrid.apiDeleteRow(ROW_INDEX);

    const deletedRow = page.locator('.dx-data-row').nth(ROW_INDEX);
    await expect(deletedRow).toHaveClass(/dx-row-removed/);

    const deletedRowHeight = await deletedRow.evaluate((el) => el.clientHeight);
    expect(deletedRowHeight).toBe(initialRowHeight);

    await testScreenshot(page, 'datagrid-deleted-row-height-no-row-lines-and-no-fixed-column.png', { element: page.locator('#container') });
  });

  test('When not showing row lines and DataGrid has fixed column row height should not change when marked as deleted', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...baseConfig,
      showRowLines: false,
      columns: [
        { dataField: 'id', width: 50, fixed: true },
        { dataField: 'name', width: 150 },
      ],
    });

    const dataGrid = new DataGrid(page);
    const initialRowHeight = await page.locator('.dx-data-row').nth(ROW_INDEX).evaluate((el) => el.clientHeight);

    await dataGrid.apiDeleteRow(ROW_INDEX);

    const deletedRow = page.locator('.dx-data-row').nth(ROW_INDEX);
    await expect(deletedRow).toHaveClass(/dx-row-removed/);

    const deletedRowHeight = await deletedRow.evaluate((el) => el.clientHeight);
    expect(deletedRowHeight).toBe(initialRowHeight);

    await testScreenshot(page, 'datagrid-deleted-row-height-no-row-lines-and-fixed-column.png', { element: page.locator('#container') });
  });
});
