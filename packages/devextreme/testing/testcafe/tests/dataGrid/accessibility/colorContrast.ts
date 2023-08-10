import { a11yCheck } from '../../../helpers/accessibilityUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import DataGrid from '../../../model/dataGrid';
import { Themes } from '../helpers/themes';
import { changeTheme } from '../../../helpers/changeTheme';

fixture`Color contrast`
  .page(url(__dirname, '../../container.html'));

const DATA_GRID_SELECTOR = '#container';

[
  Themes.genericLight,
  Themes.genericDark,
  Themes.materialBlue,
  Themes.materialBlueDark,
].forEach((theme) => {
  test(`Grid without data in ${theme}`, async (t) => {
    const dataGrid = new DataGrid(DATA_GRID_SELECTOR);

    await t
      .expect(dataGrid.isReady())
      .ok();

    await a11yCheck(t, DATA_GRID_SELECTOR, {
      runOnly: 'color-contrast',
    });
  }).before(async () => {
    await changeTheme(theme);

    return createWidget('dxDataGrid', {
      dataSource: [],
    });
  }).after(async () => {
    await changeTheme('generic.light');
  });
});
