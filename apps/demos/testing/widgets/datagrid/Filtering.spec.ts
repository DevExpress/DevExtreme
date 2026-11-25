import { test, expect } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('DataGrid', 'Filtering', { width: 900, height: 600 }, () => {
  test('Filtering', async ({ page }) => {
    const filterRow = page.locator('.dx-datagrid-filter-row');
    const filterMenuItem = (index: number) => filterRow
      .locator('.dx-menu-horizontal')
      .nth(index)
      .locator('.dx-menu-item')
      .nth(0);
    const overlayMenuItems = page.locator('.dx-overlay-wrapper').locator('.dx-menu-item');
    const overlayInputs = page.locator('.dx-overlay-wrapper').locator('.dx-texteditor-input');
    const filterRowInput = page.locator('.dx-datagrid-filter-row td').nth(4).locator('input').nth(0);
    const gridInput = page.locator('#gridContainer').locator('.dx-texteditor-input').nth(1);
    // The grid applies a typed filter after a delay; TestCafe typed slowly enough to see it applied.
    const expectOnlyRowsWith = (text: string): Promise<void> => expect(page.locator('.dx-data-row').filter({ hasNotText: text })).toHaveCount(0);

    await filterMenuItem(3).hover();
    await expect(overlayMenuItems).toHaveCount(8);

    await testScreenshot(page, 'datagrid_filtering_by_range_1_desktop.png');

    await overlayMenuItems.nth(6).click();

    await testScreenshot(page, 'datagrid_filtering_by_range_2_desktop.png');

    await overlayInputs.nth(0).click();
    await overlayInputs.nth(0).pressSequentially('1000');
    await overlayInputs.nth(1).click();
    await overlayInputs.nth(1).pressSequentially('5000');
    await expect(page.locator('.dx-page')).toHaveCount(1);

    await testScreenshot(page, 'datagrid_filtering_by_range_3_desktop.png');

    await page.locator('body').click({ position: { x: 0, y: 0 } });
    await expect(page.locator('.dx-datagrid-filter-row td').nth(3)).toContainText('$1,000 - $5,000');

    await testScreenshot(page, 'datagrid_filtering_by_range_4_desktop.png');

    await filterMenuItem(3).hover();
    await overlayMenuItems.nth(7).click();
    await expect(page.locator('.dx-overlay-wrapper')).toHaveCount(0);

    await filterRowInput.click();
    await filterRowInput.pressSequentially('Harv Mudd');
    await expectOnlyRowsWith('Harv Mudd');

    await testScreenshot(page, 'datagrid_filtering_2_desktop.png');

    await filterMenuItem(4).hover();
    await expect(overlayMenuItems).toHaveCount(7);

    await testScreenshot(page, 'datagrid_filtering_3_desktop.png');

    await overlayMenuItems.nth(1).hover();
    await overlayMenuItems.nth(1).click();
    await expect(overlayMenuItems).toHaveCount(0);

    await testScreenshot(page, 'datagrid_filtering_4_desktop.png');

    // Selected operation does not contain twice(T195965)
    /* await t
        .hover(
          $('.dx-datagrid-filter-row')
          .find('.dx-menu-horizontal')
          .nth(4)')
          .find('.dx-menu-item')
          .nth(0)
        )
        .expect($('.dx-overlay-wrapper').find('.dx-menu-item').count).eql(7);

    await t
        .hover($('.dx-overlay-wrapper').find('.dx-menu-item').nth(1))
        .click($('.dx-overlay-wrapper').find('.dx-menu-item').nth(1))
        .expect($('.dx-overlay-wrapper').exists).notOk(); */

    await filterMenuItem(4).hover();
    await expect(overlayMenuItems).toHaveCount(7);

    await testScreenshot(page, 'datagrid_filtering_5_desktop.png');

    await overlayMenuItems.nth(6).click();

    await testScreenshot(page, 'datagrid_filtering_6_desktop.png');

    // The search panel is the TextBox element, not its input: click it and type into the focus.
    await page.locator('.dx-datagrid-search-panel').nth(0).click();
    await page.keyboard.type('Harv Mudd');
    await expectOnlyRowsWith('Harv Mudd');

    await testScreenshot(page, 'datagrid_filtering_7_desktop.png');

    await page.locator('.dx-datagrid-search-panel').locator('.dx-icon-clear').first().click();
    await page.locator('.dx-selectbox-container').first().click();
    await page.locator('.dx-list-item').nth(1).click();
    await filterRowInput.click();
    await filterRowInput.pressSequentially('Harv Mudd');

    await testScreenshot(page, 'datagrid_filtering_7_1_desktop.png');

    await page.locator('.dx-apply-button').first().click();
    await expectOnlyRowsWith('Harv Mudd');

    await testScreenshot(page, 'datagrid_filtering_8_desktop.png');

    // -------------Focus on filter row widgets-------------
    await gridInput.click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'datagrid_focus_on_filter_1_desktop.png');

    await page.keyboard.press('Tab');

    await testScreenshot(page, 'datagrid_focus_on_filter_2_desktop.png');

    await filterMenuItem(4).hover();
    await overlayMenuItems.nth(3).click();
    await gridInput.click();
    await page.keyboard.press('Tab');

    await testScreenshot(page, 'datagrid_focus_on_filter_3_desktop.png');
  });
});
