import { test } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, Scheduler } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';

test.describe('Scheduler loading panel', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Save appointment loading panel screenshot', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        id: 1,
        text: INITIAL_APPOINTMENT_TITLE,
        startDate: new Date(2021, 2, 29, 9, 30),
        endDate: new Date(2021, 2, 29, 11, 30),
      }],
      views: ['day'],
      currentView: 'day',
      currentDate: new Date(2021, 2, 29),
      startDayHour: 9,
      endDayHour: 14,
      height: 600,
      onAppointmentUpdating: (e) => {
        e.cancel = new Promise(() => {});
      },
    });

    const scheduler = new Scheduler(page, '#container');
    const appointment = scheduler.getAppointment(INITIAL_APPOINTMENT_TITLE);

    await appointment.element.dblclick();
    await scheduler.appointmentPopup.textEditor.click();
    await page.keyboard.type(ADDITIONAL_TITLE_TEXT);
    await scheduler.appointmentPopup.saveButton.click();

    await testScreenshot(page, 'save-appointment-loading-panel-screenshot.png', {
      element: scheduler.element,
    });
  });
});
