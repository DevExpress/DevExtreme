import { test, expect } from '@playwright/test';
import { testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Drag-and-drop appointments in the Scheduler with vertical grouping', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

test('Should drag appoinment to the previous day`s cell (T1025952)', async ({ page }) => {
  // Scheduler on '#container'
  const appointment = page.locator('.dx-scheduler-appointment').filter({ hasText: 'appointment' });

    await /* TODO: dragToElement(appointment.element, page.locator('.dx-scheduler-date-table-row').nth(1).locator('.dx-scheduler-date-table-cell').nth(1) */);

  await testScreenshot(page, 'drag-n-drop-previous-day-cell.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createScheduler({
  dataSource: [
    {
      text: 'appointment',
      startDate: new Date(2021, 3, 21, 9, 30),
      endDate: new Date(2021, 3, 21, 10),
      priorityId: 1,
    },
  ],
  views: [
    {
      type: 'week',
      groupOrientation: 'vertical',
    },
  ],
  currentView: 'week',
  currentDate: new Date(2021, 3, 21),
  groups: ['priorityId'],
  resources: [
    {
      dataSource: [
        {
          text: 'Low Priority',
          id: 1,
        }, {
          text: 'High Priority',
          id: 2,
        },
      ],
      fieldExpr: 'priorityId',
      displayExpr: 'name',
      allowMultiple: false,
    },
  ],
  startDayHour: 9,
  endDayHour: 12,
  height: 600,
}));
});
