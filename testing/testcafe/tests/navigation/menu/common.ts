import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import {
  insertStylesheetRulesToPage,
  appendElementTo, setAttribute,
} from '../../../helpers/domUtils';
import { screenshotTestFn, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import { Item } from '../../../../../js/ui/menu.d';
import Menu from '../../../model/menu';

fixture.disablePageReloads`Menu_common`
  .page(url(__dirname, '../../container.html'));

test('Menu items render', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const menu = new Menu();

  const actionFn = async () => {
    await t
      .click(menu.getItem(0))
      .pressKey('down')
      .pressKey('down')
      .pressKey('right');
  };

  await actionFn();

  if (!isMaterial()) {
    await screenshotTestFn(t, takeScreenshot, 'Menu render items.png', '#container', false, undefined, 'generic.dark');
    await screenshotTestFn(t, takeScreenshot, 'Menu render items.png', '#container', false, undefined, 'generic.contrast');
  }

  await screenshotTestFn(t, takeScreenshot, 'Menu render items.png', '#container', true, async () => {
    await menu.repaint();
    await actionFn();
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
        { text: 'user', icon: 'user' },
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
    { text: 'coffee', icon: 'coffee' },
  ] as Item[];

  return createWidget('dxMenu', { items: menuItems, cssClass: 'custom-class' }, true, '#menu');
});
