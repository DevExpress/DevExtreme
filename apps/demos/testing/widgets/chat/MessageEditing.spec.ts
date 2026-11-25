import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const SELECTBOX_CLASS = 'dx-selectbox';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const LIST_ITEM_CLASS = 'dx-list-item';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGELIST_CONTEXT_MENU_CONTENT_CLASS = 'dx-messagelist-context-menu-content';
const CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS = 'dx-chat-confirmation-popup-wrapper';
const BUTTON_CLASS = 'dx-button';
const MENU_ITEM_CLASS = 'dx-menu-item';

describeManualTest('Chat', 'MessageEditing', { width: 900, height: 800 }, () => {
  test('MessageEditing', async ({ page }) => {
    const messageBubble = page.locator(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
    const contextMenuButton = page.locator(`.${CHAT_MESSAGELIST_CONTEXT_MENU_CONTENT_CLASS} .${MENU_ITEM_CLASS}`);
    const confirmationPopupButton = page.locator(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS} .${BUTTON_CLASS}`);
    const selectBox = page.locator(`.${SELECTBOX_CLASS}`);
    const listItem = page.locator(`.${LIST_ITEM_CLASS}`);
    const textEditorInput = page.locator(`.${TEXTEDITOR_INPUT_CLASS}`).first();

    const screenshotNames = {
      confirmationDialog: 'confirmation_dialog_is_shown.png',
      messageDeleted: 'message_is_deleted.png',
      previewShown: 'preview_is_shown.png',
      messageEdited: 'message_is_edited.png',
      messageDeletingDisabled: 'message_deleting_is_disabled.png',
      messageEditingDisabled: 'message_editing_is_disabled.png',
      lastMessageContextMenu: 'last_message_context_menu.png',
    };

    await messageBubble.nth(2).click({ button: 'right' });
    await contextMenuButton.nth(1).click();

    await testScreenshot(page, screenshotNames.confirmationDialog);

    await confirmationPopupButton.nth(0).click();

    await testScreenshot(page, screenshotNames.messageDeleted);

    await messageBubble.nth(1).click({ button: 'right' });
    await contextMenuButton.nth(0).click();

    await testScreenshot(page, screenshotNames.previewShown);

    await expect(textEditorInput).not.toHaveValue('');

    await textEditorInput.click();
    // TestCafe typed with { caretPos: 0 }: put the caret at the start of the edited text.
    await textEditorInput.evaluate((element) => {
      if (element instanceof HTMLTextAreaElement || element instanceof HTMLInputElement) {
        element.setSelectionRange(0, 0);
      }
    });
    await textEditorInput.pressSequentially('testing');
    await page.keyboard.press('Enter');

    await testScreenshot(page, screenshotNames.messageEdited);

    await selectBox.nth(1).click();
    await listItem.nth(1).click();

    await messageBubble.nth(1).click({ button: 'right' });

    await testScreenshot(page, screenshotNames.messageDeletingDisabled);

    await selectBox.nth(1).click();
    await listItem.nth(2).click();

    await selectBox.nth(0).click();
    await listItem.nth(4).click();

    await messageBubble.nth(1).click({ button: 'right' });

    await testScreenshot(page, screenshotNames.messageEditingDisabled);

    await selectBox.nth(0).click();
    await listItem.nth(5).click();

    await textEditorInput.click();
    await textEditorInput.pressSequentially('new message');
    await page.keyboard.press('Enter');

    await messageBubble.nth(5).click({ button: 'right' });

    await testScreenshot(page, screenshotNames.lastMessageContextMenu);
  });
});
