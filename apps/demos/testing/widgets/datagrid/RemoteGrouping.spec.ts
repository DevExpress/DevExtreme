import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'RemoteGrouping', { width: 900, height: 600 }, () => {
  test('RemoteGrouping', async ({ page }) => {
    await page.locator('.dx-scrollable-container').first().waitFor({ state: 'attached' });

    await testScreenshot(page, 'datagrid_remote_grouping_initial.png');

    await page.evaluate((pixels) => {
      const container = document.querySelector('.dx-scrollable-container');

      if (container) {
        container.scrollTop = pixels;
      }
    }, 5000);

    await testScreenshot(page, 'datagrid_remote_grouping_scrolled.png');

    await page.locator('.dx-group-row').nth(2).locator(':scope > .dx-datagrid-expand').first()
      .click();

    await testScreenshot(page, 'datagrid_remote_grouping_expanded.png');
  });
});
