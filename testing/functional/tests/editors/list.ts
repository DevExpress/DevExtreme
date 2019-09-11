import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import List from '../../model/list';

fixture `List`
    .page(url(__dirname, './pages/t718398.html'));

test("Should focus first item after changing selection mode (T811770)", async t => {
    const list = new List('#list');
    const input = Selector('#input');
    const switchSelectionMode = Selector('#button');
    const { selectAll } = list;
    const firstItemRadioButton = list.getItem().radioButton;

    await t
        .click(input)
        .pressKey('tab')
        .expect(selectAll.checkBox.isFocused).ok()

        .click(switchSelectionMode)

        .click(input)
        .pressKey('tab')
        .expect(firstItemRadioButton.isFocused).ok();
});

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

test("Grouped list can not reorder items (T727360)", async t => {
    const list = new List('#list');

    await t
        .navigateTo(url(__dirname, './pages/t727360.html'))
        .click(list.getGroup(1).header)
        .click(list.getGroup(2).header)

        .dragToElement(list.getItem().reorderHandle, list.getItem(1).element)
        .expect(list.getItem().text).eql('value12')
        .expect(list.getItem(1).text).eql('value11')

        .click(list.getGroup().header)
        .click(list.getGroup(1).header)

        .dragToElement(list.getItem(3).reorderHandle, list.getItem(4).element)
        .expect(list.getItem(3).text).eql('value22')
        .expect(list.getItem(4).text).eql('value21')

        .click(list.getGroup(1).header)
        .click(list.getGroup(2).header)

        .dragToElement(list.getItem(13).reorderHandle, list.getItem(14).element)
        .expect(list.getItem(13).text).eql('value32')
        .expect(list.getItem(14).text).eql('value31');
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
