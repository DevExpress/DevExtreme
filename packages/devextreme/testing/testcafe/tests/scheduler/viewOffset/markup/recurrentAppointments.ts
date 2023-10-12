import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Offset: Markup Day`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const APPOINTMENTS = [
  {
    startDate: '2023-08-01T10:00:00',
    endDate: '2023-08-01T14:00:00',
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=24',
    text: 'Hourly 10-14',
  },
  {
    startDate: '2023-08-01T16:00:00',
    endDate: '2023-08-01T20:00:00',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR',
    text: 'Daily 16-20',
  },
  {
    startDate: '2023-08-01T23:00:00',
    endDate: '2023-08-02T05:00:00',
    recurrenceRule: 'FREQ=MONTHLY;BYMONTHDAY=7',
    allDay: true,
    text: 'All day 01 -> 02',
  },
];
// NOTE: Appointment has increased length for testing purpose (it makes screenshots more obvious).
const APPOINTMENTS_TIMELINE = [
  {
    startDate: '2023-08-01T04:00:00',
    endDate: '2023-08-01T18:00:00',
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=24',
    text: 'Hourly 04-18',
  },
  {
    startDate: '2023-08-01T20:00:00',
    endDate: '2023-08-02T10:00:00',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR',
    text: 'Daily 20-10',
  },
];

const getScreenshotName = (
  viewType: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
  firstDay?: number,
) => `view_markup_recurrent-appts_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}_first-day-${firstDay}.png`;

[
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWeek', cellDuration: 1440, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  // NOTE: The timelineWorkWeek view has some existing issues
  // Therefore some screenshots is invalid :(
  { views: [{ type: 'timelineWorkWeek', cellDuration: 1440, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWorkWeek', cellDuration: 1440, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineMonth', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
].forEach(({ views, dataSource }) => {
  [
    0,
    735,
    -735,
  ].forEach((offset) => {
    [
      { startDayHour: 0, endDayHour: 24 },
      { startDayHour: 9, endDayHour: 17 },
    ].forEach(({ startDayHour, endDayHour }) => {
      test(`
Recurrence appointments and workspaces render (
offset: ${offset},
start: ${startDayHour},
end: ${endDayHour},
first day: ${views[0].firstDayOfWeek}
)`, async (t) => {
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await takeScreenshot(
          getScreenshotName(
            views[0].type,
            offset,
            startDayHour,
            endDayHour,
            views[0].firstDayOfWeek,
          ),
          scheduler.workSpace,
        );

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      })
        .before(async () => {
          await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
          await createWidget('dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            maxAppointmentsPerCell: 'unlimited',
            dataSource,
            views,
            currentView: views[0].type,
            offset,
            startDayHour,
            endDayHour,
          });
        })
        .after(async () => {
          await removeStylesheetRulesFromPage();
        });
    });
  });
});
