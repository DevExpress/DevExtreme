import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import { Chat } from '../../../playwright-helpers/chat';
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

  test('Messagelist appearance with scrollbar', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const items = generateMessages(20, userFirst, userSecond);

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
      items,
      user: userSecond,
    }, '#chat');

    const chat = new Chat(page, '#chat');
    await chat.repaint();

    await testScreenshot(page, 'Messagelist with scrollbar.png', { element: '#chat' });
  });

  test('Messagelist should scrolled to the latest messages after being rendered inside an invisible element', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'wrapper');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const items = generateMessages(20, userFirst, userSecond);

    await page.evaluate(({ items: msgs }) => {
      const $wrapper = $('#wrapper');
      $wrapper.hide();

      ($('<div>').attr('id', 'hidden-chat') as any).dxChat({
        width: 400,
        height: 600,
        items: msgs,
      }).appendTo($wrapper);

      $wrapper.show();
      ($('#hidden-chat') as any).dxChat('instance').repaint();
    }, { items });

    await testScreenshot(page, 'Messagelist scrolled to latest after hidden render.png', { element: '#hidden-chat' });
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
      messageTemplate: (data: any, container: any) => {
        container.text(`Custom: ${data.text}`);
      },
    });

    await testScreenshot(page, 'Messagelist with message template and deleted messages.png', { element: '#container' });
  });
});
