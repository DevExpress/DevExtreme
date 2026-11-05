import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import FileUploader from 'devextreme-testcafe-models/fileUploader';
import { testScreenshot } from '../../../helpers/themeUtils';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

const TEST_FILE = './images/test-image-1.png';
const LONG_LABEL_TEXT = 'Drag a file from your computer and drop it here, or click the button to choose one';

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

fixture`FileUploader - label`
  .page(url(__dirname, '../../container.html'));

[false, true].forEach((rtlEnabled) => {
  test(`FileUploader label should not be cut while there is free space, rtlEnabled: ${rtlEnabled} (T1337565)`, async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await testScreenshot(t, takeScreenshot, `fileuploader-long-label-rtl-${rtlEnabled}.png`, {
      element: '#container',
    });

    await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
  }).before(async () => createWidget('dxFileUploader', { labelText: LONG_LABEL_TEXT, rtlEnabled }));
});
