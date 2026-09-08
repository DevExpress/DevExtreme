import type { Locator, Page } from '@playwright/test';
import { expect } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import type Scheduler from '../../../../../models/scheduler';
import { CLASS } from '../../../../../models/scheduler';

// "toHaveClass" matches the whole class attribute, so each class is bounded by its own word edges:
// "dx-state-focused" must not be answered by "dx-scheduler-focused-cell".
const classRegExp = (className: string): RegExp => new RegExp(`(^|\\s)${className}(\\s|$)`);

const SELECTED = classRegExp(CLASS.selectedCell);
const FOCUSED = classRegExp(CLASS.focusedCell);

export const createScheduler = async (page: Page, options = {}): Promise<void> => {
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

// The pointer events are dispatched through jQuery, as the TestCafe client functions did: the
// selection is driven by the widget's own "dxpointer*" events, not by real mouse input.
export const selectCells = async (
  page: Page,
  table: Locator,
  firstCell: Locator,
  secondCell: Locator,
): Promise<void> => {
  const [tableHandle, firstHandle, secondHandle] = await Promise.all([
    table.elementHandle(),
    firstCell.elementHandle(),
    secondCell.elementHandle(),
  ]);

  await page.evaluate(({ tableElement, firstElement, secondElement }) => {
    const $table = $(tableElement as Element);

    $table.trigger($.Event('dxpointerdown', { target: firstElement, which: 1, pointerType: 'mouse' }));
    $table.trigger($.Event('dxpointermove', { target: secondElement, which: 1 }));
  }, { tableElement: tableHandle, firstElement: firstHandle, secondElement: secondHandle });
};

export const moveMouse = async (
  page: Page,
  table: Locator,
  cell: Locator,
): Promise<void> => {
  const [tableHandle, cellHandle] = await Promise.all([
    table.elementHandle(),
    cell.elementHandle(),
  ]);

  await page.evaluate(({ tableElement, cellElement }) => {
    const $table = $(tableElement as Element);

    $table.trigger($.Event('dxpointermove', { target: cellElement, which: 1 }));
  }, { tableElement: tableHandle, cellElement: cellHandle });
};

export const checkSelectionWhenFocusedInViewport = async (
  scheduler: Scheduler,
  selectedCellsCount: number,
  bottomMostCellRowIndex: number,
  lastCellColumnIndex: number,
  lastCellRowIndex = 0,
): Promise<void> => {
  const lastCell = scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex);

  await expect(scheduler.getSelectedCells()).toHaveCount(selectedCellsCount);
  await expect(scheduler.getFocusedCell()).toHaveCount(1);
  await expect(scheduler.getDateTableCell(0, 0)).toHaveClass(SELECTED);
  await expect(lastCell).toHaveClass(SELECTED);
  await expect(scheduler.getDateTableCell(bottomMostCellRowIndex, 0)).toHaveClass(SELECTED);
  await expect(lastCell).toHaveClass(FOCUSED);
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
    const lastCell = scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex);

    await expect(scheduler.getDateTableCell(0, 0)).toHaveClass(SELECTED);
    await expect(lastCell).not.toHaveClass(SELECTED);
    await expect(scheduler.getDateTableCell(bottomMostCellRowIndex, 0)).toHaveClass(SELECTED);
    await expect(lastCell).not.toHaveClass(FOCUSED);
  }
};

export const checkAllDayCellsWhenInViewport = async (scheduler: Scheduler): Promise<void> => {
  await expect(scheduler.getSelectedCells(true)).toHaveCount(2);
  await expect(scheduler.getAllDayTableCell(0)).toHaveClass(SELECTED);
  await expect(scheduler.getAllDayTableCell(1)).toHaveClass(SELECTED);
  await expect(scheduler.getAllDayTableCell(1)).toHaveClass(FOCUSED);
};

export const checkAllDayCellsWhenNotInViewport = async (scheduler: Scheduler): Promise<void> => {
  await expect(scheduler.getSelectedCells(true)).toHaveCount(0);
  await expect(scheduler.getFocusedCell(true)).toHaveCount(0);
};
