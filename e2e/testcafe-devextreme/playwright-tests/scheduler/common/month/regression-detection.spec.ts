import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Regression detection: verify Playwright catches visual changes', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Month view with intervalCount=1 should match baseline', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{
        type: 'month',
        intervalCount: 1,
      }],
      currentView: 'month',
      firstDayOfWeek: 1,
      currentDate: new Date(2021, 1, 1),
    });

    await testScreenshot(page, 'regression-month-february-2021.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });

  test('Month view with appointments should match baseline', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test Appointment',
        startDate: new Date(2020, 0, 6),
        endDate: new Date(2020, 0, 10),
      }],
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2020, 0, 1),
    });

    await testScreenshot(page, 'regression-month-with-appointment.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
