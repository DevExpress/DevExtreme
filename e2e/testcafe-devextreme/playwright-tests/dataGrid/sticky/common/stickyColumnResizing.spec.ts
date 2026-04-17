import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
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

test.describe.skip('Resize columns - nextColumn mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 800 });
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [false, true].forEach((rtlEnabled) => {
    test(`Resize first fixed column width with left position (rtlEnabled = ${rtlEnabled})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: getData(5, 25),
        rtlEnabled,
        columnAutoWidth: true,
        allowColumnResizing: true,
        columnWidth: 200,
        columnResizingMode: 'nextColumn',
        customizeColumns: (columns) => {
          columns[5].fixed = true;
          columns[5].fixedPosition = 'left';
          columns[6].fixed = true;
          columns[6].fixedPosition = 'left';
        },
      });

      const dataGrid = new DataGrid(page);

      await expect(dataGrid.getContainer()).toBeVisible();

      const initialWidth = await dataGrid.apiColumnOption(5, 'width') as number;
      await dataGrid.resizeHeader(5, 50);

      const newWidth = await dataGrid.apiColumnOption(5, 'width') as number;
      expect(newWidth).not.toBe(initialWidth);
    });
  });
});
