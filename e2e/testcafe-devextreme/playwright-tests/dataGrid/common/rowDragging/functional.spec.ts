import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const sharedDataSource = [
  { id: 1, name: 'Name 1', age: 19 },
  { id: 2, name: 'Name 2', age: 11 },
  { id: 3, name: 'Name 3', age: 15 },
  { id: 4, name: 'Name 4', age: 16 },
  { id: 5, name: 'Name 5', age: 25 },
  { id: 6, name: 'Name 6', age: 18 },
  { id: 7, name: 'Name 7', age: 21 },
  { id: 8, name: 'Name 8', age: 14 },
];

test.describe('Row dragging.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The placeholder should appear when a cross-component dragging rows after scrolling the window', async ({ page }) => {
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '500px';
      document.body.insertBefore(spacer, document.body.firstChild);
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ],
      keyExpr: 'id',
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 300));

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 60);

    const draggable = page.locator('.dx-sortable-dragging');
    await expect(draggable).toBeVisible();

    await dataGrid.dropRow();
  });

  test('The cross-component drag and drop rows should work when there are fixed columns', async ({ page }) => {
    await page.evaluate(() => {
      $('body').css('display', 'flex');
      $('#container, #otherContainer').css({
        display: 'inline-block',
        width: '50%',
      });
    });

    await createWidget(page, 'dxDataGrid', {
      width: 400,
      dataSource: sharedDataSource,
      columnFixing: {
        // @ts-expect-error private option
        legacyMode: true,
      },
      columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
      rowDragging: { group: 'shared' },
    });

    await page.evaluate(() => {
      ($('#otherContainer') as any).dxDataGrid({
        width: 400,
        dataSource: [
          { id: 1, name: 'Name 1', age: 19 },
          { id: 2, name: 'Name 2', age: 11 },
          { id: 3, name: 'Name 3', age: 15 },
        ],
        columnFixing: { legacyMode: true },
        columns: [{ dataField: 'id', fixed: true }, 'name', 'age'],
        rowDragging: { group: 'shared' },
      });
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 500, 0, true);
    await dataGrid.moveRow(0, 550, 0);

    const placeholder = page.locator('.dx-sortable-placeholder');
    await expect(placeholder).toBeVisible();

    await dataGrid.dropRow();

    await page.evaluate(() => {
      $('body').css('display', '');
    });
  });

  test('Virtual rendering during auto scrolling should not cause errors in onDragChange', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      keyExpr: 'id',
      scrolling: { mode: 'virtual' },
      dataSource: [...new Array(10)].map((_, i) => ({ id: i + 1 })),
      columns: ['id'],
      rowDragging: {
        allowReordering: true,
        scrollSpeed: 300,
        onDragChange(e: any) {
          const visibleRows = e.component.getVisibleRows();
          const row = visibleRows[e.toIndex];
          if (!row) {
            throw new Error('row is null');
          }
        },
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 100);

    await page.waitForTimeout(500);

    await expect(dataGrid.getDataRow(0).element).toBeVisible();
    await dataGrid.dropRow();
  });

  test('Headers should not be hidden during auto scrolling when virtual scrolling is specified (T1078513)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      keyExpr: 'id',
      scrolling: { mode: 'virtual' },
      paging: { pageSize: 2 },
      dataSource: [...new Array(15)].map((_, i) => ({ id: i + 1 })),
      columns: ['id'],
      columnAutoWidth: true,
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
        onDragEnd(e: any): void {
          e.cancel = new Promise<void>((resolve) => {
            setTimeout(() => { resolve(); }, 500);
          });
        },
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 90);

    await page.waitForTimeout(300);

    const headerRow = dataGrid.getHeaders().getHeaderRow(0);
    await expect(headerRow).toBeVisible();

    await dataGrid.dropRow();
  });

  test('Footer should not be hidden during auto scrolling when virtual scrolling is specified (T1078513)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 250,
      keyExpr: 'id',
      scrolling: { mode: 'virtual' },
      summary: {
        totalItems: [{
          column: 'id',
          summaryType: 'count',
        }],
      },
      paging: { pageSize: 2 },
      dataSource: [...new Array(15)].map((_, i) => ({ id: i + 1 })),
      columns: ['id'],
      columnAutoWidth: true,
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
        onDragEnd(e: any): void {
          e.cancel = new Promise<void>((resolve) => {
            setTimeout(() => { resolve(); }, 500);
          });
        },
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 90);

    await page.waitForTimeout(300);

    const footerRow = dataGrid.getFooterRow();
    await expect(footerRow).toBeVisible();

    await dataGrid.dropRow();
  });

  test('The draggable element should be displayed correctly after horizontal scrolling when columnRenderingMode is virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      width: 300,
      height: 300,
      keyExpr: 'id',
      scrolling: { columnRenderingMode: 'virtual' },
      dataSource: [...new Array(5)].map((_, i) => ({ id: i + 1 })),
      columns: [...new Array(10)].map((_, i) => ({ dataField: `col${i}`, width: 100 })),
      rowDragging: { allowReordering: true, showDragIcons: true },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.scrollTo({ x: 300 });
    await page.waitForTimeout(200);

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 60);

    const draggable = page.locator('.dx-sortable-dragging');
    await expect(draggable).toBeVisible();

    await dataGrid.dropRow();
  });

  test('The placeholder should have correct position after dragging the row to the end when there is free space', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 400,
      keyExpr: 'id',
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ],
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
        dropFeedbackMode: 'push',
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 200);

    await page.waitForTimeout(200);

    await dataGrid.dropRow();

    await expect(dataGrid.getDataRow(0).element).toBeVisible();
  });

  test('toIndex should not be corrected when source item gets removed from DOM', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 200,
      keyExpr: 'id',
      scrolling: { mode: 'virtual' },
      dataSource: [...new Array(20)].map((_, i) => ({ id: i + 1, name: `Item ${i + 1}` })),
      columns: ['id', 'name'],
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 100);

    await page.waitForTimeout(300);

    await dataGrid.dropRow();

    await expect(dataGrid.getDataRow(0).element).toBeVisible();
  });
});
