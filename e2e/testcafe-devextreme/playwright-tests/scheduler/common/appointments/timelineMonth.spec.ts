import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Appointments in TimelineMonth', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Appointments should have correct order', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2016, 1, 2),
      dataSource: [
        {
          text: 'appt-01',
          startDate: new Date(2016, 1, 1, 9, 0),
          endDate: new Date(2016, 1, 1, 10, 30),
        }, {
          text: 'appt-02',
          startDate: new Date(2016, 1, 1, 11, 30),
          endDate: new Date(2016, 1, 1, 14, 15),
        }, {
          text: 'appt-03',
          startDate: new Date(2016, 1, 1, 15, 15),
          endDate: new Date(2016, 1, 1, 17, 15),
        }, {
          text: 'appt-04',
          startDate: new Date(2016, 1, 1, 18, 45),
          endDate: new Date(2016, 1, 1, 20, 15),
        }, {
          text: 'appt-05',
          startDate: new Date(2016, 1, 2, 8, 15),
          endDate: new Date(2016, 1, 2, 10, 45),
        }, {
          text: 'appt-06',
          startDate: new Date(2016, 1, 2, 12, 0),
          endDate: new Date(2016, 1, 2, 13, 45),
        }, {
          text: 'appt-07',
          startDate: new Date(2016, 1, 2, 15, 30),
          endDate: new Date(2016, 1, 2, 17, 30),
        }, {
          text: 'appt-08',
          startDate: new Date(2016, 1, 3, 8, 15),
          endDate: new Date(2016, 1, 3, 9, 0),
        }, {
          text: 'appt-09',
          startDate: new Date(2016, 1, 3, 10, 0),
          endDate: new Date(2016, 1, 3, 11, 15),
        }, {
          text: 'appt-10',
          startDate: new Date(2016, 1, 3, 11, 45),
          endDate: new Date(2016, 1, 3, 13, 45),
        }, {
          text: 'appt-11',
          startDate: new Date(2016, 1, 3, 14, 0),
          endDate: new Date(2016, 1, 3, 16, 45),
        },
      ],
      views: ['timelineMonth'],
      currentView: 'timelineMonth',
      maxAppointmentsPerCell: 'unlimited',
      height: 505,
      startDayHour: 8,
      endDayHour: 20,
      cellDuration: 60,
      firstDayOfWeek: 0,
      width: 800,
    });

    await testScreenshot(page, 'timelineMonth-appt-order.png');
  });
});
