import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const ITEM_TITLE_CLASS = 'dx-accordion-item-title';
const CHECKBOX_CLASS = 'dx-checkbox';

describeManualTest('Accordion', 'Overview', { width: 900, height: 900 }, () => {
  test('Custom Overview Appearance', async ({ page }) => {
    const itemTitles = page.locator(`.${ITEM_TITLE_CLASS}`);
    const checkBoxes = page.locator(`.${CHECKBOX_CLASS}`);

    await itemTitles.nth(1).click();

    await testScreenshot(page, 'accordion_overview_expanded_electronics.png');

    await itemTitles.nth(1).click();

    await testScreenshot(page, 'accordion_overview_collapsed_electronics_disabled_collapsible.png');

    await checkBoxes.nth(0).click();
    await checkBoxes.nth(1).click();
    await itemTitles.nth(1).click();

    await testScreenshot(page, 'accordion_overview_collapsed_electronics_enabled_multiple_and_collapsible.png');

    await itemTitles.nth(2).click();
    await itemTitles.nth(3).click();

    await testScreenshot(page, 'accordion_overview_expanded_ksmusic_and_tomsclub.png');
  });
});
