import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

const getGridDataConfig = (size: number) => ({
  keyExpr: 'id',
  dataSource: Array.from({ length: size }, (_, idx) => ({
    id: idx,
    dataA: `dataA_${idx}`,
    dataB: `dataB_${idx}`,
    dataC: `dataC_${idx}`,
  })),
  columns: ['dataA', 'dataB', 'dataC'],
});

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

  test('It should fire events when focus switch between existing and a new row', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowFocusChangingResults = [];
      (window as any).rowFocusChangedResults = [];
    });

    await createWidget(page, 'dxDataGrid', {
      focusedRowEnabled: true,
      editing: { mode: 'batch', allowAdding: true, allowUpdating: true },
      ...getGridDataConfig(4),
      onFocusedRowChanging: ({ prevRowIndex, newRowIndex }: any) => {
        (window as any).rowFocusChangingResults.push([prevRowIndex, newRowIndex]);
      },
      onFocusedRowChanged: ({ rowIndex }: any) => {
        (window as any).rowFocusChangedResults.push([rowIndex]);
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    const headerPanel = dataGrid.getHeaderPanel();
    await headerPanel.getAddRowButton().click();
    await page.waitForTimeout(100);

    await dataGrid.getDataCell(1, 0).click();
    await page.waitForTimeout(100);
    await dataGrid.getDataCell(0, 0).click();
    await page.waitForTimeout(100);

    const rowFocusChanging = await page.evaluate(() => (window as any).rowFocusChangingResults);
    const rowFocusChanged = await page.evaluate(() => (window as any).rowFocusChangedResults);

    expect(rowFocusChanging.length).toBeGreaterThan(0);
    expect(rowFocusChanged.length).toBeGreaterThan(0);
  });

  test('It should not fire row events if focusedRowEnabled: false', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowFocusChangingCount = 0;
      (window as any).rowFocusChangedCount = 0;
      (window as any).cellFocusChangingCount = 0;
    });

    await createWidget(page, 'dxDataGrid', {
      focusedRowEnabled: false,
      editing: { mode: 'batch', allowAdding: true, allowUpdating: true },
      ...getGridDataConfig(4),
      onFocusedRowChanging: () => {
        (window as any).rowFocusChangingCount += 1;
      },
      onFocusedRowChanged: () => {
        (window as any).rowFocusChangedCount += 1;
      },
      onFocusedCellChanging: () => {
        (window as any).cellFocusChangingCount += 1;
      },
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    const headerPanel = dataGrid.getHeaderPanel();
    await headerPanel.getAddRowButton().click();
    await page.waitForTimeout(100);

    await dataGrid.getDataCell(1, 0).click();
    await page.waitForTimeout(100);
    await dataGrid.getDataCell(0, 0).click();
    await page.waitForTimeout(100);

    const rowChangingCount = await page.evaluate(() => (window as any).rowFocusChangingCount);
    const rowChangedCount = await page.evaluate(() => (window as any).rowFocusChangedCount);
    const cellChangingCount = await page.evaluate(() => (window as any).cellFocusChangingCount);

    expect(rowChangingCount).toBe(0);
    expect(rowChangedCount).toBe(0);
    expect(cellChangingCount).toBeGreaterThan(0);
  });

  test('It should fire rowChanged event on initialization if focusedRowKey options is set', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowFocusChangedResults = [];
    });

    await createWidget(page, 'dxDataGrid', {
      focusedRowKey: 1,
      focusedRowEnabled: true,
      editing: { mode: 'batch', allowAdding: true, allowUpdating: true },
      ...getGridDataConfig(4),
      onFocusedRowChanged: ({ rowIndex }: any) => {
        (window as any).rowFocusChangedResults.push([rowIndex]);
      },
    });

    await page.waitForTimeout(100);

    const rowFocusChanged = await page.evaluate(() => (window as any).rowFocusChangedResults);
    expect(rowFocusChanged).toEqual([[1]]);
  });

  test('It should be able to change focusedRowKey on "onContentReady"', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).rowFocusChangedResults = [];
    });

    await createWidget(page, 'dxDataGrid', {
      focusedRowKey: 1,
      focusedRowEnabled: true,
      editing: { mode: 'batch', allowAdding: true, allowUpdating: true },
      onContentReady: ({ component }: any) => {
        component.option('focusedRowKey', 3);
      },
      ...getGridDataConfig(4),
      onFocusedRowChanged: ({ rowIndex }: any) => {
        (window as any).rowFocusChangedResults.push([rowIndex]);
      },
    });

    await page.waitForTimeout(100);

    const rowFocusChanged = await page.evaluate(() => (window as any).rowFocusChangedResults);
    expect(rowFocusChanged).toEqual([[1], [3]]);
  });
});
