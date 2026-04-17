import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, HtmlEditor } from '../../../../../playwright-helpers';
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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

    expect(await htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(true);

    await htmlEditor.dialog.tabs.getItem(1).element.click();

    expect(await htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(false);
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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

    expect(await htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(false);

    await htmlEditor.dialog.footerToolbar.addButton.element.click();

    expect(await htmlEditor.dialog.addImageUrlForm.url.isInvalid).toBe(true);

    await htmlEditor.dialog.tabs.getItem(1).element.click();

    expect(await htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(true);
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

    const htmlEditor = new HtmlEditor(page);

    await htmlEditor.toolbar.getItemByName('image').click();

    expect(await htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(true);
    expect(await htmlEditor.dialog.footerToolbar.cancelButton.isDisabled).toBe(false);

    await htmlEditor.dialog.footerToolbar.cancelButton.element.click();

    await htmlEditor.toolbar.getItemByName('link').click();

    expect(await htmlEditor.dialog.footerToolbar.addButton.isDisabled).toBe(false);
    expect(await htmlEditor.dialog.footerToolbar.cancelButton.isDisabled).toBe(false);

    await htmlEditor.dialog.footerToolbar.addButton.element.click();
  });
});
