import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage, setupTestPage, getContainerUrl } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const data = [{
  text: '0',
  startDate: new Date(2021, 3, 1),
  endDate: new Date(2021, 3, 4),
}, {
  text: '1',
  startDate: new Date(2021, 3, 2),
  endDate: new Date(2021, 3, 5, 0, 0, 1),
}, {
  text: '2',
  startDate: new Date(2021, 3, 2, 1),
  endDate: new Date(2021, 3, 4, 23, 59),
}, {
  text: '3 - Skip',
  startDate: new Date(2021, 3, 3),
  endDate: new Date(2021, 3, 4, 23, 59, 59),
}];

test.describe('Scheduler - All day appointments', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('it should skip weekend days in workWeek', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: data,
      views: [{
        type: 'workWeek',
        intervalCount: 2,
        startDate: new Date(2021, 2, 4),
      }],
      maxAppointmentsPerCell: 'unlimited',
      currentView: 'workWeek',
      currentDate: new Date(2021, 3, 5),
      height: 300,
    });

    await testScreenshot(page, 'workweek_all-day_appointments_skip_weekend.png');
  });

  test('it should skip weekend days in timelineWorkWeek', async ({ page }) => {
    await insertStylesheetRulesToPage(page, '#container .dx-scheduler-cell-sizes-horizontal { width: 4px; }');

    await createWidget(page, 'dxScheduler', {
      width: 970,
      height: 300,
      dataSource: data,
      cellDuration: 60,
      views: [{
        type: 'timelineWorkWeek',
        intervalCount: 2,
      }],
      maxAppointmentsPerCell: 'unlimited',
      currentView: 'timelineWorkWeek',
      currentDate: new Date(2021, 3, 2),
    });

    await testScreenshot(page, 'timeline-work-week_all-day_appointments_skip_weekend.png');
  });

  test('should work correctly for unsorted dataSource', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        id: 3,
        text: '3',
        startDate: new Date('2020-11-23T00:00:00.000'),
        endDate: new Date('2020-11-28T00:00:00.000'),
        allDay: true,
      }, {
        id: 5,
        text: '5',
        startDate: new Date('2020-11-27T00:00:00.000'),
        endDate: new Date('2020-11-27T00:00:00.000'),
        allDay: true,
      }, {
        id: 1,
        text: '1',
        startDate: new Date('2020-11-25T22:20:00.000'),
        endDate: new Date('2020-11-26T12:30:00.000'),
      }],
      views: ['week'],
      currentView: 'week',
      showAllDayPanel: true,
      currentDate: new Date(2020, 10, 25),
      height: 600,
    });

    await testScreenshot(page, 'allDay-unsorted-datasource.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
