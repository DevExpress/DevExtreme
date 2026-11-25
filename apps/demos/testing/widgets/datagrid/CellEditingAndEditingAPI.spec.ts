import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'CellEditing', { width: 900, height: 600 }, () => {
  test('CellEditing', async ({ page }) => {
    const cells = page.locator('.dx-datagrid-rowsview').locator('td');

    await cells.nth(2).click();
    await testScreenshot(page, 'datagrid_cell_editing_2_desktop.png');

    const input = cells.nth(2).locator('input').nth(0);

    await input.fill('');
    await input.pressSequentially('Bob');
    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await testScreenshot(page, 'datagrid_cell_editing_3_desktop.png');

    const selectCells = page.locator('td.dx-command-select');
    const checkBoxIcons = page.locator('.dx-checkbox-icon');

    for (const index of [2, 4, 5]) {
      await selectCells.nth(index).hover();
      await checkBoxIcons.nth(index).click();
    }
    await testScreenshot(page, 'datagrid_cell_editing_4_desktop.png');

    await page.locator('[aria-label="Delete Selected Records"]').first().click();
    // The removed button had the focus: jQuery passes it to the "Add a row" button, a framework that
    // re-renders the toolbar loses it. The shot is about the rows, so nothing keeps the focus.
    await page.evaluate(() => { (document.activeElement as HTMLElement | null)?.blur(); });
    await testScreenshot(page, 'datagrid_cell_editing_5_desktop.png');
  });
});
