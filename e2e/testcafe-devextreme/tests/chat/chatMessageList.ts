import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { createUser, generateMessages } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo } from '../../helpers/domUtils';

fixture.disablePageReloads`ChatMessageBox`
  .page(url(__dirname, '../container.html'));

test('Chat: messagebox', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');
  const items = generateMessages(17, userFirst, true, false, userSecond, 2);

  await testScreenshot(t, takeScreenshot, 'Messagelist empty state.png', { element: '#chat' });

  await chat.option({
    user: userSecond,
    items,
  });

  await testScreenshot(t, takeScreenshot, 'Messagelist with a lot of messages.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    width: 400,
    height: 500,
  }, '#chat');
});
