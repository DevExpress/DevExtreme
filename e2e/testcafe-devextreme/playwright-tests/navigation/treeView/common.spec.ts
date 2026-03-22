import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, setAttribute } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('TreeView', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Treeview search, selectAll item and nodes should be focused in DOM elements order when navigating with tab and shift+tab', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    searchEnabled: true,
    showCheckBoxesMode: 'selectAll',
    items: employees,
  });

    const treeView = page.locator('#container');
    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
    const searchTextBox = treeView.getSearchTextBox();
    const node = treeView.getNode(0);

    await page.keyboard.press('Tab')
      .expect(searchTextBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(node.isFocused)
      .ok()
      .pressKey('shift+tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('shift+tab')
      .expect(searchTextBox.isFocused)
      .ok();

    });

  test('Treeview items focus order should be correct when changing showCheckBoxesMode from normal to selectAll at runtime', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    showCheckBoxesMode: 'normal',
    items: employees,
  });

    const treeView = page.locator('#container');
    const node = treeView.getNode(0);

    await treeView.option('showCheckBoxesMode', 'selectAll');

    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

    await page.keyboard.press('Tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(node.isFocused)
      .ok();

    });

  test('Treeview items focus order should be correct when changing showCheckBoxesMode from none to selectAll at runtime', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    showCheckBoxesMode: 'none',
    items: employees,
  });

    const treeView = page.locator('#container');
    const node = treeView.getNode(0);

    await treeView.option('showCheckBoxesMode', 'selectAll');

    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

    await page.keyboard.press('Tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(node.isFocused)
      .ok();

    });

  test('Treeview items focus order should be correct when changing showCheckBoxesMode at runtime with search enabled', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    searchEnabled: true,
    showCheckBoxesMode: 'normal',
    items: employees,
  });

    const treeView = page.locator('#container');
    const searchBar = treeView.getSearchTextBox();
    const node = treeView.getNode(0);

    await treeView.option('showCheckBoxesMode', 'selectAll');

    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

    await page.keyboard.press('Tab')
      .expect(searchBar.isFocused)
      .ok()
      .pressKey('tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(node.isFocused)
      .ok();

    });

  test('Treeview items focus order should be correct when changing search panel mode at runtime', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    searchEnabled: false,
    showCheckBoxesMode: 'selectAll',
    items: employees,
  });

    const treeView = page.locator('#container');
    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
    const node = treeView.getNode(0);

    await treeView.option('searchEnabled', 'true');

    const searchBar = treeView.getSearchTextBox();

    await page.keyboard.press('Tab')
      .expect(searchBar.isFocused)
      .ok()
      .pressKey('tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(node.isFocused)
      .ok();

    });

  test('Treeview node container should be focused after selectAll item when navigating with tab when no search bar is present', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    showCheckBoxesMode: 'selectAll',
    items: employees,
  });

    const treeView = page.locator('#container');
    const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
    const node = treeView.getNode(0);

    await page.keyboard.press('Tab')
      .expect(selectAllItemCheckBox.isFocused)
      .ok()
      .pressKey('tab')
      .expect(node.isFocused)
      .ok();

    });

  test('TreeView: height should be calculated correctly when searchEnabled is true (T1138605)', async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
    width: 300,
    height: 350,
    searchEnabled: true,
    items: employees,
    itemTemplate(item) {
      return `<div>${item.fullName} (${item.position})</div>`;
    },
  });

    const treeView = page.locator('#container');
    const scrollable = treeView.getScrollable();

    await scrollable.scrollTo({ top: 1000 });

    await testScreenshot(page, 'TreeView scrollable has correct height.png', { element: '#container' });

    });

  [true, false].forEach((rtlEnabled) => {
    ['selectAll', 'normal', 'none'].forEach((showCheckBoxesMode) => {
      const testName = `TreeView selection showCheckBoxesMode=${showCheckBoxesMode},rtl=${rtlEnabled}`;
      test(testName, async ({ page }) => {

        await setAttribute(page, '#container', 'class', 'dx-theme-generic-typography');

        await createWidget(page, 'dxTreeView', {
          items: employees,
          width: 300,
          selectionMode: 'multiple',
          showCheckBoxesMode,
          rtlEnabled,
          itemTemplate(item) {
            return `<div>${item.fullName} (${item.position})</div>`;
          },
        });


        await testScreenshot(page, `${testName}.png`, { element: '#container' });

    });
    });
  });

  ['normal', 'none'].forEach((showCheckBoxesMode) => {
    const testName = `Treeview with custom icons showCheckBoxesMode=${showCheckBoxesMode}`;
    test(testName, async ({ page }) => {
    await createWidget(page, 'dxTreeView', {
      items: employees,
      width: 300,
      showCheckBoxesMode,
      expandIcon: 'add',
      collapseIcon: 'minus',
      itemTemplate(item) {
        return `<div>${item.fullName} (${item.position})</div>`;
      },
    });

      await click(page.locator('.dx-treeview-item').nth(1));

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
