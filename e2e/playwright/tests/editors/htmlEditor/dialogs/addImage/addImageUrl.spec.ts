import { expect, test } from '../../../../../fixtures';
import { createWidget } from '../../../../../helpers/createWidget';
import { testScreenshot } from '../../../../../helpers/screenshots';
import { isMaterial } from '../../../../../helpers/themeUtils';
import HtmlEditor from '../../../../../models/htmlEditor';
import { BASE64_IMAGE_1, BASE64_IMAGE_2 } from './images/base64';

const ADD_IMAGE_POPUP_CONTENT_SELECTOR = '.dx-htmleditor-add-image-popup .dx-overlay-content';

test.describe('HtmlEditor - add image url', () => {
  test('Image uploader from url appearance', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();

    await dialog.lockButton.element.click();

    await dialog.url.element.click();

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

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();
    await dialog.addButton.element.click();

    await dialog.url.expectClass('dx-invalid');

    await dialog.url.input.fill(BASE64_IMAGE_1);
    await dialog.addButton.element.click();

    await htmlEditor.expectImageLoaded();

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

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();

    await page.keyboard.press('Enter');

    await dialog.url.expectClass('dx-invalid');

    await dialog.url.input.fill(BASE64_IMAGE_1);
    await page.keyboard.press('Enter');

    await htmlEditor.expectImageLoaded();

    await testScreenshot(page, 'editor-add-validated-url-image-by-enter.png', { element: htmlEditor.content });
  });

  test('Image url should be updated', async ({ page, theme }) => {
    await createWidget(page, 'dxHtmlEditor', {
      height: 600,
      width: 800,
      imageUpload: {
        tabs: ['url'],
      },
      toolbar: { items: ['image'] },
    });

    const htmlEditor = new HtmlEditor(page, '#container');
    const { dialog } = htmlEditor;

    await htmlEditor.getToolbarItem('image').element.click();

    await expect(dialog.addButton.text)
      .toHaveText(isMaterial(theme) ? 'ADD' : 'Add', { useInnerText: true });

    await dialog.url.input.fill(BASE64_IMAGE_1);
    await dialog.addButton.element.click();

    await htmlEditor.expectImageLoaded(BASE64_IMAGE_1);

    await testScreenshot(page, 'editor-add-url-image-before-updated.png', { element: htmlEditor.content });

    await htmlEditor.getToolbarItem('image').element.click();

    await expect(dialog.addButton.text)
      .toHaveText(isMaterial(theme) ? 'UPDATE' : 'Update', { useInnerText: true });

    await dialog.url.input.fill(BASE64_IMAGE_2);
    await dialog.addButton.element.click();

    await htmlEditor.expectImageLoaded(BASE64_IMAGE_2);

    await testScreenshot(page, 'editor-add-url-image-after-updated.png', { element: htmlEditor.content });
  });
});
