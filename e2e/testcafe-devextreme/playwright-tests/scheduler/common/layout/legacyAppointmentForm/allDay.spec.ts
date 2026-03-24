import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe('Layout:AppointmentForm:AllDay', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  // TODO: needs Scheduler page object (scheduler.appointmentTooltip, legacyAppointmentPopup)
  test.skip('Start and end dates should be reflect the current day(appointment is already available case)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Text',
        startDate: new Date(2021, 3, 28, 10),
        endDate: new Date(2021, 3, 28, 12),
      }],
      editing: { legacyForm: true },
      views: ['week'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
    });
  });

  // TODO: needs Scheduler page object (legacyAppointmentPopup)
  test.skip('Start and end dates should be reflect the current day(create new appointment case)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      views: ['week'],
      editing: { legacyForm: true },
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
    });
  });

  // TODO: needs Scheduler page object (legacyAppointmentPopup)
  test.skip('StartDate and endDate should have correct type after "allDay" and "repeat" option are changed (T1002864)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2021, 1, 1),
      editing: { legacyForm: true },
    });
  });
});
