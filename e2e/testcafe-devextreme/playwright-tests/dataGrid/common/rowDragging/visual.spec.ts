import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Row dragging.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  // T1179218
  test('Rows should appear correctly during dragging when virtual scrolling is enabled and rowDragging.dropFeedbackMode = "push"', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      height: 440,
      keyExpr: 'id',
      scrolling: {
        mode: 'virtual',
      },
      dataSource: [...new Array(100)].fill(null).map((_, index) => ({ id: index })),
      columns: ['id'],
      rowDragging: {
        allowReordering: true,
        dropFeedbackMode: 'push',
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await dataGrid.moveRow(0, 30, 150, true);
    await dataGrid.moveRow(0, 30, 300);

    await page.waitForTimeout(2000);

    const draggable = page.locator('.dx-sortable-dragging');
    await expect(draggable).toBeVisible();

    await testScreenshot(page, 'T1179218-virtual-scrolling-dragging-row.png', { element: page.locator('#container') });

    await dataGrid.dropRow();
  });
});
