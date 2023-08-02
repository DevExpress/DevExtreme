import { a11yCheck } from '../../helpers/accessibilityUtils';
import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import { changeTheme } from '../../helpers/changeTheme';
import { Themes } from './helpers/themes';
import { safeSizeTest } from '../../helpers/safeSizeTest';

fixture.disablePageReloads`Column Headers`
  .page(url(__dirname, '../container.html'));

[
  Themes.genericLight,
  Themes.genericDark,
  Themes.materialBlue,
  Themes.materialBlueDark,
].forEach((theme) => {
  safeSizeTest(`Checking column headers via aXe - ${theme}`, async (t) => {
    await a11yCheck(t, {
      'color-contrast': { enabled: true },
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
