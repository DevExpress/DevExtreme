import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { changeTheme } from '../../../helpers/changeTheme';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`popup height on first load`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async (t) => {
    await restoreBrowserSize(t);
    await changeTheme('generic.light');
  });

const themes = ['generic.light', 'material.blue.light'];

themes.forEach((theme) => {
  test(`SelectBox without data, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');

    await t.click(selectBox.element);

    await t
      .expect(await takeScreenshot(`SelectBox no data${getThemePostfix(theme)}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  }).after(async (t) => restoreBrowserSize(t));

  test(`SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881), theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');

    await t.click(selectBox.element);

    await selectBox.option('dataSource', {
      store: [1, 2, 3],
      paginate: true,
      pageSize: 3,
    });

    await t
      .expect(await takeScreenshot(`SelectBox pagesize equal datasource items count${getThemePostfix(theme)}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  }).after(async (t) => restoreBrowserSize(t));

  test(`SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');

    await t.click(selectBox.element);

    await selectBox.option('dataSource', {
      store: [1, 2, 3],
      paginate: true,
      pageSize: 2,
    });

    await t
      .expect(await takeScreenshot(`SelectBox pagesize less datasource items count${getThemePostfix(theme)}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  }).after(async (t) => restoreBrowserSize(t));

  test(`SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');

    await t.click(selectBox.element);

    await selectBox.option('dataSource', {
      store: [1, 2, 3],
      paginate: true,
      pageSize: 5,
    });

    await t
      .expect(await takeScreenshot(`SelectBox pagesize more datasource items count${getThemePostfix(theme)}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  }).after(async (t) => restoreBrowserSize(t));
});

fixture`popup height after last page load`
  .page(url(__dirname, '../../container.html'))
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
    .expect(await takeScreenshot('SelectBox popup height after last page load.png'))
    .ok()
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
