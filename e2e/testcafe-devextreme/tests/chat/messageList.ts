import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { ClientFunction } from 'testcafe';
import { Message, User } from 'devextreme/ui/chat';
import TabPanel from 'devextreme-testcafe-models/tabPanel';
import { createUser, generateMessages, getLongText } from './data';
import url from '../../helpers/getPageUrl';
import { createWidget } from '../../helpers/createWidget';
import { testScreenshot } from '../../helpers/themeUtils';
import { insertStylesheetRulesToPage } from '../../helpers/domUtils';

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
    onMessageEntered: (e) => {
      const { component, message } = e;

      component.renderMessage(message);
    },
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

test('Messagelist with loadindicator appearance on initial loading', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#container');

  await chat.repaint();
  await testScreenshot(t, takeScreenshot, 'Messagelist loadindicator position on initial loading.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await insertStylesheetRulesToPage('.dx-loadindicator-content, .dx-loadindicator-icon, .dx-loadindicator-segment, .dx-loadindicator-segment-inner { animation-play-state: paused !important; }');

  await createWidget('dxChat', () => {
    const data: Message[] = [];

    return {
      dataSource: new (window as any).DevExpress.data.CustomStore({
        key: 'id',
        load: () => new Promise<Message[]>((resolve) => {
          setTimeout(() => {
            resolve(data);
          }, 3000);
        }),
      }),
      width: 400,
      height: 600,
    };
  });
});

test('Messagelist with messageTemplate', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#container');

  await testScreenshot(t, takeScreenshot, 'Messagelist with message template.png', { element: '#container' });

  await t
    .typeText(chat.getInput(), 'New last message')
    .pressKey('enter');

  await testScreenshot(t, takeScreenshot, 'Messagelist with message template after new message add.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');
  const items = [{
    author: userFirst,
    text: 'AAA',
  }, {
    author: userFirst,
    text: 'BBB',
  }, {
    author: userSecond,
    text: 'CCC',
  }];

  return createWidget('dxChat', {
    items,
    user: userFirst,
    width: 400,
    height: 600,
    showDayHeaders: false,
    onMessageEntered: ({ component, message }) => {
      message.timestamp = undefined;
      component.renderMessage(message);
    },
    messageTemplate: ({ message }, container) => {
      $('<div>').text(`${message.author.name} says: ${message.text}`).appendTo(container);
    },
  });
});

test('Messagelist options showDayHeaders, showUserName and showMessageTimestamp set to false work', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(
    t,
    takeScreenshot,
    'Messagelist with showDayHeaders, showUserName and showMessageTimestamp options set to false.png',
    { element: '#container' },
  );

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');
  const items = [{
    author: userFirst,
    text: 'AAA',
  }, {
    author: userFirst,
    text: 'BBB',
  }, {
    author: userSecond,
    text: 'CCC',
  }];

  return createWidget('dxChat', {
    items,
    user: userFirst,
    width: 400,
    height: 600,
    showDayHeaders: false,
    showUserName: false,
    showMessageTimestamp: false,
  });
});

fixture`ChatMessageList: dayHeaders`
  .page(url(__dirname, '../container.html'));

test.clientScripts([
  { module: 'mockdate' },
  { content: 'window.MockDate = MockDate;' },
])('Messagelist with date headers', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

  await testScreenshot(t, takeScreenshot, 'Messagelist with date headers.png', { element: '#container' });

  await t
    .expect(compareResults.isValid())
    .ok(compareResults.errorMessages());
}).before(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.set('2024/10/27');
  })();

  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');
  const msInDay = 86400000;
  const today = new Date('2024/10/27').setHours(7, 22, 0, 0);
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
}).after(async () => {
  await ClientFunction(() => {
    (window as any).MockDate.reset();
    delete (window as any).MockDate;
  })();
});
