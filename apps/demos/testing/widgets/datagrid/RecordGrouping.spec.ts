import { test } from '@playwright/test';
import { describeManualTest, drag, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'RecordGrouping', { width: 900, height: 600 }, () => {
  test('RecordGrouping', async ({ page }) => {
    const autoExpand = page.locator('#autoExpand');

    await autoExpand.click();

    await testScreenshot(page, 'datagrid_record_grouping_2_desktop.png');

    await autoExpand.click();

    await testScreenshot(page, 'datagrid_record_grouping_3_desktop.png');

    await drag(
      page,
      page.locator('.dx-datagrid-headers .dx-datagrid-drag-action').nth(0),
      50,
      -50,
      { offsetX: 5, offsetY: 5 },
    );

    await testScreenshot(page, 'datagrid_record_grouping_4_desktop.png');

    await page.locator('.dx-datagrid-group-opened').nth(0).click();

    await testScreenshot(page, 'datagrid_record_grouping_5_desktop.png');

    await page.locator('.dx-datagrid-group-opened').nth(0).click();

    await testScreenshot(page, 'datagrid_record_grouping_6_desktop.png');
  });
});
