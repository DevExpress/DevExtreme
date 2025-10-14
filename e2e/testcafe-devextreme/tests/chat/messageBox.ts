import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { getShortText, getLongText, createUser } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo } from '../../helpers/domUtils';

fixture.disablePageReloads`ChatMessageBox`
  .page(url(__dirname, '../container.html'));

test('Chat: messagebox', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  const shortText = getShortText();
  const longText = getLongText(false, 5);

  await chat.focus();
  await testScreenshot(t, takeScreenshot, 'Messagebox when chat has focus.png', { element: '#chat' });

  await t.typeText(chat.getInput(), shortText);
  await testScreenshot(t, takeScreenshot, 'Messagebox when input contains short text.png', { element: '#chat' });

  await t.typeText(chat.getInput(), longText);
  await testScreenshot(t, takeScreenshot, 'Messagebox when input contains long text.png', { element: '#chat' });

  await t.pressKey('tab');
  await testScreenshot(t, takeScreenshot, 'Messagebox when send button has focus.png', { element: '#chat' });

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

test('Chat: messagebox with editing preview', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  await t.rightClick(chat.getMessage(0));
  await t.click(chat.getContextMenuItem(0));

  await testScreenshot(t, takeScreenshot, 'Messagebox with editing preview.png', {
    element: '#chat',
    shouldTestInCompact: true,
  });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  const items = [{
    author: userFirst,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  }, {
    author: userSecond,
    text: 'Short message',
  }];

  return createWidget('dxChat', {
    items,
    user: userFirst,
    editing: {
      allowUpdating: true,
    },
    width: 400,
    height: 600,
  }, '#chat');
});

test('Chat: messagebox with attach button', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#chat');

  await chat.focus();
  await testScreenshot(t, takeScreenshot, 'Messagebox with attach button.png', { element: '#chat' });

  await t.typeText(chat.getInput(), getShortText());
  await testScreenshot(t, takeScreenshot, 'Messagebox with attach button and text.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    width: 400,
    height: 600,
    fileUploaderOptions: {},
  }, '#chat');
});
