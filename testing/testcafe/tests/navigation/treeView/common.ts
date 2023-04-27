import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { employees } from './data.js';
import { setAttribute } from '../../../helpers/domUtils';
import TreeView from '../../../model/treeView';

fixture.disablePageReloads`TreeView`
  .page(url(__dirname, '../../container.html'));

test('treeview items should be focused in DOM elements order when navigating with tab and shift+tab', async (t) => {
  const treeView = new TreeView('#container');
  const selectAllItem = treeView.element.find('.dx-treeview-select-all-item');

  const SEARCH_BAR_CLASS = 'dx-treeview-search';
  const searchItem = treeView.element.find(`.${SEARCH_BAR_CLASS}`);

  const NODE_CLASS = 'dx-treeview-node';
  const treeviewNode = treeView.element.find(`.${NODE_CLASS}`);

  await t.pressKey('tab')
    .expect(searchItem.hasClass('dx-state-focused'))
    .ok()
    .pressKey('tab')
    .expect(selectAllItem.hasClass('dx-state-focused'))
    .ok()
    .pressKey('tab')
    .expect(treeviewNode.hasClass('dx-state-focused'))
    .ok()
    .pressKey('shift+tab')
    .expect(selectAllItem.hasClass('dx-state-focused'))
    .ok()
    .pressKey('shift+tab')
    .expect(searchItem.hasClass('dx-state-focused'))
    .ok();
}).before(async () => createWidget('dxTreeView', {
  searchEnabled: true,
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

[true, false].forEach((rtlEnabled) => {
  ['normal', 'none'].forEach((showCheckBoxesMode) => {
    test(`TreeView with custom expander icons,showCheckBoxesMode=${showCheckBoxesMode}`, async (t) => {
      const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

      const screenshotName = `Treeview with custom icons cbm=${showCheckBoxesMode},rtl=${rtlEnabled}.png`;

      await t.click(Selector('.dx-treeview-item').nth(1));

      await testScreenshot(t, takeScreenshot, screenshotName, { element: '#container', shouldTestInCompact: true });

      await t
        .expect(compareResults.isValid())
        .ok(compareResults.errorMessages());
    }).before(async () => createWidget('dxTreeView', {
      items: employees,
      width: 300,
      showCheckBoxesMode,
      rtlEnabled,
      expandIcon: 'add',
      collapseIcon: 'minus',
      itemTemplate(item) {
        return `<div>${item.fullName} (${item.position})</div>`;
      },
    }));
  });
});
