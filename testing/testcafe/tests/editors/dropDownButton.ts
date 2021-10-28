import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import DropDownButton from '../../model/dropDownButton';

fixture`Drop Down Button`
  .page(url(__dirname, './pages/t817436.html'));

test('Item collection should be updated after direct option changing (T817436)', async (t) => {
  const dropDownButton1 = new DropDownButton('#drop-down-button1');
  const dropDownButton2 = new DropDownButton('#drop-down-button2');
  const disableFirstItems = Selector('#disable');

  await t.click(dropDownButton1.element);
  const list1 = await dropDownButton1.getList();
  await t.click(dropDownButton2.element);
  const list2 = await dropDownButton2.getList();

  await t
    .expect(list1.getItem().isDisabled).notOk()
    .expect(list2.getItem().isDisabled).notOk()
    .click(disableFirstItems)

    .click(dropDownButton1.element)
    .expect(list1.getItem().isDisabled)
    .ok()
    .click(dropDownButton2.element)
    .expect(list2.getItem().isDisabled)
    .ok();
});

fixture`Drop Down Button's Popup`
  .page(url(__dirname, './pages/T1034931.html'));

test('Popup should have correct postion when DropDownButton is placed in the right bottom(T1034931)', async (t) => {
  const dropDownButton = new DropDownButton('#dropDownButton');

  await t.click(dropDownButton.element);

  const dropDownButtonRect = {
    top: await dropDownButton.element.getBoundingClientRectProperty('top'),
    left: await dropDownButton.element.getBoundingClientRectProperty('left'),
  };

  const popupContent = Selector('.dx-overlay-content');
  const popupContentRect = {
    bottom: await popupContent.getBoundingClientRectProperty('bottom'),
    left: await popupContent.getBoundingClientRectProperty('left'),
  };

  await t
    .expect(Math.abs(dropDownButtonRect.left - popupContentRect.left))
    .lt(1)
    .expect(Math.abs(dropDownButtonRect.left - popupContentRect.left))
    .lt(1);
});
