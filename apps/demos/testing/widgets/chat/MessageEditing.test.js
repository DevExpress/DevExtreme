import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const SELECTBOX_CLASS = 'dx-selectbox';
const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const LIST_ITEM_CLASS = 'dx-list-item';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const CHAT_MESSAGELIST_CONTEXT_MENU_CONTENT_CLASS = 'dx-messagelist-context-menu-content';
const CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS = 'dx-chat-confirmation-popup-wrapper';
const BUTTON_CLASS = 'dx-button';
const MENU_ITEM_CLASS = 'dx-menu-item';

fixture('Chat.MessageEditing')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'MessageEditing', (test) => {
  test('MessageEditing', async (t) => {
    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    const messageBubble = Selector(`.${CHAT_MESSAGEBUBBLE_CLASS}`);
    const contextMenuButton = Selector(`.${CHAT_MESSAGELIST_CONTEXT_MENU_CONTENT_CLASS} .${MENU_ITEM_CLASS}`);
    const confirmationPopupButton = Selector(`.${CHAT_CONFIRMATION_POPUP_WRAPPER_CLASS} .${BUTTON_CLASS}`);
    const selectBox = Selector(`.${SELECTBOX_CLASS}`);
    const listItem = Selector(`.${LIST_ITEM_CLASS}`);
    const textEditorInput = Selector(`.${TEXTEDITOR_INPUT_CLASS}`);

    const screenshotNames = {
      confirmationDialog: 'confirmation_dialog_is_shown.png',
      messageDeleted: 'message_is_deleted.png',
      previewShown: 'preview_is_shown.png',
      messageEdited: 'message_is_edited.png',
      messageDeletingDisabled: 'message_deleting_is_disabled.png',
      messageEditingDisabled: 'message_editing_is_disabled.png',
      lastMessageContextMenu: 'last_message_context_menu.png',
    };

    await t
      .rightClick(messageBubble.nth(2))
      .click(contextMenuButton.nth(1));

    await testScreenshot(t, takeScreenshot, screenshotNames.confirmationDialog);

    await t
      .click(confirmationPopupButton.nth(0));

    await testScreenshot(t, takeScreenshot, screenshotNames.messageDeleted);

    await t
      .rightClick(messageBubble.nth(1))
      .click(contextMenuButton.nth(0));

    await testScreenshot(t, takeScreenshot, screenshotNames.previewShown);

    await t
      .typeText(textEditorInput, 'testing')
      .pressKey('enter');

    await testScreenshot(t, takeScreenshot, screenshotNames.messageEdited);

    await t
      .click(selectBox.nth(1))
      .click(listItem.nth(1));

    await t
      .rightClick(messageBubble.nth(1));

    await testScreenshot(t, takeScreenshot, screenshotNames.messageDeletingDisabled);

    await t
      .click(selectBox.nth(1))
      .click(listItem.nth(2));

    await t
      .click(selectBox.nth(0))
      .click(listItem.nth(4));

    await t
      .rightClick(messageBubble.nth(1));

    await testScreenshot(t, takeScreenshot, screenshotNames.messageEditingDisabled);

    await t
      .click(selectBox.nth(0))
      .click(listItem.nth(5));

    await t
      .typeText(textEditorInput, 'new message')
      .pressKey('enter');

    await t
      .rightClick(messageBubble.nth(5));

    await testScreenshot(t, takeScreenshot, screenshotNames.lastMessageContextMenu);

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
