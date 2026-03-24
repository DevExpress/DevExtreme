import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import { createUser, generateMessages, generateImageMessage, generateFileMessage, generateFileMessageWithoutText } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatMessageBubble', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Chat: messagebubble', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 650,
    }, '#chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    let items = generateMessages(2, userFirst, userSecond, true, false, 2);

    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option(opts);
    }, { items, user: userSecond });
    await testScreenshot(page, 'Bubbles with long text.png', { element: '#chat' });

    items = generateMessages(2, userFirst, userSecond, true, true, 2);

    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option('items', opts);
    }, items);
    await testScreenshot(page, 'Bubbles with long text with line breaks.png', { element: '#chat' });
  });

  test('Chat: messagebubble with images and files', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 600,
      height: 650,
    }, '#chat');

    const user = createUser(1, 'ImageUser');

    const imageMessages = [
      generateImageMessage(user, '../../../apps/demos/images/products/1.png'),
      generateImageMessage(user, '../../../apps/demos/images/products/1-small.png'),
    ];

    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option(opts);
    }, { items: imageMessages });
    await testScreenshot(page, 'Bubbles with images.png', { element: '#chat' });

    const fileMessages = [
      generateFileMessage(user),
      generateFileMessage(user, true),
    ];

    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option(opts);
    }, { width: 700, height: 720, items: fileMessages });
    await testScreenshot(page, 'Bubbles with files.png', { element: '#chat' });

    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option(opts);
    }, { width: 600, height: 600, items: [generateFileMessageWithoutText(user)] });
    await testScreenshot(page, 'Bubble with files without text.png', { element: '#chat' });
  });
});
