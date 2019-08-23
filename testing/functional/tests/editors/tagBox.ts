import { pathToFileURL } from 'url';
import { join } from  'path';
import TagBoxModel from '../../model/tagBox';

fixture `TagBox`
    .page(pathToFileURL(join(__dirname, './pages/tagBox.html')).href);

test('Select all checkbox should be focused by tab and closed by escape (T389453)', async t => {
    const tagBox = TagBoxModel('#tag-box');

    await t
        .click(tagBox.mainElement)
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
