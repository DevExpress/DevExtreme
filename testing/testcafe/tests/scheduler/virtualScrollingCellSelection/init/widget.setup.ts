import { ClientFunction } from 'testcafe';
import createWidget from '../../../../helpers/createWidget';
import Scheduler, { CLASS } from '../../../../model/scheduler';

export const createScheduler = async (options = {}): Promise<void> => {
  createWidget('dxScheduler', {
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
  }, true);
};

export const selectCells = async (
  table: Selector, firstCell: Selector, secondCell: Selector,
): Promise<void> => ClientFunction(() => {
  const $table = $(table());

  $($table).trigger(
    $.Event('dxpointerdown', { target: $(firstCell()).get(0), which: 1, pointerType: 'mouse' }),
  );
  $($table).trigger($.Event('dxpointermove', { target: $(secondCell()).get(0), which: 1 }));
},
{
  dependencies: {
    firstCell, secondCell, table,
  },
})();

export const moveMouse = async (table: Selector, cell: Selector):
Promise<void> => ClientFunction(() => {
  const $table = $(table());

  $($table).trigger($.Event('dxpointermove', { target: $(cell()).get(0), which: 1 }));
},
{
  dependencies: {
    cell, table,
  },
})();

export const scrollTo = ClientFunction((x, y) => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const scrollable = instance.getWorkSpaceScrollable();

  scrollable.scrollTo({ y, x });
});

export const checkSelectionWhenFocusedInViewport = async (
  t: TestController, scheduler: Scheduler, selectedCellsCount: number,
  bottomMostCellRowIndex: number, lastCellColumnIndex: number, lastCellRowIndex = 0,
): Promise<void> => {
  await t
    .expect(scheduler.getSelectedCells().count)
    .eql(selectedCellsCount)
    .expect(scheduler.getFocusedCell().count)
    .eql(1)
    .expect(scheduler.getDateTableCell(0, 0).hasClass(CLASS.selectedCell))
    .ok()
    .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex)
      .hasClass(CLASS.selectedCell))
    .ok()
    .expect(scheduler.getDateTableCell(bottomMostCellRowIndex, 0).hasClass(CLASS.selectedCell))
    .ok()
    .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex)
      .hasClass(CLASS.focusedCell))
    .ok();
};

export const checkSelectionWhenFocusedIsNotInViewport = async (
  t: TestController, scheduler: Scheduler, selectedCellsCount: number, bottomMostCellRowIndex = 0,
  lastCellColumnIndex = 0, lastCellRowIndex = 0,
): Promise<void> => {
  await t
    .expect(scheduler.getSelectedCells().count)
    .eql(selectedCellsCount)
    .expect(scheduler.getFocusedCell().count)
    .eql(0);

  if (selectedCellsCount > 0) {
    await t
      .expect(scheduler.getDateTableCell(0, 0).hasClass(CLASS.selectedCell))
      .ok()
      .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex)
        .hasClass(CLASS.selectedCell))
      .notOk()
      .expect(scheduler.getDateTableCell(bottomMostCellRowIndex, 0).hasClass(CLASS.selectedCell))
      .ok()
      .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex)
        .hasClass(CLASS.focusedCell))
      .notOk();
  }
};

export const checkAllDayCellsWhenInViewport = async (
  t: TestController, scheduler: Scheduler,
): Promise<void> => {
  await t
    .expect(scheduler.getSelectedCells(true).count)
    .eql(2)
    .expect(scheduler.getAllDayTableCell(0).hasClass(CLASS.selectedCell))
    .ok()
    .expect(scheduler.getAllDayTableCell(1).hasClass(CLASS.selectedCell))
    .ok()
    .expect(scheduler.getAllDayTableCell(1).hasClass(CLASS.focusedCell))
    .ok();
};
export const checkAllDayCellsWhenNotInViewport = async (
  t: TestController, scheduler: Scheduler,
): Promise<void> => {
  await t
    .expect(scheduler.getSelectedCells(true).count)
    .eql(0)
    .expect(scheduler.getFocusedCell(true).count)
    .eql(0);
};
