import { expect, test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const PIVOTGRID_FIELD_CHOOSER_BUTTON = 'dx-pivotgrid-field-chooser-button';
const TREEVIEW_SEARCH_FIELD = 'dx-treeview-search';
const TEXTEDITOR_INPUT = 'dx-texteditor-input';
const FIELD_CHOOSER_CONTENT = 'dx-popup-normal';

describeManualTest('PivotGrid', 'IntegratedFieldChooser', { width: 900, height: 800 }, () => {
  test('IntegratedFieldChooser', async ({ page }) => {
    const fieldChooserContent = page.locator(`.${FIELD_CHOOSER_CONTENT}`).first();

    await page.locator(`.${PIVOTGRID_FIELD_CHOOSER_BUTTON}`).first().click();
    // The field chooser fills the popup after it has been shown.
    await expect(fieldChooserContent.locator('.dx-treeview-node').first()).toBeVisible();

    await testScreenshot(page, 'Integrated field chooser.png', fieldChooserContent);

    const textEditorInput = page.locator(`.${TREEVIEW_SEARCH_FIELD} .${TEXTEDITOR_INPUT}`).first();
    await textEditorInput.click();
    await textEditorInput.pressSequentially('Product M');
    await expect(fieldChooserContent.locator('.dx-treeview-item').filter({ hasText: /^Product Model Lines$/ })).toBeVisible();

    await testScreenshot(page, 'Integrated field chooser after search of hierarchy field.png', fieldChooserContent);
  });
});
