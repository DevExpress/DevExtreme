import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibilityUtils';
import { Themes } from '../../../helpers/themes';
import { changeTheme } from '../../../helpers/changeTheme';
import { employees } from './data';

fixture.disablePageReloads`TreeView: Common tests with axe`
  .page(url(__dirname, '../../container.html'));

const TREEVIEW_SELECTOR = '#container';

[
  Themes.genericLight,
  Themes.genericDark,
  Themes.materialBlue,
  Themes.materialBlueDark,
  Themes.fluentBlue,
  Themes.fluentBlueDark,
].forEach((theme) => {
  const a11yCheckConfig = theme === Themes.genericLight ? {} : {
    runOnly: 'color-contrast',
  };

  [[], employees].forEach((items) => {
    [true, false].forEach((searchEnabled) => {
      ['none', 'normal', 'selectAll'].forEach((showCheckBoxesMode) => {
        [null, 'no data text'].forEach((noDataText) => {
          test(`Treeview ${items.length ? 'full items' : 'empty items'} searchEnabled=${searchEnabled} showCheckBoxesMode=${showCheckBoxesMode} noDataText=${noDataText} in ${theme}`, async (t) => {
            await a11yCheck(t, a11yCheckConfig, TREEVIEW_SELECTOR);
          }).before(async () => {
            await changeTheme(theme);

            return createWidget('dxTreeView', {
              searchEnabled,
              showCheckBoxesMode,
              noDataText,
              items,
              displayExpr: 'fullName',
            });
          }).after(async () => {
            await changeTheme('generic.light');
          });
        });
      });
    });
  });
});
