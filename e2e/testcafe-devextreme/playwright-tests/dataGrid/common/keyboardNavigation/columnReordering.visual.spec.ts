import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('DataGrid Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  fixture
    .disablePageReloads`Keyboard Navigation - Column Reordering`
    .page(url(__dirname, '../../../container.html'));

  // Regular columns
  [true, false].forEach((rtlEnabled) => {

  test(`reorder column when ${rtlEnabled ? 'left' : 'right'} arrow is pressed when rtlEnabled = ${rtlEnabled}`, async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
          rtlEnabled,
          allowColumnReordering: true,
          dataSource: [{
            field1: 'test1',
            field2: 'test2',
            field3: 'test3',
            field4: 'test4',
          }],
        });

          const firstHeaderCell = page.locator('.dx-header-row').nth(0).locator('td').nth(0);
      const shortcut = rtlEnabled ? 'ctrl+left' : 'ctrl+right';

      await (firstHeaderCell.element).click();
      await t.pressKey(shortcut);

      await testScreenshot(page, `reorder_column_to_${rtlEnabled ? 'left' : 'right'}_when_rtlEnabled_=_${rtlEnabled}.png`, { element: page.locator('#container') });
    });
});
