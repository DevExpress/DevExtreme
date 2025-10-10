import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item } from 'devextreme/ui/menu.d';
import Menu from 'devextreme-testcafe-models/menu';
import {
  insertStylesheetRulesToPage,
  appendElementTo,
  setAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Menu_common`
  .page(url(__dirname, '../../container.html'));

test('Menu items render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const menu = new Menu();

  await t
    .click(menu.getItem(0))
    .pressKey('down')
    .pressKey('down')
    .pressKey('right');

  await testScreenshot(t, takeScreenshot, 'Menu render items.png', { element: '#container' });

  await t
    .click(menu.getItem(1))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Menu selected focused item.png', {
    element: '#container',
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'menu');
  await setAttribute('#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');
  await insertStylesheetRulesToPage('.custom-class { border: 2px solid green !important }');

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

  return createWidget('dxMenu', { items: menuItems, cssClass: 'custom-class' }, '#menu');
});

[true, false].forEach((adaptivityEnabled) => {
  safeSizeTest(`Menu item with link, adaptivityEnabled=${adaptivityEnabled}`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const menu = new Menu(adaptivityEnabled);

    if (adaptivityEnabled) {
      await t.click(menu.getHamburgerButton());
    }

    await t
      .click(menu.getItem(0))
      .pressKey('down')
      .pressKey('down');

    await testScreenshot(t, takeScreenshot, `Menu item with link and icon focused, adaptivityEnabled=${adaptivityEnabled}.png`);

    await t
      .pressKey('down')
      .pressKey('down');

    await testScreenshot(t, takeScreenshot, `Menu item with link focused, adaptivityEnabled=${adaptivityEnabled}.png`);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  }, [250, 500]).before(async () => {
    await appendElementTo('#container', 'div', 'menu');
    await setAttribute('#container', 'style', 'width: 200px; height: 400px;');

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

    return createWidget('dxMenu', {
      adaptivityEnabled,
      items,
    }, '#menu');
  });
});

safeSizeTest('Menu scrolling', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu();

  await t
    .click(menu.getItem(0))
    .pressKey('down')
    .pressKey('up')
    .pressKey('right')
    .pressKey('up');

  await testScreenshot(t, takeScreenshot, 'Menu scrolling.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [500, 500]).before(async () => {
  const items: any[] = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

  items[98].items = new Array(99).fill(null).map((_, idx) => ({ text: `item ${idx}` }));

  await createWidget('dxMenu', {
    items: [
      {
        text: 'root',
        items,
      },
    ],
    showFirstSubmenuMode: 'onClick',
    hideSubmenuOnMouseLeave: true,
  });
});
