import { ClientFunction } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`popup_height_on_first_load`
  .page(url(__dirname, '../../container.html'))
  .beforeEach(async (t) => {
    await t.resizeWindow(300, 400);
  })
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
      .expect(await takeScreenshot(`SelectBox_no_data,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  });

  test(`SelectBox has a correct popup height for the first opening if the pageSize is equal to dataSource length (T942881), theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');
    const { getInstance } = selectBox;

    await t.click(selectBox.element);
    await ClientFunction(
      () => {
        const instance = getInstance() as any;

        instance.option('dataSource', {
          store: [1, 2, 3],
          paginate: true,
          pageSize: 3,
        });
      },
      { dependencies: { getInstance } },
    )();

    await t
      .expect(await takeScreenshot(`SelectBox_pagesize_equal_datasource_items_count,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  });

  test(`SelectBox has a correct popup height for the first opening if the pageSize is less than dataSource items count, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');
    const { getInstance } = selectBox;

    await t.click(selectBox.element);

    await ClientFunction(
      () => {
        const instance = getInstance() as any;

        instance.option('dataSource', {
          store: [1, 2, 3],
          paginate: true,
          pageSize: 2,
        });
      },
      { dependencies: { getInstance } },
    )();

    await t
      .expect(await takeScreenshot(`SelectBox_pagesize_less_datasource_items_count,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  });

  test(`SelectBox has a correct popup height for the first opening if the pageSize is more than dataSource items count, theme=${theme}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const selectBox = new SelectBox('#container');
    const { getInstance } = selectBox;

    await t.click(selectBox.element);

    await ClientFunction(
      () => {
        const instance = getInstance() as any;

        instance.option('dataSource', {
          store: [1, 2, 3],
          paginate: true,
          pageSize: 5,
        });
      },
      { dependencies: { getInstance } },
    )();

    await t
      .expect(await takeScreenshot(`SelectBox_pagesize_more_datasource_items_count,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxSelectBox', {
      dataSource: {
        store: [],
        paginate: true,
        pageSize: 3,
      },
    });
  });
});
