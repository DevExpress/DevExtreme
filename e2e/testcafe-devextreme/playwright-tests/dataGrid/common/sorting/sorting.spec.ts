import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Filter expression should be valid when sortingMethod, remoteOperations, and autoNavigateToFocusedRow are specified (T1200546)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', () => {
      const sampleData = Array.from({ length: 20 }, (_, i) => ({ ID: i + 1, Name: `Name ${i + 1}` }));
      const sampleAPI = new (window as any).DevExpress.data.ArrayStore(sampleData);
      const store = new (window as any).DevExpress.data.CustomStore({
        key: 'ID',
        load(o: any) {
          if (o.filter && typeof o.filter[0] === 'function') {
            return Promise.reject();
          }
          return Promise.all([sampleAPI.load(o), sampleAPI.totalCount(o)]).then((res: any) => ({
            data: res[0],
            totalCount: res[1],
          }));
        },
      });
      return {
        dataSource: store,
        remoteOperations: true,
        columns: ['ID', {
          dataField: 'Name',
          sortOrder: 'asc',
          sortingMethod() {
            return 1;
          },
        }],
        paging: { pageSize: 5 },
        scrolling: { mode: 'virtual' },
        height: 200,
        showBorders: true,
        focusedRowEnabled: true,
        focusedRowKey: 18,
        autoNavigateToFocusedRow: true,
      };
    });

    const dataGrid = new DataGrid(page);

    await expect(dataGrid.dataRows).toHaveCount(6);
    await expect(dataGrid.getErrorRow()).not.toBeVisible();
  });

  test('Multiple sorting alphabetical icons should be correct in Fluent Theme (T1243658)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ ID: 1, FirstName: 'John' }],
      keyExpr: 'ID',
      sorting: {
        mode: 'multiple',
      },
      columns: [
        {
          dataField: 'FirstName',
          sortOrder: 'asc',
        },
      ],
    });

    await page.locator('.dx-datagrid-headers').click({ button: 'right', position: { x: 10, y: 10 } });

    await testScreenshot(page, 'datagrid-alphabetical-icons-should-be-correct.png');
  });

  test('Sorting and filtering should be applied correctly when they change at runtime (T1237863)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { ID: 1, FirstName: 'Bob', room: 1 },
        { ID: 2, FirstName: 'Alex', room: 2 },
        { ID: 3, FirstName: 'John', room: 1 },
      ],
      keyExpr: 'ID',
      sorting: {
        mode: 'multiple',
      },
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await page.evaluate(() => {
      const grid = ($('#container') as any).dxDataGrid('instance');
      grid.option('columns[1].sortIndex', 0);
      grid.option('columns[1].sortOrder', 'desc');
      grid.option('filterValue', ['room', '=', '1']);
    });

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();

    await testScreenshot(page, 'T1237863_datagrid-sorting_and_filtering.png', { element: page.locator('#container') });
  });
});
