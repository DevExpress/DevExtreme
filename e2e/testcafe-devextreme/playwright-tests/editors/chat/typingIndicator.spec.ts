import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo, insertStylesheetRulesToPage } from '../../../playwright-helpers';
import { createUser, generateMessages } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatTypingIndicator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  const CHAT_TYPINGINDICATOR_CIRCLE_CLASS = 'dx-chat-typingindicator-circle';
  const waitFont = async (page: Page) => page.evaluate(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

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

    await testScreenshot(page, 'Typing indicator with emptyview.png', {
      element: '#container',
    });
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

    await page.evaluate(() => {
      ($('#chat') as any).dxChat('instance').repaint();
    });

    await testScreenshot(page, 'Typing indicator with a lot of items.png', { element: '#chat' });
  });

  test('Chat: typing indicator', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');
    await insertStylesheetRulesToPage(page, `.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

    const userFirst = createUser(1, 'Elise Moreau');
    const userSecond = createUser(2, 'Pierre Martin');

    const items = generateMessages(5, userFirst, userSecond);

    const typingUsers = [userFirst];

    await waitFont(page);

    await createWidget(page, 'dxChat', {
      user: userSecond,
      width: 400,
      height: 600,
      items,
      typingUsers,
    }, '#chat');

    await testScreenshot(page, 'Typing indicator with 1 user.png', { element: '#chat' });

    const userCamille = createUser(1, 'Camille');
    const userSophie = createUser(2, 'Sophie');
    const userThird = createUser(3, 'Antoine');
    const userFourth = createUser(4, 'Julien');

    await page.evaluate((users) => {
      ($('#chat') as any).dxChat('instance').option('typingUsers', users);
    }, [userCamille, userSophie]);
    await testScreenshot(page, 'Typing indicator with 2 users.png', { element: '#chat' });

    await page.evaluate((users) => {
      ($('#chat') as any).dxChat('instance').option('typingUsers', users);
    }, [userCamille, userSophie, userThird]);
    await testScreenshot(page, 'Typing indicator with 3 users.png', { element: '#chat' });

    await page.evaluate((users) => {
      ($('#chat') as any).dxChat('instance').option('typingUsers', users);
    }, [userCamille, userSophie, userThird, userFourth]);
    await testScreenshot(page, 'Typing indicator with 4 users.png', { element: '#chat' });

    await page.evaluate((users) => {
      ($('#chat') as any).dxChat('instance').option('typingUsers', users);
    }, [{ name: 'Marie-Francoise Isabelle Antoinette de La Rochefoucauld' }]);
    await testScreenshot(page, 'Typing indicator with long name.png', { element: '#chat' });

    await page.evaluate((users) => {
      ($('#chat') as any).dxChat('instance').option('typingUsers', users);
    }, [{}]);
    await testScreenshot(page, 'Typing indicator without name.png', { element: '#chat' });
  });
});
