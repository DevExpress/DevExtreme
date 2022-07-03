import url from '../../../helpers/getPageUrl';
import DropDownButton from '../../../model/dropDownButton';
import createWidget from '../../../helpers/createWidget';

fixture`Drop Down Button`
  .page(url(__dirname, '../../container.html'));

test('Item collection should be updated after direct option changing (T817436)', async (t) => {
  const dropDownButton1 = new DropDownButton('#container');
  const dropDownButton2 = new DropDownButton('#otherContainer');

  await t.click(dropDownButton1.element);
  const list1 = await dropDownButton1.getList();
  await t.click(dropDownButton2.element);
  const list2 = await dropDownButton2.getList();

  await t
    .expect(list1.getItem().isDisabled).notOk()
    .expect(list2.getItem().isDisabled).notOk();

  await dropDownButton1.option('items[0].disabled', true);
  await dropDownButton2.option('dataSource[0].disabled', true);

  await t
    .click(dropDownButton1.element)
    .expect(list1.getItem().isDisabled)
    .ok()
    .click(dropDownButton2.element)
    .expect(list2.getItem().isDisabled)
    .ok();
}).before(async () => {
  await createWidget('dxDropDownButton', {
    dataSource: [{ text: 'text1' }, { text: 'text2' }],
    displayExpr: 'text',
  }, false, '#otherContainer');

  return createWidget('dxDropDownButton', {
    items: [{ text: 'text1' }, { text: 'text2' }],
    displayExpr: 'text',
  });
});
