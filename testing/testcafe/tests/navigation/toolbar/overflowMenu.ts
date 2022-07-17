import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
import Toolbar from '../../../model/toolbar/toolbar';
import { appendElementTo } from '../helpers/domUtils';

fixture`Toolbar_OverflowMenu`
  .page(url(__dirname, '../../container.html'));

test('Drop down button should lost hover and active state', async (t) => {
  const toolbar = new Toolbar('#container');
  const dropDownMenu = toolbar.getOverflowMenu();

  await t
    .dispatchEvent(dropDownMenu.element, 'mousedown')
    .expect(dropDownMenu.isActive)
    .ok()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isHovered)
    .notOk()
    .dispatchEvent(dropDownMenu.element, 'mouseup')
    .expect(dropDownMenu.isActive)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isHovered)
    .notOk();

  await t
    .click(dropDownMenu.element)
    .expect(dropDownMenu.isActive)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .ok()
    .expect(dropDownMenu.isHovered)
    .ok();

  await t
    .hover('#button')
    .expect(dropDownMenu.isHovered)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isActive)
    .notOk();

  await t
    .click('#button')
    .expect(dropDownMenu.isHovered)
    .notOk()
    .expect(dropDownMenu.isFocused)
    .notOk()
    .expect(dropDownMenu.isActive)
    .notOk();
}).before(async () => {
  await appendElementTo('body', 'button', 'button', {
    width: '50px', height: '50px', backgroundColor: 'steelblue', paddingTop: '400px',
  });

  return createWidget('dxToolbar', {
    items: [
      { text: 'item1', locateInMenu: 'always' },
      { text: 'item2', locateInMenu: 'always' },
      { text: 'item3', locateInMenu: 'always' }],
  });
});

test('Click on overflow button should prevent popup\'s hideOnOutsideClick', async (t) => {
  const toolbar = new Toolbar('#container');
  const menu = toolbar.getOverflowMenu();

  await t
    .click(menu.element)
    .expect(menu.getPopup().getWrapper().count)
    .eql(1);

  await t
    .click(menu.element)
    .expect(menu.getPopup().getWrapper().count)
    .eql(0);
}).before(async () => createWidget('dxToolbar', {
  items: [{ text: 'item1' }, { text: 'item2' }, { text: 'item3' }],
}));
