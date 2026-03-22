import { test } from '@playwright/test';
import { testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe('DataSource', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Appointment key should be deleted when removing an appointment from series (T1024213)', async ({ page }) => {
    await page.evaluate(() => {
      const devExpress = (window as any).DevExpress;
      (window as any).DevExpress.fx.off = true;
      ($('#container') as any).dxScheduler({
        dataSource: new devExpress.data.DataSource({
          store: { type: 'array', key: 'appointmentId', data: [{
            startDate: new Date(2021, 6, 12, 10), endDate: new Date(2021, 6, 12, 11),
            text: 'Test Appointment', recurrenceRule: 'FREQ=DAILY;COUNT=3', appointmentId: 0,
          }] },
        }),
        recurrenceEditMode: 'occurrence', views: ['week'], currentView: 'week',
        startDayHour: 9, currentDate: new Date(2021, 6, 12, 10), height: 600,
      });
    });
    await page.locator('.dx-scheduler-appointment').nth(1).dblclick();
    await page.locator('.dx-popup-bottom .dx-button').filter({ hasText: /done|save/i }).click();
    await testScreenshot(page, 'exclude-appointment-from-series-via-form-editing.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
