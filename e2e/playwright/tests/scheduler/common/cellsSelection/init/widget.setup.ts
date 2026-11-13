import type { Locator, Page } from '@playwright/test';
import { expect } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { classMatcher } from '../../../../../models/internal/classMatcher';
import type Scheduler from '../../../../../models/scheduler';
import { CLASS } from '../../../../../models/scheduler';
import { scrollTo as scrollWorkSpaceTo } from '../../../helpers/utils';

// The date table re-renders on its scroll event and then scrolls the synchronized panels, whose
// scroll events arrive a frame later and scroll the date table back to their position.
export const scrollTo = async (page: Page, x: number, y: number): Promise<void> => {
  await scrollWorkSpaceTo(page, x, y);
  await page.evaluate(() => new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  }));
};

export const createScheduler = async (
  page: Page,
  options: Record<string, unknown> = {},
): Promise<void> => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2020, 8, 20),
    cellDuration: 60,
    height: 300,
    width: 400,
    scrolling: { mode: 'virtual' },
    resources: [{
      fieldExpr: 'resourceId0',
      dataSource: [{ id: 0 }, { id: 1 }],
    }],
    ...options,
  });
};

export const selectCells = async (
  table: Locator,
  firstCell: Locator,
  secondCell: Locator,
): Promise<void> => {
  const firstCellHandle = await firstCell.elementHandle();
  const secondCellHandle = await secondCell.elementHandle();

  await table.evaluate((tableElement, [first, second]) => {
    const $table = $(tableElement);

    $($table).trigger(
      $.Event('dxpointerdown', { target: first, which: 1, pointerType: 'mouse' }),
    );
    $($table).trigger($.Event('dxpointermove', { target: second, which: 1 }));
  }, [firstCellHandle, secondCellHandle]);
};

export const moveMouse = async (table: Locator, cell: Locator): Promise<void> => {
  const cellHandle = await cell.elementHandle();

  await table.evaluate((tableElement, target) => {
    const $table = $(tableElement);

    $($table).trigger($.Event('dxpointermove', { target, which: 1 }));
  }, cellHandle);
};

const expectSelected = async (cell: Locator, present = true): Promise<void> => {
  const assertion = expect(cell);

  await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.selectedCell));
};

const expectFocused = async (cell: Locator, present = true): Promise<void> => {
  const assertion = expect(cell);

  await (present ? assertion : assertion.not).toHaveClass(classMatcher(CLASS.focusedCell));
};

export const checkSelectionWhenFocusedInViewport = async (
  scheduler: Scheduler,
  selectedCellsCount: number,
  bottomMostCellRowIndex: number,
  lastCellColumnIndex: number,
  lastCellRowIndex = 0,
): Promise<void> => {
  await expect(scheduler.getSelectedCells()).toHaveCount(selectedCellsCount);
  await expect(scheduler.getFocusedCell()).toHaveCount(1);
  await expectSelected(scheduler.getDateTableCell(0, 0));
  await expectSelected(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex));
  await expectSelected(scheduler.getDateTableCell(bottomMostCellRowIndex, 0));
  await expectFocused(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex));
};

export const checkSelectionWhenFocusedIsNotInViewport = async (
  scheduler: Scheduler,
  selectedCellsCount: number,
  bottomMostCellRowIndex = 0,
  lastCellColumnIndex = 0,
  lastCellRowIndex = 0,
): Promise<void> => {
  await expect(scheduler.getSelectedCells()).toHaveCount(selectedCellsCount);
  await expect(scheduler.getFocusedCell()).toHaveCount(0);

  if (selectedCellsCount > 0) {
    await expectSelected(scheduler.getDateTableCell(0, 0));
    await expectSelected(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex), false);
    await expectSelected(scheduler.getDateTableCell(bottomMostCellRowIndex, 0));
    await expectFocused(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex), false);
  }
};

export const checkAllDayCellsWhenInViewport = async (scheduler: Scheduler): Promise<void> => {
  await expect(scheduler.getSelectedCells(true)).toHaveCount(2);
  await expectSelected(scheduler.getAllDayTableCell(0));
  await expectSelected(scheduler.getAllDayTableCell(1));
  await expectFocused(scheduler.getAllDayTableCell(1));
};

export const checkAllDayCellsWhenNotInViewport = async (scheduler: Scheduler): Promise<void> => {
  await expect(scheduler.getSelectedCells(true)).toHaveCount(0);
  await expect(scheduler.getFocusedCell(true)).toHaveCount(0);
};
