import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { takeScreenshotInTheme, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import ContextMenu from '../../../model/contextMenu';
import { Item } from '../../../../../js/ui/context_menu.d';
import {
  appendElementTo, deleteStylesheetRule, insertStylesheetRule, setAttribute,
} from '../helpers/domUtils';

fixture.disablePageReloads`ContextMenu_common`
  .page(url(__dirname, '../../container.html'));

test('ContextMenu items render', async (t) => {
  const contextMenu = new ContextMenu('#contextMenu');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await contextMenu.apiShow();

  await t.click(contextMenu.items.nth(0));

  const screenshotName = 'ContextMenu items render.png';

  if (!isMaterial()) {
    await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.dark');
    await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', false, undefined, 'generic.contrast');
  }

  await takeScreenshotInTheme(t, takeScreenshot, screenshotName, '#container', true, async () => {
    await contextMenu.repaint();
    await t.click(contextMenu.items.nth(0));
  });

  await deleteStylesheetRule(0);

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'contextMenu');
  await setAttribute('#container', 'class', 'dx-theme-generic-typography');
  await setAttribute('#container', 'style', 'width: 300px; height: 200px;');

  await insertStylesheetRule('.custom-class { border: 2px solid green !important }', 0);

  const menuItems = [
    { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
    { text: 'user', icon: 'user' },
    { text: 'coffee', icon: 'coffee' },
  ] as Item[];

  return createWidget('dxContextMenu', {
    cssClass: 'custom-class',
    items: menuItems,
    target: 'body',
  }, true, '#contextMenu');
});
