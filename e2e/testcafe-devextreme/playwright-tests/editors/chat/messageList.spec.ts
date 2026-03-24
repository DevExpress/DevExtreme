import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatMessageList', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test.skip('Messagelist empty view scenarios', async ({ page }) => {
    await createWidget(page, 'dxChat', {
    width: 400,
    height: 600,
  });

    const chat = page.locator('#container');

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

  test.skip('Messagelist appearance with scrollbar', async ({ page }) => {

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = generateMessages(17, userFirst, userSecond, true, false, 2);

    await createWidget(page, 'dxChat', {
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

    const chat = page.locator('#container');

    await page.hover(chat.messageList);

    await testScreenshot(page, 'Messagelist with a lot of messages.png', { element: '#container' });

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

    await testScreenshot(page, 'Messagelist scrollbar position after call renderMessage().png', { element: '#container' });

    await page.typeText(chat.getInput(), getLongText())
      .pressKey('shift+enter');

    await testScreenshot(page, 'Messagelist scrollbar position after typing in textarea.png', { element: '#container' });

    await page.keyboard.press('Enter');

    await testScreenshot(page, 'Messagelist scrollbar position after send.png', { element: '#container' });

    const scrollable = chat.getScrollable();
    const topOffset = (await scrollable.scrollOffset()).top;

    await scrollable.scrollTo({ top: topOffset - 100 });

    await page.typeText(chat.getInput(), getLongText());

    await testScreenshot(page, 'Messagelist scrollbar middle position after typing in textarea.png', { element: '#container' });

    });

  test.skip('Messagelist should scrolled to the latest messages after being rendered inside an invisible element', async ({ page }) => {

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = generateMessages(17, userFirst, userSecond, true, false, 2);

    await createWidget(page, 'dxTabPanel', {
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
        template: ClientFunction(() => ($('<div>') as any).dxChat({
          items,
          user: userSecond,
        }), { dependencies: { items, userSecond } }),
      }],
    });

    const tabPanel = page.locator('#container');

    await tabPanel.tabs.getItem(1).element.click();

    await testScreenshot(page, 'Messagelist scroll position after rendering in invisible container.png', { element: '#container' });

    });

  test.skip('Messagelist with deleted items', async ({ page }) => {

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

  test.skip('Messagelist with deleted items and custom template', async ({ page }) => {

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
      messageTemplate: ({ message }, container) => {
        if (message.isDeleted) {
          $('<div>').text(`${message.author.name} deleted this message`).appendTo(container);
          return;
        }
        $('<div>').text(message.text).appendTo(container);
      },
    });

    await testScreenshot(page, 'Messagelist with message template and deleted messages.png', { element: '#container' });

    });

  test.skip('Messagelist with messageTemplate', async ({ page }) => {

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
      onMessageEntered: ({ component, message }) => {
        message.timestamp = undefined;
        component.renderMessage(message);
      },
      messageTemplate: ({ message }, container) => {
        $('<div>').text(`${message.author.name} says: ${message.text}`).appendTo(container);
      },
    });

    const chat = page.locator('#container');

    await testScreenshot(page, 'Messagelist with message template.png', { element: '#container' });

    await chat.getInput().fill('New last message')
      .pressKey('enter');

    await testScreenshot(page, 'Messagelist with message template after new message add.png', { element: '#container' });

    });

  test.skip('Messagelist options showDayHeaders, showUserName and showMessageTimestamp set to false work', async ({ page }) => {

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

    await testScreenshot(page,
      'Messagelist with showDayHeaders, showUserName and showMessageTimestamp options set to false.png',
      { element: '#container' },

    });

  test.skip('Message list with editing context menu', async ({ page }) => {

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

    const chat = page.locator('#container');

    await page.rightClick(chat.getMessage(2))
      .pressKey('down')
      .pressKey('down');

    await testScreenshot(page, 'Messagelist with editing context menu.png', { element: '#container' });

    });

  test.skip([
    { module: 'mockdate' },
    { content: 'window.MockDate = MockDate;' },
  ])('Messagelist with date headers', async ({ page }) => {

    await testScreenshot(page, 'Messagelist with date headers.png', { element: '#container' });
  }).before(async () => {
    await page.evaluate(() => {
      (window as any).MockDate.set('2024/10/27');
    });

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
  }).after(async () => {
    await page.evaluate(() => {
      (window as any).MockDate.reset();
      delete (window as any).MockDate;
    });
  });
});
