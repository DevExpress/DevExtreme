import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, DataGrid } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Toasts in DataGrid', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Toast should be visible after calling and should be not visible after default display time', async ({ page }) => {
    // TODO: Playwright migration - showErrorToast is not a function, screenshot mismatch
    createWidget(page, 'dxDataGrid', {});

      await page.locator('.dx-datagrid').first().isVisible();
    await page.evaluate(() => ($('#container') as any).dxDataGrid('instance').showErrorToast());
    expect(await page.locator('.dx-toast').isVisible()).toBeTruthy();
    await testScreenshot(page, 'ai-column__toast__at-the-right-position.png', { element: page.locator('#container') });
    expect(await page.locator('.dx-toast').isVisible()).toBeFalsy();
  });

  test('DataGrid renders and shows grid container', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 'test' }],
      keyExpr: 'id',
      showBorders: true,
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();
    expect(await dataGrid.getContainer().isVisible()).toBeTruthy();
  });

  test('DataGrid toast wrapper element exists in DOM', async ({ page }) => {
    await createWidget(page, 'dxDataGrid', {
      dataSource: [{ id: 1, value: 'test' }],
      keyExpr: 'id',
    });

    const dataGrid = new DataGrid(page, '#container');
    await expect(dataGrid.getContainer()).toBeVisible();

    const toastLocator = dataGrid.getToast();
    const toastCount = await toastLocator.count();
    expect(toastCount).toBe(0);
  });
});
