import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.A11y.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('should open popup by enter if filter icon in the focused state', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }],
      columns: [{ dataField: 'A', caption: 'LONG_COLUMN_A_CAPTION' }],
      headerFilter: { visible: true },
      height: 600,
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click();
    await page.keyboard.press('Alt+ArrowDown');

    const list = page.locator('.dx-list');
    await expect(list).toBeVisible();
  });

  test('should return focus on the same icon after the popup closing', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0' }, { A: 'A_1' }, { A: 'A_2' }],
      columns: [{ dataField: 'A', caption: 'LONG_COLUMN_A_CAPTION' }],
      headerFilter: { visible: true },
      height: 600,
    });

    const headerItem = page.locator('.dx-cardview-headers .dx-cardview-header-item').first();
    await headerItem.click();
    await page.keyboard.press('Alt+ArrowDown');

    const list = page.locator('.dx-list');
    await expect(list).toBeVisible();

    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    await expect(headerItem).toBeFocused();
  });
});
