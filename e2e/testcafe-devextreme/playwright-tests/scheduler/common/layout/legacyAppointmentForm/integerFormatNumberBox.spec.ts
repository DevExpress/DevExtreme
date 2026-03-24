import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe('Layout:AppointmentForm:IntegerFormatNumberBox', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  // TODO: needs Scheduler page object (legacyAppointmentPopup.repeatEveryElement, t.typeText)
  test.skip('dxNumberBox should not allow to enter not integer chars(T1002864)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Website Re-Design Plan',
        startDate: new Date(2021, 3, 26, 10),
        endDate: new Date(2021, 3, 26, 11),
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;UNTIL=20220114T205959Z',
      }],
      editing: { legacyForm: true },
      views: ['day', 'week', 'workWeek', 'month'],
      currentView: 'week',
      currentDate: new Date(2021, 3, 29),
      startDayHour: 9,
      height: 600,
      recurrenceEditMode: 'series',
    });
  });
});
