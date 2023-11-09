import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import createWidget from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';

fixture.disablePageReloads`Offset: Multi cell selection`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';

[
  0,
  -120,
  120,
].forEach((offset) => {
  [
    { view: 'day', dragOptions: { from: [0, 0], to: [5, 0] } },
    { view: 'week', dragOptions: { from: [2, 2], to: [3, 3] } },
    { view: 'month', dragOptions: { from: [2, 2], to: [3, 1] } },
    { view: 'timelineDay', dragOptions: { from: [0, 0], to: [0, 3] } },
    { view: 'timelineMonth', dragOptions: { from: [0, 0], to: [0, 3] } },
  ].forEach(({ view, dragOptions }) => {
    test(`Multi cell selection should work (view: ${view}, offset: ${offset})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      const [fromRow, fromCell] = dragOptions.from;
      const [toRow, toCell] = dragOptions.to;
      const firstCellSelector = scheduler.getDateTableCell(fromRow, fromCell);
      const secondCellSelector = scheduler.getDateTableCell(toRow, toCell);

      await t.dragToElement(firstCellSelector, secondCellSelector);

      await takeScreenshot(
        `offset_multi-cell-select_${view}_offset-${offset}.png`,
        scheduler.workSpace,
      );

      await t.click(secondCellSelector);
      await t.expect(scheduler.appointmentPopup.element).ok();

      await takeScreenshot(
        `offset_multi-cell-select_dialog_${view}_offset-${offset}.png`,
        scheduler.workSpace,
      );

      await t.click(scheduler.appointmentPopup.cancelButton);

      await t.expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await createWidget('dxScheduler', {
        currentDate: '2023-09-07',
        height: 800,
        dataSource: [],
        currentView: view,
        offset,
      });
    });
  });

  test(`Multi cell selection in the all-day panel should work (view: week, offset: ${offset})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    const firstCellSelector = scheduler.getAllDayTableCell(0);
    const secondCellSelector = scheduler.getAllDayTableCell(3);

    await t.dragToElement(firstCellSelector, secondCellSelector);

    await takeScreenshot(
      `offset_multi-cell-select_week-all-day_offset-${offset}.png`,
      scheduler.workSpace,
    );

    await t.click(secondCellSelector);
    await t.expect(scheduler.appointmentPopup.element).ok();

    await takeScreenshot(
      `offset_multi-cell-select_dialog_week-all-day_offset-${offset}.png`,
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
  });
});
