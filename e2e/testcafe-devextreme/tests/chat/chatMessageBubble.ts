import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { createUser, generateMessages } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo } from '../../helpers/domUtils';

fixture.disablePageReloads`ChatMessageBubble`
  .page(url(__dirname, '../container.html'));

test('Chat: messagebubble', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  let items = generateMessages(2, userFirst, true, false, userSecond, 2);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Bubbles with long text.png', { element: '#chat' });

  items = generateMessages(2, userFirst, true, true, userSecond, 2);

  await chat.option({ items });
  await testScreenshot(t, takeScreenshot, 'Bubbles with long text with line breaks.png', { element: '#chat' });

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
