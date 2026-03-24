import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import { createUser, generateMessages, getLongText } from './data';
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

  test('Messagelist empty view scenarios', async ({ page }) => {
    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    });

    await testScreenshot(page, 'Messagelist empty state.png', { element: '#container' });

    await page.evaluate(() => {
      ($('#container') as any).dxChat('instance').option('rtlEnabled', true);
    });

    await testScreenshot(page, 'Messagelist empty in RTL mode.png', { element: '#container' });

    await page.evaluate(() => {
      ($('#container') as any).dxChat('instance').option({ disabled: true, rtlEnabled: false });
    });

    await testScreenshot(page, 'Messagelist empty in disabled state.png', { element: '#container' });

    await page.evaluate(() => {
      ($('#container') as any).dxChat('instance').option({ width: 200, height: 400, disabled: false });
    });

    await testScreenshot(page, 'Messagelist empty with limited dimensions.png', { element: '#container' });
  });

  test.skip('Messagelist appearance with scrollbar', async ({ page }) => {
    // skipped: requires Chat page object with getInput, getScrollable, scrollOffset, renderMessage
  });

  test.skip('Messagelist should scrolled to the latest messages after being rendered inside an invisible element', async ({ page }) => {
    // skipped: requires TabPanel page object with tabs, ClientFunction template
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

    await createWidget(page, 'dxChat', {
      items,
      user: userFirst,
      width: 400,
      height: 600,
      showDayHeaders: false,
      messageTemplate: ({ message }: any, container: any) => {
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
    // skipped: requires Chat page object with getInput
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

    await testScreenshot(page,
      'Messagelist with showDayHeaders, showUserName and showMessageTimestamp options set to false.png',
      { element: '#container' },
    );
  });

  test.skip('Message list with editing context menu', async ({ page }) => {
    // skipped: requires Chat page object with getMessage and rightClick
  });

  test.skip('Messagelist with date headers', async ({ page }) => {
    // skipped: requires MockDate client scripts injection and .before()/.after() setup
  });
});
