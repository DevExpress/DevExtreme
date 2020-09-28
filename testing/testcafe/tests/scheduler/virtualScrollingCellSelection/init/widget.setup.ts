import { ClientFunction } from 'testcafe';
import createWidget from '../../../../helpers/createWidget';

export const createScheduler = async (options = {}) => {
  createWidget('dxScheduler', {
    dataSource: [],
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2020, 8, 20),
    cellDuration: 60,
    height: 300,
    scrolling: { mode: 'virtual' },
    ...options,
  }, true);
};

export const selectCells = (table: any, firstCell: any, secondCell: any) => ClientFunction(() => {
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

export const moveMouse = (table: any, cell: any) => ClientFunction(() => {
  const $table = $(table());

  $($table).trigger($.Event('dxpointermove', { target: $(cell()).get(0), which: 1 }));
},
{
  dependencies: {
    cell, table,
  },
})();

export const scrollTo = ClientFunction((y) => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const scrollable = instance.getWorkSpaceScrollable();

  scrollable.scrollTo({ y });
});

export const checkSelectionWhenFocusedInViewport = async (
  t: any, scheduler: any, selectedCellsCount: number, bottomMostCellRowIndex: number,
  lastCellColumnIndex: number, lastCellRowIndex = 0,
) => {
  await t
    .expect(scheduler.dateTableCells.filter('.dx-state-focused').count)
    .eql(selectedCellsCount)
    .expect(scheduler.dateTableCells.filter('.dx-scheduler-focused-cell').count)
    .eql(1)
    .expect(scheduler.getDateTableCell(0, 0).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getDateTableCell(bottomMostCellRowIndex, 0).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex).hasClass('dx-scheduler-focused-cell'))
    .ok();
};

export const checkSelectionWhenFocusedIsNotInViewport = async (
  t: any, scheduler: any, selectedCellsCount: number, bottomMostCellRowIndex: number,
  lastCellColumnIndex: number, lastCellRowIndex = 0,
) => {
  await t
    .expect(scheduler.dateTableCells.filter('.dx-state-focused').count)
    .eql(selectedCellsCount)
    .expect(scheduler.dateTableCells.filter('.dx-scheduler-focused-cell').count)
    .eql(0)
    .expect(scheduler.getDateTableCell(0, 0).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex).hasClass('dx-state-focused'))
    .notOk()
    .expect(scheduler.getDateTableCell(bottomMostCellRowIndex, 0).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getDateTableCell(lastCellRowIndex, lastCellColumnIndex).hasClass('dx-scheduler-focused-cell'))
    .notOk();
};

export const checkAllDayCellsWhenInViewport = async (t: any, scheduler: any) => {
  await t
    .expect(scheduler.allDayTableCells.filter('.dx-state-focused').count)
    .eql(2)
    .expect(scheduler.getAllDayTableCell(0).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getAllDayTableCell(1).hasClass('dx-state-focused'))
    .ok()
    .expect(scheduler.getAllDayTableCell(1).hasClass('dx-scheduler-focused-cell'))
    .ok();
};
export const checkAllDayCellsWhenNotInViewport = async (t: any, scheduler: any) => {
  await t
    .expect(scheduler.allDayTableCells.filter('.dx-state-focused').count)
    .eql(0)
    .expect(scheduler.allDayTableCells.filter('.dx-scheduler-focused-cell').count)
    .eql(0);
};
