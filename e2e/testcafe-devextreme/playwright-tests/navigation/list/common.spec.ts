import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, isMaterialBased, isFluent } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('List', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Should focus first item after changing selection mode (T811770)', async ({ page }) => {
    await createWidget(page, 'dxList', {
    items: ['item1', 'item2', 'item3'],
    showSelectionControls: true,
    selectionMode: 'all',
  });

    const list = page.locator('#container');
    const { selectAll } = list;
    const firstItemRadioButton = list.getItem().radioButton;

    await list.focus();

    expect(selectAll.checkBox.isFocused).toBeTruthy();

    await list.option('selectionMode', 'single');

    await list.focus();

    expect(firstItemRadioButton.isFocused).toBeTruthy();

    });

  test.skip('There is hover class in hovered list item (T1110076)', async ({ page }) => {
    await createWidget(page, 'dxList', {
    items: ['item1', 'item2', 'item3'],
    selectionMode: 'single',
  });

    const list = page.locator('#container');

    const firstItem = list.getItem(0);

    await dispatchEvent(firstItem.element, 'mousedown');
    await list.repaint();
    await dispatchEvent(firstItem.element, 'mouseup');

    const secondItem = list.getItem(1);

    expect(secondItem.isHovered).toBeFalsy()
      .hover(secondItem.element)
      .expect(secondItem.isHovered)
      .ok();

    });

  test.skip('List selection should work with keyboard arrows (T718398)', async ({ page }) => {
    await createWidget(page, 'dxList', {
    items: ['item1', 'item2', 'item3'],
    showSelectionControls: true,
    selectionMode: 'all',
  });

    const list = page.locator('#container');
    const firstItemCheckBox = list.getItem().checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;

    await list.focus();

    expect(selectAllCheckBox.isFocused).toBeTruthy()

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

    });

  test.skip('Should save focused checkbox', async ({ page }) => {
    await createWidget(page, 'dxList', {
    items: ['item1', 'item2', 'item3'],
    showSelectionControls: true,
    selectionMode: 'all',
  });

    const list = page.locator('#container');
    const secondItemCheckBox = list.getItem(1).checkBox;
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;

    await list.focus();

    expect(selectAllCheckBox.isFocused).toBeTruthy()

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

    });

  test.skip('Grouped list can not reorder items (T727360)', async ({ page }) => {

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

    await createWidget(page, 'dxList', {
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

    const list = page.locator('#container');
    const firstGroup = list.getGroup();
    const secondGroup = list.getGroup(1);
    const thirdGroup = list.getGroup(2);

    await page.click(secondGroup.header)
      .click(thirdGroup.header)

      .dragToElement(firstGroup.getItem().reorderHandle, firstGroup.getItem(1).element)
      .expect(firstGroup.getItem().text)
      .eql(isFluent() ? '11' : '12')
      .expect(firstGroup.getItem(1).text)
      .eql(isFluent() ? '12' : '11')

      .click(firstGroup.header)
      .click(secondGroup.header)

      .dragToElement(secondGroup.getItem().reorderHandle, secondGroup.getItem(1).element)
      .expect(secondGroup.getItem().text)
      .eql(isFluent() ? '21' : '22')
      .expect(secondGroup.getItem(1).text)
      .eql(isFluent() ? '22' : '21')

      .click(secondGroup.header)
      .click(thirdGroup.header)

      .dragToElement(thirdGroup.getItem().reorderHandle, thirdGroup.getItem(1).element)
      .expect(thirdGroup.getItem().text)
      .eql(isMaterialBased() ? '31' : '32')
      .expect(thirdGroup.getItem(1).text)
      .eql(isMaterialBased() ? '32' : '31');

    });

  test.skip('Grouped List with nested List should able to reorder items (T845082)', async ({ page }) => {

    const data = [
      { group: 'group1', text: 'value11' },
      {
        group: 'group1',
        text: 'value12',
        template: ClientFunction((_data, _index, element) => ($('<div>').appendTo(element) as any).dxList({
          items: ['value121', 'value122', 'value123'],
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

    await createWidget(page, 'dxList', {
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

    const list = page.locator('#container');
    const group = list.getGroup();

    await page.expect(group.getItem(0).text).eql('value11')
      .drag(group.getItem().reorderHandle, 0, await group.getItem(1).element.clientHeight)
      .expect(group.getItem(1).text)
      .eql('value11');

    });

  test.skip('Disabled item should be focused on tab press to match accessibility criteria', async ({ page }) => {
    await createWidget(page, 'dxList', {
    dataSource: [{ text: 'item1' }, { text: 'item2' }],
    searchEnabled: true,
  });

    const list = page.locator('#container');
    const { searchInput } = list;
    const firstItem = list.getItem();
    const secondItem = list.getItem(1);

    await page.click(searchInput)
      .pressKey('tab')
      .expect(firstItem.isFocused).ok()
      .expect(secondItem.isFocused)
      .notOk();

    await list.option('items[0].disabled', true);

    expect(firstItem.isDisabled).toBeTruthy()

      .click(searchInput)
      .pressKey('tab')
      .expect(firstItem.isFocused)
      .ok()
      .expect(secondItem.isFocused)
      .notOk();

    });

  test.skip('The delete button should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
    dataSource: [{
      text: 'item 1',
      icon: 'user',
    }],
    allowItemDeleting: true,
    itemDeleteMode: 'static',
  });

    const list = page.locator('#container');

    await list.focus();

    await testScreenshot(page, 'List delete button when item is focused.png');

    });

  test.skip('The button icon in custom template should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
    dataSource: [{ text: 'item 1' }],
    itemTemplate: (_, __, element) => {
      const button = ($('<div>') as any).dxButton({
        text: 'custom',
        icon: 'home',
      });

      element.append(button);
    },
  });

    const list = page.locator('#container');

    await list.focus();

    await testScreenshot(page, 'List icon in button when item is focused.png');

    });
});
