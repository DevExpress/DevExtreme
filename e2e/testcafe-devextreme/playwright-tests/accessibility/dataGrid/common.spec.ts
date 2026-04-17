import { test } from '@playwright/test';
import { createWidget, a11yCheck } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

function getData(rowCount: number, fieldCount: number): Record<string, string>[] {
  return Array.from({ length: rowCount }, (_, rowIdx) => {
    const row: Record<string, string> = {};
    for (let colIdx = 0; colIdx < fieldCount; colIdx += 1) {
      row[`field_${colIdx}`] = `val_${rowIdx}_${colIdx}`;
    }
    return row;
  });
}

test.describe('Accessibility - DataGrid common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('empty grid', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', { dataSource: [] });
    await a11yCheck(page, {}, '#container');
  });

  test('grid with data', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grid with paging', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(100, 5),
      keyExpr: 'field_0',
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
      paging: { pageSize: 5 },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10],
        showPageSizeSelector: true,
        showInfo: true,
        showNavigationButtons: true,
        displayMode: 'full',
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grid with selection', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      selection: { mode: 'multiple', showCheckBoxesMode: 'always' },
      selectedRowKeys: ['val_1_0', 'val_2_0'],
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grid with search panel', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      searchPanel: { visible: true },
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grid without data with columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [],
      columns: ['test'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('sorting and group panel', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      groupPanel: { visible: true },
      columns: [
        'field_0',
        'field_1',
        'field_2',
        { dataField: 'field_3', sortOrder: 'asc', sortIndex: 0 },
        { dataField: 'field_4', sortOrder: 'desc', sortIndex: 1 },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('paging with compact displayMode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(100, 5),
      keyExpr: 'field_0',
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
      paging: { pageSize: 5 },
      pager: {
        visible: true,
        allowedPageSizes: [5, 10, 'all'],
        showPageSizeSelector: true,
        showInfo: true,
        showNavigationButtons: true,
        displayMode: 'compact',
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('grouping and summary', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(60, 5),
      keyExpr: 'field_0',
      columns: [
        'field_0',
        { dataField: 'field_1', groupIndex: 0 },
        { dataField: 'field_2', groupIndex: 1 },
        'field_3',
        'field_4',
      ],
      paging: { pageSize: 10 },
      groupPanel: { visible: true },
      summary: {
        groupItems: [{
          column: 'field_3',
          summaryType: 'count',
          showInGroupFooter: true,
        }, {
          column: 'field_4',
          summaryType: 'count',
          showInGroupFooter: false,
          alignByColumn: true,
        }],
        totalItems: [{ column: 'field_0', summaryType: 'count' }],
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('search panel with highlight', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      searchPanel: { visible: true, text: 'val' },
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('focused row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      focusedRowEnabled: true,
      focusedRowKey: 'val_1_0',
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('row drag and drop', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      rowDragging: { allowReordering: true, showDragIcons: true },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('filter row', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5).map((item, index) => ({ ...item, index })),
      keyExpr: 'field_0',
      filterRow: { visible: true },
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('header filter', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      headerFilter: { visible: true },
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test.skip('filter panel', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      filterPanel: { visible: true },
      columns: [
        'field_0',
        { dataField: 'field_1', filterValue: 'val' },
        'field_2',
        'field_3',
        'field_4',
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('column chooser dragAndDrop mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 7),
      keyExpr: 'field_0',
      columnChooser: { enabled: true, mode: 'dragAndDrop' },
      columns: [
        { dataField: 'field_0', visible: false },
        { dataField: 'field_1', visible: false },
        'field_2', 'field_3', 'field_4', 'field_5', 'field_6',
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('column chooser select mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 7),
      keyExpr: 'field_0',
      columnChooser: { enabled: true, mode: 'select' },
      columns: [
        { dataField: 'field_0', visible: false },
        { dataField: 'field_1', visible: false },
        'field_2', 'field_3', 'field_4', 'field_5', 'field_6',
      ],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('adaptability', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 10),
      keyExpr: 'field_0',
      columnWidth: 100,
      width: 800,
      columnHidingEnabled: true,
    });
    await a11yCheck(page, {}, '#container');
  });

  test('export button', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      export: {
        enabled: true,
        formats: ['xlsx', 'pdf'],
        allowExportSelectedData: true,
      },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('row editing with useIcons false', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: false,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('fixed columns legacy mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 7),
      keyExpr: 'field_0',
      columnFixing: { legacyMode: true } as any,
      columns: [
        { dataField: 'field_0', fixed: true },
        { dataField: 'field_1', fixed: true },
        'field_2', 'field_3', 'field_4',
        { dataField: 'field_5', fixed: true, fixedPosition: 'right' },
        { dataField: 'field_6', fixed: true, fixedPosition: 'right' },
      ],
    });
    await a11yCheck(page, {}, '#container');
  });
});
