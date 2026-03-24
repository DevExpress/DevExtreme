import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import { Chat } from '../../../playwright-helpers/chat';
import { createUser } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatConfirmationPopup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Chat: confirmation popup', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const items = [
      { author: userFirst, text: 'Hello' },
      { author: userFirst, text: 'Delete me' },
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

    await testScreenshot(page, 'Chat confirmation popup context menu.png', { element: '#chat' });
  });
});
