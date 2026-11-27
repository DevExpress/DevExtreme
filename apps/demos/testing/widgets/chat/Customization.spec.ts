import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const SELECTBOX_CLASS = 'dx-selectbox';
const CHECKBOX_CLASS = 'dx-checkbox';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const LIST_ITEM_CLASS = 'dx-list-item';

describeManualTest('Chat', 'Customization', { width: 900, height: 800 }, () => {
  test('Customization', async ({ page }) => {
    const selectBoxes = page.locator(`.${SELECTBOX_CLASS}`);
    const checkBoxes = page.locator(`.${CHECKBOX_CLASS}`);
    const listItems = page.locator(`.${LIST_ITEM_CLASS}`);
    const textEditorInput = page.locator(`.${TEXTEDITOR_INPUT_CLASS}`).first();

    await selectBoxes.nth(0).click();
    await listItems.nth(2).click();

    await testScreenshot(page, 'chat_customization_day_headers_format_is_changed.png');

    await checkBoxes.nth(2).click();

    await testScreenshot(page, 'chat_customization_day_headers_is_hidden.png');

    await checkBoxes.nth(0).click();

    await testScreenshot(page, 'chat_customization_avatar_is_hidden.png');

    await checkBoxes.nth(0).click();

    await checkBoxes.nth(1).click();

    await testScreenshot(page, 'chat_customization_username_is_hidden.png');

    await checkBoxes.nth(1).click();

    await selectBoxes.nth(1).click();
    await listItems.nth(5).click();

    await testScreenshot(page, 'chat_customization_message_timestamp_format_is_changed.png');

    await checkBoxes.nth(3).click();

    await testScreenshot(page, 'chat_customization_message_timestamps_is_hidden.png');

    await textEditorInput.click();
    await textEditorInput.pressSequentially('testing');
    await page.keyboard.press('Enter');
    await checkBoxes.nth(4).click();

    await testScreenshot(page, 'chat_customization_is_disabled_after_sent.png');
  });
});
