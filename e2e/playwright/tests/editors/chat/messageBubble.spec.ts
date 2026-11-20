import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import {
  createUser,
  generateFileMessage,
  generateFileMessageWithoutText,
  generateImageMessage,
  generateMessages,
} from './data';
import { expectImagesLoaded } from './utils';

test.describe('ChatMessageBubble', () => {
  test('Chat: messagebubble', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');
    await createWidget(page, 'dxChat', {
      width: 400,
      height: 650,
    }, '#chat');

    const chat = new Chat(page, '#chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    let items = generateMessages(2, userFirst, userSecond, true, false, 2);

    await chat.option({ items, user: userSecond });
    await testScreenshot(page, 'Bubbles with long text.png', { element: '#chat' });

    items = generateMessages(2, userFirst, userSecond, true, true, 2);

    await chat.option({ items });
    await testScreenshot(page, 'Bubbles with long text with line breaks.png', { element: '#chat' });
  });

  test('Chat: messagebubble with images and files', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');
    await createWidget(page, 'dxChat', {
      width: 600,
      height: 650,
    }, '#chat');

    const chat = new Chat(page, '#chat');

    const user = createUser(1, 'ImageUser');

    const imageMessages = [
      generateImageMessage(user, '../../../apps/demos/images/products/1.png'),
      generateImageMessage(user, '../../../apps/demos/images/products/1-small.png'),
    ];

    await chat.option({ items: imageMessages });
    await expectImagesLoaded(chat.element, 2);
    await testScreenshot(page, 'Bubbles with images.png', { element: '#chat' });

    const fileMessages = [
      generateFileMessage(user),
      generateFileMessage(user, true),
    ];

    await chat.option({
      width: 700,
      height: 720,
      items: fileMessages,
    });
    await testScreenshot(page, 'Bubbles with files.png', { element: '#chat' });

    await chat.option({
      width: 600,
      height: 600,
      items: [generateFileMessageWithoutText(user)],
    });
    await testScreenshot(page, 'Bubble with files without text.png', { element: '#chat' });
  });
});
