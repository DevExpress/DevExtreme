import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('AppointmentForm screenshot tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'].forEach((currentView) => {
    [true, false].forEach((rtlEnabled) => {
      test(`Recurrent appointment in ${currentView} view and ${rtlEnabled ? 'rtl' : 'non-rtl'} mode`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: [{ text: 'Long Long Long Long Long Long Long Long Long Description', startDate: new Date(2021, 0, 1, 1, 30), endDate: new Date(2021, 0, 1, 3, 0), recurrenceRule: 'FREQ=DAILY;COUNT=30' }],
          currentDate: new Date(2021, 0, 4), height: 600, currentView, rtlEnabled,
        });
        await testScreenshot(page, `recurrent-appointment-in-${currentView}_view-and-${rtlEnabled ? 'rtl' : 'non-rtl'}_mode.png`, { element: page.locator('.dx-scheduler') });
      });
    });
  });
});
