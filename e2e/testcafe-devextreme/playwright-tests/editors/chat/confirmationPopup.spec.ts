import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot } from '../../../playwright-helpers';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatConfirmationPopup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  ,

  test('Chat: confirmation popup', async ({ page }) => {

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
        allowDeleting: true,
      },
      user: userSecond,
      width: 400,
      height: 600,
      showDayHeaders: false,
      rtlEnabled: true,
    });

    const chat = page.locator('#container');

    await rightClick(chat.getMessage(2)).pressKey('down').pressKey('enter');

    await testScreenshot(page, 'Confirmation popup is shown.png', {
      element: '#container',
    });

    });
});
