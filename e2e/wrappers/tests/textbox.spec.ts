import { expect, test } from '../fixtures';

test.describe('TextBox Dynamic Styles scenarios', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/text-box-dynamic-styles');
    });

    test('TextBox should update inline styles', async ({ page }) => {
        const textboxWrapper = page.locator('.dx-textbox');
        const textboxInput = page.locator('.dx-texteditor-input');

        await expect(textboxWrapper).toBeAttached();
        await expect(textboxInput).toBeAttached();

        await textboxInput.pressSequentially('trigger');
        await textboxInput.press('Enter');

        await expect(textboxInput).toHaveValue('trigger');
        await expect(textboxWrapper).toHaveCSS('background-color', 'rgb(255, 99, 132)');

        await textboxInput.pressSequentially(' again');
        await textboxInput.press('Enter');

        await expect(textboxInput).toHaveValue('trigger again');
        await expect(textboxWrapper).toHaveCSS('background-color', 'rgb(54, 162, 235)');
    });
});
