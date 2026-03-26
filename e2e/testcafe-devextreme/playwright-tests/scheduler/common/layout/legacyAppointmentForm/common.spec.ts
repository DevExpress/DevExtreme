import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, Scheduler } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe('Layout:AppointmentForm:MobileEnvironment', () => {
  test('Appointment form should be display valid layout', async ({ page }) => {
    await page.setViewportSize({ width: 350, height: 600 });
    await setupTestPage(page, containerUrl);

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Text',
        startDate: new Date(2021, 3, 28, 10),
        endDate: new Date(2021, 3, 28, 12),
      }],
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
      editing: { legacyForm: true },
    });

    await page.locator('.dx-scheduler-appointment').filter({ hasText: 'Text' }).dblclick();
    await testScreenshot(page, 'appointment-form-in-mobile-environment.png');
  });
});

test.describe('AppointmentForm screenshot tests', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Appointemt form tests', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Test Appointment',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 11),
      }],
      editing: { legacyForm: true },
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
    });

    const scheduler = new Scheduler(page);
    const appointment = scheduler.getAppointment('Test Appointment');
    await appointment.element.dblclick();

    await expect(scheduler.appointmentPopup.element).toBeVisible();

    await testScreenshot(page, 'legacy-appointment-form.png');
  });
});
