import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('HeaderFilter.API.Functional', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('headerFilter.visible API', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [{ A: 'A_0' }, { A: 'A_1' }],
      columns: ['A'],
      headerFilter: { visible: false },
      height: 600,
    });

    const filterIcon = page.locator('.dx-header-filter-icon');
    await expect(filterIcon).not.toBeVisible();

    await page.evaluate(() => {
      ($('#container') as any).dxCardView('instance').option('headerFilter.visible', true);
    });

    await expect(filterIcon.first()).toBeVisible();
  });
});
