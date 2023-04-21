/* eslint-disable no-restricted-syntax */
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
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
