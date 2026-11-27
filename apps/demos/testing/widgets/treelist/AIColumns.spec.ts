import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('TreeList', 'AIColumns', { width: 900, height: 800 }, () => {
  test('AIColumns', async ({ page }) => {
    await expect(page.locator('.dx-command-ai').filter({ hasText: 'Management' }).first()).toBeAttached();

    await page.locator('.dx-page').filter({ hasText: '2' }).first().click();

    await expect(page.locator('.dx-command-ai').filter({ hasText: 'Sales' }).first()).toBeAttached();
    await expect(page.locator('.dx-loadpanel-content').first()).toBeHidden();

    await testScreenshot(page, 'treelist_ai_columns_salaried_status_desktop.png', page.locator('.status--salaried').first());

    await testScreenshot(page, 'treelist_ai_columns_commission_status_desktop.png', page.locator('.status--commission').first());

    await testScreenshot(page, 'treelist_ai_columns_terminated_status_desktop.png', page.locator('.status--terminated').first());
  });
});
