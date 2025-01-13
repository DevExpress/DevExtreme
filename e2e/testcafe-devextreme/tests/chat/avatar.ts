import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { createUser, generateMessages, avatarUrl } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo } from '../../helpers/domUtils';

fixture.disablePageReloads`ChatAvatar`
  .page(url(__dirname, '../container.html'));

test('Chat: avatar', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'Avatar with two word initials.png', { element: '#chat' });

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'First', avatarUrl);
  const userSecond = createUser(2, 'Second', avatarUrl);

  const items = generateMessages(2, userFirst, userSecond, false, false, 2);

  await chat.option('items', items);

  await testScreenshot(t, takeScreenshot, 'Avatar with image.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const userFirst = createUser(1, 'First User');
  const userSecond = createUser(2, 'Second User');

  const items = generateMessages(2, userFirst, userSecond, false, false, 2);

  return createWidget('dxChat', {
    width: 400,
    height: 600,
    user: userSecond,
    items,
  }, '#chat');
});

test('Chat: showAvatar set to false', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Avatar with showAvatar set to false.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const userFirst = createUser(1, 'First User');
  const userSecond = createUser(2, 'Second User');

  const items = generateMessages(2, userFirst, userSecond, false, false, 2);

  return createWidget('dxChat', {
    width: 400,
    height: 600,
    user: userSecond,
    items,
    showAvatar: false,
  }, '#chat');
});
