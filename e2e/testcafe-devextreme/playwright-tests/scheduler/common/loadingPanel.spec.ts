import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

const INITIAL_APPOINTMENT_TITLE = 'appointment';
const ADDITIONAL_TITLE_TEXT = '-updated';

test.describe('Scheduler loading panel', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  // TODO: needs Scheduler page object (new Scheduler, scheduler.getAppointment, appointmentPopup)
  test.skip('Save appointment loading panel screenshot', async ({ page }) => {
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
  });
});
