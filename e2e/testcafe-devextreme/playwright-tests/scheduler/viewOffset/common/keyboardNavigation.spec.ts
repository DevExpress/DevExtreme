import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

const KEYBOARD_ACTIONS: Record<string, string[]> = {
  day: ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowUp'],
  week: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowUp', 'ArrowUp'],
  month: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowLeft', 'ArrowUp', 'ArrowUp'],
  timelineDay: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
  timelineMonth: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowLeft'],
};

test.describe('Offset: Keyboard navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [0, -120, 120].forEach((offset) => {
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

        const [rowIdx, cellIdx] = startCell;
        const startCellLocator = page.locator('.dx-scheduler-date-table-row').nth(rowIdx)
          .locator('.dx-scheduler-date-table-cell').nth(cellIdx);

        await startCellLocator.click();
        for (const key of keyboardKeys) {
          await page.keyboard.press(key);
        }

        const workSpace = page.locator('.dx-scheduler-work-space');
        await testScreenshot(page, `offset_keyboard_${view}_offset-${offset}.png`, { element: workSpace });
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

      const startCellLocator = page.locator('.dx-scheduler-all-day-table-cell').nth(1);
      await startCellLocator.click();
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowLeft');

      const workSpace = page.locator('.dx-scheduler-work-space');
      await testScreenshot(page, `offset_keyboard_week-all-day_offset-${offset}.png`, { element: workSpace });
    });
  });
});
