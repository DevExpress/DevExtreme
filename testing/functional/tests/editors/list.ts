import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import List from '../../model/list';

fixture `List`
    .page(url(__dirname, './pages/t718398.html'));

test("List selection should work with keyboard arrows (T718398)", async t => {
    const list = new List('#list');
    const input = Selector('#input');
    const firstItemCheckBox = list.getItem().checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;

    await t
        .click(input)
        .pressKey('tab')
        .expect(selectAllCheckBox.isFocused).ok()

        .pressKey('down')
        .expect(selectAllCheckBox.isFocused).notOk()
        .expect(firstItemCheckBox.isFocused).ok()

        .pressKey('down')
        .expect(firstItemCheckBox.isFocused).notOk()
        .expect(secondItemCheckBox.isFocused).ok()

        .pressKey('down')
        .expect(secondItemCheckBox.isFocused).notOk()
        .expect(thirdItemCheckBox.isFocused).ok()

        .pressKey('down')
        .expect(thirdItemCheckBox.isFocused).notOk()
        .expect(selectAllCheckBox.isFocused).ok()

        .pressKey('down')
        .expect(selectAllCheckBox.isFocused).notOk()
        .expect(firstItemCheckBox.isFocused).ok()

        .pressKey('up')
        .expect(firstItemCheckBox.isFocused).notOk()
        .expect(selectAll.isFocused).ok()

        .pressKey('up')
        .expect(selectAllCheckBox.isFocused).notOk()
        .expect(thirdItemCheckBox.isFocused).ok()

        .pressKey('up')
        .expect(thirdItemCheckBox.isFocused).notOk()
        .expect(secondItemCheckBox.isFocused).ok()

        .pressKey('tab')
        .expect(selectAllCheckBox.isFocused).notOk()
        .expect(secondItemCheckBox.isFocused).notOk();
});

test("Should save focused checkbox", async t => {
    const list = new List('#list');
    const input = Selector('#input');
    const secondItemCheckBox = list.getItem(1).checkBox;
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;

    await t
        .click(input)
        .pressKey('tab')
        .expect(selectAllCheckBox.isFocused).ok()

        .pressKey('down down')
        .expect(secondItemCheckBox.isFocused).ok()
        .expect(selectAllCheckBox.isFocused).notOk()

        .pressKey('shift+tab')
        .expect(secondItemCheckBox.isFocused).notOk()
        .expect(selectAllCheckBox.isFocused).notOk()

        .pressKey('tab')
        .expect(secondItemCheckBox.isFocused).ok()
        .expect(selectAllCheckBox.isFocused).notOk()

        .pressKey('up up')
        .expect(selectAllCheckBox.isFocused).ok()
        .expect(secondItemCheckBox.isFocused).notOk()

        .pressKey('shift+tab')
        .expect(secondItemCheckBox.isFocused).notOk()
        .expect(selectAllCheckBox.isFocused).notOk()

        .pressKey('tab')
        .expect(selectAllCheckBox.isFocused).ok()
        .expect(secondItemCheckBox.isFocused).notOk();
});
