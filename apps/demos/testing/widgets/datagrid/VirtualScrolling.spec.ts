import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'VirtualScrolling', { width: 900, height: 600 }, () => {
  test('VirtualScrolling', async ({ page }) => {
    await page.locator('.dx-scrollbar-vertical .dx-scrollable-scroll').first().hover();
    await testScreenshot(page, 'datagrid_virtual_scrolling_2_desktop.png');

    await page.locator('.dx-scrollable-container').first()
      .evaluate((element, [x, y]) => element.scrollBy(x, y), [0, 2000000]);

    await testScreenshot(page, 'datagrid_virtual_scrolling_3_desktop.png');
  });
});
