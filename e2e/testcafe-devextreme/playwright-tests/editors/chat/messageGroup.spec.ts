import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, setStyleAttribute } from '../../../playwright-helpers';
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

  const AVATAR_SELECTOR = '.dx-avatar';
  const CHAT_WRAPPER_STYLES = 'display: flex; flex-wrap: wrap; gap: 2px; width: 1270px; padding: 20px; transform: scale(0.9);';

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

    await setStyleAttribute(page, Selector(AVATAR_SELECTOR), 'width: 64px; height: 64px');
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

    const chat = page.locator('#chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    let items = generateMessages(1, userFirst, userSecond, false, false, 4, 2);

    await chat.option({ items, user: userSecond });
    await testScreenshot(page, 'Messagegroup with 1 bubble.png', { element: '#chat' });

    items = generateMessages(2, userFirst, userSecond, false, false, 4, 2);

    await chat.option({ items });
    await testScreenshot(page, 'Messagegroup with 2 bubbles.png', { element: '#chat' });

    items = generateMessages(3, userFirst, userSecond, false, false, 4, 2);

    await chat.option({ items });
    await testScreenshot(page, 'Messagegroup with 3 bubbles.png', { element: '#chat' });

    items = generateMessages(4, userFirst, userSecond, false, false, 4, 2);

    await chat.option({ items });
    await testScreenshot(page, 'Messagegroup with 4 bubbles.png', { element: '#chat' });

    });

  test('Messagegroup scenarios in disabled state', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat-wrapper');
    await setStyleAttribute(page, '#chat-wrapper', CHAT_WRAPPER_STYLES);

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    await asyncForEach([1, 2, 3, 4], async (bubbleCount, idx) => {
      const chatId = `#chat_${idx}`;
      await appendElementTo(page, '#chat-wrapper', 'div', `chat_${idx}`);

      const items = generateMessages(bubbleCount, userFirst, userSecond, false, false, 4, 2);

      await createWidget(page, 'dxChat', {
        items,
        disabled: true,
        user: userSecond,
        width: 250,
        height: 400,
      }, chatId);

      const chat = new Chat(chatId);
      await chat.repaint();
    });

    await testScreenshot(page, 'Messagegroup appearance in disabled state.png', { element: '#chat-wrapper' });

    });

  test('Messagegroup scenarios in RTL mode', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat-wrapper');
    await setStyleAttribute(page, '#chat-wrapper', CHAT_WRAPPER_STYLES);

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    await asyncForEach([1, 2, 3, 4], async (bubbleCount, idx) => {
      const chatId = `#chat_${idx}`;
      await appendElementTo(page, '#chat-wrapper', 'div', `chat_${idx}`);

      const items = generateMessages(bubbleCount, userFirst, userSecond, false, false, 4, 2);

      await createWidget(page, 'dxChat', {
        items,
        rtlEnabled: true,
        user: userSecond,
        width: 250,
        height: 400,
      }, chatId);

      const chat = new Chat(chatId);
      await chat.repaint(); // NOTE: WA to make it stable in Material theme.
    });

    await testScreenshot(page, 'Messagegroup appearance in RTL mode.png', { element: '#chat-wrapper' });

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
