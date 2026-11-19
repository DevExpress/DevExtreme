import type { Page } from '@playwright/test';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, setStyleAttribute } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import {
  createUser,
  generateMessages,
  getLongText,
} from './data';

const AVATAR_SELECTOR = '.dx-avatar';
const CHAT_WRAPPER_STYLES = 'display: flex; flex-wrap: wrap; gap: 2px; width: 1270px; padding: 20px; transform: scale(0.9);';

const renderChatsWithBubbleCounts = async (
  page: Page,
  options: Record<string, unknown>,
): Promise<void> => {
  await appendElementTo(page, '#container', 'div', 'chat-wrapper');
  await setStyleAttribute(page, '#chat-wrapper', CHAT_WRAPPER_STYLES);

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  for (const [idx, bubbleCount] of [1, 2, 3, 4].entries()) {
    const chatId = `#chat_${idx}`;

    await appendElementTo(page, '#chat-wrapper', 'div', `chat_${idx}`);

    const items = generateMessages(bubbleCount, userFirst, userSecond, false, false, 4, 2);

    await createWidget(page, 'dxChat', {
      items,
      ...options,
      user: userSecond,
      width: 250,
      height: 400,
    }, chatId);

    await new Chat(page, chatId).repaint();
  }
};

test.describe('ChatMessageGroup', () => {
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

    await setStyleAttribute(page, AVATAR_SELECTOR, 'width: 64px; height: 64px');
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

    const chat = new Chat(page, '#chat');

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
    await renderChatsWithBubbleCounts(page, { disabled: true });

    await testScreenshot(page, 'Messagegroup appearance in disabled state.png', { element: '#chat-wrapper' });
  });

  test('Messagegroup scenarios in RTL mode', async ({ page }) => {
    await renderChatsWithBubbleCounts(page, { rtlEnabled: true });

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
