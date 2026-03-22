import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Search.Visual', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('highlighted search text', async ({ page }) => {
    await createWidget(page, 'dxCardView', {
      dataSource: [
        { id: 1, firstName: 'Darin', lastName: 'Heritege', email: 'dheritege0@jugem.jp', gender: 'Male' },
        { id: 2, firstName: 'Aeriel', lastName: 'Giggs', email: 'agiggs1@hubpages.com', gender: 'Female' },
      ],
      columns: ['id', 'firstName', 'lastName', 'email', 'gender'],
      searchPanel: { visible: true, text: 'da' },
      height: 600,
    });

    await testScreenshot(page, 'card-view_search_text-highlighting.png', {
      element: page.locator('#container'),
    });
  });
});
