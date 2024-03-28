import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`FileManager`
  .page(url(__dirname, '../container.html'));

test('Custom DropDown width for Material and Fluent themes', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const viewModeButton = Selector('.dx-filemanager-toolbar-viewmode-item');

  await t
    .click(viewModeButton);

  await testScreenshot(t, takeScreenshot, 'drop down width.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxFileManager', {
  name: 'fileManager',
  fileSystemProvider: [],
  height: 450,
}));
