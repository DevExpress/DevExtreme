import type { Page } from '@playwright/test';
import { expect, test } from '../../../../fixtures';
import { mockApi } from '../../../../helpers/apiMock';
import { createWidget } from '../../../../helpers/createWidget';
import Scheduler from '../../../../models/scheduler';
import { resourceApiMock } from '../../apiMocks/resourceApiMock';

const SCHEDULER_SELECTOR = '#container';
const RESOURCE_PATH = '/api/data';
// No event marks the end of the resource loading, so an extra request needs time to go out.
const REQUESTS_SETTLE_TIMEOUT = 300;

const logResourceRequests = (page: Page): { count: number } => {
  const requestLogger = { count: 0 };

  page.on('request', (request) => {
    if (request.method() !== 'OPTIONS' && request.url().includes(RESOURCE_PATH)) {
      requestLogger.count += 1;
    }
  });

  return requestLogger;
};

test.describe('Scheduler API - request counting', () => {
  test('Request should be requested only once for color appointments (week)', async ({ page }) => {
    const requestLogger = logResourceRequests(page);

    await mockApi(page, resourceApiMock);
    await createWidget(page, 'dxScheduler', () => ({
      currentDate: new Date(2015, 6, 10),
      views: ['week'],
      currentView: 'week',
      resources: [{
        field: 'ownerId',
        dataSource: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      }],
      dataSource: [{
        text: 'a',
        allDay: true,
        startDate: new Date(2015, 6, 10, 0),
        endDate: new Date(2015, 6, 10, 0, 30),
        ownerId: 1,
      }, {
        text: 'b',
        allDay: true,
        startDate: new Date(2015, 6, 10, 0),
        endDate: new Date(2015, 6, 10, 0, 30),
        ownerId: 2,
      }, {
        text: 'c',
        startDate: new Date(2015, 6, 10, 2),
        endDate: new Date(2015, 6, 10, 2, 30),
        ownerId: 1,
      }],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await expect(scheduler.workSpace).toBeAttached();
    await page.waitForTimeout(REQUESTS_SETTLE_TIMEOUT);

    const initialRequestCount = requestLogger.count;

    expect(initialRequestCount).toBe(1);
  });

  test('Request should be requested only once for color appointments (agenda)', async ({ page }) => {
    const requestLogger = logResourceRequests(page);

    await mockApi(page, resourceApiMock);
    await createWidget(page, 'dxScheduler', () => ({
      currentDate: new Date(2015, 6, 10),
      views: ['agenda'],
      currentView: 'agenda',
      resources: [{
        field: 'ownerId',
        dataSource: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      }],
      dataSource: [{
        text: 'a',
        allDay: true,
        startDate: new Date(2015, 6, 10, 0),
        endDate: new Date(2015, 6, 10, 0, 30),
        ownerId: 1,
      }, {
        text: 'b',
        allDay: true,
        startDate: new Date(2015, 6, 10, 0),
        endDate: new Date(2015, 6, 10, 0, 30),
        ownerId: 2,
      }, {
        text: 'c',
        startDate: new Date(2015, 6, 10, 2),
        endDate: new Date(2015, 6, 10, 2, 30),
        ownerId: 1,
      }],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await expect(scheduler.workSpace).toBeAttached();
    await page.waitForTimeout(REQUESTS_SETTLE_TIMEOUT);

    const initialRequestCount = requestLogger.count;

    expect(initialRequestCount).toBe(1);
  });

  test('Request should be requested only once for grouping', async ({ page }) => {
    const requestLogger = logResourceRequests(page);

    await mockApi(page, resourceApiMock);
    await createWidget(page, 'dxScheduler', () => ({
      currentDate: new Date(2015, 6, 10),
      dataSource: [],
      resources: [{
        field: 'ownerId',
        dataSource: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      }, {
        field: 'roomId',
        dataSource: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      }],
      groups: ['ownerId'],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await expect(scheduler.workSpace).toBeAttached();
    await page.waitForTimeout(REQUESTS_SETTLE_TIMEOUT);

    const initialRequestCount = requestLogger.count;

    await scheduler.option('groups', ['ownerId', 'roomId']);
    await page.waitForTimeout(REQUESTS_SETTLE_TIMEOUT);

    const afterUpdateRequestCount = requestLogger.count;

    expect(initialRequestCount).toBe(1);
    expect(afterUpdateRequestCount).toBe(2);
  });

  test('should be no requests for no grouping and appointments without color', async ({ page }) => {
    const requestLogger = logResourceRequests(page);

    await mockApi(page, resourceApiMock);
    await createWidget(page, 'dxScheduler', () => ({
      currentDate: new Date(2015, 6, 10),
      currentView: 'week',
      resources: [{
        field: 'ownerId',
        dataSource: (window as any).DevExpress.data.AspNet.createStore({
          key: 'id',
          loadUrl: 'https://api/data',
        }),
      }],
      dataSource: [{
        text: 'a',
        allDay: true,
        startDate: new Date(2015, 6, 10, 0),
        endDate: new Date(2015, 6, 10, 0, 30),
      }, {
        text: 'b',
        allDay: true,
        startDate: new Date(2015, 6, 10, 0),
        endDate: new Date(2015, 6, 10, 0, 30),
      }, {
        text: 'c',
        startDate: new Date(2015, 6, 10, 2),
        endDate: new Date(2015, 6, 10, 2, 30),
      }],
    }));

    const scheduler = new Scheduler(page, SCHEDULER_SELECTOR);

    await expect(scheduler.workSpace).toBeAttached();
    await page.waitForTimeout(REQUESTS_SETTLE_TIMEOUT);

    const initialRequestCount = requestLogger.count;

    expect(initialRequestCount).toBe(0);
  });
});
