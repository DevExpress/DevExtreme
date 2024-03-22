import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';

fixture.disablePageReloads`Search`
  .page(url(__dirname, '../../container.html'));

test('List with search bar appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'List with search bar appearance.png', { element: '#container' });

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
