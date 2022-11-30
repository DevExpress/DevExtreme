import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme } from '../../../helpers/getPostfix';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';

fixture`popup height after load`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async (t) => {
    await restoreBrowserSize(t);
  });

test('SelectBox without data', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await takeScreenshotInTheme(t, takeScreenshot, 'SelectBox no data.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxSelectBox', {
    dataSource: {
      store: [],
      paginate: true,
      pageSize: 3,
    },
  });
}).after(async (t) => restoreBrowserSize(t));

test('SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 3,
  });

  await takeScreenshotInTheme(t, takeScreenshot, 'SelectBox pagesize equal datasource items count.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxSelectBox', {
    dataSource: {
      store: [],
      paginate: true,
      pageSize: 3,
    },
  });
}).after(async (t) => restoreBrowserSize(t));

test('SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 2,
  });

  await takeScreenshotInTheme(t, takeScreenshot, 'SelectBox pagesize less datasource items count.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxSelectBox', {
    dataSource: {
      store: [],
      paginate: true,
      pageSize: 3,
    },
  });
}).after(async (t) => restoreBrowserSize(t));

test('SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 5,
  });

  await takeScreenshotInTheme(t, takeScreenshot, 'SelectBox pagesize more datasource items count.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxSelectBox', {
    dataSource: {
      store: [],
      paginate: true,
      pageSize: 3,
    },
  });
}).after(async (t) => restoreBrowserSize(t));

test('SelectBox does not change a popup height after load the last page', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3, 4, 5],
    paginate: true,
    pageSize: 2,
  });

  const list = await selectBox.getList();
  await list.scrollTo(100);

  await takeScreenshotInTheme(t, takeScreenshot, 'SelectBox popup height after last page load.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);

  return createWidget('dxSelectBox', {
    dataSource: {
      store: [],
      paginate: true,
      pageSize: 3,
    },
  });
});
