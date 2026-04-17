import { test, expect } from '@playwright/test';
import { setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const data = [
  {
    text: 'Brochure Design Review',
    startDate: new Date(2021, 3, 27, 1, 30),
    endDate: new Date(2021, 3, 27, 2, 30),
  },
];

test.describe.skip('onAppointmentDeleting event', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [{
    cancel: false,
    expectedCount: 0,
  }, {
    cancel: true,
    expectedCount: 1,
  }].forEach(({ cancel, expectedCount }) => {
    test(`UI behaviour should be valid in case argument pass boolean value, e.cancel=${cancel}`, async ({ page }) => {
      await page.evaluate(({ appointmentData, cancelValue }) => {
        const $scheduler = ($('#container') as any);
        const devExpress = (window as any).DevExpress;

        $scheduler.dxScheduler({
          dataSource: appointmentData,
          views: ['day'],
          currentView: 'day',
          currentDate: new Date(2021, 3, 27),
          startDayHour: 1,
          endDayHour: 7,
          height: 600,
          cellDuration: 30,
          onAppointmentDeleting(e: any) {
            e.cancel = cancelValue;
          },
        });
        devExpress.fx.off = true;
      }, { appointmentData: data, cancelValue: cancel });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      await appointment.click();

      await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();

      await page.locator('.dx-scheduler-appointment-tooltip-wrapper .dx-tooltip-appointment-item-delete-button').click();

      await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(expectedCount);
    });

    test(`UI behaviour should be valid in case argument pass Promise resolved, e.cancel=${cancel}`, async ({ page }) => {
      await page.evaluate(({ appointmentData, cancelValue }) => {
        const $scheduler = ($('#container') as any);
        const devExpress = (window as any).DevExpress;

        $scheduler.dxScheduler({
          dataSource: appointmentData,
          views: ['day'],
          currentView: 'day',
          currentDate: new Date(2021, 3, 27),
          startDayHour: 1,
          endDayHour: 7,
          height: 600,
          cellDuration: 30,
          onAppointmentDeleting(e: any) {
            e.cancel = new Promise((resolve) => {
              resolve(cancelValue);
            });
          },
        });
        devExpress.fx.off = true;
      }, { appointmentData: data, cancelValue: cancel });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Brochure Design Review' });
      await appointment.click();

      await expect(page.locator('.dx-scheduler-appointment-tooltip-wrapper')).toBeVisible();

      await page.locator('.dx-scheduler-appointment-tooltip-wrapper .dx-tooltip-appointment-item-delete-button').click();

      await expect(page.locator('.dx-scheduler-appointment')).toHaveCount(expectedCount);
    });
  });
});
