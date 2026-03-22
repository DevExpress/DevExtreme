import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../../tests/container.html')}`;

test.describe('Scheduler: Material theme without all-day panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Week view without all-day panel should be rendered correctly', async ({ page }) => {
    await createWidget(page, 'dxScheduler', { dataSource: [], currentDate: new Date(2020, 6, 15), views: ['week'], currentView: 'week', height: 500 });
    await testScreenshot(page, 'week-without-all-day-panel.png', { element: page.locator('.dx-scheduler-work-space') });
  });
});
