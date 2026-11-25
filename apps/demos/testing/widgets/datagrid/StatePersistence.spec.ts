import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';
import { trackPageActivity } from '../../../utils/visual-tests/playwright/demo-page';

describeManualTest('DataGrid', 'StatePersistence', { width: 900, height: 600 }, () => {
  test('StatePersistence', async ({ page }) => {
    await drag(page, page.locator('.dx-header-row .dx-datagrid-action').nth(0), 100, -50, {
      offsetX: 5,
      offsetY: 5,
    });
    await drag(page, page.locator('.dx-scrollbar-vertical .dx-scrollable-scroll').first(), 0, 250);

    await testScreenshot(page, 'datagrid_state_persistence_2_desktop.png');

    const waitForIdle = trackPageActivity(page);

    await page.reload();
    await waitForIdle();

    await testScreenshot(page, 'datagrid_state_persistence_3_desktop.png');
  });
});
