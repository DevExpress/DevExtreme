/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import Menu from '../../../model/menu';
import {
  setAttribute, appendElementTo,
} from '../../../helpers/domUtils';

fixture.disablePageReloads`Link`
  .page(url(__dirname, '../../container.html'));

test('Items should have links if item.url is set', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu();

  await t.click(menu.getItem(0));

  await testScreenshot(t, takeScreenshot, 'Items should have links if item.url is set.png', { element: '#container' });

  await t
    .pressKey('down')
    .pressKey('down')
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Items without link should have correct focus style.png', { element: '#container' });

  await t
    .pressKey('down')
    .pressKey('down')
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Items with link should have correct focus style.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'menu');

  await setAttribute('#container', 'style', 'width: 400px; height: 400px;');

  return createWidget('dxMenu', {
    displayExpr: 'name',
    items: [{
      id: '1',
      name: 'Items',
      items: [{
        id: '1-1',
        name: 'Item 1',
      }, {
        id: '1-2',
        icon: 'more',
      }, {
        id: '1-3',
        name: 'Item 2',
        icon: 'bookmark',
      }, {
        id: '1-4',
        name: 'Item 3',
        url: 'https://js.devexpress.com/',
      }, {
        id: '1-5',
        icon: 'more',
        url: 'https://js.devexpress.com/',
      }, {
        id: '1-6',
        name: 'Item 4',
        icon: 'bookmark',
        url: 'https://js.devexpress.com/',
      }],
    }],
  }, '#menu');
});

test('Adaptive mode: items should have links if item.url is set', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const menu = new Menu(true);

  await t.click(menu.getHamburgerButton())
    .click(menu.items(0));

  await testScreenshot(t, takeScreenshot, 'Items with links.png', { element: '#container' });

  await t.pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Items without links.png', { element: '#container' });

  await t
    .pressKey('down')
    .pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Items with link and icon focus.png', { element: '#container' });

  await t.pressKey('down');

  await testScreenshot(t, takeScreenshot, 'Items mode with link focus.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'menu');

  await setAttribute('#container', 'style', 'width: 200px; height: 400px;');

  return createWidget('dxMenu', {
    displayExpr: 'name',
    adaptivityEnabled: true,
    items: [{
      id: '1',
      name: 'Items',
      items: [{
        id: '1-1',
        name: 'Item 1',
      }, {
        id: '1-2',
        icon: 'more',
      }, {
        id: '1-3',
        name: 'Item 2',
        icon: 'unlock',
        url: 'https://js.devexpress.com/',
      }, {
        id: '1-4',
        name: 'Item 3',
        url: 'https://js.devexpress.com/',
      }],
    },
    {
      id: '2',
      name: 'Items',
    },
    {
      id: '3',
      name: 'Items',
    },
    {
      id: '4',
      name: 'Items',
    },
    ],
  }, '#menu');
});
