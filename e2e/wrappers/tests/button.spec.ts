import { expect, test } from '../fixtures';

test.describe('Button scenarios', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/button');
    });

    test('Button should exist', async ({ page }) => {
        await expect(page.locator('.dx-button-text')).toBeAttached();
    });
});
