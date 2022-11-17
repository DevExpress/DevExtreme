import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`popup_height_on_first_load`
  .page(url(__dirname, '../../container.html'))
  .beforeEach(async (t) => {
    await t.resizeWindow(300, 400);
  })
  .afterEach(async (t) => {
    await restoreBrowserSize(t);
  });

test('SelectBox without data', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await t
    .expect(await takeScreenshot(`SelectBox_no_data${getThemePostfix()}.png`))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

test('SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 3,
  });

  await t
    .expect(await takeScreenshot(`SelectBox_pagesize_equal_datasource_items_count${getThemePostfix()}.png`))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

test('SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 2,
  });

  await t
    .expect(await takeScreenshot(`SelectBox_pagesize_less_datasource_items_count${getThemePostfix()}.png`))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

test('SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const selectBox = new SelectBox('#container');

  await t.click(selectBox.element);

  await selectBox.option('dataSource', {
    store: [1, 2, 3],
    paginate: true,
    pageSize: 5,
  });

  await t
    .expect(await takeScreenshot(`SelectBox_pagesize_more_datasource_items_count${getThemePostfix()}.png`))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));

fixture`popup_height_after_last_page_load`
  .page(url(__dirname, '../../container.html'))
  .beforeEach(async (t) => {
    await t.resizeWindow(300, 400);
  })
  .afterEach(async (t) => {
    await restoreBrowserSize(t);
  });

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

  await t
    .expect(await takeScreenshot(`SelectBox_popup_height_after_last_page_load${getThemePostfix()}.png`))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxSelectBox', {
  dataSource: {
    store: [],
    paginate: true,
    pageSize: 3,
  },
}));
