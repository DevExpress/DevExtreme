import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
import { createUser, generateMessages, getLongText } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatMessageGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Chat: messagegroup, avatar rendering', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const items = generateMessages(3, userFirst);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      items,
    }, '#chat');

    await testScreenshot(page, 'Avatar has correct position.png', { element: '#chat' });

    await page.evaluate(() => {
      const avatar = document.querySelector('.dx-avatar') as HTMLElement;
      if (avatar) {
        avatar.style.width = '64px';
        avatar.style.height = '64px';
      }
    });
    await testScreenshot(page, 'Avatar sizes do not affect indentation between bubbles.png', { element: '#chat' });
  });

  test('Chat: messagegroup, information', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, getLongText());
    const userSecond = createUser(2, getLongText());

    const items = generateMessages(2, userFirst, userSecond, false, false, 2);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      user: userSecond,
      items,
    }, '#chat');

    await testScreenshot(page, 'Information row with long user name.png', { element: '#chat' });
  });

  test('Chat: messagegroup, bubbles', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    }, '#chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    let items = generateMessages(1, userFirst, userSecond, false, false, 4, 2);
    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option(opts);
    }, { items, user: userSecond });
    await testScreenshot(page, 'Messagegroup with 1 bubble.png', { element: '#chat' });

    items = generateMessages(2, userFirst, userSecond, false, false, 4, 2);
    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option('items', opts);
    }, items);
    await testScreenshot(page, 'Messagegroup with 2 bubbles.png', { element: '#chat' });

    items = generateMessages(3, userFirst, userSecond, false, false, 4, 2);
    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option('items', opts);
    }, items);
    await testScreenshot(page, 'Messagegroup with 3 bubbles.png', { element: '#chat' });

    items = generateMessages(4, userFirst, userSecond, false, false, 4, 2);
    await page.evaluate((opts) => {
      ($('#chat') as any).dxChat('instance').option('items', opts);
    }, items);
    await testScreenshot(page, 'Messagegroup with 4 bubbles.png', { element: '#chat' });
  });

  test.skip('Messagegroup scenarios in disabled state', async ({ page }) => {
    // skipped: requires asyncForEach helper and Chat page object with repaint
  });

  test.skip('Messagegroup scenarios in RTL mode', async ({ page }) => {
    // skipped: requires asyncForEach helper and Chat page object with repaint
  });

  test('MessageGroup with edited messages', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const items = generateMessages(2, userFirst, userSecond, false, false, 2, 2, true);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      user: userSecond,
      items,
    }, '#chat');

    await testScreenshot(page, 'MessageGroup with edited messages.png', { element: '#chat' });
  });
});
