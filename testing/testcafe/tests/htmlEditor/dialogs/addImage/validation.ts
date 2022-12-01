import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import FileUploader, { CLASS_NAMES } from '../../../../model/fileUploader';
import HtmlEditor from '../../../../model/htmlEditor';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';

const TEST_IMAGE_PATH_1 = './test-image-1.png';
const TEST_IMAGE_PATH_2 = './test-image-2.png';

fixture`HtmlEditor - validation`
  .page(url(__dirname, '../../../container.html'));

test('Image from device should be inserted', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t.click(htmlEditor.toolbar.getItem('image'));

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true, 'add button should be disabled, if file not selected');

  const fileUploader = new FileUploader(CLASS_NAMES.ROOT_ELEMENT);
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
    .eql(true, 'add button should be disabled, if file not selected');

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_2]);
  await t
    .expect(file.fileName)
    .eql('test-image-2.png')

    .expect(file.fileSize)
    .eql('10 kb')

    .expect(file.statusMessage)
    .eql('Ready to upload');

  await t.expect(
    await takeScreenshot('html-editor-before-click-add-button.png', htmlEditor.content),
  ).ok();

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false, 'add button should\'t be disabled, if file selected');

  await t.click(htmlEditor.dialog.footerToolbar.addButton.element);

  await t.expect(
    await takeScreenshot('add-image-from-device.png', htmlEditor.content),
  ).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 600,
    imageUpload: {
      tabs: ['file'],
    },
    toolbar: { items: ['image'] },
  }, true);
});

test('Image should be validated and inserted from device', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t.click(htmlEditor.toolbar.getItem('image'));

  const fileUploader = new FileUploader(CLASS_NAMES.ROOT_ELEMENT);
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

  await t.click(fileUploader.getFile().cancelButton.element);
  await t.expect(fileUploader.fileCount).eql(0);
  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true, 'add button should be disabled, if file not selected');

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_1]);
  await t
    .expect(file.fileName)
    .eql('test-image-1.png')

    .expect(file.fileSize)
    .eql('7 kb')

    .expect(file.statusMessage)
    .eql('Ready to upload');

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false, 'add button should\'t be disabled, if file selected');

  await t.expect(
    await takeScreenshot('html-editor-before-click-add-button-and-validation.png', htmlEditor.content),
  ).ok();

  await t.click(htmlEditor.dialog.footerToolbar.addButton.element);

  await t.expect(
    await takeScreenshot('add-validated-image-from-device.png', htmlEditor.content),
  ).ok();

  await t.expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 600,
    imageUpload: {
      tabs: ['file'],
      fileUploaderOptions: {
        maxFileSize: 8500,
      },
    },
    toolbar: { items: ['image'] },
  }, true);
});
