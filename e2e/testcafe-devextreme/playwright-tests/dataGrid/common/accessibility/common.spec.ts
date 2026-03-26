import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const getData = (rowCount: number, colCount: number): Record<string, string>[] => {
  const items: Record<string, string>[] = [];
  for (let i = 0; i < rowCount; i++) {
    const item: Record<string, string> = {};
    for (let j = 0; j < colCount; j++) item[`field_${j}`] = `val_${i}_${j}`;
    items.push(item);
  }
  return items;
};

test.describe('Common tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Grid without data', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await testScreenshot(page, 'no-data.png', { element: page.locator('#container') });
  });

  test('Sorting and group panel', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      groupPanel: {
        visible: true,
      },
      columns: [
        'field_0',
        'field_1',
        'field_2',
        {
          dataField: 'field_3',
          sortOrder: 'asc',
          sortIndex: 0,
        },
        {
          dataField: 'field_4',
          sortOrder: 'desc',
          sortIndex: 1,
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await testScreenshot(page, 'sorting-and-group-panel.png', { element: page.locator('#container') });
  });

  test('Search panel', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      searchPanel: {
        visible: true,
      },
      columns: [
        'field_0',
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await testScreenshot(page, 'search-panel.png', { element: page.locator('#container') });
  });

  test('Fixed columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 7),
      keyExpr: 'field_0',
      columnFixing: {
        legacyMode: true,
      } as any,
      columns: [
        {
          dataField: 'field_0',
          fixed: true,
        },
        {
          dataField: 'field_1',
          fixed: true,
        },
        'field_2',
        'field_3',
        'field_4',
        {
          dataField: 'field_5',
          fixed: true,
          fixedPosition: 'right',
        },
        {
          dataField: 'field_6',
          fixed: true,
          fixedPosition: 'right',
        },
      ],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await testScreenshot(page, 'fixed-columns.png', { element: page.locator('#container') });
  });

  test('Error row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: [
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
      onRowValidating(e: any) {
        e.isValid = false;
        e.errorText = 'Test';
      },
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await dataGrid.apiEditRow(0);
    expect(await dataGrid.getDataRow(0).element.evaluate((el) => el.classList.contains('dx-edit-row'))).toBeTruthy();

    await dataGrid.apiCellValue(0, 0, 'test');
    await dataGrid.apiSaveEditData();

    await expect(dataGrid.getErrorRow()).toBeVisible();

    await testScreenshot(page, 'error-row.png', { element: page.locator('#container') });
  });

  test('Batch editing mode - edit cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: [
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await dataGrid.apiEditCell(0, 0);

    await expect(dataGrid.getDataRow(0).getDataCell(0)).toHaveClass(/dx-editor-cell/);

    await testScreenshot(page, 'batch-editing-mode-edit_cell.png', { element: page.locator('#container') });
  });

  test('Batch editing mode - modified cell', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: [
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await dataGrid.apiCellValue(0, 0, 'test');

    await expect(dataGrid.getDataRow(0).getDataCell(0)).toHaveClass(/dx-cell-modified/);

    await testScreenshot(page, 'row-editing-mode-modified_cell.png', { element: page.locator('#container') });
  });

  test('Batch editing mode - delete row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: [
        'field_1',
        'field_2',
        'field_3',
        'field_4',
      ],
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    await dataGrid.apiDeleteRow(0);

    await expect(dataGrid.getDataRow(0).element).toHaveClass(/dx-row-removed/);

    await testScreenshot(page, 'row-editing-mode-delete_row.png', { element: page.locator('#container') });
  });

  test('Context menu', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      columnFixing: {
        enabled: true,
        legacyMode: true,
      } as any,
      sorting: {
        mode: 'multiple',
      },
    });

    const dataGrid = new DataGrid(page);
    expect(await dataGrid.isReady()).toBeTruthy();

    const headerRow = dataGrid.getHeaderRow(0);
    await headerRow.click({ button: 'right' });

    const contextMenu = dataGrid.getContextMenu();
    await expect(contextMenu.element).toBeVisible();

    await testScreenshot(page, 'context-menu.png', { element: page.locator('#container') });
  });
});
