import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import { Chat } from '../../../playwright-helpers/chat';
import { createUser, getShortText, getLongText, attachments } from './data';
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

    const shortText = getShortText();
    const longText = getLongText(false, 5);

    await page.evaluate(() => {
      ($('#chat') as any).dxChat('instance').focus();
    });
    await testScreenshot(page, 'Messagebox when chat has focus.png', { element: '#chat' });

    const input = page.locator('#chat .dx-texteditor-input');
    await input.fill(shortText);
    await testScreenshot(page, 'Messagebox when input contains short text.png', { element: '#chat' });

    await input.fill(longText);
    await testScreenshot(page, 'Messagebox when input contains long text.png', { element: '#chat' });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'Messagebox when send button has focus.png', { element: '#chat' });
  });

  test('Chat: messagebox with editing preview', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const items = [
      { author: userFirst, text: 'Hello world' },
      { author: userFirst, text: 'Edit me' },
    ];

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      items,
      user: userFirst,
    }, '#chat');

    const chat = new Chat(page, '#chat');

    await chat.getMessage(1).click({ button: 'right' });
    await page.waitForTimeout(300);

    await testScreenshot(page, 'Messagebox context menu.png', { element: '#chat' });
  });

  test('Chat: messagebox with attachments and informer', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    }, '#chat');

    const chat = new Chat(page, '#chat');

    await chat.focus();
    const input = chat.getInput();
    await input.fill('Message with attachments');

    await testScreenshot(page, 'Messagebox with text before attachments.png', { element: '#chat' });
  });
});
