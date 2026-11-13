import { expect, test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import {
  createScheduler,
  scrollTo,
  checkSelectionWhenFocusedInViewport,
  checkSelectionWhenFocusedIsNotInViewport,
  checkAllDayCellsWhenInViewport,
  checkAllDayCellsWhenNotInViewport,
} from './init/widget.setup';

const baseConfig = {
  scrolling: { mode: 'virtual', orientation: 'both' },
  views: [{
    type: 'week',
    intervalCount: 3,
  }],
  currentView: 'week',
};

test.describe('Scheduler: Cells Selection in Virtual Scrolling', () => {
  test('Selected cells shouldn\'t disapppear on scroll', async ({ page }) => {
    await createScheduler(page, {
      ...baseConfig,
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);

    await scrollTo(page, 1000, 0);
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 0);

    await scrollTo(page, 0, 0);
    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);
  });

  test('Selected cells shouldn\'t disapppear on scroll when horizontal grouping is used', async ({ page }) => {
    await createScheduler(page, {
      groups: ['resourceId0'],
      resources: [{
        fieldExpr: 'resourceId0',
        dataSource: [{ id: 0 }, { id: 1 }],
      }],
      ...baseConfig,
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);

    await scrollTo(page, 1000, 0);
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 0);

    await scrollTo(page, 0, 0);
    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);
  });

  test('Selected cells shouldn\'t disapppear on scroll when appointments are grouped by date', async ({ page }) => {
    await createScheduler(page, {
      ...baseConfig,
      groups: ['resourceId0'],
      views: [{
        type: 'week',
        groupOrientation: 'horizontal',
        groupByDate: true,
      }],
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 2));

    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 2);

    await scrollTo(page, 1000, 0);
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 0);

    await scrollTo(page, 0, 0);
    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 2);
  });

  test('Selected cells shouldn\'t disapppear on scroll when appointments are grouped vertically', async ({ page }) => {
    await createScheduler(page, {
      ...baseConfig,
      groups: ['resourceId0'],
      views: [{
        type: 'week',
        groupOrientation: 'vertical',
        intervalCount: 3,
      }],
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 10, 5, 1);

    await scrollTo(page, 1000, 0);
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 0);

    await scrollTo(page, 0, 0);
    await checkSelectionWhenFocusedInViewport(scheduler, 10, 5, 1);
  });

  test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when horizontal grouping is used', async ({ page }) => {
    await createScheduler(page, {
      ...baseConfig,
      showAllDayPanel: true,
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

    await checkAllDayCellsWhenInViewport(scheduler);

    await scrollTo(page, 1000, 0);
    await checkAllDayCellsWhenNotInViewport(scheduler);

    await scrollTo(page, 0, 0);
    await checkAllDayCellsWhenInViewport(scheduler);
  });

  test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when vertical grouping is used', async ({ page }) => {
    await createScheduler(page, {
      ...baseConfig,
      showAllDayPanel: true,
      groups: ['resourceId0'],
      views: [{
        type: 'week',
        groupOrientation: 'vertical',
      }],
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

    await checkAllDayCellsWhenInViewport(scheduler);

    await scrollTo(page, 0, 500);
    await checkAllDayCellsWhenNotInViewport(scheduler);

    await scrollTo(page, 0, 0);
    await checkAllDayCellsWhenInViewport(scheduler);
  });

  test('Selection should work in month view', async ({ page }) => {
    await createScheduler(page, {
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
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);

    await scrollTo(page, 1000, 0);
    await expect(scheduler.getSelectedCells()).toHaveCount(0);

    await scrollTo(page, 0, 0);
    await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);
  });

  test('Selection should work in timeline views', async ({ page }) => {
    await createScheduler(page, {
      ...baseConfig,
      views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
      currentView: 'timelineDay',
      height: 250,
    });

    const scheduler = new Scheduler(page, '#container');

    const checkSelection = async (): Promise<void> => {
      await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

      await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);

      await scrollTo(page, 1500, 0);
      await expect(scheduler.getSelectedCells()).toHaveCount(0);

      await scrollTo(page, 0, 0);
      await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);
    };

    await checkSelection();

    await scheduler.option('currentView', 'timelineWeek');
    await checkSelection();

    await scheduler.option('currentView', 'timelineMonth');
    await checkSelection();
  });
});
