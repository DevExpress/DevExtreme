import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import FileUploader from 'devextreme-testcafe-models/fileUploader';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

const TEST_FILE = './images/test-image-1.png';

fixture`FileUploader - file list visibility`
  .page(url(__dirname, '../../container.html'));

[true, false].forEach((showFileList) => {
  test(`FileUploader with showFileList: ${showFileList} - after file selected`, async (t) => {
    const fileUploader = new FileUploader('#container');
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.setFilesToUpload(fileUploader.input, [TEST_FILE]);

    await testScreenshot(t, takeScreenshot, `fileuploader-show-filelist-${showFileList}.png`, {
      element: '#container',
    });

    await t.clearUpload(fileUploader.input);

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxFileUploader', { showFileList }));
});
