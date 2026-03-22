import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container-extended.html')}`;

test.describe('HtmlEditor - upload image from device', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TEST_IMAGE_PATH_1 = './images/test-image-1.png';
  const TEST_IMAGE_PATH_2 = './images/test-image-2.png';

  test('Image from device should be inserted', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = page.locator('#container');

    await click(htmlEditor.toolbar.getItemByName('image'));

    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(true);

    const { fileUploader } = htmlEditor.dialog.addImageFileForm;

    await fileUploader.input.setInputFiles([TEST_IMAGE_PATH_1]);

    const file = fileUploader.getFile();

    expect(file.fileName).toBe('test-image-1.png')

      .expect(file.fileSize)
      .eql('7 KB')

      .expect(file.statusMessage)
      .eql('Ready to upload');

    await fileUploader.getFile().cancelButton.element.click();
    expect(fileUploader.fileCount).toBe(0);
    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(true);

    await fileUploader.input.setInputFiles([TEST_IMAGE_PATH_2]);

    await testScreenshot(page, 'editor-before-click-add-button-from-device.png');

    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(false);

    await htmlEditor.dialog.footerToolbar.addButton.element.click();

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

    const htmlEditor = page.locator('#container');

    await click(htmlEditor.toolbar.getItemByName('image'));

    const { fileUploader } = htmlEditor.dialog.addImageFileForm;

    await fileUploader.input.setInputFiles([TEST_IMAGE_PATH_2]);

    const file = fileUploader.getFile();

    expect(file.fileName).toBe('test-image-2.png')

      .expect(file.fileSize)
      .eql('10 KB')

      .expect(file.validationMessage)
      .eql('File is too large');

    await fileUploader.getFile().cancelButton.element.click()
      .expect(fileUploader.fileCount)
      .eql(0);

    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(true);

    await fileUploader.input.setInputFiles([TEST_IMAGE_PATH_1]);
    expect(file.fileName).toBe('test-image-1.png')

      .expect(file.fileSize)
      .eql('7 KB')

      .expect(file.statusMessage)
      .eql('Ready to upload');

    await testScreenshot(page, 'editor-before-click-add-button-and-validation.png');

    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(false);

    await htmlEditor.dialog.footerToolbar.addButton.element.click();

    await testScreenshot(page, 'editor-after-click-add-button-and-validation.png', { element: htmlEditor.content });

    });
});
