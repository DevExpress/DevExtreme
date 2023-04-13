import { ClientFunction } from 'testcafe';
import { isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import List from '../../../model/list';
import createWidget from '../../../helpers/createWidget';

fixture`List`
  .page(url(__dirname, '../../container.html'));

test('Should focus first item after changing selection mode (T811770)', async (t) => {
  const list = new List('#container');
  const { selectAll } = list;
  const firstItemRadioButton = list.getItem().radioButton;

  await list.focus();

  await t
    .expect(selectAll.checkBox.isFocused).ok();

  await list.option('selectionMode', 'single');

  await list.focus();

  await t
    .expect(firstItemRadioButton.isFocused)
    .ok();
}).before(async () => createWidget('dxList', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode: 'all',
}));

test('There is hover class in hovered list item (T1110076)', async (t) => {
  const list = new List('#container');

  const firstItem = list.getItem(0);

  await t.dispatchEvent(firstItem.element, 'mousedown');
  await list.repaint();
  await t.dispatchEvent(firstItem.element, 'mouseup');

  const secondItem = list.getItem(1);

  await t
    .expect(secondItem.isHovered)
    .notOk()
    .hover(secondItem.element)
    .expect(secondItem.isHovered)
    .ok();
}).before(async () => createWidget('dxList', {
  items: ['item1', 'item2', 'item3'],
  selectionMode: 'single',
}));

test('List selection should work with keyboard arrows (T718398)', async (t) => {
  const list = new List('#container');
  const firstItemCheckBox = list.getItem().checkBox;
  const secondItemCheckBox = list.getItem(1).checkBox;
  const thirdItemCheckBox = list.getItem(2).checkBox;
  const { selectAll } = list;
  const selectAllCheckBox = selectAll.checkBox;

  await list.focus();

  await t
    .expect(selectAllCheckBox.isFocused).ok()

    .pressKey('down')
    .expect(selectAllCheckBox.isFocused)
    .notOk()
    .expect(firstItemCheckBox.isFocused)
    .ok()

    .pressKey('down')
    .expect(firstItemCheckBox.isFocused)
    .notOk()
    .expect(secondItemCheckBox.isFocused)
    .ok()

    .pressKey('down')
    .expect(secondItemCheckBox.isFocused)
    .notOk()
    .expect(thirdItemCheckBox.isFocused)
    .ok()

    .pressKey('down')
    .expect(thirdItemCheckBox.isFocused)
    .notOk()
    .expect(selectAllCheckBox.isFocused)
    .ok()

    .pressKey('down')
    .expect(selectAllCheckBox.isFocused)
    .notOk()
    .expect(firstItemCheckBox.isFocused)
    .ok()

    .pressKey('up')
    .expect(firstItemCheckBox.isFocused)
    .notOk()
    .expect(selectAll.isFocused)
    .ok()

    .pressKey('up')
    .expect(selectAllCheckBox.isFocused)
    .notOk()
    .expect(thirdItemCheckBox.isFocused)
    .ok()

    .pressKey('up')
    .expect(thirdItemCheckBox.isFocused)
    .notOk()
    .expect(secondItemCheckBox.isFocused)
    .ok()

    .pressKey('tab')
    .expect(selectAllCheckBox.isFocused)
    .notOk()
    .expect(secondItemCheckBox.isFocused)
    .notOk();
}).before(async () => createWidget('dxList', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode: 'all',
}));

test('Should save focused checkbox', async (t) => {
  const list = new List('#container');
  const secondItemCheckBox = list.getItem(1).checkBox;
  const { selectAll } = list;
  const selectAllCheckBox = selectAll.checkBox;

  await list.focus();

  await t
    .expect(selectAllCheckBox.isFocused).ok()

    .pressKey('down down')
    .expect(secondItemCheckBox.isFocused)
    .ok()
    .expect(selectAllCheckBox.isFocused)
    .notOk()

    .pressKey('shift+tab')
    .expect(secondItemCheckBox.isFocused)
    .notOk()
    .expect(selectAllCheckBox.isFocused)
    .notOk()

    .pressKey('tab')
    .expect(secondItemCheckBox.isFocused)
    .ok()
    .expect(selectAllCheckBox.isFocused)
    .notOk()

    .pressKey('up up')
    .expect(selectAllCheckBox.isFocused)
    .ok()
    .expect(secondItemCheckBox.isFocused)
    .notOk()

    .pressKey('shift+tab')
    .expect(secondItemCheckBox.isFocused)
    .notOk()
    .expect(selectAllCheckBox.isFocused)
    .notOk()

    .pressKey('tab')
    .expect(selectAllCheckBox.isFocused)
    .ok()
    .expect(secondItemCheckBox.isFocused)
    .notOk();
}).before(async () => createWidget('dxList', {
  items: ['item1', 'item2', 'item3'],
  showSelectionControls: true,
  selectionMode: 'all',
}));

test('Grouped list can not reorder items (T727360)', async (t) => {
  const list = new List('#container');
  const firstGroup = list.getGroup();
  const secondGroup = list.getGroup(1);
  const thirdGroup = list.getGroup(2);

  await t
    .click(secondGroup.header)
    .click(thirdGroup.header)

    .dragToElement(firstGroup.getItem().reorderHandle, firstGroup.getItem(1).element)
    .expect(firstGroup.getItem().text)
    .eql('12')
    .expect(firstGroup.getItem(1).text)
    .eql('11')

    .click(firstGroup.header)
    .click(secondGroup.header)

    .dragToElement(secondGroup.getItem().reorderHandle, secondGroup.getItem(1).element)
    .expect(secondGroup.getItem().text)
    .eql('22')
    .expect(secondGroup.getItem(1).text)
    .eql('21')

    .click(secondGroup.header)
    .click(thirdGroup.header)

    .dragToElement(thirdGroup.getItem().reorderHandle, thirdGroup.getItem(1).element)
    .expect(thirdGroup.getItem().text)
    .eql(isMaterial() ? '31' : '32')
    .expect(thirdGroup.getItem(1).text)
    .eql(isMaterial() ? '32' : '31');
}).before(async () => {
  const data = [
    { group: 'group1', value: '11' },
    { group: 'group1', value: '12' },
    { group: 'group1', value: '13' },
    { group: 'group2', value: '21' },
    { group: 'group2', value: '22' },
    { group: 'group2', value: '23' },
    { group: 'group2', value: '24' },
    { group: 'group2', value: '25' },
    { group: 'group2', value: '26' },
    { group: 'group2', value: '27' },
    { group: 'group2', value: '28' },
    { group: 'group2', value: '29' },
    { group: 'group2', value: '20' },
    { group: 'group3', value: '31' },
    { group: 'group3', value: '32' },
    { group: 'group3', value: '33' },
    { group: 'group3', value: '34' },
    { group: 'group3', value: '35' },
    { group: 'group3', value: '36' },
    { group: 'group3', value: '37' },
    { group: 'group3', value: '38' },
    { group: 'group3', value: '39' },
    { group: 'group3', value: '30' },
  ];

  return createWidget('dxList', {
    dataSource: {
      store: data,
      group: 'group',
    },
    itemDragging: {
      allowReordering: true,
    },
    collapsibleGroups: true,
    grouped: true,
    itemTemplate: ({ value }, _, el) => el.append($('<b>').text(value)),
  });
});

test('Grouped List with nested List should able to reorder items (T845082)', async (t) => {
  const list = new List('#container');
  const group = list.getGroup();

  await t
    .expect(group.getItem(0).text).eql('value11')
    .dragToElement(group.getItem().reorderHandle, group.getItem(1).element)
    .expect(group.getItem(1).text)
    .eql('value11');
}).before(async () => {
  const data = [
    { group: 'group1', text: 'value11' },
    {
      group: 'group1',
      text: 'value12',
      template: ClientFunction((_data, _index, element) => ($('<div>').appendTo(element) as any).dxList({
        items: ['value121', 'value122', 'value123'],
        // eslint-disable-next-line @typescript-eslint/no-shadow
        itemTemplate: (data, _index, element) => {
          $(element)
            .text(data)
            .parent()
            .addClass('nested-item');
        },
      })),
    },
    { group: 'group1', text: 'value13' },
  ];

  return createWidget('dxList', {
    dataSource: {
      store: data,
      group: 'group',
    },
    itemDragging: {
      allowReordering: true,
    },
    collapsibleGroups: true,
    grouped: true,
  });
});

test('Disabled item should be focused on tab press to match accessibility criteria', async (t) => {
  const list = new List('#container');
  const { searchInput } = list;
  const firstItem = list.getItem();
  const secondItem = list.getItem(1);

  await t
    .click(searchInput)
    .pressKey('tab')
    .expect(firstItem.isFocused).ok()
    .expect(secondItem.isFocused)
    .notOk();

  await list.option('items[0].disabled', true);

  await t
    .expect(firstItem.isDisabled)
    .ok()

    .click(searchInput)
    .pressKey('tab')
    .expect(firstItem.isFocused)
    .ok()
    .expect(secondItem.isFocused)
    .notOk();
}).before(async () => createWidget('dxList', {
  dataSource: [{ text: 'item1' }, { text: 'item2' }],
  searchEnabled: true,
}));
