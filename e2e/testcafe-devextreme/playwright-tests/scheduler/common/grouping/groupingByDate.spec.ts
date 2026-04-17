import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const priorityData = [
  {
    text: 'Low Priority',
    id: 1,
    color: '#1e90ff',
  }, {
    text: 'High Priority',
    id: 2,
    color: '#ff9747',
  },
];

const dataSource = [
  {
    text: 'Website Re-Design Plan',
    priorityId: 2,
    startDate: new Date(2018, 4, 21, 9, 30),
    endDate: new Date(2018, 4, 21, 11, 30),
  }, {
    text: 'Book Flights to San Fran for Sales Trip',
    priorityId: 1,
    startDate: new Date(2018, 4, 24, 10, 0),
    endDate: new Date(2018, 4, 24, 12, 0),
  }, {
    text: 'Install New Router in Dev Room',
    priorityId: 1,
    startDate: new Date(2018, 4, 20, 13),
    endDate: new Date(2018, 4, 20, 15, 30),
  },
];

const createScheduler = async (page: any, options = {}) => {
  await createWidget(page, 'dxScheduler', {
    views: ['week'],
    dataSource: [],
    resources: [
      {
        fieldExpr: 'priorityId',
        allowMultiple: false,
        dataSource: priorityData,
        label: 'Priority',
      },
    ],
    groups: ['priorityId'],
    crossScrollingEnabled: true,
    groupByDate: false,
    width: 1666,
    height: 833,
    startDayHour: 9,
    firstDayOfWeek: 1,
    maxAppointmentsPerCell: 5,
    currentView: 'week',
    currentDate: new Date(2018, 4, 21),
    ...options,
  });
};

test.describe('Drag-and-drop appointments into allDay panel in the grouped Scheduler', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Drag-n-drop between dateTable and allDay panel, groupByDate=true', async ({ page }) => {
    await createScheduler(page, {
      dataSource,
      groupByDate: true,
    });

    const draggableAppointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'Website Re-Design Plan' });
    const allDayCell = page.locator('.dx-scheduler-all-day-table-cell').nth(1);

    await draggableAppointment.dragTo(allDayCell);

    await expect(draggableAppointment).toBeVisible();

    const isAllDay = await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      const appointments = instance.option('dataSource');
      const appt = appointments.find((a: any) => a.text === 'Website Re-Design Plan');
      return appt?.allDay === true;
    });
    expect(isAllDay).toBe(true);
  });
});
