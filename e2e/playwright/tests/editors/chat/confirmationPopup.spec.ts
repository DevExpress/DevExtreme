import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import { createUser } from './data';

test.describe('ChatConfirmationPopup', () => {
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

    const chat = new Chat(page, '#container');

    await chat.getMessage(2).click({ button: 'right' });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    await testScreenshot(page, 'Confirmation popup is shown.png', { element: '#container' });
  });
});
