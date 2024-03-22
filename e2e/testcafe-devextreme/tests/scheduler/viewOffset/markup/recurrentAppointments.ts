import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Offset: Markup recurrent appointments`
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

const getScreenshotNameForEdgeCase = (
  edgeCaseName: string,
  viewType: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
) => `view_markup_recurrent-appts_${edgeCaseName}_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

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
  { views: [{ type: 'day', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'week', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'workWeek', cellDuration: 60, firstDayOfWeek: 3 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'month', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'timelineDay', cellDuration: 240, firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  // NOTE: The timelineWorkWeek view has some existing issues
  // Therefore some screenshots is invalid :(
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 0 }], dataSource: APPOINTMENTS_TIMELINE },
  { views: [{ type: 'timelineWorkWeek', firstDayOfWeek: 3 }], dataSource: APPOINTMENTS_TIMELINE },
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

[
  { views: [{ type: 'day', cellDuration: 60 }] },
  { views: [{ type: 'timelineDay', cellDuration: 240 }] },
].forEach(({ views }) => {
  [
    // Positive offset case without limits
    {
      dataSource: [{
        startDate: '2023-09-01T10:00:00',
        endDate: '2023-09-01T14:00:00',
        text: '#0 WE 10:00->14:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      },
      {
        startDate: '2023-09-01T20:00:00',
        endDate: '2023-09-02T04:00:00',
        text: '#1 WE 20:00->04:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      },
      {
        startDate: '2023-09-01T10:00:00',
        endDate: '2023-09-01T14:00:00',
        text: '#2 TH 10:00->14:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
      },
      {
        startDate: '2023-09-01T00:00:00',
        endDate: '2023-09-01T00:00:00',
        text: '#3 All-day TH',
        allDay: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
      }],
      offset: 720,
      startDayHour: 0,
      endDayHour: 24,
    },
    // Positive offset case with limits
    {
      dataSource: [{
        startDate: '2023-09-01T20:00:00',
        endDate: '2023-09-01T22:00:00',
        text: '#0 WE 15:00->19:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      },
      {
        startDate: '2023-09-01T23:00:00',
        endDate: '2023-09-02T01:00:00',
        text: '#1 WE 23:00->01:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      },
      {
        startDate: '2023-09-01T04:00:00',
        endDate: '2023-09-01T06:00:00',
        text: '#2 TH 04:00->06:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
      },
      {
        startDate: '2023-09-01T00:00:00',
        endDate: '2023-09-01T00:00:00',
        text: '#3 All-day TH',
        allDay: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TH',
      }],
      offset: 720,
      startDayHour: 9,
      endDayHour: 17,
    },
    // Negative offset case without limits
    {
      dataSource: [{
        startDate: '2023-09-01T10:00:00',
        endDate: '2023-09-01T14:00:00',
        text: '#0 TU 10:00->14:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      },
      {
        startDate: '2023-09-01T20:00:00',
        endDate: '2023-09-02T04:00:00',
        text: '#1 TU 20:00->04:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      },
      {
        startDate: '2023-09-01T10:00:00',
        endDate: '2023-09-01T14:00:00',
        text: '#2 WE 10:00->14:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      },
      {
        startDate: '2023-09-01T00:00:00',
        endDate: '2023-09-01T00:00:00',
        text: '#3 All-day WE',
        allDay: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      }],
      offset: -720,
      startDayHour: 0,
      endDayHour: 24,
    },
    // Negative offset case with limits
    {
      dataSource: [{
        startDate: '2023-09-01T20:00:00',
        endDate: '2023-09-01T22:00:00',
        text: '#0 TU 15:00->19:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      },
      {
        startDate: '2023-09-01T23:00:00',
        endDate: '2023-09-02T01:00:00',
        text: '#1 TU 23:00->01:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=TU',
      },
      {
        startDate: '2023-09-01T04:00:00',
        endDate: '2023-09-01T06:00:00',
        text: '#2 WE 04:00->06:00',
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      },
      {
        startDate: '2023-09-01T00:00:00',
        endDate: '2023-09-01T00:00:00',
        text: '#3 All-day WE',
        allDay: true,
        recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE',
      }],
      offset: -720,
      startDayHour: 9,
      endDayHour: 17,
    },
  ].forEach(({
    dataSource, offset, startDayHour, endDayHour,
  }) => {
    test(`
Recurrence appointments and workspaces render in short day views (
offset: ${offset},
start: ${startDayHour},
end: ${endDayHour}
)`, async (t) => {
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      await takeScreenshot(
        getScreenshotNameForEdgeCase(
          'short-day-views',
          views[0].type,
          offset,
          startDayHour,
          endDayHour,
        ),
        scheduler.workSpace,
      );

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
      await createWidget('dxScheduler', {
        currentDate: '2023-09-06',
        height: 800,
        maxAppointmentsPerCell: 'unlimited',
        currentView: views[0].type,
        dataSource,
        views,
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
