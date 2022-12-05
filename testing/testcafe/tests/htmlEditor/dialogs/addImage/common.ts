import HtmlEditor from '../../../../model/htmlEditor';
import url from '../../../../helpers/getPageUrl';
import createWidget from '../../../../helpers/createWidget';
import { BASE64_IMAGE_1 } from './images/base64';

const TEST_IMAGE_PATH_1 = './images/test-image-1.png';

fixture`HtmlEditor - common`
  .page(url(__dirname, '../../../container.html'));

test('Add button should be enabled after switch to url form', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItem('image'))

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true);

  await t.click(htmlEditor.dialog.tabs.getItem(1).element);

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false)

    .typeText(htmlEditor.dialog.addImageUrlForm.url.element, BASE64_IMAGE_1, {
      paste: true,
    })
    .click(htmlEditor.dialog.footerToolbar.addButton.element);
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 800,
    imageUpload: {
      tabs: ['file', 'url'],
    },
    toolbar: { items: ['image'] },
  }, true);
});

test('Add button should be disable after switch to image upload form', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t.debug();

  await t
    .click(htmlEditor.toolbar.getItem('image'))

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false)

    .click(htmlEditor.dialog.footerToolbar.addButton.element)
    .expect(htmlEditor.dialog.addImageUrlForm.url.isInvalid)
    .eql(true);

  await t.click(htmlEditor.dialog.tabs.getItem(1).element);

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(true);

  const { fileUploader } = htmlEditor.dialog.addImageFileForm;

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_1])

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .eql(false)

    .click(htmlEditor.dialog.footerToolbar.addButton.element);
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 800,
    imageUpload: {
      tabs: ['url', 'file'],
    },
    toolbar: { items: ['image'] },
  }, true);
});
