import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import Chat from 'devextreme-testcafe-models/chat';
import { createUser } from './data';
import url from '../../../helpers/getPageUrl';
import { createWidget } from '../../../helpers/createWidget';
import { testScreenshot } from '../../../helpers/themeUtils';

fixture.disablePageReloads`ChatConfirmationPopup`.page(
  url(__dirname, '../container.html'),
);

test('Chat: confirmation popup', async (t) => {
  const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
  const chat = new Chat('#container');

  await t.rightClick(chat.getMessage(2)).pressKey('down').pressKey('enter');

  await testScreenshot(t, takeScreenshot, 'Confirmation popup is shown.png', {
    element: '#container',
    shouldTestInCompact: true,
  });

  await t.expect(compareResults.isValid()).ok(compareResults.errorMessages());
}).before(async () => {
  const userFirst = createUser(1, 'First');
  const userSecond = createUser(2, 'Second');

  const items = [
    { author: userFirst, text: 'AAA' },
    { author: userFirst, text: 'BBB' },
    { author: userSecond, text: 'CCC' },
  ];

  return createWidget('dxChat', {
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
});
