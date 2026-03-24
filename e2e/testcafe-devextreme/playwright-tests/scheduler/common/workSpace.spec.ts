import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, Scheduler } from '../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../tests/container.html');

test.describe('Scheduler: Workspace', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  const FIXED_PARENT_CONTAINER_SIZE = `
#parentContainer {
  width: 400px;
  height: 500px;
}

#container {
  height: 100%;
}
`;

  const getResourcesDataSource = (count: number) => new Array(count)
    .fill(null)
    .map((_, idx) => ({
      id: idx,
      name: idx.toString(),
    }));

  test('Vertical selection between two workspace cells should focus cells between them (T804954)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{ name: '2 Days', type: 'day', intervalCount: 2 }],
      currentDate: new Date(2015, 1, 9),
      currentView: 'day',
      dataSource: [],
      startDayHour: 9,
      height: 600,
    });

    const scheduler = new Scheduler(page, '#container');
    const startCell = scheduler.getDateTableCell(0, 0);
    const endCell = scheduler.getDateTableCell(3, 0);

    await startCell.dragTo(endCell);
    const focusedCount = await scheduler.getSelectedCells().count();
    expect(focusedCount).toBe(4);
  });

  test('Horizontal selection between two workspace cells should focus cells between them', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['timelineWeek'],
      currentView: 'timelineWeek',
      currentDate: new Date(2015, 1, 9),
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
      dataSource: [],
      startDayHour: 9,
      height: 600,
    });

    const scheduler = new Scheduler(page, '#container');
    const startCell = scheduler.getDateTableCell(0, 0);
    const endCell = scheduler.getDateTableCell(0, 3);

    await startCell.dragTo(endCell);
    const focusedCount = await scheduler.getSelectedCells().count();
    expect(focusedCount).toBe(4);
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

    const cellCount = await page.locator('.dx-scheduler-date-table-cell').count();
    expect(cellCount).toBe(336);
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

    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.option('visible', false);
    });
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance._dimensionChanged();
      instance._workSpace._dimensionChanged();
    });
    await page.evaluate(() => {
      const instance = ($('#container') as any).dxScheduler('instance');
      instance.option('visible', true);
    });

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

    await expect(page.locator('.dx-scheduler-all-day-title')).not.toBeVisible();
    await expect(page.locator('.dx-scheduler-all-day-table-row')).not.toBeVisible();
  });

  test('Month workspace should be scrollable to the last row (T1203250)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      dataSource: [],
      startDayHour: 9,
      height: 600,
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2019, 5, 1),
    });

    await page.evaluate((d) => ($('#container') as any).dxScheduler('instance').scrollTo(new Date(d)), new Date(2019, 5, 8, 0, 0).toISOString());

    await testScreenshot(page, 'scrollable-month-workspace.png', { element: page.locator('.dx-scheduler-work-space') });
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
    await expect(firstDateTableCell).toHaveClass(/dx-state-hover/);

    await testScreenshot(page, 'scheduler-week-cell-hover-state.png', { element: scheduler.workSpace });

    await scheduler.getDateTableCell(0, 1).hover();
    await expect(scheduler.getDateTableCell(0, 1)).toHaveClass(/dx-state-hover/);
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
    await expect(firstDateTableCell).toHaveClass(/dx-state-hover/);

    await firstDateTableCell.dispatchEvent('mousedown');
    await expect(firstDateTableCell).toHaveClass(/dx-state-active/);

    await testScreenshot(page, 'scheduler-week-cell-active-state.png', { element: scheduler.workSpace });

    await firstDateTableCell.dispatchEvent('mouseup');
    await expect(firstDateTableCell).not.toHaveClass(/dx-state-active/);

    await scheduler.getDateTableCell(0, 1).hover();
    await expect(scheduler.getDateTableCell(0, 1)).toHaveClass(/dx-state-hover/);
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
        currentDate: new Date(2024, 0, 1),
        crossScrollingEnabled: true,
        height: 300,
      });

      const hasHorizontalScroll = await page.evaluate(() => {
        const container = document.querySelector('.dx-scheduler-date-table-scrollable .dx-scrollable-container') as HTMLElement;
        return container.scrollWidth > container.clientWidth;
      });

      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test('[T716993]: should has horizontal scrollbar with multiple resources and fixed height container', async ({ page }) => {
    const resourcesDataSource = getResourcesDataSource(10);

    await page.evaluate((css) => {
      const style = document.createElement('style');
      style.textContent = css;
      document.head.appendChild(style);
    }, FIXED_PARENT_CONTAINER_SIZE);

    await createWidget(page, 'dxScheduler', {
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
    });

    const hasHorizontalScroll = await page.evaluate(() => {
      const container = document.querySelector('.dx-scheduler-date-table-scrollable .dx-scrollable-container') as HTMLElement;
      return container.scrollWidth > container.clientWidth;
    });

    expect(hasHorizontalScroll).toBe(true);
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

    await page.locator('#container .dx-button').click();

    const otherScheduler = new Scheduler(page, '#otherContainer');
    await testScreenshot(page, 'scheduler-appointments-should-update-color.png', { element: otherScheduler.workSpace });
  });
});
