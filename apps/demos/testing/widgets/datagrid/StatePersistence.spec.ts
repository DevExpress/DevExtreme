import { test } from '@playwright/test';
import {
  describeManualTest, drag, testScreenshot, waitForSettled,
} from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'StatePersistence', { width: 900, height: 600 }, () => {
  test('StatePersistence', async ({ page }) => {
    await drag(page, page.locator('.dx-header-row .dx-datagrid-action').nth(0), 100, -50, {
      offsetX: 5,
      offsetY: 5,
    });
    await drag(page, page.locator('.dx-scrollbar-vertical .dx-scrollable-scroll').first(), 0, 250);

    await testScreenshot(page, 'datagrid_state_persistence_2_desktop.png');

    await page.reload();
    await waitForSettled(page);

    await testScreenshot(page, 'datagrid_state_persistence_3_desktop.png');
  });
});
