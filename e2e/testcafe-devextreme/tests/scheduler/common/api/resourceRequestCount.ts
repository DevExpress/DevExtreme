import { RequestLogger } from 'testcafe';
import Scheduler from 'devextreme-testcafe-models/scheduler';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { resourceApiMock } from '../../apiMocks/resourceApiMock';

fixture`Scheduler API - request counting`
  .page(url(__dirname, '../../../container.html'));

const requestLogger = RequestLogger(/\/api\/data/);

test('Request should be requested only once for color appointments (week)', async (t) => {
  const scheduler = new Scheduler('#container');
  const initialRequestCount = await requestLogger.count(() => true);

  await t
    .expect(scheduler.workSpace.exists)
    .ok()
    .expect(initialRequestCount)
    .eql(1);
}).before(async (t) => {
  requestLogger.clear();
  await t.addRequestHooks(resourceApiMock);
  await t.addRequestHooks(requestLogger);
  await createWidget('dxScheduler', () => ({
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
});

test('Request should be requested only once for color appointments (agenda)', async (t) => {
  const scheduler = new Scheduler('#container');
  const initialRequestCount = await requestLogger.count(() => true);

  await t
    .expect(scheduler.workSpace.exists)
    .ok()
    .expect(initialRequestCount)
    .eql(1);
}).before(async (t) => {
  requestLogger.clear();
  await t.addRequestHooks(resourceApiMock);
  await t.addRequestHooks(requestLogger);
  await createWidget('dxScheduler', () => ({
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
});

test('Request should be requested only once for grouping', async (t) => {
  const scheduler = new Scheduler('#container');
  const initialRequestCount = await requestLogger.count(() => true);

  await t.expect(scheduler.workSpace.exists).ok();
  await scheduler.option('groups', ['ownerId', 'roomId']);
  const afterUpdateRequestCount = await requestLogger.count(() => true);

  await t.expect(initialRequestCount).eql(1);
  await t.expect(afterUpdateRequestCount).eql(2);
}).before(async (t) => {
  requestLogger.clear();
  await t.addRequestHooks(resourceApiMock);
  await t.addRequestHooks(requestLogger);
  await createWidget('dxScheduler', () => ({
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
});

test('should be no requests for no grouping and appointments without color', async (t) => {
  const scheduler = new Scheduler('#container');
  const initialRequestCount = await requestLogger.count(() => true);

  await t
    .expect(scheduler.workSpace.exists)
    .ok()
    .expect(initialRequestCount)
    .eql(0);
}).before(async (t) => {
  requestLogger.clear();
  await t.addRequestHooks(resourceApiMock);
  await t.addRequestHooks(requestLogger);
  await createWidget('dxScheduler', () => ({
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
});
