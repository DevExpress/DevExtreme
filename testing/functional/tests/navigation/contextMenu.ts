import { Selector } from 'testcafe';
import url from '../../helpers/getPageUrl';
import ContextMenu from '../../model/contextMenu';

fixture `ContextMenu`
    .page(url(__dirname, './pages/contextMenu.html'));

// test("Should focus first item after changing selection mode (T811770)", async t => {
//     const list = new List('#list');
//     const input = Selector('#input');
//     const switchSelectionMode = Selector('#button');
//     const { selectAll } = list;
//     const firstItemRadioButton = list.getItem().radioButton;

//     await t
//         .click(input)
//         .pressKey('tab')
//         .expect(selectAll.checkBox.isFocused).ok()

//         .click(switchSelectionMode)

//         .click(input)
//         .pressKey('tab')
//         .expect(firstItemRadioButton.isFocused).ok();
// });

test("Context menu should shown in the same position when item was added in runtime", async t => {
    const contextMenu = new ContextMenu('#contextMenu');
    const target = Selector('#menuTarget');
    // const firstItemCheckBox = list.getItem().checkBox;
    // const secondItemCheckBox = list.getItem(1).checkBox;
    // const thirdItemCheckBox = list.getItem(2).checkBox;
    // const { selectAll } = list;
    // const selectAllCheckBox = selectAll.checkBox;

    await t
        .click(target)
        .pressKey('tab')
        .expect(false).ok()

    await t
});

// test("Should save focused checkbox", async t => {
//     const list = new List('#list');
//     const input = Selector('#input');
//     const secondItemCheckBox = list.getItem(1).checkBox;
//     const { selectAll } = list;
//     const selectAllCheckBox = selectAll.checkBox;

//     await t
//         .click(input)
//         .pressKey('tab')
//         .expect(selectAllCheckBox.isFocused).ok()

//         .pressKey('down down')
//         .expect(secondItemCheckBox.isFocused).ok()
//         .expect(selectAllCheckBox.isFocused).notOk()

//         .pressKey('shift+tab')
//         .expect(secondItemCheckBox.isFocused).notOk()
//         .expect(selectAllCheckBox.isFocused).notOk()

//         .pressKey('tab')
//         .expect(secondItemCheckBox.isFocused).ok()
//         .expect(selectAllCheckBox.isFocused).notOk()

//         .pressKey('up up')
//         .expect(selectAllCheckBox.isFocused).ok()
//         .expect(secondItemCheckBox.isFocused).notOk()

//         .pressKey('shift+tab')
//         .expect(secondItemCheckBox.isFocused).notOk()
//         .expect(selectAllCheckBox.isFocused).notOk()

//         .pressKey('tab')
//         .expect(selectAllCheckBox.isFocused).ok()
//         .expect(secondItemCheckBox.isFocused).notOk();
// });

// fixture `List T727360`
//     .page(url(__dirname, './pages/t727360.html'));

// test("Grouped list can not reorder items (T727360)", async t => {
//     const list = new List('#list');
//     const firstGroup = list.getGroup();
//     const secondGroup = list.getGroup(1);
//     const thirdGroup = list.getGroup(2);

//     await t
//         .click(secondGroup.header)
//         .click(thirdGroup.header)

//         .dragToElement(firstGroup.getItem().reorderHandle, firstGroup.getItem(1).element)
//         .expect(firstGroup.getItem().text).eql('value12')
//         .expect(firstGroup.getItem(1).text).eql('value11')

//         .click(firstGroup.header)
//         .click(secondGroup.header)

//         .dragToElement(secondGroup.getItem().reorderHandle, secondGroup.getItem(1).element)
//         .expect(secondGroup.getItem().text).eql('value22')
//         .expect(secondGroup.getItem(1).text).eql('value21')

//         .click(secondGroup.header)
//         .click(thirdGroup.header)

//         .dragToElement(thirdGroup.getItem().reorderHandle, thirdGroup.getItem(1).element)
//         .expect(thirdGroup.getItem().text).eql('value32')
//         .expect(thirdGroup.getItem(1).text).eql('value31');
// });

// fixture `List T815151`
//     .page(url(__dirname, './pages/t815151.html'));

// test("Disabled item should not have focus (T815151)", async t => {
//     const list = new List('#list');
//     const { searchInput } = list;
//     const firstItem = list.getItem();
//     const secondItem = list.getItem(1);
//     const disableFirstItem = Selector('#disable');

//     await t
//         .click(firstItem.element)
//         .expect(firstItem.isFocused).ok()

//         .click(disableFirstItem)
//         .expect(firstItem.isDisabled).ok()

//         .click(searchInput)
//         .pressKey('tab')
//         .expect(firstItem.isFocused).notOk()
//         .expect(secondItem.isFocused).ok();
// });
