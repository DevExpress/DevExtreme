import type { Item } from 'devextreme/ui/menu';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import {
  appendElementTo,
  insertStylesheetRulesToPage,
  setAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Menu from '../../../models/menu';

test.describe('Menu_common', () => {
  test('Menu items render', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'menu');
    await setAttribute(page, '#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
    await insertStylesheetRulesToPage(page, '.custom-class { border: 2px solid green !important }');

    const menuItems: Item[] = [
      {
        text: 'remove',
        icon: 'remove',
        items: [
          {
            text: 'user',
            icon: 'user',
            disabled: true,
            items: [{ text: 'user_1' }],
          },
          {
            text: 'save',
            icon: 'save',
            items: [
              { text: 'export', icon: 'export' },
              { text: 'edit', icon: 'edit' },
            ],
          },
        ],
      },
      {
        text: 'user',
        icon: 'user',
        items: [
          {
            text: 'user',
            icon: 'user',
            selected: true,
          },
          {
            text: 'save',
            icon: 'save',
          },
        ],
      },
      {
        text: 'coffee',
        icon: 'coffee',
        disabled: true,
      },
    ];

    await createWidget(page, 'dxMenu', { items: menuItems, cssClass: 'custom-class' }, '#menu');

    const menu = new Menu(page);

    await menu.getItem(0).click();
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowRight');

    await testScreenshot(page, 'Menu render items.png', { element: '#container' });

    await menu.getItem(1).click();
    await page.keyboard.press('ArrowDown');

    await testScreenshot(page, 'Menu selected focused item.png', { element: '#container' });
  });

  test.describe(() => {
    test.use({ browserSize: [250, 500] });

    [true, false].forEach((adaptivityEnabled) => {
      test(`Menu item with link, adaptivityEnabled=${adaptivityEnabled}`, async ({ page }) => {
        await appendElementTo(page, '#container', 'div', 'menu');
        await setAttribute(page, '#container', 'style', 'width: 200px; height: 400px;');

        const items: Item[] = [{
          text: 'Items 1',
          items: [{
            text: 'Item 1',
          }, {
            text: 'Item 2',
            icon: 'bookmark',
            url: 'https://js.devexpress.com/',
          }, {
            icon: 'more',
            url: 'https://js.devexpress.com/',
          }, {
            text: 'Item 4',
            url: 'https://js.devexpress.com/',
          }],
        }];

        if (adaptivityEnabled) {
          items.push(
            { text: 'Items 2' },
            { text: 'Items 3' },
            { text: 'Items 4' },
          );
        }

        await createWidget(page, 'dxMenu', {
          adaptivityEnabled,
          items,
        }, '#menu');

        const menu = new Menu(page, adaptivityEnabled);

        if (adaptivityEnabled) {
          await menu.getHamburgerButton().click();
        }

        await menu.getItem(0).click();
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        await testScreenshot(page, `Menu item with link and icon focused, adaptivityEnabled=${adaptivityEnabled}.png`);

        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');

        await testScreenshot(page, `Menu item with link focused, adaptivityEnabled=${adaptivityEnabled}.png`);
      });
    });
  });

  test.describe(() => {
    test.use({ browserSize: [500, 500] });

    test('Menu scrolling', async ({ page }) => {
      const items: { text: string; items?: { text: string }[] }[] = new Array(99)
        .fill(null)
        .map((_, idx) => ({ text: `item ${idx}` }));

      items[98].items = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

      await createWidget(page, 'dxMenu', {
        items: [
          {
            text: 'root',
            items,
          },
        ],
        showFirstSubmenuMode: 'onClick',
        hideSubmenuOnMouseLeave: true,
      });

      const menu = new Menu(page);

      await menu.getItem(0).click();
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('ArrowUp');
      await page.keyboard.press('ArrowRight');
      await page.keyboard.press('ArrowUp');

      await testScreenshot(page, 'Menu scrolling.png');
    });
  });
});
