import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { mockDate } from '../../../helpers/mockDate';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import TabPanel from '../../../models/tabPanel';
import { createUser, generateMessages, getLongText } from './data';

test.describe('ChatMessageList', () => {
  test('Messagelist empty view scenarios', async ({ page }) => {
    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    });

    const chat = new Chat(page, '#container');

    await testScreenshot(page, 'Messagelist empty state.png', { element: '#container' });

    await chat.option('rtlEnabled', true);

    await testScreenshot(page, 'Messagelist empty in RTL mode.png', { element: '#container' });

    await chat.option({
      disabled: true,
      rtlEnabled: false,
    });

    await testScreenshot(page, 'Messagelist empty in disabled state.png', { element: '#container' });

    await chat.option({
      width: 200,
      height: 400,
      disabled: false,
    });

    await testScreenshot(page, 'Messagelist empty with limited dimensions.png', { element: '#container' });
  });

  test('Messagelist appearance with scrollbar', async ({ page }) => {
    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = generateMessages(17, userFirst, userSecond, true, false, 2);

    await createWidget(page, 'dxChat', (options) => ({
      ...options,
      width: 400,
      height: 600,
      showDayHeaders: false,
      onMessageEntered: (e) => {
        const { component, message } = e;

        component.renderMessage(message);
      },
    }), undefined, { arg: { items, user: userSecond } });

    const chat = new Chat(page, '#container');
    const input = chat.getInput();

    await chat.messageList.hover();

    await testScreenshot(page, 'Messagelist with a lot of messages.png', { element: '#container' });

    await chat.element.evaluate((element) => {
      const instance = ($(element) as any).dxChat('instance');

      instance.renderMessage({
        author: instance.option('user'),
        text: 'Lorem ipsum dolor sit amet, \nconsectetur adipiscing elit. Sed do eiusmod tempor \nincididunt ut labore et dolore magna aliqua. Ut enim ad minim \nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip \nnex ea commodo consequat.',
      });
    });

    await testScreenshot(page, 'Messagelist scrollbar position after call renderMessage().png', { element: '#container' });

    await input.click();
    await input.pressSequentially(getLongText());
    await page.keyboard.press('Shift+Enter');

    await testScreenshot(page, 'Messagelist scrollbar position after typing in textarea.png', { element: '#container' });

    await page.keyboard.press('Enter');

    await testScreenshot(page, 'Messagelist scrollbar position after send.png', { element: '#container' });

    const scrollable = chat.getScrollable();
    const { top } = await scrollable.scrollOffset();

    await scrollable.scrollTo({ top: top - 100 });

    await input.click();
    await input.pressSequentially(getLongText());

    await testScreenshot(page, 'Messagelist scrollbar middle position after typing in textarea.png', { element: '#container' });
  });

  test('Messagelist should scrolled to the latest messages after being rendered inside an invisible element', async ({ page }) => {
    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = generateMessages(17, userFirst, userSecond, true, false, 2);

    await createWidget(page, 'dxTabPanel', ({ chatItems, user }) => ({
      width: 400,
      height: 600,
      deferRendering: true,
      templatesRenderAsynchronously: true,
      dataSource: [{
        title: 'Tab_1',
        collapsible: true,
        text: 'Tab_1 content',
      }, {
        title: 'Tab_2',
        collapsible: true,
        template: () => ($('<div>') as any).dxChat({
          items: chatItems,
          user,
        }),
      }],
    }), undefined, { arg: { chatItems: items, user: userSecond } });

    const tabPanel = new TabPanel(page, '#container');

    await tabPanel.getTab(1).click();

    await testScreenshot(page, 'Messagelist scroll position after rendering in invisible container.png', { element: '#container' });
  });

  test('Messagelist with deleted items', async ({ page }) => {
    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const items = [{
      author: userFirst,
      text: 'AAA',
    }, {
      author: userFirst,
      text: 'BBB',
      isDeleted: true,
    }, {
      author: userSecond,
      text: 'CCC',
      isDeleted: true,
    }];

    await createWidget(page, 'dxChat', {
      items,
      user: userFirst,
      width: 400,
      height: 600,
      showDayHeaders: false,
    });

    await testScreenshot(page, 'Messagelist without message template and with deleted messages.png', { element: '#container' });
  });

  test('Messagelist with deleted items and custom template', async ({ page }) => {
    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const items = [{
      author: userFirst,
      text: 'AAA',
    }, {
      author: userFirst,
      text: 'BBB',
      isDeleted: true,
    }, {
      author: userSecond,
      text: 'CCC',
      isDeleted: true,
    }];

    await createWidget(page, 'dxChat', (options) => ({
      ...options,
      width: 400,
      height: 600,
      showDayHeaders: false,
      messageTemplate: ({ message }, container) => {
        if (message.isDeleted) {
          $('<div>').text(`${message.author.name} deleted this message`).appendTo(container);
          return;
        }
        $('<div>').text(message.text).appendTo(container);
      },
    }), undefined, { arg: { items, user: userFirst } });

    await testScreenshot(page, 'Messagelist with message template and deleted messages.png', { element: '#container' });
  });

  test('Messagelist with messageTemplate', async ({ page }) => {
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

    await createWidget(page, 'dxChat', (options) => ({
      ...options,
      width: 400,
      height: 600,
      showDayHeaders: false,
      onMessageEntered: ({ component, message }) => {
        component.renderMessage({ ...message, timestamp: undefined });
      },
      messageTemplate: ({ message }, container) => {
        $('<div>').text(`${message.author.name} says: ${message.text}`).appendTo(container);
      },
    }), undefined, { arg: { items, user: userFirst } });

    const chat = new Chat(page, '#container');
    const input = chat.getInput();

    await testScreenshot(page, 'Messagelist with message template.png', { element: '#container' });

    await input.click();
    await input.pressSequentially('New last message');
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'Messagelist with message template after new message add.png', { element: '#container' });
  });

  test('Messagelist options showDayHeaders, showUserName and showMessageTimestamp set to false work', async ({ page }) => {
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

    await createWidget(page, 'dxChat', {
      items,
      user: userFirst,
      width: 400,
      height: 600,
      showDayHeaders: false,
      showUserName: false,
      showMessageTimestamp: false,
    });

    await testScreenshot(
      page,
      'Messagelist with showDayHeaders, showUserName and showMessageTimestamp options set to false.png',
      { element: '#container' },
    );
  });

  test('Message list with editing context menu', async ({ page }) => {
    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = [
      { author: userFirst, text: 'AAA' },
      { author: userFirst, text: 'BBB' },
      { author: userSecond, text: 'CCC' },
    ];

    await createWidget(page, 'dxChat', {
      items,
      editing: {
        allowUpdating: true,
        allowDeleting: true,
      },
      user: userSecond,
      width: 400,
      height: 600,
      showDayHeaders: false,
    });

    const chat = new Chat(page, '#container');

    await chat.getMessage(2).click({ button: 'right' });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    await testScreenshot(page, 'Messagelist with editing context menu.png', { element: '#container' });
  });
});

test.describe('ChatMessageList: dayHeaders', () => {
  test('Messagelist with date headers', async ({ page }) => {
    await mockDate(page, '2024/10/27');

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

    await createWidget(page, 'dxChat', {
      items,
      user: userSecond,
      width: 400,
      height: 600,
    });

    await testScreenshot(page, 'Messagelist with date headers.png', { element: '#container' });
  });
});
