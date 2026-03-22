import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Sticky columns - Filter row', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });
  // visual: generic.light
  // visual: material.blue.light
  // visual: fluent.blue.light

  test('Filter row with sticky columns (generic.light theme)', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
        ...defaultConfig,
        filterRow: {
          visible: true,
        },
      });

      expect(await page.locator('.dx-datagrid').first().isVisible()).toBeTruthy();

    await (page.locator('.dx-header-row').click().getFilterRow().getFilterCell(1).element);

    await testScreenshot(page, 'filter_row_with_sticky_columns_1.png', { element: page.locator('#container') });

    await page.evaluate((opts) => ($('#container') as any).dxDataGrid('instance').getScrollable().scrollTo(opts), { x: 10000 });

    await testScreenshot(page, 'filter_row_with_sticky_columns_2.png', { element: page.locator('#container') });
  });
});
