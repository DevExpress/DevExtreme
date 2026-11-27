import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';
import { CHAT_ANSWER, CHAT_QUESTION } from '../../apiMocks/handlers/openai';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';
const CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS = 'dx-chat-messagegroup-alignment-start';
const CHAT_MESSAGEBUBBLE_CLASS = 'dx-chat-messagebubble';
const BUTTON_CLASS = 'dx-button';

describeManualTest('Chat', 'AIAndChatbotIntegration', { width: 900, height: 800 }, () => {
  test('AIAndChatbotIntegration', async ({ page }) => {
    const assistantMessageBubble = page.locator(`.${CHAT_MESSAGEGROUP_ALIGNMENT_START_CLASS} .${CHAT_MESSAGEBUBBLE_CLASS}`);
    const copyButton = assistantMessageBubble.locator(`.${BUTTON_CLASS}`).nth(0);
    const textEditorInput = page.locator(`.${TEXTEDITOR_INPUT_CLASS}`).first();

    await textEditorInput.click();
    await textEditorInput.pressSequentially(CHAT_QUESTION);
    await page.keyboard.press('Enter');

    await expect(assistantMessageBubble.filter({ hasText: CHAT_ANSWER })).toHaveCount(1);

    await copyButton.hover();

    await testScreenshot(page, 'chat_ai_and_chatbot_integration_copy_button_is_hovered.png', copyButton);
  });
});
