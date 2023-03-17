import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture`Scheduler - All day appointments`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const VIEW_RANGE_HOURS = [
  [undefined, undefined],
  [6, undefined],
  [undefined, 18],
  [6, 18],
];

const setViewOptions = (startDayHour, endDayHour) => {
  const viewOptions: { startDayHour?: number; endDayHour?: number } = {};
  if (startDayHour) viewOptions.startDayHour = startDayHour;
  if (endDayHour) viewOptions.endDayHour = endDayHour;

  return viewOptions;
};

['week', 'month', 'timelineDay', 'timelineMonth'].forEach((view) => {
  VIEW_RANGE_HOURS.forEach(([startDayHour, endDayHour]) => {
    test(
      `all-day appointment ends at midnight.
     view=${view}, startDayHour=${startDayHour}, endDayHour=${endDayHour} (T1128938)`,
      async (t) => {
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await takeScreenshot(
          `midnight_all-day-appt_view=${view}_start=${startDayHour}_end=${endDayHour}.png`,
          scheduler.workSpace,
        );

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      },
    ).before(async () => {
      await createWidget(
        'dxScheduler',
        {
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
          cellDuration: 320,
          maxAppointmentsPerCell: 2,
          ...setViewOptions(startDayHour, endDayHour),
        },
      );
    });
  });
});

[
  'timelineDay',
  'timelineMonth',
].forEach((view) => {
  test(`all-day appointment ends at midnight of the next month. view=${view} (T1122382)`, async (t) => {
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await scheduler.scrollTo(new Date(2022, 11, 31, 23, 59));

    await takeScreenshot(
      `midnight-next-month_all-day-appt_view=${view}_first.png`,
      scheduler.workSpace,
    );

    await t.click(await scheduler.toolbar.navigator.nextButton());
    await t.wait(100);
    await scheduler.scrollTo(new Date(2023, 0, 1, 0, 1));

    await takeScreenshot(
      `midnight-next-month_all-day-appt_view=${view}_second.png`,
      scheduler.workSpace,
    );

    await t.expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget(
      'dxScheduler',
      {
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
      },
    );
  });
});
