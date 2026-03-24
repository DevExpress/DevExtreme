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
});
