import { expect, test } from '../../../../fixtures';
import { dragToElement } from '../../../../helpers/dragUtils';
import Scheduler from '../../../../models/scheduler';
import {
  checkAllDayCellsWhenInViewport,
  checkAllDayCellsWhenNotInViewport,
  checkSelectionWhenFocusedInViewport,
  checkSelectionWhenFocusedIsNotInViewport,
  createScheduler,
  moveMouse,
  selectCells,
} from './init/widget.setup';

[true, false].forEach((showAllDayPanel) => {
  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel}`, async ({ page }) => {
    await createScheduler(page, { showAllDayPanel });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 13, 6, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);
  });

  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and horizontal grouping is used`, async ({ page }) => {
    await createScheduler(page, {
      showAllDayPanel,
      groups: ['resourceId0'],
      resources: [{
        fieldExpr: 'resourceId0',
        dataSource: [{ id: 0 }, { id: 1 }],
      }],
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 13, 6, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);
  });

  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and appointments are grouped by date`, async ({ page }) => {
    await createScheduler(page, {
      showAllDayPanel,
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

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 13, 6, 2);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
    await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 2);
  });

  test(`Selected cells shouldn't disapppear on scroll when showAllDayPanel is equal to ${showAllDayPanel} and appointments are grouped vertically`, async ({ page }) => {
    await createScheduler(page, {
      showAllDayPanel,
      groups: ['resourceId0'],
      views: [{
        type: 'week',
        groupOrientation: 'vertical',
      }],
    });

    const scheduler = new Scheduler(page, '#container');

    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    const indexDifference = showAllDayPanel ? 1 : 0;

    await checkSelectionWhenFocusedInViewport(scheduler, 11 - indexDifference, 6, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 1100 });
    await checkSelectionWhenFocusedIsNotInViewport(scheduler, 0, 2 + indexDifference, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
    await checkSelectionWhenFocusedInViewport(
      scheduler,
      11 - indexDifference,
      6 - indexDifference,
      1,
    );
  });
});

test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when horizontal grouping is used', async ({ page }) => {
  await createScheduler(page, {
    showAllDayPanel: true,
    groups: ['resourceId0'],
  });

  const scheduler = new Scheduler(page, '#container');

  await dragToElement(page, scheduler.getAllDayTableCell(0), scheduler.getAllDayTableCell(1));

  await checkAllDayCellsWhenInViewport(scheduler);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });
  await checkAllDayCellsWhenInViewport(scheduler);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
  await checkAllDayCellsWhenInViewport(scheduler);
});

test('All-day panel\'s selected cells shouldn\'t disapppear on scroll when vertical grouping is used', async ({ page }) => {
  await createScheduler(page, {
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

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });
  await checkAllDayCellsWhenNotInViewport(scheduler);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
  await checkAllDayCellsWhenInViewport(scheduler);
});

test('Selection should work correctly while scrolling', async ({ page }) => {
  await createScheduler(page, { groups: ['resourceId0'] });

  const scheduler = new Scheduler(page, '#container');

  await selectCells(
    page,
    scheduler.dateTable,
    scheduler.getDateTableCell(0, 0),
    scheduler.getDateTableCell(0, 1),
  );

  await checkSelectionWhenFocusedInViewport(scheduler, 11, 6, 1);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });

  await moveMouse(page, scheduler.dateTable, scheduler.getDateTableCell(4, 1));
  await checkSelectionWhenFocusedInViewport(scheduler, 18, 6, 1, 4);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
  await checkSelectionWhenFocusedIsNotInViewport(scheduler, 20, 6, 6);
});

test('Selection should work correctly while scrolling when appointments are grouped vertically', async ({ page }) => {
  await createScheduler(page, {
    groups: ['resourceId0'],
    views: [{
      type: 'week',
      groupOrientation: 'vertical',
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await selectCells(
    page,
    scheduler.dateTable,
    scheduler.getDateTableCell(0, 0),
    scheduler.getDateTableCell(0, 1),
  );

  await checkSelectionWhenFocusedInViewport(scheduler, 10, 5, 1);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });

  await moveMouse(page, scheduler.dateTable, scheduler.getDateTableCell(4, 1));
  await checkSelectionWhenFocusedInViewport(scheduler, 18, 6, 1, 4);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
  await checkSelectionWhenFocusedIsNotInViewport(scheduler, 18, 5, 5);
});

test('Selection should work in month view', async ({ page }) => {
  await createScheduler(page, {
    views: [{
      type: 'month',
      intervalCount: 30,
    }],
    currentView: 'month',
  });

  const scheduler = new Scheduler(page, '#container');

  await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

  await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 1500 });
  await expect(scheduler.getSelectedCells()).toHaveCount(0);

  await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
  await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);
});

test('Selection should work in timeline views', async ({ page }) => {
  await createScheduler(page, {
    views: ['timelineDay', 'timelineWeek', 'timelineMonth'],
    currentView: 'timelineDay',
    startDayHour: 0,
    endDayHour: 2,
    height: 250,
    groups: ['resourceId0'],
    crossScrollingEnabled: true,
    resources: [{
      fieldExpr: 'resourceId0',
      dataSource: [
        { id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 },
        { id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }, { id: 9 },
      ],
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  const checkSelection = async (): Promise<void> => {
    await dragToElement(page, scheduler.getDateTableCell(0, 0), scheduler.getDateTableCell(0, 1));

    await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 500 });
    await expect(scheduler.getSelectedCells()).toHaveCount(0);

    await scheduler.scrollWorkSpaceTo({ left: 0, top: 0 });
    await checkSelectionWhenFocusedInViewport(scheduler, 2, 0, 1);
  };

  await checkSelection();

  await scheduler.option('currentView', 'timelineWeek');
  await checkSelection();

  await scheduler.option('currentView', 'timelineMonth');
  await checkSelection();
});
