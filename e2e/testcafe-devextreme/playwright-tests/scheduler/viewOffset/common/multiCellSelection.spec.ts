import { test } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../tests/container.html')}`;

test.describe('Offset: Multi cell selection', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  [0, -120, 120].forEach((offset) => {
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
        test(`Multi cell selection (view: ${view}, offset: ${offset}, dir: ${dragOptions.direction}, rtl: ${rtlEnabled})`, async ({ page }) => {
          await createWidget(page, 'dxScheduler', {
            currentDate: '2023-09-07',
            height: 800,
            dataSource: [],
            currentView: view,
            offset,
            rtlEnabled,
          });

          const { direction, from: [fromRow, fromCell], to: [toRow, toCell] } = dragOptions;
          const firstCellLocator = page.locator('.dx-scheduler-date-table-row').nth(fromRow)
            .locator('.dx-scheduler-date-table-cell').nth(fromCell);
          const secondCellLocator = page.locator('.dx-scheduler-date-table-row').nth(toRow)
            .locator('.dx-scheduler-date-table-cell').nth(toCell);

          await firstCellLocator.dragTo(secondCellLocator);

          const workSpace = page.locator('.dx-scheduler-work-space');
          await testScreenshot(
            page,
            `offset_multi-cell-select_${view}_offset-${offset}_${direction}${rtlEnabled ? '_rtl' : ''}.png`,
            { element: workSpace },
          );
        });
      });

      test(`Multi cell selection in all-day panel (view: week, offset: ${offset}, rtl: ${rtlEnabled})`, async ({ page }) => {
        await createWidget(page, 'dxScheduler', {
          currentDate: '2023-09-07',
          height: 800,
          dataSource: [],
          currentView: 'week',
          offset,
        });

        const firstCellLocator = page.locator('.dx-scheduler-all-day-table-cell').nth(0);
        const secondCellLocator = page.locator('.dx-scheduler-all-day-table-cell').nth(3);

        await firstCellLocator.dragTo(secondCellLocator);

        const workSpace = page.locator('.dx-scheduler-work-space');
        await testScreenshot(
          page,
          `offset_multi-cell-select_week-all-day_offset-${offset}${rtlEnabled ? '_rtl' : ''}.png`,
          { element: workSpace },
        );
      });
    });
  });
});
