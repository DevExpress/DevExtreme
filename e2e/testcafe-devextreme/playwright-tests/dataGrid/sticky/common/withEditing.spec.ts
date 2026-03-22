import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

// TODO: import defaultConfig from sticky helpers or inline the data

test.describe('Sticky columns - Editing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  test('The row edit mode: Edit row when there are sticky columns', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      ...defaultConfig,
      editing: {
        mode: 'row',
        allowUpdating: true,
      },
      scrolling: {
        showScrollbar: 'never',
      },
    });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await dataGrid.apiEditRow(1);
    await (page.locator('.dx-data-row').nth(1).locator('td').nth(1)).click();

    await testScreenshot(page, 'edit_row_with_sticky_columns_1.png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });

    await testScreenshot(page, 'edit_row_with_sticky_columns_2.png', { element: page.locator('#container') });
  });
});
