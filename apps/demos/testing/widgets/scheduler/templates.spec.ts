import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'Overview', { width: 900, height: 600 }, () => {
  test('Overview cell selection (T1041269)', async ({ page }) => {
    await page.locator('.dx-scheduler-date-table-cell').first().click();
    await page.evaluate(() => window.scrollTo(0, 0));

    await testScreenshot(page, 'scheduler_overview_selection.png');
  });
});
