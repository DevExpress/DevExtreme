import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
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

test.describe('Accessibility bugs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('T1187314 - DataGrid displays an incorrect row count in "aria-label" if there is no data after filtering', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      keyExpr: 'id',
      dataSource: [{
        id: 0,
        data: 'A',
      }],
      filterRow: { visible: true },
      scrolling: { mode: 'infinite' },
    });

      await dataGrid.apiFilter(['id', '=', '1']);
    expect(await dataGrid.getContainer().getAttribute('aria-label'));
    await t.eql('Data grid with 0 rows and 2 columns');
  });
});
