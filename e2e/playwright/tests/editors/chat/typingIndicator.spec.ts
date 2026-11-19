import type { Page } from '@playwright/test';
import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo, insertStylesheetRulesToPage } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import { createUser, generateMessages } from './data';

const CHAT_TYPINGINDICATOR_CIRCLE_CLASS = 'dx-chat-typingindicator-circle';

const waitFont = (page: Page): Promise<unknown> => page.evaluate(
  () => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400),
);

test.describe('ChatTypingIndicator', () => {
  test('Chat: typing indicator with emptyview', async ({ page }) => {
    await insertStylesheetRulesToPage(page, `.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

    const typingUsers = [
      { name: 'Elodie Montclair' },
    ];

    await waitFont(page);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      typingUsers,
    });

    await testScreenshot(page, 'Typing indicator with emptyview.png', { element: '#container' });
  });

  test('Chat: typing indicator with a lot of items', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');
    await insertStylesheetRulesToPage(page, `.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

    const userFirst = createUser(1, 'Marie-Claire Dubois');
    const userSecond = createUser(2, 'Jean-Pierre Martin');

    const items = generateMessages(27, userFirst, userSecond);

    const typingUsers = [userFirst];

    await createWidget(page, 'dxChat', {
      user: userSecond,
      width: 400,
      height: 600,
      items,
      typingUsers,
    }, '#chat');

    const chat = new Chat(page, '#chat');

    await chat.repaint();

    await testScreenshot(page, 'Typing indicator with a lot of items.png', { element: '#chat' });
  });

  test('Chat: typing indicator', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');
    await insertStylesheetRulesToPage(page, `.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

    const userElise = createUser(1, 'Elise Moreau');
    const userPierre = createUser(2, 'Pierre Martin');

    const items = generateMessages(5, userElise, userPierre);

    await waitFont(page);

    await createWidget(page, 'dxChat', {
      user: userPierre,
      width: 400,
      height: 600,
      items,
      typingUsers: [userElise],
    }, '#chat');

    await testScreenshot(page, 'Typing indicator with 1 user.png', { element: '#chat' });

    const chat = new Chat(page, '#chat');

    const userFirst = createUser(1, 'Camille');
    const userSecond = createUser(2, 'Sophie');
    const userThird = createUser(3, 'Antoine');
    const userFourth = createUser(4, 'Julien');

    await chat.option('typingUsers', [userFirst, userSecond]);
    await testScreenshot(page, 'Typing indicator with 2 users.png', { element: '#chat' });

    await chat.option('typingUsers', [userFirst, userSecond, userThird]);
    await testScreenshot(page, 'Typing indicator with 3 users.png', { element: '#chat' });

    await chat.option('typingUsers', [userFirst, userSecond, userThird, userFourth]);
    await testScreenshot(page, 'Typing indicator with 4 users.png', { element: '#chat' });

    await chat.option('typingUsers', [{ name: 'Marie-Francoise Isabelle Antoinette de La Rochefoucauld' }]);
    await testScreenshot(page, 'Typing indicator with long name.png', { element: '#chat' });

    await chat.option('typingUsers', [{}]);
    await testScreenshot(page, 'Typing indicator without name.png', { element: '#chat' });
  });
});
