import { expect, test } from '../../../../fixtures';
import { createWidget } from '../../../../helpers/createWidget';
import { createRequestLogger } from '../../../../helpers/requestLogger';
import Scheduler from '../../../../models/scheduler';
import { mockResourceApi, RESOURCE_API_URL } from './apiMocks/resourceApiMock';

// Every configuration below is spelled out inside its own factory: the factory is shipped to the
// page as its own source, so anything it closes over here would not exist there.

test('Request should be requested only once for color appointments (week)', async ({ page }) => {
  await mockResourceApi(page);

  const logger = createRequestLogger(page, RESOURCE_API_URL);

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

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.workSpace).toBeAttached();

  // The appointments are painted with the colors the resource store answers with, so having
  // them on screen is what says the load has been through.
  await expect.poll(async () => scheduler.getAppointmentCount()).toBeGreaterThan(0);

  expect(logger.count()).toBe(1);
});

test('Request should be requested only once for color appointments (agenda)', async ({ page }) => {
  await mockResourceApi(page);

  const logger = createRequestLogger(page, RESOURCE_API_URL);

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

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.workSpace).toBeAttached();
  await expect.poll(async () => scheduler.getAppointmentCount()).toBeGreaterThan(0);

  expect(logger.count()).toBe(1);
});

test('Request should be requested only once for grouping', async ({ page }) => {
  await mockResourceApi(page);

  const logger = createRequestLogger(page, RESOURCE_API_URL);

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

  const scheduler = new Scheduler(page, '#container');

  // The group headers are drawn from the loaded resource, so their count is the signal that the
  // load the request count is about has landed.
  const groupCellsPerLevel = 2;

  await expect(scheduler.headerPanel.groupCells).toHaveCount(groupCellsPerLevel);

  const initialRequestCount = logger.count();

  await scheduler.option('groups', ['ownerId', 'roomId']);

  await expect(scheduler.headerPanel.groupCells)
    .toHaveCount(groupCellsPerLevel + groupCellsPerLevel * groupCellsPerLevel);

  const afterUpdateRequestCount = logger.count();

  expect(initialRequestCount).toBe(1);
  expect(afterUpdateRequestCount).toBe(2);
});

test('should be no requests for no grouping and appointments without color', async ({ page }) => {
  await mockResourceApi(page);

  const logger = createRequestLogger(page, RESOURCE_API_URL);

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

  const scheduler = new Scheduler(page, '#container');

  await expect(scheduler.workSpace).toBeAttached();
  await expect.poll(async () => scheduler.getAppointmentCount()).toBeGreaterThan(0);

  expect(logger.count()).toBe(0);
});
