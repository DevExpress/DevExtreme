import { test, expect } from '@playwright/test';
import { createWidget, testScreenshot, appendElementTo } from '../../../playwright-helpers';
import { createUser, getShortText, getLongText, attachments } from './data';
import path from 'path';

const containerUrl = `file://${path.resolve(__dirname, '../../../tests/container.html')}`;

test.describe('ChatMessageBox', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(containerUrl);
    await page.waitForFunction(() => !!(window as any).DevExpress && !!(window as any).$);
    await page.evaluate((theme) => new Promise<void>((resolve) => {
      (window as any).DevExpress.ui.themes.ready(resolve);
      (window as any).DevExpress.ui.themes.current(theme);
    }), process.env.THEME || 'fluent.blue.light');
  });

  test('Chat: messagebox', async ({ page }) => {

    await appendElementTo(page, '#container', 'div', 'chat');

    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    }, '#chat');

    const shortText = getShortText();
    const longText = getLongText(false, 5);

    await page.evaluate(() => {
      ($('#chat') as any).dxChat('instance').focus();
    });
    await testScreenshot(page, 'Messagebox when chat has focus.png', { element: '#chat' });

    const input = page.locator('#chat .dx-texteditor-input');
    await input.fill(shortText);
    await testScreenshot(page, 'Messagebox when input contains short text.png', { element: '#chat' });

    await input.fill(longText);
    await testScreenshot(page, 'Messagebox when input contains long text.png', { element: '#chat' });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'Messagebox when send button has focus.png', { element: '#chat' });
  });

  test.skip('Chat: messagebox with editing preview', async ({ page }) => {
    // skipped: requires Chat page object with getMessage, rightClick, getContextMenuItem
  });

  test.skip('Chat: messagebox with attachments and informer', async ({ page }) => {
    // skipped: requires Chat page object with getInput, option, focus
  });
});
