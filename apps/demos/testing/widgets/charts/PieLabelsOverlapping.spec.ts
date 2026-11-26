import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

describeManualTest('Charts', 'PieResolveLabelOverlap', { width: 900, height: 600 }, () => {
  test('PieResolveLabelOverlap', async ({ page }) => {
    const showSelectBoxItems = () => page.locator('.options .dx-dropdowneditor-input-wrapper input.dx-texteditor-input').first().click();
    const selectItem = (index: number) => page.locator('.dx-dropdowneditor-overlay .dx-list-item-content').nth(index);

    await showSelectBoxItems();
    await selectItem(1).click();
    await testScreenshot(page, 'pie_resolve_labels_overlapping_hide.png');

    await showSelectBoxItems();
    await selectItem(2).click();
    await testScreenshot(page, 'pie_resolve_labels_overlapping_none.png');
  });
});
