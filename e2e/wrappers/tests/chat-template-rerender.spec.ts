import { expect, test } from '../fixtures';

test.describe('Chat template re-rendering', () => {
    test.skip(({ framework }) => framework !== 'react19', 'The example is implemented for React only');

    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/chat-template-rerender');
    });

    test('Chat should be able to re-render its messages', async ({ page }) => {
        const textarea = page.locator('.dx-chat-messagebox textarea');
        const sendButton = page.locator('.dx-chat-messagebox .dx-chat-textarea-toolbar .dx-button');
        const assistantBubble = page.locator('.chat-messagebubble-text').nth(1);
        const regenerateButton = page.locator('.dx-icon-refresh').nth(1);

        await textarea.pressSequentially('Hi there!');
        await sendButton.click();

        await expect(assistantBubble).toHaveText('How can I help you?');

        await regenerateButton.click();

        await expect(assistantBubble).toHaveText('In other words, what do you want?');
    });
});
