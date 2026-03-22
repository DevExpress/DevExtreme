import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
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
    await t.maximizeWindow();
      return createWidget(page, 'dxDataGrid', {
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

      expect(await page.locator('.dx-datagrid').first().isVisible());
      await t.ok();

    // drag the row down
    await dataGrid.moveRow(0, 30, 150, true);
    await dataGrid.moveRow(0, 30, await getOffsetToTriggerAutoScroll(0, 1, 'down'));

    // waiting for autoscrolling
    await page.waitForTimeout(2000);

    expect(await page.locator('.dx-data-row').nth(99).locator('td').nth(1).textContent());
    await t.eql('99');
    expect(await isScrollAtEnd('vertical'));
    await t.ok();

    // drag the row up
    await dataGrid.moveRow(0, 30, await getOffsetToTriggerAutoScroll(0, 1));

    // waiting for autoscrolling
    await page.waitForTimeout(2000);

    expect(await page.locator('.dx-data-row').nth(0).locator('td').nth(1).textContent());
    await t.eql('0');
    expect(await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTop()));
    await t.eql(0);

    await testScreenshot(page, 'T1179218-virtual-scrolling-dragging-row.png', { element: page.locator('#container') });
  });
});
