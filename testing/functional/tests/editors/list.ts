import { Selector } from 'testcafe';
import { pathToFileURL } from 'url';
import { join } from  'path';
import List from '../../model/list';

fixture `List`
    .page(pathToFileURL(join(__dirname, './pages/t718398.html')).href);

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

fixture `List T727360`
    .page(url(__dirname, './pages/t727360.html'));

test("Grouped list can not reorder items (T727360)", async t => {
    const list = new List('#list');
    const firstGroup = list.getGroup();
    const secondGroup = list.getGroup(1);
    const thirdGroup = list.getGroup(2);

    await t
        .click(secondGroup.header)
        .click(thirdGroup.header)

        .dragToElement(firstGroup.getItem().reorderHandle, firstGroup.getItem(1).element)
        .expect(firstGroup.getItem().text).eql('value12')
        .expect(firstGroup.getItem(1).text).eql('value11')

        .click(firstGroup.header)
        .click(secondGroup.header)

        .dragToElement(secondGroup.getItem().reorderHandle, secondGroup.getItem(1).element)
        .expect(secondGroup.getItem().text).eql('value22')
        .expect(secondGroup.getItem(1).text).eql('value21')

        .click(secondGroup.header)
        .click(thirdGroup.header)

        .dragToElement(thirdGroup.getItem().reorderHandle, thirdGroup.getItem(1).element)
        .expect(thirdGroup.getItem().text).eql('value32')
        .expect(thirdGroup.getItem(1).text).eql('value31');
});
