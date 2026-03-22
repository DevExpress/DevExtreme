import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Scheduler: Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

);

const FIXED_PARENT_CONTAINER_SIZE = `
#parentContainer {
  width: 400px;
  height: 500px;
}

#container {
  height: 100%;
}
`;

const createScheduler = async (options = {}): Promise<void> => {
  await createWidget(page, 'dxScheduler', extend(options, {
    dataSource: [],
    startDayHour: 9,
    height: 600,
  }));
};

const getResourcesDataSource = (count: number) => new Array(count)
  .fill(null)
  .map((_, idx) => ({
    id: idx,
    name: idx.toString(),
  }));

test('Vertical selection between two workspace cells should focus cells between them (T804954)', async ({ page }) => {
  // Scheduler on '#container'

  await t
    .dragToElement(page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0), page.locator('.dx-scheduler-date-table-row').nth(3).locator('.dx-scheduler-date-table-cell').nth(0))
    .expect(page.locator('.dx-scheduler-date-table-cell').filter('.dx-state-focused').count).toBe(4);
}).before(async () => createScheduler({
  views: [{ name: '2 Days', type: 'day', intervalCount: 2 }],
  currentDate: new Date(2015, 1, 9),
  currentView: 'day',
}));

test('Horizontal selection between two workspace cells should focus cells between them', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    views: ['month'],
    currentView: 'month',
    currentDate: new Date(2019, 4, 1),
    height: 250,
  // --- test ---
// Scheduler on '#container'

  await t
    .dragToElement(page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0), page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(3))
    .expect(page.locator('.dx-scheduler-date-table-cell').filter('.dx-state-focused').count)
    .eql(4);
}).before(async () => createScheduler({
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
}));

test('Vertical grouping should work correctly when there is one group', async ({ page }) => {
  // --- setup ---
  await {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      currentView: viewName,
      currentDate: '2024-01-01T00:00:00',
      crossScrollingEnabled: true,
      height: 300,
    };
  // --- test ---
// Scheduler on '#container'

  expect(page.locator('.dx-scheduler-date-table-cell').count)
    .eql(336);
}).before(async () => createWidget(page, 'dxScheduler', {
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
}));

async function hideShow(page: Page, container) {
  await page.evaluate((container) => {
  const instance = ($(container) as any).dxScheduler('instance');
  instance.option('visible', !instance.option('visible'));
}, container);
}

async function resize(page: Page, container) {
  await page.evaluate((container) => {
  const instance = ($(container) as any).dxScheduler('instance');
  // eslint-disable-next-line no-underscore-dangle
  instance._dimensionChanged();
  // eslint-disable-next-line no-underscore-dangle
  instance._workSpace._dimensionChanged();
}, container);
}

test('Hidden scheduler should not resize', async ({ page }) => {
    await hideShow('#container');
  await resize('#container');
  await hideShow('#container');

  await testScreenshot(page, 'scheduler-after-hiding-and-resizing.png');

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget(page, 'dxScheduler', {
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
}));

test('All day panel should be hidden when allDayPanelMode=hidden by initializing scheduler', async ({ page }) => {
  // Scheduler on '#container'

  expect(page.locator('.dx-scheduler-all-day-title').exists)
    .eql(false);

  expect(page.locator('.dx-scheduler-all-day-table-row').exists)
    .eql(false);
}).before(async () => createWidget(page, 'dxScheduler', {
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
}));

// visual: generic.light
// visual: fluent.blue.light
// visual: material.blue.light
test('Month workspace should be scrollable to the last row (T1203250)', async ({ page }) => {
  // Scheduler on '#container'
    await page.evaluate((d) => $('#container').dxScheduler('instance').scrollTo(new Date(d)), (new Date(2019, 5, 8, 0, 0).toISOString()));

  await testScreenshot(page, 'scrollable-month-workspace.png', { element: page.locator('.dx-scheduler-work-space') });

  expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
});

// visual: generic.light
// visual: generic.dark
// visual: fluent.blue.light
// visual: fluent.blue.dark
// visual: fluent.saas.light
// visual: fluent.saas.dark
// visual: material.blue.light
// visual: material.blue.dark
test('Check cell hover state', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2019, 4, 1),
    height: 500,
  // --- test ---
// arrange
  // Scheduler on '#container'
    const firstDateTableCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  // act
  await (firstDateTableCell).hover()
    .expect(firstDateTableCell.hasClass(CLASS.hoverCell))
    .ok();

  // assert
  await testScreenshot(page, 'scheduler-week-cell-hover-state.png', { element: page.locator('.dx-scheduler-work-space') });

  await (page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1).hover())
    .expect(page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1).hasClass(CLASS.hoverCell))
    .ok()
    ;
});
});

test('Check cell active state', async ({ page }) => {
  // --- setup ---
await createWidget(page, 'dxScheduler', {
    views: ['week'],
    currentView: 'week',
    currentDate: new Date(2019, 4, 1),
    height: 500,
  // --- test ---
// arrange
  // Scheduler on '#container'
    const firstDateTableCell = page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(0);

  // act
  await (firstDateTableCell).hover()
    .expect(firstDateTableCell.hasClass(CLASS.hoverCell))
    .ok()
    .dispatchEvent(firstDateTableCell, 'mousedown')
    .expect(firstDateTableCell.hasClass(CLASS.activeCell))
    .ok();

  // assert
  await testScreenshot(page, 'scheduler-week-cell-active-state.png', { element: page.locator('.dx-scheduler-work-space') });

  await t
    .dispatchEvent(firstDateTableCell, 'mouseup')
    .expect(firstDateTableCell.hasClass(CLASS.activeCell))
    .notOk()
    .hover(page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1))
    .expect(page.locator('.dx-scheduler-date-table-row').nth(0).locator('.dx-scheduler-date-table-cell').nth(1).hasClass(CLASS.hoverCell))
    .ok()
    ;
});
});

[
  'day',
  'week',
  'workWeek',
  'month',
].forEach((viewName) => {
  test(`[T1225772]: should not have the horizontal scroll in horizontal views when the crossScrollingEnabled: true (view:${viewName})`, async ({ page }) => {
    // Scheduler on '#container'

    const scrollableContainer = page.locator('.dx-scheduler-date-table')ScrollableContainer;
    const scrollWidth = await scrollableContainer.scrollWidth;
    const clientWidth = await scrollableContainer.clientWidth;
    const hasHorizontalScroll = scrollWidth > clientWidth;

    expect(hasHorizontalScroll).toBeFalsy(/* workspace has the horizontal scrollbar */);
});
  });
});

// NOTE: Moved "as is" from the QUnit integration.resources.tests (see history)
test('[T716993]: should has horizontal scrollbar with multiple resources and fixed height container', async ({ page }) => {
  // --- setup ---
const resourcesDataSource = getResourcesDataSource(10);

  await insertStylesheetRulesToPage(FIXED_PARENT_CONTAINER_SIZE);
  return createWidget(page, 'dxScheduler', {
    dataSource: [],
    groups: ['id'],
    resources: [{
      dataSource: resourcesDataSource,
      displayExpr: 'name',
      valueExpr: 'id',
      fieldExpr: 'id',
      allowMultiple: false,
    }],
    crossScrollingEnabled: true,
  // --- test ---
// Scheduler on '#container'

  const scrollableContainer = page.locator('.dx-scheduler-date-table')ScrollableContainer;
  const scrollWidth = await scrollableContainer.scrollWidth;
  const clientWidth = await scrollableContainer.clientWidth;
  const hasHorizontalScroll = scrollWidth > clientWidth;

  expect(hasHorizontalScroll).ok('workspace hasn\'t the horizontal scrollbar');
});
});

test('Scheduler appointments should change color on update resources', async ({ page }) => {
  // --- setup ---
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
  // --- test ---
// Button on '#container'
  // Scheduler on '#otherContainer'
    await (button.element).click();

  await testScreenshot(page, 'scheduler-appointments-should-update-color.png', { element: page.locator('.dx-scheduler-work-space') });
  expect(compareResults.isValid()).ok(compareResults.errorMessages());
});
});
