import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Appointment Form', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test("Invoke showAppointmentPopup method shouldn't raise error if value of currentDate property as a string", async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 2, 25).toISOString(),
      height: 600,
      editing: { legacyForm: true },
    });

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.showAppointmentPopup();
    });

    const popup = page.locator('.dx-scheduler-appointment-popup');
    const startDateInput = popup.locator('.dx-texteditor-input').nth(2);
    const startDateValue = await startDateInput.inputValue();
    expect(startDateValue).toBe('3/25/2021, 12:00 AM');
  });

  test('Show appointment popup if deffereRendering is false (T1069753)', async ({ page }) => {
    await page.evaluate(() => {
      (window as any).DevExpress.ui.dxPopup.defaultOptions({
        options: { deferRendering: false },
      });
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test',
        startDate: new Date(2021, 2, 29, 10),
        endDate: new Date(2021, 2, 29, 11),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 29),
      startDayHour: 9,
      endDayHour: 12,
      width: 400,
      editing: { legacyForm: true },
    });

    const appointment = page.locator('.dx-scheduler-appointment').nth(0);
    await appointment.dblclick();

    const popup = page.locator('.dx-scheduler-appointment-popup');
    await expect(popup).toBeVisible();
  });
});
