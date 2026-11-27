import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'InfiniteScrolling', { width: 900, height: 600 }, () => {
  test('InfiniteScrolling', async ({ page }) => {
    await page.locator('.dx-datagrid-rowsview').first().hover();
    await testScreenshot(page, 'datagrid_infinite_scrolling_2_desktop.png');

    await page.locator('.dx-scrollable-container').first()
      .evaluate((element, [x, y]) => element.scrollBy(x, y), [0, 250]);

    await testScreenshot(page, 'datagrid_infinite_scrolling_3_desktop.png');
  });
});
