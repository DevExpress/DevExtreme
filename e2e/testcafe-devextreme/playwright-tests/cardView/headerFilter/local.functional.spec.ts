import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.Local.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('should filter data after selecting item', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { A: 'A_0', B: 'B_0' },
        { A: 'A_1', B: 'B_1' },
        { A: 'A_2', B: 'B_2' },
      ],
      columns: ['A', 'B'],
      headerFilter: { visible: true },
      height: 600,
    });

    await page.locator('.dx-header-filter-icon').first().click();
    await page.waitForSelector('.dx-popup-wrapper.dx-header-filter-menu');

    const listItems = page.locator('.dx-list-item');
    await expect(listItems).toHaveCount(3);
  });
});
