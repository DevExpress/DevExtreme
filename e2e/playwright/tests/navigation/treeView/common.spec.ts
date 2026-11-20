import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { setAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import TextBox from '../../../models/textBox';
import TreeView from '../../../models/treeView';
import { employees } from './data';

test.describe('TreeView', () => {
  test('Treeview search, selectAll item and nodes should be focused in DOM elements order when navigating with tab and shift+tab', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      searchEnabled: true,
      showCheckBoxesMode: 'selectAll',
      items: employees,
    });

    const treeView = new TreeView(page, '#container');
    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
    const searchTextBox = new TextBox(page, treeView.getSearchTextBox());
    const node = treeView.getNode(0);

    await page.keyboard.press('Tab');
    await searchTextBox.expectFocused();
    await page.keyboard.press('Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Tab');
    await node.expectFocused();
    await page.keyboard.press('Shift+Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Shift+Tab');
    await searchTextBox.expectFocused();
  });

  test('Treeview items focus order should be correct when changing showCheckBoxesMode from normal to selectAll at runtime', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      showCheckBoxesMode: 'normal',
      items: employees,
    });

    const treeView = new TreeView(page, '#container');
    const node = treeView.getNode(0);

    await treeView.option('showCheckBoxesMode', 'selectAll');

    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

    await page.keyboard.press('Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Tab');
    await node.expectFocused();
  });

  test('Treeview items focus order should be correct when changing showCheckBoxesMode from none to selectAll at runtime', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      showCheckBoxesMode: 'none',
      items: employees,
    });

    const treeView = new TreeView(page, '#container');
    const node = treeView.getNode(0);

    await treeView.option('showCheckBoxesMode', 'selectAll');

    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

    await page.keyboard.press('Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Tab');
    await node.expectFocused();
  });

  test('Treeview items focus order should be correct when changing showCheckBoxesMode at runtime with search enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      searchEnabled: true,
      showCheckBoxesMode: 'normal',
      items: employees,
    });

    const treeView = new TreeView(page, '#container');
    const searchBar = new TextBox(page, treeView.getSearchTextBox());
    const node = treeView.getNode(0);

    await treeView.option('showCheckBoxesMode', 'selectAll');

    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

    await page.keyboard.press('Tab');
    await searchBar.expectFocused();
    await page.keyboard.press('Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Tab');
    await node.expectFocused();
  });

  test('Treeview items focus order should be correct when changing search panel mode at runtime', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      searchEnabled: false,
      showCheckBoxesMode: 'selectAll',
      items: employees,
    });

    const treeView = new TreeView(page, '#container');
    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
    const node = treeView.getNode(0);

    await treeView.option('searchEnabled', 'true');

    const searchBar = new TextBox(page, treeView.getSearchTextBox());

    await page.keyboard.press('Tab');
    await searchBar.expectFocused();
    await page.keyboard.press('Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Tab');
    await node.expectFocused();
  });

  test('Treeview node container should be focused after selectAll item when navigating with tab when no search bar is present', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      showCheckBoxesMode: 'selectAll',
      items: employees,
    });

    const treeView = new TreeView(page, '#container');
    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
    const node = treeView.getNode(0);

    await page.keyboard.press('Tab');
    await selectAllItemCheckBox.expectFocused();
    await page.keyboard.press('Tab');
    await node.expectFocused();
  });

  test('TreeView: height should be calculated correctly when searchEnabled is true (T1138605)', async ({ page }) => {
    await createWidget(page, 'dxTreeView', (items) => ({
      width: 300,
      height: 350,
      searchEnabled: true,
      items,
      itemTemplate(item) {
        return `<div>${item.fullName} (${item.position})</div>`;
      },
    }), undefined, { arg: employees });

    const treeView = new TreeView(page, '#container');

    await treeView.getScrollable().evaluate((element) => {
      ($(element) as any).dxScrollable('instance').scrollTo({ top: 1000 });
    });

    await testScreenshot(page, 'TreeView scrollable has correct height.png', { element: '#container' });
  });

  [true, false].forEach((rtlEnabled) => {
    ['selectAll', 'normal', 'none'].forEach((showCheckBoxesMode) => {
      const testName = `TreeView selection showCheckBoxesMode=${showCheckBoxesMode},rtl=${rtlEnabled}`;

      test(testName, async ({ page }) => {
        await setAttribute(page, '#container', 'class', 'dx-theme-generic-typography');

        await createWidget(page, 'dxTreeView', ({ items, mode, rtl }) => ({
          items,
          width: 300,
          selectionMode: 'multiple',
          showCheckBoxesMode: mode,
          rtlEnabled: rtl,
          itemTemplate(item) {
            return `<div>${item.fullName} (${item.position})</div>`;
          },
        }), undefined, { arg: { items: employees, mode: showCheckBoxesMode, rtl: rtlEnabled } });

        await testScreenshot(page, `${testName}.png`, { element: '#container' });
      });
    });
  });

  ['normal', 'none'].forEach((showCheckBoxesMode) => {
    const testName = `Treeview with custom icons showCheckBoxesMode=${showCheckBoxesMode}`;

    test(testName, async ({ page }) => {
      await createWidget(page, 'dxTreeView', ({ items, mode }) => ({
        items,
        width: 300,
        showCheckBoxesMode: mode,
        expandIcon: 'add',
        collapseIcon: 'minus',
        itemTemplate(item) {
          return `<div>${item.fullName} (${item.position})</div>`;
        },
      }), undefined, { arg: { items: employees, mode: showCheckBoxesMode } });

      await page.locator('.dx-treeview-item').nth(1).click();

      await testScreenshot(page, `${testName}.png`, { element: '#container' });
    });
  });

  test('TreeView checkBox focus styles', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: [{
        ID: '1',
        text: 'Item 1',
        expanded: true,
        items: [
          {
            ID: '1_1',
            text: 'Item 1_1',
            selected: true,
          }, {
            ID: '1_2',
            text: 'Item 1_2',
          },
        ],
      }],
      width: 300,
      showCheckBoxesMode: 'normal',
    });

    await page.keyboard.press('Tab');

    await testScreenshot(page, 'Treeview indeterminate CheckBox focus.png', { element: '#container' });

    await page.keyboard.press('ArrowDown');

    await testScreenshot(page, 'Treeview checked CheckBox focus.png', { element: '#container' });

    await page.keyboard.press('ArrowDown');

    await testScreenshot(page, 'Treeview unchecked CheckBox focus.png', { element: '#container' });
  });
});
