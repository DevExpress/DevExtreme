import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../../helpers/createWidget';
import { insertStylesheetRulesToPage, removeStylesheetRulesFromPage } from '../../../../helpers/domUtils';
import url from '../../../../helpers/getPageUrl';
import Scheduler from '../../../../model/scheduler';

fixture.disablePageReloads`Offset: Markup virtual scrolling`
  .page(url(__dirname, '../../../container.html'));

const SCHEDULER_SELECTOR = '#container';
const REDUCE_CELLS_CSS = `
.dx-scheduler-cell-sizes-vertical {
  height: 25px;
}`;
const APPOINTMENTS = [
  {
    startDate: '2023-09-05T00:00:00',
    endDate: '2023-09-05T03:00:00',
    text: '#0 Usual 05 00:00->03:00',
  },
  {
    startDate: '2023-09-05T04:00:00',
    endDate: '2023-09-05T09:00:00',
    text: '#1 Usual 05 05:00->09:00',
  },
  {
    startDate: '2023-09-05T10:30:00',
    endDate: '2023-09-05T16:30:00',
    text: '#2 Usual 05 12:30->16:30',
  },
  {
    startDate: '2023-09-05T17:00:00',
    endDate: '2023-09-05T23:30:00',
    text: '#3 Usual 05 18:00->22:00',
  },
  {
    startDate: '2023-09-05T00:00:00',
    endDate: '2023-09-05T00:00:00',
    text: '#4 All-day 05',
    allDay: true,
  },
];

const getScreenshotName = (
  viewType: string,
  offset: number,
  startDayHour: number,
  endDayHour: number,
) => `view_markup_virtual-scrolling_${viewType}_offset-${offset}_start-${startDayHour}_end-${endDayHour}.png`;

[
  { views: [{ type: 'week', cellDuration: 60 }], dataSource: APPOINTMENTS },
  { views: [{ type: 'month' }], dataSource: APPOINTMENTS },
  { views: [{ type: 'timelineMonth' }], dataSource: APPOINTMENTS },
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
Appointments and workspaces with virtual scrolling render (
view: ${views[0].type}
offset: ${offset},
start: ${startDayHour},
end: ${endDayHour},
)`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);

        await takeScreenshot(
          getScreenshotName(views[0].type, offset, startDayHour, endDayHour),
          scheduler.workSpace,
        );

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
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

// [
//   { views: [{ type: 'day', cellDuration: 60 }], dataSource: APPOINTMENTS },
//   { views: [{ type: 'timelineDay', cellDuration: 240 }], dataSource: APPOINTMENTS },
// ].forEach(({ views, dataSource }) => {
//   [
//     0,
//     -735,
//     735,
//   ].forEach((offset) => {
//     [
//       { startDayHour: 0, endDayHour: 24 },
//       { startDayHour: 9, endDayHour: 17 },
//     ].forEach(({ startDayHour, endDayHour }) => {
//       test(`
// Appointments and workspaces with virtual scrolling render (
// view: ${views[0].type}
// offset: ${offset},
// start: ${startDayHour},
// end: ${endDayHour},
// )`, async (t) => {
//         const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
//         const scheduler = new Scheduler(SCHEDULER_SELECTOR);
//
//         await takeScreenshot(
//           getScreenshotName(views[0].type, offset, startDayHour, endDayHour),
//           scheduler.workSpace,
//         );
//
//         await t.expect(compareResults.isValid())
//           .ok(compareResults.errorMessages());
//       }).before(async () => {
//         await insertStylesheetRulesToPage(REDUCE_CELLS_CSS);
//         await createWidget('dxScheduler', {
//           currentDate: '2023-09-05',
//           height: 800,
//           maxAppointmentsPerCell: 'unlimited',
//           dataSource,
//           views,
//           currentView: views[0].type,
//           offset,
//           startDayHour,
//           endDayHour,
//         });
//       })
//         .after(async () => {
//           await removeStylesheetRulesFromPage();
//           await disposeWidget('dxScheduler');
//         });
//     });
//   });
// });
