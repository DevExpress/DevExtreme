import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { employees } from './data.js';
import { setAttribute } from '../../../helpers/domUtils';
import TreeView from '../../../model/treeView';

fixture.disablePageReloads`TreeView`
  .page(url(__dirname, '../../container.html'));

test('Treeview search, selectAll item and nodes should be focused in DOM elements order when navigating with tab and shift+tab', async (t) => {
  const treeView = new TreeView('#container');
  const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
  const searchTextBox = treeView.getSearchTextBox();
  const node = treeView.getNode(0);

  await t.pressKey('tab')
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
}).before(async () => createWidget('dxTreeView', {
  searchEnabled: true,
  showCheckBoxesMode: 'selectAll',
  items: employees,
}));

test('Treeview items focus order should be correct when changing showCheckBoxesMode from normal to selectAll at runtime', async (t) => {
  const treeView = new TreeView('#container');
  const node = treeView.getNode(0);

  await treeView.option('showCheckBoxesMode', 'selectAll');

  const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

  await t
    .pressKey('tab')
    .expect(selectAllItemCheckBox.isFocused)
    .ok()
    .pressKey('tab')
    .expect(node.isFocused)
    .ok();
}).before(async () => createWidget('dxTreeView', {
  showCheckBoxesMode: 'normal',
  items: employees,
}));

test('Treeview items focus order should be correct when changing showCheckBoxesMode from none to selectAll at runtime', async (t) => {
  const treeView = new TreeView('#container');
  const node = treeView.getNode(0);

  await treeView.option('showCheckBoxesMode', 'selectAll');

  const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

  await t.pressKey('tab')
    .expect(selectAllItemCheckBox.isFocused)
    .ok()
    .pressKey('tab')
    .expect(node.isFocused)
    .ok();
}).before(async () => createWidget('dxTreeView', {
  showCheckBoxesMode: 'none',
  items: employees,
}));

test('Treeview items focus order should be correct when changing showCheckBoxesMode at runtime with search enabled', async (t) => {
  const treeView = new TreeView('#container');
  const searchBar = treeView.getSearchTextBox();
  const node = treeView.getNode(0);

  await treeView.option('showCheckBoxesMode', 'selectAll');

  const selectAllItemCheckBox = treeView.getSelectAllCheckBox();

  await t.pressKey('tab')
    .expect(searchBar.isFocused)
    .ok()
    .pressKey('tab')
    .expect(selectAllItemCheckBox.isFocused)
    .ok()
    .pressKey('tab')
    .expect(node.isFocused)
    .ok();
}).before(async () => createWidget('dxTreeView', {
  searchEnabled: true,
  showCheckBoxesMode: 'normal',
  items: employees,
}));

test('Treeview items focus order should be correct when changing search panel mode at runtime', async (t) => {
  const treeView = new TreeView('#container');
  const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
  const node = treeView.getNode(0);

  await treeView.option('searchEnabled', 'true');

  const searchBar = treeView.getSearchTextBox();

  await t.pressKey('tab')
    .expect(searchBar.isFocused)
    .ok()
    .pressKey('tab')
    .expect(selectAllItemCheckBox.isFocused)
    .ok()
    .pressKey('tab')
    .expect(node.isFocused)
    .ok();
}).before(async () => createWidget('dxTreeView', {
  searchEnabled: false,
  showCheckBoxesMode: 'selectAll',
  items: employees,
}));

test('Treeview node container should be focused after selectAll item when navigating with tab when no search bar is present', async (t) => {
  const treeView = new TreeView('#container');
  const selectAllItemCheckBox = treeView.getSelectAllCheckBox();
  const node = treeView.getNode(0);

  await t.pressKey('tab')
    .expect(selectAllItemCheckBox.isFocused)
    .ok()
    .pressKey('tab')
    .expect(node.isFocused)
    .ok();
}).before(async () => createWidget('dxTreeView', {
  showCheckBoxesMode: 'selectAll',
  items: employees,
}));

test('TreeView: height should be calculated correctly when searchEnabled is true (T1138605)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const treeView = new TreeView('#container');
  const scrollable = treeView.getScrollable();

  await scrollable.scrollTo({ top: 1000 });

  await testScreenshot(t, takeScreenshot, 'TreeView scrollable has correct height.png', {
    element: '#container',
    shouldTestInCompact: true,
    compactCallBack: async () => {
      await scrollable.scrollTo({ top: 1000 });
    },
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxTreeView', {
  width: 300,
  height: 350,
  searchEnabled: true,
  items: employees,
  itemTemplate(item) {
    return `<div>${item.fullName} (${item.position})</div>`;
  },
}));

[true, false].forEach((rtlEnabled) => {
  ['selectAll', 'normal', 'none'].forEach((showCheckBoxesMode) => {
    test(`TreeView-selectAll,showCheckBoxesMode=${showCheckBoxesMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const screenshotName = `TreeView selection cbm=${showCheckBoxesMode},rtl=${rtlEnabled}.png`;

      await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container' });

      if (!isMaterial()) {
        await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.dark' });
        await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', theme: 'generic.contrast' });
      }

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => {
      await setAttribute('#container', 'class', 'dx-theme-generic-typography');

      return createWidget('dxTreeView', {
        items: employees,
        width: 300,
        selectionMode: 'multiple',
        showCheckBoxesMode,
        rtlEnabled,
        itemTemplate(item) {
          return `<div>${item.fullName} (${item.position})</div>`;
        },
      });
    });
  });
});
