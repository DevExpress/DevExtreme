import { expect, test } from '../fixtures';

test.describe('inputs-list-in-form scenarios', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/inputs-list-in-form');
    });

    test('Phone inputs should be added and deleted correctly', async ({ page }) => {
        const addButton = page.locator('.dx-button-text', { hasText: 'Add phone' });
        const deleteButton = page.locator('.dx-button', { has: page.locator('.dx-icon-trash') });
        const phoneGroup = page.locator('[aria-labelledby$="_phones-container"]');
        const phoneInputs = phoneGroup.locator('.dx-texteditor-container');

        await expect(phoneInputs).toHaveCount(0);

        await addButton.click();
        await expect(phoneInputs).toHaveCount(1);

        await deleteButton.click();
        await expect(phoneInputs).toHaveCount(0);
    });
});
