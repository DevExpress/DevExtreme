import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { appendElementTo } from '../../../helpers/domUtils';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import {
  attachments, createUser, getLongText, getShortText,
} from './data';

test.describe('ChatMessageBox', () => {
  test('Chat: messagebox', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');
    await createWidget(page, 'dxChat', {
      width: 400,
      height: 600,
    }, '#chat');

    const chat = new Chat(page, '#chat');
    const input = chat.getInput();

    const shortText = getShortText();
    const longText = getLongText(false, 5);

    await chat.focus();
    await testScreenshot(page, 'Messagebox when chat has focus.png', { element: '#chat' });

    await input.click();
    await input.pressSequentially(shortText);
    await testScreenshot(page, 'Messagebox when input contains short text.png', { element: '#chat' });

    await input.click();
    await input.pressSequentially(longText);
    await testScreenshot(page, 'Messagebox when input contains long text.png', { element: '#chat' });

    await page.keyboard.press('Tab');
    await testScreenshot(page, 'Messagebox when send button has focus.png', { element: '#chat' });
  });

  test('Chat: messagebox with editing preview', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');

    const items = [{
      author: userFirst,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    }, {
      author: userSecond,
      text: 'Short message',
    }];

    await createWidget(page, 'dxChat', {
      items,
      user: userFirst,
      editing: {
        allowUpdating: true,
      },
      width: 400,
      height: 600,
    }, '#chat');

    const chat = new Chat(page, '#chat');

    await chat.getMessage(0).click({ button: 'right' });
    await chat.getContextMenuItem(0).click();

    await testScreenshot(page, 'Messagebox with editing preview.png', { element: '#chat' });
  });

  test('Chat: messagebox with attachments and informer', async ({ page }) => {
    await appendElementTo(page, '#container', 'div', 'chat');
    await createWidget(page, 'dxChat', {
      width: 812,
      height: 600,
    }, '#chat');

    const chat = new Chat(page, '#chat');
    const input = chat.getInput();

    await input.click();
    await input.pressSequentially(getLongText(false, 4));
    await chat.option({
      fileUploaderOptions: {
        value: [
          ...attachments,
          ...attachments,
          ...attachments,
        ],
      },
    });

    await chat.focus();
    await testScreenshot(page, 'Messagebox with attachments and informer.png', { element: '#chat' });
  });
});
