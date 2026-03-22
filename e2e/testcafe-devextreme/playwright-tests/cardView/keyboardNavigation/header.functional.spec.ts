import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('KeyboardNavigation.Header', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Should navigate between items by arrows', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, A: 'A_0', B: 'B_0', C: 'C_0' }],
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    await headerItems.nth(0).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');

    await expect(headerItems.nth(2)).toBeFocused();
  });

  test('Should focus item by click', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ id: 0, A: 'A_0', B: 'B_0', C: 'C_0' }],
      columns: ['A', 'B', 'C'],
      keyExpr: 'id',
      height: 700,
    });

    const headerItems = page.locator('.dx-cardview-headers .dx-cardview-header-item');
    await headerItems.nth(1).click();

    await expect(headerItems.nth(1)).toBeFocused();
  });
});
