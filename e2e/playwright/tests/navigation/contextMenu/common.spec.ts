import type { Item } from 'devextreme/ui/context_menu';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
  setStyleAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import ContextMenu from '../../../models/contextMenu';

test.describe('ContextMenu_common', () => {
  test('ContextMenu items render', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'contextMenu');
    await setStyleAttribute(page, '#container', 'width: 300px; height: 200px;');

    await insertStylesheetRulesToPage(page, '.custom-class { box-shadow: 0 0 0 2px green !important; }');

    const menuItems: Item[] = [
      { text: 'remove', icon: 'remove', items: [{ text: 'item_1' }, { text: 'item_2' }] },
      { text: 'user', icon: 'user' },
      { text: 'coffee', icon: 'coffee' },
    ];

    await createWidget(page, 'dxContextMenu', {
      cssClass: 'custom-class',
      items: menuItems,
      target: 'body',
      position: {
        offset: '10 10',
      },
    }, '#contextMenu');

    const contextMenu = new ContextMenu(page, '#contextMenu');

    await contextMenu.show();
    await contextMenu.items.nth(0).click();

    await testScreenshot(page, 'ContextMenu items render.png', { element: '#container' });
  });

  test('ContextMenu selected focused item', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'contextMenu');
    await setStyleAttribute(page, '#container', 'width: 150px; height: 200px;');

    await insertStylesheetRulesToPage(page, '.custom-class { border: 2px solid green !important; }');

    const menuItems: Item[] = [
      { text: 'remove', icon: 'remove', selected: true },
      { text: 'user', icon: 'user' },
      { text: 'coffee', icon: 'coffee' },
    ];

    await createWidget(page, 'dxContextMenu', {
      cssClass: 'custom-class',
      items: menuItems,
      target: 'body',
      position: {
        offset: '10 10',
      },
    }, '#contextMenu');

    const contextMenu = new ContextMenu(page, '#contextMenu');

    await contextMenu.show();
    await page.keyboard.press('ArrowDown');

    await testScreenshot(page, 'ContextMenu selected focused item.png', { element: '#container' });
  });
});
