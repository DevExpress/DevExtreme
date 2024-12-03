import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Chat.Customization')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'Customization', ['jQuery'], (test) => {
  test('Customization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
        .click('#day-headers-format')
        .click(Selector('.dx-list-item').nth(2))
        .wait(500);

    await testScreenshot(t, takeScreenshot, `chat_customization_day_headers_format_is_changed.png`);

    await t
        .click('#show-day-headers');

    await testScreenshot(t, takeScreenshot, 'chat_customization_day_headers_is_hidden.png');

    await t
        .click('#show-avatar');

    await testScreenshot(t, takeScreenshot, 'chat_customization_avatar_is_hidden.png');

    await t
        .click('#show-avatar');
    
    await t
        .click('#show-user-name');

    await testScreenshot(t, takeScreenshot, 'chat_customization_username_is_hidden.png');

    await t
        .click('#show-user-name');

    await t
        .click('#message-timestamp-format')
        .click(Selector('.dx-list-item').nth(5))
        .wait(500);

    await testScreenshot(t, takeScreenshot, `chat_customization_message_timestamp_format_is_changed.png`);

    await t
        .click('#show-message-timestamp');

    await testScreenshot(t, takeScreenshot, 'chat_customization_message_timestamps_is_hidden.png');
       
    await t
        .typeText('.dx-texteditor-input','testing')
        .pressKey('enter')
        .click('#chat-disabled');

    await testScreenshot(t, takeScreenshot, 'chat_customization_is_disabled_after_sent.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
