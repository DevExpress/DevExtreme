import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../../helpers/domUtils';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';
import { generateAppointments } from '../../helpers/generateAppointments';

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
      const [view] = views;

      test(`All-day appointments and workspaces render (view: ${view.type}, offset: ${offset}, start: ${startDayHour}, end: ${endDayHour}, first day: ${view.firstDayOfWeek})`, async ({ page }) => {
        await insertStylesheetRulesToPage(page, REDUCE_CELLS_CSS);
        await createWidget(page, 'dxScheduler', {
          currentDate: '2023-09-07',
          height: 800,
          maxAppointmentsPerCell: 'unlimited',
          dataSource,
          views,
          currentView: view.type,
          offset,
          startDayHour,
          endDayHour,
        });

        const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

        await testScreenshot(
          page,
          getScreenshotName(
            view.type,
            offset,
            startDayHour,
            endDayHour,
            view.firstDayOfWeek,
          ),
          { element: scheduler.workSpace },
        );
      });
    });
  });
});
