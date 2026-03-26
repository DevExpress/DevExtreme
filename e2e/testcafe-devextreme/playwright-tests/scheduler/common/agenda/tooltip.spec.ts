import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Agenda:Tooltip', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test("Tooltip's date should be equal to date of current appointment(T1037028)", async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Text',
        startDate: new Date(2021, 1, 1, 12),
        endDate: new Date(2021, 1, 1, 13),
        recurrenceRule: 'FREQ=HOURLY;COUNT=5',
      }],
      views: ['agenda'],
      currentView: 'agenda',
      currentDate: new Date(2021, 1, 1),
      height: 600,
    });

    const appointmentName = 'Text';

    for (let index = 0; index < 5; index += 1) {
      await page.evaluate(() => {
        const instance = ($('#container') as any).dxScheduler('instance');
        instance.hideAppointmentTooltip();
      });

      const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: appointmentName }).nth(index);
      await appointment.click();

      const tooltipDate = await page.locator('.dx-tooltip-appointment-item-content-date').first().innerText();
      const appointmentTime = await appointment.locator('.dx-scheduler-appointment-content-date').textContent();

      expect(tooltipDate).toBe(appointmentTime);
    }
  });
});
