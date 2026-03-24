import { test, expect } from '@playwright/test';
import { createWidget, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Row dragging.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('The placeholder should appear when a cross-component dragging rows after scrolling the window', async ({ page }) => {
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '500px';
      document.body.insertBefore(spacer, document.body.firstChild);
    });

    await createWidget(page, 'dxDataGrid', {
      dataSource: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' },
      ],
      keyExpr: 'id',
      rowDragging: {
        allowReordering: true,
        showDragIcons: true,
      },
    });

    const dataGrid = new DataGrid(page);
    await expect(dataGrid.getContainer()).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 300));

    await dataGrid.moveRow(0, 0, 0, true);
    await dataGrid.moveRow(0, 0, 60);

    const draggable = page.locator('.dx-sortable-dragging');
    await expect(draggable).toBeVisible();

    await dataGrid.dropRow();
  });
});
