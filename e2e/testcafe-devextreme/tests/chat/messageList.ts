import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { ClientFunction } from 'testcafe';
import { User } from 'devextreme/ui/chat';
import TabPanel from 'devextreme-testcafe-models/tabPanel';
import { createUser, generateMessages, getLongText } from './data';
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
    disabled: false,
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

  const chat = new Chat('#container');

  await t
    .hover(chat.messageList)
    .wait(400);

  await testScreenshot(t, takeScreenshot, 'Messagelist with a lot of messages.png', { element: '#container' });

  await ClientFunction(
    () => {
      const instance = chat.getInstance();
      instance.renderMessage({
        author: instance.option('user') as User,
        text: 'Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit. Sed do eiusmod tempor \nincididunt ut labore et dolore magna aliqua. Ut enim ad minim \nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip \nnex ea commodo consequat.',
      });
    },
    { dependencies: { chat } },
  )();

  await testScreenshot(t, takeScreenshot, 'Messagelist scrollbar position after call renderMessage().png', { element: '#container' });

  await t
    .typeText(chat.getInput(), getLongText())
    .pressKey('shift+enter');

  await testScreenshot(t, takeScreenshot, 'Messagelist scrollbar position after typing in textarea.png', { element: '#container' });

  await t
    .pressKey('enter');

  await testScreenshot(t, takeScreenshot, 'Messagelist scrollbar position after send.png', { element: '#container' });

  const scrollable = chat.getScrollable();
  const topOffset = (await scrollable.scrollOffset()).top;

  await scrollable.scrollTo({ top: topOffset - 100 });

  await t
    .typeText(chat.getInput(), getLongText());

  await testScreenshot(t, takeScreenshot, 'Messagelist scrollbar middle position after typing in textarea.png', { element: '#container' });

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
    showDayHeaders: false,
  });
});

test('Messagelist should scrolled to the latest messages after being rendered inside an invisible element', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  const tabPanel = new TabPanel('#container');

  await t
    .click(tabPanel.tabs.getItem(1).element);

  await testScreenshot(t, takeScreenshot, 'Messagelist scroll position after rendering in invisible container.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  const items = generateMessages(17, userFirst, userSecond, true, false, 2);

  return createWidget('dxTabPanel', {
    width: 400,
    height: 500,
    deferRendering: true,
    templatesRenderAsynchronously: true,
    dataSource: [{
      title: 'Tab_1',
      collapsible: true,
      text: 'Tab_1 content',
    }, {
      title: 'Tab_2',
      collapsible: true,
      template: ClientFunction(() => ($('<div>') as any).dxChat({
        items,
        user: userSecond,
      }), { dependencies: { items, userSecond } }),
    }],
  });
});

test('Messagelist with date headers', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Messagelist with date headers.png', { element: '#container' });

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
    timestamp: new Date('05.01.2024'),
    author: userFirst,
    text: 'AAA',
  }, {
    timestamp: new Date('06.01.2024'),
    author: userFirst,
    text: 'BBB',
  }, {
    timestamp: new Date('06.01.2024'),
    author: userSecond,
    text: 'CCC',
  }, {
    timestamp: yesterday,
    author: userSecond,
    text: 'DDD',
  }, {
    timestamp: today,
    author: userFirst,
    text: 'EEE',
  }];

  return createWidget('dxChat', {
    items,
    user: userSecond,
    width: 400,
    height: 600,
  });
});
