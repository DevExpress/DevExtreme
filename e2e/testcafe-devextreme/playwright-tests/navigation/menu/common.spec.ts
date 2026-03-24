import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setAttribute, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('Menu_common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Menu items render', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'menu');
    await setAttribute(page, '#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
    await insertStylesheetRulesToPage(page, '.custom-class { border: 2px solid green !important }');

    const menuItems: any[] = [
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

    const menu = new Menu();

    await page.click(menu.getItem(0))
      .pressKey('down')
      .pressKey('down')
      .pressKey('right');

    await testScreenshot(page, 'Menu render items.png', { element: '#container' });

    await page.click(menu.getItem(1))
      .pressKey('down');

    await testScreenshot(page, 'Menu selected focused item.png', {
      element: '#container',
    });

    });

  [true, false].forEach((adaptivityEnabled) => {
    test(`Menu item with link, adaptivityEnabled=${adaptivityEnabled}`, async ({ page }) => {

      await appendElementTo(page, '#container', 'div', 'menu');
      await setAttribute(page, '#container', 'style', 'width: 200px; height: 400px;');

      const items: any[] = [{
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


      const menu = new Menu(adaptivityEnabled);

      if (adaptivityEnabled) {
        await click(menu.getHamburgerButton());
      }

      await page.click(menu.getItem(0))
        .pressKey('down')
        .pressKey('down');

      await testScreenshot(page, `Menu item with link and icon focused, adaptivityEnabled=${adaptivityEnabled}.png`);

      await page.keyboard.press('ArrowDown')
        .pressKey('down');

      await testScreenshot(page, `Menu item with link focused, adaptivityEnabled=${adaptivityEnabled}.png`);

    });
  });

  test('Menu scrolling', async ({ page }) => {

    const items: any[] = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

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

    const menu = new Menu();

    await page.click(menu.getItem(0))
      .pressKey('down')
      .pressKey('up')
      .pressKey('right')
      .pressKey('up');

    await testScreenshot(page, 'Menu scrolling.png');

    });
});
