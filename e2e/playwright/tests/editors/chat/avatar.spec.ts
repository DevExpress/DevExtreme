import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, expectImagesLoaded } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import { avatarUrl, createUser, generateMessages } from './data';

test.describe('ChatAvatar', () => {
  test('Chat: avatar', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const initialsUserFirst = createUser(1, 'First User');
    const initialsUserSecond = createUser(2, 'Second User');

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      user: initialsUserSecond,
      items: generateMessages(2, initialsUserFirst, initialsUserSecond, false, false, 2),
    }, '#chat');

    await testScreenshot(page, 'Avatar with two word initials.png', { element: '#chat' });

    const chat = new Chat(page, '#chat');

    const userFirst = createUser(1, 'First', avatarUrl);
    const userSecond = createUser(2, 'Second', avatarUrl);

    const items = generateMessages(2, userFirst, userSecond, false, false, 2);

    await chat.option('items', items);
    await expectImagesLoaded(chat.element, 1);

    await testScreenshot(page, 'Avatar with image.png', { element: '#chat' });
  });

  test('Chat: showAvatar set to false', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First User');
    const userSecond = createUser(2, 'Second User');

    const items = generateMessages(2, userFirst, userSecond, false, false, 2);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      user: userSecond,
      items,
      showAvatar: false,
    }, '#chat');

    await testScreenshot(page, 'Avatar with showAvatar set to false.png', { element: '#chat' });
  });
});
