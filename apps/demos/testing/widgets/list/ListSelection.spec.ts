import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const LIST_ITEM_CONTENT_CLASS = 'dx-list-item-content';
const CHECKBOX_ICON_CLASS = 'dx-checkbox-icon';
const SELECTBOX_CLASS = 'dx-selectbox';
const POPUP_WRAPPER_CLASS = 'dx-popup-wrapper';

describeManualTest('List', 'Selection', { width: 900, height: 1200 }, () => {
  test('Selection', async ({ page }) => {
    const optionsContainer = page.locator('.options');
    const selectAllCheckbox = optionsContainer.locator(`.${CHECKBOX_ICON_CLASS}`);
    const selectBox = page.locator(`.${SELECTBOX_CLASS}`).nth(0);
    const popupListItems = page.locator(`.${POPUP_WRAPPER_CLASS} .${LIST_ITEM_CONTENT_CLASS}`);

    await selectAllCheckbox.nth(0).click();

    await testScreenshot(page, 'List after change selectAll checkbox value.png');

    await page.locator(`.${LIST_ITEM_CONTENT_CLASS}`).nth(3).click();

    await testScreenshot(page, 'List after click on item, selectionMode=all.png');

    await selectBox.click();
    await popupListItems.nth(2).click();

    await testScreenshot(page, 'List after change selectionMode to multiple.png');

    await selectBox.click();
    await popupListItems.nth(1).click();

    await testScreenshot(page, 'List after change selectionMode to single.png');

    await selectBox.click();
    await popupListItems.nth(0).click();

    await testScreenshot(page, 'List after change selectionMode to none.png');
  });
});
