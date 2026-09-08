import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import Scheduler from '../../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';
const VIEW_RANGE_HOURS: [number | undefined, number | undefined][] = [
  [undefined, undefined],
  [6, undefined],
  [undefined, 18],
  [6, 18],
];

const setViewOptions = (
  startDayHour?: number,
  endDayHour?: number,
): { startDayHour?: number; endDayHour?: number } => {
  const viewOptions: { startDayHour?: number; endDayHour?: number } = {};
  if (startDayHour) viewOptions.startDayHour = startDayHour;
  if (endDayHour) viewOptions.endDayHour = endDayHour;

  return viewOptions;
};

['week', 'month', 'timelineDay', 'timelineMonth'].forEach((view) => {
  VIEW_RANGE_HOURS.forEach(([startDayHour, endDayHour]) => {
    test(`all-day appointment ends at midnight. view=${view}, startDayHour=${startDayHour}, endDayHour=${endDayHour} (T1128938)`, async ({ page }) => {
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

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      await testScreenshot(
        page,
        `midnight_all-day-appt_view=${view}_start=${startDayHour}_end=${endDayHour}.png`,
        { element: scheduler.workSpace },
      );
    });
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

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.scrollTo(new Date(2022, 11, 31, 23, 59));

    await testScreenshot(
      page,
      `midnight-next-month_all-day-appt_view=${view}_first.png`,
      { element: scheduler.workSpace },
    );

    const captionBefore = await scheduler.toolbar.navigator.caption.innerText();

    await scheduler.toolbar.navigator.nextButton.click();

    // The TestCafe test waited a fixed 100 ms for the new date range to render; the caption is
    // what actually says the navigation went through.
    await expect(scheduler.toolbar.navigator.caption).not.toHaveText(captionBefore);

    await scheduler.scrollTo(new Date(2023, 0, 1, 0, 1));

    await testScreenshot(
      page,
      `midnight-next-month_all-day-appt_view=${view}_second.png`,
      { element: scheduler.workSpace },
    );
  });
});
