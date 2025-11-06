import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import {
  createUser,
  generateImageMessage,
  generateMessages,
  generateFileMessage,
} from './data';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';
import { appendElementTo } from '../../../helpers/domUtils';

fixture.disablePageReloads`ChatMessageBubble`
  .page(url(__dirname, '../../container.html'));

test('Chat: messagebubble', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  let items = generateMessages(2, userFirst, userSecond, true, false, 2);

  await chat.option({ items, user: userSecond });
  await testScreenshot(t, takeScreenshot, 'Bubbles with long text.png', { element: '#chat' });

  items = generateMessages(2, userFirst, userSecond, true, true, 2);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Bubbles with long text with line breaks.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    width: 400,
    height: 650,
  }, '#chat');
});

test('Chat: messagebubble with images and files', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#chat');

  const user = createUser(1, 'ImageUser');

  const imageMessages = [
    generateImageMessage(user, '../../../apps/demos/images/products/1.png'),
    generateImageMessage(user, '../../../apps/demos/images/products/1-small.png'),
  ];

  await chat.option({ items: imageMessages });
  await testScreenshot(t, takeScreenshot, 'Bubbles with images.png', { element: '#chat' });

  const fileMessages = [
    generateFileMessage(user),
    generateFileMessage(user, true),
  ];

  await chat.option({
    width: 700,
    height: 720,
    items: fileMessages,
  });
  await testScreenshot(t, takeScreenshot, 'Bubbles with files.png', { element: '#chat' });

  await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    width: 600,
    height: 650,
  }, '#chat');
});
