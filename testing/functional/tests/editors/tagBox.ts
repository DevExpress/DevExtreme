import { pathToFileURL } from 'url';
import { join } from  'path';
import TagBoxModel from '../../model/tagBox';

fixture `TagBox`
    .page(pathToFileURL(join(__dirname, './pages/tagBox.html')).href);

test('Keyboard navigation should work then tagBox is focused or list is focused', async t => {
    const tagBox = TagBoxModel('#tag-box');

    await t
        .click(tagBox.element)
        .expect(tagBox.isFocused).ok()
        .expect(tagBox.opened).ok();

    const list = await tagBox.list;
    const { selectAllItem } = list;

    await t
        // List is focused
        .pressKey('tab')
        .expect(selectAllItem.isFocused).ok()
        .pressKey('down down down')
        .expect(list.isItemFocused(2)).ok()
        .pressKey('down')
        .expect(selectAllItem.isFocused).ok()
        .pressKey('up up up')
        .expect(list.isItemFocused(0)).ok()
        .expect(list.isItemChecked(0)).notOk()
        .pressKey('space')
        .expect(list.isItemChecked(0)).ok()
        .pressKey('enter')
        .expect(list.isItemChecked(0)).notOk()


        // TagBox is focused
        .pressKey('shift+tab')
        .expect(tagBox.isFocused).ok()
        .pressKey('down')
        .expect(list.isItemFocused(1)).ok()
        .pressKey('down down')
        .expect(selectAllItem.isFocused).ok()
        .pressKey('up up up')
        .expect(list.isItemFocused(0)).ok()
        .expect(list.isItemChecked(0)).notOk()
        .pressKey('space')
        .expect(list.isItemChecked(0)).ok()
        .pressKey('enter')
        .expect(list.isItemChecked(0)).notOk();
});

test('Select all checkbox should be focused by tab and closed by escape (T389453)', async t => {
    const tagBox = TagBoxModel('#tag-box');

    await t
        .click(tagBox.element)
        .expect(tagBox.isFocused).ok()
        .expect(tagBox.opened).ok();

    const list = await tagBox.list;

    await t
        .pressKey('tab')
        .expect(tagBox.isFocused).notOk()
        .expect(list.selectAllItem.isFocused).ok()

        .pressKey('shift+tab')
        .expect(tagBox.isFocused).ok()
        .expect(list.selectAllItem.isFocused).notOk()

        .pressKey('tab')
        .expect(tagBox.isFocused).notOk()
        .expect(list.selectAllItem.isFocused).ok()

        .pressKey('esc')
        .expect(tagBox.isFocused).ok()
        .expect(tagBox.opened).notOk();
});
