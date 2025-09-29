import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import FileManager from 'devextreme-testcafe-models/fileManager';
import { testScreenshot } from '../../helpers/themeUtils';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';

fixture.disablePageReloads`FileManager`
  .page(url(__dirname, '../container.html'));

test('Custom DropDown width for Material and Fluent themes', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const fileManager = new FileManager('#container');

  await t
    .click(fileManager.getToolbarViewModeItem());

  await testScreenshot(t, takeScreenshot, 'drop down width.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxFileManager', {
  name: 'fileManager',
  fileSystemProvider: [],
  height: 450,
}));

test('Thumbnails view - Should not focus the first item on right click (T1307139)', async (t) => {
  const fileManager = new FileManager('#container');

  await t
    .rightClick(fileManager.getThumbnailsViewScrollableContainer())
    .expect(fileManager.isThumbnailItemFocused(0)).notOk();
}).before(async () => createWidget('dxFileManager', {
  itemView: {
    mode: 'thumbnails',
  },
  name: 'fileManager',
  fileSystemProvider: [
    {
      name: 'Folder 1',
      isDirectory: true,
    },
    {
      name: 'File 1.txt',
      isDirectory: false,
    },
    {
      name: 'File 2.jpg',
      isDirectory: false,
    },
  ],
}));
