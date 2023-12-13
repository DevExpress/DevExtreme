import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { a11yCheck } from '../../../helpers/accessibilityUtils';
import { isMaterialBased } from '../../../helpers/themeUtils';
import { employees } from './data';

fixture`TreeView: Common tests with axe`
  .page(url(__dirname, '../../container.html'));

const TREEVIEW_SELECTOR = '#container';

[
  undefined,
  // 320, // NOTE: False positive axe report 'Scrollable region must have keyboard access'
].forEach((height) => {
  [[], employees].forEach((items) => {
    [true, false].forEach((searchEnabled) => {
      ['none', 'normal', 'selectAll'].forEach((showCheckBoxesMode) => {
        [null, 'no data text'].forEach((noDataText) => {
          test(`Treeview ${items.length ? 'full items' : 'empty items'} searchEnabled=${searchEnabled} showCheckBoxesMode=${showCheckBoxesMode} noDataText=${noDataText}`, async (t) => {
            const a11yCheckConfig = isMaterialBased() ? {
              runOnly: 'color-contrast',
            } : {};

            await a11yCheck(t, a11yCheckConfig, TREEVIEW_SELECTOR);
          }).before(async () => createWidget('dxTreeView', {
            height,
            searchEnabled,
            showCheckBoxesMode,
            noDataText,
            items,
            displayExpr: 'fullName',
          }));
        });
      });
    });
  });
});
