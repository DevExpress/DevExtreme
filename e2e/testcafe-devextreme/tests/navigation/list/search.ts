import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../../helpers/themeUtils';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setAttribute } from '../../../helpers/domUtils';

fixture.disablePageReloads`Search`
  .page(url(__dirname, '../../container.html'));

test('List with search bar appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'List with search.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await setAttribute('#container', 'style', 'display: flex; gap: 40px; padding: 8px; width: fit-content;');

  const dataSource = Array.from({ length: 8 }, (_, i) => `Item_${i + 1}`);
  const selectionModes = ['none', 'single', 'multiple', 'all'];

  await Promise.all(selectionModes.map((mode) => appendElementTo('#container', 'div', `list-${mode}`)));
  await Promise.all(selectionModes.map((mode) => createWidget('dxList', {
    dataSource,
    height: 400,
    width: 200,
    searchEnabled: true,
    showSelectionControls: true,
    selectionMode: mode,
  }, `#list-${mode}`)));
});
