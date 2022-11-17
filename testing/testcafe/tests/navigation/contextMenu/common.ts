import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import ContextMenu from '../../../model/contextMenu';
import { deleteStylesheetRule, insertStylesheetRule } from '../helpers/domUtils';
import { getThemePostfix } from '../../../helpers/getPostfix';

fixture`ContextMenu_common`
  .page(url(__dirname, '../../container.html'));

test('ContextMenu_items', async (t) => {
  const contextMenu = new ContextMenu('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await contextMenu.apiShow();

  await t.click(Selector('.dx-icon-remove'));

  await t
    .expect(await takeScreenshot(`ContextMenu_items${getThemePostfix}.png`))
    .ok()
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async (t) => {
  await t.resizeWindow(300, 400);
  await insertStylesheetRule('.custom-class { border: 2px solid green !important }', 0);

  const menuItems = [
    { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
    { text: 'user', icon: 'user' },
    { text: 'coffee', icon: 'coffee' },
  ] as any[];

  return createWidget('dxContextMenu', {
    cssClass: 'custom-class',
    items: menuItems,
    target: 'body',
  });
}).after(async (t) => {
  await deleteStylesheetRule(0);
  await restoreBrowserSize(t);
});

// eslint-disable-next-line max-len
// ['generic.light', 'generic.dark', 'generic.contrast', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
//   test(`ContextMenu_items,theme=${theme}`, async (t) => {
//     const contextMenu = new ContextMenu('#container');
//     const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

//     await contextMenu.apiShow();

//     await t.click(Selector('.dx-icon-remove'));

//     await t
//       .expect(await takeScreenshot(`ContextMenu_items,theme=${theme.replace(/\./g, '-')}.png`))
//       .ok()
//       .expect(compareResults.isValid())
//       .ok(compareResults.errorMessages());
//   }).before(async (t) => {
//     await t.resizeWindow(300, 400);
//     await changeTheme(theme);
//     await insertStylesheetRule('.custom-class { border: 2px solid green !important }', 0);

//     const menuItems = [
//       { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
//       { text: 'user', icon: 'user' },
//       { text: 'coffee', icon: 'coffee' },
//     ] as any[];

//     return createWidget('dxContextMenu', {
//       cssClass: 'custom-class',
//       items: menuItems,
//       target: 'body',
//     });
//   }).after(async (t) => {
//     await deleteStylesheetRule(0);
//     await restoreBrowserSize(t);
//     await changeTheme('generic.light');
//   });
// });
