import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import {
  createUser, generateMessages, getLongText, generateSpecifiedNumberOfMessagesInRow,
} from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../helpers/domUtils';

const CHAT_AVATAR_SELECTOR = '.dx-chat-message-avatar';

fixture.disablePageReloads`ChatMessageGroup`
  .page(url(__dirname, '../container.html'));

test('Chat: messagegroup, avatar rendering', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Avatar has correct position.png', { element: '#chat' });

  await setStyleAttribute(Selector(CHAT_AVATAR_SELECTOR), 'width: 64px; height: 64px');
  await testScreenshot(t, takeScreenshot, 'Avatar sizes do not affect indentation between bubbles.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const userFirst = createUser(1, 'First');
  const items = generateMessages(3, userFirst);

  return createWidget('dxChat', {
    width: 400,
    height: 600,
    items,
  }, '#chat');
});

test('Chat: messagegroup, information', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Information row with long user name.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const userFirst = createUser(1, getLongText());
  const userSecond = createUser(2, getLongText());

  const items = generateMessages(2, userFirst, false, false, userSecond, 2);

  return createWidget('dxChat', {
    width: 400,
    height: 600,
    user: userSecond,
    items,
  }, '#chat');
});

test('Chat: messagegroup, bubbles', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  let items = generateSpecifiedNumberOfMessagesInRow(1, userFirst, userSecond);

  await chat.option({ items, user: userSecond });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 1 bubble.png', { element: '#chat' });

  items = generateSpecifiedNumberOfMessagesInRow(2, userFirst, userSecond);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 2 bubbles.png', { element: '#chat' });

  items = generateSpecifiedNumberOfMessagesInRow(3, userFirst, userSecond);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 3 bubbles.png', { element: '#chat' });

  items = generateSpecifiedNumberOfMessagesInRow(4, userFirst, userSecond);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 4 bubbles.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    width: 400,
    height: 600,
  }, '#chat');
});
