import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import SelectBox from '../../../model/selectBox';
import createWidget from '../../../helpers/createWidget';

fixture`SelectBox_placeholder`
  .page(url(__dirname, '../../container.html'));

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const selectBox = new SelectBox('#container');

  await selectBox.option('items', [1, 2, 3]);

  await t
    .expect(await compareScreenshot(t, 'SelectBox_placeholder_after_items_change_if_value_is_not_choosen.png', '#container'))
    .ok();
}).before(async () => createWidget('dxSelectBox', {
  width: 300,
  placeholder: 'Choose a value',
}));
