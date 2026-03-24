import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Data should be filtered if True is selected via the filter method when case sensitivity is enabled', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: {
        store: [
          { ID: 1, text: 'true' },
          { ID: 2, text: 'True' },
        ],
        langParams: {
          locale: 'en-US',
          collatorOptions: {
            sensitivity: 'case',
          },
        },
      },
      keyExpr: 'ID',
      showBorders: true,
    });

    const dataGrid = new DataGrid(page);

    await dataGrid.apiFilter(['text', '=', 'true']);

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
    await testScreenshot(page, 'filter-method-with-case-sensitive-1.png', { element: page.locator('#container') });

    await dataGrid.apiFilter(['text', '=', 'True']);

    await expect(page.locator('.dx-datagrid').first()).toBeVisible();
    await testScreenshot(page, 'filter-method-with-case-sensitive-2.png', { element: page.locator('#container') });
  });
});
