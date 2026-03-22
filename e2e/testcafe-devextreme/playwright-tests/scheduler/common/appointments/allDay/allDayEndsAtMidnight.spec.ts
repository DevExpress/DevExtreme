import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setupTestPage, getContainerUrl } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = getContainerUrl(__dirname, '../../../../../tests/container.html');

const VIEW_RANGE_HOURS = [
  [undefined, undefined],
  [6, undefined],
  [undefined, 18],
  [6, 18],
];

const setViewOptions = (startDayHour: number | undefined, endDayHour: number | undefined) => {
  const viewOptions: { startDayHour?: number; endDayHour?: number } = {};
  if (startDayHour) viewOptions.startDayHour = startDayHour;
  if (endDayHour) viewOptions.endDayHour = endDayHour;

  return viewOptions;
};

test.describe('Scheduler - All day appointments ends at midnight', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  ['week', 'month', 'timelineDay', 'timelineMonth'].forEach((view) => {
    VIEW_RANGE_HOURS.forEach(([startDayHour, endDayHour]) => {
      test(
        `all-day appointment ends at midnight. view=${view}, startDayHour=${startDayHour}, endDayHour=${endDayHour} (T1128938)`,
        async ({ page }) => {
          await createWidget(page, 'dxScheduler', {
            dataSource: [
              {
                text: 'One day',
                startDate: '2023-01-01T00:00:00',
                endDate: '2023-01-01T00:00:00',
                allDay: true,
              },
              {
                text: 'Two days',
                startDate: '2023-01-01T00:00:00',
                endDate: '2023-01-02T00:00:00',
                allDay: true,
              },
            ],
            dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
            currentView: view,
            currentDate: '2023-01-01T00:00:00',
            height: 800,
            cellDuration: 360,
            maxAppointmentsPerCell: 2,
            ...setViewOptions(startDayHour, endDayHour),
          });

          await testScreenshot(
            page,
            `midnight_all-day-appt_view=${view}_start=${startDayHour}_end=${endDayHour}.png`,
            { element: page.locator('.dx-scheduler-work-space') },
          );
        },
      );
    });
  });

  [
    'timelineDay',
    'timelineMonth',
  ].forEach((view) => {
    test(`all-day appointment ends at midnight of the next month. view=${view} (T1122382)`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        dataSource: [
          {
            text: 'Two days',
            startDate: '2022-12-31T00:00:00',
            endDate: '2023-01-01T00:00:00',
            allDay: true,
          },
        ],
        dateSerializationFormat: 'yyyy-MM-ddTHH:mm:ss',
        currentView: view,
        currentDate: '2022-12-31T00:00:00',
        height: 800,
      });

      await page.evaluate((scrollDate) => {
        ($('#container') as any).dxScheduler('scrollTo', new Date(scrollDate));
      }, '2022-12-31T23:59:00');

      await testScreenshot(
        page,
        `midnight-next-month_all-day-appt_view=${view}_first.png`,
        { element: page.locator('.dx-scheduler-work-space') },
      );

      await page.locator('.dx-scheduler-navigator-next').click();
      await page.waitForTimeout(100);

      await page.evaluate((scrollDate) => {
        ($('#container') as any).dxScheduler('scrollTo', new Date(scrollDate));
      }, '2023-01-01T00:01:00');

      await testScreenshot(
        page,
        `midnight-next-month_all-day-appt_view=${view}_second.png`,
        { element: page.locator('.dx-scheduler-work-space') },
      );
    });
  });
});
