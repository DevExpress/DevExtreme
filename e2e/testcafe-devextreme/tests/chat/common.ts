import { Selector } from 'testcafe';
import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { appendElementTo, setStyleAttribute } from '../../helpers/domUtils';

const CHAT_AVATAR_SELECTOR = '.dx-chat-message-avatar';

fixture.disablePageReloads`Chat`
  .page(url(__dirname, '../container.html'));

test('Chat: line breaks', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  await testScreenshot(t, takeScreenshot, 'Chat message bubble line breaks.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  return createWidget('dxChat', {
    height: 500,
    width: 300,
    items: [
      {
        text: 'line\nbreak',
      },
    ],
  }, '#chat');
});

test('Chat: avatar rendering', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Avatar has correct position.png', { element: '#chat' });

  await setStyleAttribute(Selector(CHAT_AVATAR_SELECTOR), 'width: 64px; height: 64px');

  await testScreenshot(t, takeScreenshot, 'Avatar sizes do not affect indentation between bubbles.png', { element: '#chat' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await appendElementTo('#container', 'div', 'chat');

  const randomUint32 = '0.392722124265449';

  return createWidget('dxChat', {
    height: 500,
    width: 400,
    items: [
      {
        text: randomUint32,
      },
      {
        text: randomUint32,
      },
    ],
  }, '#chat');
});
