import { expect, test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { addFocusableElementAfter, addFocusableElementBefore } from '../../../helpers/domUtils';
import HtmlEditor from '../../../models/htmlEditor';

test.describe('HtmlEditor - focus escape', () => {
  test('Ctrl+Shift+Down should move focus to the next focusable element outside the editor', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', { value: '<p>test</p>' });
    await addFocusableElementBefore(page, '#container');
    await addFocusableElementAfter(page, '#container');

    const htmlEditor = new HtmlEditor(page, '#container');

    await htmlEditor.content.click();
    await page.keyboard.press('Control+Shift+ArrowDown');

    await expect(page.locator('#focusable-end')).toBeFocused();
  });

  test('Ctrl+Shift+Up should move focus to the previous focusable element when there is no toolbar', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', { value: '<p>test</p>' });
    await addFocusableElementBefore(page, '#container');
    await addFocusableElementAfter(page, '#container');

    const htmlEditor = new HtmlEditor(page, '#container');

    await htmlEditor.content.click();
    await page.keyboard.press('Control+Shift+ArrowUp');

    await expect(page.locator('#focusable-start')).toBeFocused();
  });

  test('Ctrl+Shift+Up should move focus into the toolbar when it is present', async ({ page }) => {
    await createWidget(page, 'dxHtmlEditor', {
      value: '<p>test</p>',
      toolbar: { items: ['bold', 'italic'] },
    });
    await addFocusableElementBefore(page, '#container');
    await addFocusableElementAfter(page, '#container');

    const htmlEditor = new HtmlEditor(page, '#container');

    await htmlEditor.content.click();
    await page.keyboard.press('Control+Shift+ArrowUp');

    await htmlEditor.getToolbarItem('bold').expectFocused();
  });
});
