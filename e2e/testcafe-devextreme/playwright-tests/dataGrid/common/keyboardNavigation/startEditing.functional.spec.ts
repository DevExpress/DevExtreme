import { test, expect } from '@playwright/test';
import { createWidget } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Keyboard Navigation - editOnKeyPress', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('Editing should start by pressing enter after scrolling content with scrolling.mode=virtual', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        dataSource: [...new Array(50)].map((_, i) => ({
          data1: i * 2,
          data2: i * 2 + 1,
        })),
        columns: [
          'data1',
          'data2',
        ],
        editing: {
          allowUpdating: true,
        },
        scrolling: {
          mode: 'virtual',
        },
        height: 300,
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollBy(opts), { y: 10000 });

    await (page.locator('.dx-data-row').nth(49).locator('td').nth(1)).click();
    await page.keyboard.press('enter');

    expect(await page.locator('.dx-data-row').nth(49).locator('td').nth(1).locator('.dx-editor-cell').focused).toBeTruthy();
  });
});
