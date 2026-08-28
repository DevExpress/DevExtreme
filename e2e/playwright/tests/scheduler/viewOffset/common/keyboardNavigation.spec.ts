import { test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/screenshots';
import Scheduler from '../../../../models/scheduler';

const SCHEDULER_SELECTOR = '#container';

const KEYBOARD_ACTIONS = {
  day: ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp'],
  week: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowUp', 'ArrowUp'],
  month: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowUp', 'ArrowUp'],
  timelineDay: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
  timelineMonth: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
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
    test(`Keyboard navigation should work (view: ${view}, offset: ${offset})`, async ({ page }) => {
      await createWidget(page, 'dxScheduler', {
        currentDate: '2023-09-07',
        height: 800,
        dataSource: [],
        currentView: view,
        offset,
      });

      const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

      const [rowIdx, cellIdx] = startCell;

      await scheduler.getDateTableCell(rowIdx, cellIdx).click();

      for (const key of keyboardKeys) {
        await page.keyboard.press(key);
      }

      await testScreenshot(
        page,
        `offset_keyboard_${view}_offset-${offset}.png`,
        { element: scheduler.workSpace },
      );
    });
  });

  test(`Keyboard navigation in the all-day panel should work (view: week, offset: ${offset})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      currentDate: '2023-09-07',
      height: 800,
      dataSource: [],
      currentView: 'week',
      offset,
    });

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await scheduler.getAllDayTableCell(1).click();
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowRight');
    await page.keyboard.press('ArrowLeft');

    await testScreenshot(
      page,
      `offset_keyboard_week-all-day_offset-${offset}.png`,
      { element: scheduler.workSpace },
    );
  });
});
