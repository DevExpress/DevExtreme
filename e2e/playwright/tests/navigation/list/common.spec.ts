import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { dragToElement, dragToOffset } from '../../../helpers/dragUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import { isFluent, isMaterialBased } from '../../../helpers/themeUtils';
import List from '../../../models/list';

test.describe('List', () => {
  test('Should focus first item after changing selection mode (T811770)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
    });

    const list = new List(page, '#container');
    const { selectAll } = list;
    const firstItemRadioButton = list.getItem().radioButton;

    await list.focus();

    await selectAll.checkBox.expectFocused();

    await list.option('selectionMode', 'single');

    await list.focus();

    await firstItemRadioButton.expectFocused();
  });

  test('There is hover class in hovered list item (T1110076)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      selectionMode: 'single',
    });

    const list = new List(page, '#container');
    const firstItem = list.getItem(0);

    await firstItem.element.dispatchEvent('mousedown');
    await list.repaint();
    await firstItem.element.dispatchEvent('mouseup');

    const secondItem = list.getItem(1);

    await secondItem.expectHovered(false);
    await secondItem.element.hover();
    await secondItem.expectHovered();
  });

  test('List selection should work with keyboard arrows (T718398)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
    });

    const list = new List(page, '#container');
    const firstItemCheckBox = list.getItem().checkBox;
    const secondItemCheckBox = list.getItem(1).checkBox;
    const thirdItemCheckBox = list.getItem(2).checkBox;
    const { selectAll } = list;
    const selectAllCheckBox = selectAll.checkBox;

    await list.focus();

    await selectAllCheckBox.expectFocused();

    await page.keyboard.press('ArrowDown');
    await selectAllCheckBox.expectFocused(false);
    await firstItemCheckBox.expectFocused();

    await page.keyboard.press('ArrowDown');
    await firstItemCheckBox.expectFocused(false);
    await secondItemCheckBox.expectFocused();

    await page.keyboard.press('ArrowDown');
    await secondItemCheckBox.expectFocused(false);
    await thirdItemCheckBox.expectFocused();

    await page.keyboard.press('ArrowDown');
    await thirdItemCheckBox.expectFocused(false);
    await selectAllCheckBox.expectFocused();

    await page.keyboard.press('ArrowDown');
    await selectAllCheckBox.expectFocused(false);
    await firstItemCheckBox.expectFocused();

    await page.keyboard.press('ArrowUp');
    await firstItemCheckBox.expectFocused(false);
    await selectAll.expectFocused();

    await page.keyboard.press('ArrowUp');
    await selectAllCheckBox.expectFocused(false);
    await thirdItemCheckBox.expectFocused();

    await page.keyboard.press('ArrowUp');
    await thirdItemCheckBox.expectFocused(false);
    await secondItemCheckBox.expectFocused();

    await page.keyboard.press('Tab');
    await selectAllCheckBox.expectFocused(false);
    await secondItemCheckBox.expectFocused(false);
  });

  test('Should save focused checkbox', async ({ page }) => {
    await createWidget(page, 'dxList', {
      items: ['item1', 'item2', 'item3'],
      showSelectionControls: true,
      selectionMode: 'all',
    });

    const list = new List(page, '#container');
    const secondItemCheckBox = list.getItem(1).checkBox;
    const selectAllCheckBox = list.selectAll.checkBox;

    await list.focus();

    await selectAllCheckBox.expectFocused();

    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await secondItemCheckBox.expectFocused();
    await selectAllCheckBox.expectFocused(false);

    await page.keyboard.press('Shift+Tab');
    await secondItemCheckBox.expectFocused(false);
    await selectAllCheckBox.expectFocused(false);

    await page.keyboard.press('Tab');
    await secondItemCheckBox.expectFocused();
    await selectAllCheckBox.expectFocused(false);

    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowUp');
    await selectAllCheckBox.expectFocused();
    await secondItemCheckBox.expectFocused(false);

    await page.keyboard.press('Shift+Tab');
    await secondItemCheckBox.expectFocused(false);
    await selectAllCheckBox.expectFocused(false);

    await page.keyboard.press('Tab');
    await selectAllCheckBox.expectFocused();
    await secondItemCheckBox.expectFocused(false);
  });

  test('Grouped list can not reorder items (T727360)', async ({ page, theme }) => {
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

    await createWidget(page, 'dxList', (store) => ({
      dataSource: {
        store,
        group: 'group',
      },
      itemDragging: {
        allowReordering: true,
      },
      collapsibleGroups: true,
      grouped: true,
      itemTemplate: ({ value }, _, el) => el.append($('<b>').text(value)),
    }), undefined, { arg: data });

    const list = new List(page, '#container');
    const firstGroup = list.getGroup();
    const secondGroup = list.getGroup(1);
    const thirdGroup = list.getGroup(2);

    await secondGroup.header.click();
    await thirdGroup.header.click();

    await dragToElement(page, firstGroup.getItem().reorderHandle, firstGroup.getItem(1).element);
    await expect(firstGroup.getItem().element).toHaveText(isFluent(theme) ? '11' : '12');
    await expect(firstGroup.getItem(1).element).toHaveText(isFluent(theme) ? '12' : '11');

    await firstGroup.header.click();
    await secondGroup.header.click();

    await dragToElement(page, secondGroup.getItem().reorderHandle, secondGroup.getItem(1).element);
    await expect(secondGroup.getItem().element).toHaveText(isFluent(theme) ? '21' : '22');
    await expect(secondGroup.getItem(1).element).toHaveText(isFluent(theme) ? '22' : '21');

    await secondGroup.header.click();
    await thirdGroup.header.click();

    await dragToElement(page, thirdGroup.getItem().reorderHandle, thirdGroup.getItem(1).element);
    await expect(thirdGroup.getItem().element).toHaveText(isMaterialBased(theme) ? '31' : '32');
    await expect(thirdGroup.getItem(1).element).toHaveText(isMaterialBased(theme) ? '32' : '31');
  });

  test('Grouped List with nested List should able to reorder items (T845082)', async ({ page }) => {
    await createWidget(page, 'dxList', () => ({
      dataSource: {
        store: [
          { group: 'group1', text: 'value11' },
          {
            group: 'group1',
            text: 'value12',
            template: (_data, _index, element) => ($('<div>').appendTo(element) as any).dxList({
              items: ['value121', 'value122', 'value123'],
              itemTemplate: (data, _itemIndex, itemElement) => {
                $(itemElement)
                  .text(data)
                  .parent()
                  .addClass('nested-item');
              },
            }),
          },
          { group: 'group1', text: 'value13' },
        ],
        group: 'group',
      },
      itemDragging: {
        allowReordering: true,
      },
      collapsibleGroups: true,
      grouped: true,
    }));

    const list = new List(page, '#container');
    const group = list.getGroup();

    await expect(group.getItem(0).element).toHaveText('value11');

    const secondItemHeight = await group.getItem(1).element
      .evaluate((element) => element.clientHeight);

    await dragToOffset(page, group.getItem().reorderHandle, 0, secondItemHeight);
    await expect(group.getItem(1).element).toHaveText('value11');
  });

  test('Disabled item should be focused on tab press to match accessibility criteria', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: [{ text: 'item1' }, { text: 'item2' }],
      searchEnabled: true,
    });

    const list = new List(page, '#container');
    const { searchInput } = list;
    const firstItem = list.getItem();
    const secondItem = list.getItem(1);

    await searchInput.click();
    await page.keyboard.press('Tab');
    await firstItem.expectFocused();
    await secondItem.expectFocused(false);

    await list.option('items[0].disabled', true);

    await firstItem.expectDisabled();

    await searchInput.click();
    await page.keyboard.press('Tab');
    await firstItem.expectFocused();
    await secondItem.expectFocused(false);
  });

  test('The delete button should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', {
      dataSource: [{
        text: 'item 1',
        icon: 'user',
      }],
      allowItemDeleting: true,
      itemDeleteMode: 'static',
    });

    const list = new List(page, '#container');

    await list.focus();

    await testScreenshot(page, 'List delete button when item is focused.png');
  });

  test('The button icon in custom template should be displayed correctly after the list item focused (T1216108)', async ({ page }) => {
    await createWidget(page, 'dxList', () => ({
      dataSource: [{ text: 'item 1' }],
      itemTemplate: (_, __, element) => {
        const button = ($('<div>') as any).dxButton({
          text: 'custom',
          icon: 'home',
        });

        element.append(button);
      },
    }));

    const list = new List(page, '#container');

    await list.focus();

    await testScreenshot(page, 'List icon in button when item is focused.png');
  });
});
