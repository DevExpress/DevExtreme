import { expect, test } from '../fixtures';

test.describe('CardView template re-rendering', () => {
    test.skip(({ framework }) => framework !== 'react19', 'The example is implemented for React only');

    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/card-view-template-rerender');
    });

    test('CardView should not duplicate card templates after a dataSource update (T1336765)', async ({ page }) => {
        const updateButton = page.locator('button', { hasText: 'Update Data' });
        const cards = page.locator('.custom-card');

        await expect(cards).toHaveText(['1: 0', '2: 0']);

        await updateButton.click();

        await expect(cards).toHaveText(['1: 1', '2: 1']);
    });
});
