import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import asyncForEach from '../../../helpers/asyncForEach';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import Scheduler from 'devextreme-testcafe-models/scheduler';

fixture.disablePageReloads`Offset: Keyboard navigation`
  .page(url(__dirname, '../../container.html'));

const SCHEDULER_SELECTOR = '#container';

const KEYBOARD_ACTIONS = {
  day: ['down', 'down', 'down', 'up'],
  week: ['up', 'right', 'down', 'down', 'left', 'left', 'up', 'up'],
  month: ['up', 'right', 'down', 'down', 'left', 'left', 'up', 'up'],
  timelineDay: ['right', 'right', 'right', 'left'],
  timelineMonth: ['right', 'right', 'right', 'left'],
};

[
  0,
  -120,
  120,
].forEach((offset) => {
  [
    { view: 'day', startCell: [1, 0], keyboardKeys: KEYBOARD_ACTIONS.day },
    { view: 'week', startCell: [3, 3], keyboardKeys: KEYBOARD_ACTIONS.week },
    { view: 'month', startCell: [3, 3], keyboardKeys: KEYBOARD_ACTIONS.month },
    { view: 'timelineDay', startCell: [0, 1], keyboardKeys: KEYBOARD_ACTIONS.timelineDay },
    { view: 'timelineMonth', startCell: [0, 1], keyboardKeys: KEYBOARD_ACTIONS.timelineMonth },
  ].forEach(({ view, startCell, keyboardKeys }) => {
    test(`Keyboard navigation should work (view: ${view}, offset: ${offset})`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      const scheduler = new Scheduler(SCHEDULER_SELECTOR);

      const [rowIdx, cellIdx] = startCell;
      const startCellSelector = scheduler.getDateTableCell(rowIdx, cellIdx);

      await t.click(startCellSelector);
      await asyncForEach(keyboardKeys, async (key) => {
        await t.pressKey(key);
      });

      await takeScreenshot(
        `offset_keyboard_${view}_offset-${offset}.png`,
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
      });
    });
  });

  test(`Keyboard navigation in the all-day panel should work (view: week, offset: ${offset})`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const scheduler = new Scheduler(SCHEDULER_SELECTOR);

    const startCellSelector = scheduler.getAllDayTableCell(1);

    await t.click(startCellSelector)
      .pressKey('right')
      .pressKey('right')
      .pressKey('left');

    await takeScreenshot(
      `offset_keyboard_week-all-day_offset-${offset}.png`,
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
