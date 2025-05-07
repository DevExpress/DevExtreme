import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import List from 'devextreme-testcafe-models/list';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Search`
  .page(url(__dirname, '../../container.html'));

test('List with search bar appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const list = new List('#container');

  await testScreenshot(t, takeScreenshot, 'List with search and multiple selection.png', {
    element: '#container',
    shouldTestInCompact: true,
  });

  await list.option('selectionMode', 'single');

  await testScreenshot(t, takeScreenshot, 'List with search and single selection.png', {
    element: '#container',
    shouldTestInCompact: true,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const dataSource = Array.from({ length: 40 }, (_, i) => `Item_${i + 1}`);

  return createWidget('dxList', {
    dataSource,
    height: 400,
    width: 200,
    searchEnabled: true,
    showSelectionControls: true,
    selectionMode: 'all',
    selectByClick: false,
  });
});
