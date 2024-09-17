import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { createUser, generateMessages } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`ChatMessageList`
  .page(url(__dirname, '../container.html'));

test('Messagelist empty view scenarios', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const chat = new Chat('#container');

  await testScreenshot(t, takeScreenshot, 'Messagelist empty state.png', { element: '#container' });

  await chat.option('rtlEnabled', true);

  await testScreenshot(t, takeScreenshot, 'Messagelist empty in RTL mode.png', { element: '#container' });

  await chat.option({
    disabled: true,
    rtlEnabled: false,
  });

  await testScreenshot(t, takeScreenshot, 'Messagelist empty in disabled state.png', { element: '#container' });

  await chat.option({
    width: 200,
    height: 200,
  });

  await testScreenshot(t, takeScreenshot, 'Messagelist empty with limited dimensions.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => createWidget('dxChat', {
  width: 400,
  height: 600,
}));

test('Messagelist appearance with scrollbar', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Messagelist with a lot of messages.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  const items = generateMessages(17, userFirst, userSecond, true, false, 2);

  return createWidget('dxChat', {
    items,
    user: userSecond,
    width: 400,
    height: 600,
  });
});
