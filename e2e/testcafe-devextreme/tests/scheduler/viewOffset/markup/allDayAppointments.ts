import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import { generateAppointments } from '../../helpers/generateAppointments';

fixture.disablePageReloads`Offset: Markup all-day appointments`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const ALL_DAY_APPOINTMENTS_DATA = [
  {
    startTime: '02:00:00',
    endTime: '02:00:00',
    allDay: true,
    endDateShiftDays: 1,
  },
  { startTime: '20:30:00', endTime: '23:30:00', allDay: true },
];
const APPOINTMENTS = {
  day: [
    ...generateAppointments(
      '2023-09-06',
      '2023-09-08',
      ALL_DAY_APPOINTMENTS_DATA,
    ),
    {
      startDate: '2023-09-05T14:00:00',
      endDate: '2023-09-09T16:00:00',
      text: 'LONG APPT',
      allDay: true,
    },
  ],
  week: [
    ...generateAppointments(
      '2023-09-02',
      '2023-09-10',
      ALL_DAY_APPOINTMENTS_DATA,
    ),
    {
      startDate: '2023-09-01T14:00:00',
      endDate: '2023-09-12T16:00:00',
      text: 'LONG APPT',
      allDay: true,
    },
  ],
  workWeekWithFirstDay: [
    ...generateAppointments(
      '2023-09-05',
      '2023-09-13',
      ALL_DAY_APPOINTMENTS_DATA,
    ),
    {
      startDate: '2023-09-03T14:00:00',
      endDate: '2023-09-15T16:00:00',
      text: 'LONG APPT',
      allDay: true,
    },
  ],
  month: [
    ...generateAppointments(
      '2023-08-26',
      '2023-10-08',
      ALL_DAY_APPOINTMENTS_DATA,
    ),
    {
      startDate: '2023-08-24T14:00:00',
      endDate: '2023-10-10T16:00:00',
      text: 'LONG APPT',
      allDay: true,
    },
  ],
};

const getScreenshotName = (
  viewType: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
  firstDay?: number,
) => `view_markup_all-day_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}_first-day-${firstDay}.png`;

[
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.day },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.workWeekWithFirstDay },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.day },
  { views: [{ type: 'timelineWeek', cellDuration: 480, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  // NOTE: The timelineWorkWeek view has some existing issues
  // Therefore some screenshots is invalid :(
  { views: [{ type: 'timelineWorkWeek', cellDuration: 480, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  {
    views: [{ type: 'timelineWorkWeek', cellDuration: 480, firstDayOfWeek: 3 }],
    dataSource: APPOINTMENTS.workWeekWithFirstDay,
  },
  { views: [{ type: 'timelineMonth', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
].forEach(({ views, dataSource }) => {
  [
    0,
    735,
    1440,
    -735,
    -1440,
  ].forEach((offset) => {
    [
      { startDayHour: 0, endDayHour: 24 },
      { startDayHour: 9, endDayHour: 17 },
    ].forEach(({ startDayHour, endDayHour }) => {
      test(`
All-day appointments and workspaces render (
view: ${views[0].type},
offset: ${offset},
start: ${startDayHour},
end: ${endDayHour}
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
          await disposeWidget('dxScheduler');
        });
    });
  });
});
