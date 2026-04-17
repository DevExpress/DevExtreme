import { test, expect } from '@playwright/test';
import { setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Display* arguments in appointment templates and events', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  [undefined, 'America/Los_Angeles'].forEach((timeZone) => {
    test(`displayStartDate and displayEndDate arguments should be right with timeZone='${timeZone}'`, async ({ page }) => {
      await page.evaluate(({ tz }) => {
        const $scheduler = ($('#container') as any);
        const devExpress = (window as any).DevExpress;

        $scheduler.dxScheduler({
          timeZone: tz,
          dataSource: [],
          views: ['day'],
          currentView: 'day',
          currentDate: new Date(2021, 1, 15),
          startDayHour: 9,
          height: 600,

          onAppointmentClick(model: any) {
            const { displayStartDate, displayEndDate } = model.targetedAppointmentData;
            (window as any).testDisplayValue = `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
          },

          appointmentTooltipTemplate(model: any) {
            const { displayStartDate, displayEndDate } = model.targetedAppointmentData;
            return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
          },

          appointmentTemplate(model: any) {
            const { displayStartDate, displayEndDate } = model.targetedAppointmentData;
            return `${displayStartDate.toLocaleTimeString('en-US', { hour12: false })} ${displayEndDate.toLocaleTimeString('en-US', { hour12: false })}`;
          },
        });
        devExpress.fx.off = true;
      }, { tz: timeZone });

      const etalon = '09:30:00 10:00:00';

      const cell = page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(0);
      await cell.dblclick();

      const textEditor = page.locator('.dx-scheduler-appointment-popup .dx-textbox input');
      await textEditor.fill('text');
      await page.locator('.dx-popup-done').click();

      const appointmentText = await page.locator('.dx-scheduler-appointment').nth(0).innerText();
      expect(appointmentText).toBe(etalon);

      await page.locator('.dx-scheduler-appointment').nth(0).click();
      const tooltipText = await page.locator('.dx-scheduler-appointment-tooltip-wrapper .dx-list-item').nth(0).innerText();
      expect(tooltipText).toBe(etalon);

      const testDisplayValue = await page.evaluate(() => (window as any).testDisplayValue);
      expect(testDisplayValue).toBe(etalon);
    });
  });
});
