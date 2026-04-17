import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, getContainerUrl, setupTestPage, Scheduler } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const resources = [{
  fieldExpr: 'priorityId',
  allowMultiple: false,
  dataSource: [
    { text: 'Low', id: 1, color: '#1e90ff' },
    { text: 'High', id: 2, color: '#ff9747' },
  ],
  label: 'Priority',
}];

const views = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth'];

test.describe('Scheduler: Virtual Scrolling Layout', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Virtual scrolling layout in scheduler views', async ({ page }) => {
    for (const viewType of views) {
      await createWidget(page, 'dxScheduler', {
        height: 600,
        width: 800,
        currentDate: new Date(2021, 0, 1),
        scrolling: { mode: 'virtual' },
        currentView: viewType,
        views: [{ type: viewType }],
        dataSource: [],
      });

      const scheduler = new Scheduler(page);
      await expect(scheduler.workSpace).toBeVisible();
    }
  });

  test('Virtual scrolling layout in scheduler views when horizontal grouping is enabled', async ({ page }) => {
    for (const viewType of views) {
      await createWidget(page, 'dxScheduler', {
        height: 600,
        width: 800,
        currentDate: new Date(2021, 0, 1),
        scrolling: { mode: 'virtual' },
        currentView: viewType,
        views: [{ type: viewType, groupOrientation: 'horizontal' }],
        groups: ['priorityId'],
        resources,
        dataSource: [],
      });

      const scheduler = new Scheduler(page);
      await expect(scheduler.workSpace).toBeVisible();
    }
  });

  test('Virtual scrolling layout in scheduler views when grouping by date is enabled', async ({ page }) => {
    for (const viewType of views) {
      await createWidget(page, 'dxScheduler', {
        height: 600,
        width: 800,
        currentDate: new Date(2021, 0, 1),
        scrolling: { mode: 'virtual' },
        currentView: viewType,
        views: [{ type: viewType, groupByDate: true }],
        groups: ['priorityId'],
        resources,
        dataSource: [],
      });

      const scheduler = new Scheduler(page);
      await expect(scheduler.workSpace).toBeVisible();
    }
  });

  test('Header cells should be aligned with date-table cells in timeline-month when current date changes and virtual scrolling is used', async ({ page }) => {
    await createWidget(page, 'dxScheduler', {
      height: 600,
      width: 800,
      currentDate: new Date(2021, 0, 1),
      scrolling: { mode: 'virtual' },
      currentView: 'timelineMonth',
      views: ['timelineMonth'],
      dataSource: [],
    });

    const scheduler = new Scheduler(page);
    await scheduler.option('currentDate', new Date(2021, 1, 1).toISOString());

    await page.waitForTimeout(500);

    const headerScrollLeft = await scheduler.getHeaderSpaceScrollLeft();
    const workspaceScrollLeft = await scheduler.getWorkSpaceScrollLeft();

    expect(Math.abs(headerScrollLeft - workspaceScrollLeft)).toBeLessThan(2);
  });
});
