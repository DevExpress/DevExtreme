import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Ai Column.ColumnResizing.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  (['nextColumn', 'widget'] as const).forEach((columnResizingMode) => {
    test(`Column resizing should work when allowColumnResizing is true (columnResizingMode = ${columnResizingMode})`, async ({ page }) => {
      await createWidget(page, 'dxDataGrid', {
        dataSource: [
          { id: 1, name: 'Name 1', value: 10 },
          { id: 2, name: 'Name 2', value: 20 },
          { id: 3, name: 'Name 3', value: 30 },
        ],
        keyExpr: 'id',
        allowColumnResizing: true,
        columnResizingMode,
        columnWidth: 150,
        columns: [
          {
            type: 'ai',
            caption: 'AI Column',
            name: 'myAiColumn',
          },
          { dataField: 'id', caption: 'ID' },
          { dataField: 'name', caption: 'Name' },
          { dataField: 'value', caption: 'Value' },
        ],
      });

      const dataGrid = new DataGrid(page);
      await expect(dataGrid.getContainer()).toBeVisible();

      const initialWidth = await dataGrid.apiColumnOption('myAiColumn', 'width') as number;
      await dataGrid.resizeHeader(0, 50);

      const newWidth = await dataGrid.apiColumnOption('myAiColumn', 'width') as number;
      expect(newWidth).not.toBe(initialWidth);
    });
  });
});
