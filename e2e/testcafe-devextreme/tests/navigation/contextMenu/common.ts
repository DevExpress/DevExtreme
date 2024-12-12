import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import ContextMenu from 'devextreme-testcafe-models/contextMenu';
import { Item } from 'devextreme/ui/context_menu.d';
import { testScreenshot, isMaterialBased } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo, setAttribute,
  insertStylesheetRulesToPage, setStyleAttribute,
} from '../../../helpers/domUtils';

fixture.disablePageReloads`ContextMenu_common`
  .page(url(__dirname, '../../container.html'));

test('ContextMenu items render', async (t) => {
  const contextMenu = new ContextMenu('#contextMenu');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await contextMenu.show();

  await t.click(contextMenu.items.nth(0));

  const screenshotName = 'ContextMenu items render.png';

  if (!isMaterialBased()) {
    await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.dark' });
    await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.contrast' });
  }

  await testScreenshot(t, takeScreenshot, screenshotName, {
    element: '#container',
    shouldTestInCompact: true,
    compactCallBack: async () => {
      await contextMenu.repaint();
      await contextMenu.show();
      await t.click(contextMenu.items.nth(0));
    },
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'contextMenu');
  await setAttribute('#container', 'class', 'dx-theme-generic-typography');
  await setStyleAttribute(Selector('#container'), 'width: 300px; height: 200px;');

  await insertStylesheetRulesToPage('.custom-class { border: 2px solid green !important; }');

  const menuItems = [
    { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
    { text: 'user', icon: 'user' },
    { text: 'coffee', icon: 'coffee' },
  ] as Item[];

  return createWidget('dxContextMenu', {
    cssClass: 'custom-class',
    items: menuItems,
    target: 'body',
    position: {
      offset: '10 10',
    },
  }, '#contextMenu');
});

test('ContextMenu selected focused item', async (t) => {
  const contextMenu = new ContextMenu('#contextMenu');
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await contextMenu.show();

  await t.pressKey('down');

  const screenshotName = 'ContextMenu selected focused item.png';

  await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'contextMenu');
  await setStyleAttribute(Selector('#container'), 'width: 150px; height: 200px;');

  await insertStylesheetRulesToPage('.custom-class { border: 2px solid green !important; }');

  const menuItems = [
    { text: 'remove', icon: 'remove', selected: true },
    { text: 'user', icon: 'user' },
    { text: 'coffee', icon: 'coffee' },
  ] as Item[];

  return createWidget('dxContextMenu', {
    cssClass: 'custom-class',
    items: menuItems,
    target: 'body',
    position: {
      offset: '10 10',
    },
  }, '#contextMenu');
});
