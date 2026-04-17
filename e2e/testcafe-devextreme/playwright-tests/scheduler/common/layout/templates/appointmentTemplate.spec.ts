import { test } from '@playwright/test';
import { testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Templates:appointmentTemplate', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ['day', 'workWeek', 'month', 'timelineDay', 'timelineWorkWeek', 'agenda'].forEach((currentView) => {
    test(`appointmentTemplate layout should be rendered right in '${currentView}'`, async ({ page }) => {
      await page.evaluate((view: string) => {
        (window as any).DevExpress.fx.off = true;
        ($('#container') as any).dxScheduler({
          dataSource: [
            { startDate: new Date(2017, 4, 21, 0, 30), endDate: new Date(2017, 4, 21, 2, 30) },
            { startDate: new Date(2017, 4, 22, 0, 30), endDate: new Date(2017, 4, 22, 2, 30) },
            { startDate: new Date(2017, 4, 23, 0, 30), endDate: new Date(2017, 4, 23, 2, 30) },
            { startDate: new Date(2017, 4, 24, 0, 30), endDate: new Date(2017, 4, 24, 2, 30) },
            { startDate: new Date(2017, 4, 25, 0, 30), endDate: new Date(2017, 4, 25, 2, 30) },
            { startDate: new Date(2017, 4, 26, 0, 30), endDate: new Date(2017, 4, 26, 2, 30) },
            { startDate: new Date(2017, 4, 27, 0, 30), endDate: new Date(2017, 4, 27, 2, 30) },
          ],
          views: [view], currentView: view, currentDate: new Date(2017, 4, 25),
          appointmentTemplate(appointment: any) {
            const result = $('<div style="display: flex; flex-wrap: wrap;" />');
            const startDateBox = ($('<div />') as any).dxDateBox({ type: 'datetime', value: appointment.appointmentData.startDate });
            const endDateBox = ($('<div />') as any).dxDateBox({ type: 'datetime', value: appointment.appointmentData.endDate });
            result.append(startDateBox, endDateBox);
            return result;
          },
          height: 600,
        });
      }, currentView);
      await testScreenshot(page, `appointment-template-currentView=${currentView}.png`, { element: page.locator('.dx-scheduler-work-space') });
    });
  });
});
