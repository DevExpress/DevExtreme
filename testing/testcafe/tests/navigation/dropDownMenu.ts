import url from '../../helpers/getPageUrl';
import createWidget from '../../helpers/createWidget';
import DropDownMenu from '../../model/dropDownMenu';
import { appendElementTo } from './helpers/domUtils';

fixture`DropDownMenu`
  .page(url(__dirname, '../container.html'));

test('Drop down button should lost hover state', async (t) => {
  const dropDownMenu = new DropDownMenu('#container');

  await t
    .click(dropDownMenu.element)
    .expect(dropDownMenu.isHovered)
    .ok()
    .hover('#button')
    .expect(dropDownMenu.isHovered)
    .notOk();
}).before(async () => {
  await appendElementTo('body', 'button', 'button', {
    width: '50px', height: '50px', backgroundColor: 'steelblue',
  });

  await createWidget('dxDropDownMenu', {
    items: [{ text: 'item1' }, { text: 'item2' }, { text: 'item3' }],
  });
});
