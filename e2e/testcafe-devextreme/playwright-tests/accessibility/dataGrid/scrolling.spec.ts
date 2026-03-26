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

test.describe('Accessibility - DataGrid scrolling', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('virtual scrolling accessibility check', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(100, 5),
      keyExpr: 'field_0',
      height: 400,
      scrolling: { mode: 'virtual' },
      columns: ['field_0', 'field_1', 'field_2', 'field_3', 'field_4'],
    });
    await a11yCheck(page, {}, '#container');
  });

  test('infinite scrolling', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(1000, 2),
      height: 400,
      showBorders: true,
      scrolling: { mode: 'infinite' },
    });
    await a11yCheck(page, {}, '#container');
  });

  test('horizontal virtual scrolling', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: getData(20, 100),
      columnWidth: 100,
      height: 400,
      width: 900,
      showBorders: true,
      scrolling: { columnRenderingMode: 'virtual' },
    });
    await a11yCheck(page, {}, '#container');
  });
});
