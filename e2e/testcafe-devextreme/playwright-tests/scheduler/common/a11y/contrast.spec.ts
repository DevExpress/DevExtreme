import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('a11y - contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

// visual: generic.light
// visual: generic.dark
// visual: fluent.light
// visual: fluent.dark
test('Scheduler a11y: Insufficient contrast of day numbers in the MonthView', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [],
    currentView: 'month',
    currentDate: new Date(2020, 10, 25),
  // --- test ---
// Scheduler on '#container'
    await testScreenshot(page, 'month_day_number_contrast.png', { element: page.locator('.dx-scheduler') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
