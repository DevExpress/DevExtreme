import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { testScreenshot } from '../../helpers/themeUtils';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

const TEST_FILE = './images/test-image-1.png';

fixture.disablePageReloads`FileUploader - file list visibility`.page(url(__dirname, '../container.html'));

[true, false].forEach((showFileList) => {
  test(`FileUploader with showFileList: ${showFileList} - after file selected`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const container = Selector('#container');

    console.log('Container: ', container);

    await testScreenshot(t, takeScreenshot, `fileuploader-show-filelist-${showFileList}.png`, {
      element: '#container',
    });

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  }).before(async () => { await createWidget('dxFileUploader', { showFileList, value: TEST_FILE }); });
});
