import { test } from '../../../fixtures';
import { createWidget } from '../../../helpers/createWidget';
import { mockDate } from '../../../helpers/mockDate';
import { testScreenshot } from '../../../helpers/screenshots';
import Chat from '../../../models/chat';
import { createUser } from './data';

test.describe('ChatAlertList', () => {
  test('Alertlist appearance', async ({ page }) => {
    await mockDate(page, '2024/10/18');

    const userFirst = createUser(1, 'First');
    const userSecond = createUser(2, 'Second');
    const msInDay = 86400000;
    const today = new Date('2024/10/18').setHours(7, 22, 0, 0);
    const yesterday = today - msInDay;

    const items = [{
      timestamp: yesterday,
      author: userSecond,
      text: 'Message text 1',
    }, {
      timestamp: yesterday,
      author: userSecond,
      text: 'Message text 2',
    }, {
      timestamp: today,
      author: userFirst,
      text: 'Message text 3',
    }, {
      timestamp: today,
      author: userFirst,
      text: 'Message text 4',
    }];

    await createWidget(page, 'dxChat', {
      items,
      user: userFirst,
      width: 400,
      height: 600,
      alerts: [{ id: 1, message: 'Error Message 1. Error Description...' }],
    });

    const chat = new Chat(page, '#container');

    await testScreenshot(page, 'Alertlist with one error.png', { element: '#container' });

    await chat.option('alerts', [
      { id: 1, message: 'Error Message 1. Error Description...' },
      { id: 2, message: 'Error Message 2. Message was not sent' },
      { id: 3, message: 'Error Message 3. An unexpected issue occurred while processing your request. Please check your internet connection or contact support for further assistance.' },
    ]);

    await testScreenshot(page, 'Alertlist with long text in error.png', { element: '#container' });

    await chat.option('rtlEnabled', true);

    await testScreenshot(page, 'Alertlist appearance in RTL mode.png', { element: '#container' });
  });
});
