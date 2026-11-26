import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'RowSelection', { width: 900, height: 600 }, () => {
  test('RowSelection', async ({ page }) => {
    const rows = page.locator('.dx-datagrid-rowsview tr');

    await rows.nth(0).click();
    await testScreenshot(page, 'datagrid_row_selection_2_desktop.png');

    await rows.nth(2).click();
    await testScreenshot(page, 'datagrid_row_selection_3_desktop.png');

    await rows.nth(0).click({ modifiers: ['Control'] });
    await testScreenshot(page, 'datagrid_row_selection_4_desktop.png');
  });
});
