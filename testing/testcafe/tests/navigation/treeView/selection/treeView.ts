import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction, Selector } from 'testcafe';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import { getThemePostfix } from '../../../../helpers/getPostfix';
// eslint-disable-next-line import/extensions
import { employees } from './data.js';

fixture`TreeView_selectAll`
  .page(url(__dirname, '../../../container.html'));

[true, false].forEach((rtlEnabled) => {
  ['selectAll', 'normal', 'none'].forEach((showCheckBoxesMode) => {
    test(`TreeView-selectAll,showCheckBoxesMode=${showCheckBoxesMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
      await t
        .expect(await takeScreenshot(`selectAll,cbm=${showCheckBoxesMode},selMode='multiple',rtl=${rtlEnabled}${getThemePostfix()}.png`, Selector('#container')))
        .ok()
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await ClientFunction(() => {
        $('#container').addClass('dx-theme-generic-typography');
      })();

      return createWidget('dxTreeView', {
        items: employees,
        width: 300,
        selectionMode: 'multiple',
        showCheckBoxesMode,
        rtlEnabled,
        itemTemplate(item) {
          return `<div>${item.fullName} (${item.position})</div>`;
        },
      });
    });
  });
});

// ['generic.light', 'generic.dark', 'generic.contrast'].forEach((theme) => {
//   [true, false].forEach((rtlEnabled) => {
//     ['selectAll', 'normal', 'none'].forEach((showCheckBoxesMode) => {
// eslint-disable-next-line max-len
//       test(`TreeView-selectAll,theme=${theme},showCheckBoxesMode=${showCheckBoxesMode}`, async (t) => {
//         const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
//         await changeTheme(theme);

//         await t
// eslint-disable-next-line max-len
//           .expect(await takeScreenshot(`selectAll,theme=${theme},cbm=${showCheckBoxesMode},selMode='multiple',rtl=${rtlEnabled}.png`, Selector('#container')))
//           .ok()
//           .expect(compareResults.isValid())
//           .ok(compareResults.errorMessages());
//       }).before(async () => {
//         await ClientFunction(() => {
//           $('#container').addClass('dx-theme-generic-typography');
//         })();

//         return createWidget('dxTreeView', {
//           items: employees,
//           width: 300,
//           selectionMode: 'multiple',
//           showCheckBoxesMode,
//           rtlEnabled,
//           itemTemplate(item) {
//             return `<div>${item.fullName} (${item.position})</div>`;
//           },
//         });
//       });
//     });
//   });
// });
