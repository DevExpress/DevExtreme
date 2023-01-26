import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import List from '../../../model/list';
import createWidget from '../../../helpers/createWidget';

fixture.disablePageReloads`List`
  .page(url(__dirname, '../../container.html'));

function generateData(count) {
  const items: { id: number }[] = [];

  for (let i = 0; i < count; i += 1) {
    items.push({ id: i + 1 });
  }
  return items;
}

test('Should initiate load next pages if items on the first pages are invisible', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await t
    .expect(list.getItems().count)
    .eql(isMaterial() ? 10 : 12)
    .expect(list.getVisibleItems().count)
    .eql(isMaterial() ? 2 : 4);

  await testScreenshot(t, takeScreenshot, 'List loading with first items invisible.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const sampleData = generateData(12).map((data) => ({
    ...data,
    visible: data.id > 8,
  }));

  return createWidget('dxList', {
    dataSource: {
      store: sampleData,
      paginate: true,
      pageSize: 2,
    },
    height: 100,
    width: 200,
    pageLoadMode: 'scrollBottom',
    valueExpr: 'id',
    displayExpr: 'id',
  });
});

test('Should initiate load next page if all items in the current load are invisible, pageLoadMode: scrollBottom (T1092746)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await list.scrollTo(100);

  await t
    .expect(list.getItems().count)
    .eql(isMaterial() ? 4 : 10)
    .expect(list.getVisibleItems().count)
    .eql(isMaterial() ? 4 : 6);

  await testScreenshot(t, takeScreenshot, 'List loading with middle items invisible.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const sampleData = generateData(12).map((data) => ({
    ...data,
    visible: data.id <= 4 || data.id > 8,
  }));

  return createWidget('dxList', {
    dataSource: {
      store: sampleData,
      paginate: true,
      pageSize: 2,
    },
    height: 100,
    width: 200,
    pageLoadMode: 'scrollBottom',
    valueExpr: 'id',
    displayExpr: 'id',
  });
});

test('Should initiate load next page if some items in the current load are invisible, pageLoadMode: scrollBottom', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await list.scrollTo(100);

  await t
    .expect(list.getItems().count)
    .eql(isMaterial() ? 4 : 12)
    .expect(list.getVisibleItems().count)
    .eql(isMaterial() ? 4 : 6);

  await testScreenshot(t, takeScreenshot, 'List loding with part items invisible on loaded page.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const sampleData = generateData(12).map((data) => ({
    ...data,
    visible: data.id <= 4 || data.id === 8 || data.id === 11,
  }));

  return createWidget('dxList', {
    dataSource: {
      store: sampleData,
      paginate: true,
      pageSize: 2,
    },
    height: 100,
    width: 200,
    pageLoadMode: 'scrollBottom',
    valueExpr: 'id',
    displayExpr: 'id',
  });
});

test('Should initiate load next page if all items on next pages are invisible', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await list.scrollTo(100);

  await t
    .expect(list.getItems().count)
    .eql(isMaterial() ? 4 : 12)
    .expect(list.getVisibleItems().count)
    .eql(4);

  await testScreenshot(t, takeScreenshot, 'List loading with last items invisible.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const sampleData = generateData(12).map((data) => ({
    ...data,
    visible: data.id <= 4,
  }));

  return createWidget('dxList', {
    dataSource: {
      store: sampleData,
      paginate: true,
      pageSize: 2,
    },
    height: 100,
    width: 200,
    pageLoadMode: 'scrollBottom',
    valueExpr: 'id',
    displayExpr: 'id',
  });
});

test('Should not initiate load next page if not reach the bottom when pullRefreshEnabled is true', async (t) => {
  const list = new List('#container');

  await list.scrollTo(1);

  await t
    .expect(list.getItems().count)
    .eql(4);
}).before(async () => {
  const sampleData = generateData(12).map((data) => ({
    ...data,
  }));

  return createWidget('dxList', {
    dataSource: {
      store: sampleData,
      paginate: true,
      pageSize: 2,
    },
    pullRefreshEnabled: true,
    height: 130,
    width: 200,
    pageLoadMode: 'scrollBottom',
    valueExpr: 'id',
    displayExpr: 'id',
  });
});

test('Should initiate load next page on select last item by keyboard', async (t) => {
  const list = new List('#container');

  await list.focus();

  await t
    .expect(list.getItems().count)
    .eql(6);

  await t
    .pressKey('down')
    .pressKey('down')
    .pressKey('down')
    .pressKey('down')
    .pressKey('down');

  await t
    .expect(list.getItems().count)
    .eql(9);
}).before(async () => {
  const sampleData = generateData(12).map((data) => ({
    ...data,
  }));

  return createWidget('dxList', {
    dataSource: {
      store: sampleData,
      paginate: true,
      pageSize: 3,
    },
    pullRefreshEnabled: true,
    height: 160,
    width: 200,
    pageLoadMode: 'scrollBottom',
    valueExpr: 'id',
    displayExpr: 'id',
  });
});
