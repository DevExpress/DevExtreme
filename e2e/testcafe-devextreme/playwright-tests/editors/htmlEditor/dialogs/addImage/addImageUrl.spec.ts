import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, isMaterial } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container-extended.html')}`;

test.describe('HtmlEditor - add image url', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const ADD_IMAGE_POPUP_CONTENT_SELECTOR = '.dx-htmleditor-add-image-popup .dx-overlay-content';

  test('Image uploader from url appearance', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
    height: 600,
    width: 800,
    toolbar: { items: ['image'] },
  });

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'));

    await htmlEditor.dialog.addImageUrlForm.lockButton.element.click();

    await htmlEditor.dialog.addImageUrlForm.url.element.click();

    await testScreenshot(page, 'Image uploader from url appearance.png', { element: ADD_IMAGE_POPUP_CONTENT_SELECTOR });

    });

  test('Image url should be validate before wil be inserted by add button click', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'))
      .click(htmlEditor.dialog.footerToolbar.addButton.element);

    expect(htmlEditor.dialog.addImageUrlForm.url.isInvalid).toBe(true);

    await page.typeText(htmlEditor.dialog.addImageUrlForm.url.element, BASE64_IMAGE_1, {
        paste: true,
      })
      .click(htmlEditor.dialog.footerToolbar.addButton.element);

    await testScreenshot(page, 'add-validated-url-image-by-click.png', { element: htmlEditor.content });

    });

  test('Image url should be validate before wil be inserted by add enter press', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'));

    await page.keyboard.press('Enter')
      .expect(htmlEditor.dialog.addImageUrlForm.url.isInvalid)
      .eql(true);

    await page.typeText(htmlEditor.dialog.addImageUrlForm.url.element, BASE64_IMAGE_1, {
        paste: true,
      })
      .pressKey('enter');

    await testScreenshot(page, 'editor-add-validated-url-image-by-enter.png', { element: htmlEditor.content });

    });

  test('Image url should be updated', async ({ page }) => {

    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = page.locator('#container');

    await page.click(htmlEditor.toolbar.getItemByName('image'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.text)
      .eql(isMaterial() ? 'ADD' : 'Add');

    await page.typeText(htmlEditor.dialog.addImageUrlForm.url.element, BASE64_IMAGE_1, {
        paste: true,
      })
      .click(htmlEditor.dialog.footerToolbar.addButton.element);

    await testScreenshot(page, 'editor-add-url-image-before-updated.png', { element: htmlEditor.content });

    await page.click(htmlEditor.toolbar.getItemByName('image'))

      .expect(htmlEditor.dialog.footerToolbar.addButton.text)
      .eql(isMaterial() ? 'UPDATE' : 'Update');

    await page.typeText(htmlEditor.dialog.addImageUrlForm.url.element, BASE64_IMAGE_2, {
        paste: true,
        replace: true,
      })
      .click(htmlEditor.dialog.footerToolbar.addButton.element);

    await testScreenshot(page, 'editor-add-url-image-after-updated.png', { element: htmlEditor.content });

    });
});
