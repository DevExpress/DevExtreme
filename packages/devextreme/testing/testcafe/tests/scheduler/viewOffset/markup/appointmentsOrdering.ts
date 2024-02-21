import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';
import { generateAppointments } from '../../helpers/generateAppointments';

fixture.disablePageReloads`Offset: Markup appointments ordering`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;

const APPOINTMENTS_TIME = [
  { startTime: '10:15:00', endTime: '16:15:00' },
  { startTime: '17:05:00', endTime: '22:05:00' },
];
// NOTE: Appointment has increased length for testing purpose (it makes screenshots more obvious).
const APPOINTMENTS_TIMELINE_TIME = [
  { startTime: '04:00:00', endTime: '08:00:00', endDateShiftDays: 1 },
  { startTime: '10:15:00', endTime: '16:15:00', endDateShiftDays: 1 },
  { startTime: '17:05:00', endTime: '22:05:00', endDateShiftDays: 1 },
];

const RECURRENT_APPOINTMENTS_MONTH = [
  {
    startDate: '2023-08-01T15:00:00',
    endDate: '2023-08-01T19:00:00',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR',
    text: 'Daily 15-19',
  },
];

const RECURRENT_APPOINTMENTS_MONTH_TIMELINE = [
  {
    startDate: '2023-08-01T09:00:00',
    endDate: '2023-08-01T13:00:00',
    recurrenceRule: 'FREQ=HOURLY;INTERVAL=24',
    text: 'Hourly 09-13',
  },
  {
    startDate: '2023-08-01T15:00:00',
    endDate: '2023-08-01T19:00:00',
    recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,WE,TH,FR',
    text: 'Daily 15-19',
  },
];

const APPOINTMENTS = {
  month: generateAppointments(
    '2023-08-26',
    '2023-10-08',
    APPOINTMENTS_TIME,
  ).concat(RECURRENT_APPOINTMENTS_MONTH),
  timelineMonth: generateAppointments(
    '2023-08-31',
    '2023-09-08',
    APPOINTMENTS_TIMELINE_TIME,
  ).concat(RECURRENT_APPOINTMENTS_MONTH_TIMELINE),
};

const getScreenshotName = (
  viewType: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
) => `view_markup_ordering-appts_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

[
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS.month },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS.timelineMonth },
].forEach(({ views, dataSource }) => {
  [
    0,
    735,
    -735,
    1440,
    -1440,
  ].forEach((offset) => {
    [
      { startDayHour: 0, endDayHour: 24 },
      { startDayHour: 9, endDayHour: 17 },
    ].forEach(({ startDayHour, endDayHour }) => {
      test(`
Appointments ordering and workspaces render (
view: ${views[0].type},
offset: ${offset},
start: ${startDayHour},
end: ${endDayHour}
)`, async (t) => {
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);

        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

        await takeScreenshot(
          getScreenshotName(
            views[0].type,
            offset,
            startDayHour,
            endDayHour,
          ),
          scheduler.workSpace,
        );

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      })
        .before(async () => {
          const [view] = views;

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

test('Appointments are ordered correctly with both recurrent and usual appointments (T1212573)', async (t) => {
  const scheduler = new Scheduler(SCHEDULER_SELECTOR);

  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await takeScreenshot(
    'view_markup_ordering-appts_T1212573.png',
    scheduler.workSpace,
  );

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const data = [
    {
      text: 'Recurr 1',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=MO,TH;COUNT=10',
    }, {
      text: 'Recurr 2',
      startDate: new Date('2020-11-01T17:30:00.000Z'),
      endDate: new Date('2020-11-01T19:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU,WE;COUNT=10',
    }, {
      text: 'Recurr 3',
      startDate: new Date('2020-11-01T20:00:00.000Z'),
      endDate: new Date('2020-11-01T21:00:00.000Z'),
      recurrenceRule: 'FREQ=WEEKLY;BYDAY=SU;WKST=TU;INTERVAL=2;COUNT=2',
    }, {
      text: 'Recurr 4',
      startDate: new Date('2020-11-01T17:00:00.000Z'),
      endDate: new Date('2020-11-01T17:15:00.000Z'),
      recurrenceRule: 'FREQ=DAILY;BYDAY=TU;UNTIL=20201203',
    }, {
      text: 'Test 1',
      startDate: new Date('2020-11-01T15:00:00.000Z'),
      endDate: new Date('2020-11-01T15:30:00.000Z'),
    }, {
      text: 'Test 2',
      startDate: new Date('2020-11-01T18:00:00.000Z'),
      endDate: new Date('2020-11-01T18:30:00.000Z'),
    }, {
      text: 'Test 3',
      startDate: new Date('2020-11-02T15:00:00.000Z'),
      endDate: new Date('2020-11-02T15:30:00.000Z'),
    }, {
      text: 'Test 4',
      startDate: new Date('2020-11-02T18:00:00.000Z'),
      endDate: new Date('2020-11-02T18:30:00.000Z'),
    }, {
      text: 'Test 5',
      startDate: new Date('2020-11-03T15:00:00.000Z'),
      endDate: new Date('2020-11-03T15:30:00.000Z'),
    }, {
      text: 'Test 6',
      startDate: new Date('2020-11-03T18:00:00.000Z'),
      endDate: new Date('2020-11-03T18:30:00.000Z'),
    }, {
      text: 'Test 7',
      startDate: new Date('2020-11-04T15:00:00.000Z'),
      endDate: new Date('2020-11-04T15:30:00.000Z'),
    }, {
      text: 'Test 8',
      startDate: new Date('2020-11-04T18:00:00.000Z'),
      endDate: new Date('2020-11-04T18:30:00.000Z'),
    },
  ];

  await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
  await createWidget('dxScheduler', {
    currentDate: '2020-11-07',
    height: 800,
    dataSource: data,
    views: ['timelineMonth'],
    currentView: 'timelineMonth',
  });
}).after(async () => {
  await removeStylesheetRulesFromPage();
  await disposeWidget('dxScheduler');
});
