import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const SELECTBOX_CLASS = 'dx-selectbox';
const CHECKBOX_CLASS = 'dx-checkbox';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const LIST_ITEM_CLASS = 'dx-list-item';

fixture('Chat.Customization')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'Customization', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Customization', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t
      .click(Selector(`.${SELECTBOX_CLASS}`).nth(0))
      .click(Selector(`.${LIST_ITEM_CLASS}`).nth(2))
      .wait(500);

    await testScreenshot(t, takeScreenshot, 'chat_customization_day_headers_format_is_changed.png');

    await t
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(2));

    await testScreenshot(t, takeScreenshot, 'chat_customization_day_headers_is_hidden.png');

    await t
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(0));

    await testScreenshot(t, takeScreenshot, 'chat_customization_avatar_is_hidden.png');

    await t
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(0));

    await t
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(1));

    await testScreenshot(t, takeScreenshot, 'chat_customization_username_is_hidden.png');

    await t
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(1));

    await t
      .click(Selector(`.${SELECTBOX_CLASS}`).nth(1))
      .click(Selector(`.${LIST_ITEM_CLASS}`).nth(5))
      .wait(500);

    await testScreenshot(t, takeScreenshot, 'chat_customization_message_timestamp_format_is_changed.png');

    await t
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(3));

    await testScreenshot(t, takeScreenshot, 'chat_customization_message_timestamps_is_hidden.png');

    await t
      .typeText(`.${TEXTEDITOR_INPUT_CLASS}`, 'testing')
      .pressKey('enter')
      .click(Selector(`.${CHECKBOX_CLASS}`).nth(4));

    await testScreenshot(t, takeScreenshot, 'chat_customization_is_disabled_after_sent.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
