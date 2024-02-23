import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import { generateAppointments } from '../../helpers/generateAppointments';

fixture.disablePageReloads`Offset: Markup usual appointments`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS_TIME = [
  { startTime: '04:00:00', endTime: '08:00:00' },
  { startTime: '10:15:00', endTime: '16:15:00' },
  { startTime: '17:05:00', endTime: '22:05:00' },
  { startTime: '23:00:00', endTime: '03:30:00', endDateShiftDays: 1 },
];
// NOTE: Appointment has increased length for testing purpose (it makes screenshots more obvious).
const APPOINTMENTS_TIMELINE_TIME = [
  { startTime: '04:00:00', endTime: '08:00:00', endDateShiftDays: 1 },
  { startTime: '10:15:00', endTime: '16:15:00', endDateShiftDays: 1 },
  { startTime: '17:05:00', endTime: '22:05:00', endDateShiftDays: 1 },
  { startTime: '23:00:00', endTime: '03:30:00', endDateShiftDays: 1 },
];
const APPOINTMENTS = {
  day: generateAppointments(
    '2023-09-06',
    '2023-09-08',
    APPOINTMENTS_TIME,
  ),
  week: generateAppointments(
    '2023-09-02',
    '2023-09-10',
    APPOINTMENTS_TIME,
  ),
  workWeekWithFirstDay: generateAppointments(
    '2023-09-05',
    '2023-09-13',
    APPOINTMENTS_TIME,
  ),
  month: generateAppointments(
    '2023-08-26',
    '2023-10-08',
    APPOINTMENTS_TIME,
  ),
  timelineDay: generateAppointments(
    '2023-09-06',
    '2023-09-08',
    APPOINTMENTS_TIMELINE_TIME,
  ),
  timelineWeek: generateAppointments(
    '2023-09-02',
    '2023-09-10',
    APPOINTMENTS_TIMELINE_TIME,
  ),
  timelineWeekWithFirstDay: generateAppointments(
    '2023-09-05',
    '2023-09-13',
    APPOINTMENTS_TIMELINE_TIME,
  ),
  timelineMonth: generateAppointments(
    '2023-08-31',
    '2023-09-08',
    APPOINTMENTS_TIMELINE_TIME,
  ),
};

const getScreenshotName = (
  viewType: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
  firstDay?: number,
) => `view_markup_usual-appts_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}_first-day-${firstDay}.png`;

const getViewWithCorrectCellDuration = (
  view: { type: string; cellDuration?: number },
  startDayHour: number,
  endDayHour: number,
): { type: string; cellDuration?: number } => {
  switch (view.type) {
    case 'timelineWeek':
    case 'timelineWorkWeek':
      return {
        ...view,
        cellDuration: (endDayHour - startDayHour) * 60,
      };
    default:
      return view;
  }
};

[
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.day },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.week },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.workWeekWithFirstDay },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.timelineDay },
  { views: [{ type: 'timelineWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.timelineWeek },
  // NOTE: The timelineWorkWeek view has some existing issues
  // Therefore some screenshots is invalid :(
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS.timelineWeek },
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 3 }], dataSource: APPOINTMENTS.timelineWeekWithFirstDay },
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
Usual appointments and workspaces render (
view: ${views[0].type},
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
          const view = getViewWithCorrectCellDuration(
            views[0],
            startDayHour,
            endDayHour,
          );

          await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
          await createWidget('dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            maxAppointmentsPerCell: 'unlimited',
            dataSource,
            views: [view],
            currentView: view.type,
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
