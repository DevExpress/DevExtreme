import path from 'node:path';
import { test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import HtmlEditor from '../../../../../models/htmlEditor';
import { BASE64_IMAGE_1 } from './images/base64';

const TEST_IMAGE_PATH_1 = path.join(__dirname, 'images', 'test-image-1.png');

const ADD_IMAGE_POPUP_CONTENT_SELECTOR = '.dx-htmleditor-add-image-popup .dx-overlay-content';
const LONG_FILE_UPLOADER_LABEL_TEXT = 'Drop an image here or click the button to browse';

test.describe('HtmlEditor - common', () => {
  test('TabPanel in HtmlEditor must have correct borders', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file', 'url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');

    await htmlEditor.getToolbarItem('image').element.click();

    await testScreenshot(page, 'tabpanel-in-htmleditor.png', {
      element: ADD_IMAGE_POPUP_CONTENT_SELECTOR,
    });
  });

  test('File uploader label container should keep the full dialog width', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file'],
        fileUploaderOptions: {
          labelText: LONG_FILE_UPLOADER_LABEL_TEXT,
        },
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');

    await htmlEditor.getToolbarItem('image').element.click();

    await testScreenshot(page, 'htmleditor-add-image-long-file-uploader-label.png', {
      element: ADD_IMAGE_POPUP_CONTENT_SELECTOR,
    });
  });

  test('Add button should be enabled after switch to url form', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file', 'url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();

    await dialog.addButton.expectDisabled();

    await dialog.getTab(1).click();

    await dialog.addButton.expectDisabled(false);

    await dialog.url.input.fill(BASE64_IMAGE_1);
    await dialog.addButton.element.click();
  });

  test('Add button should be disable after switch to image upload form', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['url', 'file'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();

    await dialog.addButton.expectDisabled(false);

    await dialog.addButton.element.click();

    await dialog.url.expectClass('dx-invalid');

    await dialog.getTab(1).click();

    await dialog.addButton.expectDisabled();

    await dialog.fileUploader.input.setInputFiles(TEST_IMAGE_PATH_1);

    await dialog.addButton.expectDisabled(false);

    await dialog.addButton.element.click();
  });

  test('AddImage form shouldn\'t lead to side effects in other forms', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file', 'url'],
      },
      toolbar: { items: ['image', 'link', 'color'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();

    await dialog.addButton.expectDisabled();
    await dialog.cancelButton.expectDisabled(false);

    await dialog.cancelButton.element.click();

    await htmlEditor.getToolbarItem('link').element.click();

    await dialog.addButton.expectDisabled(false);
    await dialog.cancelButton.expectDisabled(false);

    await dialog.addButton.element.click();

    await htmlEditor.getToolbarItem('color').element.click();

    await dialog.addButton.expectDisabled(false);
    await dialog.cancelButton.expectDisabled(false);

    await dialog.cancelButton.element.click();
  });
});
