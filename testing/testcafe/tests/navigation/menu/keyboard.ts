import { Selector } from 'testcafe';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Menu from '../../../model/menu';

fixture`Menu_keyboard`
  .page(url(__dirname, '../../container.html'));

test('keyboard navigation should work after click on a root item if showFirstSubmenuMode is "onClick"', async (t) => {
  const menu = new Menu();

  await t
    .click(menu.getItem(0))
    .pressKey('down')
    .pressKey('right')
    .pressKey('down');

  const focusedElement = menu.getItem(2);

  await t
    .expect(focusedElement.innerText)
    .eql('item_1_1_1')
    .expect(menu.isElementFocused(focusedElement))
    .eql(true);
}).before(async () => createWidget('dxMenu', {
  items: [{
    text: 'Item 1',
    items: [{
      text: 'item 1_1',
      items: [{
        text: 'item_1_1_1',
      }],
    }],
  }],
  showFirstSubmenuMode: 'onClick',
  hideSubmenuOnMouseLeave: true,
}));

test('keyboard navigation should work after hover a root item if showFirstSubmenuMode is "onHover"', async (t) => {
  const menu = new Menu();

  await t
    .click(Selector('body'))
    .hover(menu.getItem(0))
    .pressKey('down')
    .pressKey('right')
    .pressKey('down');

  const focusedElement = menu.getItem(2);

  await t
    .expect(focusedElement.innerText)
    .eql('item_1_1_1')
    .expect(menu.isElementFocused(focusedElement))
    .eql(true);
}).before(async () => createWidget('dxMenu', {
  items: [{
    text: 'Item 1',
    items: [{
      text: 'item 1_1',
      items: [{
        text: 'item_1_1_1',
      }],
    }],
  }],
  showFirstSubmenuMode: 'onHover',
  hideSubmenuOnMouseLeave: true,
}));

test('menu should be closed after press on "escape" key when submenu was shown by click, showFirstSubmenuMode="onClick" (T1115916)', async (t) => {
  const menu = new Menu();

  await t
    .click(Selector('body'))
    .click(menu.getItem(0));

  const submenu = menu.getSubMenuInstance(menu.getItem(0));

  await t
    .expect(submenu.option('visible'))
    .eql(true)
    .pressKey('esc')
    .expect(submenu.option('visible'))
    .eql(false);
}).before(async () => createWidget('dxMenu', {
  items: [{
    text: 'Item 1',
    items: [{
      text: 'item 1_1',
      items: [{
        text: 'item_1_1_1',
      }],
    }],
  }],
  showFirstSubmenuMode: 'onClick',
  hideSubmenuOnMouseLeave: true,
}));

test('menu should be closed after press on "escape" key when submenu was shown by hover, showFirstSubmenuMode="onHover" (T1115916)', async (t) => {
  const menu = new Menu();

  await t
    .click(Selector('body'))
    .hover(menu.getItem(0));

  const submenu = menu.getSubMenuInstance(menu.getItem(0));

  await t
    .expect(submenu.option('visible'))
    .eql(true)
    .pressKey('esc')
    .expect(submenu.option('visible'))
    .eql(false);
}).before(async () => createWidget('dxMenu', {
  items: [{
    text: 'Item 1',
    items: [{
      text: 'item 1_1',
      items: [{
        text: 'item_1_1_1',
      }],
    }],
  }],
  showFirstSubmenuMode: 'onHover',
  hideSubmenuOnMouseLeave: true,
}));
