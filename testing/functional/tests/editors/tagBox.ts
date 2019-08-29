import { pathToFileURL } from 'url';
import { join } from  'path';
import TagBox from '../../model/tagBox';

fixture `TagBox`
    .page(pathToFileURL(join(__dirname, './pages/tagBox.html')).href);

test('Keyboard navigation should work then tagBox is focused or list is focused', async t => {
    const tagBox = new TagBox('#tag-box');

    await t
        .click(tagBox.element)
        .expect(tagBox.isFocused).ok()
        .expect(tagBox.opened).ok();

    const list = await tagBox.getList();
    const { selectAll } = list;
    const selectAllChackBox = selectAll.checkBox;
    const firstItemCheckBox = list.getItem().checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;

    await t
        // List is focused
        .pressKey('tab')
        .expect(selectAllChackBox.isFocused).ok()
        .pressKey('down down down')
        .expect(thirdItemCheckBox.isFocused).ok()
        .pressKey('down')
        .expect(selectAllChackBox.isFocused).ok()
        .pressKey('up up up')
        .expect(firstItemCheckBox.isFocused).ok()
        .expect(firstItemCheckBox.isChecked).notOk()
        .pressKey('space')
        .expect(firstItemCheckBox.isChecked).ok()
        .pressKey('enter')
        .expect(firstItemCheckBox.isChecked).notOk()


        // TagBox is focused
        .pressKey('shift+tab')
        .expect(tagBox.isFocused).ok()
        .pressKey('down')
        .expect(secondItemCheckBox.isFocused).ok()
        .pressKey('down down')
        .expect(selectAllChackBox.isFocused).ok()
        .pressKey('up up up')
        .expect(firstItemCheckBox.isFocused).ok()
        .expect(firstItemCheckBox.isChecked).notOk()
        .pressKey('space')
        .expect(firstItemCheckBox.isChecked).ok()
        .pressKey('enter')
        .expect(firstItemCheckBox.isChecked).notOk();
});

test('Select all checkbox should be focused by tab and closed by escape (T389453)', async t => {
    const tagBox = new TagBox('#tag-box');

    await t
        .click(tagBox.element)
        .expect(tagBox.isFocused).ok()
        .expect(tagBox.opened).ok();

    const list = await tagBox.getList();
    const { selectAll } = list;
    const selectAllChackBox = selectAll.checkBox;

    await t
        .pressKey('tab')
        .expect(tagBox.isFocused).notOk()
        .expect(selectAllChackBox.isFocused).ok()

        .pressKey('shift+tab')
        .expect(tagBox.isFocused).ok()
        .expect(selectAllChackBox.isFocused).notOk()

        .pressKey('tab')
        .expect(tagBox.isFocused).notOk()
        .expect(selectAllChackBox.isFocused).ok()

        .pressKey('esc')
        .expect(tagBox.isFocused).ok()
        .expect(tagBox.opened).notOk();
});
