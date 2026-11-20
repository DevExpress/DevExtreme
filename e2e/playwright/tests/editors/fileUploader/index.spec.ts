import path from 'node:path';
import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import FileUploader from '../../../models/fileUploader';

const TEST_FILE = path.join(__dirname, 'images', 'test-image-1.png');
const LONG_LABEL_TEXT = 'Drag a file from your computer and drop it here, or click the button to choose one';

test.describe('FileUploader - file list visibility', () => {
  [true, false].forEach((showFileList) => {
    test(`FileUploader with showFileList: ${showFileList} - after file selected`, async ({ page }) => {
      await createWidget(page, 'dxFileUploader', { showFileList });

      const fileUploader = new FileUploader(page, '#container');

      await fileUploader.input.setInputFiles(TEST_FILE);

      if (showFileList) {
        await expect(fileUploader.getFile().statusMessage).toHaveText('Upload failed');
      }

      await testScreenshot(page, `fileuploader-show-filelist-${showFileList}.png`, {
        element: '#container',
      });

      await fileUploader.input.setInputFiles([]);
    });
  });
});

test.describe('FileUploader - label', () => {
  [false, true].forEach((rtlEnabled) => {
    test(`FileUploader label should not be cut while there is free space, rtlEnabled: ${rtlEnabled} (T1337565)`, async ({ page }) => {
      await createWidget(page, 'dxFileUploader', { labelText: LONG_LABEL_TEXT, rtlEnabled });

      await testScreenshot(page, `fileuploader-long-label-rtl-${rtlEnabled}.png`, {
        element: '#container',
      });
    });
  });
});
