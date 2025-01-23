import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { ClientFunction } from 'testcafe';
import { createUser, generateMessages } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getFullThemeName, testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo, insertStylesheetRulesToPage } from '../../helpers/domUtils';

const CHAT_TYPINGINDICATOR_CIRCLE_CLASS = 'dx-chat-typingindicator-circle';
const waitFont = ClientFunction(() => (window as any).DevExpress.ui.themes.waitWebFont('Item123somevalu*op ', 400));

fixture.disablePageReloads`ChatTypingIndicator`
  .page(url(__dirname, '../container.html'));

test('Chat: typing indicator with emptyview', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#container');

  await testScreenshot(t, takeScreenshot, 'Typing indicator with emptyview.png', {
    element: '#container',
    shouldTestInCompact: true,
    compactCallBack: async () => {
      await chat.repaint();
    },
  });

  const darkTheme = getFullThemeName().replace('light', 'dark');
  await testScreenshot(t, takeScreenshot, 'Typing indicator with emptyview.png', {
    element: '#container',
    theme: darkTheme,
    themeChanged: async () => {
      await chat.repaint();
    },
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage(`.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

  const typingUsers = [
    { name: 'Elodie Montclair' },
  ];

  await waitFont();

  return createWidget('dxChat', {
    width: 400,
    height: 600,
    typingUsers,
  });
});

test('Chat: typing indicator with a lot of items', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#chat');

  await chat.repaint();

  await testScreenshot(t, takeScreenshot, 'Typing indicator with a lot of items.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');
  await insertStylesheetRulesToPage(`.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

  const userFirst = createUser(1, 'Marie-Claire Dubois');
  const userSecond = createUser(2, 'Jean-Pierre Martin');

  const items = generateMessages(27, userFirst, userSecond);

  const typingUsers = [userFirst];

  return createWidget('dxChat', {
    user: userSecond,
    width: 400,
    height: 600,
    items,
    typingUsers,
  }, '#chat');
});

test('Chat: typing indicator', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Typing indicator with 1 user.png', { element: '#chat' });

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'Camille');
  const userSecond = createUser(2, 'Sophie');
  const userThird = createUser(3, 'Antoine');
  const userFourth = createUser(4, 'Julien');

  await chat.option('typingUsers', [userFirst, userSecond]);
  await testScreenshot(t, takeScreenshot, 'Typing indicator with 2 users.png', { element: '#chat' });

  await chat.option('typingUsers', [userFirst, userSecond, userThird]);
  await testScreenshot(t, takeScreenshot, 'Typing indicator with 3 users.png', { element: '#chat' });

  await chat.option('typingUsers', [userFirst, userSecond, userThird, userFourth]);
  await testScreenshot(t, takeScreenshot, 'Typing indicator with 4 users.png', { element: '#chat' });

  await chat.option('typingUsers', [{ name: 'Marie-Francoise Isabelle Antoinette de La Rochefoucauld' }]);
  await testScreenshot(t, takeScreenshot, 'Typing indicator with long name.png', { element: '#chat' });

  await chat.option('typingUsers', [{}]);
  await testScreenshot(t, takeScreenshot, 'Typing indicator without name.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');
  await insertStylesheetRulesToPage(`.${CHAT_TYPINGINDICATOR_CIRCLE_CLASS} { animation: none !important; }`);

  const userFirst = createUser(1, 'Elise Moreau');
  const userSecond = createUser(2, 'Pierre Martin');

  const items = generateMessages(5, userFirst, userSecond);

  const typingUsers = [userFirst];

  await waitFont();

  return createWidget('dxChat', {
    user: userSecond,
    width: 400,
    height: 600,
    items,
    typingUsers,
  }, '#chat');
});
