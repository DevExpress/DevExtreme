import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { safeSizeTest } from '../../../helpers/safeSizeTest';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';
import { defaultConfig } from './data';
import { changeTheme } from '../../../helpers/changeTheme';
import { Themes } from '../../../helpers/themes';

const DATA_GRID_SELECTOR = '#container';

fixture.disablePageReloads`Sticky columns - Row Selection`
  .page(url(__dirname, '../../container.html'));

[Themes.genericLight, Themes.materialBlue, Themes.fluentBlue].forEach((theme) => {
  safeSizeTest(`The selected row should be displayed correctly when there are sticky columns (${theme} theme)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t.expect(dataGrid.isReady()).ok();

    await takeScreenshot(`row_selection_with_sticky_columns_1_(${theme}).png`, dataGrid.element);

    await dataGrid.scrollTo(t, { x: 10000 });

    await takeScreenshot(`row_selection_with_sticky_columns_2_(${theme}).png`, dataGrid.element);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [800, 800])
    .before(async () => {
      await changeTheme(theme);
      await createWidget('dxDataGrid', {
        ...defaultConfig,
        selection: {
          mode: 'multiple',
        },
        selectedRowKeys: [4],
      });
    })
    .after(async () => {
      await changeTheme(Themes.genericLight);
    });
});
