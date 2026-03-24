import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage } from '../../../playwright-helpers';

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

  // TODO: needs Scheduler page object (t.dragToElement for cell selection)
  test.skip('Vertical selection between two workspace cells should focus cells between them (T804954)', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: [{ name: '2 Days', type: 'day', intervalCount: 2 }],
      currentDate: new Date(2015, 1, 9),
      currentView: 'day',
      dataSource: [],
      startDayHour: 9,
      height: 600,
    });
  });

  // TODO: needs Scheduler page object (t.dragToElement for cell selection)
  test.skip('Horizontal selection between two workspace cells should focus cells between them', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      views: ['month'],
      currentView: 'month',
      currentDate: new Date(2019, 4, 1),
      height: 250,
      dataSource: [],
    });
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

  // TODO: needs Scheduler page object (CLASS.hoverCell, CLASS.activeCell, t.dispatchEvent)
  test.skip('Check cell hover state', async ({ page }) => {
    // Uses TestCafe CLASS constants and t.dispatchEvent
  });

  // TODO: needs Scheduler page object (CLASS.hoverCell, CLASS.activeCell, t.dispatchEvent)
  test.skip('Check cell active state', async ({ page }) => {
    // Uses TestCafe CLASS constants and t.dispatchEvent
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

  // TODO: needs Scheduler page object (button.element, #otherContainer scheduler)
  test.skip('Scheduler appointments should change color on update resources', async ({ page }) => {
    // Uses two widgets on different containers and button click
  });
});
