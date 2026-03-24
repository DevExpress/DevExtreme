import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import { createUser, generateMessages, avatarUrl } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatAvatar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Chat: avatar', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First', avatarUrl);
    const userSecond = createUser(2, 'Second', avatarUrl);
    const items = generateMessages(3, userFirst, userSecond);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      items,
    }, '#chat');

    await testScreenshot(page, 'Chat avatar with image.png', { element: '#chat' });
  });

  test('Chat: showAvatar set to false', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const items = generateMessages(3, userFirst, userSecond);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      items,
      showAvatar: false,
    }, '#chat');

    await testScreenshot(page, 'Chat with showAvatar false.png', { element: '#chat' });
  });
});
