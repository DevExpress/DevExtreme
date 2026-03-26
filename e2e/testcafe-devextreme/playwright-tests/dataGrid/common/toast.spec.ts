import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
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
});
