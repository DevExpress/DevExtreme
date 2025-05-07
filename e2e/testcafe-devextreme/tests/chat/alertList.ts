import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { ClientFunction } from 'testcafe';
import { createUser } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { getFullThemeName, testScreenshot } from '../../helpers/themeUtils';

fixture.disablePageReloads`ChatAlertList`
  .page(url(__dirname, '../container.html'));

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('Alertlist appearance', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#container');

  await testScreenshot(t, takeScreenshot, 'Alertlist with one error.png', { element: '#container' });

  await chat.option('alerts', [
    { id: 1, message: 'Error Message 1. Error Description...' },
    { id: 2, message: 'Error Message 2. Message was not sent' },
    { id: 3, message: 'Error Message 3. An unexpected issue occurred while processing your request. Please check your internet connection or contact support for further assistance.' },
  ]);

  await testScreenshot(t, takeScreenshot, 'Alertlist with long text in error.png', {
    element: '#container',
    shouldTestInCompact: true,
    compactCallBack: async () => {
      await chat.repaint();
    },
  });

  const darkTheme = getFullThemeName().replace('light', 'dark');
  await testScreenshot(t, takeScreenshot, 'Alertlist with long text in error.png', {
    element: '#container',
    theme: darkTheme,
    themeChanged: async () => {
      await chat.repaint();
    },
  });

  await chat.option('rtlEnabled', true);

  await testScreenshot(t, takeScreenshot, 'Alertlist appearance in RTL mode.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2024/10/18');
  })();

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');
  const msInDay = 86400000;
  const today = new Date('2024/10/18').setHours(7, 22, 0, 0);
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
  }];

  return createWidget('dxChat', {
    items,
    user: userFirst,
    width: 400,
    height: 600,
    alerts: [{ id: 1, message: 'Error Message 1. Error Description...' }],
  });
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
  })();
});
