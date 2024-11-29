import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Chat.Customization')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 600];
  });

runManualTest('Chat', 'Customization', ['jQuery'/* , 'React', 'Vue', 'Angular' */], (test) => {
  test('Customization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);
    const dayHeaderFormatOption = ['dd_MM_yyyy', 'dd.MM.yyyy', 'MMMM dd, yyyy', 'EEEE, MMMM dd'];
    const messageTimestampOption = ['hh:mm a', 'hh:mm:ss a', 'HH:mm', 'HH:mm:ss'];

    await t
        .typeText('.dx-texteditor-input','testing')
        .pressKey('enter');
    await testScreenshot(t, takeScreenshot, 'Chat after sending a message.png');

    await testScreenshot(t, takeScreenshot, 'Chat when showAvatar = true.png');

    await t
        .click('#show-avatar');

    await testScreenshot(t, takeScreenshot, 'Chat when showAvatar = false.png');

    await t
        .click('#show-avatar');

    await testScreenshot(t, takeScreenshot, 'Chat when showUsername = true.png');

    await t
        .click('#show-user-name');

    await testScreenshot(t, takeScreenshot, 'Chat when showUsername = false.png');

    await t
        .click('#show-user-name');

    await testScreenshot(t, takeScreenshot, 'Chat when showDayHeaders = true.png');

    await t
        .click('#show-day-headers');

    await testScreenshot(t, takeScreenshot, 'Chat when showDayHeaders = false.png');

    await t
    .click('#show-day-headers');

    dayHeaderFormatOption.forEach(async(element, index) => {
        await t
        .click('#day-headers-format')
        .click(Selector('.dx-list-item').nth(index));
        await testScreenshot(t, takeScreenshot, `Chat when dayHeaderFormat = ${element}.png`);
    });

    await testScreenshot(t, takeScreenshot, 'Chat when showMessageTimestamp = true.png');

    await t
        .click('#show-message-timestamp');

    await testScreenshot(t, takeScreenshot, 'Chat when showMessageTimestamp = false.png');

    await t
    .click('#show-message-timestamp');

    messageTimestampOption.forEach(async(element, index) => {
        await t
        .click('#message-timestamp-format')
        .click(Selector('.dx-list-item').nth(index));
        await testScreenshot(t, takeScreenshot, `Chat when messageTimestampFormat = ${element}.png`);
    });

    await testScreenshot(t, takeScreenshot, 'Chat when disabled = false.png');

    await t
        .click('#chat-disabled');

    await testScreenshot(t, takeScreenshot, 'Chat when disabled = true.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
