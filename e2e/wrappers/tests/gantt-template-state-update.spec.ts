import { expect, test } from '../fixtures';

test.describe('Gantt template state update', () => {
    test.skip(({ framework }) => framework !== 'react19', 'The example is implemented for React only');

    test.beforeEach(async ({ page }) => {
        await page.goto('/examples/gantt-template-state-update');
    });

    test('Gantt should be able to unmount its template when a parent component\'s state update happens', async ({ page }) => {
        const hideButton = page.locator('button', { hasText: 'Hide Data' });
        const noDataPlaceholder = page.locator('.dx-treelist-nodata');

        await hideButton.click();

        await expect(noDataPlaceholder).toBeVisible();
        await expect(noDataPlaceholder).toHaveText('No data');
    });
});
