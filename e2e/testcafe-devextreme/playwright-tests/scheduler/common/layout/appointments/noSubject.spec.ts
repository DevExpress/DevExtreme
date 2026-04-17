import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Appointments:noSubject', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const viewsList = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'];
  const timelineViews = ['timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

  viewsList.forEach((currentView) => {
    test(`Appointment without text should display "(No subject)" in ${currentView} view`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{ startDate: new Date(2021, 0, 1, 10, 30), endDate: new Date(2021, 0, 1, 12, 0), text: '' }],
        views: viewsList, currentView, currentDate: new Date(2021, 0, 1),
        startDayHour: 9, endDayHour: 18, height: 600, width: 600,
      });

      if (timelineViews.includes(currentView)) {
        await page.evaluate(() => {
          ($('#container') as any).dxScheduler('instance').scrollTo(new Date(2021, 0, 1, 10, 30));
        });
        await page.waitForTimeout(300);
      }

      await testScreenshot(page, `appointment-no-subject-${currentView}.png`, { element: page.locator('.dx-scheduler-work-space') });
    });
  });
});
