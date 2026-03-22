import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Scheduler: different intervalCount option values', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Interval count: 1, February of 2021', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{
        type: 'month',
        intervalCount: 1,
      }],
      currentView: 'month',
      firstDayOfWeek: 1,
      currentDate: new Date(2021, 1, 1),
    });

    await testScreenshot(page, 'month-february-2021.png', { element: page.locator('.dx-scheduler-work-space') });
  });

  test('Interval count: 12', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{
        type: 'month',
        intervalCount: 12,
      }],
      height: 600,
      currentView: 'month',
      currentDate: new Date(2023, 6, 1),
    });

    await page.evaluate(() => {
      ($('#container') as any).dxScheduler('instance').scrollTo(new Date(2024, 6, 1));
    });

    await testScreenshot(page, 'month-interval-count-12.png', { element: page.locator('.dx-scheduler-work-space') });
  });
});
