import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

test.describe.skip('Scheduler: max appointments per cell: All day', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['auto', 'unlimited', 1, 3, 10].forEach((maxAppointmentsPerCellValue) => {
    test(`All day appointments should have correct height in maxAppointmentsPerCell=${maxAppointmentsPerCellValue}`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [{
          text: 'test_26',
          startDate: new Date(2021, 3, 26),
          endDate: new Date(2021, 3, 26),
          allDay: true,
        }, {
          text: 'test_27',
          startDate: new Date(2021, 3, 27),
          endDate: new Date(2021, 3, 27),
          allDay: true,
        }, {
          text: 'test_27',
          startDate: new Date(2021, 3, 27),
          endDate: new Date(2021, 3, 27),
          allDay: true,
        }, {
          text: 'test_28',
          startDate: new Date(2021, 3, 28),
          endDate: new Date(2021, 3, 28),
          allDay: true,
        }, {
          text: 'test_28',
          startDate: new Date(2021, 3, 28),
          endDate: new Date(2021, 3, 28),
          allDay: true,
        }, {
          text: 'test_28',
          startDate: new Date(2021, 3, 28),
          endDate: new Date(2021, 3, 28),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_29',
          startDate: new Date(2021, 3, 29),
          endDate: new Date(2021, 3, 29),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }, {
          text: 'test_30',
          startDate: new Date(2021, 3, 30),
          endDate: new Date(2021, 3, 30),
          allDay: true,
        }],
        maxAppointmentsPerCell: maxAppointmentsPerCellValue,
        views: ['week'],
        currentView: 'week',
        currentDate: new Date(2021, 3, 29),
        startDayHour: 9,
        allDayPanelMode: 'allDay',
      });

      await testScreenshot(
        page,
        `all-day-appointment-maxAppointmentsPerCell=${maxAppointmentsPerCellValue}.png`,
        { element: page.locator('.dx-scheduler-all-day-appointments') },
      );
    });
  });
});
