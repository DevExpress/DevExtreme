import type { Page } from '@playwright/test';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';

const CHAT_SUGGESTIONS_CLASS = 'dx-chat-suggestions';

const render = (page: Page, markup: string): Promise<void> => page.evaluate((html) => {
  const container = document.querySelector('#container');

  if (container) container.innerHTML = html;
}, markup);

const createSuggestions = (page: Page, selector: string): Promise<void> => createWidget(page, 'dxButtonGroup', {
  items: [
    { text: 'Summary' },
    { text: 'Ideal Buyer' },
    { text: 'Competitors' },
  ],
  stylingMode: 'outlined',
  selectionMode: 'none',
  elementAttr: { class: CHAT_SUGGESTIONS_CLASS },
  width: 400,
}, selector);

test.describe('ChatSuggestions', () => {
  test.use({ theme: 'fluent-next.blue.light' });

  test('Chat suggestions outside of a chat in light and dark modes', async ({ page }) => {
    await render(page, `
      <div class="dx-theme-mode-light" style="background-color: var(--dxds-color-bg-canvas);"><div id="light"></div></div>
      <div class="dx-theme-mode-dark" style="background-color: var(--dxds-color-bg-canvas);"><div id="dark"></div></div>
    `);
    await createSuggestions(page, '#light');
    await createSuggestions(page, '#dark');

    await testScreenshot(page, 'Chat suggestions outside of a chat.png', { element: '#container' });
  });
});
