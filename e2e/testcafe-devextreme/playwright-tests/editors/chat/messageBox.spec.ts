import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatMessageBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Chat: messagebox', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    }, '#chat');

    const chat = page.locator('#chat');

    const shortText = getShortText();
    const longText = getLongText(false, 5);

    await chat.focus();
    await testScreenshot(page, 'Messagebox when chat has focus.png', { element: '#chat' });

    await typeText(chat.getInput(), shortText);
    await testScreenshot(page, 'Messagebox when input contains short text.png', { element: '#chat' });

    await typeText(chat.getInput(), longText);
    await testScreenshot(page, 'Messagebox when input contains long text.png', { element: '#chat' });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'Messagebox when send button has focus.png', { element: '#chat' });

    });

  test('Chat: messagebox with editing preview', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = [{
      author: userFirst,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }, {
      author: userSecond,
      text: 'Short message',
    }];

    await createWidget(page, 'dxChat', {
      items,
      user: userFirst,
      editing: {
        allowUpdating: true,
      },
      width: 400,
      height: 600,
    }, '#chat');

    const chat = page.locator('#chat');

    await rightClick(chat.getMessage(0));
    await click(chat.getContextMenuItem(0));

    await testScreenshot(page, 'Messagebox with editing preview.png', {
      element: '#chat',
    });

    });

  test('Chat: messagebox with attachments and informer', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 812,
      height: 600,
    }, '#chat');

    const chat = page.locator('#chat');

    await typeText(chat.getInput(), getLongText(false, 4));
    await chat.option({
      fileUploaderOptions: {
        value: [
          ...attachments,
          ...attachments,
          ...attachments,
        ],
      },
    });

    await chat.focus();
    await testScreenshot(page, 'Messagebox with attachments and informer.png', { element: '#chat' });

    });
});
