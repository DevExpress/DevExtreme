import { expect, test } from '../fixtures';

test.describe('SelectBox nested validator scenarios', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/select-box-nested-validator');
    });

    test('SelectBox with nested Validator component should not render double errors', async ({ page }) => {
        const validateButton = page.locator('.dx-button-text', { hasText: 'Validate' });
        const validationSummary = page.locator('.dx-validationsummary');

        await expect(validateButton).toBeAttached();
        await expect(validationSummary).toBeAttached();

        await validateButton.click();

        const validationSummaryItems = validationSummary.locator('.dx-validationsummary-item');

        await expect(validationSummaryItems).toHaveCount(1);
        await expect(validationSummaryItems.first()).toHaveText('Type is required');
    });

    test('SelectBox validation should pass when value is selected', async ({ page }) => {
        const validateButton = page.locator('.dx-button-text', { hasText: 'Validate' });
        const validationSummary = page.locator('.dx-validationsummary');
        const selectBoxArrow = page.locator('.dx-selectbox .dx-dropdowneditor-button');

        await selectBoxArrow.click();

        const firstItem = page.locator('.dx-item', { hasText: 'One' });

        await expect(firstItem).toBeVisible();
        await firstItem.click();

        await validateButton.click();

        await expect(validationSummary.locator('.dx-validationsummary-item')).toHaveCount(0);
    });
});
