import { ClientFunction } from 'testcafe';
import createWidget from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';
import Scheduler from '../../model/scheduler';

fixture`Scheduler: Cells Selection in Virtual Scrolling`
  .page(url(__dirname, '../container.html'));

const scheduler = new Scheduler('#container');

const createScheduler = async (options = {}) => {
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

const selectCells = (table: any, firstCell: any, secondCell: any) => ClientFunction(() => {
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
const moveMouse = (table: any, cell: any) => ClientFunction(() => {
  const $table = $(table());

  $($table).trigger($.Event('dxpointermove', { target: $(cell()).get(0), which: 1 }));
},
{
  dependencies: {
    cell, table,
  },
})();

const scrollTo = ClientFunction((y) => {
  const instance = ($('#container') as any).dxScheduler('instance');
  const scrollable = instance.getWorkSpaceScrollable();

  scrollable.scrollTo({ y });
});

const checkSelectionWhenFocusedInViewport = async (
  t, selectedCellsCount, bottomMostCellRowIndex, lastCellColumnIndex, lastCellRowIndex = 0,
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
const checkSelectionWhenFocusedIsNotInViewport = async (
  t, selectedCellsCount, bottomMostCellRowIndex, lastCellColumnIndex, lastCellRowIndex = 0,
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

const checkAllDayCellsWhenInViewport = async (t) => {
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
const checkAllDayCellsWhenNotInViewport = async (t) => {
  await t
    .expect(scheduler.allDayTableCells.filter('.dx-state-focused').count)
    .eql(0)
    .expect(scheduler.allDayTableCells.filter('.dx-scheduler-focused-cell').count)
    .eql(0);
};

[true, false].forEach((showAllDayPanel) => {
  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel}`, async (t) => {
    await t
      .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(t, 8, 6, 1);

    await scrollTo(500);
    await checkSelectionWhenFocusedIsNotInViewport(t, 9, 6, 1);

    await scrollTo(0);
    await checkSelectionWhenFocusedInViewport(t, 8, 6, 1);
  }).before(() => createScheduler({ showAllDayPanel }));

  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and horizontal grouping is used`, async (t) => {
    await t
      .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(t, 8, 6, 1);

    await scrollTo(500);
    await checkSelectionWhenFocusedIsNotInViewport(t, 9, 6, 1);

    await scrollTo(0);
    await checkSelectionWhenFocusedInViewport(t, 8, 6, 1);
  }).before(() => createScheduler({
    showAllDayPanel,
    groups: ['resourceId0'],
    resources: [{
      fieldExpr: 'resourceId0',
      dataSource: [{ id: 0 }, { id: 1 }],
    }],
  }));

  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and appointments are grouped by date`, async (t) => {
    await t
      .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 2));

    await checkSelectionWhenFocusedInViewport(t, 8, 6, 2);

    await scrollTo(500);
    await checkSelectionWhenFocusedIsNotInViewport(t, 9, 6, 2);

    await scrollTo(0);
    await checkSelectionWhenFocusedInViewport(t, 8, 6, 2);
  }).before(() => createScheduler({
    showAllDayPanel,
    groups: ['resourceId0'],
    resources: [{
      fieldExpr: 'resourceId0',
      dataSource: [{ id: 0 }, { id: 1 }],
    }],
    views: [{
      type: 'week',
      groupOrientation: 'horizontal',
      groupByDate: true,
    }],
  }));

  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and appointments are grouped vertically`, async (t) => {
    await t
      .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    const indexDifference = showAllDayPanel ? 1 : 0;
    await checkSelectionWhenFocusedInViewport(t, 8 - indexDifference, 6 - indexDifference, 1);

    await scrollTo(1100);
    await checkSelectionWhenFocusedIsNotInViewport(t, 4 + indexDifference, 2 + indexDifference, 1);

    await scrollTo(0);
    await checkSelectionWhenFocusedInViewport(t, 8 - indexDifference, 6 - indexDifference, 1);
  }).before(() => createScheduler({
    showAllDayPanel,
    groups: ['resourceId0'],
    resources: [{
      fieldExpr: 'resourceId0',
      dataSource: [{ id: 0 }, { id: 1 }],
    }],
    views: [{
      type: 'week',
      groupOrientation: 'vertical',
    }],
  }));
});

test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when horizontal grouping is used', async (t) => {
  await t
    .dragToElement(scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

  await checkAllDayCellsWhenInViewport(t);

  await scrollTo(500);
  await checkAllDayCellsWhenInViewport(t);

  await scrollTo(0);
  await checkAllDayCellsWhenInViewport(t);
}).before(() => createScheduler({
  showAllDayPanel: true,
  groups: ['resourceId0'],
  resources: [{
    fieldExpr: 'resourceId0',
    dataSource: [{ id: 0 }, { id: 1 }],
  }],
}));

test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when vertical grouping is used', async (t) => {
  await t
    .dragToElement(scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

  await checkAllDayCellsWhenInViewport(t);

  await scrollTo(500);
  await checkAllDayCellsWhenNotInViewport(t);

  await scrollTo(0);
  await checkAllDayCellsWhenInViewport(t);
}).before(() => createScheduler({
  showAllDayPanel: true,
  groups: ['resourceId0'],
  resources: [{
    fieldExpr: 'resourceId0',
    dataSource: [{ id: 0 }, { id: 1 }],
  }],
  views: [{
    type: 'week',
    groupOrientation: 'vertical',
  }],
}));

test('Selection should work correctly while scrolling', async (t) => {
  await selectCells(
    scheduler.dateTable,
    scheduler.getDateTableCell(0, 0),
    scheduler.getDateTableCell(0, 1),
  );

  await checkSelectionWhenFocusedInViewport(t, 8, 6, 1);

  await scrollTo(500);

  await moveMouse(scheduler.dateTable, scheduler.getDateTableCell(4, 1));
  await checkSelectionWhenFocusedInViewport(t, 14, 6, 1, 4);

  await scrollTo(0);
  await checkSelectionWhenFocusedIsNotInViewport(t, 14, 6, 6);
}).before(() => createScheduler({
  groups: ['resourceId0'],
  resources: [{
    fieldExpr: 'resourceId0',
    dataSource: [{ id: 0 }, { id: 1 }],
  }],
}));

test('Selection should work correctly while scrolling when appointments are grouped vertically', async (t) => {
  await selectCells(
    scheduler.dateTable,
    scheduler.getDateTableCell(0, 0),
    scheduler.getDateTableCell(0, 1),
  );

  await checkSelectionWhenFocusedInViewport(t, 7, 5, 1);

  await scrollTo(500);

  await moveMouse(scheduler.dateTable, scheduler.getDateTableCell(4, 1));
  await checkSelectionWhenFocusedInViewport(t, 14, 6, 1, 4);

  await scrollTo(0);
  await checkSelectionWhenFocusedIsNotInViewport(t, 12, 5, 5);
}).before(() => createScheduler({
  groups: ['resourceId0'],
  resources: [{
    fieldExpr: 'resourceId0',
    dataSource: [{ id: 0 }, { id: 1 }],
  }],
  views: [{
    type: 'week',
    groupOrientation: 'vertical',
  }],
}));
