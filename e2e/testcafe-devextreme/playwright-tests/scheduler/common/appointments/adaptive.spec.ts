import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');
const MOBILE_SIZE: [width: number, height: number] = [500, 700];

test.describe.skip('Appointments with adaptive', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['week', 'month'].forEach((view) => {
    test(`should correctly render appointment collectors (view:${view})`, async ({ page }) => {
      await page.setViewportSize({ width: MOBILE_SIZE[0], height: MOBILE_SIZE[1] });

      await createWidget(page, 'dxScheduler', {
        dataSource: [
          {
            startDate: '2023-12-20T10:00:00',
            endDate: '2024-01-20T12:00:00',
            allDay: true,
            text: 'all-day #0 (long)',
          },
          {
            startDate: '2023-12-31T10:00:00',
            endDate: '2024-01-06T12:00:00',
            allDay: true,
            text: 'all-day #1 (week-long)',
          },
          {
            startDate: '2024-01-01T10:00:00',
            endDate: '2024-01-05T12:00:00',
            allDay: true,
            text: 'all-day #2',
          },
          {
            startDate: '2024-01-02T10:00:00',
            endDate: '2024-01-04T12:00:00',
            allDay: true,
            text: 'all-day #3',
          },
          {
            startDate: '2024-01-03T10:00:00',
            endDate: '2024-01-03T12:00:00',
            allDay: true,
            text: 'all-day #4 (single-day)',
          },
          {
            startDate: '2024-12-30T10:00:00',
            endDate: '2024-01-20T12:00:00',
            text: 'usual #0 (long)',
          },
          {
            startDate: '2024-01-03T01:30:00',
            endDate: '2024-01-03T22:00:00',
            text: 'usual #1 (day-long)',
          },
          {
            startDate: '2024-01-03T01:30:00',
            endDate: '2024-01-03T02:30:00',
            text: 'usual #2 (short)',
          },
          {
            startDate: '2024-01-03T02:30:00',
            endDate: '2024-01-03T22:00:00',
            text: 'usual #3 (day-long)',
          },
        ],
        adaptivityEnabled: true,
        currentView: 'week',
        currentDate: '2024-01-01T00:00:00',
      });

      await testScreenshot(page, `adaptive_appts_view-${view}.png`, {
        element: page.locator('.dx-scheduler-work-space'),
      });
    });
  });

  test('should correctly render long appointments with disabled allDayPanel ()', async ({ page }) => {
    await page.setViewportSize({ width: MOBILE_SIZE[0], height: MOBILE_SIZE[1] });

    await createWidget(page, 'dxScheduler', {
      dataSource: [
        {
          startDate: '2023-12-20T00:00:00',
          endDate: '2024-01-20T02:00:00',
          text: '#0 (long)',
        },
        {
          startDate: '2023-12-31T00:00:00',
          endDate: '2024-01-06T02:00:00',
          text: '#1 (week-long)',
        },
        {
          startDate: '2024-01-01T00:00:00',
          endDate: '2024-01-05T02:00:00',
          text: '#2',
        },
        {
          startDate: '2024-01-02T00:00:00',
          endDate: '2024-01-04T02:00:00',
          text: '#3',
        },
        {
          startDate: '2024-01-03T00:00:00',
          endDate: '2024-01-03T02:00:00',
          text: '#4 (single-day)',
        },
        {
          startDate: '2024-01-03T01:30:00',
          endDate: '2024-01-03T22:00:00',
          text: '#5',
        },
        {
          startDate: '2024-01-03T01:30:00',
          endDate: '2024-01-03T02:30:00',
          text: '#6',
        },
        {
          startDate: '2024-01-03T02:30:00',
          endDate: '2024-01-03T22:00:00',
          text: '#7',
        },
      ],
      adaptivityEnabled: true,
      allDayPanelMode: 'hidden',
      showAllDayPanel: false,
      currentView: 'week',
      currentDate: '2024-01-01T00:00:00',
    });

    await testScreenshot(page, 'adaptive_long-appts-without-all-day-panel_view-week.png', {
      element: page.locator('.dx-scheduler-work-space'),
    });
  });
});
