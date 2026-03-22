import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe('Scheduler: max appointments per cell: Day', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['auto', 'unlimited', 3, 10].forEach((maxAppointmentsPerCellValue) => {
    test(`Day appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'test_1',
          startDate: new Date(2021, 3, 27, 9),
          endDate: new Date(2021, 3, 27, 9, 30),
        }, {
          text: 'test_2',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_3',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_4',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_5',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_6',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_7',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_8',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_9',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_10',
          startDate: new Date(2021, 3, 27, 10),
          endDate: new Date(2021, 3, 27, 11),
        }, {
          text: 'test_1',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_12',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_13',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_14',
          startDate: new Date(2021, 3, 27, 9, 30),
          endDate: new Date(2021, 3, 27, 10),
        }, {
          text: 'test_15',
          startDate: new Date(2021, 3, 27, 10, 30),
          endDate: new Date(2021, 3, 27, 11, 30),
        }, {
          text: 'test_16',
          startDate: new Date(2021, 3, 27, 12),
          endDate: new Date(2021, 3, 27, 12, 30),
        }, {
          text: 'test_17',
          startDate: new Date(2021, 3, 27, 12),
          endDate: new Date(2021, 3, 27, 14),
        }, {
          text: 'test_18',
          startDate: new Date(2021, 3, 27, 12),
          endDate: new Date(2021, 3, 27, 13, 30),
        }],
        maxAppointmentsPerCell: maxAppointmentsPerCellValue,
        views: ['day'],
        currentView: 'day',
        currentDate: new Date(2021, 3, 27),
        startDayHour: 9,
        height: 700,
        width: 500,
      });

      await testScreenshot(
        page,
        `day-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`,
        { element: page.locator('.dx-scheduler-work-space') },
      );
    });
  });
});
