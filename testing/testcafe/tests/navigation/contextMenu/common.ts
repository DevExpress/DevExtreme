import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { restoreBrowserSize } from '../../../helpers/restoreBrowserSize';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { changeTheme } from '../../../helpers/changeTheme';
import ContextMenu from '../../../model/contextMenu';
import { Item } from '../../../../../js/ui/context_menu.d';

fixture`ContextMenu_common`
  .page(url(__dirname, '../../container.html'));

['generic.light', 'generic.dark', 'generic.contrast', 'generic.light.compact', 'material.blue.light', 'material.blue.light.compact'].forEach((theme) => {
  test(`ContextMenu_items,theme=${theme}`, async (t) => {
    const contextMenu = new ContextMenu('#contextMenu');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await contextMenu.apiShow();

    await t
      .expect(await takeScreenshot(`ContextMenu_items,theme=${theme.replace(/\./g, '-')}.png`))
      .ok()
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }).before(async (t) => {
    await t.resizeWindow(300, 400);
    await changeTheme(theme);

    const menuItems = [
      { text: 'remove', icon: 'remove' },
      { text: 'user', icon: 'user' },
      { text: 'coffee', icon: 'coffee' },
    ] as Item[];

    return createWidget('dxContextMenu', { elementAttr: { id: 'contextMenu' }, items: menuItems, target: 'body' });
  }).after(async () => {
    await changeTheme('generic.light');
  }).after(async (t) => {
    await restoreBrowserSize(t);
  });
});
