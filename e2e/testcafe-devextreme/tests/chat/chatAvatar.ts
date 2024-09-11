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
  await testScreenshot(t, takeScreenshot, 'Avatar with initials.png', { element: '#chat' });

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'First', avatarUrl);
  const userSecond = createUser(2, 'Second', avatarUrl);

  const items = generateMessages(2, userFirst, false, false, userSecond, 2);

  await chat.option('items', items);

  await testScreenshot(t, takeScreenshot, 'Avatar with image.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  const items = generateMessages(2, userFirst, false, false, userSecond, 2);

  return createWidget('dxChat', {
    height: 200,
    width: 200,
    user: userSecond,
    items,
  }, '#chat');
});
