import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`popup height after load`
  .page(url(__dirname, '../../container.html'));

safeSizeTest('SelectBox without data', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await testScreenshot(t, takeScreenshot, 'SelectBox no data.png');

  await t.click(await selectBox.getPopup());

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

safeSizeTest('SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 3,
  });

  await testScreenshot(t, takeScreenshot, 'SelectBox pagesize equal datasource items count.png');

  await t.click(await selectBox.getPopup());

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

safeSizeTest('SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 2,
  });

  await testScreenshot(t, takeScreenshot, 'SelectBox pagesize less datasource items count.png');

  await t.click(await selectBox.getPopup());

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

safeSizeTest('SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 5,
  });

  await testScreenshot(t, takeScreenshot, 'SelectBox pagesize more datasource items count.png');

  await t.click(await selectBox.getPopup());

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

safeSizeTest('SelectBox does not change a popup height after load the last page', async (t) => {
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

  await testScreenshot(t, takeScreenshot, 'SelectBox popup height after last page load.png');

  await t.click(await selectBox.getPopup());

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [300, 400]).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));
