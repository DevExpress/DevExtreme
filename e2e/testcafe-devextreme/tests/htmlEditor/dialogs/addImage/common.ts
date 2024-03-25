import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import HtmlEditor from 'devextreme-testcafe-models/htmlEditor';
import url from '../../../../helpers/getPageUrl';
import { createWidget } from '../../../../helpers/createWidget';
import { BASE64_IMAGE_1 } from './images/base64';
import { testScreenshot } from '../../../../helpers/themeUtils';

const TEST_IMAGE_PATH_1 = './images/test-image-1.png';

fixture.disablePageReloads`HtmlEditor - common`
  .page(url(__dirname, '../../../containerQuill.html'));

const ADD_IMAGE_POPUP_CONTENT_SELECTOR = '.dx-htmleditor-add-image-popup .dx-overlay-content';

test('TabPanel in HtmlEditor must have correct borders', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const htmlEditor = new HtmlEditor('#container');

  await t.click(htmlEditor.toolbar.getItemByName('image'));

  await testScreenshot(t, takeScreenshot, 'tabpanel-in-htmleditor.png', {
    element: ADD_IMAGE_POPUP_CONTENT_SELECTOR,
    shouldTestInCompact: true,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 800,
    imageUpload: {
      tabs: ['file', 'url'],
    },
    toolbar: { items: ['image'] },
  });
});

test('Add button should be enabled after switch to url form', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItemByName('image'))

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
  });
});

test('Add button should be disable after switch to image upload form', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItemByName('image'))

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .notOk()

    .click(htmlEditor.dialog.footerToolbar.addButton.element)
    .expect(htmlEditor.dialog.addImageUrlForm.url.isInvalid)
    .ok();

  await t.click(htmlEditor.dialog.tabs.getItem(1).element);

  await t
    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .ok();

  const { fileUploader } = htmlEditor.dialog.addImageFileForm;

  await t
    .setFilesToUpload(fileUploader.input, [TEST_IMAGE_PATH_1])

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .notOk()

    .click(htmlEditor.dialog.footerToolbar.addButton.element);
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 800,
    imageUpload: {
      tabs: ['url', 'file'],
    },
    toolbar: { items: ['image'] },
  });
});

test('AddImage form shouldn\'t lead to side effects in other forms', async (t) => {
  const htmlEditor = new HtmlEditor('#container');

  await t
    .click(htmlEditor.toolbar.getItemByName('image'))

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .ok()

    .expect(htmlEditor.dialog.footerToolbar.cancelButton.isDisabled)
    .notOk()

    .click(htmlEditor.dialog.footerToolbar.cancelButton.element);

  await t
    .click(htmlEditor.toolbar.getItemByName('link'))

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .notOk()

    .expect(htmlEditor.dialog.footerToolbar.cancelButton.isDisabled)
    .notOk()

    .click(htmlEditor.dialog.footerToolbar.addButton.element);

  await t
    .click(htmlEditor.toolbar.getItemByName('color'))

    .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
    .notOk()

    .expect(htmlEditor.dialog.footerToolbar.cancelButton.isDisabled)
    .notOk()

    .click(htmlEditor.dialog.footerToolbar.cancelButton.element);
}).before(async () => {
  await createWidget('dxHtmlEditor', {
    height: 600,
    width: 800,
    imageUpload: {
      tabs: ['file', 'url'],
    },
    toolbar: { items: ['image', 'link', 'color'] },
  });
});
