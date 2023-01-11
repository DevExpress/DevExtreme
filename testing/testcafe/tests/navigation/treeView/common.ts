import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot, isMaterial } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import createWidget from '../../../helpers/createWidget';
// eslint-disable-next-line import/extensions
import { employees } from './data.js';
import { setAttribute } from '../../../helpers/domUtils';
// import TreeView from '../../../model/treeView';

fixture.disablePageReloads`TreeView`
  .page(url(__dirname, '../../container.html'));

test('TreeView: the height calculates incorrectly when searchEnabled is true (T1138605)', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  // const treeView = new TreeView('#container');
  // const scrollable = treeView.getScrollable();

  // (scrollable as any).scrollTo(1000);

  const scrollableContainer = Selector('.dx-scrollable-container');
  await t.scroll(scrollableContainer, 'bottom');

  await testScreenshot(t, takeScreenshot, 'TreeView scrollable has correct height.png', { element: '#container' });

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
