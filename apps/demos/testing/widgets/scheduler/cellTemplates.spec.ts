import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'CellTemplates', { width: 900, height: 600 }, () => {
  test('CellTemplates', async ({ page }) => {
    // Fluent and Material themes show the views in a drop-down (useDropDownViewSwitcher).
    await page.locator('.dx-scheduler-view-switcher-dropdown-button').click();
    await page.locator('.dx-list-item').filter({ hasText: /^Month$/ }).click();
    await testScreenshot(page, 'scheduler_CellTemplates_month_view.png');
  });

  test('Cell templates should not render twice after view dates were changed (T1180373)', async ({ page }) => {
    await page.locator('.dx-scheduler-navigator-next').first().click();

    await testScreenshot(page, 'scheduler_CellTemplates_view_dates_changed.png');
  });
});
