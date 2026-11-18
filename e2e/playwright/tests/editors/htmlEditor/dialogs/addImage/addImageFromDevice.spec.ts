import path from 'node:path';
import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import HtmlEditor from '../../../../../models/htmlEditor';

const TEST_IMAGE_PATH_1 = path.join(__dirname, 'images', 'test-image-1.png');
const TEST_IMAGE_PATH_2 = path.join(__dirname, 'images', 'test-image-2.png');

test.describe('HtmlEditor - upload image from device', () => {
  test('Image from device should be inserted', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;
    const { fileUploader } = dialog;

    await htmlEditor.getToolbarItem('image').element.click();

    await dialog.addButton.expectDisabled();

    await fileUploader.input.setInputFiles(TEST_IMAGE_PATH_1);

    const file = fileUploader.getFile();

    await expect(file.fileName).toHaveText('test-image-1.png');
    await expect(file.fileSize).toHaveText('7 KB');
    await expect(file.statusMessage).toHaveText('Ready to upload');

    await file.cancelButton.element.click();

    await expect(fileUploader.files).toHaveCount(0);
    await dialog.addButton.expectDisabled();

    await fileUploader.input.setInputFiles(TEST_IMAGE_PATH_2);

    await testScreenshot(page, 'editor-before-click-add-button-from-device.png');

    await dialog.addButton.expectDisabled(false);

    await dialog.addButton.element.click();

    await htmlEditor.expectImageLoaded();

    await testScreenshot(page, 'editor-after-add-image-from-device.png', { element: htmlEditor.content });
  });

  test('Image should be validated and inserted from device', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file'],
        fileUploaderOptions: {
          maxFileSize: 8500,
        },
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;
    const { fileUploader } = dialog;

    await htmlEditor.getToolbarItem('image').element.click();

    await fileUploader.input.setInputFiles(TEST_IMAGE_PATH_2);

    const file = fileUploader.getFile();

    await expect(file.fileName).toHaveText('test-image-2.png');
    await expect(file.fileSize).toHaveText('10 KB');
    await expect(file.validationMessage).toHaveText('File is too large');

    await file.cancelButton.element.click();

    await expect(fileUploader.files).toHaveCount(0);

    await dialog.addButton.expectDisabled();

    await fileUploader.input.setInputFiles(TEST_IMAGE_PATH_1);

    await expect(file.fileName).toHaveText('test-image-1.png');
    await expect(file.fileSize).toHaveText('7 KB');
    await expect(file.statusMessage).toHaveText('Ready to upload');

    await testScreenshot(page, 'editor-before-click-add-button-and-validation.png');

    await dialog.addButton.expectDisabled(false);

    await dialog.addButton.element.click();

    await htmlEditor.expectImageLoaded();

    await testScreenshot(page, 'editor-after-click-add-button-and-validation.png', { element: htmlEditor.content });
  });
});
