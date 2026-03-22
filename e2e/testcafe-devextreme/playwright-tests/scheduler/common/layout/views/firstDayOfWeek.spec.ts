import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Scheduler: View with first day of week', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('WorkWeek should generate correct start view date', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    views: ['workWeek'],
    currentView: 'workWeek',
    firstDayOfWeek: 1,
    currentDate: new Date(2021, 11, 12),
    height: 600,
  // --- test ---
// Scheduler on '#container'
    await testScreenshot(page, 'work-week-first-day-of-week.png', {
    element: page.locator('.dx-scheduler'),
  });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
