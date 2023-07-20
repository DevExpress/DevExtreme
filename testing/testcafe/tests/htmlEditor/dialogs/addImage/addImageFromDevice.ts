import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from '../../../../model/htmlEditor';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import { testScreenshot } from '../../../../helpers/themeUtils';

const TEST_IMAGE_PATH_1 = './images/test-image-1.png';
const TEST_IMAGE_PATH_2 = './images/test-image-2.png';

fixture`HtmlEditor - upload image from device`
  .page(url(__dirname, '../../../containerQuill.html'));

test('Image from device should be inserted', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t.click(htmlEditor.toolbar.getItemByName('image'));

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true);

  const { fileUploader } = htmlEditor.dialog.addImageFileForm;

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_1]);

  const file = fileUploader.getFile();

  await t
    .expect(file.fileName)
    .eql('test-image-1.png')

    .expect(file.fileSize)
    .eql('7 kb')

    .expect(file.statusMessage)
    .eql('Ready to upload');

  await t.click(fileUploader.getFile().cancelButton.element);
  await t.expect(fileUploader.fileCount).eql(0);
  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true);

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_2]);

  await testScreenshot(t, takeScreenshot, 'editor-before-click-add-button-from-device.png');

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false);

  await t.click(htmlEditor.dialog.footerToolbar.addButton.element);

  await testScreenshot(t, takeScreenshot, 'editor-after-add-image-from-device.png', { element: htmlEditor.content });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 800,
    imageUpload: {
      tabs: ['file'],
    },
    toolbar: { items: ['image'] },
  });
});

test('Image should be validated and inserted from device', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t.click(htmlEditor.toolbar.getItemByName('image'));

  const { fileUploader } = htmlEditor.dialog.addImageFileForm;

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_2]);

  const file = fileUploader.getFile();

  await t
    .expect(file.fileName)
    .eql('test-image-2.png')

    .expect(file.fileSize)
    .eql('10 kb')

    .expect(file.validationMessage)
    .eql('File is too large');

  await t
    .click(fileUploader.getFile().cancelButton.element)
    .expect(fileUploader.fileCount)
    .eql(0);

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true);

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_1]);
  await t
    .expect(file.fileName)
    .eql('test-image-1.png')

    .expect(file.fileSize)
    .eql('7 kb')

    .expect(file.statusMessage)
    .eql('Ready to upload');

  await testScreenshot(t, takeScreenshot, 'editor-before-click-add-button-and-validation.png');

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false);

  await t.click(htmlEditor.dialog.footerToolbar.addButton.element);

  await testScreenshot(t, takeScreenshot, 'editor-after-click-add-button-and-validation.png', { element: htmlEditor.content });

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
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
});
