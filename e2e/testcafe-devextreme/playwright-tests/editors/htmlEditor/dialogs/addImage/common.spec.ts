import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container-extended.html')}`;

test.describe('HtmlEditor - common', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const TEST_IMAGE_PATH_1 = './images/test-image-1.png';

  const ADD_IMAGE_POPUP_CONTENT_SELECTOR = '.dx-htmleditor-add-image-popup .dx-overlay-content';

  test('TabPanel in HtmlEditor must have correct borders', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['file', 'url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = page.locator('#container');

    await click(htmlEditor.toolbar.getItemByName('image'));

    await testScreenshot(page, 'tabpanel-in-htmleditor.png', {
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

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
      .eql(true);

    await htmlEditor.dialog.tabs.getItem(1).element.click();

    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(false)

      .typeText(htmlEditor.dialog.addImageUrlForm.url.element, BASE64_IMAGE_1, {
        paste: true,
      })
      .click(htmlEditor.dialog.footerToolbar.addButton.element);

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

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
      .notOk()

      .click(htmlEditor.dialog.footerToolbar.addButton.element)
      .expect(htmlEditor.dialog.addImageUrlForm.url.isInvalid)
      .ok();

    await htmlEditor.dialog.tabs.getItem(1).element.click();

    expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBeTruthy();

    const { fileUploader } = htmlEditor.dialog.addImageFileForm;

    await fileUploader.input.setInputFiles([TEST_IMAGE_PATH_1])

      .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
      .notOk()

      .click(htmlEditor.dialog.footerToolbar.addButton.element);

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

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
      .ok()

      .expect(htmlEditor.dialog.footerToolbar.cancelButton.isDisabled)
      .notOk()

      .click(htmlEditor.dialog.footerToolbar.cancelButton.element);

    await page.click(htmlEditor.toolbar.getItemByName('link'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
      .notOk()

      .expect(htmlEditor.dialog.footerToolbar.cancelButton.isDisabled)
      .notOk()

      .click(htmlEditor.dialog.footerToolbar.addButton.element);

    await page.click(htmlEditor.toolbar.getItemByName('color'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.isDisabled)
      .notOk()

      .expect(htmlEditor.dialog.footerToolbar.cancelButton.isDisabled)
      .notOk()

      .click(htmlEditor.dialog.footerToolbar.cancelButton.element);

    });
});
