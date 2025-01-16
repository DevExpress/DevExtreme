import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import {
  createUser,
  generateMessages,
  getLongText,
} from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo, insertStylesheetRulesToPage, setStyleAttribute } from '../../helpers/domUtils';
import asyncForEach from '../../helpers/asyncForEach';

const AVATAR_SELECTOR = '.dx-avatar';

fixture.disablePageReloads`ChatMessageGroup`
  .page(url(__dirname, '../container.html'));

test('Chat: messagegroup, avatar rendering', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Avatar has correct position.png', { element: '#chat' });

  await setStyleAttribute(Selector(AVATAR_SELECTOR), 'width: 64px; height: 64px');
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

  const items = generateMessages(2, userFirst, userSecond, false, false, 2);

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

  let items = generateMessages(1, userFirst, userSecond, false, false, 4, 2);

  await chat.option({ items, user: userSecond });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 1 bubble.png', { element: '#chat' });

  items = generateMessages(2, userFirst, userSecond, false, false, 4, 2);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 2 bubbles.png', { element: '#chat' });

  items = generateMessages(3, userFirst, userSecond, false, false, 4, 2);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Messagegroup with 3 bubbles.png', { element: '#chat' });

  items = generateMessages(4, userFirst, userSecond, false, false, 4, 2);

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

test('Messagegroup scenarios in disabled state', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  await insertStylesheetRulesToPage('#container { display: flex; flex-wrap: wrap; gap: 2px; padding: 20px; }');

  await asyncForEach([1, 2, 3, 4], async (bubbleCount, idx) => {
    const chatId = `#chat_${idx}`;
    await appendElementTo('#container', 'div', `chat_${idx}`);

    const items = generateMessages(bubbleCount, userFirst, userSecond, false, false, 4, 2);

    await createWidget('dxChat', {
      items,
      disabled: true,
      user: userSecond,
      width: 250,
      height: 400,
    }, chatId);

    const chat = new Chat(chatId);
    await chat.repaint();
  });

  await testScreenshot(t, takeScreenshot, 'Messagegroup appearance in disabled state.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});

test('Messagegroup scenarios in RTL mode', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  await insertStylesheetRulesToPage('#container { display: flex; flex-wrap: wrap; gap: 2px; padding: 20px; }');

  await asyncForEach([1, 2, 3, 4], async (bubbleCount, idx) => {
    const chatId = `#chat_${idx}`;
    await appendElementTo('#container', 'div', `chat_${idx}`);

    const items = generateMessages(bubbleCount, userFirst, userSecond, false, false, 4, 2);

    await createWidget('dxChat', {
      items,
      rtlEnabled: true,
      user: userSecond,
      width: 250,
      height: 400,
    }, chatId);

    const chat = new Chat(chatId);
    await chat.repaint(); // NOTE: WA to make it stable in Material theme.
  });

  await testScreenshot(t, takeScreenshot, 'Messagegroup appearance in RTL mode.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
});
