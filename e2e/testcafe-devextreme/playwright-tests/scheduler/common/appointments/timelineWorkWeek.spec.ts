import { test, expect } from '@playwright/test';
import { createWidget, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const CELL_WIDTH = 200;

test.describe('Appointments in TimelineWorkWeek', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Appointments should have correct width', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: new Date(2024, 0, 29),
      dataSource: [
        {
          text: 'appt-01',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-02',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 4, 14, 0),
        },
        {
          text: 'appt-03',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 6, 10, 0),
        },
        {
          text: 'appt-04',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 6, 18, 0),
        },
        {
          text: 'appt-05',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 3, 10, 0),
        },
        {
          text: 'appt-06',
          startDate: new Date(2024, 1, 1, 13, 0),
          endDate: new Date(2024, 1, 3, 18, 0),
        },
        {
          text: 'appt-07',
          startDate: new Date(2024, 1, 4, 13, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-08',
          startDate: new Date(2024, 1, 1, 10, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-09',
          startDate: new Date(2024, 1, 1, 19, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-10',
          startDate: new Date(2024, 1, 4, 10, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
        {
          text: 'appt-11',
          startDate: new Date(2024, 1, 4, 17, 0),
          endDate: new Date(2024, 1, 6, 14, 0),
        },
      ],
      views: [{
        type: 'timelineWorkWeek',
        intervalCount: 2,
        maxAppointmentsPerCell: 'unlimited',
      }],
      currentView: 'timelineWorkWeek',
      startDayHour: 12,
      endDayHour: 16,
      cellDuration: 60,
    });

    const getApptWidth = (title: string) =>
      page.locator('.dx-scheduler-appointment').filter({ hasText: title }).evaluate(
        (el) => el.style.width,
      );

    expect(await getApptWidth('appt-01')).toBe(`${CELL_WIDTH * (3 + 4 * 2 + 2)}px`);
    expect(await getApptWidth('appt-02')).toBe(`${CELL_WIDTH * (3 + 4)}px`);
    expect(await getApptWidth('appt-03')).toBe(`${CELL_WIDTH * (3 + 4 * 2)}px`);
    expect(await getApptWidth('appt-04')).toBe(`${CELL_WIDTH * (3 + 4 * 3)}px`);
    expect(await getApptWidth('appt-05')).toBe(`${CELL_WIDTH * (3 + 4)}px`);
    expect(await getApptWidth('appt-06')).toBe(`${CELL_WIDTH * (3 + 4)}px`);
    expect(await getApptWidth('appt-07')).toBe(`${CELL_WIDTH * (4 + 2)}px`);
    expect(await getApptWidth('appt-08')).toBe(`${CELL_WIDTH * (4 * 3 + 2)}px`);
    expect(await getApptWidth('appt-09')).toBe(`${CELL_WIDTH * (4 * 2 + 2)}px`);
    expect(await getApptWidth('appt-10')).toBe(`${CELL_WIDTH * (4 + 2)}px`);
    expect(await getApptWidth('appt-11')).toBe(`${CELL_WIDTH * (4 + 2)}px`);
  });
});
