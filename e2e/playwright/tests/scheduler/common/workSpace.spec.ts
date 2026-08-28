import type { Page } from '@playwright/test';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { dragToElement } from '../../../helpers/dragUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Button from '../../../models/button';
import Scheduler, { CLASS } from '../../../models/scheduler';

const FIXED_PARENT_CONTAINER_SIZE = `
#parentContainer {
  width: 400px;
  height: 500px;
}

#container {
  height: 100%;
}
`;

const createScheduler = async (page: Page, options = {}): Promise<void> => createWidget(page, 'dxScheduler', {
  dataSource: [],
  startDayHour: 9,
  height: 600,
  ...options,
});

const getResourcesDataSource = (count: number): object[] => new Array(count)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    name: idx.toString(),
  }));

const hasHorizontalScroll = async (page: Page, selector: string): Promise<boolean> => page.evaluate(
  (elementSelector) => {
    const element = document.querySelector(elementSelector);

    return !!element && element.scrollWidth > element.clientWidth;
  },
  selector,
);

test('Vertical selection between two workspace cells should focus cells between them (T804954)', async ({ page }) => {
  await createScheduler(page, {
    views: [{ name: '2 Days', type: 'day', intervalCount: 2 }],
    currentDate: new Date(2015, 1, 9),
    currentView: 'day',
  });

  const scheduler = new Scheduler(page, '#container');

  await dragToElement(
    page,
    scheduler.getDateTableCell(0, 0),
    scheduler.getDateTableCell(3, 0),
  );

  await expect(scheduler.element.locator('.dx-scheduler-date-table-cell.dx-state-focused'))
    .toHaveCount(4);
});

test('Horizontal selection between two workspace cells should focus cells between them', async ({ page }) => {
  await createScheduler(page, {
    views: ['timelineWeek'],
    currentDate: new Date(2015, 1, 9),
    currentView: 'timelineWeek',
    groups: ['roomId'],
    resources: [{
      fieldExpr: 'roomId',
      label: 'Room',
      dataSource: [{
        text: '1', id: 1,
      }, {
        text: '2', id: 2,
      }],
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await dragToElement(
    page,
    scheduler.getDateTableCell(0, 0),
    scheduler.getDateTableCell(0, 3),
  );

  await expect(scheduler.element.locator('.dx-scheduler-date-table-cell.dx-state-focused'))
    .toHaveCount(4);
});

test('Vertical grouping should work correctly when there is one group', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: [{
      type: 'week',
      groupOrientation: 'vertical',
    }],
    currentView: 'week',
    dataSource: [],
    groups: ['priorityId'],
    resources: [{
      field: 'priorityId',
      dataSource: [{ id: 1, color: 'black' }],
    }],
    height: 600,
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.dateTableCells).toHaveCount(336);
});

test('Hidden scheduler should not resize', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    dataSource: [
      {
        text: 'Google AdWords Strategy',
        ownerId: [2],
        startDate: new Date('2021-02-01T16:00:00.000Z'),
        endDate: new Date('2021-02-01T17:30:00.000Z'),
        priority: 1,
      },
    ],
    resources: [
      {
        fieldExpr: 'priority',
        dataSource: [
          {
            text: 'Priority 1',
            id: 1,
            color: '#1e90ff',
          },
        ],
        label: 'Priority',
      },
    ],
    groups: ['priority'],
    views: [
      {
        type: 'timelineMonth',
        groupOrientation: 'vertical',
      },
    ],
    crossScrollingEnabled: true,
    currentView: 'timelineMonth',
    currentDate: new Date(2021, 1, 1),
    height: 400,
  });

  const toggleVisibility = async (): Promise<void> => page.evaluate(() => {
    const instance = ($('#container') as any).dxScheduler('instance');

    instance.option('visible', !instance.option('visible'));
  });

  await toggleVisibility();

  await page.evaluate(() => {
    const instance = ($('#container') as any).dxScheduler('instance');

    instance._dimensionChanged();
    instance._workSpace._dimensionChanged();
  });

  await toggleVisibility();

  await testScreenshot(page, 'scheduler-after-hiding-and-resizing.png');
});

test('All day panel should be hidden when allDayPanelMode=hidden by initializing scheduler', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    currentDate: new Date(2021, 2, 28),
    currentView: 'day',
    allDayPanelMode: 'hidden',
    dataSource: [{
      text: 'Book Flights to San Fran for Sales Trip',
      startDate: new Date('2021-03-28T17:00:00.000Z'),
      endDate: new Date('2021-03-28T18:00:00.000Z'),
      allDay: true,
    }, {
      text: 'Customer Workshop',
      startDate: new Date('2021-03-29T17:30:00.000Z'),
      endDate: new Date('2021-04-03T19:00:00.000Z'),
    }],
  });

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.allDayTitle).toHaveCount(0);
  await expect(scheduler.allDayRow).toHaveCount(0);
});

test('Month workspace should be scrollable to the last row (T1203250)', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2019, 4, 1),
    height: 250,
  });

  const scheduler = new Scheduler(page, '#container');

  await scheduler.scrollTo(new Date(2019, 5, 8, 0, 0));

  await testScreenshot(page, 'scrollable-month-workspace.png', { element: scheduler.workSpace });
});

test('Check cell hover state', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2019, 4, 1),
    height: 500,
  });

  const scheduler = new Scheduler(page, '#container');
  const firstDateTableCell = scheduler.getDateTableCell(0, 0);

  await firstDateTableCell.hover();

  await expect(firstDateTableCell).toHaveClass(new RegExp(CLASS.hoverCell));

  await testScreenshot(page, 'scheduler-week-cell-hover-state.png', { element: scheduler.workSpace });

  await scheduler.getDateTableCell(0, 1).hover();

  await expect(scheduler.getDateTableCell(0, 1)).toHaveClass(new RegExp(CLASS.hoverCell));
});

test('Check cell active state', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2019, 4, 1),
    height: 500,
  });

  const scheduler = new Scheduler(page, '#container');
  const firstDateTableCell = scheduler.getDateTableCell(0, 0);

  await firstDateTableCell.hover();

  await expect(firstDateTableCell).toHaveClass(new RegExp(CLASS.hoverCell));

  await firstDateTableCell.dispatchEvent('mousedown');

  await expect(firstDateTableCell).toHaveClass(new RegExp(CLASS.activeCell));

  await testScreenshot(page, 'scheduler-week-cell-active-state.png', { element: scheduler.workSpace });

  await firstDateTableCell.dispatchEvent('mouseup');

  await expect(firstDateTableCell).not.toHaveClass(new RegExp(CLASS.activeCell));

  await scheduler.getDateTableCell(0, 1).hover();

  await expect(scheduler.getDateTableCell(0, 1)).toHaveClass(new RegExp(CLASS.hoverCell));
});

[
  'day',
  'week',
  'workWeek',
  'month',
].forEach((viewName) => {
  test(`[T1225772]: should not have the horizontal scroll in horizontal views when the crossScrollingEnabled: true (view:${viewName})`, async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: viewName,
      currentDate: '2024-01-01T00:00:00',
      crossScrollingEnabled: true,
      height: 300,
    });

    expect(
      await hasHorizontalScroll(page, '#container .dx-scheduler-date-table-scrollable .dx-scrollable-container'),
      'workspace has the horizontal scrollbar',
    ).toBe(false);
  });
});

// NOTE: Moved "as is" from the QUnit integration.resources.tests (see history)
test('[T716993]: should has horizontal scrollbar with multiple resources and fixed height container', async ({ page }) => {
  await insertStylesheetRulesToPage(page, FIXED_PARENT_CONTAINER_SIZE);
  await createWidget(page, 'dxScheduler', {
    dataSource: [],
    groups: ['id'],
    resources: [{
      dataSource: getResourcesDataSource(10),
      displayExpr: 'name',
      valueExpr: 'id',
      fieldExpr: 'id',
      allowMultiple: false,
    }],
    crossScrollingEnabled: true,
  });

  expect(
    await hasHorizontalScroll(page, '#container .dx-scheduler-date-table-scrollable .dx-scrollable-container'),
    'workspace hasn\'t the horizontal scrollbar',
  ).toBe(true);
});

test('Scheduler appointments should change color on update resources', async ({ page }) => {
  await createWidget(page, 'dxScheduler', {
    timeZone: 'America/Los_Angeles',
    dataSource: [{
      text: 'Website Re-Design Plan',
      startDate: new Date('2021-03-29T16:30:00.000Z'),
      endDate: new Date('2021-03-29T18:30:00.000Z'),
      resource: 1,
    }],
    views: ['week', 'month'],
    currentView: 'week',
    currentDate: new Date(2021, 2, 28),
    startDayHour: 9,
    height: 730,
    resources: [{
      fieldExpr: 'resource',
      dataSource: [{ id: 1, text: 'res 1', color: 'red' }],
    }],
  }, '#otherContainer');

  await createWidget(page, 'dxButton', {
    text: 'Change resources',
    onClick() {
      const schedulerWidget = ($('#otherContainer') as any).dxScheduler('instance');

      schedulerWidget.option('resources', [{
        fieldExpr: 'resource',
        dataSource: [{ id: 1, text: 'new res 1', color: 'pink' }],
      }]);
      schedulerWidget.getDataSource().reload();
    },
  }, '#container');

  const button = new Button(page, '#container');
  const scheduler = new Scheduler(page, '#otherContainer');

  await button.element.click();

  await testScreenshot(page, 'scheduler-appointments-should-update-color.png', { element: scheduler.workSpace });
});
