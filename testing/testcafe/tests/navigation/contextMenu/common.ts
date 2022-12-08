import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget, { disposeWidgets } from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import ContextMenu from '../../../model/contextMenu';
// import { Item } from '../../../../../js/ui/context_menu.d';
import { deleteStylesheetRule, insertStylesheetRule } from '../helpers/domUtils';

fixture.disablePageReloads`ContextMenu_common`
  .page(url(__dirname, '../../container.html'))
  .afterEach(async () => disposeWidgets());

test('ContextMenu items render', async (t) => {
  const contextMenu = new ContextMenu('#container');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await contextMenu.apiShow();

  await t.click(Selector('.dx-icon-remove'));

  await takeScreenshotInTheme(t, takeScreenshot, 'ContextMenu items render.png', undefined, true);

  if (!isMaterial()) {
    await changeTheme('generic.dark');

    await takeScreenshotInTheme(t, takeScreenshot, 'ContextMenu items render.png', '#container', false, undefined, 'generic.dark');

    await changeTheme('generic.contrast');

    await takeScreenshotInTheme(t, takeScreenshot, 'ContextMenu items render.png', '#container', false, undefined, 'generic.contrast');
  }
  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());

  await deleteStylesheetRule(0);
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
});
