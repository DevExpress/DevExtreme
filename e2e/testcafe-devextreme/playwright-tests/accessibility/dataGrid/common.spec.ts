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
});
