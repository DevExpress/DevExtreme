import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

test.describe('Timeline Appointments', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('all-day and ordinary appointments should overlap each other correctly in timeline views (T1017889)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Google AdWords Strategy',
        startDate: new Date(2021, 1, 1, 10),
        endDate: new Date(2021, 1, 1, 11),
        allDay: true,
      }, {
        text: 'Brochure Design Review',
        startDate: new Date(2021, 1, 1, 11, 30),
        endDate: new Date(2021, 1, 1, 12, 30),
      }],
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      currentDate: new Date(2021, 1, 1),
      firstDayOfWeek: 1,
      startDayHour: 10,
      endDayHour: 20,
      cellDuration: 60,
      height: 580,
    });

    await testScreenshot(page, 'timeline-overlapping-appointments.png');
  });
});
