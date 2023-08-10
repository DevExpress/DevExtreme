import { a11yCheck } from '../../helpers/accessibilityUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from './helpers/themes';

fixture`Column Headers`
  .page(url(__dirname, '../container.html'));

[
  Themes.genericLight,
  Themes.genericDark,
  Themes.materialBlue,
  Themes.materialBlueDark,
].forEach((theme) => {
  test(`Checking column headers via aXe - ${theme}`, async (t) => {
    await a11yCheck(t, null, {
      rules: {
        'th-has-data-cells': { enabled: false },
      },
    });
  }).before(async () => {
    await changeTheme(theme);
    return createWidget('dxDataGrid', {
      dataSource: [{
        id: 1,
        field1: 'field1',
        field2: 'field2',
      }],
      keyExpr: 'id',
      columns: ['field1', 'field2'],
      showBorders: true,
    });
  }).after(async () => {
    await changeTheme(Themes.genericLight);
  });
});
