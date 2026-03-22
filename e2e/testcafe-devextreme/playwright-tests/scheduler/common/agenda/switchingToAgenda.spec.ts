import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Agenda:view switching', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('View switching should work for empty agenda', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    dataSource: [{
      startDate: new Date(2021, 4, 25, 0),
      endDate: new Date(2021, 4, 25, 1),
      text: 'Test Appointment',
    }],
    views: ['day', 'agenda'],
    currentView: 'day',
    currentDate: new Date(2021, 4, 25),
    height: 600,
  // --- test ---
// Scheduler on '#container'
    await scheduler.option('currentDate', new Date(2021, 4, 26));
  await scheduler.option('currentView', 'agenda');

  await testScreenshot(page, 'switch-to-agenda-without-appointments.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});
});
