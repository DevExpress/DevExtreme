import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { testScreenshot } from '../../helpers/themeUtils';
import { createWidget } from '../../helpers/createWidget';
import url from '../../helpers/getPageUrl';

const TEST_FILE = './images/test-image-1.png';

fixture.disablePageReloads`FileUploader - file list visibility`.page(url(__dirname, '../../container.html'));

[true, false].forEach((showFileList) => {
  test(`FileUploader with showFileList: ${showFileList} - after file selected`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const input = Selector('.dx-fileuploader input[type=file]');

    await t.setFilesToUpload(input, [TEST_FILE]);

    await testScreenshot(t, takeScreenshot, `fileuploader-show-filelist-${showFileList}.png`, {
      element: '#container',
    });

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  }).before(async () => {
    await createWidget('dxFileUploader', { showFileList });
  });
});
