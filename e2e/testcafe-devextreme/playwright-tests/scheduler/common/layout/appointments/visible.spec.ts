import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('Layout:Appointments:visible', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [1, 0].forEach((maxAppointmentsPerCell) => {
    [true, false, undefined].forEach((visible) => {
      test(`Appointments should be filtered by visible property(visible='${visible}', maxAppointmentsPerCell='${maxAppointmentsPerCell}'`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          dataSource: [
            { text: 'Recurrence app', roomId: [1], startDate: new Date(2021, 3, 13, 1, 30), endDate: new Date(2021, 3, 13, 2, 30), recurrenceRule: 'FREQ=DAILY', visible },
            { text: 'Simple app', roomId: [1], startDate: new Date(2021, 3, 12, 3), endDate: new Date(2021, 3, 12, 4), visible },
          ],
          views: [{ type: 'week', name: 'Numeric Mode', maxAppointmentsPerCell }],
          currentView: 'Numeric Mode', currentDate: new Date(2021, 3, 15), height: 600,
        });
        await testScreenshot(page, `filtering-visible=${visible}-maxAppointmentsPerCell=${maxAppointmentsPerCell}.png`, { element: page.locator('.dx-scheduler-work-space') });
      });
    });
  });
});
