import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot, waitForSettled } from '../../../utils/visual-tests/playwright/manual-test';

const OPTION_CLASS = 'option';
const SELECTBOX_CLASS = 'dx-selectbox';
const SELECTBOX_POPUP_WRAPPER_CLASS = 'dx-selectbox-popup-wrapper';
const LIST_ITEM_CLASS = 'dx-list-item';
const TREEVIEW_NODE_CLASS = 'dx-treeview-node';
const CHECKBOX_CLASS = 'dx-checkbox';

describeManualTest('TreeView', 'ItemSelectionAndCustomization', { width: 900, height: 800 }, () => {
  test('Open select box', async ({ page }) => {
    await page.locator(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(0).click();

    await testScreenshot(page, 'treeview_selection_field_is_open.png');
  });

  test('Disabled Node Selection Mode', async ({ page }) => {
    const rootNodeCheckbox = page.locator(`.${TREEVIEW_NODE_CLASS} .${CHECKBOX_CLASS}`).nth(0);

    await rootNodeCheckbox.click();

    await testScreenshot(page, 'treeview_disabled_node_selection_mode_never.png');

    await rootNodeCheckbox.click();
    // A mode change while the tree still handles the click leaves it collapsed.
    await waitForSettled(page);
    await page.locator(`.${OPTION_CLASS} .${SELECTBOX_CLASS}`).nth(2).click();
    await page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}`).nth(1).click();
    // The new mode re-renders the tree; a click in the middle of it leaves the tree collapsed.
    await expect(page.locator(`.${SELECTBOX_POPUP_WRAPPER_CLASS} .${LIST_ITEM_CLASS}:visible`)).toHaveCount(0);
    await expect(page.locator('.dx-treeview-node-container-opened')).not.toHaveCount(0);

    await testScreenshot(page, 'treeview_disabled_node_selection_mode_recursive_and_all.png');

    await rootNodeCheckbox.click();

    await testScreenshot(page, 'treeview_disabled_node_selection_mode_select_all_children.png');
  });
});
