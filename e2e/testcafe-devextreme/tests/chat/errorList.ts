import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { createUser } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getFullThemeName, testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`ChatErrorList`
  .page(url(__dirname, '../container.html'));

test.skip('Errorlist appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#container');

  await testScreenshot(t, takeScreenshot, 'Errorlist with one error.png', { element: '#container' });

  await chat.option('errors', [
    { id: 1, message: 'Error Message 1. Error Description...' },
    { id: 2, message: 'Error Message 2. Message was not sent' },
    { id: 3, message: 'Error Message 3. An unexpected issue occurred while processing your request. Please check your internet connection or contact support for further assistance.' },
  ]);

  await testScreenshot(t, takeScreenshot, 'Errorlist with long text in error.png', {
    element: '#container',
    shouldTestInCompact: true,
    compactCallBack: async () => {
      await chat.repaint();
    },
  });

  const darkTheme = getFullThemeName().replace('light', 'dark');
  await testScreenshot(t, takeScreenshot, 'Errorlist with long text in error.png', { element: '#container', theme: darkTheme });

  await chat.option('rtlEnabled', true);

  await testScreenshot(t, takeScreenshot, 'Errorlist appearance in RTL mode.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');
  const msInDay = 86400000;
  const today = new Date().setHours(7, 22, 0, 0);
  const yesterday = today - msInDay;

  const items = [{
    timestamp: yesterday,
    author: userSecond,
    text: 'Message text 1',
  }, {
    timestamp: yesterday,
    author: userSecond,
    text: 'Message text 2',
  }, {
    timestamp: today,
    author: userFirst,
    text: 'Message text 3',
  }, {
    timestamp: today,
    author: userFirst,
    text: 'Message text 4',
  }, {
    timestamp: today,
    author: userFirst,
    text: 'Message text 5',
  }];

  return createWidget('dxChat', {
    items,
    user: userFirst,
    width: 400,
    height: 600,
    errors: [{ id: 1, message: 'Error Message 1. Error Description...' }],
  });
});
