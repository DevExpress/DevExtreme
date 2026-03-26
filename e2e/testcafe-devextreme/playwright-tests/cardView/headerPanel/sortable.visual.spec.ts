import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('CardView - HeaderPanel Sortable Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('sortable indicator during dragging', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, name: 'Item 1', value: 10 },
        { id: 2, name: 'Item 2', value: 20 },
        { id: 3, name: 'Item 3', value: 30 },
      ],
      keyExpr: 'id',
      headerPanel: {
        visible: true,
        allowColumnReordering: true,
      },
      columns: [
        { dataField: 'name', caption: 'Name' },
        { dataField: 'value', caption: 'Value' },
      ],
    });

    const headerPanel = page.locator('.dx-cardview-headers');
    await expect(headerPanel).toBeVisible();

    const firstItem = headerPanel.locator('.dx-cardview-header-item').first();
    const box = await firstItem.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down();
      await page.mouse.move(box.x + box.width / 2 + 100, box.y + box.height / 2, { steps: 5 });

      await testScreenshot(page, 'cardview-sortable-indicator-during-drag.png');

      await page.mouse.up();
    }
  });
});
