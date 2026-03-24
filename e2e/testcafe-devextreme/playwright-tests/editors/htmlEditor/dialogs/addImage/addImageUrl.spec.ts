import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, isMaterial, HtmlEditor } from '../../../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../../../tests/container-extended.html')}`;

const BASE64_IMAGE_1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
const BASE64_IMAGE_2 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();
    await htmlEditor.dialog.footerToolbar.addButton.element.click();

    expect(await htmlEditor.dialog.addImageUrlForm.url.isInvalid).toBe(true);

    await htmlEditor.dialog.addImageUrlForm.url.input.fill(BASE64_IMAGE_1);
    await htmlEditor.dialog.footerToolbar.addButton.element.click();

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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

    await page.keyboard.press('Enter');

    expect(await htmlEditor.dialog.addImageUrlForm.url.isInvalid).toBe(true);

    await htmlEditor.dialog.addImageUrlForm.url.input.fill(BASE64_IMAGE_1);
    await page.keyboard.press('Enter');

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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

    const addButtonText = await htmlEditor.dialog.footerToolbar.addButton.text;
    expect(addButtonText.toLowerCase()).toBe('add');

    await htmlEditor.dialog.addImageUrlForm.url.input.fill(BASE64_IMAGE_1);
    await htmlEditor.dialog.footerToolbar.addButton.element.click();

    await testScreenshot(page, 'editor-add-url-image-before-updated.png', { element: htmlEditor.content });

    await htmlEditor.toolbar.getItemByName('image').click();

    const updateButtonText = await htmlEditor.dialog.footerToolbar.addButton.text;
    expect(updateButtonText.toLowerCase()).toBe('update');

    await htmlEditor.dialog.addImageUrlForm.url.input.fill(BASE64_IMAGE_2);
    await htmlEditor.dialog.footerToolbar.addButton.element.click();

    await testScreenshot(page, 'editor-add-url-image-after-updated.png', { element: htmlEditor.content });
  });
});
