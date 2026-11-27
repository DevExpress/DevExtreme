import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const CHAT_SUGGESTION_CARD_CLASS = 'chat-suggestion-card';
const CHAT_MESSAGELIST_EMPTY_VIEW_CLASS = 'dx-chat-messagelist-empty-view';

describeManualTest('Chat', 'MessageStreaming', { width: 900, height: 800 }, () => {
  test('MessageStreaming', async ({ page }) => {
    const suggestionCard = page.locator(`.${CHAT_SUGGESTION_CARD_CLASS}`);

    await suggestionCard.nth(0).hover();
    await expect(suggestionCard.nth(0)).not.toHaveCSS('box-shadow', 'none');

    await suggestionCard.first().evaluate((element) => Promise.all(
      element.getAnimations().map((animation) => animation.finished),
    ).then(() => undefined));

    await testScreenshot(page, 'chat_message_streaming_suggestion_card_is_hovered.png', `.${CHAT_MESSAGELIST_EMPTY_VIEW_CLASS}`);
  });
});
