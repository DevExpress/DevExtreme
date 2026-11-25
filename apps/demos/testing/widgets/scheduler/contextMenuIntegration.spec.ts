import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Scheduler', 'ContextMenu', { width: 900, height: 800 }, () => {
  test('ContextMenu', async ({ page }) => {
    const contextMenu = page.locator('.dx-context-menu').first();

    await testScreenshot(page, 'scheduler_contextMenu_init.png');

    await page.locator('.dx-scheduler-appointment').first().click({ button: 'right' });
    await expect(contextMenu, 'Context menu should appear after right click').toBeAttached();
    await testScreenshot(page, 'scheduler_contextMenu_click.png');

    await page.locator('.dx-scheduler-date-table-cell').nth(6).click({ button: 'right' });
    await expect(contextMenu, 'Context menu should appear after right click on cell').toBeAttached();
    await testScreenshot(page, 'scheduler_contextMenu_cell_click.png');

    await page.locator('.dx-scheduler-header-panel-cell').nth(2).click({ button: 'right' });
    await testScreenshot(page, 'scheduler_contextMenu_header_click.png');
  });
});
