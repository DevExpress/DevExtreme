import { compareScreenshot } from 'devextreme-screenshot-comparer';
import url from '../../../helpers/getPageUrl';
import TagBox from '../../../model/tagBox';
import createWidget from '../../../helpers/createWidget';

fixture`TagBox`
  .page(url(__dirname, '../../container.html'));

test('Keyboard navigation should work then tagBox is focused or list is focused', async (t) => {
  const tagBox = new TagBox('#container');

  await t
    .click(tagBox.element);

  await t
    .expect(tagBox.isFocused).ok()
    .expect(await tagBox.isOpened())
    .ok();

  const list = await tagBox.getList();
  const { selectAll } = list;
  const selectAllCheckBox = selectAll.checkBox;
  const firstItemCheckBox = list.getItem().checkBox;
  const secondItemCheckBox = list.getItem(1).checkBox;
  const thirdItemCheckBox = list.getItem(2).checkBox;

  await t
  // List is focused
    .pressKey('tab')
    .expect(selectAllCheckBox.isFocused).ok()
    .pressKey('down down down')
    .expect(thirdItemCheckBox.isFocused)
    .ok()
    .pressKey('down')
    .expect(selectAllCheckBox.isFocused)
    .ok()
    .pressKey('up up up')
    .expect(firstItemCheckBox.isFocused)
    .ok()
    .expect(firstItemCheckBox.isChecked)
    .notOk()
    .pressKey('space')
    .expect(firstItemCheckBox.isChecked)
    .ok()
    .pressKey('enter')
    .expect(firstItemCheckBox.isChecked)
    .notOk()

  // TagBox is focused
    .pressKey('shift+tab')
    .expect(tagBox.isFocused)
    .ok()
    .pressKey('down')
    .expect(secondItemCheckBox.isFocused)
    .ok()
    .pressKey('down down')
    .expect(selectAllCheckBox.isFocused)
    .ok()
    .pressKey('up up up')
    .expect(firstItemCheckBox.isFocused)
    .ok()
    .expect(firstItemCheckBox.isChecked)
    .notOk()
    .pressKey('space')
    .expect(firstItemCheckBox.isChecked)
    .ok()
    .pressKey('enter')
    .expect(firstItemCheckBox.isChecked)
    .notOk();
}).before(async () => createWidget('dxTagBox', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode: 'all',
  applyValueMode: 'useButtons',
}, true));

test('Select all checkbox should be focused by tab and closed by escape (T389453)', async (t) => {
  const tagBox = new TagBox('#container');

  await t
    .click(tagBox.element);

  await t
    .expect(tagBox.isFocused).ok()
    .expect(await tagBox.isOpened())
    .ok();

  const list = await tagBox.getList();
  const { selectAll } = list;
  const selectAllCheckBox = selectAll.checkBox;

  await t
    .pressKey('tab')
    .expect(tagBox.isFocused).notOk()
    .expect(selectAllCheckBox.isFocused)
    .ok()

    .pressKey('shift+tab')
    .expect(tagBox.isFocused)
    .ok()
    .expect(selectAllCheckBox.isFocused)
    .notOk()

    .pressKey('tab')
    .expect(tagBox.isFocused)
    .notOk()
    .expect(selectAllCheckBox.isFocused)
    .ok();

  await t
    .pressKey('esc');

  await t
    .expect(tagBox.isFocused)
    .ok()
    .expect(await tagBox.isOpened())
    .notOk();
}).before(async () => createWidget('dxTagBox', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode: 'all',
  applyValueMode: 'useButtons',
}, true));

test('Placeholder is visible after items option change when value is not chosen (T1099804)', async (t) => {
  const tagBox = new TagBox('#container');

  await tagBox.option('items', [1, 2, 3]);

  await t
    .expect(await compareScreenshot(t, 'TagBox_placeholder_after_items_change_if_value_is_not_choosen.png', '#container'))
    .ok();
}).before(async () => createWidget('dxTagBox', {
  width: 300,
  placeholder: 'Choose a value',
}));
