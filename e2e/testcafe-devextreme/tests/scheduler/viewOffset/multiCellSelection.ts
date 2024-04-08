import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { createWidget, disposeWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture.disablePageReloads`Offset: Multi cell selection`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';

[
  0,
  -120,
  120,
].forEach((offset) => {
  [true, false].forEach((rtlEnabled) => {
    [
      { view: 'day', dragOptions: { direction: 'increase', from: [0, 0], to: [7, 0] } },
      { view: 'day', dragOptions: { direction: 'decrease', from: [7, 0], to: [0, 0] } },
      { view: 'week', dragOptions: { direction: 'increase_0', from: [0, 2], to: [7, 2] } },
      { view: 'week', dragOptions: { direction: 'decrease_0', from: [7, 2], to: [0, 2] } },
      { view: 'week', dragOptions: { direction: 'increase_1', from: [1, 3], to: [8, 4] } },
      { view: 'week', dragOptions: { direction: 'decrease_1', from: [8, 4], to: [1, 3] } },
      { view: 'week', dragOptions: { direction: 'increase_2', from: [6, 3], to: [6, 5] } },
      { view: 'week', dragOptions: { direction: 'decrease_2', from: [6, 5], to: [6, 3] } },
      { view: 'week', dragOptions: { direction: 'increase_3', from: [0, 0], to: [11, 6] } },
      { view: 'week', dragOptions: { direction: 'decrease_3', from: [11, 6], to: [0, 0] } },
      { view: 'month', dragOptions: { direction: 'increase', from: [2, 2], to: [3, 1] } },
      { view: 'month', dragOptions: { direction: 'decrease', from: [3, 1], to: [2, 2] } },
      { view: 'timelineDay', dragOptions: { direction: 'increase', from: [0, 0], to: [0, 5] } },
      { view: 'timelineDay', dragOptions: { direction: 'decrease', from: [0, 5], to: [0, 0] } },
      { view: 'timelineMonth', dragOptions: { direction: 'increase', from: [0, 0], to: [0, 3] } },
      { view: 'timelineMonth', dragOptions: { direction: 'decrease', from: [0, 3], to: [0, 0] } },
    ].forEach(({ view, dragOptions }) => {
      test(`Multi cell selection should work (
view: ${view},
offset: ${offset},
direction: ${dragOptions.direction},
rtl: ${rtlEnabled},
)`, async (t) => {
        const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
        const scheduler = new Scheduler(SCHEDULER_SELECTOR);
        const { direction, from: [fromRow, fromCell], to: [toRow, toCell] } = dragOptions;
        const firstCellSelector = scheduler.getDateTableCell(fromRow, fromCell);
        const secondCellSelector = scheduler.getDateTableCell(toRow, toCell);

        await t.dragToElement(firstCellSelector, secondCellSelector);
        await takeScreenshot(
          `offset_multi-cell-select_${view}_offset-${offset}_${direction}${rtlEnabled ? '_rtl' : ''}.png`,
          scheduler.workSpace,
        );

        await t.expect(compareResults.isValid())
          .ok(compareResults.errorMessages());
      }).before(async () => {
        await createWidget('dxScheduler', {
          currentDate: '2023-09-07',
          height: 800,
          dataSource: [],
          currentView: view,
          offset,
          rtlEnabled,
        });
      }).after(async () => disposeWidget('dxScheduler'));
    });

    test(`Multi cell selection in the all-day panel should work (
view: week,
offset: ${offset},
rtl: ${rtlEnabled},
)`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      const firstCellSelector = scheduler.getAllDayTableCell(0);
      const secondCellSelector = scheduler.getAllDayTableCell(3);

      await t.dragToElement(firstCellSelector, secondCellSelector);
      await takeScreenshot(
        `offset_multi-cell-select_week-all-day_offset-${offset}${rtlEnabled ? '_rtl' : ''}.png`,
        scheduler.workSpace,
      );

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createWidget('dxScheduler', {
        currentDate: '2023-09-07',
        height: 800,
        dataSource: [],
        currentView: 'week',
        offset,
      });
    }).after(async () => disposeWidget('dxScheduler'));
  });
});
