import { test } from '@playwright/test';
import { testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container.html')}`;

test.describe.skip('Layout:Appointments:disable', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Appointment popup should be readOnly if appointment is disabled', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.fx.off = true;
      ($('#container') as any).dxScheduler({
        dataSource: [
          { disabled: true, text: 'A', startDate: new Date(2021, 4, 27, 0, 30), endDate: new Date(2021, 4, 27, 1), recurrenceRule: 'FREQ=DAILY;UNTIL=20210615T205959Z' },
          { disabled: false, text: 'B', startDate: new Date(2021, 4, 27, 1), endDate: new Date(2021, 4, 27, 1, 30), recurrenceRule: 'FREQ=DAILY;UNTIL=20210615T205959Z' },
          { disabled: () => true, text: 'C', startDate: new Date(2021, 4, 27, 1, 30), endDate: new Date(2021, 4, 27, 2), recurrenceRule: 'FREQ=WEEKLY;UNTIL=20210615T205959Z' },
          { disabled: () => false, text: 'D', startDate: new Date(2021, 4, 27, 2), endDate: new Date(2021, 4, 27, 2, 30), recurrenceRule: 'FREQ=WEEKLY;UNTIL=20210615T205959Z' },
        ],
        recurrenceEditMode: 'series', views: ['week'], currentView: 'week', currentDate: new Date(2021, 4, 27),
      });
    });

    await testScreenshot(page, 'disabled-appointments-in-grid.png');

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'A' }).first().click();
    await page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'A' }).click();
    await testScreenshot(page, 'disabled-appointment.png', { element: page.locator('.dx-popup-content') });
    await page.locator('.dx-popup-bottom .dx-button').filter({ hasText: /cancel/i }).click();

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'B' }).first().click();
    await page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'B' }).click();
    await testScreenshot(page, 'enabled-appointment.png', { element: page.locator('.dx-popup-content') });
    await page.locator('.dx-popup-bottom .dx-button').filter({ hasText: /cancel/i }).click();

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'C' }).first().click();
    await page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'C' }).click();
    await testScreenshot(page, 'disabled-by-function-appointment.png', { element: page.locator('.dx-popup-content') });
    await page.locator('.dx-popup-bottom .dx-button').filter({ hasText: /cancel/i }).click();

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'D' }).first().click();
    await page.locator('.dx-tooltip-appointment-item').filter({ hasText: 'D' }).click();
    await testScreenshot(page, 'enabled-by-function-appointment.png', { element: page.locator('.dx-popup-content') });
    await page.locator('.dx-popup-bottom .dx-button').filter({ hasText: /cancel/i }).click();
  });
});
