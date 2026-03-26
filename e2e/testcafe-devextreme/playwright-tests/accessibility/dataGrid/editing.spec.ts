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

test.describe('Accessibility - DataGrid editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('row editing mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('batch editing mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'batch',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('cell editing mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'cell',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('form editing mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'form',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('popup editing mode', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'popup',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('row editing mode with useIcons', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(10, 5),
      keyExpr: 'field_0',
      editing: {
        mode: 'row',
        allowUpdating: true,
        allowDeleting: true,
        allowAdding: true,
        useIcons: true,
      },
      columns: ['field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });
});
