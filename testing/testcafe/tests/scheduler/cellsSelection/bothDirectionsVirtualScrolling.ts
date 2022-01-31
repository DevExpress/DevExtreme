import url from '../../../helpers/getPageUrl';
import Scheduler from '../../../model/scheduler';
import {
  createScheduler,
  scrollTo,
  checkSelectionWhenFocusedInViewport,
  checkSelectionWhenFocusedIsNotInViewport,
  checkAllDayCellsWhenInViewport,
  checkAllDayCellsWhenNotInViewport,
} from './init/widget.setup';

fixture`Scheduler: Cells Selection in Virtual Scrolling`
  .page(url(__dirname, '../../container.html'));

const scheduler = new Scheduler('#container');

const baseConfig = {
  scrolling: { mode: 'virtual', orientation: 'both' },
  views: [{
    type: 'week',
    intervalCount: 3,
  }],
  currentView: 'week',
};

test('Selected cells shouldn\'t disapppear on scroll', async (t) => {
  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

  await checkSelectionWhenFocusedInViewport(t, scheduler, 8, 6, 1);

  await scrollTo(1000, 0);
  await checkSelectionWhenFocusedIsNotInViewport(t, scheduler, 0);

  await scrollTo(0, 0);
  await checkSelectionWhenFocusedInViewport(t, scheduler, 8, 6, 1);
}).before(async () => createScheduler({
  ...baseConfig,
}));

test('Selected cells shouldn\'t disapppear on scroll when horizontal grouping is used', async (t) => {
  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

  await checkSelectionWhenFocusedInViewport(t, scheduler, 8, 6, 1);

  await scrollTo(1000, 0);
  await checkSelectionWhenFocusedIsNotInViewport(t, scheduler, 0);

  await scrollTo(0, 0);
  await checkSelectionWhenFocusedInViewport(t, scheduler, 8, 6, 1);
}).before(async () => createScheduler({
  groups: ['resourceId0'],
  resources: [{
    fieldExpr: 'resourceId0',
    dataSource: [{ id: 0 }, { id: 1 }],
  }],
  ...baseConfig,
}));

test('Selected cells shouldn\'t disapppear on scroll when appointments are grouped by date', async (t) => {
  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 2));

  await checkSelectionWhenFocusedInViewport(t, scheduler, 8, 6, 2);

  await scrollTo(1000, 0);
  await checkSelectionWhenFocusedIsNotInViewport(t, scheduler, 0);

  await scrollTo(0, 0);
  await checkSelectionWhenFocusedInViewport(t, scheduler, 8, 6, 2);
}).before(async () => createScheduler({
  ...baseConfig,
  groups: ['resourceId0'],
  views: [{
    type: 'week',
    groupOrientation: 'horizontal',
    groupByDate: true,
  }],
}));

test('Selected cells shouldn\'t disapppear on scroll when appointments are grouped vertically', async (t) => {
  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

  await checkSelectionWhenFocusedInViewport(t, scheduler, 7, 5, 1);

  await scrollTo(1000, 0);
  await checkSelectionWhenFocusedIsNotInViewport(t, scheduler, 0);

  await scrollTo(0, 0);
  await checkSelectionWhenFocusedInViewport(t, scheduler, 7, 5, 1);
}).before(async () => createScheduler({
  ...baseConfig,
  groups: ['resourceId0'],
  views: [{
    type: 'week',
    groupOrientation: 'vertical',
    intervalCount: 3,
  }],
}));

test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when horizontal grouping is used', async (t) => {
  await t
    .dragToElement(scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

  await checkAllDayCellsWhenInViewport(t, scheduler);

  await scrollTo(1000, 0);
  await checkAllDayCellsWhenNotInViewport(t, scheduler);

  await scrollTo(0, 0);
  await checkAllDayCellsWhenInViewport(t, scheduler);
}).before(async () => createScheduler({
  ...baseConfig,
  showAllDayPanel: true,
}));

test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when vertical grouping is used', async (t) => {
  await t
    .dragToElement(scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

  await checkAllDayCellsWhenInViewport(t, scheduler);

  await scrollTo(0, 500);
  await checkAllDayCellsWhenNotInViewport(t, scheduler);

  await scrollTo(0, 0);
  await checkAllDayCellsWhenInViewport(t, scheduler);
}).before(async () => createScheduler({
  ...baseConfig,
  showAllDayPanel: true,
  groups: ['resourceId0'],
  views: [{
    type: 'week',
    groupOrientation: 'vertical',
  }],
}));

test('Selection should work in month view', async (t) => {
  await t
    .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

  await checkSelectionWhenFocusedInViewport(t, scheduler, 2, 0, 1);

  await scrollTo(1000, 0);
  await t
    .expect(scheduler.getSelectedCells().count)
    .eql(0);

  await scrollTo(0, 0);
  await checkSelectionWhenFocusedInViewport(t, scheduler, 2, 0, 1);
}).before(async () => createScheduler({
  ...baseConfig,
  views: [{
    type: 'month',
    groupOrientation: 'horizontal',
  }],
  currentView: 'month',
  groups: ['resourceId0'],
  resources: [{
    fieldExpr: 'resourceId0',
    dataSource: [
      { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 },
    ],
  }],
}));

test('Selection should work in timeline views', async (t) => {
  const checkSelection = async (): Promise<void> => {
    await t
      .dragToElement(scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(t, scheduler, 2, 0, 1);

    await scrollTo(1500, 0);
    await t
      .expect(scheduler.getSelectedCells().count)
      .eql(0);

    await scrollTo(0, 0);
    await checkSelectionWhenFocusedInViewport(t, scheduler, 2, 0, 1);
  };

  await checkSelection();

  await scheduler.option('currentView', 'timelineWeek');
  await checkSelection();

  await scheduler.option('currentView', 'timelineMonth');
  await checkSelection();
}).before(async () => createScheduler({
  ...baseConfig,
  views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
  currentView: 'timelineDay',
  height: 250,
}));
