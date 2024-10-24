import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Item } from 'devextreme/ui/menu.d';
import Menu from 'devextreme-testcafe-models/menu';
import {
  insertStylesheetRulesToPage,
  appendElementTo, setAttribute,
} from '../../../helpers/domUtils';
import { testScreenshot, isMaterialBased } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { safeSizeTest } from '../../../helpers/safeSizeTest';

fixture.disablePageReloads`Menu_common`
  .page(url(__dirname, '../../container.html'));

test('Menu items render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const menu = new Menu();

  const expandMenuItems = async () => {
    await t
      .click(menu.getItem(0))
      .pressKey('down')
      .pressKey('down')
      .pressKey('right');
  };

  await expandMenuItems();

  if (!isMaterialBased()) {
    await testScreenshot(t, takeScreenshot, 'Menu render items.png', { element: '#container', theme: 'generic.dark' });
    await testScreenshot(t, takeScreenshot, 'Menu render items.png', { element: '#container', theme: 'generic.contrast' });
  }

  await testScreenshot(t, takeScreenshot, 'Menu render items.png', {
    element: '#container',
    shouldTestInCompact: true,
    compactCallBack: async () => {
      await menu.repaint();
      await expandMenuItems();
    },
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'menu');

  await setAttribute('#container', 'class', 'dx-theme-generic-typography');
  await setAttribute('#container', 'style', 'box-sizing: border-box; width: 400px; height: 400px; padding: 8px;');

  await insertStylesheetRulesToPage('.custom-class { border: 2px solid green !important }');

  const menuItems = [
    {
      text: 'remove',
      icon: 'remove',
      items: [
        {
          text: 'user',
          icon: 'user',
          disabled: true,
          items: [{
            text: 'user_1',
          }],
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
    { text: 'user', icon: 'user' },
    {
      text: 'coffee',
      icon: 'coffee',
      disabled: true,
    },
  ] as Item[];

  return createWidget('dxMenu', { items: menuItems, cssClass: 'custom-class' }, '#menu');
});

safeSizeTest('Menu delimiter appearance when orientation is horizontal', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu();

  await t
    .click(menu.getItem(1))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter, horizontal menu, submenu more than root item.png');

  await t
    .click(menu.getItem(2))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter, horizontal menu, submenu less than root item.png');

  await setAttribute('#container', 'style', 'padding-top: 430px;');

  await t
    .click(menu.getItem(1))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter, horizontal menu, submenu more than root item, bottom collision.png');

  await t
    .click(menu.getItem(2))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter, horizontal menu, submenu less than root item, bottom collision.png');

  await setAttribute('#container', 'style', 'padding-left: 80px;');

  await t
    .click(menu.getItem(3))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter, horizontal menu, right collision.png');

  await setAttribute('#container', 'style', 'padding-top: 400px; padding-left: 80px;');

  await t
    .click(menu.getItem(2))
    .click(menu.getItem(3));

  await testScreenshot(t, takeScreenshot, 'Delimiter, horizontal menu, bottom right collision.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [500, 500]).before(async () => {
  const menuItems = [{
    text: 'Video Players',
  }, {
    text: 'Televisions',
    items: [{
      id: '2_1',
      text: 'SuperLCD 42',
    }, {
      id: '2_2',
      text: 'SuperLED 42',
    }, {
      id: '2_2',
      text: 'SuperLED 60',
    }],
  }, {
    text: 'Monitors',
    items: [{
      id: '3_1',
      text: '19"',
    }, {
      id: '3_2',
      text: '21"',
    }],
  }, {
    text: 'Projectors',
    items: [{
      id: '4_1',
      text: 'Projector Plus',
    }, {
      id: '4_2',
      text: 'Projector PlusHD',
    }, {
      id: '4_3',
      text: 'Projector & Screens',
    }],
  }] as Item[];

  return createWidget('dxMenu', { items: menuItems }, '#container');
});

safeSizeTest('Menu delimiter appearance when orientation is vertical', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu();

  await t
    .click(menu.getItem(2))
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter appearance, orientation is vertical.png');

  await setAttribute('#container', 'style', 'padding-top: 300px;');

  await t
    .click(menu.getItem(1))
    .pressKey('down')
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Delimiter appearance, orientation is vertical, bottom collision.png');

  await setAttribute('#container', 'style', 'padding-top: 0px; padding-left: 340px;');

  await t
    .click(menu.getItem(2));

  await testScreenshot(t, takeScreenshot, 'Delimiter appearance, orientation is vertical, right collision.png');

  await setAttribute('#container', 'style', 'padding-top: 300px; padding-left: 300px;');

  await t
    .click(menu.getItem(0))
    .click(menu.getItem(1));

  await testScreenshot(t, takeScreenshot, 'Delimiter appearance, orientation is vertical, bottom right collision.png');

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}, [500, 500]).before(async () => {
  const menuItems = [{
    text: 'Video Players',
  }, {
    text: 'Televisions',
    items: [{
      id: '2_1',
      text: 'SuperLCD 42',
    }, {
      id: '2_2',
      text: 'SuperLED 42',
    }, {
      id: '2_3',
      text: 'SuperLED 60',
    }, {
      id: '2_4',
      text: 'SuperLED 72',
    }, {
      id: '2_5',
      text: 'SuperLED 80',
    }, {
      id: '2_6',
      text: 'SuperLED 91',
    }],
  }, {
    text: 'Monitors',
    items: [{
      id: '3_1',
      text: '19"',
    }, {
      id: '3_2',
      text: '21"',
    }],
  }, {
    text: 'Projectors',
    items: [{
      id: '4_1',
      text: 'Projector Plus',
    }],
  }] as Item[];

  return createWidget('dxMenu', { items: menuItems, orientation: 'vertical' }, '#container');
});
