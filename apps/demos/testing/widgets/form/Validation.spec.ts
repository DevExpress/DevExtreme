import { test } from '@playwright/test';
import { describeManualTest, testScreenshot } from '../../../utils/visual-tests/playwright/manual-test';

const FIELD_BUTTON_ITEM_CLASS = '.dx-field-button-item';
const CHECKBOX_CLASS = '.dx-checkbox';

describeManualTest('Form', 'Validation', { width: 900, height: 1200 }, () => {
  test('Validation', async ({ page }) => {
    const body = page.locator('body');
    const box = await body.boundingBox();

    // TestCafe clicked at { offsetX: -5, offsetY: -5 }: five pixels in from the right bottom corner.
    await body.click({
      position: box ? { x: box.width - 5, y: box.height - 5 } : undefined,
    });

    await testScreenshot(page, 'form_validation_summary.png');

    await page.locator(FIELD_BUTTON_ITEM_CLASS).nth(1).click();
    await testScreenshot(page, 'form_validation_before_reset.png');

    await page.locator(CHECKBOX_CLASS).first().click();
    await page.locator(FIELD_BUTTON_ITEM_CLASS).nth(0).click();
    await testScreenshot(page, 'form_validation_after_reset.png');
  });
});
