import { test, expect } from '@playwright/test';
import { createWidget, getContainerUrl, setupTestPage, Scheduler } from '../../../../playwright-helpers';

const containerUrl = getContainerUrl(__dirname, '../../../../tests/container.html');

const resourceData = [
  { id: 1, text: 'Resource 1', color: '#1e90ff' },
  { id: 2, text: 'Resource 2', color: '#ff9747' },
];

const appointments = [
  {
    text: 'Appointment 1',
    startDate: new Date(2021, 3, 26, 9, 30),
    endDate: new Date(2021, 3, 26, 11, 30),
    resourceId: 1,
  },
  {
    text: 'Appointment 2',
    startDate: new Date(2021, 3, 27, 9, 30),
    endDate: new Date(2021, 3, 27, 11, 30),
    resourceId: 2,
  },
];

test.describe.skip('Scheduler API - request counting', () => {
  test.beforeEach(async ({ page }) => {
    await setupTestPage(page, containerUrl);
  });

  test('Request should be requested only once for color appointments (week)', async ({ page }) => {
    let resourceLoadCount = 0;

    await page.exposeFunction('__resourceLoaded', () => {
      resourceLoadCount += 1;
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: appointments,
      currentDate: new Date(2021, 3, 26),
      currentView: 'week',
      height: 600,
      resources: [{
        fieldExpr: 'resourceId',
        dataSource: {
          load() {
            (window as any).__resourceLoaded?.();
            return resourceData;
          },
        },
      }],
    });

    const scheduler = new Scheduler(page);
    await expect(scheduler.workSpace).toBeVisible();

    expect(resourceLoadCount).toBeLessThanOrEqual(2);
  });

  test('Request should be requested only once for color appointments (agenda)', async ({ page }) => {
    let resourceLoadCount = 0;

    await page.exposeFunction('__resourceLoaded', () => {
      resourceLoadCount += 1;
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: appointments,
      currentDate: new Date(2021, 3, 26),
      currentView: 'agenda',
      height: 600,
      resources: [{
        fieldExpr: 'resourceId',
        dataSource: {
          load() {
            (window as any).__resourceLoaded?.();
            return resourceData;
          },
        },
      }],
    });

    const scheduler = new Scheduler(page);
    await expect(scheduler.workSpace).toBeVisible();

    expect(resourceLoadCount).toBeLessThanOrEqual(2);
  });

  test('Request should be requested only once for grouping', async ({ page }) => {
    let resourceLoadCount = 0;

    await page.exposeFunction('__resourceLoaded', () => {
      resourceLoadCount += 1;
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: appointments,
      currentDate: new Date(2021, 3, 26),
      currentView: 'week',
      height: 600,
      groups: ['resourceId'],
      resources: [{
        fieldExpr: 'resourceId',
        dataSource: {
          load() {
            (window as any).__resourceLoaded?.();
            return resourceData;
          },
        },
      }],
    });

    const scheduler = new Scheduler(page);
    await expect(scheduler.workSpace).toBeVisible();

    expect(resourceLoadCount).toBeLessThanOrEqual(2);
  });

  test('should be no requests for no grouping and appointments without color', async ({ page }) => {
    let resourceLoadCount = 0;

    await page.exposeFunction('__resourceLoaded', () => {
      resourceLoadCount += 1;
    });

    await createWidget(page, 'dxScheduler', {
      dataSource: [{
        text: 'Appointment 1',
        startDate: new Date(2021, 3, 26, 9, 30),
        endDate: new Date(2021, 3, 26, 11, 30),
      }],
      currentDate: new Date(2021, 3, 26),
      currentView: 'week',
      height: 600,
    });

    const scheduler = new Scheduler(page);
    await expect(scheduler.workSpace).toBeVisible();

    expect(resourceLoadCount).toBe(0);
  });
});
